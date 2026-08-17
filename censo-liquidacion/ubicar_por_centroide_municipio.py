#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Segunda pasada de ubicación (17-ago) — para lo que el cruce por nombre
contra la API DENUE (geocodificar_canacar.py) no encontró con identidad
plena (2,591 de 2,630: el umbral estricto es correcto, no se baja).

En vez de inventar el centro de un municipio con una tabla externa, se
calcula desde datos YA REALES y YA VERIFICADOS que están en esta misma
base: el promedio de lat/lng de los establecimientos `fuente='denue'` que
comparten el mismo `ciudad` ("Municipio, Estado") normalizado — la DENUE
trae coordenadas reales de más de 29,000 negocios, así que casi todo
municipio con actividad de transporte ya tiene ancla propia.

Mismo criterio que `src/lib/likida/geo/ciudades.ts` (las coordenadas de la
ciudad para el mapa de viajes): precisión de MUNICIPIO, declarada como tal
en notas — nunca se presenta como la dirección exacta del domicilio, y un
municipio sin ningún ancla DENUE se queda sin punto (no se inventa).

Uso:
  python3 ubicar_por_centroide_municipio.py --aplicar
"""
import argparse
import json
import sys
import urllib.request
from collections import defaultdict

from enriquecer_censo import leer_env, normalizar


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


def traer_todo(url, key, ruta_select):
    filas, desde = [], 0
    while True:
        pagina = api(url, key, "GET", f"{ruta_select}&order=id&limit=1000&offset={desde}")
        filas.extend(pagina)
        if len(pagina) < 1000:
            break
        desde += 1000
    return filas


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--aplicar", action="store_true")
    ap.add_argument("--min-anclas", type=int, default=1)
    args = ap.parse_args()

    url, key = leer_env("NEXT_PUBLIC_SUPABASE_URL"), leer_env("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        sys.exit("faltan credenciales")

    print("trayendo anclas DENUE (lat/lng reales, paginado)…")
    anclas_denue = traer_todo(
        url, key,
        "prospecto?select=ciudad,lat,lng&fuente=eq.denue&lat=not.is.null&ciudad=not.is.null",
    )
    print(f"anclas DENUE con coords: {len(anclas_denue)}")

    centroides = defaultdict(lambda: [0.0, 0.0, 0])
    for a in anclas_denue:
        k = normalizar(a["ciudad"])
        if not k:
            continue
        c = centroides[k]
        c[0] += a["lat"]; c[1] += a["lng"]; c[2] += 1
    tabla = {k: (v[0] / v[2], v[1] / v[2], v[2]) for k, v in centroides.items() if v[2] >= args.min_anclas}
    print(f"municipios con centroide calculable: {len(tabla)}")

    objetivo = traer_todo(
        url, key,
        "prospecto?select=id,empresa,ciudad,notas&fuente=eq.canacar&lat=is.null",
    )
    print(f"canacar sin coords todavía: {len(objetivo)}")

    escritos, sin_ancla = 0, 0
    for p in objetivo:
        k = normalizar(p.get("ciudad") or "")
        if not k or k not in tabla:
            sin_ancla += 1
            continue
        lat, lng, n = tabla[k]
        if not (14 <= lat <= 33 and -119 <= lng <= -86):
            sin_ancla += 1
            continue
        if args.aplicar:
            nota = (f"Ubicación aproximada 17-ago: centroide de {n} establecimiento"
                    f"{'s' if n != 1 else ''} DENUE en {p['ciudad']} — no es la dirección "
                    f"exacta del domicilio (precisión de municipio, como ciudades.ts).")
            previas = (p.get("notas") or "").strip()
            api(url, key, "PATCH", f"prospecto?id=eq.{p['id']}",
                {"lat": lat, "lng": lng, "notas": (previas + "\n" if previas else "") + nota},
                {"Prefer": "return=minimal"})
        escritos += 1

    print(f"ubicadas por centroide de municipio: {escritos} · sin ancla DENUE en su municipio: {sin_ancla}")


if __name__ == "__main__":
    main()
