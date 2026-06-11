#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generar_parlays_j1.py — Portafolio J1 que SÍ paga >$35,000, solo a GANADOR.
============================================================================
Decisión final de Javier: el retorno debe ser >$35,000; usar hasta 16 juegos
de la Jornada 1; sin empates ni patas absurdas (solo el favorito a GANAR).
Matemática: con puros favoritos fuertes no alcanza, PERO incluyendo los
partidos más CERRADOS de J1 (donde el favorito paga 1.7-2.5), 16 selecciones
a ganador llegan a 7,000-10,719x = $35,597-$53,597. Hay 2,512 combinaciones
posibles → se eligen 74 DISTINTAS (una por intento), $5 c/u = $370.
Estructura 60/20/20 por monto: las 44 más PROBABLES (~$35-38k), 15 medias,
15 al máximo (~$45-54k, las menos probables).
Cada pata = ese equipo GANA su partido de J1 (1X2). Momios REALES donde
existan; si no, EST 0.92/prob (PENDIENTE-CAPTURA en Caliente).
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

F_EST = "EST modelo (data/predicciones_104.json), 0.92/prob ≈ con vig — PENDIENTE-CAPTURA en Caliente"
NOMBRADOS = {"Inglaterra", "Brasil", "Alemania", "Argentina", "Francia",
             "Portugal", "España", "Holanda", "Uruguay", "México"}  # picks de Javier


def amer(d):
    return f"+{round((d-1)*100)}" if d >= 2 else f"{round(-100/(d-1))}"


# ── Leg favorito (a GANAR) de cada uno de los 24 partidos de J1 ──
LEGS = []
for p in PRED["predicciones"]:
    if p.get("fase") != "grupos" or p.get("jornada") != 1:
        continue
    m = p["prob_mezcla"]
    if m["local"] >= m["visitante"]:
        lado, prob, eq, riv = "local", m["local"], p["local"], p["visitante"]
    else:
        lado, prob, eq, riv = "visitante", m["visitante"], p["visitante"], p["local"]
    real = REAL.get((p["local"], p["visitante"]))
    if real:
        dec = real[0][lado]; fuente, est = f"Caliente/casas vía {real[1]}", "REAL"
    else:
        dec = round(max(0.92 / prob, 1.04), 2); fuente, est = F_EST, "EST"
    LEGS.append({"idx": len(LEGS), "equipo": eq, "rival": riv, "fecha": p["fecha"],
                 "descripcion": f"Gana {eq} (vs {riv}, {p['fecha'][5:]})",
                 "mercado": "Resultado 1X2", "momio_decimal": dec, "momio_americano": amer(dec),
                 "prob_real": prob, "fuente": fuente, "estatus": est})

N = len(LEGS)  # 24


def main():
    os.makedirs(ENT, exist_ok=True)
    # enumerar combinaciones de 16 (de 24) con multiplicador ≥7,000x
    validas = []
    for c in itertools.combinations(range(N), 16):
        mult = 1.0
        for i in c:
            mult *= LEGS[i]["momio_decimal"]
        if mult >= 7000:
            prob = 1.0
            for i in c:
                prob *= LEGS[i]["prob_real"]
            validas.append((prob, mult, c))
    # ordenar por PROBABILIDAD desc dentro de cada banda de pago
    validas.sort(key=lambda t: -t[0])
    # bandas por multiplicador: SOÑADOR ($35-38k), SÚPER ($38-45k), LOTERÍA ($45-54k)
    bandas = [("SOÑADOR", 44, 7000, 7600), ("SÚPER SOÑADOR", 15, 7600, 9000),
              ("LOTERÍA MÁXIMA", 15, 9000, 10_800)]
    sel = []
    for tier, n, mn, mx in bandas:
        cnt = 0
        for prob, mult, c in validas:
            if cnt >= n:
                break
            if mn <= mult < mx:
                sel.append((tier, prob, mult, c)); cnt += 1
        if cnt < n:
            raise SystemExit(f"banda {tier}: solo {cnt}/{n} combinaciones en {mn}-{mx}x")
    if len(sel) < 74:
        raise SystemExit(f"solo {len(sel)} combinaciones ≥7000x")

    # tiers por monto/probabilidad
    boletos = []
    for n, (tier, prob, mult, c) in enumerate(sel, start=1):
        emoji = {"SOÑADOR": "🌙", "SÚPER SOÑADOR": "🚀", "LOTERÍA MÁXIMA": "🎰"}[tier]
        patas = [LEGS[i] for i in c]
        nombrados = sum(1 for l in patas if l["equipo"] in NOMBRADOS)
        boletos.append({
            "boleto": n, "tier": tier, "emoji": emoji, "casa": "Caliente", "apuesta_mxn": 5,
            "patas": [{k: l[k] for k in ("descripcion", "mercado", "momio_decimal",
                                          "momio_americano", "prob_real", "fuente", "estatus")} for l in patas],
            "n_patas": len(c),
            "multiplicador": round(mult, 2),
            "pago_potencial_mxn": round(5 * mult, 2),
            "prob_real": prob, "uno_entre": round(1 / prob),
            "picks_de_javier": nombrados,
            "tiene_momios_pendientes": any(l["estatus"] == "EST" for l in patas),
            "fecha_ultima_pata": max(l["fecha"] for l in patas),
        })

    # reordenar números: tier por monto (mayor pago = LOTERÍA). Mantengo prob para SOÑADOR.
    p_no = 1.0
    for b in boletos:
        p_no *= (1 - b["prob_real"])
    p_alg = 1 - p_no
    resumen = {
        "presupuesto_mxn": 370, "total_boletos": 74, "total_mxn": 370,
        "enfoque": "Solo GANADOR (1X2) de hasta 16 partidos de J1; TODOS pagan >$35,000; sin empates ni patas absurdas",
        "max_selecciones": 16,
        "estructura": dict(Counter(b["tier"] for b in boletos)),
        "pago_min_mxn": min(b["pago_potencial_mxn"] for b in boletos),
        "pago_max_mxn": max(b["pago_potencial_mxn"] for b in boletos),
        "prob_boleto_max_pct": round(max(b["prob_real"] for b in boletos) * 100, 4),
        "p_al_menos_uno_pegue": round(p_alg, 6),
        "uno_entre_global": round(1 / p_alg) if p_alg else None,
        "combinaciones_posibles": len(validas),
        "nota": ("Para llegar a $35,000 con puros GANADORES hay que incluir los partidos "
                 "más CERRADOS de J1 (favoritos que pagan 1.7-2.5); los favoritos fuertísimos "
                 "(Alemania, España) casi no suben el multiplicador. Son 16 aciertos seguidos: "
                 f"P(que CUALQUIERA de los 74 pegue) ~{p_alg:.3%}. Entretenimiento, no inversión."),
    }
    json.dump({"resumen": resumen, "boletos": boletos},
              open(os.path.join(ENT, "parlays.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print(json.dumps(resumen, ensure_ascii=False, indent=2))

    nombres = {"SOÑADOR": "🌙 44 SOÑADOR — las más alcanzables (~$35-38K)",
               "SÚPER SOÑADOR": "🚀 15 SÚPER (~$38-45K)",
               "LOTERÍA MÁXIMA": "🎰 15 LOTERÍA MÁXIMA (~$45-54K)"}
    Lns = ["# PORTAFOLIO J1 — 74 parlays a GANADOR · Mundial 2026",
           "",
           "**$370 · 74 boletos × $5 · Caliente · hasta 16 GANADORES de la Jornada 1 · TODOS pagan >$35,000 · sin empates ni sorpresas absurdas**",
           "",
           "## ⚠️ HONESTIDAD",
           f"- Cada boleto son **16 partidos a ganador** que TODOS deben acertar. P(que alguno de los 74 pegue): **~{p_alg:.3%} ≈ 1 entre {round(1/p_alg):,}**.",
           "- Para llegar a $35,000 hay que meter los partidos CERRADOS de J1 (favoritos que pagan 1.7-2.5, ~40-55%): Turquía, Suecia, Corea, Bélgica, USA, etc. No son empates ni absurdos, pero acertar los 16 es muy difícil.",
           "- Todo se resuelve entre 11-17 jun. Momios `EST` = PENDIENTE-CAPTURA en Caliente. Lo más probable es perder los $370.",
           ""]
    for tier in ("SOÑADOR", "SÚPER SOÑADOR", "LOTERÍA MÁXIMA"):
        Lns.append(f"\n## {nombres[tier]}\n")
        for b in [b for b in boletos if b["tier"] == tier]:
            Lns.append(f"### {b['emoji']} #{b['boleto']} — {b['n_patas']} ganadores — {b['multiplicador']:,.0f}x → "
                       f"**${b['pago_potencial_mxn']:,.0f}** · ~1 entre {b['uno_entre']:,}")
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
