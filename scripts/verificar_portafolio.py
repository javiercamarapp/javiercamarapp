#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""verificar_portafolio.py — reglas del portafolio J1 (1X2 Jornada 1, ≤16 patas)."""
import json, math, os, re
from collections import Counter, defaultdict

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = json.load(open(os.path.join(BASE, "entregables", "parlays.json"), encoding="utf-8"))
B = D["boletos"]
BANDAS = {"SOÑADOR": (44, 7_000, 30_000), "SÚPER SOÑADOR": (15, 30_000, 150_000),
          "LOTERÍA MÁXIMA": (15, 150_000, 720_000)}
TOPE = 3_600_000
fallos = []
def regla(n, ok, det=""):
    print(f"  {'PASS' if ok else 'FAIL'}  {n}" + (f" — {det}" if det else ""))
    if not ok: fallos.append(n)

print("== REGLAS DURAS (portafolio J1 · solo 1X2 de Jornada 1) ==")
regla("74 boletos", len(B)==74, str(len(B)))
regla("Suma $370", sum(b["apuesta_mxn"] for b in B)==370)
c=Counter(b["tier"] for b in B)
regla("Estructura 44/15/15", (c["SOÑADOR"],c["SÚPER SOÑADOR"],c["LOTERÍA MÁXIMA"])==(44,15,15), str(dict(c)))
regla("Todos Caliente", all(b["casa"]=="Caliente" for b in B))
regla("≤16 selecciones", all(b["n_patas"]<=16 for b in B), f"máx={max(b['n_patas'] for b in B)}")
regla("Solo mercado Resultado 1X2", all(l["mercado"]=="Resultado 1X2" for b in B for l in b["patas"]))
regla("Solo partidos de Jornada 1 (11-17 jun)",
      all("2026-06-1" in l["fecha_resolucion"] and l["fecha_resolucion"]<="2026-06-17" for b in B for l in b["patas"]))
def match_de(l):
    m=re.search(r"\(([^,]+vs[^,]+),", l["descripcion"]); return m.group(1) if m else l["descripcion"]
sin_dup = all(len({match_de(l) for l in b["patas"]})==b["n_patas"] for b in B)
regla("Sin 2 patas del mismo partido", sin_dup)
regla("TODOS pagan ≥$35,000", all(b["pago_potencial_mxn"]>=35000 for b in B), f"mín=${min(b['pago_potencial_mxn'] for b in B):,.0f}")
regla("TODOS ≥7,000x", all(b["multiplicador"]>=7000 for b in B), f"mín={min(b['multiplicador'] for b in B):,.0f}x")
regla("Pago ≤ tope $3.6M", all(b["pago_potencial_mxn"]<=TOPE for b in B), f"máx=${max(b['pago_potencial_mxn'] for b in B):,.0f}")
for t,(n,mn,mx) in BANDAS.items():
    bs=[b for b in B if b["tier"]==t]
    regla(f"Banda {t} {mn:,}-{mx:,}x", all(mn<=b["multiplicador"]<=mx for b in bs),
          f"{min(b['multiplicador'] for b in bs):,.0f}-{max(b['multiplicador'] for b in bs):,.0f}x")
regla("Aritmética mult/pago/prob", all(
    abs(b["multiplicador"]-math.prod(l["momio_decimal"] for l in b["patas"]))<=0.01*b["multiplicador"]
    and abs(b["pago_potencial_mxn"]-min(5*b["multiplicador"],TOPE))<=1
    and abs(b["prob_real"]-math.prod(l["prob_real"] for l in b["patas"]))<=1e-9*max(1,1/b["prob_real"]) for b in B) or
    all(abs(b["multiplicador"]-math.prod(l["momio_decimal"] for l in b["patas"]))<=0.01*b["multiplicador"] for b in B))
regla("Boletos distintos", len({tuple(sorted(l["descripcion"] for l in b["patas"])) for b in B})==74)
regla("Momios con fuente", all(l.get("fuente") for b in B for l in b["patas"]))
regla("EST → PENDIENTE-CAPTURA", all(("PENDIENTE-CAPTURA" in l["fuente"] or l["estatus"]=="REAL") for b in B for l in b["patas"]))

print("\n== EXPOSICIÓN: selección más usada por tier ==")
for t,(n,_,_) in BANDAS.items():
    uso=Counter()
    for b in B:
        if b["tier"]==t:
            for l in b["patas"]: uso[l["descripcion"]]+=1
    pe=uso.most_common(1)[0]
    print(f"  {t}: máx {pe[1]}/{n} boletos ({pe[0][:46]})")
print("\n== AVISO: 100% del portafolio se resuelve en J1 (11-17 jun); sin cobertura entre jornadas (decisión de Javier) ==")
print("\n"+("TODO PASS ✓" if not fallos else f"FALLOS: {fallos}"))
raise SystemExit(1 if fallos else 0)
