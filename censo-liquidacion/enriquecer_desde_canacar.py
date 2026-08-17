#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Segunda pasada sobre canacar.xlsx (17-ago, orden de Javier: "cuántos
números y correos ya teníamos y cuántos nuevos, y ponlos en el Cerebro con
toda su información") — las 290 empresas que YA estaban en la base (por
eso `sembrar_canacar_directorio.py` las saltó al sembrar filas nuevas)
pueden tener teléfono/correo en CANACAR que la fila existente no tiene.

Mismo contrato que enriquecer_censo.py: SOLO llena huecos, JAMÁS pisa un
dato que ya existe, procedencia siempre citada en notas.

Uso:
  python3 enriquecer_desde_canacar.py            # dry-run con el conteo
  python3 enriquecer_desde_canacar.py --aplicar
"""
import argparse
import sys
from collections import defaultdict

from enriquecer_censo import leer_env, normalizar
from sembrar_canacar_directorio import leer_filas, RUTA_XLSX, api, completitud


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--aplicar", action="store_true")
    args = ap.parse_args()

    url, key = leer_env("NEXT_PUBLIC_SUPABASE_URL"), leer_env("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        sys.exit("faltan credenciales")

    # ── La base ANTES de este archivo: TODO menos fuente=canacar, porque los
    # 2,589 con fuente=canacar YA los sembró sembrar_canacar_directorio.py
    # CON los datos de este mismo archivo — comparar contra ellos se
    # respondería a sí mismo y el conteo de "ya teníamos" saldría inflado.
    existentes, desde = [], 0
    while True:
        pagina = api(url, key, "GET",
            f"prospecto?select=id,empresa,fuente,telefono,correo,notas&fuente=neq.canacar&order=id&limit=1000&offset={desde}")
        existentes.extend(pagina)
        if len(pagina) < 1000:
            break
        desde += 1000
    por_norm_existente = {}
    for p in existentes:
        por_norm_existente.setdefault(normalizar(p["empresa"]), p)  # primera ocurrencia
    print(f"en la base ANTES de CANACAR (todas las demás fuentes): {len(existentes)} filas, {len(por_norm_existente)} nombres únicos")

    # ── canacar.xlsx colapsado por empresa (misma lógica que el sembrador) ──
    filas = leer_filas(RUTA_XLSX)
    por_norm_canacar = defaultdict(list)
    for f in filas:
        por_norm_canacar[normalizar(f["nombre"])].append(f)
    print(f"empresas únicas en canacar.xlsx: {len(por_norm_canacar)}")

    # ── Clasifica cada empresa del archivo ──────────────────────────────────
    ya_nueva = 0          # no estaba en la base → sembrada por el script anterior
    ya_existia_con_tel = ya_existia_con_correo = 0
    ya_existia_sin_tel_canacar_aporta = ya_existia_sin_correo_canacar_aporta = 0
    ya_existia_sin_tel_canacar_tampoco = ya_existia_sin_correo_canacar_tampoco = 0
    a_enriquecer = []

    for norm, grupo in por_norm_canacar.items():
        if not norm:
            continue
        existente = por_norm_existente.get(norm)
        if existente is None:
            ya_nueva += 1
            continue
        mejor = max(grupo, key=completitud)
        cambios = {}
        if existente.get("telefono"):
            ya_existia_con_tel += 1
        elif mejor["telefono"]:
            ya_existia_sin_tel_canacar_aporta += 1
            cambios["telefono"] = mejor["telefono"]
        else:
            ya_existia_sin_tel_canacar_tampoco += 1
        if existente.get("correo"):
            ya_existia_con_correo += 1
        elif mejor["correo"]:
            ya_existia_sin_correo_canacar_aporta += 1
            cambios["correo"] = mejor["correo"]
        else:
            ya_existia_sin_correo_canacar_tampoco += 1
        if cambios:
            a_enriquecer.append((existente, cambios))

    print("\n=== EMPRESAS DEL ARCHIVO (2,879 únicas tras colapsar sucursales) ===")
    print(f"  nuevas en la base (sembradas ya, fuente=canacar): {ya_nueva}")
    print(f"  ya existían en la base (otra fuente): {len(por_norm_canacar) - ya_nueva}")
    print("\n--- de las que YA existían ---")
    print(f"  ya tenían teléfono:            {ya_existia_con_tel}")
    print(f"  NO tenían tel. y CANACAR SÍ trae → se rellena: {ya_existia_sin_tel_canacar_aporta}")
    print(f"  NO tenían tel. y CANACAR tampoco trae:         {ya_existia_sin_tel_canacar_tampoco}")
    print(f"  ya tenían correo:              {ya_existia_con_correo}")
    print(f"  NO tenían correo y CANACAR SÍ trae → se rellena: {ya_existia_sin_correo_canacar_aporta}")
    print(f"  NO tenían correo y CANACAR tampoco trae:         {ya_existia_sin_correo_canacar_tampoco}")
    print(f"\nfilas a enriquecer (con al menos un hueco que llenar): {len(a_enriquecer)}")

    if args.aplicar:
        escritos = 0
        for existente, cambios in a_enriquecer:
            nota = "CANACAR (directorio de socios) 17-ago-2026: rellena " + \
                   " y ".join(k for k in ("telefono", "correo") if k in cambios)
            previas = (existente.get("notas") or "").strip()
            cambios["notas"] = (previas + "\n" if previas else "") + nota
            api(url, key, "PATCH", f"prospecto?id=eq.{existente['id']}", cambios, {"Prefer": "return=minimal"})
            escritos += 1
        print(f"\nescritos a Supabase: {escritos}")


if __name__ == "__main__":
    main()
