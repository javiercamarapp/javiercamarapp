#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generar_parlays.py — Fase 3B: portafolio de 100 boletos de $5 MXN (60/20/20).
==============================================================================
REGLAS (CLAUDE.md + decisiones de Javier en compuertas):
- Todos los boletos van a CALIENTE (mínimo $5 confirmado; el de Draftea NO se
  confirmó → regla derivada del proyecto). Máx 8 selecciones por boleto.
- Momios: REAL = momio encontrado con fuente (data/momios_mx.json).
  EST = estimado del modelo (1X2: 0.92/p; marcador exacto: 0.86/p, factor
  calibrado con el único exacto real hallado: México 1-0 a 6.50 vs modelo
  p=13.3% → 6.50×0.133/0.86≈1) y SIEMPRE marcado PENDIENTE-CAPTURA.
  Javier valida los EST en la app antes de apostar (decisión Compuerta 1).
- prob_real de cada pata: mezcla 50/50 modelo+mercado si hay línea; si no,
  modelo puro (Poisson/DC o Monte Carlo de 20k torneos para grupos/campeón).
- Diversificación: ningún evento >30% de los boletos de su tier; patas
  repartidas entre jornadas/fases.
- No se combinan en un mismo boleto patas correlacionadas del mismo equipo
  (ganador de grupo + partido del mismo equipo) para evitar rechazo de la casa.

Output: entregables/parlays.json + entregables/PORTAFOLIO_100_PARLAYS.md
"""

import itertools
import json
import os
from collections import Counter

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENT = os.path.join(BASE, "entregables")

F_FLASH = "https://www.flashscore.com.ar/noticias/futbol-campeonato-del-mundo-previa-de-apuestas-del-grupo-k-del-mundial-2026-pronosticos-cuotas-y-mejores-apuestas/IaFwVKqn/"
F_LSR = "https://www.legalsportsreport.com/odds/world-cup/"
F_SQK = "https://www.squawka.com/us/news/world-cup/"
F_CAL = "https://www.caliente.mx/mas/mundial/favoritos-a-ganar/"
F_GAM = "https://www.gambling.com/mx/news/mexico-vs-sudafrica-mundial-2026"
F_SI = "https://www.si.com/betting/2026-world-cup-odds-and-best-bets-to-win-every-group-colombia-paraguay-and-egypt-are-great-plus-money-plays-01ktmbkgc6pj"
F_COV = "https://www.covers.com/world-cup/odds"
F_ESPN = "https://www.espn.com/espn/betting/story/_/id/48386952/espn-soccer-futbol-world-cup-betting-odds-championship-groups"
F_SC = "https://www.sportscasting.com/news/world-cup-2026-group-c-odds-predictions/"
F_FOXG = "https://www.foxsports.com/stories/soccer/soccer-2026-world-cup-odds-golden-boot"
F_MODELO = "EST modelo Elo→Poisson (data/predicciones_104.json / probabilidades_mc.json) — PENDIENTE-CAPTURA en Caliente"

def leg(id_, desc, mercado, dec, prob, fecha, jornada, equipo, fuente, estatus="REAL"):
    am = round((dec - 1) * 100) if dec >= 2 else round(-100 / (dec - 1))
    return {"id": id_, "descripcion": desc, "mercado": mercado, "momio_decimal": dec,
            "momio_americano": f"{'+' if am>0 else ''}{am}", "prob_real": prob,
            "fecha_resolucion": fecha, "jornada": jornada, "equipo_clave": equipo,
            "fuente": fuente, "estatus": estatus}

# ───────────────────────── CATÁLOGO DE PATAS ─────────────────────────
# Conservadoras (momio REAL, favoritos)
C = [
    leg("ML_MEX_J1", "México gana a Sudáfrica (11-jun, Azteca)", "1X2", 1.38, 0.671, "2026-06-11", "J1", "México", f"Caliente vía {F_GAM}"),
    leg("ML_SUI_J1", "Suiza gana a Catar (13-jun, SF)", "1X2", 1.30, 0.64, "2026-06-13", "J1", "Suiza", f"bet365 vía {F_SQK}match-preview-qatar-vs-switzerland-06-13-26-world-cup-2026/"),
    leg("ML_BRA_J1", "Brasil gana a Marruecos (13-jun, NY)", "1X2", 1.57, 0.55, "2026-06-13", "J1", "Brasil", f"bet365 vía {F_SQK}match-preview-brazil-vs-morocco-06-13-26-world-cup-2026/"),
    leg("ML_ESC_J1", "Escocia gana a Haití (13-jun, Boston)", "1X2", 1.44, 0.61, "2026-06-13", "J1", "Escocia", f"bet365 vía {F_SQK}match-preview-haiti-vs-scotland-06-13-26-world-cup-2026/"),
    leg("ML_ESP_J1", "España gana a Cabo Verde (15-jun, Atlanta)", "1X2", 1.09, 0.84, "2026-06-15", "J1", "España", "US books vía https://www.vegasodds.com/predictions/soccer/spain-vs-cape-verde-world-cup-picks-odds-preview-jun-15/ (mercado parcial)"),
    leg("ML_ARG_J1", "Argentina gana a Argelia (16-jun, KC)", "1X2", 1.42, 0.68, "2026-06-16", "J1", "Argentina", f"bet365 vía {F_SQK}match-preview-argentina-vs-algeria-06-16-26-world-cup-2026/"),
    leg("ML_FRA_J1", "Francia gana a Senegal (16-jun, NY)", "1X2", 1.44, 0.67, "2026-06-16", "J1", "Francia", f"bet365 vía {F_SQK}match-preview-france-vs-senegal-06-16-26-world-cup-2026/"),
    leg("ML_COL_J1", "Colombia gana a Uzbekistán (17-jun, CDMX)", "1X2", 1.43, 0.71, "2026-06-17", "J1", "Colombia", "consenso US books vía espn.com/soccer/odds (de-vig -230)"),
    leg("ML_CAN_J1", "Canadá gana a Bosnia (12-jun, Toronto)", "1X2", 1.83, 0.55, "2026-06-12", "J1", "Canadá", F_COV + "canada-odds"),
    leg("GW_ESP", "España gana el Grupo H (def. 26-jun)", "Ganador de grupo", 1.24, 0.851, "2026-06-26", "J3", "España", f"US books -425 vía {F_SI}"),
    leg("GW_BRA", "Brasil gana el Grupo C (def. 24-jun)", "Ganador de grupo", 1.29, 0.647, "2026-06-24", "J3", "Brasil", f"US books -350 vía {F_SC}"),
    leg("GW_ARG", "Argentina gana el Grupo J (def. 27-jun)", "Ganador de grupo", 1.34, 0.795, "2026-06-27", "J3", "Argentina", f"US books -290 vía {F_ESPN}"),
    leg("GW_FRA", "Francia gana el Grupo I (def. 26-jun)", "Ganador de grupo", 1.48, 0.637, "2026-06-26", "J3", "Francia", f"US books -210 vía {F_COV}"),
    leg("GW_MEX", "México gana el Grupo A (def. 24-jun)", "Ganador de grupo", 1.83, 0.60, "2026-06-24", "J3", "México", f"US books -120 vía {F_LSR}group-a/ (Polymarket 57%)"),
    leg("GW_POR", "Portugal gana el Grupo K (def. 27-jun)", "Ganador de grupo", 1.65, 0.52, "2026-06-27", "J3", "Portugal", f"Flashscore 1.65 ({F_FLASH}); US books -200/-210"),
    # EST J2 para repartir jornadas (PENDIENTE-CAPTURA)
    leg("ML_BRA_J2", "Brasil gana a Haití (19-jun, Boston)", "1X2", 1.16, 0.79, "2026-06-19", "J2", "Brasil", F_MODELO, "EST"),
    leg("ML_ESP_J2", "España gana a Arabia Saudita (21-jun)", "1X2", 1.12, 0.82, "2026-06-21", "J2", "España", F_MODELO, "EST"),
    leg("ML_FRA_J2", "Francia gana a Irak (22-jun)", "1X2", 1.18, 0.78, "2026-06-22", "J2", "Francia", F_MODELO, "EST"),
    leg("ML_ING_J2", "Inglaterra gana a Ghana (23-jun)", "1X2", 1.16, 0.79, "2026-06-23", "J2", "Inglaterra", F_MODELO, "EST"),
    leg("ML_ARG_J2", "Argentina gana a Austria (22-jun)", "1X2", 1.30, 0.71, "2026-06-22", "J2", "Argentina", F_MODELO, "EST"),
    leg("ML_MEX_J2", "México gana a Corea del Sur (18-jun)", "1X2", 1.61, 0.57, "2026-06-18", "J2", "México", F_MODELO, "EST"),
    leg("ML_HOL_J2", "Holanda gana a Suecia (20-jun)", "1X2", 1.46, 0.63, "2026-06-20", "J2", "Holanda", F_MODELO, "EST"),
    leg("ML_POR_J2", "Portugal gana a Uzbekistán (23-jun)", "1X2", 1.30, 0.71, "2026-06-23", "J2", "Portugal", F_MODELO, "EST"),
    leg("ML_COL_J2", "Colombia gana a RD Congo (23-jun)", "1X2", 1.24, 0.74, "2026-06-23", "J2", "Colombia", F_MODELO, "EST"),
]
# Boosters medios (momio +150 a +600)
M = [
    leg("COL_K", "Colombia gana el Grupo K (def. 27-jun) — TESIS", "Ganador de grupo", 3.50, 0.42, "2026-06-27", "J3", "Colombia", f"Flashscore 3.50 ({F_FLASH}); US books +200/+225 ({F_LSR}group-k/)"),
    leg("X_USA_J1", "Empate EUA vs Paraguay (12-jun, LA)", "1X2 empate", 3.40, 0.28, "2026-06-12", "J1", "Estados Unidos", f"bet365 vía {F_SQK}match-preview-united-states-vs-paraguay-06-12-26-world-cup-2026/"),
    leg("ML_ING_J1", "Inglaterra gana a Croacia (17-jun, Dallas)", "1X2", 1.72, 0.48, "2026-06-17", "J1", "Inglaterra", f"bet365 vía {F_SQK}match-preview-england-vs-croatia-06-17-26-world-cup-2026/"),
    leg("CAMP_ESP", "España CAMPEONA del Mundial (19-jul)", "Campeón", 5.00, 0.212, "2026-07-19", "KO", "España", f"Caliente +400 ({F_CAL})"),
    leg("CAMP_FRA", "Francia CAMPEONA del Mundial (19-jul)", "Campeón", 6.00, 0.124, "2026-07-19", "KO", "Francia", "BetMGM +500 vía foxsports.com"),
    leg("CAMP_ARG", "Argentina CAMPEONA del Mundial (19-jul)", "Campeón", 8.50, 0.141, "2026-07-19", "KO", "Argentina", f"Caliente +750 ({F_CAL})"),
    leg("BOTA_MBA", "Mbappé Bota de Oro (19-jul)", "Goleador del torneo", 7.00, 0.165, "2026-07-19", "KO", "Francia", f"{F_FOXG} (+600); Polymarket 16-17%"),
    leg("X_ECU_ALE", "Empate Ecuador vs Alemania (25-jun)", "1X2 empate", 4.10, 0.29, "2026-06-25", "J3", "Ecuador", F_MODELO, "EST"),
]
# Marcadores exactos (jackpot). Solo MEX 1-0 J1 tiene momio REAL (bet365 6.50).
def ex(id_, desc, p, fecha, j, eq, dec_real=None, fuente_real=None):
    dec = dec_real if dec_real else round(0.86 / p, 2)
    return leg(id_, desc, "Marcador exacto", dec, p, fecha, j, eq,
               fuente_real or F_MODELO, "REAL" if dec_real else "EST")

X = [
    ex("EX_MEX20_J1", "México 2-0 Sudáfrica (11-jun)", 0.137, "2026-06-11", "J1", "México"),
    ex("EX_MEX10_J1", "México 1-0 Sudáfrica (11-jun)", 0.133, "2026-06-11", "J1", "México", 6.50,
       "bet365 +550 vía mediotiempo.com (ÚNICO marcador exacto con momio real encontrado)"),
    ex("EX_ESP20_J1", "España 2-0 Cabo Verde (15-jun)", 0.202, "2026-06-15", "J1", "España"),
    ex("EX_ALE20_J1", "Alemania 2-0 Curazao (14-jun)", 0.170, "2026-06-14", "J1", "Alemania"),
    ex("EX_FRA20_J1", "Francia 2-0 Senegal (16-jun)", 0.148, "2026-06-16", "J1", "Francia"),
    ex("EX_ARG20_J1", "Argentina 2-0 Argelia (16-jun)", 0.151, "2026-06-16", "J1", "Argentina"),
    ex("EX_POR20_J1", "Portugal 2-0 RD Congo (17-jun)", 0.148, "2026-06-17", "J1", "Portugal"),
    ex("EX_COL20_J1", "Colombia 2-0 Uzbekistán (17-jun)", 0.170, "2026-06-17", "J1", "Colombia"),
    ex("EX_BRA10_J1", "Brasil 1-0 Marruecos (13-jun)", 0.129, "2026-06-13", "J1", "Brasil"),
    ex("EX_HOL10_J1", "Holanda 1-0 Japón (14-jun)", 0.128, "2026-06-14", "J1", "Holanda"),
    ex("EX_URU10_J1", "Uruguay 1-0 Arabia Saudita (15-jun)", 0.125, "2026-06-15", "J1", "Uruguay"),
    ex("EX_BRA20_J2", "Brasil 2-0 Haití (19-jun)", 0.183, "2026-06-19", "J2", "Brasil"),
    ex("EX_ESP20_J2", "España 2-0 Arabia Saudita (21-jun)", 0.197, "2026-06-21", "J2", "España"),
    ex("EX_FRA20_J2", "Francia 2-0 Irak (22-jun)", 0.177, "2026-06-22", "J2", "Francia"),
    ex("EX_ING20_J2", "Inglaterra 2-0 Ghana (23-jun)", 0.182, "2026-06-23", "J2", "Inglaterra"),
    ex("EX_ARG20_J2", "Argentina 2-0 Austria (22-jun)", 0.154, "2026-06-22", "J2", "Argentina"),
    ex("EX_POR20_J2", "Portugal 2-0 Uzbekistán (23-jun)", 0.153, "2026-06-23", "J2", "Portugal"),
    ex("EX_COL20_J2", "Colombia 2-0 RD Congo (23-jun)", 0.164, "2026-06-23", "J2", "Colombia"),
    ex("EX_ECU20_J2", "Ecuador 2-0 Curazao (20-jun)", 0.172, "2026-06-20", "J2", "Ecuador"),
    ex("EX_MEX10_J2", "México 1-0 Corea del Sur (18-jun)", 0.122, "2026-06-18", "J2", "México"),
    ex("EX_ARG20_J3", "Argentina 2-0 Jordania (27-jun)", 0.190, "2026-06-27", "J3", "Argentina"),
    ex("EX_ESP20_J3", "España 2-0 Uruguay (26-jun)", 0.155, "2026-06-26", "J3", "España"),
    ex("EX_BRA20_J3", "Brasil 2-0 Escocia (24-jun)", 0.153, "2026-06-24", "J3", "Brasil"),
    ex("EX_MEX20_J3", "México 2-0 Chequia (24-jun)", 0.135, "2026-06-24", "J3", "México"),
    ex("EX_ING20_J3", "Inglaterra 2-0 Panamá (27-jun)", 0.143, "2026-06-27", "J3", "Inglaterra"),
    ex("EX_CRO20_J3", "Croacia 2-0 Ghana (27-jun)", 0.159, "2026-06-27", "J3", "Croacia"),
    ex("EX_BEL20_J3", "Bélgica 2-0 Nueva Zelanda (26-jun)", 0.146, "2026-06-26", "J3", "Bélgica"),
    ex("EX_POR21_J3", "Portugal 2-1 Colombia (27-jun, Miami)", 0.138, "2026-06-27", "J3", "Portugal"),
]

POR_ID = {l["id"]: l for l in C + M + X}


import re


def _partido_de(l):
    """Identificador del PARTIDO (sin marcador): equipos+fecha."""
    d = re.sub(r"\b\d-\d\b", "", l["descripcion"])
    d = d.replace("gana a", "vs").replace("Empate", "")
    return (re.sub(r"\s+", " ", d).strip(), l["fecha_resolucion"])


def conflicto(ids):
    """Prohibido en un mismo boleto:
    1. dos mercados del MISMO partido (p.ej. dos marcadores exactos excluyentes,
       o 1X2 + exacto — Caliente los rechaza por relación);
    2. ganador-de-grupo/campeón/goleador + partido del mismo equipo;
    3. la tesis 'Colombia gana Grupo K' + cualquier pata del Portugal-Colombia
       (anticorrelación directa)."""
    legs = [POR_ID[i] for i in ids]
    partidos = [_partido_de(l) for l in legs if l["mercado"] in ("1X2", "1X2 empate", "Marcador exacto")]
    if len(partidos) != len(set(partidos)):
        return True
    equipos_futuro = [l["equipo_clave"] for l in legs if l["mercado"] in ("Ganador de grupo", "Campeón", "Goleador del torneo")]
    equipos_partido = [l["equipo_clave"] for l in legs if l["mercado"] in ("1X2", "1X2 empate", "Marcador exacto")]
    if set(equipos_futuro) & set(equipos_partido) or len(equipos_futuro) != len(set(equipos_futuro)):
        return True
    tiene_col_k = any(l["id"] == "COL_K" for l in legs)
    toca_por_col = any("Portugal" in l["descripcion"] and "Colombia" in l["descripcion"] for l in legs)
    return tiene_col_k and toca_por_col


def construir_tier(pool_ids, n_boletos, tam_min, tam_max, mult_min, mult_max, max_uso, extras=()):
    """Genera boletos combinando el pool, respetando multiplicador, conflicto
    y tope de uso por evento. Determinista: ordena candidatos por EV desc."""
    candidatos = []
    for k in range(tam_min, tam_max + 1):
        for combo in itertools.combinations(pool_ids, k):
            if conflicto(combo):
                continue
            mult = 1.0
            p = 1.0
            jornadas = set()
            for i in combo:
                l = POR_ID[i]
                mult *= l["momio_decimal"]
                p *= l["prob_real"]
                jornadas.add(l["jornada"])
            if not (mult_min <= mult <= mult_max):
                continue
            candidatos.append((mult * p, combo, mult, p, jornadas))
    candidatos.sort(key=lambda t: (-t[0], t[1]))
    uso = Counter()
    boletos = []
    # primera pasada: prioriza variedad de jornadas; segunda: completa
    for exigir_mix in (True, False):
        for ev, combo, mult, p, jors in candidatos:
            if len(boletos) >= n_boletos:
                break
            if exigir_mix and len(jors) < min(2, len(combo)):
                continue
            if any(uso[i] + 1 > max_uso for i in combo):
                continue
            if combo in [b[0] for b in boletos]:
                continue
            boletos.append((combo, mult, p))
            for i in combo:
                uso[i] += 1
        if len(boletos) >= n_boletos:
            break
    assert len(boletos) == n_boletos, f"solo {len(boletos)} boletos (pide {n_boletos})"
    return boletos


def empacar(tier, casa, boletos, num0):
    out = []
    for n, (combo, mult, p) in enumerate(boletos, start=num0):
        legs = [POR_ID[i] for i in combo]
        out.append({
            "boleto": n, "tier": tier, "casa": casa, "apuesta_mxn": 5,
            "patas": [{k: l[k] for k in ("descripcion", "mercado", "momio_decimal",
                                          "momio_americano", "prob_real", "fuente",
                                          "estatus", "fecha_resolucion")} for l in legs],
            "n_patas": len(legs),
            "multiplicador": round(mult, 2),
            "pago_potencial_mxn": round(5 * mult, 2),
            "prob_real": p,
            "uno_entre": round(1 / p),
            "tiene_momios_pendientes": any(l["estatus"] == "EST" for l in legs),
            "fecha_ultima_pata": max(l["fecha_resolucion"] for l in legs),
        })
    return out


def main():
    os.makedirs(ENT, exist_ok=True)
    cons_pool = [l["id"] for l in C]
    cons = construir_tier(cons_pool, 60, 2, 3, 1.5, 4.0, max_uso=18)

    medio_pool = [l["id"] for l in C if l["momio_decimal"] <= 1.6] + [l["id"] for l in M]
    medios = construir_tier(medio_pool, 20, 4, 6, 20.0, 300.0, max_uso=6)

    jack_pool = [l["id"] for l in X] + ["COL_K", "CAMP_ESP", "BOTA_MBA"]
    jacks = construir_tier(jack_pool, 20, 5, 7, 7000.0, 200000.0, max_uso=6)

    boletos = (empacar("CONSERVADOR", "Caliente", cons, 1)
               + empacar("MEDIO", "Caliente", medios, 61)
               + empacar("JACKPOT", "Caliente", jacks, 81))

    p_no_jackpot = 1.0
    for b in boletos:
        if b["tier"] == "JACKPOT":
            p_no_jackpot *= (1 - b["prob_real"])
    resumen = {
        "total_boletos": len(boletos), "total_mxn": 5 * len(boletos),
        "estructura": dict(Counter(b["tier"] for b in boletos)),
        "p_al_menos_un_jackpot": round(1 - p_no_jackpot, 6),
        "nota_honestidad": ("Los 20 jackpots usan en su mayoría momios EST del modelo "
                            "(PENDIENTE-CAPTURA). La prob. de que AL MENOS UNO pegue es "
                            f"~{1-p_no_jackpot:.2%} (cota superior por correlación entre boletos)."),
    }
    json.dump({"resumen": resumen, "boletos": boletos},
              open(os.path.join(ENT, "parlays.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print(json.dumps(resumen, ensure_ascii=False, indent=2))

    # ─────────── markdown ───────────
    L = ["# PORTAFOLIO DE 100 PARLAYS — Mundial 2026",
         "",
         f"**Generado:** 11-jun-2026 · **Inversión:** $500 MXN (100 boletos × $5) · **Casa:** Caliente",
         "(el mínimo de Draftea no se confirmó → regla del proyecto: todo a Caliente)",
         "",
         "## ⚠️ HONESTIDAD DE PROBABILIDAD",
         f"- P(≥1 jackpot pegue): **~{1-p_no_jackpot:.1%}** — los jackpots son tiros de ~1 entre 8,000 a 1 entre 100,000 CADA UNO.",
         "- Esto es ENTRETENIMIENTO con presupuesto cerrado de $500; no es inversión y no se promete ganancia.",
         "- Momios `EST` = estimación del modelo PENDIENTE de captura en la app de Caliente; el multiplicador real puede variar.",
         "- El bono parlay de fútbol de Caliente (hasta +100% sobre ganancias, aplica al Mundial) es upside NO contado en los pagos.",
         ""]
    for tier, titulo in (("CONSERVADOR", "60 CONSERVADORES (pago 1.5x–4x)"),
                         ("MEDIO", "20 MEDIOS (20x–300x)"),
                         ("JACKPOT", "20 JACKPOT (≥7,000x → $5 paga ≥$35,000)")):
        L.append(f"\n## {titulo}\n")
        for b in [b for b in boletos if b["tier"] == tier]:
            pend = " · ⚠️ momios EST pendientes de captura" if b["tiene_momios_pendientes"] else ""
            uno = f" · **~1 entre {b['uno_entre']:,}**" if tier == "JACKPOT" else f" · prob real ~{b['prob_real']:.1%}"
            L.append(f"### Boleto #{b['boleto']} — {b['casa']} — {b['n_patas']} patas — "
                     f"{b['multiplicador']:,.2f}x → ${b['pago_potencial_mxn']:,.0f} MXN{uno}{pend}")
            L.append(f"_Última pata se resuelve: {b['fecha_ultima_pata']}_")
            L.append("")
            L.append("| Pata | Mercado | Momio dec (amer) | Prob real | Estatus | Fuente |")
            L.append("|---|---|---|---|---|---|")
            for l in b["patas"]:
                fu = l["fuente"].split(" vía ")[-1][:80]
                L.append(f"| {l['descripcion']} | {l['mercado']} | {l['momio_decimal']} ({l['momio_americano']}) "
                         f"| {l['prob_real']:.1%} | {l['estatus']} | {fu} |")
            L.append("")
    open(os.path.join(ENT, "PORTAFOLIO_100_PARLAYS.md"), "w", encoding="utf-8").write("\n".join(L) + "\n")
    print(f"\nOK → {ENT}/parlays.json + PORTAFOLIO_100_PARLAYS.md")


if __name__ == "__main__":
    main()
