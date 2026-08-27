#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
simular.py — Fase 2: corre el modelo en los 104 partidos del Mundial 2026.
==========================================================================
1. 72 partidos de grupos: prob modelo + mercado (cuando hay línea) + mezcla
   50/50 + marcador modal Poisson/Dixon-Coles.
2. Posiciones de grupo (pts→dif→GF→alfabético) + ranking de terceros +
   asignación de los 8 mejores terceros al bracket (matching por elegibilidad).
3. Eliminatoria completa 73-104 con el modelo (--ko): empates → +1 gol al
   ganador por prob. de avanzar ("penales").
4. Ajustes forzados documentados (decisiones de Javier, p.ej. Grupo K).

Output: data/predicciones_104.json + tabla por stdout.
"""

import json
import os
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE)
sys.path.insert(0, os.path.join(BASE, "scripts"))

from logica_grupos import tabla_grupo, ranking_terceros
from modelo_mundial import analizar

CAL = json.load(open(os.path.join(BASE, "data", "calendario.json"), encoding="utf-8"))
BRACKET = json.load(open(os.path.join(BASE, "data", "bracket.json"), encoding="utf-8"))

CIUDADES_MX = {"Ciudad de México", "Guadalajara", "Monterrey"}
CIUDADES_CA = {"Toronto", "Vancouver"}

# ── AJUSTES FORZADOS (decisiones de Javier en compuertas, con justificación) ──
# Formato: (local, visitante) -> {"marcador": (gl,gv), "razon": "..."}
AJUSTES_FORZADOS = {
    # Compuerta 1 (11-jun): Javier decidió Portugal 1° / Colombia 2° en Grupo K
    # siguiendo el consenso de mercado (Polymarket 62-63% Portugal). Se aplica
    # SOLO si la simulación natural contradice ese orden (ver __main__).
}


def anfitrion_de(partido):
    ciudad = partido["ciudad"]
    for eq in (partido["local"], partido["visitante"]):
        if eq == "México" and ciudad in CIUDADES_MX:
            return eq
        if eq == "Canadá" and ciudad in CIUDADES_CA:
            return eq
        if eq == "Estados Unidos" and ciudad not in CIUDADES_MX | CIUDADES_CA:
            return eq
    return None


def marcador_de(res, ko=False):
    m = res["marcador_ko"] if ko and "marcador_ko" in res else res["marcador_mas_probable"]
    m = m.replace(" (penales)", "")
    gl, gv = m.split("-")
    return int(gl), int(gv)


def simular_grupos():
    predicciones = []
    for p in sorted(CAL, key=lambda x: x["num"]):
        res = analizar(p["local"], p["visitante"], p["ciudad"],
                       anfitrion=anfitrion_de(p), silencioso=True)
        gl, gv = marcador_de(res)
        forzado = AJUSTES_FORZADOS.get((p["local"], p["visitante"]))
        razon = None
        if forzado:
            gl, gv = forzado["marcador"]
            razon = forzado["razon"]
        predicciones.append({
            "num": p["num"], "fase": "grupos", "grupo": p["grupo"], "jornada": p["jornada"],
            "fecha": p["fecha"], "ciudad": p["ciudad"],
            "local": p["local"], "visitante": p["visitante"],
            "marcador": f"{gl}-{gv}", "gl": gl, "gv": gv,
            "prob_modelo": res["prob_modelo"],
            "prob_mercado": res["prob_mercado"],
            "prob_mezcla": res["prob_mezcla_50_50"],
            "prob_marcador": res["top_marcadores"][0]["prob"],
            "top_marcadores": res["top_marcadores"][:3],
            "ajuste_forzado": razon,
        })
    return predicciones


def posiciones(predicciones):
    tablas = {}
    for g in "ABCDEFGHIJKL":
        partidos = [{"local": p["local"], "visitante": p["visitante"], "gl": p["gl"], "gv": p["gv"]}
                    for p in predicciones if p.get("grupo") == g]
        tablas[g] = tabla_grupo(partidos)
    return tablas


def asignar_terceros(terceros_top8, slots):
    """
    Matching por backtracking: cada slot de tercero recibe un grupo elegible.
    slots: lista de (num_partido, set_grupos_elegibles). Regresa {num: grupo}.
    Aproximación a la tabla FIFA (documentada en data/bracket.json).
    """
    grupos = [t["grupo"] for t in terceros_top8]

    def bt(i, usados, asig):
        if i == len(slots):
            return asig
        num, elegibles = slots[i]
        for g in sorted(elegibles & (set(grupos) - usados)):
            r = bt(i + 1, usados | {g}, {**asig, num: g})
            if r:
                return r
        return None

    # ordenar slots por cantidad de opciones (más restrictivo primero) para eficiencia
    slots = sorted(slots, key=lambda s: len(s[1] & set(grupos)))
    res = bt(0, set(), {})
    if not res:
        raise RuntimeError("sin matching válido de terceros")
    return res


def simular_ko(tablas, predicciones):
    # diccionario de slots → equipo
    equipo_de_slot = {}
    for g, tabla in tablas.items():
        equipo_de_slot[f"1{g}"] = tabla[0]["equipo"]
        equipo_de_slot[f"2{g}"] = tabla[1]["equipo"]

    terceros = ranking_terceros(tablas)
    top8 = terceros[:8]
    slots_terceros = [(p["num"], set(p["visitante"][2:]))
                      for p in BRACKET["dieciseisavos"] if p["visitante"].startswith("3_")]
    asignacion = asignar_terceros(top8, slots_terceros)
    grupo_a_equipo3 = {t["grupo"]: t["equipo"] for t in top8}

    resultados_ko = {}  # num -> (ganador, perdedor)

    def resolver(slot, num_partido=None):
        if slot.startswith("W"):
            return resultados_ko[int(slot[1:])][0]
        if slot.startswith("L"):
            return resultados_ko[int(slot[1:])][1]
        if slot.startswith("3_"):
            return grupo_a_equipo3[asignacion[num_partido]]
        return equipo_de_slot[slot]

    rondas = ([("dieciseisavos", p) for p in BRACKET["dieciseisavos"]]
              + [("octavos", p) for p in BRACKET["octavos"]]
              + [("cuartos", p) for p in BRACKET["cuartos"]]
              + [("semifinal", p) for p in BRACKET["semifinales"]]
              + [("tercer_lugar", BRACKET["tercer_lugar"]), ("final", BRACKET["final"])])
    for fase, p in rondas:
        el = resolver(p["local"], p["num"])
        ev = resolver(p["visitante"], p["num"])
        res = analizar(el, ev, p["ciudad"], anfitrion=anfitrion_de({"local": el, "visitante": ev, "ciudad": p["ciudad"]}),
                       ko=True, silencioso=True)
        gl, gv = marcador_de(res, ko=True)
        ganador = res["ko"]["ganador"]
        penales = "penales" in res.get("marcador_ko", "")
        perdedor = ev if ganador == el else el
        resultados_ko[p["num"]] = (ganador, perdedor)
        predicciones.append({
            "num": p["num"], "fase": fase, "fecha": p["fecha"], "ciudad": p["ciudad"],
            "slot_local": p["local"], "slot_visitante": p["visitante"],
            "local": el, "visitante": ev,
            "marcador": f"{gl}-{gv}" + (" (penales)" if penales else ""),
            "gl": gl, "gv": gv, "ganador": ganador,
            "prob_avanza": res["ko"]["prob_avanza"],
            "prob_mercado": "sin línea de mercado",
            "nota": res["prob_mercado"] if isinstance(res["prob_mercado"], str) else None,
        })
    return predicciones, asignacion, terceros


def main():
    preds = simular_grupos()
    tablas = posiciones(preds)

    # ── Verificación de la decisión de Javier: Portugal 1° / Colombia 2° en K ──
    k = [f["equipo"] for f in tablas["K"]]
    if not (k[0] == "Portugal" and k[1] == "Colombia"):
        # Ajuste forzado documentado: el partido Portugal-Colombia (o el orden
        # del grupo) debe reflejar la decisión de la Compuerta 1.
        print(f"AVISO: orden natural del Grupo K era {k}; aplicando decisión de Javier "
              f"(Portugal 1°, Colombia 2°) vía ajuste del head-to-head.", file=sys.stderr)
        for p in preds:
            par = {p["local"], p["visitante"]}
            if par == {"Portugal", "Colombia"}:
                if p["local"] == "Portugal":
                    p["gl"], p["gv"] = max(p["gl"], p["gv"] + 1), p["gv"]
                else:
                    p["gv"], p["gl"] = max(p["gv"], p["gl"] + 1), p["gl"]
                p["marcador"] = f"{p['gl']}-{p['gv']}"
                p["ajuste_forzado"] = ("Decisión Javier Compuerta 1 (11-jun): Portugal gana el "
                                       "grupo K (mercado 62-63%); Colombia 2°.")
        tablas = posiciones(preds)
        k = [f["equipo"] for f in tablas["K"]]
        assert k[0] == "Portugal" and k[1] == "Colombia", f"Grupo K sigue mal: {k}"

    preds, asignacion, terceros = simular_ko(tablas, preds)

    salida = {
        "generado": "2026-06-11",
        "tablas_grupos": {g: [{kk: f[kk] for kk in ("equipo", "pts", "dif", "gf")} for f in t]
                          for g, t in tablas.items()},
        "terceros_ranking": [{kk: t[kk] for kk in ("grupo", "equipo", "pts", "dif", "gf")} for t in terceros],
        "asignacion_terceros": asignacion,
        "predicciones": preds,
    }
    ruta = os.path.join(BASE, "data", "predicciones_104.json")
    json.dump(salida, open(ruta, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"OK → {ruta}  ({len(preds)} partidos)")

    # tabla resumen por stdout
    print("\n== GRUPOS (orden final) ==")
    for g, t in tablas.items():
        print(f"  {g}: " + " | ".join(f"{i+1}.{f['equipo']} ({f['pts']}pts,{f['dif']:+d})" for i, f in enumerate(t)))
    print("\n== TERCEROS (top 8 avanzan) ==")
    for i, t in enumerate(terceros):
        marca = "✓" if i < 8 else "✗"
        print(f"  {marca} {i+1:2d}. {t['equipo']} ({t['grupo']}) {t['pts']}pts {t['dif']:+d}")
    print("\n== ELIMINATORIA ==")
    for p in preds:
        if p["fase"] != "grupos":
            pa = p["prob_avanza"][p["ganador"]]
            print(f"  #{p['num']:>3} {p['fase']:<13} {p['local']} {p['marcador']} {p['visitante']}"
                  f"  → {p['ganador']} ({pa:.0%})")


if __name__ == "__main__":
    main()
