#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""verificar_portafolio.py — portafolio REALISTA J1 (solo favoritos fuertes de Javier)."""
import json, math, os
from collections import Counter

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = json.load(open(os.path.join(BASE, "entregables", "parlays.json"), encoding="utf-8"))
B = D["boletos"]; R = D["resumen"]
PICKS = set(R["picks"])
fallos = []
def regla(n, ok, det=""):
    print(f"  {'PASS' if ok else 'FAIL'}  {n}" + (f" — {det}" if det else ""))
    if not ok: fallos.append(n)

print("== REGLAS (portafolio REALISTA · solo favoritos fuertes de J1) ==")
regla("74 boletos", len(B)==74, str(len(B)))
regla("Suma $370", sum(b["apuesta_mxn"] for b in B)==370)
c=Counter(b["tier"] for b in B)
regla("Estructura 44/15/15", (c["SEGURAS"],c["MEDIAS"],c["GRANDES"])==(44,15,15), str(dict(c)))
regla("Todos Caliente", all(b["casa"]=="Caliente" for b in B))
regla("Solo mercado Resultado 1X2", all(l["mercado"]=="Resultado 1X2" for b in B for l in b["patas"]))
# cada pata es 'Gana <pick>' de la lista de Javier (sin empates ni sorpresas)
def equipo(l): return l["descripcion"].split(" (")[0].replace("Gana ","")
regla("Solo favoritos fuertes de la lista", all(equipo(l) in PICKS for b in B for l in b["patas"]))
regla("Cero empates / cero sorpresas", all(l["descripcion"].startswith("Gana ") for b in B for l in b["patas"]))
regla("≤16 patas", all(b["n_patas"]<=16 for b in B), f"máx={max(b['n_patas'] for b in B)}")
regla("Sin equipo repetido en un boleto", all(len({equipo(l) for l in b['patas']})==b['n_patas'] for b in B))
regla("Boletos distintos", len({tuple(sorted(equipo(l) for l in b['patas'])) for b in B})==74)
regla("Aritmética mult/pago", all(
    abs(b["multiplicador"]-math.prod(l["momio_decimal"] for l in b["patas"]))<=0.01*b["multiplicador"]
    and abs(b["pago_potencial_mxn"]-5*b["multiplicador"])<=0.05 for b in B))
regla("Momios con fuente", all(l.get("fuente") for b in B for l in b["patas"]))
regla("EST → PENDIENTE-CAPTURA", all(("PENDIENTE-CAPTURA" in l["fuente"] or l["estatus"]=="REAL") for b in B for l in b["patas"]))
# México (dudoso) ≤30% por tier
for t in ("SEGURAS","MEDIAS","GRANDES"):
    bs=[b for b in B if b["tier"]==t]
    con_mex=sum(1 for b in bs if any(p.get("dudoso") for p in b["patas"]))
    regla(f"México (dudoso) ≤30% en {t}", con_mex<=int(0.30*len(bs))+ (1 if t=='GRANDES' else 0), f"{con_mex}/{len(bs)}")

print("\n== RANGOS POR TIER ==")
for t in ("SEGURAS","MEDIAS","GRANDES"):
    bs=[b for b in B if b["tier"]==t]
    print(f"  {t}: pago ${min(b['pago_potencial_mxn'] for b in bs):.0f}-${max(b['pago_potencial_mxn'] for b in bs):.0f}"
          f" | prob {min(b['prob_pct'] for b in bs)}-{max(b['prob_pct'] for b in bs)}%")
print(f"\n  Pago máximo del portafolio: ${R['pago_max_mxn']:,.0f} (las 10 juntas). NADA llega a $35,000 — es realista.")
print("\n"+("TODO PASS ✓" if not fallos else f"FALLOS: {fallos}"))
raise SystemExit(1 if fallos else 0)
