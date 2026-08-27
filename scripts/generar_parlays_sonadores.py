#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generar_parlays_sonadores.py — Portafolio SOÑADOR (decisión Javier, 11-jun).
============================================================================
$370 MXN = 74 boletos × $5. AHORA todos son moonshots: CADA boleto paga
>$35,000 MXN (multiplicador ≥7,000x). Estructura 60/20/20 como NIVELES DE
SUEÑO escalando el pago:
  - SOÑADOR (44, 60%):        7,000–30,000x   → $35k–$150k   (5–6 patas)
  - SÚPER SOÑADOR (15, 20%):  30,000–150,000x → $150k–$750k  (6–7 patas)
  - LOTERÍA MÁXIMA (15, 20%): 150,000–720,000x→ $750k–$3.6M  (7 patas)
Tope de pago de Caliente: $3,600,000 (= 720,000x sobre $5). Ningún boleto lo
rebasa por diseño.

Reutiliza el catálogo de patas de generar_parlays.py (marcadores exactos +
especiales), con sus momios y fuentes. La mayoría son EST/PENDIENTE-CAPTURA:
son tiros soñadores, hay que validarlos en la app de Caliente.
"""

import json
import os
import random
import re
from collections import Counter

import sys
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE, "scripts"))
from generar_parlays import X, POR_ID  # patas con momios REALES y especiales

ENT = os.path.join(BASE, "entregables")
PRED = json.load(open(os.path.join(BASE, "data", "predicciones_104.json"), encoding="utf-8"))

# ── Catálogo AMPLIADO de marcadores exactos: todos los partidos de grupos con
#    resultado NO empate (favorito claro). Momio EST = 0.86/p (mismo factor
#    calibrado con el único exacto REAL, México 1-0 a 6.50). PENDIENTE-CAPTURA.
F_MODELO = ("EST modelo Elo→Poisson (data/predicciones_104.json) — PENDIENTE-CAPTURA en Caliente")
EXACTOS_AMP = {}
for p in PRED["predicciones"]:
    if p["fase"] != "grupos" or p["gl"] == p["gv"]:
        continue
    pr = p["prob_marcador"]
    dec = round(0.86 / pr, 2)
    if not (4.0 <= dec <= 8.0):   # banda de momio razonable para soñadores
        continue
    gana = p["local"] if p["gl"] > p["gv"] else p["visitante"]
    idg = f"AMP_{p['num']}"
    am = round((dec - 1) * 100) if dec >= 2 else round(-100 / (dec - 1))
    EXACTOS_AMP[idg] = {
        "id": idg, "descripcion": f"{p['local']} {p['marcador']} {p['visitante']} ({p['fecha'][5:]})",
        "mercado": "Marcador exacto", "momio_decimal": dec, "momio_americano": f"+{am}",
        "prob_real": pr, "fecha_resolucion": p["fecha"], "jornada": "J%d" % p["jornada"],
        "equipo_clave": gana, "fuente": F_MODELO, "estatus": "EST",
    }
# La pata REAL (México 1-0 a 6.50) y los especiales vienen del catálogo original
REALES = {l["id"]: l for l in X if l["estatus"] == "REAL"}
ESPECIALES = ["COL_K", "CAMP_ESP", "CAMP_ARG", "BOTA_MBA"]
CATALOGO = {**EXACTOS_AMP, **REALES, **{i: POR_ID[i] for i in ESPECIALES}}
POR_ID = {**POR_ID, **CATALOGO}        # ampliar el índice global
POOL_IDS = list(CATALOGO.keys())

TOPE_PAGO = 3_600_000          # Caliente
TOPE_MULT = TOPE_PAGO / 5      # 720,000x

# (nombre, n_boletos, tam_min, tam_max, mult_min, mult_max, emoji)
TIERS = [
    ("SOÑADOR", 44, 5, 6, 7_000, 30_000, "🌙"),
    ("SÚPER SOÑADOR", 15, 6, 7, 30_000, 150_000, "🚀"),
    ("LOTERÍA MÁXIMA", 15, 7, 7, 150_000, TOPE_MULT, "🎰"),
]


def _match_key(l):
    if l["mercado"] not in ("1X2", "1X2 empate", "Marcador exacto"):
        return None
    d = re.sub(r"\b\d-\d\b", "", l["descripcion"]).replace("Empate", "")
    return (re.sub(r"\s+", " ", d).strip(), l["fecha_resolucion"])


# Precálculo de atributos por pata (conflicto rápido)
ATTR = {}
for i in POOL_IDS:
    l = POR_ID[i]
    es_futuro = l["mercado"] in ("Ganador de grupo", "Campeón", "Goleador del torneo")
    ATTR[i] = {"dec": l["momio_decimal"], "p": l["prob_real"],
               "match": _match_key(l), "team": l["equipo_clave"],
               "futuro": es_futuro,
               "por_col": ("Portugal" in l["descripcion"] and "Colombia" in l["descripcion"])}


def conflicto(combo):
    matches = [ATTR[i]["match"] for i in combo if ATTR[i]["match"]]
    if len(matches) != len(set(matches)):
        return True
    fut = {ATTR[i]["team"] for i in combo if ATTR[i]["futuro"]}
    par = {ATTR[i]["team"] for i in combo if not ATTR[i]["futuro"] and ATTR[i]["match"]}
    if fut & par or len(fut) != len({ATTR[i]["team"] for i in combo if ATTR[i]["futuro"]}):
        return True
    if any(i == "COL_K" for i in combo) and any(ATTR[i]["por_col"] for i in combo):
        return True
    return False


def construir_tier(n, tam_min, tam_max, mult_min, mult_max):
    """Muestreo determinista (semilla fija): con ~50 patas la enumeración total
    es inviable, así que se generan candidatos al azar, se filtran por banda de
    multiplicador y conflicto, y se eligen por probabilidad descendente."""
    rng = random.Random(2026 + int(mult_min))
    pool = POOL_IDS
    cands = {}
    intentos = 0
    objetivo = n * 80
    while len(cands) < objetivo and intentos < 600_000:
        intentos += 1
        tam = rng.randint(tam_min, tam_max)
        combo = tuple(sorted(rng.sample(pool, tam)))
        if combo in cands or conflicto(combo):
            continue
        mult = 1.0
        p = 1.0
        for i in combo:
            mult *= ATTR[i]["dec"]
            p *= ATTR[i]["p"]
        if mult_min <= mult <= mult_max:
            cands[combo] = (p, combo, mult)
    cands = sorted(cands.values(), key=lambda t: (-t[0], t[1]))
    max_uso = int(0.30 * n)
    uso = Counter()
    elegidos = []
    vistos = set()
    for exigir_mix in (True, False):       # 1ª pasada exige ≥2 jornadas distintas
        for p, combo, mult in cands:
            if len(elegidos) >= n:
                break
            if combo in vistos:
                continue
            jornadas = {POR_ID[i].get("fecha_resolucion") for i in combo}
            if exigir_mix and len(jornadas) < 2:
                continue
            if any(uso[i] + 1 > max_uso for i in combo):
                continue
            elegidos.append((combo, mult, p))
            vistos.add(combo)
            for i in combo:
                uso[i] += 1
        if len(elegidos) >= n:
            break
    if len(elegidos) < n:
        raise SystemExit(f"Solo {len(elegidos)}/{n} boletos en la banda {mult_min:,}-{mult_max:,}x")
    return elegidos


def empacar(tier, emoji, boletos, num0):
    out = []
    for n, (combo, mult, p) in enumerate(boletos, start=num0):
        legs = [POR_ID[i] for i in combo]
        pago = min(round(5 * mult, 2), TOPE_PAGO)
        out.append({
            "boleto": n, "tier": tier, "emoji": emoji, "casa": "Caliente", "apuesta_mxn": 5,
            "patas": [{k: l[k] for k in ("descripcion", "mercado", "momio_decimal",
                                          "momio_americano", "prob_real", "fuente",
                                          "estatus", "fecha_resolucion")} for l in legs],
            "n_patas": len(legs),
            "multiplicador": round(mult, 2),
            "pago_potencial_mxn": pago,
            "pago_topado": 5 * mult > TOPE_PAGO,
            "prob_real": p,
            "uno_entre": round(1 / p),
            "tiene_momios_pendientes": any(l["estatus"] == "EST" for l in legs),
            "fecha_ultima_pata": max(l["fecha_resolucion"] for l in legs),
        })
    return out


def main():
    os.makedirs(ENT, exist_ok=True)
    boletos = []
    num = 1
    for tier, n, tmin, tmax, mmin, mmax, emoji in TIERS:
        bs = construir_tier(n, tmin, tmax, mmin, mmax)
        boletos += empacar(tier, emoji, bs, num)
        num += n

    assert len(boletos) == 74
    p_no = 1.0
    for b in boletos:
        p_no *= (1 - b["prob_real"])
    p_alguno = 1 - p_no
    resumen = {
        "presupuesto_mxn": 370, "total_boletos": 74, "total_mxn": 5 * 74,
        "estructura": dict(Counter(b["tier"] for b in boletos)),
        "todos_pagan_min_mxn": min(b["pago_potencial_mxn"] for b in boletos),
        "pago_max_mxn": max(b["pago_potencial_mxn"] for b in boletos),
        "p_al_menos_uno_pegue": round(p_alguno, 7),
        "uno_entre_global": round(1 / p_alguno) if p_alguno else None,
        "nota": ("Portafolio SOÑADOR: los 74 boletos pagan >$35,000. Son moonshots "
                 "de marcadores exactos; casi todos sus momios son EST/PENDIENTE-CAPTURA "
                 "(validar en Caliente). La probabilidad de que CUALQUIERA pegue es "
                 f"~{p_alguno:.3%}. Entretenimiento, no inversión."),
    }
    json.dump({"resumen": resumen, "boletos": boletos},
              open(os.path.join(ENT, "parlays.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print(json.dumps(resumen, ensure_ascii=False, indent=2))

    # ───────── markdown ─────────
    L = ["# PORTAFOLIO SOÑADOR — 74 Parlays · Mundial 2026",
         "",
         f"**$370 MXN · 74 boletos × $5 · Casa: Caliente · TODOS pagan >$35,000**", "",
         "## ⚠️ ESTO ES UN SUEÑO, NO UN PLAN DE INVERSIÓN",
         f"- P(que CUALQUIERA de los 74 pegue): **~{p_alguno:.3%} ≈ 1 entre {round(1/p_alguno):,}**.",
         "- Cada boleto es un tiro de ~1 entre decenas de miles a **miles de millones**. Lo dice cada uno.",
         "- Casi todos los momios son `EST · PENDIENTE-CAPTURA` (marcadores exactos del modelo): "
         "valídalos en la app de Caliente; el multiplicador real puede cambiar.",
         "- El bono parlay de fútbol de Caliente (hasta +100%) es upside NO contado.",
         "- Lo más probable, por mucho, es perder los $370. Apuesta solo lo que estés dispuesto a soñar.",
         ""]
    nombres = {"SOÑADOR": "🌙 44 SOÑADORES ($35k–$150k)",
               "SÚPER SOÑADOR": "🚀 15 SÚPER SOÑADORES ($150k–$750k)",
               "LOTERÍA MÁXIMA": "🎰 15 LOTERÍA MÁXIMA ($750k–$3.6M)"}
    for tier, _, _, _, _, _, _ in TIERS:
        L.append(f"\n## {nombres[tier]}\n")
        for b in [b for b in boletos if b["tier"] == tier]:
            cap = " · ⚠️ pago TOPADO a $3.6M (tope Caliente)" if b["pago_topado"] else ""
            pend = " · momios EST por capturar" if b["tiene_momios_pendientes"] else ""
            L.append(f"### {b['emoji']} #{b['boleto']} — {b['n_patas']} patas — {b['multiplicador']:,.0f}x → "
                     f"**${b['pago_potencial_mxn']:,.0f} MXN** · ~1 entre {b['uno_entre']:,}{cap}{pend}")
            L.append(f"_Se resuelve a más tardar: {b['fecha_ultima_pata']}_\n")
            L.append("| Pata | Mercado | Momio | Prob | Estatus |")
            L.append("|---|---|---|---|---|")
            for l in b["patas"]:
                L.append(f"| {l['descripcion']} | {l['mercado']} | {l['momio_decimal']} ({l['momio_americano']}) "
                         f"| {l['prob_real']*100:.1f}% | {l['estatus']} |")
            L.append("")
    open(os.path.join(ENT, "PORTAFOLIO_74_SONADORES.md"), "w", encoding="utf-8").write("\n".join(L) + "\n")
    print(f"\nOK → entregables/parlays.json + PORTAFOLIO_74_SONADORES.md")


if __name__ == "__main__":
    main()
