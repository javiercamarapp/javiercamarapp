#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Cargador censo → prospecto (Supabase). El hueco que quedó del 14-ago: el
cazador escribe al xlsx todos los días a las 07:00, pero nadie subía lo nuevo
a la base — la base se quedó en la foto del 14-ago (828) mientras el xlsx
creció. Este script SINCRONIZA: agrupa las hojas «Señal» por empresa, deduce
contra lo que ya está en `prospecto` (nombre normalizado) e inserta SOLO lo
nuevo. Jamás toca filas existentes.

Uso:
  python3 subir_censo.py            # dry-run: reporta qué subiría
  python3 subir_censo.py --aplicar  # inserta

Fuentes: censo_liquidacion_indeed.xlsx y censo_yucatan.xlsx (hoja Señal).
Credenciales: likida/.env.local (mismo criterio que enriquecer_censo.py).
"""
import argparse
import json
import sys
import urllib.request
from collections import defaultdict

import openpyxl

from enriquecer_censo import leer_env, normalizar

FUENTES = [
    ("censo_liquidacion_indeed.xlsx", "Señal"),
    ("censo_yucatan.xlsx", "Señal"),
]


def filas_de(ruta, hoja):
    wb = openpyxl.load_workbook(ruta, read_only=True)
    ws = wb[hoja]
    it = ws.iter_rows(values_only=True)
    encabezado = [str(c or "").strip() for c in next(it)]
    idx = {n: i for i, n in enumerate(encabezado)}
    for r in it:
        if not r or not r[idx.get("Empresa", 0)]:
            continue
        def col(nombre):
            i = idx.get(nombre)
            return (str(r[i]).strip() if i is not None and r[i] is not None else "")
        yield {
            "empresa": col("Empresa"),
            "titulo": col("Título del puesto"),
            "ciudad": col("Ciudad"),
            "estado": col("Estado"),
            "senales": col("Palabras de señal"),
            "liga": col("Liga"),
            "fecha": col("Fecha publicación"),
            "plaza": col("Plaza de búsqueda"),
        }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--aplicar", action="store_true")
    args = ap.parse_args()

    url, key = leer_env("NEXT_PUBLIC_SUPABASE_URL"), leer_env("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        sys.exit("faltan credenciales en likida/.env.local")

    def api(metodo, ruta, cuerpo=None, extra=None):
        h = {"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"}
        h.update(extra or {})
        req = urllib.request.Request(f"{url}/rest/v1/{ruta}",
                                     data=json.dumps(cuerpo).encode() if cuerpo is not None else None,
                                     method=metodo, headers=h)
        crudo = urllib.request.urlopen(req, timeout=60).read()
        return json.loads(crudo) if crudo else None

    existentes = api("GET", "prospecto?select=empresa&limit=3000")
    ya = {normalizar(p["empresa"]) for p in existentes}
    print(f"en la base: {len(existentes)} prospectos")

    # Agrupar el xlsx por empresa (varios anuncios = un prospecto).
    grupos = defaultdict(list)
    for ruta, hoja in FUENTES:
        try:
            for f in filas_de(ruta, hoja):
                grupos[normalizar(f["empresa"])].append(f)
        except FileNotFoundError:
            print(f"aviso: no existe {ruta} — se salta", file=sys.stderr)

    # Artefactos del scraper que NO son empresas: placeholders de bolsas y
    # reclutadoras. Un "prospecto" llamado "Confidencial" solo ensucia la
    # cartera y el redactor jamás podría personalizarle nada.
    RUIDO = ("confidencial", "reclutamiento", "reclutadora", "agencia de",
             "empleo destacado", "postulado", "bolsa de trabajo", "empresa lider",
             "empresa líder", "importante empresa")
    nuevos = []
    for norm, anuncios in grupos.items():
        if not norm or norm in ya:
            continue
        if any(r in norm for r in RUIDO):
            continue
        a0 = anuncios[0]
        senales = sorted({s.strip() for f in anuncios for s in f["senales"].split(",") if s.strip()})
        titulos = {f["titulo"] for f in anuncios if f["titulo"]}
        # El mismo criterio del censo original: la vacante que NOMBRA la
        # liquidación es dolor directo; lo demás es señal del giro.
        directo = any("liquida" in (t or "").lower() for t in titulos) or any(
            "liquida" in f["senales"].lower() for f in anuncios)
        cabeza = ("DOLOR DIRECTO: la vacante nombra la liquidación"
                  if directo else f"SEÑAL DEL GIRO: {a0['titulo'] or 'vacante relacionada'}")
        ciudad = ", ".join(x for x in (a0["ciudad"], a0["estado"]) if x) or a0["plaza"] or None
        nota = (f"{cabeza} · {len(anuncios)} anuncio{'s' if len(anuncios) > 1 else ''} en el censo"
                f" · señal: {', '.join(senales[:6]) or '—'}"
                + (f" · último anuncio: {a0['fecha']}" if a0["fecha"] else "")
                + (f" · liga: {a0['liga']}" if a0["liga"] else ""))
        nuevos.append({
            "empresa": a0["empresa"][:200],
            "ciudad": ciudad,
            "vacante": (a0["titulo"] or None),
            "fuente": "censo",
            "notas": nota[:1500],
        })

    directos = sum(1 for n in nuevos if n["notas"].startswith("DOLOR"))
    print(f"nuevos a subir: {len(nuevos)} (dolor directo: {directos}, señal de giro: {len(nuevos) - directos})")
    for n in nuevos[:8]:
        print("  ·", n["empresa"][:40], "—", (n["vacante"] or "")[:36])

    if args.aplicar and nuevos:
        for i in range(0, len(nuevos), 100):
            api("POST", "prospecto", nuevos[i:i + 100], {"Prefer": "return=minimal"})
        print(f"insertados: {len(nuevos)}")


if __name__ == "__main__":
    main()
