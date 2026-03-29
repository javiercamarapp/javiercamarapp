import {
  CREDIT_SCORE_WEIGHTS,
  FRECUENCIA_SCORES,
  TAMANO_THRESHOLDS,
} from '@/lib/constants'

interface CreditScoreInput {
  completitud_pct: number
  dias_activo: number
  frecuencia_uso: 'diario' | 'semanal' | 'mensual' | 'irregular'
  gdp_promedio: number
  gdp_benchmark: number
  tasa_prenez: number
  mortalidad_pct: number
  ingresos_12m: number
  egresos_12m: number
  meses_en_plataforma: number
  vacunas_al_dia_pct: number
  siniiga_completo: boolean
  total_animales: number
}

export function calculateCreditScore(input: CreditScoreInput) {
  const score_completitud = Math.min(100, Math.round(input.completitud_pct))

  const score_regularidad = FRECUENCIA_SCORES[input.frecuencia_uso]

  const gdpRatio = input.gdp_benchmark > 0 ? input.gdp_promedio / input.gdp_benchmark : 0.5
  const score_productividad = Math.min(100, Math.round(
    (Math.min(gdpRatio, 1.5) / 1.5 * 40) +
    (input.tasa_prenez * 0.4) +
    (Math.max(0, 100 - input.mortalidad_pct * 10) * 0.2)
  ))

  const margen = input.ingresos_12m > 0
    ? (input.ingresos_12m - input.egresos_12m) / input.ingresos_12m
    : 0
  const score_financiero = Math.min(100, Math.round(
    (margen > 0.3 ? 100 : margen > 0.1 ? 70 : margen > 0 ? 40 : 10)
  ))

  const score_antiguedad = Math.min(100, Math.round(input.meses_en_plataforma / 24 * 100))

  const score_sanitario = Math.min(100, Math.round(
    (input.vacunas_al_dia_pct * 0.7) +
    (input.siniiga_completo ? 30 : 0)
  ))

  const score_tamano = Math.min(100, Math.round(
    (TAMANO_THRESHOLDS.find(t => input.total_animales >= t.min) ?? TAMANO_THRESHOLDS[TAMANO_THRESHOLDS.length - 1]).score
  ))

  const score_total = Math.round(
    score_completitud * CREDIT_SCORE_WEIGHTS.completitud +
    score_regularidad * CREDIT_SCORE_WEIGHTS.regularidad +
    score_productividad * CREDIT_SCORE_WEIGHTS.productividad +
    score_financiero * CREDIT_SCORE_WEIGHTS.financiero +
    score_antiguedad * CREDIT_SCORE_WEIGHTS.antiguedad +
    score_sanitario * CREDIT_SCORE_WEIGHTS.sanitario +
    score_tamano * CREDIT_SCORE_WEIGHTS.tamano
  )

  return {
    score_total,
    score_completitud,
    score_regularidad,
    score_productividad,
    score_financiero,
    score_antiguedad,
    score_sanitario,
    score_tamano,
  }
}
