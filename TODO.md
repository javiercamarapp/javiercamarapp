# TODO — Máquina de Predicción Mundial 2026

> Estado al 11-jun-2026. Plan aprobado por Javier (los activos originales NO existían;
> se reconstruyen desde cero. Momios: WebSearch + capturas de Javier. Quiniela sigue vigente).

## FASE 0 — Reconstrucción de activos
- [x] Verificación: `modelo_mundial.py` y template .xlsx NO existen → Javier autorizó reconstrucción
- [x] Red verificada: Odds API / Caliente / Draftea BLOQUEADOS (allowlist); WebSearch SÍ funciona
- [x] `pip install openpyxl`
- [ ] Subagente ESTRUCTURA: grupos reales, calendario 72 partidos, sedes, bracket, Elo 48 equipos → `data/`
- [ ] `modelo_mundial.py` reconstruido (Elo→Poisson + ajustes localía/altura/calor + Dixon-Coles)
- [ ] Smoke-test del modelo con output mostrado
- [ ] `QUINIELA_2026_TEMPLATE_RECONSTRUIDO.xlsx` (posiciones por fórmulas + bracket auto-poblado)
- [ ] COMPUERTA 0: modelo corre + Excel calcula → evidencia + commit/push

## FASE 1 — Investigación (subagentes en paralelo, solo WebSearch)
- [ ] A momios → `data/momios_mx.json` (+ lista de capturas faltantes para Javier)
- [ ] B lesiones → `data/lesiones.md`
- [ ] C clima → `data/clima.md`
- [ ] D mercado de predicción → `data/mercado_prediccion.md`
- [ ] COMPUERTA 1: reportar cambios mayores vs inteligencia 10-jun; confirmar llamada Colombia gana K; pedir capturas

## FASE 2 — Modelado
- [ ] 72 partidos de grupos: prob modelo + mercado + mezcla 50/50 + marcador Poisson/Dixon-Coles
- [ ] Simulación de posiciones + mejores terceros FIFA + bracket
- [ ] Modelo en cada cruce KO ("sin línea de mercado"; empates → +1 gol por penales)
- [ ] Sanity check vs referencia (España campeón 2-1, Mbappé, Curazao último, Colombia gana K)
- [ ] COMPUERTA 2: tabla de 104 predicciones con probabilidades mostrada

## FASE 3 — Entregables (`entregables/` con timestamp)
- [ ] 3A `QUINIELA_2026_JAVIER_FINAL.xlsx` (verificada vs simulación)
- [ ] 3B `PORTAFOLIO_100_PARLAYS.md` + `parlays.json` (60/20/20, $500, diversificación verificada por script)
- [ ] 3C `RESUMEN.md` (1 página, honestidad de probabilidades)
- [ ] COMPUERTA 3: 3 archivos abren sin error → commit/push

## FASE 4 — Verificación independiente
- [ ] Subagente fresco → `entregables/VERIFICACION.md` PASS/FAIL
- [ ] Corregir FAILs y re-verificar
- [ ] Entrega final con confirmación de Javier + push

## Riesgos aceptados
- Momios de marcador exacto dependen de capturas de Javier (se marcan PENDIENTE-CAPTURA, jamás se inventan como reales)
- El Excel reconstruido NO es el template oficial de Pablo (sirve para transcribir)
- Elo de equipos menores puede ir ESTIMADO y etiquetado
