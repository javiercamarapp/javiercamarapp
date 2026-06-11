# TODO — Máquina de Predicción Mundial 2026

> Estado al 11-jun-2026. Plan aprobado por Javier (activos originales NO existían;
> reconstrucción desde cero. Momios: WebSearch + capturas. Quiniela vigente).

## FASE 0 — Reconstrucción de activos ✅ COMPLETA
- [x] Verificación: activos no existían → Javier autorizó reconstrucción
- [x] Red: Odds API/Caliente/Draftea BLOQUEADOS (allowlist); WebSearch SÍ
- [x] openpyxl + libreoffice-calc instalados
- [x] Subagente ESTRUCTURA: 12 grupos (≥2 fuentes c/u), 72 partidos confirmados,
      sedes, bracket (anclas M80/M90/M95), Elo 48 equipos → `data/`
- [x] `modelo_mundial.py` reconstruido + smoke-test (México 67.1% mezcla vs 68.4% Caliente)
- [x] Template Excel: fórmulas == lógica Python (recálculo LibreOffice) → PASS
- [x] COMPUERTA 0 mostrada con evidencia

## FASE 1 — Investigación ✅ COMPLETA (4 subagentes paralelos)
- [x] A momios → `data/momios_mx.json` (19 campeón, 18 grupos, 12 partidos de-vig, 15 bota, reglas casas)
- [x] B lesiones → `data/lesiones.md` (tesis Colombia INTACTA; Yamal/Messi/Saliba mejoran)
- [x] C clima → `data/clima.md` (bandera roja Miami 15-jun y Monterrey diurno)
- [x] D mercados → `data/mercado_prediccion.md` (ALERTA Grupo K: Portugal 62-63%)
- [x] COMPUERTA 1: Javier decidió Portugal 1°/Colombia 2° en quiniela; tesis Colombia
      en parlays; momios faltantes → PENDIENTE-CAPTURA y sigue

## FASE 2 — Modelado ✅ COMPLETA
- [x] 72 partidos (mezcla 50/50 donde hay línea) + Dixon-Coles → `data/predicciones_104.json/.md`
- [x] Posiciones + terceros + bracket; ajuste forzado Grupo K documentado
- [x] KO completo: España campeona (2-1 a Francia, penales)
- [x] Monte Carlo 20k torneos → `data/probabilidades_mc.json` (España 21.2% campeona)
- [x] Sanity check vs referencia: divergencias justificadas (final España-Inglaterra era
      imposible con el bracket real; Honduras no clasificó; España debuta vs Cabo Verde)
- [x] COMPUERTA 2 mostrada

## FASE 3 — Entregables ✅ COMPLETA (`entregables/`)
- [x] 3A `QUINIELA_2026_JAVIER_FINAL.xlsx` (recálculo LibreOffice == simulación: PASS)
- [x] 3B `PORTAFOLIO_100_PARLAYS.md` + `parlays.json` (60/20/20, $500, TODO PASS,
      fix de correlaciones excluyentes aplicado y re-verificado)
- [x] 3C `RESUMEN.md` (P(≥1 jackpot) ~0.12%, top 5 valor, capturas faltantes)
- [x] COMPUERTA 3: los 3 archivos abren sin error

## FASE 4 — Verificación independiente 🔄 EN CURSO
- [ ] Subagente verificador fresco → `entregables/VERIFICACION.md` PASS/FAIL
- [ ] Corregir FAILs si los hay y re-verificar
- [ ] Entrega final con confirmación de Javier + push

## Pendientes de JAVIER (no bloquean la entrega)
- Capturas de Caliente: marcadores exactos de jackpots, Grupo K, 1X2 faltantes,
  tabla del bono parlay (lista completa: `data/momios_mx.json → faltantes_para_captura`)
- Confirmar mínimo de Draftea (si acepta $5, se puede migrar parte del tier conservador)
