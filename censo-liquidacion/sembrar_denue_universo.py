#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
El UNIVERSO transportista → prospecto (17-ago-2026, orden de Javier:
"encontrar clientes transportistas de todo tipo, el contacto, todo").

La DENUE ya es el 'Google Maps scraper' legal y gratis: nombre, teléfono,
correo, dirección, coordenadas y tamaño de TODOS los autotransportistas de
carga del país. Este script siembra el segmento flota real (31+ personas
ocupadas — códigos 4841 carga general y 4842 especializada) como prospectos
`fuente='denue'`:

  · censo  = DEMANDA (publicaron la vacante — urgencia alta)
  · denue  = UNIVERSO (existen y son alcanzables — urgencia baja, se
             distinguen solos en el Cerebro por el score)

Dedupe por nombre normalizado contra TODO lo existente y dentro del lote.
Jamás toca filas existentes.

Uso:
  python3 sembrar_denue_universo.py            # dry-run
  python3 sembrar_denue_universo.py --aplicar
"""
import argparse
import csv
import json
import sys
import urllib.request

from enriquecer_censo import leer_env, normalizar

BASE_DENUE = ("/private/tmp/claude-501/-Users-javiercamaraportepetit/"
              "7b8203e5-d48d-448a-aa64-6e6a56de65e7/scratchpad/denue/")
# El TAM por categoría (orden del 17-ago: "todo mi TAM ahí metido"): cada
# fuente CSV con sus prefijos SCIAN. Todos filtrados a 31+ personas — el
# establecimiento chico no tiene flota que liquidar.
# Cada sector con SU corte de tamaño (17-ago, ronda 2 — "consigue más"):
# el transportista de 11-30 personas es una flota real de 5-15 unidades y
# es EL comprador natural de $35/viaje; el mayorista chico no.
GRANDES = {"31 a 50 personas", "51 a 100 personas", "101 a 250 personas", "251 y más personas"}
MEDIANOS = {"11 a 30 personas"} | GRANDES
# None de estratos = SIN corte de tamaño (orden 17-ago: "los 46 mil
# completos" — hasta el hombre-camión). El prefijo vacío atrapa todo el
# archivo: 48-49 solo contiene su propio sector.
SECTORES = [
    (BASE_DENUE + "conjunto_de_datos/denue_inegi_48-49_.csv", ("",), None),                 # transporte y almacenamiento COMPLETO
    (BASE_DENUE + "s43/conjunto_de_datos/denue_inegi_43_.csv", ("4311", "4312"), GRANDES),  # abarrotes/alimentos y bebidas mayoreo
    (BASE_DENUE + "s3133/conjunto_de_datos/denue_inegi_31-33_.csv", ("3121",), GRANDES),    # embotelladoras
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--aplicar", action="store_true")
    ap.add_argument("--csv", default=None, help="un solo CSV (anula SECTORES)")
    args = ap.parse_args()

    url, key = leer_env("NEXT_PUBLIC_SUPABASE_URL"), leer_env("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        sys.exit("faltan credenciales en likida/.env.local")

    def api(m, r, c=None, extra=None):
        h = {"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"}
        h.update(extra or {})
        req = urllib.request.Request(f"{url}/rest/v1/{r}",
                                     data=json.dumps(c).encode() if c is not None else None,
                                     method=m, headers=h)
        crudo = urllib.request.urlopen(req, timeout=120).read()
        return json.loads(crudo) if crudo else None

    # PostgREST recorta a 1,000 filas EN SILENCIO (la trampa documentada en
    # el CLAUDE.md de likida): el dedupe se pagina hasta vaciar, o quedaría
    # ciego a todo lo que esté después de la primera página.
    existentes, desde = [], 0
    while True:
        pagina = api("GET", f"prospecto?select=empresa&order=id&limit=1000&offset={desde}")
        existentes.extend(pagina)
        if len(pagina) < 1000:
            break
        desde += 1000
    ya = {normalizar(p["empresa"]) for p in existentes}
    print(f"en la base: {len(existentes)}")

    fuentes = [(args.csv, ("",), None)] if args.csv else SECTORES
    nuevos, vistos = [], set()
    filas_csv = []
    for ruta, prefijos, estratos in fuentes:
        for r in csv.DictReader(open(ruta, encoding="latin-1")):
            act = r.get("codigo_act", "")
            if any(act.startswith(p) for p in prefijos) and (estratos is None or r.get("per_ocu", "").strip() in estratos):
                filas_csv.append(r)
    for r in filas_csv:
        nombre = (r.get("raz_social") or "").strip() or (r.get("nom_estab") or "").strip()
        norm = normalizar(nombre)
        if not norm or norm in ya or norm in vistos:
            continue
        vistos.add(norm)
        tel = "".join(c for c in (r.get("telefono") or "") if c.isdigit()) or None
        correo = (r.get("correoelec") or "").strip().lower() or None
        www = (r.get("www") or "").strip().lower()
        try:
            lat, lng = float(r["latitud"]), float(r["longitud"])
            if not (14 <= lat <= 33 and -119 <= lng <= -86):
                lat = lng = None
        except (KeyError, ValueError):
            lat = lng = None
        nota = (f"UNIVERSO DENUE 05/2026: {r.get('nombre_act', '')} · {r.get('per_ocu', '')}"
                + (f" · sitio: {www}" if www else "")
                + (f" · establecimiento: {r.get('nom_estab', '')}" if (r.get('raz_social') or '').strip() else ""))
        # OJO PostgREST: el insert masivo exige que TODAS las filas traigan
        # LAS MISMAS llaves — los huecos van como null explícito, no se quitan.
        nuevos.append({
            "empresa": nombre[:200],
            "ciudad": f"{r.get('municipio', '')}, {r.get('entidad', '')}".strip(", ") or None,
            "fuente": "denue",
            "telefono": tel,
            "correo": correo,
            "lat": lat,
            "lng": lng,
            "notas": nota[:1200],
        })

    con_tel = sum(1 for n in nuevos if "telefono" in n)
    con_geo = sum(1 for n in nuevos if "lat" in n)
    print(f"a sembrar: {len(nuevos)} (tel: {con_tel}, coords: {con_geo})")
    for n in nuevos[:6]:
        print("  ·", n["empresa"][:48], "—", n.get("ciudad", ""))

    if args.aplicar and nuevos:
        for i in range(0, len(nuevos), 200):
            api("POST", "prospecto", nuevos[i:i + 200], {"Prefer": "return=minimal"})
        print(f"sembrados: {len(nuevos)}")


if __name__ == "__main__":
    main()
