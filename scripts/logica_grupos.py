#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
logica_grupos.py — lógica compartida de posiciones de grupo del Mundial 2026.
Replica la regla del template de la quiniela: pts → dif → GF → alfabético.
(El template de Pablo usa ese orden simplificado; el desempate FIFA real usa
head-to-head antes de fair play, pero la quiniela se califica con su propia
fórmula, así que ESTA es la lógica canónica del proyecto.)
"""

from collections import defaultdict


def tabla_grupo(partidos):
    """
    partidos: lista de dicts {"local","visitante","gl","gv"} (goles enteros).
    Regresa lista de dicts ordenada: [{"equipo","pj","pts","gf","gc","dif"}...]
    Orden: pts desc → dif desc → gf desc → alfabético asc.
    """
    st = defaultdict(lambda: {"pj": 0, "pts": 0, "gf": 0, "gc": 0})
    for p in partidos:
        l, v, gl, gv = p["local"], p["visitante"], int(p["gl"]), int(p["gv"])
        st[l]["pj"] += 1
        st[v]["pj"] += 1
        st[l]["gf"] += gl
        st[l]["gc"] += gv
        st[v]["gf"] += gv
        st[v]["gc"] += gl
        if gl > gv:
            st[l]["pts"] += 3
        elif gv > gl:
            st[v]["pts"] += 3
        else:
            st[l]["pts"] += 1
            st[v]["pts"] += 1
    filas = []
    for eq, d in st.items():
        filas.append({"equipo": eq, **d, "dif": d["gf"] - d["gc"]})
    filas.sort(key=lambda f: (-f["pts"], -f["dif"], -f["gf"], f["equipo"]))
    return filas


def ranking_terceros(tablas_por_grupo):
    """
    tablas_por_grupo: {"A": tabla_grupo(...), ...}
    Regresa lista de terceros ordenados (mejor primero) con su grupo:
    [{"grupo","equipo","pts","dif","gf"}...] — mismo criterio pts→dif→gf→alfabético.
    """
    terceros = []
    for g, tabla in tablas_por_grupo.items():
        t = tabla[2]
        terceros.append({"grupo": g, **t})
    terceros.sort(key=lambda f: (-f["pts"], -f["dif"], -f["gf"], f["equipo"]))
    return terceros


if __name__ == "__main__":
    # mini-prueba
    demo = [
        {"local": "México", "visitante": "Sudáfrica", "gl": 2, "gv": 0},
        {"local": "Corea del Sur", "visitante": "Curazao", "gl": 1, "gv": 1},
        {"local": "México", "visitante": "Corea del Sur", "gl": 1, "gv": 1},
        {"local": "Sudáfrica", "visitante": "Curazao", "gl": 1, "gv": 0},
        {"local": "México", "visitante": "Curazao", "gl": 3, "gv": 0},
        {"local": "Sudáfrica", "visitante": "Corea del Sur", "gl": 0, "gv": 2},
    ]
    for fila in tabla_grupo(demo):
        print(fila)
