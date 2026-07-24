#!/usr/bin/env python3
"""
Censo de vacantes de liquidación en transporte — Indeed México (fallback: LinkedIn).

Busca vacantes con python-jobspy, clasifica señal/ruido según reglas de negocio,
deduplica y genera un Excel de 4 hojas + respaldo crudo en CSV.

Uso:
    python scraper_liquidacion.py                    # corrida completa (90 días)
    python scraper_liquidacion.py --hours-old 24 --append   # tarea diaria incremental
    python scraper_liquidacion.py --test             # valida el pipeline con datos simulados
"""

import argparse
import logging
import random
import re
import sys
import time
import unicodedata
from datetime import datetime
from pathlib import Path

import pandas as pd

# ----------------------------------------------------------------------------
# Configuración de búsquedas
# ----------------------------------------------------------------------------

KEYWORDS = [
    "liquidador",
    "cajero liquidador",
    "liquidación de rutas",
    "liquidador de viajes",
    "ejecutivo de liquidaciones",
    "analista de liquidaciones",
    "comprobación de gastos operadores",
    "gastos de viaje transporte",
    "analista de combustible",
    "control de diésel",
    "carta porte",
    "facturista transporte",
    "cuadre de rutas",
    "póliza de gastos transporte",
]

# (parámetro location para jobspy, estado para reportes)
LOCATIONS = [
    ("Ciudad de México", "Ciudad de México"),
    ("Estado de México", "Estado de México"),
    ("Monterrey NL", "Nuevo León"),
    ("Guadalajara Jal", "Jalisco"),
    ("León Gto", "Guanajuato"),
    ("Querétaro Qro", "Querétaro"),
    ("Puebla Pue", "Puebla"),
    ("Veracruz Ver", "Veracruz"),
    ("Mérida Yuc", "Yucatán"),
    ("Tijuana BC", "Baja California"),
    ("Culiacán Sin", "Sinaloa"),
    ("Torreón Coah", "Coahuila"),
]

# ----------------------------------------------------------------------------
# Reglas de clasificación (se evalúan sobre título + descripción en minúsculas)
# ----------------------------------------------------------------------------

SIGNAL_WORDS = [
    "ruta", "rutas", "chofer", "choferes", "repartidor", "reparto",
    "operador", "operadores", "viaje", "viajes", "unidades", "flota",
    "cedis", "porteo", "folios con choferes", "diésel", "diesel",
    "casetas", "carta porte",
]

# Cada regla de ruido: (nombre del motivo, palabras que la disparan)
NOISE_RULES = [
    ("liquidación de nómina / finiquitos",
     ["finiquito", "nómina", "imss patronal", "indemnización laboral"]),
    ("cajero de mostrador / ventanilla",
     ["piso de venta", "mostrador", "punto de venta", "tienda departamental",
      "autoservicio"]),
    ("cobranza domiciliaria de servicios",
     ["servicio suspendido", "reconexión", "recuperación de equipos",
      "telecomunicaciones"]),
    ("traslado de valores como giro",
     ["traslado de valores", "custodia de valores"]),
    ("seguros (siniestros / ajustador)",
     ["liquidador de siniestros", "ajustador", "siniestros"]),
]

# "billetes falsos" solo es ruido si NO hay mención de rutas
NOISE_BILLETES = ("cajero de mostrador / ventanilla", ["billetes falsos"])

# Empresas que parecen agencia de reclutamiento: se marcan, no se descartan
AGENCY_WORDS = [
    "rh", "recursos humanos", "reclutamiento", "staffing",
    "consultores", "capital humano",
]

DEDUP_KEY_COLS = ["empresa", "titulo", "ciudad"]

log = logging.getLogger("censo")


def normalize(text) -> str:
    if text is None or (isinstance(text, float) and pd.isna(text)):
        return ""
    return str(text).lower().strip()


def strip_accents(text: str) -> str:
    return "".join(
        c for c in unicodedata.normalize("NFD", text)
        if unicodedata.category(c) != "Mn"
    )


def find_words(text: str, words) -> list:
    """Palabras presentes en el texto, con frontera de palabra y sin acentos."""
    plain = strip_accents(text)
    hits = []
    for w in words:
        pattern = r"(?<![\wáéíóúñ])" + re.escape(strip_accents(w)) + r"(?![\wáéíóúñ])"
        if re.search(pattern, plain):
            hits.append(w)
    return hits


def classify(title: str, description: str, company: str) -> dict:
    """Devuelve clasificación SEÑAL / RUIDO / REVISAR con detalle de reglas."""
    text = normalize(title) + " " + normalize(description)
    signal_hits = find_words(text, SIGNAL_WORDS)

    noise_hits = []  # [(motivo, palabra), ...]
    for motivo, words in NOISE_RULES:
        for w in find_words(text, words):
            noise_hits.append((motivo, w))
    # billetes falsos: solo cuenta como ruido sin mención de rutas
    if not find_words(text, ["ruta", "rutas"]):
        for w in find_words(text, NOISE_BILLETES[1]):
            noise_hits.append((NOISE_BILLETES[0], w))

    es_agencia = bool(find_words(normalize(company), AGENCY_WORDS))

    if signal_hits and noise_hits:
        clasificacion = "REVISAR"
    elif signal_hits:
        clasificacion = "SEÑAL"
    else:
        clasificacion = "RUIDO"

    motivos = "; ".join(sorted({f"{m} ({w})" for m, w in noise_hits}))
    if clasificacion == "RUIDO" and not noise_hits:
        motivos = "sin palabras de señal"

    return {
        "clasificacion": clasificacion,
        "palabras_senal": ", ".join(signal_hits),
        "motivo_descarte": motivos,
        "es_agencia": "AGENCIA" if es_agencia else "",
    }


# ----------------------------------------------------------------------------
# Scraping
# ----------------------------------------------------------------------------

def scrape_one(keyword: str, location: str, results_wanted: int, hours_old: int) -> pd.DataFrame:
    """Una búsqueda: Indeed primero, LinkedIn como fuente secundaria."""
    from jobspy import scrape_jobs

    last_error = None
    for site in ("indeed", "linkedin"):
        try:
            kwargs = dict(
                site_name=site,
                search_term=keyword,
                location=location,
                results_wanted=results_wanted,
                hours_old=hours_old,
                linkedin_fetch_description=(site == "linkedin"),
            )
            if site == "indeed":
                kwargs["country_indeed"] = "Mexico"
            df = scrape_jobs(**kwargs)
            if df is not None and len(df) > 0:
                df["fuente"] = site
                return df
            log.info("  %s sin resultados para '%s' en '%s'", site, keyword, location)
        except Exception as exc:  # noqa: BLE001 — cualquier fallo pasa al siguiente sitio
            last_error = exc
            log.warning("  %s falló para '%s' en '%s': %s", site, keyword, location, exc)
    if last_error is not None:
        raise last_error
    return pd.DataFrame()


def run_searches(results_wanted: int, hours_old: int, min_sleep: float, max_sleep: float):
    frames, ok, failed = [], 0, 0
    total = len(KEYWORDS) * len(LOCATIONS)
    n = 0
    for keyword in KEYWORDS:
        for location, estado in LOCATIONS:
            n += 1
            log.info("[%d/%d] '%s' en '%s'", n, total, keyword, location)
            try:
                df = scrape_one(keyword, location, results_wanted, hours_old)
                if len(df) > 0:
                    df["busqueda_keyword"] = keyword
                    df["busqueda_plaza"] = location
                    df["busqueda_estado"] = estado
                    frames.append(df)
                ok += 1
            except Exception as exc:  # noqa: BLE001 — registrar y continuar
                failed += 1
                log.error("BÚSQUEDA FALLIDA '%s' en '%s': %s", keyword, location, exc)
            if n < total:
                time.sleep(random.uniform(min_sleep, max_sleep))
    raw = pd.concat(frames, ignore_index=True) if frames else pd.DataFrame()
    return raw, ok, failed


# ----------------------------------------------------------------------------
# Datos simulados para validar el pipeline sin red (--test)
# ----------------------------------------------------------------------------

def mock_jobs() -> pd.DataFrame:
    rows = [
        # señal clara
        dict(title="Liquidador de rutas", company="Transportes del Norte",
             city="Monterrey", description="Liquidación de rutas foráneas, cuadre de casetas y diésel con operadores. Manejo de carta porte.",
             min_amount=12000, max_amount=15000, kw="liquidador", loc="Monterrey NL", est="Nuevo León"),
        dict(title="Cajero liquidador", company="Logística Azteca",
             city="Ciudad de México", description="Recepción de efectivo de choferes al cierre de reparto, arqueo de folios con choferes.",
             min_amount=10000, max_amount=None, kw="cajero liquidador", loc="Ciudad de México", est="Ciudad de México"),
        # misma empresa, segunda vacante (vacantes_simultaneas = 2)
        dict(title="Analista de liquidaciones", company="Transportes del Norte",
             city="Monterrey", description="Comprobación de gastos de viaje de operadores, control de flota y unidades.",
             min_amount=None, max_amount=None, kw="analista de liquidaciones", loc="Monterrey NL", est="Nuevo León"),
        # duplicado exacto (debe deduplicarse)
        dict(title="Liquidador de rutas", company="Transportes del Norte",
             city="Monterrey", description="Liquidación de rutas foráneas, cuadre de casetas y diésel con operadores.",
             min_amount=12000, max_amount=15000, kw="liquidación de rutas", loc="Monterrey NL", est="Nuevo León"),
        # ruido: nómina
        dict(title="Analista de liquidaciones", company="Corporativo Fiscal SA",
             city="Guadalajara", description="Cálculo de finiquito e indemnización laboral, nómina semanal, IMSS patronal.",
             min_amount=None, max_amount=None, kw="analista de liquidaciones", loc="Guadalajara Jal", est="Jalisco"),
        # ruido: mostrador
        dict(title="Cajero liquidador", company="Tiendas Delta",
             city="Puebla", description="Atención en piso de venta y punto de venta, detección de billetes falsos en mostrador.",
             min_amount=8000, max_amount=9000, kw="cajero liquidador", loc="Puebla Pue", est="Puebla"),
        # caso borde: señal + ruido → REVISAR
        dict(title="Liquidador", company="Distribuidora del Golfo",
             city="Veracruz", description="Liquidación de rutas de reparto y apoyo en nómina y finiquito del personal.",
             min_amount=11000, max_amount=13000, kw="liquidador", loc="Veracruz Ver", est="Veracruz"),
        # agencia con señal → marcar AGENCIA, no descartar
        dict(title="Liquidador de viajes", company="Capital Humano Selecto",
             city="Querétaro", description="Importante empresa de transporte solicita liquidador de viajes, cuadre de diésel y casetas de operadores.",
             min_amount=13000, max_amount=16000, kw="liquidador de viajes", loc="Querétaro Qro", est="Querétaro"),
        # ruido: seguros
        dict(title="Liquidador de siniestros", company="Seguros Peninsular",
             city="Mérida", description="Ajustador y liquidador de siniestros automotrices.",
             min_amount=None, max_amount=None, kw="liquidador", loc="Mérida Yuc", est="Yucatán"),
        # ruido: sin palabras de señal
        dict(title="Ejecutivo de liquidaciones", company="Banco Central del Bajío",
             city="León", description="Liquidación de operaciones bursátiles y conciliación bancaria.",
             min_amount=18000, max_amount=22000, kw="ejecutivo de liquidaciones", loc="León Gto", est="Guanajuato"),
    ]
    df = pd.DataFrame(rows)
    df["job_url"] = "https://mx.indeed.com/viewjob?jk=mock" + df.index.astype(str)
    df["date_posted"] = "2026-07-20"
    df["location"] = df["city"]
    df["fuente"] = "mock"
    df = df.rename(columns={"kw": "busqueda_keyword", "loc": "busqueda_plaza", "est": "busqueda_estado"})
    return df


# ----------------------------------------------------------------------------
# Procesamiento
# ----------------------------------------------------------------------------

def extract_city(row) -> str:
    loc = normalize(row.get("location"))
    if loc:
        return str(row.get("location")).split(",")[0].strip()
    return str(row.get("busqueda_plaza", ""))


def process(raw: pd.DataFrame) -> pd.DataFrame:
    """Clasifica, deduplica y calcula vacantes simultáneas por empresa."""
    df = raw.copy()
    for col in ["title", "company", "description", "min_amount", "max_amount",
                "date_posted", "job_url", "location"]:
        if col not in df.columns:
            df[col] = None

    records = []
    for _, row in df.iterrows():
        c = classify(row["title"], row["description"], row["company"])
        desc = normalize(row["description"])
        records.append({
            "empresa": str(row["company"] or "").strip() or "(sin empresa)",
            "titulo": str(row["title"] or "").strip(),
            "ciudad": extract_city(row),
            "estado": row.get("busqueda_estado", ""),
            "sueldo_min": row["min_amount"],
            "sueldo_max": row["max_amount"],
            "fecha_publicacion": str(row["date_posted"] or ""),
            "extracto": desc[:500],
            "palabras_senal": c["palabras_senal"],
            "motivo_descarte": c["motivo_descarte"],
            "liga": str(row["job_url"] or ""),
            "keyword_busqueda": row.get("busqueda_keyword", ""),
            "plaza_busqueda": row.get("busqueda_plaza", ""),
            "clasificacion": c["clasificacion"],
            "agencia": c["es_agencia"],
        })
    out = pd.DataFrame(records)
    if out.empty:
        return out

    # deduplicación por empresa + título + ciudad (normalizados)
    out["_key"] = (
        out["empresa"].map(normalize).map(strip_accents) + "|" +
        out["titulo"].map(normalize).map(strip_accents) + "|" +
        out["ciudad"].map(normalize).map(strip_accents)
    )
    out = out.drop_duplicates(subset="_key", keep="first").reset_index(drop=True)

    # vacantes simultáneas: conteo de vacantes distintas por empresa (señal + revisar)
    activas = out[out["clasificacion"].isin(["SEÑAL", "REVISAR"])]
    conteo = activas.groupby(activas["empresa"].map(normalize)).size()
    out["vacantes_simultaneas"] = out["empresa"].map(normalize).map(conteo).fillna(0).astype(int)
    return out


# ----------------------------------------------------------------------------
# Excel
# ----------------------------------------------------------------------------

SHEET_COLS = {
    "detalle": [
        ("empresa", "Empresa", 32), ("titulo", "Título del puesto", 36),
        ("ciudad", "Ciudad", 20), ("estado", "Estado", 20),
        ("sueldo_min", "Sueldo min", 12), ("sueldo_max", "Sueldo max", 12),
        ("fecha_publicacion", "Fecha publicación", 16),
        ("vacantes_simultaneas", "Vacantes simultáneas", 14),
        ("extracto", "Extracto de actividades", 60),
        ("palabras_senal", "Palabras de señal", 28),
        ("liga", "Liga", 40),
        ("keyword_busqueda", "Keyword de búsqueda", 24),
        ("plaza_busqueda", "Plaza de búsqueda", 20),
        ("agencia", "Agencia", 10),
    ],
    "descartadas": [
        ("empresa", "Empresa", 32), ("titulo", "Título", 36),
        ("ciudad", "Ciudad", 20),
        ("motivo_descarte", "Motivo del descarte", 55),
    ],
}


def style_sheet(ws, n_cols: int, widths):
    from openpyxl.styles import Alignment, Font, PatternFill
    from openpyxl.utils import get_column_letter

    header_fill = PatternFill("solid", fgColor="1F3864")  # azul oscuro
    header_font = Font(name="Arial", bold=True, color="FFFFFF")
    body_font = Font(name="Arial", size=10)

    for j in range(1, n_cols + 1):
        cell = ws.cell(row=1, column=j)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(vertical="center", wrap_text=True)
        ws.column_dimensions[get_column_letter(j)].width = widths[j - 1]
    for row in ws.iter_rows(min_row=2):
        for cell in row:
            cell.font = body_font
    ws.auto_filter.ref = ws.dimensions
    ws.freeze_panes = "A2"


def write_df_sheet(writer, df: pd.DataFrame, sheet_name: str, spec_key: str):
    spec = SHEET_COLS[spec_key]
    cols = [c for c, _, _ in spec]
    headers = [h for _, h, _ in spec]
    widths = [w for _, _, w in spec]
    view = df.reindex(columns=cols)
    view.columns = headers
    view.to_excel(writer, sheet_name=sheet_name, index=False)
    style_sheet(writer.sheets[sheet_name], len(cols), widths)


def build_stats(processed: pd.DataFrame, raw_count: int) -> list:
    senal = processed[processed["clasificacion"] == "SEÑAL"]
    revisar = processed[processed["clasificacion"] == "REVISAR"]
    ruido = processed[processed["clasificacion"] == "RUIDO"]

    rows = [
        ("Total vacantes crudas (antes de dedup)", raw_count),
        ("Total tras deduplicación", len(processed)),
        ("Total SEÑAL", len(senal)),
        ("Total RUIDO (descartadas)", len(ruido)),
        ("Total REVISAR (casos borde)", len(revisar)),
        ("Empresas únicas con señal", senal["empresa"].map(normalize).nunique()),
    ]

    sueldos = pd.concat([senal, revisar])[["sueldo_min", "sueldo_max"]].apply(
        pd.to_numeric, errors="coerce")
    promedio = sueldos.stack().mean()
    rows.append(("Sueldo promedio publicado (señal + revisar)",
                 round(float(promedio), 2) if pd.notna(promedio) else "N/D"))

    rows.append(("", ""))
    rows.append(("TOP 10 EMPRESAS POR VACANTES SIMULTÁNEAS", ""))
    top = (senal.groupby("empresa")["vacantes_simultaneas"].max()
           .sort_values(ascending=False).head(10))
    for empresa, cnt in top.items():
        rows.append((empresa, int(cnt)))

    rows.append(("", ""))
    rows.append(("DISTRIBUCIÓN POR ESTADO (SEÑAL)", ""))
    for estado, cnt in senal["estado"].value_counts().items():
        rows.append((estado, int(cnt)))
    return rows


def write_excel(path: Path, processed: pd.DataFrame, raw_count: int):
    senal = processed[processed["clasificacion"] == "SEÑAL"]
    revisar = processed[processed["clasificacion"] == "REVISAR"]
    ruido = processed[processed["clasificacion"] == "RUIDO"]

    with pd.ExcelWriter(path, engine="openpyxl") as writer:
        write_df_sheet(writer, senal, "Señal", "detalle")
        write_df_sheet(writer, revisar, "Revisar", "detalle")
        write_df_sheet(writer, ruido, "Descartadas", "descartadas")

        stats = pd.DataFrame(build_stats(processed, raw_count),
                             columns=["Métrica", "Valor"])
        stats.to_excel(writer, sheet_name="Estadísticas", index=False)
        style_sheet(writer.sheets["Estadísticas"], 2, [55, 20])


def load_existing_keys(path: Path) -> set:
    """Llaves empresa|título|ciudad ya presentes en el Excel (para --append)."""
    if not path.exists():
        return set()
    keys = set()
    for sheet in ("Señal", "Revisar", "Descartadas"):
        try:
            df = pd.read_excel(path, sheet_name=sheet)
        except ValueError:
            continue
        emp = df.get("Empresa", pd.Series(dtype=str))
        tit = df.get("Título del puesto", df.get("Título", pd.Series(dtype=str)))
        ciu = df.get("Ciudad", pd.Series(dtype=str))
        for e, t, c in zip(emp, tit, ciu):
            keys.add(f"{strip_accents(normalize(e))}|{strip_accents(normalize(t))}|{strip_accents(normalize(c))}")
    return keys


def load_existing_rows(path: Path) -> pd.DataFrame:
    """Reconstruye el dataframe procesado desde un Excel existente (para --append)."""
    if not path.exists():
        return pd.DataFrame()
    inverse_detalle = {h: c for c, h, _ in SHEET_COLS["detalle"]}
    inverse_desc = {h: c for c, h, _ in SHEET_COLS["descartadas"]}
    frames = []
    for sheet, clasif, inverse in (("Señal", "SEÑAL", inverse_detalle),
                                   ("Revisar", "REVISAR", inverse_detalle),
                                   ("Descartadas", "RUIDO", inverse_desc)):
        try:
            df = pd.read_excel(path, sheet_name=sheet)
        except ValueError:
            continue
        df = df.rename(columns=inverse)
        df["clasificacion"] = clasif
        frames.append(df)
    return pd.concat(frames, ignore_index=True) if frames else pd.DataFrame()


# ----------------------------------------------------------------------------
# Main
# ----------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Censo de vacantes de liquidación (Indeed MX)")
    parser.add_argument("--hours-old", type=int, default=2160,
                        help="Antigüedad máxima en horas (2160 = 90 días; usa 24 para corrida diaria)")
    parser.add_argument("--results-wanted", type=int, default=50,
                        help="Resultados por búsqueda (default 50)")
    parser.add_argument("--append", action="store_true",
                        help="Agrega solo vacantes nuevas al Excel existente sin duplicar")
    parser.add_argument("--output", default="censo_liquidacion_indeed.xlsx",
                        help="Ruta del Excel de salida")
    parser.add_argument("--raw-csv", default="respaldo_crudo.csv",
                        help="Ruta del respaldo crudo en CSV")
    parser.add_argument("--min-sleep", type=float, default=3.0)
    parser.add_argument("--max-sleep", type=float, default=8.0)
    parser.add_argument("--test", action="store_true",
                        help="Corre el pipeline con datos simulados (sin red)")
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
        handlers=[logging.StreamHandler(sys.stdout),
                  logging.FileHandler("censo_scraper.log", encoding="utf-8")],
    )

    started = datetime.now()
    output = Path(args.output)
    total_busquedas = len(KEYWORDS) * len(LOCATIONS)

    if args.test:
        log.info("MODO PRUEBA: usando datos simulados, sin llamadas de red")
        raw, ok, failed = mock_jobs(), total_busquedas, 0
    else:
        raw, ok, failed = run_searches(args.results_wanted, args.hours_old,
                                       args.min_sleep, args.max_sleep)

    # respaldo crudo (siempre, para reprocesar sin volver a scrapear)
    if len(raw) > 0:
        if args.append and Path(args.raw_csv).exists():
            raw.to_csv(args.raw_csv, mode="a", header=False, index=False)
        else:
            raw.to_csv(args.raw_csv, index=False)
        log.info("Respaldo crudo guardado en %s (%d filas)", args.raw_csv, len(raw))

    processed = process(raw)

    nuevas = len(processed)
    if args.append and output.exists() and not processed.empty:
        existing_keys = load_existing_keys(output)
        processed = processed[~processed["_key"].isin(existing_keys)]
        nuevas = len(processed)
        log.info("Modo append: %d vacantes nuevas (no duplicadas)", nuevas)
        previas = load_existing_rows(output)
        if not previas.empty:
            processed = pd.concat([previas, processed], ignore_index=True)
            # recalcular vacantes simultáneas sobre el consolidado
            activas = processed[processed["clasificacion"].isin(["SEÑAL", "REVISAR"])]
            conteo = activas.groupby(activas["empresa"].map(normalize)).size()
            processed["vacantes_simultaneas"] = (
                processed["empresa"].map(normalize).map(conteo).fillna(0).astype(int))

    if processed.empty:
        log.warning("Sin vacantes que procesar; no se genera Excel")
    else:
        write_excel(output, processed, len(raw))
        log.info("Excel generado: %s", output)

    senal = int((processed["clasificacion"] == "SEÑAL").sum()) if not processed.empty else 0
    revisar = int((processed["clasificacion"] == "REVISAR").sum()) if not processed.empty else 0
    ruido = int((processed["clasificacion"] == "RUIDO").sum()) if not processed.empty else 0

    print("\n" + "=" * 60)
    print("RESUMEN DEL CENSO")
    print("=" * 60)
    print(f"Búsquedas corridas:        {ok + failed} de {total_busquedas}")
    print(f"Búsquedas fallidas:        {failed}")
    print(f"Vacantes crudas:           {len(raw)}")
    print(f"Tras deduplicación:        {len(processed)}")
    print(f"Pasaron el filtro (SEÑAL): {senal}")
    print(f"Casos borde (REVISAR):     {revisar}")
    print(f"Descartadas (RUIDO):       {ruido}")
    if args.append:
        print(f"Vacantes nuevas agregadas: {nuevas}")
    print(f"Duración: {datetime.now() - started}")
    print("=" * 60)


if __name__ == "__main__":
    main()
