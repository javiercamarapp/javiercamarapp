#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Los scrapeados HISTÓRICOS → prospecto (orden 17-ago: "todos los que se
scrapearon antes — tengo un montón de leads").

El censo curado solo subió las empresas CON señal (dolor directo o giro).
Este script rescata del crudo SOLO lo que se relaciona con el dolor/ciclo
de Likida (corrección de Javier en vivo: "los descartados no van"): el
puesto tiene que oler a liquidación, viáticos, comprobación, choferes,
rutas, diésel, casetas, flota, reparto o transporte/logística. Entran como
fuente 'bolsa' con su puesto y liga.

Mismo contrato que todo el pipeline: dedupe estable por id, antirruido,
solo inserta (jamás toca filas), llaves homogéneas en el POST.
"""
import csv
import json
import sys
import urllib.request
from collections import defaultdict

from enriquecer_censo import leer_env, normalizar

FUENTES_CSV = [
    "respaldo_crudo_incremental.csv",
    "respaldo_crudo.csv",
    "respaldo_occ_incremental.csv",
    "respaldo_occ.csv",
    "respaldo_yucatan.csv",
]
RUIDO = ("confidencial", "reclutamiento", "reclutadora", "agencia de", "empleo destacado",
         "postulado", "bolsa de trabajo", "empresa lider", "empresa líder", "importante empresa",
         "importante grupo", "grupo importante", "empresa del giro", "corporativo importante")

CAMPO_EMPRESA = ("empresa", "Empresa", "company", "nombre_empresa")
CAMPO_TITULO = ("titulo", "Título del puesto", "puesto", "title", "titulo_puesto")
CAMPO_CIUDAD = ("ciudad", "Ciudad", "ubicacion", "location")
CAMPO_LIGA = ("liga", "Liga", "url", "link")
CAMPO_EXTRA = ("palabras_senal", "Palabras de señal", "descripcion", "Extracto de actividades", "keyword", "Keyword de búsqueda")

# El filtro del CICLO: el puesto (o su señal) debe tocar el dolor de Likida.
import re as _re
RE_CICLO = _re.compile(
    r"liquidac|vi[aá]tic|comprobaci|rendici[oó]n de gastos|chofer|operador"
    r"|conductor|reparto|ruta|di[eé]sel|diesel|caseta|peaje|flot(a|illa)"
    r"|tracto|tr[aá]iler|trailer|cami[oó]n|camiones|log[ií]stic|transport"
    r"|monitorista|despachador|patio|embarque|combustible|unidades", _re.I)
# La "liquidación" bursátil/bancaria y el "operador" de cajero NO son el
# ciclo — la lista negativa mata al falso positivo financiero.
RE_NEG = _re.compile(
    r"cajer|banc[oa]|banamex|burs[aá]til|casa de bolsa|bolsa mexicana|bmv"
    r"|valores|financier|call ?center|telef[oó]n|contact center|seguros"
    r"|operador de tienda|operador de caja", _re.I)


def valor(r, nombres):
    for n in nombres:
        v = (r.get(n) or "").strip()
        if v:
            return v
    return ""


def main():
    aplicar = "--aplicar" in sys.argv
    url, key = leer_env("NEXT_PUBLIC_SUPABASE_URL"), leer_env("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        sys.exit("faltan credenciales en likida/.env.local")

    def api(m, r, c=None, extra=None):
        h = {"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"}
        h.update(extra or {})
        req = urllib.request.Request(f"{url}/rest/v1/{r}",
                                     data=json.dumps(c).encode() if c is not None else None,
                                     method=m, headers=h)
        crudo = urllib.request.urlopen(req, timeout=120).read()
        return json.loads(crudo) if crudo else None

    existentes, desde = set(), 0
    while True:
        pagina = api("GET", f"prospecto?select=empresa&order=id&limit=1000&offset={desde}")
        for p in pagina:
            existentes.add(normalizar(p["empresa"]))
        if len(pagina) < 1000:
            break
        desde += 1000
    print(f"en la base: {len(existentes)} nombres únicos")

    grupos = defaultdict(lambda: {"n": 0, "titulo": "", "ciudad": "", "liga": ""})
    leidas = 0
    for ruta in FUENTES_CSV:
        try:
            with open(ruta, encoding="utf-8-sig", errors="replace") as f:
                for r in csv.DictReader(f):
                    leidas += 1
                    emp = valor(r, CAMPO_EMPRESA)
                    norm = normalizar(emp)
                    if not norm or len(norm) < 3 or any(x in norm for x in RUIDO):
                        continue
                    titulo = valor(r, CAMPO_TITULO)
                    extra = valor(r, CAMPO_EXTRA)
                    texto = f"{titulo} {extra}"
                    if not RE_CICLO.search(texto) or RE_NEG.search(f"{texto} {emp}"):
                        continue  # sin relación con el ciclo (o falso financiero)
                    g = grupos[norm]
                    g["n"] += 1
                    if not g["titulo"]:
                        g["titulo"] = titulo[:120]
                        g["ciudad"] = valor(r, CAMPO_CIUDAD)[:80]
                        g["liga"] = valor(r, CAMPO_LIGA)[:300]
                        g["empresa"] = emp[:200]
        except FileNotFoundError:
            print(f"aviso: no existe {ruta}", file=sys.stderr)

    nuevos = []
    for norm, g in grupos.items():
        if norm in existentes:
            continue
        nota = (f"BOLSA (histórico, puesto del ciclo): {g['n']} anuncio{'s' if g['n'] > 1 else ''}"
                + (f" · puesto: {g['titulo']}" if g['titulo'] else "")
                + (f" · liga: {g['liga']}" if g['liga'] else ""))
        nuevos.append({
            "empresa": g["empresa"],
            "ciudad": g["ciudad"] or None,
            "vacante": g["titulo"] or None,
            "fuente": "bolsa",
            "telefono": None,
            "correo": None,
            "lat": None,
            "lng": None,
            "notas": nota[:1200],
        })

    print(f"anuncios leídos: {leidas:,} · empresas únicas del crudo: {len(grupos):,} · nuevas a subir: {len(nuevos):,}")
    for n in nuevos[:6]:
        print("  ·", n["empresa"][:50], "—", (n["vacante"] or "")[:40])

    if aplicar and nuevos:
        for i in range(0, len(nuevos), 200):
            api("POST", "prospecto", nuevos[i:i + 200], {"Prefer": "return=minimal"})
        print(f"subidas: {len(nuevos):,}")


if __name__ == "__main__":
    main()
