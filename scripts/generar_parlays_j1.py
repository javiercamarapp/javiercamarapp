#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generar_parlays_j1.py — Portafolio de parlays SOLO con resultado 1X2 de la
Jornada 1 (decisión de Javier). Reemplaza los marcadores exactos.
==========================================================================
Spec (confirmado por Javier):
  - Cada pata = RESULTADO 1X2 (gana local / empate / gana visita) de un
    partido de la JORNADA 1 (24 partidos, 11-17 jun).
  - Máximo 16 selecciones por boleto.
  - $370 = 74 boletos × $5, estructura 60/20/20 (44/15/15) como niveles de
    sueño; TODOS pagan >$35,000 (≥7,000x).
  - Momios decimales: REAL de data/momios_mx.json donde existan; si no, EST
    = 0.92/prob (≈ con vig de casa) marcado PENDIENTE-CAPTURA.
  - prob_real de cada pata = prob del modelo (mezcla 50/50 donde hay mercado).
NOTA de diversificación: con solo 24 partidos de J1 y hasta 16 patas por
boleto, es IMPOSIBLE mantener cada partido bajo 30% de los boletos (cada
boleto usa más de la mitad de los 24 partidos). Esa regla se relaja por
decisión explícita de Javier (todo se juega en J1). En su lugar: todos los
boletos son DISTINTOS y se limita la repetición de una misma selección.
TODO el portafolio se resuelve a más tardar el 17-jun (sin cobertura entre
jornadas) — riesgo concentrado, declarado.
"""

import json
import math
import os
import random
import re
from collections import Counter

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENT = os.path.join(BASE, "entregables")
PRED = json.load(open(os.path.join(BASE, "data", "predicciones_104.json"), encoding="utf-8"))
MOM = json.load(open(os.path.join(BASE, "data", "momios_mx.json"), encoding="utf-8"))

TOPE_PAGO = 3_600_000
# (nombre, n, legs_min, legs_max, mult_min, mult_max, emoji)
TIERS = [
    ("SOÑADOR", 44, 10, 16, 7_000, 30_000, "🌙"),
    ("SÚPER SOÑADOR", 15, 12, 16, 30_000, 150_000, "🚀"),
    ("LOTERÍA MÁXIMA", 15, 14, 16, 150_000, 720_000, "🎰"),
]

# ── Índice de momios 1X2 REALES por partido ──
REAL = {}
for p in MOM["partidos"]:
    md = p.get("momios_decimal")
    if isinstance(md, dict) and all(k in md and md[k] for k in ("local", "empate", "visitante")):
        REAL[(p["local"], p["visitante"])] = (md, p.get("fuente", "data/momios_mx.json"))

F_EST = "EST modelo (data/predicciones_104.json), 0.92/prob ≈ con vig — PENDIENTE-CAPTURA en Caliente"


def amer(dec):
    return f"+{round((dec-1)*100)}" if dec >= 2 else f"{round(-100/(dec-1))}"


# ── Catálogo de patas: 1X2 de los 24 partidos de J1 ──
LEGS = {}
for p in PRED["predicciones"]:
    if p.get("fase") != "grupos" or p.get("jornada") != 1:
        continue
    L, V, fecha = p["local"], p["visitante"], p["fecha"]
    m = p["prob_mezcla"]
    real = REAL.get((L, V))
    for lado, etiqueta, prob in (("local", f"Gana {L}", m["local"]),
                                 ("empate", f"Empate {L} vs {V}", m["empate"]),
                                 ("visitante", f"Gana {V}", m["visitante"])):
        if real:
            dec = real[0][lado]
            fuente, estatus = f"Caliente/casas vía {real[1]}", "REAL"
        else:
            dec = round(max(0.92 / prob, 1.04), 2)
            fuente, estatus = F_EST, "EST"
        idg = f"{p['num']}_{lado}"
        LEGS[idg] = {"id": idg, "partido_num": p["num"],
                     "descripcion": f"{etiqueta} ({L} vs {V}, {fecha[5:]})",
                     "mercado": "Resultado 1X2", "seleccion": lado,
                     "momio_decimal": dec, "momio_americano": amer(dec),
                     "prob_real": prob, "fecha_resolucion": fecha,
                     "fuente": fuente, "estatus": estatus}

POOL = list(LEGS.keys())


def construir_tier(n, lmin, lmax, mmin, mmax, seed):
    rng = random.Random(seed)
    cands = {}
    intentos = 0
    while len(cands) < n * 50 and intentos < 800_000:
        intentos += 1
        k = rng.randint(lmin, lmax)
        # elegir k PARTIDOS distintos y una selección por partido
        partidos = rng.sample(range(1, 25), k)
        combo = []
        for pn in partidos:
            opciones = [f"{pn}_local", f"{pn}_empate", f"{pn}_visitante"]
            # peso: favorito alto, empate medio, sorpresa bajo (para variar momios)
            pesos = [LEGS[o]["prob_real"] ** 0.5 for o in opciones]
            combo.append(rng.choices(opciones, weights=pesos)[0])
        combo = tuple(sorted(combo))
        if combo in cands:
            continue
        mult = math.prod(LEGS[i]["momio_decimal"] for i in combo)
        if mmin <= mult <= mmax:
            p = math.prod(LEGS[i]["prob_real"] for i in combo)
            cands[combo] = (p, combo, mult)
    cands = sorted(cands.values(), key=lambda t: (-t[0], t[1]))
    # elegir n, evitando repetir demasiado una misma selección
    max_sel = max(int(0.5 * n), 6)
    uso = Counter()
    elegidos = []
    for exigir in (True, False):
        for p, combo, mult in cands:
            if len(elegidos) >= n:
                break
            if exigir and any(uso[i] + 1 > max_sel for i in combo):
                continue
            elegidos.append((combo, mult, p))
            for i in combo:
                uso[i] += 1
        if len(elegidos) >= n:
            break
    if len(elegidos) < n:
        raise SystemExit(f"Solo {len(elegidos)}/{n} en banda {mmin}-{mmax}")
    return elegidos


def empacar(tier, emoji, boletos, num0):
    out = []
    for n, (combo, mult, p) in enumerate(boletos, start=num0):
        legs = [LEGS[i] for i in combo]
        out.append({
            "boleto": n, "tier": tier, "emoji": emoji, "casa": "Caliente", "apuesta_mxn": 5,
            "patas": [{k: l[k] for k in ("descripcion", "mercado", "momio_decimal",
                                          "momio_americano", "prob_real", "fuente",
                                          "estatus", "fecha_resolucion")} for l in legs],
            "n_patas": len(legs),
            "multiplicador": round(mult, 2),
            "pago_potencial_mxn": min(round(5 * mult, 2), TOPE_PAGO),
            "pago_topado": 5 * mult > TOPE_PAGO,
            "prob_real": p, "uno_entre": round(1 / p),
            "tiene_momios_pendientes": any(l["estatus"] == "EST" for l in legs),
            "fecha_ultima_pata": max(l["fecha_resolucion"] for l in legs),
        })
    return out


def main():
    os.makedirs(ENT, exist_ok=True)
    boletos, num = [], 1
    for tier, n, lmin, lmax, mmin, mmax, emoji in TIERS:
        bs = construir_tier(n, lmin, lmax, mmin, mmax, 2026 + mmin)
        boletos += empacar(tier, emoji, bs, num)
        num += n
    assert len(boletos) == 74

    p_no = 1.0
    for b in boletos:
        p_no *= (1 - b["prob_real"])
    p_alg = 1 - p_no
    resumen = {
        "presupuesto_mxn": 370, "total_boletos": 74, "total_mxn": 370,
        "mercado": "Resultado 1X2 (gana/empata) — SOLO Jornada 1 (11-17 jun)",
        "max_selecciones": 16,
        "estructura": dict(Counter(b["tier"] for b in boletos)),
        "todos_pagan_min_mxn": min(b["pago_potencial_mxn"] for b in boletos),
        "pago_max_mxn": max(b["pago_potencial_mxn"] for b in boletos),
        "p_al_menos_uno_pegue": round(p_alg, 8),
        "uno_entre_global": round(1 / p_alg) if p_alg else None,
        "nota": ("Parlays SOLO de resultado 1X2 de la Jornada 1, ≤16 patas. Todos pagan "
                 ">$35,000. TODO se resuelve a más tardar el 17-jun (sin cobertura entre "
                 f"jornadas). P(que CUALQUIERA pegue) ~{p_alg:.4%}. Entretenimiento, no inversión."),
    }
    json.dump({"resumen": resumen, "boletos": boletos},
              open(os.path.join(ENT, "parlays.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print(json.dumps(resumen, ensure_ascii=False, indent=2))

    # markdown
    nombres = {"SOÑADOR": "🌙 44 SOÑADORES · $35k–$150k",
               "SÚPER SOÑADOR": "🚀 15 SÚPER SOÑADORES · $150k–$750k",
               "LOTERÍA MÁXIMA": "🎰 15 LOTERÍA MÁXIMA · $750k–$3.6M"}
    Lns = ["# PORTAFOLIO PARLAYS J1 — Mundial 2026",
           "",
           "**$370 MXN · 74 boletos × $5 · Caliente · solo RESULTADO 1X2 de la Jornada 1 · ≤16 patas · TODOS pagan >$35,000**",
           "",
           "## ⚠️ HONESTIDAD",
           f"- P(que CUALQUIERA de los 74 pegue): **~{p_alg:.3%} ≈ 1 entre {round(1/p_alg):,}**.",
           "- TODO se decide entre el 11 y 17 de junio (sin cobertura entre jornadas). Lo más probable es perder los $370.",
           "- Momios `EST` = estimación del modelo (PENDIENTE-CAPTURA en Caliente). Valídalos antes de apostar.",
           ""]
    for tier, _, _, _, _, _, _ in TIERS:
        Lns.append(f"\n## {nombres[tier]}\n")
        for b in [b for b in boletos if b["tier"] == tier]:
            pend = " · momios EST por capturar" if b["tiene_momios_pendientes"] else ""
            Lns.append(f"### {b['emoji']} #{b['boleto']} — {b['n_patas']} patas — {b['multiplicador']:,.0f}x → "
                       f"**${b['pago_potencial_mxn']:,.0f} MXN** · ~1 entre {b['uno_entre']:,}{pend}")
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
