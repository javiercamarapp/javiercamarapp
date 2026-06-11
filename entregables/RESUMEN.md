# RESUMEN EJECUTIVO — Mundial 2026 · Quiniela + Portafolio
**Generado: 11-jun-2026 (día inaugural) · Para: Javier · Todos los números son rastreables a `data/` y `entregables/`**

---

## 1. Quiniela (`QUINIELA_2026_JAVIER_FINAL.xlsx`)
Verificada con recálculo LibreOffice: posiciones auto-calculadas == simulación, KO sin empates, campeón coherente. **Bracket corregido al cuadro OFICIAL FIFA** (dos mitades): España (1H) y Argentina (1J) en lados OPUESTOS — solo pueden cruzarse en la final.

**Picks clave:**
- 🏆 **Campeona: ESPAÑA** (le gana la final a **Argentina** 2-1 vía penales, 19-jul MetLife). Modelo MC: España 21.2% campeona (mercado ~16-18%, Caliente +400). Pick #1 del mercado Y del modelo.
- **Bracket oficial respetado:** mitad izquierda = Francia, Alemania, España, Países Bajos; mitad derecha = Brasil, Inglaterra, Argentina, Portugal. **Cuartos:** Argentina–Portugal (Messi-Ronaldo, KC #97), Brasil–Inglaterra (#98), España–Países Bajos (#99), Francia–Alemania (#100). **Semis:** España–Francia (#102) y Argentina–Inglaterra (#101). **3er lugar:** Francia.
- **Grupo K: Portugal 1°, Colombia 2°** — decisión de Javier (Compuerta 1) siguiendo el mercado (Polymarket 62-63% Portugal). El modelo puro daba Colombia 52.7%; la tesis vive en los parlays.
- **México gana el Grupo A** (Polymarket 57%, modelo 63.5%), elimina a Escocia en dieciseisavos en el Azteca y cae vs Inglaterra en octavos (Azteca, 5-jul).
- **Bota de Oro: Mbappé** (+600 favorito; Francia llega a semis). **Último lugar: Curazao** (0 pts, −5; Elo 1500).
- Marcadores: modal Poisson/Dixon-Coles; cruces de KO con "+1 gol por penales" (regla del template).

## 2. Portafolio SOÑADOR (`PORTAFOLIO_74_SONADORES.md` / `.pdf` + `parlays.json`)
**$370 MXN: 74 boletos × $5, TODOS en Caliente, TODOS pagan >$35,000.** Estructura 60/20/20 como NIVELES DE SUEÑO (decisión de Javier: "que paguen un chingo, son soñadores"). Verificación `scripts/verificar_portafolio.py` → **TODO PASS** (≤8 patas, ≥7,000x, diversificación ≤30%, 0 correlaciones, 0 boletos que mueran el día 1).

| Nivel | Boletos | Pago | Multiplicador | Prob/boleto |
|---|---|---|---|---|
| 🌙 Soñador | 44 | $35k–$150k | 7,000–30,000x | ~1 entre miles |
| 🚀 Súper soñador | 15 | $150k–$750k | 30,000–150,000x | ~1 entre decenas de miles |
| 🎰 Lotería máxima | 15 | $750k–$1.1M | 150,000–720,000x | ~1 entre cientos de miles |

### 🚨 HONESTIDAD BRUTAL
- **P(que CUALQUIERA de los 74 pegue): ~0.47% ≈ 1 entre 213.** Así de real. Lo más probable, por MUCHO, es perder los $370.
- Son moonshots de marcadores exactos: casi todos los momios son `EST · PENDIENTE-CAPTURA` (estimación del modelo, factor 0.86 calibrado con el único exacto real hallado, México 1-0 a +550). Valídalos en la app de Caliente antes de apostar.
- Upside no contado: bono parlay fútbol de Caliente (hasta +100% sobre ganancias, aplica al Mundial 2026).

## 3. Las 5 mejores apuestas de VALOR detectadas
(edge = prob_real × momio − 1; prob_real = mezcla modelo+mercado, ver `data/probabilidades_mc.json`)

| # | Apuesta | Momio (fuente) | Prob real | Edge |
|---|---|---|---|---|
| 1 | **Colombia gana el Grupo K** | 3.50 (Flashscore; US +200/+225) | ~42% (modelo 52.7% / mercado 31%) | **+47%** |
| 2 | Argentina campeona | 8.50 (Caliente +750) | 14.1% (MC) | +20% |
| 3 | Mbappé Bota de Oro | 7.00 (FOX +600; Polymarket 16-17%) | ~16.5% | +16% |
| 4 | México gana el Grupo A | 1.83 (US books −120) | ~60% | +10% |
| 5 | España campeona | 5.00 (Caliente +400) | 21.2% (MC) | +6% |

La #1 es tu tesis original: el mercado la castigó (Portugal 62%) pero el modelo de condiciones (Miami sin techo + altura CDMX, Colombia adaptada a ambas) la sigue viendo viva — por eso va en 6 medios y 6 jackpots, no en la quiniela.

## 4. Capturas que FALTAN de tu app de Caliente (antes de apostar)
Los momios `EST · PENDIENTE-CAPTURA` (sobre todo marcadores exactos de los jackpots) son estimaciones del modelo con factor 0.86 calibrado con el único exacto real hallado (México 1-0 a +550, bet365). **Captura y valida:**
1. Grilla de marcador exacto: México-Sudáfrica (HOY), España-Cabo Verde (15-jun), Argentina-Argelia (16-jun), Brasil-Marruecos (13-jun), Inglaterra-Ghana (23-jun) y los demás exactos del tier jackpot.
2. Ganador Grupo K en Caliente (Portugal/Colombia) — precio exacto de la tesis.
3. 1X2 de Portugal-RD Congo (17-jun) y Corea del Sur-Chequia (12-jun) — cero momios encontrados.
4. Momio del empate España-Cabo Verde; doble oportunidad y O/U del México-Sudáfrica.
5. Tabla de % del bono parlay fútbol y máximo de selecciones (¿8 o 20?) en Caliente.
6. Mínimo de apuesta de Draftea (si acepta $5, se puede migrar parte del tier conservador).
Lista completa: `data/momios_mx.json → faltantes_para_captura` (20 ítems).

## 5. Caveats del proceso
- El template Excel es RECONSTRUIDO (el original de Pablo no estaba en el repo): mismas reglas de puntaje declaradas (pts→dif→GF→alfabético, KO sin empates); transcribe los 104 marcadores al formato oficial.
- Red del entorno bloqueó Caliente/Draftea/Odds API → momios vía WebSearch con fuente y timestamp (frescura 8-11 jun), nada inventado sin etiqueta.
- Asignación de terceros del bracket: aproximación por elegibilidad FIFA (la tabla oficial de 495 combinaciones no era accesible); emparejamiento de semifinales etiquetado INFERIDO (patrón secuencial estándar).
- Honduras NO clasificó (el dato del brief era erróneo); España debuta vs Cabo Verde, no Curazao.
