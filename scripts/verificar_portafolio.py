#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
verificar_portafolio.py — checa las reglas duras del portafolio y muestra
la matriz de exposición. PASS/FAIL por regla.
"""

import json
import os
from collections import Counter, defaultdict

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = json.load(open(os.path.join(BASE, "entregables", "parlays.json"), encoding="utf-8"))
B = D["boletos"]

fallos = []

def regla(nombre, ok, detalle=""):
    print(f"  {'PASS' if ok else 'FAIL'}  {nombre}" + (f" — {detalle}" if detalle else ""))
    if not ok:
        fallos.append(nombre)

print("== REGLAS DURAS ==")
regla("100 boletos", len(B) == 100, f"{len(B)}")
regla("Suma $500 MXN", sum(b["apuesta_mxn"] for b in B) == 500)
c = Counter(b["tier"] for b in B)
regla("Estructura 60/20/20", (c["CONSERVADOR"], c["MEDIO"], c["JACKPOT"]) == (60, 20, 20), str(dict(c)))
regla("Todos en Caliente (mínimo $5 confirmado)", all(b["casa"] == "Caliente" for b in B))
regla("≤8 selecciones por boleto (límite Caliente)", all(b["n_patas"] <= 8 for b in B),
      f"máx={max(b['n_patas'] for b in B)}")
regla("Jackpots ≥7,000x", all(b["multiplicador"] >= 7000 for b in B if b["tier"] == "JACKPOT"),
      f"mín jackpot={min((b['multiplicador'] for b in B if b['tier']=='JACKPOT')):,.0f}x")
regla("Jackpots pagan ≥$35,000", all(b["pago_potencial_mxn"] >= 35000 for b in B if b["tier"] == "JACKPOT"))
tope = all(b["pago_potencial_mxn"] <= 3600000 for b in B)
regla("Pago ≤ tope Caliente $3.6M", tope, f"máx=${max(b['pago_potencial_mxn'] for b in B):,.0f}")
regla("Conservadores 1.5x-4x", all(1.5 <= b["multiplicador"] <= 4.0 for b in B if b["tier"] == "CONSERVADOR"))
regla("Medios 20x-300x", all(20 <= b["multiplicador"] <= 300 for b in B if b["tier"] == "MEDIO"))
regla("Conservadores 2-3 patas", all(2 <= b["n_patas"] <= 3 for b in B if b["tier"] == "CONSERVADOR"))
regla("Medios 4-6 patas", all(4 <= b["n_patas"] <= 6 for b in B if b["tier"] == "MEDIO"))
regla("Momios todos con fuente", all(l.get("fuente") for b in B for l in b["patas"]))
regla("EST siempre marcado PENDIENTE-CAPTURA", all(
    ("PENDIENTE-CAPTURA" in l["fuente"] or l["estatus"] == "REAL") for b in B for l in b["patas"]))

print("\n== DIVERSIFICACIÓN (evento ≤30% de su tier) ==")
ok_div = True
for tier, n in (("CONSERVADOR", 60), ("MEDIO", 20), ("JACKPOT", 20)):
    uso = Counter()
    for b in B:
        if b["tier"] == tier:
            for l in b["patas"]:
                uso[l["descripcion"]] += 1
    tope_n = int(0.30 * n)
    peor = uso.most_common(1)[0]
    ok = peor[1] <= tope_n
    ok_div &= ok
    print(f"  {'PASS' if ok else 'FAIL'}  {tier}: máx uso {peor[1]}/{tope_n} ({peor[0][:50]})")
if not ok_div:
    fallos.append("diversificación")

print("\n== MATRIZ DE EXPOSICIÓN (boletos por evento × tier) ==")
expo = defaultdict(lambda: Counter())
for b in B:
    for l in b["patas"]:
        expo[l["descripcion"]][b["tier"]] += 1
for ev, cc in sorted(expo.items(), key=lambda t: -sum(t[1].values())):
    print(f"  {sum(cc.values()):>3}  C:{cc['CONSERVADOR']:>2} M:{cc['MEDIO']:>2} J:{cc['JACKPOT']:>2}  {ev[:60]}")

print("\n== REPARTO POR JORNADA (fecha de resolución de patas) ==")
for tier in ("CONSERVADOR", "MEDIO", "JACKPOT"):
    fechas = Counter()
    for b in B:
        if b["tier"] == tier:
            for l in b["patas"]:
                f = l["fecha_resolucion"]
                bucket = ("J1 (11-17jun)" if f <= "2026-06-17" else
                          "J2 (18-23jun)" if f <= "2026-06-23" else
                          "J3 (24-27jun)" if f <= "2026-06-27" else "KO/final")
                fechas[bucket] += 1
    print(f"  {tier}: {dict(sorted(fechas.items()))}")
mueren_dia1 = [b["boleto"] for b in B if all(l["fecha_resolucion"] == "2026-06-11" for l in b["patas"])]
print(f"\n  Boletos que se deciden 100% el día 1 (11-jun): {len(mueren_dia1)} {mueren_dia1}")

print("\n" + ("TODO PASS ✓" if not fallos else f"FALLOS: {fallos}"))
raise SystemExit(1 if fallos else 0)
