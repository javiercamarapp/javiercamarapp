#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""verificar_portafolio.py — portafolio J1 a GANADOR (>$35,000, ≤16 patas, sin empates)."""
import json, math, os, re
from collections import Counter
BASE=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D=json.load(open(os.path.join(BASE,"entregables","parlays.json"),encoding="utf-8")); B=D["boletos"]; R=D["resumen"]
fallos=[]
def regla(n,ok,det=""):
    print(f"  {'PASS' if ok else 'FAIL'}  {n}"+(f" — {det}" if det else ""))
    if not ok: fallos.append(n)
print("== REGLAS (portafolio J1 · a GANADOR · >$35,000) ==")
regla("74 boletos",len(B)==74,str(len(B)))
regla("Suma $370",sum(b["apuesta_mxn"] for b in B)==370)
c=Counter(b["tier"] for b in B)
regla("Estructura 44/15/15",(c["SOÑADOR"],c["SÚPER SOÑADOR"],c["LOTERÍA MÁXIMA"])==(44,15,15),str(dict(c)))
regla("Todos Caliente",all(b["casa"]=="Caliente" for b in B))
regla("≤18 selecciones (Javier permitió +2-3)",all(b["n_patas"]<=18 for b in B),f"máx={max(b['n_patas'] for b in B)}")
regla("Solo mercado Resultado 1X2",all(l["mercado"]=="Resultado 1X2" for b in B for l in b["patas"]))
LOPS={"Alemania","España","Francia","Argentina","Portugal","Colombia","Irán","Noruega","México"}
regla("Solo ganador o empate (1X2)",all(l["descripcion"].startswith(("Gana ","Empate ")) for b in B for l in b["patas"]))
regla("Sin empates absurdos (no en partidos lopsided)",not any(l["descripcion"].startswith("Empate") and any(t in l["descripcion"] for t in LOPS) for b in B for l in b["patas"]))
regla("Solo Jornada 1 (resuelve <=17 jun)",all(b["fecha_ultima_pata"]<="2026-06-17" for b in B))
def mt(l):
    m=re.search(r"\(vs ([^,]+),",l["descripcion"]); return (l["descripcion"].split(" (")[0], m.group(1) if m else "")
regla("Sin equipo/partido repetido en un boleto",all(len({l["descripcion"].split(' (')[0] for l in b["patas"]})==b["n_patas"] for b in B))
regla("TODOS pagan ≥$35,000",all(b["pago_potencial_mxn"]>=35000 for b in B),f"mín=${min(b['pago_potencial_mxn'] for b in B):,.0f}")
regla("TODOS ≥7,000x",all(b["multiplicador"]>=7000 for b in B),f"mín={min(b['multiplicador'] for b in B):,.0f}x")
regla("Aritmética mult/pago",all(abs(b["multiplicador"]-math.prod(l["momio_decimal"] for l in b["patas"]))<=0.02*b["multiplicador"] and abs(b["pago_potencial_mxn"]-5*b["multiplicador"])<=0.1 for b in B))
regla("Boletos distintos",len({tuple(sorted(l["descripcion"] for l in b["patas"])) for b in B})==74)
regla("Momios con fuente",all(l.get("fuente") for b in B for l in b["patas"]))
regla("EST → PENDIENTE-CAPTURA",all(("PENDIENTE-CAPTURA"in l["fuente"] or l["estatus"]=="REAL") for b in B for l in b["patas"]))
print("\n== RANGOS POR TIER ==")
for t in ("SOÑADOR","SÚPER SOÑADOR","LOTERÍA MÁXIMA"):
    bs=[b for b in B if b["tier"]==t]
    print(f"  {t}: pago ${min(b['pago_potencial_mxn'] for b in bs):,.0f}-${max(b['pago_potencial_mxn'] for b in bs):,.0f} | ~1 entre {min(b['uno_entre'] for b in bs):,}-{max(b['uno_entre'] for b in bs):,}")
print(f"\n  P(que CUALQUIERA de los 74 pegue): ~{R['p_al_menos_uno_pegue']*100:.3f}% (1 entre {R['uno_entre_global']:,})")
print("\n"+("TODO PASS ✓" if not fallos else f"FALLOS: {fallos}"))
raise SystemExit(1 if fallos else 0)
