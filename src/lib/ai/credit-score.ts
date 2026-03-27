export interface CreditScoreInput {
  // Productividad (20%)
  gdpPromedio: number
  gdpBenchmark: number
  gdpTendencia: "mejorando" | "estable" | "empeorando"
  pesoAjustado205: number
  pesoEstandar205: number

  // Sanidad (15%)
  pctVacunasAlDia: number
  tasaMortalidad: number
  mortalidadBenchmark: number
  campanasCompletadas: number
  campanasTotal: number

  // Genética (10%)
  usaIA: boolean
  usaTE: boolean
  pctGenealogiaCompleta: number
  sementalesCalidad: number

  // Economía (25%)
  margenBruto: number
  numFuentesIngreso: number
  ventasRegulares: boolean

  // Registros (15%)
  frecuenciaUsoSemanal: number
  pctCamposLlenos: number
  mesesConsistentes: number
  mesesTotales: number

  // Crecimiento (15%)
  tendenciaHato: "creciendo" | "estable" | "decreciendo"
  tasaReposicion: number
  reinversionPct: number
}

export interface CreditScoreResult {
  productividad: number
  sanidad: number
  genetica: number
  economia: number
  registros: number
  crecimiento: number
  total: number
  nivel: "excelente" | "bueno" | "regular" | "bajo"
}

function clamp(val: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, val))
}

export function calculateCreditScore(input: CreditScoreInput): CreditScoreResult {
  // Productividad (0-100)
  const gdpRatio = input.gdpBenchmark > 0 ? input.gdpPromedio / input.gdpBenchmark : 0
  const gdpScore = clamp(gdpRatio * 50)
  const gdpTrendScore =
    input.gdpTendencia === "mejorando" ? 30 : input.gdpTendencia === "estable" ? 15 : 0
  const pesoRatio =
    input.pesoEstandar205 > 0 ? input.pesoAjustado205 / input.pesoEstandar205 : 0
  const pesoScore = clamp(pesoRatio * 20)
  const productividad = clamp(gdpScore + gdpTrendScore + pesoScore)

  // Sanidad (0-100)
  const vacunasScore = clamp((input.pctVacunasAlDia / 100) * 40)
  const mortalidadScore =
    input.tasaMortalidad <= input.mortalidadBenchmark
      ? 30
      : clamp(30 - (input.tasaMortalidad - input.mortalidadBenchmark) * 10)
  const campanasScore =
    input.campanasTotal > 0
      ? clamp((input.campanasCompletadas / input.campanasTotal) * 30)
      : 15
  const sanidad = clamp(vacunasScore + mortalidadScore + campanasScore)

  // Genética (0-100)
  const iaTeScore = (input.usaIA ? 20 : 0) + (input.usaTE ? 20 : 0)
  const genealogiaScore = clamp((input.pctGenealogiaCompleta / 100) * 30)
  const sementalesScore = clamp(input.sementalesCalidad * 10, 0, 30)
  const genetica = clamp(iaTeScore + genealogiaScore + sementalesScore)

  // Economía (0-100)
  const margenScore = input.margenBruto > 0 ? 40 : clamp(20 + input.margenBruto / 1000)
  const diversificacionScore = clamp(input.numFuentesIngreso * 10, 0, 30)
  const ventasScore = input.ventasRegulares ? 30 : 10
  const economia = clamp(margenScore + diversificacionScore + ventasScore)

  // Registros (0-100)
  const frecuenciaScore = clamp(input.frecuenciaUsoSemanal * 8, 0, 40)
  const completitudScore = clamp((input.pctCamposLlenos / 100) * 30)
  const consistenciaScore =
    input.mesesTotales > 0
      ? clamp((input.mesesConsistentes / input.mesesTotales) * 30)
      : 0
  const registros = clamp(frecuenciaScore + completitudScore + consistenciaScore)

  // Crecimiento (0-100)
  const tendenciaScore =
    input.tendenciaHato === "creciendo" ? 40 : input.tendenciaHato === "estable" ? 20 : 0
  const reposicionScore = clamp(input.tasaReposicion * 30, 0, 30)
  const reinversionScore = clamp(input.reinversionPct * 3, 0, 30)
  const crecimiento = clamp(tendenciaScore + reposicionScore + reinversionScore)

  // Total weighted
  const total = Math.round(
    productividad * 0.2 +
      sanidad * 0.15 +
      genetica * 0.1 +
      economia * 0.25 +
      registros * 0.15 +
      crecimiento * 0.15
  )

  const nivel =
    total >= 80 ? "excelente" : total >= 60 ? "bueno" : total >= 40 ? "regular" : "bajo"

  return {
    productividad: Math.round(productividad),
    sanidad: Math.round(sanidad),
    genetica: Math.round(genetica),
    economia: Math.round(economia),
    registros: Math.round(registros),
    crecimiento: Math.round(crecimiento),
    total,
    nivel,
  }
}
