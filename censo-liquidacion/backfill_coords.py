#!/usr/bin/env python3
"""Backfill de coordenadas (0128): los prospectos YA cruzados con la DENUE
(el nombre del match vive en notas: «...») se re-consultan a la API solo para
traer Latitud/Longitud. No toca teléfono/correo — solo lat/lng vacíos."""
import json, re, time, urllib.request, urllib.parse
from enriquecer_censo import leer_env, normalizar
from enriquecer_censo_api import consultar_denue, a_candidato

url, key = leer_env("NEXT_PUBLIC_SUPABASE_URL"), leer_env("SUPABASE_SERVICE_ROLE_KEY")
token = leer_env("INEGI_TOKEN")

def api(m, r, c=None, extra=None):
    h={"apikey":key,"Authorization":f"Bearer {key}","Content-Type":"application/json"}
    h.update(extra or {})
    req=urllib.request.Request(f"{url}/rest/v1/{r}", data=json.dumps(c).encode() if c is not None else None, method=m, headers=h)
    crudo=urllib.request.urlopen(req, timeout=60).read()
    return json.loads(crudo) if crudo else None

filas = api("GET", "prospecto?select=id,empresa,notas&lat=is.null&notas=ilike.*DENUE*&limit=1000")
print(f"cruzados sin coords: {len(filas)}")
escritos = 0
for p in filas:
    m = re.search(r"DENUE[^«]*«([^»]+)»", p["notas"] or "")
    if not m: continue
    objetivo = normalizar(m.group(1))
    time.sleep(0.3)
    for e in consultar_denue(token, m.group(1), 6):
        c = a_candidato(e)
        if normalizar(c["nom_estab"]) == objetivo or normalizar(c["raz_social"]) == objetivo:
            try:
                la, lo = float(e.get("Latitud") or ""), float(e.get("Longitud") or "")
            except (TypeError, ValueError):
                continue
            if 14 <= la <= 33 and -119 <= lo <= -86:
                api("PATCH", f"prospecto?id=eq.{p['id']}", {"lat": la, "lng": lo}, {"Prefer":"return=minimal"})
                escritos += 1
            break
print(f"coords escritas: {escritos}")
