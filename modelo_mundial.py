#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
modelo_mundial.py — v2 RECONSTRUIDO (11-jun-2026)
=================================================
Modelo Elo→Poisson para el Mundial 2026, reconstruido desde cero porque el
activo original no existía en el repo (decisión de Javier, 11-jun-2026).

Diferencias documentadas vs el v2 descrito en CLAUDE.md:
  - SIN flag --live: The Odds API está bloqueada por la política de red del
    entorno ("Host not in allowlist"). El anclaje a mercado se hace vía
    data/momios_mx.json (momios investigados por WebSearch o capturas de
    Javier, cada uno con fuente).
  - El snapshot horneado del 8-jun NO era reproducible; los momios de mercado
    se cargan del archivo anterior cuando existen para el partido. Si no hay
    línea, el output lo marca "sin línea de mercado".

Datos:
  - Elo: data/equipos_elo.json (12 anclados de CLAUDE.md 8-jun-2026; resto
    investigado/estimado con fuente etiquetada).
  - Sedes: data/sedes.json (altitud, domo, riesgo de calor).

Ajustes (idénticos a la spec de CLAUDE.md):
  - Localía: +80 Elo (equipo anfitrión jugando en su país; flag --local).
  - Altura: -80 si sede ≥2000 m, -40 si 1500–2000 m, para equipos NO
    adaptados a altura. Los domos/techos neutralizan el ajuste de calor.
  - Calor: -30 para equipos no adaptados al calor en sedes de riesgo alto
    sin techo.

Uso:
  python3 modelo_mundial.py "Local" "Visita" "Sede" [--local Equipo] [--ko]
  python3 modelo_mundial.py            → smoke-test (México vs Sudáfrica, Azteca)
"""

import argparse
import json
import math
import os
import sys
import unicodedata

BASE = os.path.dirname(os.path.abspath(__file__))
RUTA_ELO = os.path.join(BASE, "data", "equipos_elo.json")
RUTA_SEDES = os.path.join(BASE, "data", "sedes.json")
RUTA_MOMIOS = os.path.join(BASE, "data", "momios_mx.json")

# Goles totales esperados de base en un partido parejo de Mundial.
# Promedio histórico Qatar 2022: 2.69 goles/partido (fuente: FIFA, conteo
# oficial 172 goles / 64 partidos). Usamos 2.60 por sesgo conservador de
# fase de grupos con 48 equipos y calor de verano.
GOLES_BASE_TOTAL = 2.60
MAX_GOLES = 8          # matriz Poisson 0..8 por equipo
RHO_DIXON_COLES = -0.10  # corrección de dependencia en marcadores bajos

# Países adaptados a ALTURA (≥1500m habitual: liga o capital en altura)
ADAPTADOS_ALTURA = {"mexico", "ecuador", "colombia", "bolivia", "sudafrica"}
# Países adaptados a CALOR extremo de verano
ADAPTADOS_CALOR = {
    "mexico", "qatar", "arabia saudita", "iran", "irak", "jordania",
    "tunez", "marruecos", "argelia", "egipto", "senegal", "costa de marfil",
    "ghana", "nigeria", "cabo verde", "curazao", "honduras", "panama",
    "paraguay", "brasil", "colombia", "ecuador", "haiti", "uzbekistan",
    "sudafrica", "australia", "emiratos arabes unidos",
}


def _norm(s: str) -> str:
    """Normaliza nombre: minúsculas, sin acentos."""
    s = unicodedata.normalize("NFD", s.strip().lower())
    return "".join(c for c in s if unicodedata.category(c) != "Mn")


ALIAS = {
    "paises bajos": "holanda",
    "netherlands": "holanda",
    "usa": "estados unidos",
    "eua": "estados unidos",
    "united states": "estados unidos",
    "south korea": "corea del sur",
    "corea": "corea del sur",
    "ivory coast": "costa de marfil",
    "cote d'ivoire": "costa de marfil",
    "czechia": "republica checa",
    "chequia": "republica checa",
}


def cargar_json(ruta, requerido=True):
    if not os.path.exists(ruta):
        if requerido:
            sys.exit(f"ERROR: falta {ruta}. Corre primero la fase de datos (ver TODO.md).")
        return None
    with open(ruta, encoding="utf-8") as f:
        return json.load(f)


def buscar_equipo(nombre, tabla_elo):
    clave = _norm(nombre)
    clave = ALIAS.get(clave, clave)
    for k, v in tabla_elo.items():
        if _norm(k) == clave:
            return k, v
    # búsqueda parcial
    for k, v in tabla_elo.items():
        if clave in _norm(k) or _norm(k) in clave:
            return k, v
    sys.exit(f"ERROR: equipo '{nombre}' no está en {RUTA_ELO}")


def buscar_sede(nombre, sedes):
    clave = _norm(nombre)
    for s in sedes:
        if clave in _norm(s["ciudad"]) or clave in _norm(s["estadio"]):
            return s
    # sede desconocida → neutra a nivel del mar sin calor
    return {"ciudad": nombre, "estadio": nombre, "altitud_m": 0,
            "techo": False, "riesgo_calor": "bajo"}


def elo_ajustado(equipo, elo, sede, es_anfitrion):
    """Aplica ajustes de localía/altura/calor. Regresa (elo, lista_de_ajustes)."""
    ajustes = []
    e = elo
    if es_anfitrion:
        e += 80
        ajustes.append("+80 localía")
    nombre = _norm(equipo)
    # Altura (domos NO neutralizan altura; neutralizan calor)
    alt = sede.get("altitud_m", 0)
    if nombre not in ADAPTADOS_ALTURA:
        if alt >= 2000:
            e -= 80
            ajustes.append(f"-80 altura fuerte ({alt} m)")
        elif alt >= 1500:
            e -= 40
            ajustes.append(f"-40 altura moderada ({alt} m)")
    # Calor
    if sede.get("riesgo_calor") == "alto" and not sede.get("techo", False):
        if nombre not in ADAPTADOS_CALOR:
            e -= 30
            ajustes.append("-30 calor no adaptado")
    return e, ajustes


def lambdas_desde_elo(elo_a, elo_b, total=GOLES_BASE_TOTAL):
    """
    Convierte diferencia de Elo en goles esperados (λ_a, λ_b).
    p_a = prob. de 'victoria' Elo clásica; se reparte el total de goles
    proporcionalmente con un exponente que calibra que ~300 Elo de
    diferencia ≈ 75% de los goles esperados (similar a FiveThirtyEight SPI).
    """
    d = elo_a - elo_b
    p_a = 1.0 / (1.0 + 10 ** (-d / 400.0))
    # reparto de goles: razón de fuerza suavizada
    ratio = (p_a / (1 - p_a)) ** 0.62
    lam_a = total * ratio / (1 + ratio)
    lam_b = total - lam_a
    # piso mínimo: hasta el más débil genera algo de peligro
    lam_a, lam_b = max(lam_a, 0.20), max(lam_b, 0.20)
    return lam_a, lam_b


def poisson_pmf(lam, k):
    return math.exp(-lam) * lam ** k / math.factorial(k)


def tau_dixon_coles(x, y, lam, mu, rho=RHO_DIXON_COLES):
    """Factor de corrección Dixon-Coles para marcadores 0-0, 1-0, 0-1, 1-1."""
    if x == 0 and y == 0:
        return 1 - lam * mu * rho
    if x == 0 and y == 1:
        return 1 + lam * rho
    if x == 1 and y == 0:
        return 1 + mu * rho
    if x == 1 and y == 1:
        return 1 - rho
    return 1.0


def matriz_marcadores(lam_a, lam_b):
    """Matriz P[x][y] con corrección Dixon-Coles, renormalizada."""
    m = [[poisson_pmf(lam_a, x) * poisson_pmf(lam_b, y) * tau_dixon_coles(x, y, lam_a, lam_b)
          for y in range(MAX_GOLES + 1)] for x in range(MAX_GOLES + 1)]
    s = sum(sum(fila) for fila in m)
    return [[p / s for p in fila] for fila in m]


def probs_1x2(matriz):
    pl = sum(matriz[x][y] for x in range(MAX_GOLES + 1) for y in range(MAX_GOLES + 1) if x > y)
    pe = sum(matriz[x][x] for x in range(MAX_GOLES + 1))
    pv = 1 - pl - pe
    return pl, pe, pv


def marcadores_top(matriz, n=6):
    pares = [((x, y), matriz[x][y]) for x in range(MAX_GOLES + 1) for y in range(MAX_GOLES + 1)]
    return sorted(pares, key=lambda t: -t[1])[:n]


def linea_mercado(equipo_a, equipo_b, momios):
    """Busca probs de-vig 1X2 del partido en momios_mx.json. None si no hay."""
    if not momios:
        return None
    for p in momios.get("partidos", []):
        eqs = {_norm(p.get("local", "")), _norm(p.get("visitante", ""))}
        if {_norm(equipo_a), _norm(equipo_b)} == eqs:
            probs = p.get("prob_devig")
            if probs and _norm(p.get("local", "")) == _norm(equipo_b):
                # invertir si el orden está volteado
                probs = {"local": probs["visitante"], "empate": probs["empate"],
                         "visitante": probs["local"], "fuente": probs.get("fuente", p.get("fuente"))}
            if probs:
                probs.setdefault("fuente", p.get("fuente", "data/momios_mx.json"))
            return probs
    return None


def analizar(local, visita, sede_nombre, anfitrion=None, ko=False, peso_mercado=0.5, silencioso=False):
    elo_tabla = cargar_json(RUTA_ELO)
    sedes = cargar_json(RUTA_SEDES, requerido=False) or []
    momios = cargar_json(RUTA_MOMIOS, requerido=False)

    nom_l, dato_l = buscar_equipo(local, elo_tabla)
    nom_v, dato_v = buscar_equipo(visita, elo_tabla)
    sede = buscar_sede(sede_nombre, sedes)

    el, aj_l = elo_ajustado(nom_l, dato_l["elo"], sede, anfitrion and _norm(anfitrion) == _norm(nom_l))
    ev, aj_v = elo_ajustado(nom_v, dato_v["elo"], sede, anfitrion and _norm(anfitrion) == _norm(nom_v))

    lam_l, lam_v = lambdas_desde_elo(el, ev)
    matriz = matriz_marcadores(lam_l, lam_v)
    pl, pe, pv = probs_1x2(matriz)

    mercado = linea_mercado(nom_l, nom_v, momios)
    if mercado:
        ml = (1 - peso_mercado) * pl + peso_mercado * mercado["local"]
        me = (1 - peso_mercado) * pe + peso_mercado * mercado["empate"]
        mv = (1 - peso_mercado) * pv + peso_mercado * mercado["visitante"]
    else:
        ml, me, mv = pl, pe, pv

    tops = marcadores_top(matriz)
    marcador = tops[0][0]
    # Regla CLAUDE.md: si 1-1 vs 1-0 (o el top-2) difieren <2pp, decide el mercado
    if len(tops) >= 2 and (tops[0][1] - tops[1][1]) < 0.02:
        (a, b) = tops[0][0]
        (c, d) = tops[1][0]
        def lado(m):  # 1=local, 0=empate, -1=visita
            return (m[0] > m[1]) - (m[0] < m[1])
        if lado((a, b)) != lado((c, d)):
            mejor = max([(ml, 1), (me, 0), (mv, -1)])[1]
            if lado((c, d)) == mejor and lado((a, b)) != mejor:
                marcador = (c, d)

    resultado = {
        "local": nom_l, "visitante": nom_v,
        "sede": f"{sede['estadio']} ({sede['ciudad']})",
        "elo": {"local": el, "visitante": ev, "ajustes_local": aj_l, "ajustes_visita": aj_v},
        "lambdas": {"local": round(lam_l, 3), "visitante": round(lam_v, 3)},
        "prob_modelo": {"local": round(pl, 4), "empate": round(pe, 4), "visitante": round(pv, 4)},
        "prob_mercado": ({k: round(v, 4) for k, v in mercado.items() if isinstance(v, float)}
                         | {"fuente": mercado.get("fuente")}) if mercado else "sin línea de mercado",
        "prob_mezcla_50_50": {"local": round(ml, 4), "empate": round(me, 4), "visitante": round(mv, 4)},
        "marcador_mas_probable": f"{marcador[0]}-{marcador[1]}",
        "top_marcadores": [{"marcador": f"{x}-{y}", "prob": round(p, 4)} for (x, y), p in tops],
    }

    if ko:
        # En eliminatoria no hay empate final: prob de avanzar = victoria + ~50% del empate
        p_avanza_l = ml + me / 2
        ganador = nom_l if p_avanza_l >= 0.5 else nom_v
        resultado["ko"] = {
            "prob_avanza": {nom_l: round(p_avanza_l, 4), nom_v: round(1 - p_avanza_l, 4)},
            "ganador": ganador,
            "nota": "si el marcador modal es empate: +1 gol al ganador (penales)",
        }
        if marcador[0] == marcador[1]:
            if ganador == nom_l:
                resultado["marcador_ko"] = f"{marcador[0] + 1}-{marcador[1]} (penales)"
            else:
                resultado["marcador_ko"] = f"{marcador[0]}-{marcador[1] + 1} (penales)"
        else:
            resultado["marcador_ko"] = resultado["marcador_mas_probable"]

    if not silencioso:
        print(json.dumps(resultado, ensure_ascii=False, indent=2))
    return resultado


def main():
    ap = argparse.ArgumentParser(description="Modelo Elo→Poisson Mundial 2026 (v2 reconstruido)")
    ap.add_argument("equipos", nargs="*", help='"Local" "Visita" "Sede"')
    ap.add_argument("--local", dest="anfitrion", help="Equipo con ventaja de localía (+80)")
    ap.add_argument("--ko", action="store_true", help="Partido eliminatorio (sin empate)")
    ap.add_argument("--live", action="store_true",
                    help="NO DISPONIBLE: red bloqueada; se usa data/momios_mx.json")
    args = ap.parse_args()

    if args.live:
        print("AVISO: --live no disponible (The Odds API bloqueada por la red del entorno). "
              "Usando data/momios_mx.json como fuente de mercado.", file=sys.stderr)

    if len(args.equipos) == 0:
        print("— Smoke-test: México vs Sudáfrica, Estadio Azteca, localía México —", file=sys.stderr)
        analizar("México", "Sudáfrica", "Azteca", anfitrion="México")
    elif len(args.equipos) == 3:
        analizar(args.equipos[0], args.equipos[1], args.equipos[2],
                 anfitrion=args.anfitrion, ko=args.ko)
    else:
        ap.error('se requieren exactamente 3 argumentos: "Local" "Visita" "Sede"')


if __name__ == "__main__":
    main()
