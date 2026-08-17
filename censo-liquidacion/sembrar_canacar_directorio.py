#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
El directorio de socios de CANACAR (Cámara Nacional del Autotransporte de
Carga) → prospecto (17-ago-2026, orden de Javier: carga canacar.xlsx a la
base, al mapa, a todo el conocimiento).

Es un padrón gremial estructurado y limpio — nombre, categoría (giro),
rango de empleados, domicilio completo y contacto (tel/correo) de cada
socio — MUCHO más completo que la muestra `MUESTRA CANACAR (Scribd, padrón
gremial)` de 41 filas ya sembrada el 17-ago temprano (esa venía de un PDF
raspado con la razón social y el nombre del contacto pegados sin separador;
esta es la fuente oficial). Ambas quedan con `fuente='canacar'`: son la
misma cámara, y el dedupe por nombre normalizado ya evita chocar entradas.

Mismo contrato que sembrar_denue_universo.py:
  · dedupe por nombre normalizado, contra TODA la base (paginado — PostgREST
    recorta a 1,000 en silencio) y dentro del propio lote;
  · CANACAR trae una fila POR SUCURSAL (una empresa grande aparece 100+
    veces con la misma razón social) — se colapsa a UNA fila por empresa,
    quedándose con la sucursal más completa (tel+correo > tel > correo >
    la primera), y el conteo de sucursales queda citado en notas;
  · jamás toca una fila que ya existe.

Uso:
  python3 sembrar_canacar_directorio.py            # dry-run
  python3 sembrar_canacar_directorio.py --aplicar
"""
import argparse
import json
import sys
import urllib.request
from collections import defaultdict

import openpyxl

from enriquecer_censo import leer_env, normalizar

RUTA_XLSX = "/Users/javiercamaraportepetit/Downloads/canacar.xlsx"
FUENTE = "canacar"


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


def leer_filas(ruta):
    wb = openpyxl.load_workbook(ruta, data_only=True)
    ws = wb["Hoja1"]
    filas = []
    for r in ws.iter_rows(min_row=2, values_only=True):
        if not r or not r[1]:
            continue
        nombre = str(r[1]).strip()
        categoria = (str(r[2]).strip() if r[2] else "")
        num_emp = (str(r[3]).strip() if r[3] else "")
        domicilio = (str(r[4]).strip() if r[4] else "")
        colonia = (str(r[5]).strip() if r[5] else "")
        cp = (str(int(r[6])) if isinstance(r[6], (int, float)) else (str(r[6]).strip() if r[6] else ""))
        municipio = (str(r[7]).strip() if r[7] else "")
        estado = (str(r[8]).strip() if r[8] else "")
        tel_raw = r[9]
        telefono = "".join(c for c in str(tel_raw) if c.isdigit()) if tel_raw else ""
        correo = (str(r[10]).strip().lower() if r[10] else "")
        filas.append({
            "nombre": nombre, "categoria": categoria, "num_emp": num_emp,
            "domicilio": domicilio, "colonia": colonia, "cp": cp,
            "municipio": municipio, "estado": estado,
            "telefono": telefono or None, "correo": correo or None,
        })
    return filas


def completitud(f):
    """Para elegir la sucursal representativa: más contacto gana."""
    return (bool(f["telefono"]) and bool(f["correo"]), bool(f["telefono"]) or bool(f["correo"]))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--aplicar", action="store_true")
    args = ap.parse_args()

    url, key = leer_env("NEXT_PUBLIC_SUPABASE_URL"), leer_env("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        sys.exit("faltan credenciales en likida/.env.local")

    # ── Dedupe contra TODA la base — paginado a propósito (PostgREST 1,000) ──
    existentes, desde = [], 0
    while True:
        pagina = api(url, key, "GET", f"prospecto?select=empresa&order=id&limit=1000&offset={desde}")
        existentes.extend(pagina)
        if len(pagina) < 1000:
            break
        desde += 1000
    ya = {normalizar(p["empresa"]) for p in existentes}
    print(f"en la base (todas las fuentes): {len(existentes)}")

    filas = leer_filas(RUTA_XLSX)
    print(f"filas en canacar.xlsx: {len(filas)}")

    # ── Colapsa sucursales de la misma empresa a UNA fila ──────────────────
    por_norm = defaultdict(list)
    for f in filas:
        por_norm[normalizar(f["nombre"])].append(f)

    nuevos = []
    saltados_ya_en_base = 0
    for norm, grupo in por_norm.items():
        if not norm or norm in ya:
            saltados_ya_en_base += 1
            continue
        mejor = max(grupo, key=completitud)
        n_sucursales = len(grupo)
        nota = f"CANACAR (directorio de socios) 17-ago-2026: {mejor['categoria']}"
        if mejor["num_emp"]:
            nota += f" · {mejor['num_emp']} personas"
        domicilio_completo = ", ".join(x for x in [mejor["domicilio"], mejor["colonia"]] if x)
        if domicilio_completo:
            nota += f" · {domicilio_completo}"
        if mejor["cp"]:
            nota += f", CP {mejor['cp']}"
        if n_sucursales > 1:
            otras = sorted({f"{g['municipio']}, {g['estado']}" for g in grupo if g is not mejor})
            nota += f" · {n_sucursales} sucursales registradas en CANACAR"
            if otras:
                nota += " (" + "; ".join(otras[:8]) + (", …" if len(otras) > 8 else "") + ")"
        ciudad = f"{mejor['municipio']}, {mejor['estado']}".strip(", ") or None
        nuevos.append({
            "empresa": mejor["nombre"][:200],
            "ciudad": ciudad,
            "fuente": FUENTE,
            "telefono": mejor["telefono"],
            "correo": mejor["correo"],
            "notas": nota[:1500],
        })

    con_tel = sum(1 for n in nuevos if n["telefono"])
    con_correo = sum(1 for n in nuevos if n["correo"])
    print(f"empresas únicas en el archivo: {len(por_norm)}")
    print(f"ya en la base (se saltan): {saltados_ya_en_base}")
    print(f"a sembrar: {len(nuevos)} (tel: {con_tel}, correo: {con_correo})")
    for n in nuevos[:8]:
        print("  ·", n["empresa"][:55], "—", n["ciudad"])

    if args.aplicar and nuevos:
        for i in range(0, len(nuevos), 200):
            api(url, key, "POST", "prospecto", nuevos[i:i + 200], {"Prefer": "return=minimal"})
            print(f"  sembrado lote {i}-{i+len(nuevos[i:i+200])}")
        print(f"sembrados: {len(nuevos)}")


if __name__ == "__main__":
    main()
