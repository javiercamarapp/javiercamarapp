#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
verificar_portafolio.py — reglas duras del portafolio SOÑADOR + matriz de exposición.
$370 = 74 boletos, estructura 44/15/15, TODOS pagan >$35,000 (≥7,000x).
"""

import json
import os
import re
from collections import Counter, defaultdict

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = json.load(open(os.path.join(BASE, "entregables", "parlays.json"), encoding="utf-8"))
B = D["boletos"]

# (n, mult_min, mult_max)
BANDAS = {"SOÑADOR": (44, 7_000, 30_000),
          "SÚPER SOÑADOR": (15, 30_000, 150_000),
          "LOTERÍA MÁXIMA": (15, 150_000, 720_000)}
TOPE_PAGO = 3_600_000

fallos = []
def regla(nombre, ok, det=""):
    print(f"  {'PASS' if ok else 'FAIL'}  {nombre}" + (f" — {det}" if det else ""))
    if not ok:
        fallos.append(nombre)

print("== REGLAS DURAS (portafolio soñador) ==")
regla("74 boletos", len(B) == 74, str(len(B)))
regla("Suma $370 MXN", sum(b["apuesta_mxn"] for b in B) == 370)
c = Counter(b["tier"] for b in B)
regla("Estructura 44/15/15 (≈60/20/20)", (c["SOÑADOR"], c["SÚPER SOÑADOR"], c["LOTERÍA MÁXIMA"]) == (44, 15, 15), str(dict(c)))
regla("Todos en Caliente", all(b["casa"] == "Caliente" for b in B))
regla("≤8 selecciones (límite Caliente)", all(b["n_patas"] <= 8 for b in B), f"máx={max(b['n_patas'] for b in B)}")
regla("TODOS pagan ≥$35,000", all(b["pago_potencial_mxn"] >= 35000 for b in B),
      f"mín=${min(b['pago_potencial_mxn'] for b in B):,.0f}")
regla("TODOS ≥7,000x", all(b["multiplicador"] >= 7000 for b in B), f"mín={min(b['multiplicador'] for b in B):,.0f}x")
regla("Pago ≤ tope Caliente $3.6M", all(b["pago_potencial_mxn"] <= TOPE_PAGO for b in B),
      f"máx=${max(b['pago_potencial_mxn'] for b in B):,.0f}")
for tier, (n, mn, mx) in BANDAS.items():
    bs = [b for b in B if b["tier"] == tier]
    regla(f"Banda {tier} {mn:,}-{mx:,}x", all(mn <= b["multiplicador"] <= mx for b in bs),
          f"rango {min(b['multiplicador'] for b in bs):,.0f}-{max(b['multiplicador'] for b in bs):,.0f}x")
regla("Momios con fuente", all(l.get("fuente") for b in B for l in b["patas"]))
regla("EST → PENDIENTE-CAPTURA", all(("PENDIENTE-CAPTURA" in l["fuente"] or l["estatus"] == "REAL")
                                      for b in B for l in b["patas"]))

# aritmética
def _ok(a, b, tol=0.005):
    return abs(a - b) <= tol * max(abs(b), 1)
arit = all(_ok(b["multiplicador"], __import__("math").prod(l["momio_decimal"] for l in b["patas"]))
           and _ok(b["pago_potencial_mxn"], min(5 * b["multiplicador"], TOPE_PAGO))
           and _ok(b["prob_real"], __import__("math").prod(l["prob_real"] for l in b["patas"]))
           for b in B)
regla("Aritmética (mult/pago/prob)", arit)

# correlaciones prohibidas
def _match(l):
    if l["mercado"] not in ("1X2", "1X2 empate", "Marcador exacto"):
        return None
    d = re.sub(r"\b\d-\d\b", "", l["descripcion"]).replace("Empate", "")
    return (re.sub(r"\s+", " ", d).strip(), l["fecha_resolucion"])
corr = 0
for b in B:
    ms = [_match(l) for l in b["patas"] if _match(l)]
    if len(ms) != len(set(ms)):
        corr += 1
    descs = [l["descripcion"] for l in b["patas"]]
    if any("Colombia gana el Grupo K" in d for d in descs) and any("Portugal" in d and "Colombia" in d for d in descs):
        corr += 1
regla("Sin correlaciones prohibidas", corr == 0, f"{corr} boletos con conflicto")

print("\n== DIVERSIFICACIÓN (evento ≤30% de su tier) ==")
ok_div = True
for tier, (n, _, _) in BANDAS.items():
    uso = Counter()
    for b in B:
        if b["tier"] == tier:
            for l in b["patas"]:
                uso[l["descripcion"]] += 1
    tope = int(0.30 * n)
    peor = uso.most_common(1)[0]
    ok = peor[1] <= tope
    ok_div &= ok
    print(f"  {'PASS' if ok else 'FAIL'}  {tier}: máx uso {peor[1]}/{tope} ({peor[0][:48]})")
if not ok_div:
    fallos.append("diversificación")

print("\n== MATRIZ DE EXPOSICIÓN (top 25 eventos × tier) ==")
expo = defaultdict(Counter)
for b in B:
    for l in b["patas"]:
        expo[l["descripcion"]][b["tier"]] += 1
for ev, cc in sorted(expo.items(), key=lambda t: -sum(t[1].values()))[:25]:
    print(f"  {sum(cc.values()):>2}  S:{cc['SOÑADOR']:>2} SS:{cc['SÚPER SOÑADOR']:>2} L:{cc['LOTERÍA MÁXIMA']:>2}  {ev[:52]}")

print("\n== REPARTO POR JORNADA ==")
for tier in BANDAS:
    fechas = Counter()
    for b in B:
        if b["tier"] == tier:
            for l in b["patas"]:
                f = l["fecha_resolucion"]
                bucket = ("J1" if f <= "2026-06-17" else "J2" if f <= "2026-06-23"
                          else "J3" if f <= "2026-06-27" else "KO")
                fechas[bucket] += 1
    print(f"  {tier}: {dict(sorted(fechas.items()))}")
m1 = [b["boleto"] for b in B if all(l["fecha_resolucion"] == "2026-06-11" for l in b["patas"])]
print(f"  Boletos que mueren el día 1: {len(m1)}")

print("\n" + ("TODO PASS ✓" if not fallos else f"FALLOS: {fallos}"))
raise SystemExit(1 if fallos else 0)
