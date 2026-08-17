#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Enriquecedor del censo — teléfonos/correos/sitios desde la DENUE (INEGI).

El censo tiene 829 empresas y 0 teléfonos. TODO el pipeline comercial está
detrás de esa casilla. Este script cruza cada prospecto contra el CSV masivo
de la DENUE (descarga pública, sin token) y escribe de vuelta a Supabase
SOLO los cruces de confianza ALTA; los MEDIA salen a un CSV de revisión
humana — nunca se inventa un dato (regla de la casa).

Uso:
  python3 enriquecer_censo.py --denue <csv> [<csv2> ...]        # dry-run: reporte
  python3 enriquecer_censo.py --denue <csv> ... --aplicar        # escribe ALTA a Supabase

Credenciales: lee NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY de
~/javiercamarapp/likida/.env.local (mismo criterio que wa-notificar.sh).

Descarga de la DENUE (sector 48-49 transportes; agregar sectores si hace falta):
  curl -A "Mozilla/5.0" -o denue_4849.zip \
    https://www.inegi.org.mx/contenidos/masiva/denue/denue_00_48-49_csv.zip
"""
import argparse
import csv
import json
import os
import re
import sys
import unicodedata
import urllib.request
from collections import defaultdict
from difflib import SequenceMatcher

REPO_LIKIDA = os.path.expanduser("~/javiercamarapp/likida")

# ── Normalización de nombres ────────────────────────────────────────────────
# Sufijos legales y ruido que no distingue a una empresa de otra.
SUFIJOS = re.compile(
    r"\b(s\.?a\.?p\.?i\.?|s\.?a\.?b\.?|s\.?a\.?|s\.? de r\.?l\.?|s\.?c\.?|"
    r"de c\.?v\.?|c\.?v\.?|de r\.?l\.?|r\.?l\.?|mi|sofom|e\.?n\.?r\.?)\b"
)
# Tokens demasiado comunes en el giro para anclar un cruce por sí solos.
GENERICOS = {
    "transportes", "transporte", "transportadora", "logistica", "servicios",
    "servicio", "grupo", "mexico", "mexicana", "mexicanos", "nacional",
    "internacional", "comercializadora", "distribuidora", "distribucion",
    "operadora", "corporativo", "compania", "cia", "empresa", "empresas",
    "fletes", "flete", "carga", "cargas", "autotransportes", "autotransporte",
    "express", "del", "de", "la", "el", "los", "las", "y", "e", "en",
    "logistics", "transport", "trucking", "freight", "cargo", "mas", "para",
    "productos", "industrias", "industrial", "industriales", "comercial",
}


def normalizar(s: str) -> str:
    s = unicodedata.normalize("NFD", (s or "").lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = re.sub(r"[^a-z0-9 ]", " ", s)
    s = SUFIJOS.sub(" ", s)
    return re.sub(r"\s+", " ", s).strip()


def tokens(s: str) -> set:
    return set(normalizar(s).split())


def tokens_ancla(s: str) -> set:
    """Los tokens que sí identifican: fuera genéricos y fuera monosílabos."""
    return {t for t in tokens(s) if t not in GENERICOS and len(t) > 2}


# ── Ciudad del prospecto → (municipio, entidad) ─────────────────────────────
def partir_ciudad(ciudad: str):
    """'Escobedo, Nuevo León' → ('escobedo', 'nuevo leon'). Ruido → (None, None)."""
    if not ciudad or "nacional" in ciudad.lower():
        return None, None
    partes = [normalizar(p) for p in ciudad.split(",")]
    partes = [p for p in partes if p]
    if not partes:
        return None, None
    if len(partes) == 1:
        return partes[0], None
    return partes[0], partes[-1]


def ciudad_coincide(mun_p, ent_p, mun_d, ent_d):
    """None = no se sabe; True/False = veredicto real."""
    if not mun_p and not ent_p:
        return None
    if mun_p and (mun_p in mun_d or mun_d in mun_p):
        return True
    if ent_p and (ent_p in ent_d or ent_d in ent_p):
        # La entidad sola no confirma el municipio, pero tampoco contradice.
        return True
    return False


# ── Score de un candidato ───────────────────────────────────────────────────
def puntuar(nombre_p: str, cand: dict, mun_p, ent_p):
    np_ = normalizar(nombre_p)
    mejores = 0.0
    for campo in ("nom_estab", "raz_social"):
        nd = normalizar(cand[campo])
        if not nd:
            continue
        ratio = SequenceMatcher(None, np_, nd).ratio()
        # Contención: "tresguerras" dentro de "autolineas tresguerras" vale…
        # pero UN solo token ancla no basta para afirmar identidad ("fruto"
        # aparece en cien negocios): con uno solo, el techo es rango MEDIA y
        # que la ciudad lo confirme para subir.
        tp, td = tokens_ancla(nombre_p), tokens_ancla(cand[campo])
        if tp and td:
            contenida = len(tp & td) / len(tp)
            if contenida == 1:
                techo = 1.0 if len(tp) >= 2 else 0.84
                ratio = max(ratio, techo)
            ratio = max(ratio, 0.5 * ratio + 0.5 * (len(tp & td) / len(tp | td)))
        mejores = max(mejores, ratio)
    ciudad = ciudad_coincide(mun_p, ent_p, normalizar(cand["municipio"]), normalizar(cand["entidad"]))
    if ciudad is True:
        mejores += 0.06
    elif ciudad is False:
        mejores -= 0.08
    return round(mejores, 4), ciudad


# ── Carga DENUE + índice invertido por token ancla ──────────────────────────
def cargar_denue(rutas, vocab):
    """Streaming con prefiltro: los CSV nacionales pesan cientos de MB (la
    manufactura sola trae >600k filas); solo se retiene la fila que comparte
    al menos un token ancla con algún prospecto — el resto jamás toca RAM."""
    filas, indice = [], defaultdict(set)
    for ruta in rutas:
        with open(ruta, encoding="latin-1") as f:
            for row in csv.DictReader(f):
                nombre = f"{row.get('nom_estab','')} {row.get('raz_social','')}"
                if not (tokens_ancla(nombre) & vocab):
                    continue
                fila = {
                    "nom_estab": row.get("nom_estab", ""),
                    "raz_social": row.get("raz_social", ""),
                    "telefono": re.sub(r"\D", "", row.get("telefono", "") or ""),
                    "correo": (row.get("correoelec", "") or "").strip().lower(),
                    "www": (row.get("www", "") or "").strip().lower(),
                    "municipio": row.get("municipio", ""),
                    "entidad": row.get("entidad", ""),
                    "actividad": row.get("nombre_act", ""),
                    "per_ocu": row.get("per_ocu", ""),
                }
                if not (fila["telefono"] or fila["correo"] or fila["www"]):
                    continue  # sin dato de contacto no aporta nada
                i = len(filas)
                filas.append(fila)
                for t in tokens_ancla(fila["nom_estab"]) | tokens_ancla(fila["raz_social"]):
                    indice[t].add(i)
    return filas, indice


def leer_env(nombre):
    ruta = os.path.join(REPO_LIKIDA, ".env.local")
    with open(ruta) as f:
        for linea in f:
            if linea.startswith(nombre + "="):
                return linea.split("=", 1)[1].split("#")[0].strip().strip("'\"")
    return None


def traer_prospectos(url, key):
    req = urllib.request.Request(
        f"{url}/rest/v1/prospecto?select=id,empresa,ciudad,telefono,correo,notas&order=empresa&limit=2000",
        headers={"apikey": key, "Authorization": f"Bearer {key}"},
    )
    return json.load(urllib.request.urlopen(req, timeout=30))


def aplicar_patch(url, key, pid, cambios):
    req = urllib.request.Request(
        f"{url}/rest/v1/prospecto?id=eq.{pid}",
        data=json.dumps(cambios).encode(),
        method="PATCH",
        headers={
            "apikey": key, "Authorization": f"Bearer {key}",
            "Content-Type": "application/json", "Prefer": "return=minimal",
        },
    )
    urllib.request.urlopen(req, timeout=30).read()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--denue", nargs="+", required=True, help="CSV(s) masivos de la DENUE")
    ap.add_argument("--aplicar", action="store_true", help="escribir ALTA a Supabase")
    ap.add_argument("--salida", default="censo_enriquecido.csv")
    args = ap.parse_args()

    url, key = leer_env("NEXT_PUBLIC_SUPABASE_URL"), leer_env("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        sys.exit("faltan credenciales en likida/.env.local")

    prospectos = traer_prospectos(url, key)
    print(f"prospectos: {len(prospectos)}")
    vocab = set()
    for p in prospectos:
        vocab |= tokens_ancla(p["empresa"])
    filas, indice = cargar_denue(args.denue, vocab)
    print(f"DENUE (tras prefiltro por vocabulario): {len(filas)} establecimientos")

    resultados, sin_match = [], []
    for p in prospectos:
        anclas = tokens_ancla(p["empresa"])
        candidatos = set()
        for t in anclas:
            candidatos |= indice.get(t, set())
        if not candidatos:
            sin_match.append(p)
            continue
        mun_p, ent_p = partir_ciudad(p.get("ciudad") or "")
        mejor, mejor_score, mejor_ciudad = None, 0.0, None
        for i in candidatos:
            score, ciudad = puntuar(p["empresa"], filas[i], mun_p, ent_p)
            # Empate: gana el que tiene teléfono y coincide de ciudad.
            llave = (score, ciudad is True, bool(filas[i]["telefono"]))
            if mejor is None or llave > (mejor_score, mejor_ciudad is True, bool(mejor["telefono"])):
                mejor, mejor_score, mejor_ciudad = filas[i], score, ciudad
        if mejor is None:
            sin_match.append(p)
            continue
        # Umbrales calibrados contra la corrida del 16-ago: en la franja
        # 0.90-1.0 aparecieron falsos claros (KN≠LT, TICARSA≠TAIA), así que
        # ALTA = solo identidad plena (≥1.0: nombre exacto o todos los tokens
        # ancla contenidos con ≥2 anclas). Y un nombre de UN solo token
        # ("Kelly", "Sigma") coincide exacto con homónimos ajenos: ahí ALTA
        # exige además la ciudad confirmada. Lo demás lo revisa un humano.
        n_anclas = len(tokens_ancla(p["empresa"]))
        if mejor_score >= 1.0 and mejor_ciudad is not False and (n_anclas >= 2 or mejor_ciudad is True):
            tier = "ALTA"
        elif mejor_score >= 0.80:
            tier = "MEDIA"
        else:
            sin_match.append(p)
            continue
        resultados.append({
            "id": p["id"], "empresa": p["empresa"], "ciudad": p.get("ciudad") or "",
            "match": mejor["nom_estab"] or mejor["raz_social"],
            "razon_social": mejor["raz_social"], "score": mejor_score, "tier": tier,
            "ciudad_match": {True: "sí", False: "NO", None: "?"}[mejor_ciudad],
            "telefono": mejor["telefono"], "correo": mejor["correo"], "www": mejor["www"],
            "municipio": mejor["municipio"], "entidad": mejor["entidad"],
            "actividad": mejor["actividad"], "per_ocu": mejor["per_ocu"],
            "tel_actual": p.get("telefono") or "", "correo_actual": p.get("correo") or "",
        })

    with open(args.salida, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(resultados[0].keys()) if resultados else ["vacio"])
        w.writeheader()
        for r in sorted(resultados, key=lambda x: (-x["score"])):
            w.writerow(r)
    altas = [r for r in resultados if r["tier"] == "ALTA"]
    medias = [r for r in resultados if r["tier"] == "MEDIA"]
    print(f"ALTA: {len(altas)} · MEDIA (revisión): {len(medias)} · sin match: {len(sin_match)}")
    print(f"reporte: {args.salida}")

    if args.aplicar:
        escritos = 0
        for r in altas:
            cambios = {}
            # Regla: JAMÁS pisar un dato que ya exista — solo llenar huecos.
            if r["telefono"] and not r["tel_actual"]:
                cambios["telefono"] = r["telefono"]
            if r["correo"] and not r["correo_actual"]:
                cambios["correo"] = r["correo"]
            if not cambios:
                continue
            nota = (f"DENUE 05/2026: «{r['match']}» ({r['municipio']}, {r['entidad']}), "
                    f"score {r['score']}" + (f", sitio: {r['www']}" if r["www"] else ""))
            p_orig = next(p for p in prospectos if p["id"] == r["id"])
            notas_previas = (p_orig.get("notas") or "").strip()
            cambios["notas"] = (notas_previas + "\n" if notas_previas else "") + nota
            aplicar_patch(url, key, r["id"], cambios)
            escritos += 1
        print(f"escritos a Supabase (solo ALTA, solo huecos): {escritos}")


if __name__ == "__main__":
    main()
