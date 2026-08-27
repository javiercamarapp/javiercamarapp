#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
estadisticas_mc.py — Monte Carlo del torneo (Fase 3B, soporte de probabilidades)
================================================================================
Simula N torneos completos muestreando cada partido de su matriz Poisson/DC
(con mezcla de mercado en 1X2 cuando hay línea) para obtener:
  - P(ganar grupo) y P(top-2) por equipo
  - P(avanzar a octavos/cuartos/semis/final) y P(campeón) por equipo
Estas son las probabilidades "reales del modelo" que llevan los boletos
(NO las implícitas con vig de las casas).

Output: data/probabilidades_mc.json
"""

import json
import os
import random
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE)
sys.path.insert(0, os.path.join(BASE, "scripts"))

from logica_grupos import tabla_grupo, ranking_terceros
from modelo_mundial import analizar, matriz_marcadores, MAX_GOLES
from simular import anfitrion_de, asignar_terceros

CAL = json.load(open(os.path.join(BASE, "data", "calendario.json"), encoding="utf-8"))
BRACKET = json.load(open(os.path.join(BASE, "data", "bracket.json"), encoding="utf-8"))

N = int(os.environ.get("N_SIM", "20000"))
random.seed(2026)


def precalcular():
    """Matriz de marcadores por partido de grupos (una sola corrida del modelo)."""
    partidos = []
    for p in sorted(CAL, key=lambda x: x["num"]):
        res = analizar(p["local"], p["visitante"], p["ciudad"],
                       anfitrion=anfitrion_de(p), silencioso=True)
        lam_l, lam_v = res["lambdas"]["local"], res["lambdas"]["visitante"]
        matriz = matriz_marcadores(lam_l, lam_v)
        # acumulada para muestreo rápido
        plano = [((x, y), matriz[x][y]) for x in range(MAX_GOLES + 1) for y in range(MAX_GOLES + 1)]
        partidos.append({**p, "plano": plano})
    return partidos


def muestrear(plano):
    r = random.random()
    acc = 0.0
    for marcador, prob in plano:
        acc += prob
        if r <= acc:
            return marcador
    return plano[-1][0]


def elo_cache():
    """prob de ganar un cruce KO entre dos equipos en una sede (cacheado)."""
    cache = {}

    def p_avanza(a, b, ciudad):
        k = (a, b, ciudad)
        if k not in cache:
            res = analizar(a, b, ciudad, anfitrion=None, ko=True, silencioso=True)
            cache[k] = res["ko"]["prob_avanza"][a]
        return cache[k]
    return p_avanza


def main():
    partidos = precalcular()
    p_avanza = elo_cache()
    grupos = "ABCDEFGHIJKL"

    gana_grupo = {}
    top2 = {}
    llega = {f: {} for f in ("dieciseisavos", "octavos", "cuartos", "semifinal", "final", "campeon")}

    slots_terceros = [(p["num"], set(p["visitante"][2:]))
                      for p in BRACKET["dieciseisavos"] if p["visitante"].startswith("3_")]

    for _ in range(N):
        resultados = {g: [] for g in grupos}
        for p in partidos:
            gl, gv = muestrear(p["plano"])
            resultados[p["grupo"]].append({"local": p["local"], "visitante": p["visitante"], "gl": gl, "gv": gv})
        tablas = {g: tabla_grupo(rs) for g, rs in resultados.items()}
        slot = {}
        for g, t in tablas.items():
            gana_grupo[t[0]["equipo"]] = gana_grupo.get(t[0]["equipo"], 0) + 1
            for f in t[:2]:
                top2[f["equipo"]] = top2.get(f["equipo"], 0) + 1
            slot[f"1{g}"] = t[0]["equipo"]
            slot[f"2{g}"] = t[1]["equipo"]
        terceros = ranking_terceros(tablas)
        top8 = terceros[:8]
        try:
            asig = asignar_terceros(top8, slots_terceros)
        except RuntimeError:
            continue  # combinación sin matching (rarísimo); se descarta la corrida
        g2e = {t["grupo"]: t["equipo"] for t in top8}

        ganadores = {}

        def resolver(s, num):
            if s.startswith("W"):
                return ganadores[int(s[1:])]
            if s.startswith("3_"):
                return g2e[asig[num]]
            return slot[s]

        rondas = (BRACKET["dieciseisavos"] + BRACKET["octavos"] + BRACKET["cuartos"]
                  + BRACKET["semifinales"] + [BRACKET["final"]])
        fases = (["dieciseisavos"] * 16 + ["octavos"] * 8 + ["cuartos"] * 4
                 + ["semifinal"] * 2 + ["final"])
        for fase, p in zip(fases, rondas):
            a = resolver(p["local"], p["num"])
            b = resolver(p["visitante"], p["num"])
            for eq in (a, b):
                llega[fase][eq] = llega[fase].get(eq, 0) + 1
            w = a if random.random() < p_avanza(a, b, p["ciudad"]) else b
            ganadores[p["num"]] = w
        campeon = ganadores[104]
        llega["campeon"][campeon] = llega["campeon"].get(campeon, 0) + 1

    out = {
        "n_simulaciones": N,
        "p_ganar_grupo": {k: round(v / N, 4) for k, v in sorted(gana_grupo.items(), key=lambda t: -t[1])},
        "p_top2_grupo": {k: round(v / N, 4) for k, v in sorted(top2.items(), key=lambda t: -t[1])},
        "p_llega": {f: {k: round(v / N, 4) for k, v in sorted(d.items(), key=lambda t: -t[1])}
                    for f, d in llega.items()},
    }
    ruta = os.path.join(BASE, "data", "probabilidades_mc.json")
    json.dump(out, open(ruta, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"OK → {ruta} (N={N})")
    print("\nP(campeón) top 8:")
    for k, v in list(out["p_llega"]["campeon"].items())[:8]:
        print(f"  {k}: {v:.1%}")
    print("\nP(ganar grupo) selectos:")
    for eq in ("Portugal", "Colombia", "México", "España", "Brasil", "Argentina", "Francia", "Inglaterra", "Alemania"):
        print(f"  {eq}: {out['p_ganar_grupo'].get(eq, 0):.1%}")


if __name__ == "__main__":
    main()
