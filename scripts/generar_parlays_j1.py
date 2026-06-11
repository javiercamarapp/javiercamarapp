#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generar_parlays_j1.py — Portafolio J1 que paga >$35,000, mezclando GANADORES
y EMPATES de forma realista (decisión de Javier).
============================================================================
Reglas:
  - Mercado 1X2 de partidos de la Jornada 1. Cada pata = un resultado:
      · Partido LOPSIDED (favorito ≥62%): solo "gana el favorito" (un empate
        ahí sería absurdo — p.ej. Alemania-Curazao, España-Cabo Verde).
      · Partido CERRADO (favorito <62%): se permite "gana el favorito" O
        "empate" (ambos realistas; el empate paga 3.3-4.5).
    Nunca se elige al claro perdedor (evita 'Panamá le gana a Ghana').
  - Corrección de Javier: Ghana es favorito vs Panamá (no al revés).
  - 16 a 18 selecciones por boleto; TODOS pagan >$35,000 (≥7,000x).
  - $370 = 74 boletos × $5, DISTINTOS, una por intento. Tier 60/20/20 por monto.
  - Momios REALES donde existan; si no, EST 0.92/prob (PENDIENTE-CAPTURA).
"""

import json
import math
import os
import random
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
LOPSIDED = 0.62   # umbral: arriba de esto el empate es absurdo


def amer(d):
    return f"+{round((d-1)*100)}" if d >= 2 else f"{round(-100/(d-1))}"


# ── Por cada partido de J1: opciones de pata realistas {ganador, [empate]} ──
PARTIDOS = []   # cada uno: {"num", "fecha", "opciones":[leg,...]}
for p in PRED["predicciones"]:
    if p.get("fase") != "grupos" or p.get("jornada") != 1:
        continue
    m = p["prob_mezcla"]
    L, V, fecha = p["local"], p["visitante"], p["fecha"]
    real = REAL.get((L, V))
    # favorito
    if m["local"] >= m["visitante"]:
        fav_lado, fav_eq, fav_riv, fav_p = "local", L, V, m["local"]
    else:
        fav_lado, fav_eq, fav_riv, fav_p = "visitante", V, L, m["visitante"]
    # CORRECCIÓN Javier: Ghana favorito vs Panamá
    ghana_fix = ({fav_eq, fav_riv} == {"Ghana", "Panamá"} and fav_eq == "Panamá")

    opciones = []
    # — ganador del favorito —
    if ghana_fix:
        opciones.append({"desc": f"Gana Ghana (vs Panamá, {fecha[5:]})", "tipo": "1X2",
                         "dec": 1.95, "prob": 0.52, "fecha": fecha,
                         "fuente": "AJUSTE Javier (Ghana favorito vs Panamá; Elo chico poco confiable) — PENDIENTE-CAPTURA",
                         "est": "EST"})
        fav_p = 0.52
    else:
        if real:
            dec = real[0][fav_lado]; fuente, est = f"Caliente/casas vía {real[1]}", "REAL"
        else:
            dec = round(max(0.92 / fav_p, 1.04), 2); fuente, est = F_EST, "EST"
        opciones.append({"desc": f"Gana {fav_eq} (vs {fav_riv}, {fecha[5:]})", "tipo": "1X2",
                         "dec": dec, "prob": fav_p, "fecha": fecha, "fuente": fuente, "est": est})
    # — empate (solo si el partido es CERRADO) —
    if fav_p < LOPSIDED:
        pe = m["empate"]
        if real and real[0].get("empate"):
            dec_e = real[0]["empate"]; fuente_e, est_e = f"Caliente/casas vía {real[1]}", "REAL"
        else:
            dec_e = round(max(0.92 / pe, 1.04), 2); fuente_e, est_e = F_EST, "EST"
        opciones.append({"desc": f"Empate {L} vs {V} ({fecha[5:]})", "tipo": "1X2",
                         "dec": dec_e, "prob": pe, "fecha": fecha, "fuente": fuente_e, "est": est_e})
    PARTIDOS.append({"num": p["num"], "fecha": fecha, "opciones": opciones, "cerrado": fav_p < LOPSIDED})

NP = len(PARTIDOS)  # 24


def main():
    os.makedirs(ENT, exist_ok=True)
    rng = random.Random(2026)
    cand = {}
    intentos = 0
    while len(cand) < 4000 and intentos < 1_500_000:
        intentos += 1
        k = rng.randint(16, 18)
        idxs = rng.sample(range(NP), k)
        combo = []
        for j in idxs:
            ops = PARTIDOS[j]["opciones"]
            if len(ops) == 1:
                combo.append((j, 0))
            else:
                # elegir ganador o empate ponderado por probabilidad
                w = [o["prob"] for o in ops]
                combo.append((j, rng.choices(range(len(ops)), weights=w)[0]))
        key = tuple(sorted(combo))
        if key in cand:
            continue
        mult = 1.0
        prob = 1.0
        for (j, oi) in combo:
            o = PARTIDOS[j]["opciones"][oi]
            mult *= o["dec"]; prob *= o["prob"]
        if mult >= 7000:
            cand[key] = (prob, mult, combo)

    valid = sorted(cand.values(), key=lambda t: -t[0])  # más probable primero
    if len(valid) < 74:
        raise SystemExit(f"solo {len(valid)} combinaciones ≥7000x")
    top = valid[:74]
    por_pago = sorted(range(74), key=lambda i: -top[i][1])
    tier_de = {}
    for rank, i in enumerate(por_pago):
        tier_de[i] = "LOTERÍA MÁXIMA" if rank < 15 else ("SÚPER SOÑADOR" if rank < 30 else "SOÑADOR")
    orden = {"SOÑADOR": 0, "SÚPER SOÑADOR": 1, "LOTERÍA MÁXIMA": 2}
    sel = sorted(((tier_de[i],) + top[i] for i in range(74)), key=lambda t: (orden[t[0]], -t[2]))

    boletos = []
    for n, (tier, prob, mult, combo) in enumerate(sel, start=1):
        emoji = {"SOÑADOR": "🌙", "SÚPER SOÑADOR": "🚀", "LOTERÍA MÁXIMA": "🎰"}[tier]
        patas = []
        for (j, oi) in sorted(combo):
            o = PARTIDOS[j]["opciones"][oi]
            patas.append({"descripcion": o["desc"], "mercado": "Resultado 1X2",
                          "momio_decimal": o["dec"], "momio_americano": amer(o["dec"]),
                          "prob_real": o["prob"], "fuente": o["fuente"], "estatus": o["est"],
                          "es_empate": o["desc"].startswith("Empate")})
        boletos.append({
            "boleto": n, "tier": tier, "emoji": emoji, "casa": "Caliente", "apuesta_mxn": 5,
            "patas": patas, "n_patas": len(patas),
            "multiplicador": round(mult, 2), "pago_potencial_mxn": round(5 * mult, 2),
            "prob_real": prob, "uno_entre": round(1 / prob),
            "empates": sum(1 for x in patas if x["es_empate"]),
            "tiene_momios_pendientes": any(x["estatus"] == "EST" for x in patas),
            "fecha_ultima_pata": max(PARTIDOS[j]["fecha"] for (j, oi) in combo),
        })

    p_no = 1.0
    for b in boletos:
        p_no *= (1 - b["prob_real"])
    p_alg = 1 - p_no
    tot_emp = sum(b["empates"] for b in boletos)
    resumen = {
        "presupuesto_mxn": 370, "total_boletos": 74, "total_mxn": 370,
        "mercado": "1X2 de la Jornada 1 — GANADORES y EMPATES (empate solo en partidos cerrados)",
        "estructura": dict(Counter(b["tier"] for b in boletos)),
        "pago_min_mxn": min(b["pago_potencial_mxn"] for b in boletos),
        "pago_max_mxn": max(b["pago_potencial_mxn"] for b in boletos),
        "total_empates_en_portafolio": tot_emp,
        "p_al_menos_uno_pegue": round(p_alg, 6),
        "uno_entre_global": round(1 / p_alg) if p_alg else None,
        "nota": ("Mezcla realista de ganadores y empates: el empate se permite SOLO en partidos "
                 "cerrados (favorito <62%); en lopsided (Alemania, España, etc.) solo gana el "
                 "favorito. Panamá corregido a Ghana. 16-18 aciertos por boleto: "
                 f"P(que CUALQUIERA pegue) ~{p_alg:.3%}. Entretenimiento, no inversión."),
    }
    json.dump({"resumen": resumen, "boletos": boletos},
              open(os.path.join(ENT, "parlays.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print(json.dumps(resumen, ensure_ascii=False, indent=2))

    nombres = {"SOÑADOR": "🌙 44 SOÑADOR — las más probables",
               "SÚPER SOÑADOR": "🚀 15 SÚPER",
               "LOTERÍA MÁXIMA": "🎰 15 LOTERÍA (máximo pago)"}
    Lns = ["# PORTAFOLIO J1 — 74 parlays 1X2 (ganadores y empates) · Mundial 2026",
           "",
           "**$370 · 74 boletos × $5 · Caliente · 16-18 resultados de la Jornada 1 · TODOS pagan >$35,000**",
           "",
           "## ⚠️ HONESTIDAD",
           f"- Mezcla realista: GANADORES + EMPATES (el empate solo en partidos cerrados; en Alemania/España/Argentina/etc. solo gana el favorito).",
           f"- P(que CUALQUIERA de los 74 pegue): **~{p_alg:.3%} ≈ 1 entre {round(1/p_alg):,}**. Son 16-18 aciertos seguidos.",
           "- Panamá corregido a Ghana. Momios `EST` = PENDIENTE-CAPTURA en Caliente. Lo más probable es perder los $370.",
           ""]
    for tier in ("SOÑADOR", "SÚPER SOÑADOR", "LOTERÍA MÁXIMA"):
        Lns.append(f"\n## {nombres[tier]}\n")
        for b in [b for b in boletos if b["tier"] == tier]:
            Lns.append(f"### {b['emoji']} #{b['boleto']} — {b['n_patas']} patas ({b['empates']} empates) — "
                       f"{b['multiplicador']:,.0f}x → **${b['pago_potencial_mxn']:,.0f}** · ~1 entre {b['uno_entre']:,}")
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
