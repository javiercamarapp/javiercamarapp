#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ubica en el mapa a los prospectos `fuente='canacar'` sin lat/lng — mismo
mecanismo que backfill_coords.py / enriquecer_censo_api.py (0128: "la DENUE
ya traía las coordenadas"), pero CANACAR no las trae, así que se cruza cada
empresa contra la API DENUE por nombre + municipio/entidad y, si hay
identidad de ALTA confianza, se toma su lat/lng real.

Sin match de alta confianza → la fila se queda sin lat/lng, a propósito
(0128: "un prospecto sin cruce no tiene punto y el mapa lo dice"). Jamás se
inventa una coordenada de municipio genérica: sería precisión falsa sobre
una fila que dice venir de un cruce real.

Uso:
  python3 geocodificar_canacar.py --tope 3000 --aplicar
"""
import argparse
import json
import sys
import time
import urllib.request

from enriquecer_censo import leer_env, normalizar, tokens_ancla, puntuar, partir_ciudad
from enriquecer_censo_api import consultar_denue, a_candidato


def api(url, key, m, r, c=None, extra=None):
    h = {"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    h.update(extra or {})
    req = urllib.request.Request(
        f"{url}/rest/v1/{r}",
        data=json.dumps(c).encode() if c is not None else None,
        method=m, headers=h,
    )
    crudo = urllib.request.urlopen(req, timeout=120).read()
    return json.loads(crudo) if crudo else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--aplicar", action="store_true")
    ap.add_argument("--tope", type=int, default=3000)
    args = ap.parse_args()

    url, key = leer_env("NEXT_PUBLIC_SUPABASE_URL"), leer_env("SUPABASE_SERVICE_ROLE_KEY")
    token = leer_env("INEGI_TOKEN")
    if not (url and key and token):
        sys.exit("faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / INEGI_TOKEN")

    objetivo, desde = [], 0
    while True:
        pagina = api(url, key, "GET",
            f"prospecto?select=id,empresa,ciudad,telefono,correo,notas&fuente=eq.canacar&lat=is.null&order=id&limit=1000&offset={desde}")
        objetivo.extend(pagina)
        if len(pagina) < 1000:
            break
        desde += 1000
    print(f"canacar sin coords: {len(objetivo)}")

    escritos, consultas, sin_match = 0, 0, 0
    for i, p in enumerate(objetivo):
        if consultas >= args.tope:
            print(f"tope de {args.tope} consultas alcanzado en la fila {i} — el resto queda para otra corrida")
            break
        anclas = tokens_ancla(p["empresa"])
        if not anclas:
            sin_match += 1
            continue
        consultas += 1
        time.sleep(0.35)
        candidatos = [a_candidato(e) for e in consultar_denue(token, p["empresa"])]
        if not candidatos:
            sin_match += 1
            continue
        mun_p, ent_p = partir_ciudad(p.get("ciudad") or "")
        mejor, mejor_score, mejor_ciudad = None, 0.0, None
        for c in candidatos:
            score, ciudad = puntuar(p["empresa"], c, mun_p, ent_p)
            llave = (score, ciudad is True, bool(c["lat"]))
            if mejor is None or llave > (mejor_score, mejor_ciudad is True, bool(mejor.get("lat"))):
                mejor, mejor_score, mejor_ciudad = c, score, ciudad
        n_anclas = len(anclas)
        # Mismo umbral ALTA que enriquecer_censo_api.py: identidad plena.
        if not (mejor_score >= 1.0 and mejor_ciudad is not False and (n_anclas >= 2 or mejor_ciudad is True)):
            sin_match += 1
            continue
        try:
            la, lo = float(mejor.get("lat") or ""), float(mejor.get("lng") or "")
        except (TypeError, ValueError):
            sin_match += 1
            continue
        if not (14 <= la <= 33 and -119 <= lo <= -86):
            sin_match += 1
            continue

        if args.aplicar:
            cambios = {"lat": la, "lng": lo}
            if mejor["telefono"] and not p.get("telefono"):
                cambios["telefono"] = mejor["telefono"]
            if mejor["correo"] and not p.get("correo"):
                cambios["correo"] = mejor["correo"]
            nota = f"DENUE API 17-ago (cruce CANACAR→DENUE): «{mejor['nom_estab']}», score {round(mejor_score, 2)}"
            previas = (p.get("notas") or "").strip()
            cambios["notas"] = (previas + "\n" if previas else "") + nota
            api(url, key, "PATCH", f"prospecto?id=eq.{p['id']}", cambios, {"Prefer": "return=minimal"})
        escritos += 1
        if escritos % 50 == 0:
            print(f"  … {escritos} ubicadas de {consultas} consultas ({i+1}/{len(objetivo)} revisadas)")

    print(f"consultas: {consultas} · ubicadas: {escritos} · sin match de alta confianza: {sin_match}")


if __name__ == "__main__":
    main()
