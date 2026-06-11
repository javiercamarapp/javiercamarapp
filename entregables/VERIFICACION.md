# VERIFICACIÓN INDEPENDIENTE — Entregables Mundial 2026

**Auditor:** verificador independiente sin contexto previo · **Fecha:** 11-jun-2026
**Método:** scripts propios en `scripts/verificacion/` (`audit_excel.py`, `audit_parlays.py`); recálculo de fórmulas con LibreOffice headless (`/tmp/recalc/QUINIELA_2026_JAVIER_FINAL.xlsx`); todo cotejado contra `data/calendario.json`, `data/predicciones_104.json`, `data/momios_mx.json` y `data/bracket.json`. Nada se tomó por fe.

---

## A. EXCEL — `entregables/QUINIELA_2026_JAVIER_FINAL.xlsx`

| # | Punto | Veredicto | Evidencia |
|---|---|---|---|
| A1 | Hoja Grupos: 72 partidos, marcadores enteros ≥0 en D/E, equipos == calendario.json | **PASS** | 72 partidos (nums 1–72, bloques de 12 grupos en filas 6–110). 144 celdas GL/GV, todas `int ≥ 0`. 72/72 con mismo local/visitante y mismo orden que `calendario.json`. Extra: los 72 marcadores también coinciden 1:1 con `predicciones_104.json`. |
| A2 | Posiciones auto-calculadas (col O) == `tablas_grupos` | **PASS** | Recalculado con `soffice --headless --convert-to xlsx`. En los 12 grupos (A–L), el orden 1°–4° de la col O coincide exactamente con el orden de `tablas_grupos` del JSON (48/48 posiciones). Ej. Grupo A: México, Corea del Sur, Chequia, Sudáfrica. |
| A3 | Hoja Terceros: los 8 con "SÍ" == top-8 de `terceros_ranking` | **PASS** | Excel marca "SÍ" (col H, recalculada) a: Austria, Chequia, Costa de Marfil, Egipto, Escocia, Panamá, Suecia, Turquía. Conjunto idéntico al top-8 del JSON; diferencia simétrica = ∅. Exactamente 8 con "SÍ" y 4 con "no". |
| A4 | Bracket: 32 partidos #73–104, sin empates, ganadores por fórmula == JSON, campeón == ganador #104 | **PASS** | 32 partidos (filas 5–36, nums 73–104 sin huecos). 0 empates en GL/GV (32/32 con ganador, todos `int ≥ 0`). Ganador recalculado (`IF(G>H,F,I)` sobre valores LibreOffice) == campo `ganador` del JSON en 32/32. Celda B38 (CAMPEÓN) = **España** = ganador del #104 (Francia 1–2 España) en Excel y en JSON. |
| A5 | Extras: Bota de Oro y último lugar llenos; datos personales vacíos | **PASS** | B3 = "Kylian Mbappé", B4 = "Curazao". B7 (Nombre) = None, B8 (Email) = None, B9 (Teléfono) = None. |

## B. PARLAYS — `entregables/parlays.json` + `PORTAFOLIO_100_PARLAYS.md`

| # | Punto | Veredicto | Evidencia |
|---|---|---|---|
| B1 | 100 boletos, $500 MXN, 60/20/20 | **PASS** | 100 boletos; Σ apuestas = $500 (100 × $5); estructura {CONSERVADOR: 60, MEDIO: 20, JACKPOT: 20}. |
| B2 | Todos casa=Caliente, n_patas ≤ 8 | **PASS** | 100/100 con `casa = "Caliente"`. Máx n_patas = 6; en 100/100 `n_patas == len(patas)`. |
| B3 | Jackpots ≥7000x y ≥$35,000; ningún pago >$3.6M | **PASS** | Mín multiplicador jackpot = 7,011.5x (≥7000). Mín pago jackpot = $35,057.50 (≥$35,000). Máx pago de TODO el portafolio = $151,363.14 (muy por debajo del tope Caliente de $3,600,000). |
| B4 | Conservadores 1.5–4.0x / 2–3 patas; Medios 20–300x / 4–6 patas | **PASS** | Conservadores: mult ∈ [1.59, 3.87], todos 2–3 patas (0 fuera de rango). Medios: mult ∈ [20.15, 274.97], todos 4–6 patas (0 fuera de rango). |
| B5 | mult == Π momios (±0.5%); prob_real == Π probs (±0.5%); pago == 5×mult | **PASS** | 100/100 multiplicadores dentro de tolerancia vs producto de `momio_decimal`. 100/100 `prob_real` dentro de tolerancia vs producto de `prob_real` de patas. 100/100 con `pago_potencial_mxn = 5 × multiplicador`. |
| B6 | Ningún evento en >30% de boletos de su tier | **PASS** | Máximos por tier (todos exactamente en el límite, ninguno lo rebasa): CONSERVADOR "Colombia gana a Uzbekistán" 18/60 = 30.0%; MEDIO "España gana el Grupo H" 6/20 = 30.0%; JACKPOT "Mbappé Bota de Oro" 6/20 = 30.0%. |
| B7 | Sin dos patas del mismo partido; sin "Colombia gana Grupo K" + pata de Portugal vs Colombia | **PASS** | Las 232 patas a nivel partido (1X2, marcador exacto, empate) se mapearon de forma única a partidos de `calendario.json` (con alias Bosnia/EUA/etc. y fecha; 0 sin resolver). 0 boletos con dos patas del mismo partido. Portugal vs Colombia = partido #69; 0 boletos combinan la tesis del Grupo K con pata alguna del #69. |
| B8 | Markdown contiene los 100 boletos | **PASS** | `PORTAFOLIO_100_PARLAYS.md` tiene exactamente 100 encabezados `### Boleto #`, numerados 1–100 sin faltantes ni duplicados. |

## C. MOMIOS

| # | Punto | Veredicto | Evidencia |
|---|---|---|---|
| C1 | Toda pata con campo `fuente` no vacío | **PASS** | 350/350 patas con fuente no vacía. |
| C2 | Toda pata EST lleva "PENDIENTE-CAPTURA" en su fuente | **PASS** | 129/129 patas con `estatus = "EST"` contienen "PENDIENTE-CAPTURA" en `fuente`. Nada estimado se presenta como real. |
| C3 | Patas REAL citan URL o casa reconocible | **PASS** | 221/221 patas REAL (19 fuentes distintas) citan URL/dominio o casa: espn.com, legalsportsreport.com, flashscore, gambling.com, foxsports, Caliente, bet365, Polymarket, etc. Nota del auditor: 1 pata (boleto #25, "España gana a Cabo Verde") cita "US books vía vegasodds.com (mercado parcial)" — disparó mi primer filtro por lista de casas, pero `vegasodds.com` es un dominio identificable, así que cumple el criterio "URL o casa reconocible". No hay patas REAL con fuente vaga sin dominio. |
| C4 | Spot-check: México 1.38 y Colombia Grupo K 3.50 en `momios_mx.json` con URL | **PASS** | `partidos[México vs Sudáfrica].momios_decimal.local = 1.38`, fuente https://www.gambling.com/mx/news/mexico-vs-sudafrica-mundial-2026. `ganador_grupo[K, Colombia].momio_decimal = 3.5`, fuente https://www.flashscore.com.ar/... (previa Grupo K). |

## D. RESUMEN — `entregables/RESUMEN.md`

| # | Punto | Veredicto | Evidencia |
|---|---|---|---|
| D1 | Existe | **PASS** | `/home/user/javiercamarapp/entregables/RESUMEN.md` (59 líneas). |
| D2 | Menciona P(≥1 jackpot) | **PASS** | Sección "HONESTIDAD BRUTAL": "P(que AL MENOS UN jackpot pegue): ~0.12% ≈ 1 entre 830". |
| D3 | Lista capturas faltantes | **PASS** | Sección 4 "Capturas que FALTAN de tu app de Caliente" con 6 ítems + referencia a los 20 de `momios_mx.json → faltantes_para_captura`. |
| D4 | Número coincide con parlays.json | **PASS** | `parlays.json → resumen.p_al_menos_un_jackpot = 0.001206` = 0.1206% ≈ "~0.12%" del RESUMEN. Coherente con el rango ~0.0012 esperado. |

---

## VEREDICTO GLOBAL: ✅ PASS (25/25 puntos verificados, 0 FAIL)

Los tres entregables son internamente consistentes entre sí y con los datos fuente de `data/`. Las fórmulas del Excel se recalcularon con LibreOffice (no se confió en valores cacheados) y reproducen exactamente la simulación. La aritmética de los 100 boletos cuadra al 100% dentro de tolerancia, los límites de casa y de tier se respetan (la diversificación queda exactamente en el límite de 30% en los tres tiers — al filo, pero cumple), no hay correlaciones prohibidas, y el etiquetado REAL/EST de momios es honesto y rastreable.

**Observaciones menores (no son FAIL):**
1. B6 queda exactamente en 30.0% en los tres tiers — cumple el criterio "≤30%" sin margen.
2. La pata REAL del boleto #25 cita "vegasodds.com (mercado parcial)" sin URL completa; es la fuente más débil de las 19 usadas.
3. Los marcadores de grupos del Excel coinciden 72/72 con `predicciones_104.json` (verificación extra no solicitada).
