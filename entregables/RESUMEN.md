# RESUMEN EJECUTIVO — Mundial 2026 · Quiniela + Portafolio
**Generado: 11-jun-2026 (día inaugural) · Para: Javier · Todos los números son rastreables a `data/` y `entregables/`**

---

## 1. Quiniela (`QUINIELA_2026_JAVIER_FINAL.xlsx`)
Verificada con recálculo LibreOffice: posiciones auto-calculadas == simulación, KO sin empates, campeón coherente.

**Picks clave:**
- 🏆 **Campeona: ESPAÑA** (le gana la final a Francia 2-1 vía penales, 19-jul MetLife). Modelo MC: España 21.2% campeona (mercado ~16-18%, Caliente +400). Es el pick #1 del mercado Y del modelo.
- **Final España–Francia** (no España–Inglaterra como la referencia previa: con el bracket real, Inglaterra cae del lado de Francia — semifinal #101 — y esa final era estructuralmente imposible si ambas ganan su grupo).
- **Grupo K: Portugal 1°, Colombia 2°** — decisión de Javier (Compuerta 1) siguiendo el mercado (Polymarket 62-63% Portugal). OJO: el modelo puro daba Colombia 52.7% (calor de Miami + altura CDMX la favorecen); la tesis vive en los parlays.
- **México gana el Grupo A** (Polymarket 57%, modelo 63.5%) y elimina a Escocia en dieciseisavos en el Azteca… y cae 1-2 vs Colombia en octavos (CDMX, 5-jul).
- **Semis:** Francia–Inglaterra y Brasil–España. **3er lugar:** Brasil.
- **Bota de Oro: Mbappé** (+600 favorito; Francia llega a la final). **Último lugar: Curazao** (0 pts, −5; Elo 1500).
- Marcadores: modal Poisson/Dixon-Coles por partido; 17 cruces de KO marcados "+1 gol por penales" (regla del template).

## 2. Portafolio de 100 parlays (`PORTAFOLIO_100_PARLAYS.md` + `parlays.json`)
**$500 MXN: 100 boletos × $5, estructura 60/20/20, TODOS en Caliente** (mínimo $5-10 confirmado; el de Draftea NO se confirmó → regla del proyecto). Verificación automática: `scripts/verificar_portafolio.py` → **TODO PASS** (límites de casa, ≥7,000x en jackpots, diversificación ≤30% por evento/tier, 0 boletos que mueran el día 1, 0 patas anticorrelacionadas).

| Tier | Boletos | Pago | Prob/boleto | EV |
|---|---|---|---|---|
| Conservador | 60 | 1.5x–4x | 25%–60% (esperados ~24 ganadores) | ~$304 |
| Medio | 20 | 20x–300x | 0.6%–3.4% | ~$129 |
| Jackpot | 20 | $35,065–$151,363 | **~1 entre 14,800 a 1 entre 26,300 c/u** | ~$68 |

### 🚨 HONESTIDAD BRUTAL
- **P(que AL MENOS UN jackpot pegue): ~0.12% ≈ 1 entre 830.** Así de real.
- EV total ≈ $500 según el modelo (breakeven), pero el escenario MÁS PROBABLE es recuperar $100–200 vía conservadores. Esto es entretenimiento con presupuesto cerrado, no inversión.
- Upside no contado: bono parlay fútbol de Caliente (hasta +100% sobre ganancias, aplica al Mundial 2026, vigente a dic-2026).

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
