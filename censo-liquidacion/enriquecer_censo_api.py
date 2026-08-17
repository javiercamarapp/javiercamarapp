#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Etapa 2 del enriquecedor: la API DENUE (INEGI) para lo que el CSV masivo no
cruzó. Misma calibración y misma regla que la etapa 1 (enriquecer_censo.py):
solo identidad plena escribe, solo llena huecos, procedencia en notas.

La API busca por texto en TODA la DENUE (no solo 3 sectores), así que cubre
giros que el masivo no traía. Peculiaridad conocida: el servidor contesta
`HTTP/1.1 000` a tokens inválidos y a veces le choca urllib — se llama vía
curl (--http1.1 + UA de navegador), que ya se probó contra este endpoint.

Uso:
  python3 enriquecer_censo_api.py            # dry-run
  python3 enriquecer_censo_api.py --aplicar

Token: INEGI_TOKEN en likida/.env.local (registro gratuito de Javier, 17-ago).
"""
import argparse
import json
import subprocess
import sys
import time
import urllib.parse
import urllib.request

from enriquecer_censo import leer_env, normalizar, tokens_ancla, puntuar, partir_ciudad

API = "https://www.inegi.org.mx/app/api/denue/v1/consulta/BuscarEntidad"


def consultar_denue(token, texto, max_res=8):
    q = urllib.parse.quote(texto[:80], safe="")
    url = f"{API}/{q}/00/1/{max_res}/{token}"
    r = subprocess.run(
        ["curl", "-sS", "-m", "15", "--http1.1", "-A", "Mozilla/5.0", url],
        capture_output=True, text=True, timeout=25)
    crudo = (r.stdout or "").strip()
    if not crudo.startswith("["):
        return []  # sin resultados la API contesta un error plano — no es fallo
    try:
        return json.loads(crudo)
    except json.JSONDecodeError:
        return []


def a_candidato(e):
    """La API usa otras llaves que el CSV masivo — se mapean al mismo shape
    que espera `puntuar` de la etapa 1."""
    ubic = (e.get("Ubicacion") or "")
    partes = [p.strip() for p in ubic.split(",") if p.strip()]
    return {
        "nom_estab": e.get("Nombre") or "",
        "raz_social": e.get("Razon_social") or "",
        "telefono": "".join(c for c in (e.get("Telefono") or "") if c.isdigit()),
        "correo": (e.get("Correo_e") or e.get("Correo_electronico") or "").strip().lower(),
        "www": (e.get("Sitio_internet") or "").strip().lower(),
        "municipio": partes[-2] if len(partes) >= 2 else (partes[0] if partes else ""),
        "entidad": partes[-1] if partes else "",
        "actividad": e.get("Clase_actividad") or "",
        "per_ocu": e.get("Estrato") or "",
        "lat": e.get("Latitud"), "lng": e.get("Longitud"),
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--aplicar", action="store_true")
    ap.add_argument("--tope", type=int, default=700, help="máximo de consultas a la API")
    args = ap.parse_args()

    url, key = leer_env("NEXT_PUBLIC_SUPABASE_URL"), leer_env("SUPABASE_SERVICE_ROLE_KEY")
    token = leer_env("INEGI_TOKEN")
    if not (url and key and token):
        sys.exit("faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / INEGI_TOKEN en likida/.env.local")

    def api(metodo, ruta, cuerpo=None, extra=None):
        h = {"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"}
        h.update(extra or {})
        req = urllib.request.Request(f"{url}/rest/v1/{ruta}",
                                     data=json.dumps(cuerpo).encode() if cuerpo is not None else None,
                                     method=metodo, headers=h)
        crudo = urllib.request.urlopen(req, timeout=60).read()
        return json.loads(crudo) if crudo else None

    objetivo = api("GET", "prospecto?select=id,empresa,ciudad,telefono,correo,notas&telefono=is.null&order=empresa&limit=2000")
    print(f"sin teléfono: {len(objetivo)}")

    escritos, altas, medias = 0, [], []
    consultas = 0
    for p in objetivo:
        if consultas >= args.tope:
            print(f"tope de {args.tope} consultas alcanzado — el resto queda para otra corrida")
            break
        anclas = tokens_ancla(p["empresa"])
        if not anclas:
            continue
        consultas += 1
        time.sleep(0.35)  # cortesía con INEGI
        candidatos = [a_candidato(e) for e in consultar_denue(token, p["empresa"])]
        candidatos = [c for c in candidatos if c["telefono"] or c["correo"] or c["www"]]
        if not candidatos:
            continue
        mun_p, ent_p = partir_ciudad(p.get("ciudad") or "")
        mejor, mejor_score, mejor_ciudad = None, 0.0, None
        for c in candidatos:
            score, ciudad = puntuar(p["empresa"], c, mun_p, ent_p)
            if mejor is None or (score, ciudad is True, bool(c["telefono"])) > (mejor_score, mejor_ciudad is True, bool(mejor["telefono"])):
                mejor, mejor_score, mejor_ciudad = c, score, ciudad
        n_anclas = len(anclas)
        if mejor_score >= 1.0 and mejor_ciudad is not False and (n_anclas >= 2 or mejor_ciudad is True):
            altas.append((p, mejor, mejor_score))
        elif mejor_score >= 0.80:
            medias.append((p, mejor, mejor_score))

    print(f"consultas: {consultas} · ALTA: {len(altas)} · MEDIA: {len(medias)}")
    for p, m, s in altas[:10]:
        print(f"  {s:.2f} | {p['empresa'][:36]:36} → {m['nom_estab'][:30]:30} tel:{m['telefono'][:12]}")

    with open("censo_enriquecido_api_media.csv", "w") as f:
        f.write("empresa,match,razon_social,score,telefono,correo,www,municipio\n")
        for p, m, s in medias:
            f.write(",".join('"' + str(x).replace('"', "'") + '"' for x in
                             [p["empresa"], m["nom_estab"], m["raz_social"], s,
                              m["telefono"], m["correo"], m["www"], m["municipio"]]) + "\n")

    if args.aplicar:
        for p, m, s in altas:
            cambios = {}
            if m["telefono"] and not p.get("telefono"):
                cambios["telefono"] = m["telefono"]
            if m["correo"] and not p.get("correo"):
                cambios["correo"] = m["correo"]
            try:
                la, lo = float(m.get("lat") or ""), float(m.get("lng") or "")
                if 14 <= la <= 33 and -119 <= lo <= -86:
                    cambios["lat"], cambios["lng"] = la, lo
            except (TypeError, ValueError):
                pass
            if not cambios:
                continue
            nota = (f"DENUE API 17-ago: «{m['nom_estab']}» ({m['municipio']}, {m['entidad']}), "
                    f"score {round(s, 2)}" + (f", sitio: {m['www']}" if m["www"] else ""))
            previas = (p.get("notas") or "").strip()
            cambios["notas"] = (previas + "\n" if previas else "") + nota
            api("PATCH", f"prospecto?id=eq.{p['id']}", cambios, {"Prefer": "return=minimal"})
            escritos += 1
        print(f"escritos (solo ALTA, solo huecos): {escritos}")


if __name__ == "__main__":
    main()
