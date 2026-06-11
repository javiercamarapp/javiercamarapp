#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generar_parlays_j1.py — Portafolio REALISTA de Jornada 1 con las selecciones
fuertes elegidas por Javier (sin empates ni sorpresas absurdas).
============================================================================
Picks de Javier (todos a GANAR su partido de J1):
  Inglaterra, Brasil, Alemania, Argentina, Francia, Portugal, España,
  Países Bajos (Holanda), Uruguay, México (marcado "lo dudo").
Cada pata = ese equipo gana (mercado 1X2). NADA de empates ni underdogs.
$370 = 74 boletos × $5, estructura 60/20/20 por TAMAÑO de combinada:
  - SEGURAS (44): 2-3 picks  (pago ~$6-$16)
  - MEDIAS  (15): 4-6 picks  (pago ~$16-$80)
  - GRANDES (15): 7-10 picks (pago ~$80-$170, la de 10 ≈ $166)
HONESTIDAD: con puros favoritos NO se llega a $35,000 (eso exigía patas
irreales). Aquí los pagos son realistas y las probabilidades, decentes.
Momios: REAL de data/momios_mx.json donde existan; si no, EST PENDIENTE-CAPTURA.
"""

import itertools
import json
import math
import os
from collections import Counter

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENT = os.path.join(BASE, "entregables")
PRED = json.load(open(os.path.join(BASE, "data", "predicciones_104.json"), encoding="utf-8"))
MOM = json.load(open(os.path.join(BASE, "data", "momios_mx.json"), encoding="utf-8"))

REAL = {}
for p in MOM["partidos"]:
    md = p.get("momios_decimal")
    if isinstance(md, dict) and md.get("local"):
        REAL[(p["local"], p["visitante"])] = (md, p.get("fuente", "data/momios_mx.json"))

# Picks de Javier: equipo -> (es local?) se resuelve buscando en J1
PICKS = ["Inglaterra", "Brasil", "Alemania", "Argentina", "Francia",
         "Portugal", "España", "Holanda", "Uruguay", "México"]
DUDOSO = {"México"}   # "lo dudo" → se limita su uso

J1 = {p["num"]: p for p in PRED["predicciones"] if p.get("fase") == "grupos" and p.get("jornada") == 1}
F_EST = "EST modelo (data/predicciones_104.json), 0.92/prob ≈ con vig — PENDIENTE-CAPTURA en Caliente"

def amer(d):
    return f"+{round((d-1)*100)}" if d >= 2 else f"{round(-100/(d-1))}"

LEGS = {}
for eq in PICKS:
    # localizar el partido J1 del equipo y el lado
    for p in J1.values():
        if eq == p["local"]:
            lado, prob = "local", p["prob_mezcla"]["local"]; rival = p["visitante"]; break
        if eq == p["visitante"]:
            lado, prob = "visitante", p["prob_mezcla"]["visitante"]; rival = p["local"]; break
    else:
        raise SystemExit(f"{eq} no juega en J1?")
    real = REAL.get((p["local"], p["visitante"]))
    if real:
        dec = real[0][lado]; fuente, est = f"Caliente/casas vía {real[1]}", "REAL"
    else:
        dec = round(max(0.92 / prob, 1.04), 2); fuente, est = F_EST, "EST"
    LEGS[eq] = {"equipo": eq, "rival": rival, "fecha": p["fecha"],
                "descripcion": f"Gana {eq} (vs {rival}, {p['fecha'][5:]})",
                "mercado": "Resultado 1X2", "momio_decimal": dec, "momio_americano": amer(dec),
                "prob_real": prob, "fuente": fuente, "estatus": est, "dudoso": eq in DUDOSO}

# (tier, n, tam_min, tam_max, emoji, etiqueta, orden)
TIERS = [("SEGURAS", 44, 2, 3, "✅", "2-3 picks", "prob"),
         ("MEDIAS", 15, 4, 6, "⚡", "4-6 picks", "prob"),
         ("GRANDES", 15, 7, 10, "🔥", "7-10 picks", "pago")]


def combos_tier(n, tmin, tmax, cap_dudoso, orden):
    todos = []
    for k in range(tmin, tmax + 1):
        for c in itertools.combinations(PICKS, k):
            todos.append(c)
    def prob(c):
        return math.prod(LEGS[e]["prob_real"] for e in c)
    def mult(c):
        return math.prod(LEGS[e]["momio_decimal"] for e in c)
    # SEGURAS/MEDIAS: más probable primero. GRANDES: mayor pago primero.
    todos.sort(key=(lambda c: -prob(c)) if orden == "prob" else (lambda c: -mult(c)))
    elegidos, usos_dud = [], 0
    vistos = set()
    for c in todos:
        if len(elegidos) >= n:
            break
        if c in vistos:
            continue
        if any(LEGS[e]["dudoso"] for e in c):
            if usos_dud >= cap_dudoso:
                continue
            usos_dud += 1
        elegidos.append(c)
        vistos.add(c)
    return elegidos


def main():
    os.makedirs(ENT, exist_ok=True)
    boletos, num = [], 1
    for tier, n, tmin, tmax, emoji, etiq, orden in TIERS:
        for c in combos_tier(n, tmin, tmax, int(0.30 * n), orden):
            mult = math.prod(LEGS[e]["momio_decimal"] for e in c)
            p = math.prod(LEGS[e]["prob_real"] for e in c)
            boletos.append({
                "boleto": num, "tier": tier, "emoji": emoji, "casa": "Caliente", "apuesta_mxn": 5,
                "patas": [{k: LEGS[e][k] for k in ("descripcion", "mercado", "momio_decimal",
                                                    "momio_americano", "prob_real", "fuente",
                                                    "estatus")} | {"dudoso": LEGS[e]["dudoso"]} for e in c],
                "n_patas": len(c),
                "multiplicador": round(mult, 2),
                "pago_potencial_mxn": round(5 * mult, 2),
                "prob_real": p, "prob_pct": round(p * 100, 1),
                "tiene_momios_pendientes": any(LEGS[e]["estatus"] == "EST" for e in c),
                "fecha_ultima_pata": max(LEGS[e]["fecha"] for e in c),
            })
            num += 1
    assert len(boletos) == 74, len(boletos)

    # combinada bandera: todas las que NO dudo (9) y todas (10)
    nueve = [e for e in PICKS if e not in DUDOSO]
    mult9 = math.prod(LEGS[e]["momio_decimal"] for e in nueve)
    p9 = math.prod(LEGS[e]["prob_real"] for e in nueve)
    mult10 = math.prod(LEGS[e]["momio_decimal"] for e in PICKS)
    p10 = math.prod(LEGS[e]["prob_real"] for e in PICKS)

    resumen = {
        "presupuesto_mxn": 370, "total_boletos": 74, "total_mxn": 370,
        "enfoque": "REALISTA — solo favoritos fuertes elegidos por Javier (sin empates/sorpresas)",
        "picks": PICKS, "dudoso": list(DUDOSO),
        "estructura": dict(Counter(b["tier"] for b in boletos)),
        "pago_min_mxn": min(b["pago_potencial_mxn"] for b in boletos),
        "pago_max_mxn": max(b["pago_potencial_mxn"] for b in boletos),
        "bandera_9_sin_dudoso": {"picks": nueve, "mult": round(mult9, 1),
                                 "pago_mxn": round(5 * mult9, 2), "prob_pct": round(p9 * 100, 1)},
        "bandera_10_todas": {"mult": round(mult10, 1), "pago_mxn": round(5 * mult10, 2),
                             "prob_pct": round(p10 * 100, 1)},
        "nota": ("Pagos REALISTAS: con puros favoritos el máximo es ~33x (≈$166 las 10 juntas), "
                 "NO $35,000 (eso requería patas irreales ya descartadas). Lo más probable es que "
                 "peguen las combinadas chicas (2-3 fuertes)."),
    }
    json.dump({"resumen": resumen, "boletos": boletos},
              open(os.path.join(ENT, "parlays.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print(json.dumps(resumen, ensure_ascii=False, indent=2))

    nombres = {"SEGURAS": "✅ 44 SEGURAS (2-3 fuertes · pago $6-$16 · prob alta)",
               "MEDIAS": "⚡ 15 MEDIAS (4-6 fuertes · pago $16-$80)",
               "GRANDES": "🔥 15 GRANDES (7-10 fuertes · pago $80-$170)"}
    Lns = ["# PORTAFOLIO REALISTA J1 — Mundial 2026",
           "",
           "**$370 · 74 boletos × $5 · Caliente · SOLO favoritos fuertes de Javier (sin empates ni sorpresas)**",
           "",
           f"**Picks:** {', '.join(PICKS)}  _(México = lo dudo, uso limitado)_",
           "",
           "## La verdad sobre los pagos",
           f"- **Las 9 que NO dudas juntas:** {round(mult9,1)}x → **${round(5*mult9):,} MXN** (prob ~{round(p9*100,1)}%).",
           f"- **Las 10 (con México):** {round(mult10,1)}x → **${round(5*mult10):,} MXN** (prob ~{round(p10*100,1)}%).",
           "- Con puros favoritos NO se llega a $35,000 — eso exigía patas irreales (que quitamos).",
           "- Lo más probable es cobrar las combinadas chicas (2-3 fuertes). Apuesta de entretenimiento.",
           ""]
    for tier, _, _, _, _, _, _ in TIERS:
        Lns.append(f"\n## {nombres[tier]}\n")
        for b in [b for b in boletos if b["tier"] == tier]:
            dud = " · incluye México (dudoso)" if any(p["dudoso"] for p in b["patas"]) else ""
            Lns.append(f"### {b['emoji']} #{b['boleto']} — {b['n_patas']} patas — {b['multiplicador']:.2f}x → "
                       f"**${b['pago_potencial_mxn']:,.0f}** · prob ~{b['prob_pct']}%{dud}")
            Lns.append("")
            Lns.append("| Selección | Momio | Prob | Estatus |")
            Lns.append("|---|---|---|---|")
            for l in b["patas"]:
                Lns.append(f"| {l['descripcion']} | {l['momio_decimal']} ({l['momio_americano']}) "
                           f"| {l['prob_real']*100:.0f}% | {l['estatus']} |")
            Lns.append("")
    open(os.path.join(ENT, "PORTAFOLIO_74_PARLAYS_J1.md"), "w", encoding="utf-8").write("\n".join(Lns) + "\n")
    print("\nOK → entregables/parlays.json + PORTAFOLIO_74_PARLAYS_J1.md")


if __name__ == "__main__":
    main()
