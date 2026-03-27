// ---------------------------------------------------------------------------
// HatoAI Credit Score Calculator
// 6 axes weighted to produce a 0-100 composite score
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

export interface CreditScoreInput {
  // Productividad (20%)
  gdpPromedio: number
  gdpBenchmark: number
  gdpTendencia: "mejorando" | "estable" | "empeorando"
  pesoAjustado205: number
  pesoEstandar205: number

  // Sanidad (15%)
  pctVacunasAlDia: number        // 0-100
  tasaMortalidad: number          // annual %
  mortalidadBenchmark: number     // annual %
  campanasCompletadas: number
  campanasTotal: number

  // Genetica (10%)
  usaIA: boolean                  // inseminacion artificial
  usaTE: boolean                  // transferencia de embriones
  pctGenealogiaCompleta: number   // 0-100
  sementalesCalidad: number       // 0-5 subjective score

  // Economia (25%)
  margenBruto: number             // MXN (ingresos - egresos)
  numFuentesIngreso: number       // diversification count
  ventasRegulares: boolean        // has consistent sales history

  // Registros (15%)
  frecuenciaUsoSemanal: number    // avg sessions/week
  pctCamposLlenos: number         // 0-100 data completeness
  mesesConsistentes: number       // months with regular data entry
  mesesTotales: number            // total months since onboarding

  // Crecimiento (15%)
  tendenciaHato: "creciendo" | "estable" | "decreciendo"
  tasaReposicion: number          // replacement rate 0-1
  reinversionPct: number          // % of income reinvested
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

export type CreditLevel = "excelente" | "bueno" | "regular" | "bajo"

export interface AxisDetail {
  score: number
  weight: number
  weightedScore: number
  desglose: Record<string, number>
}

export interface CreditScoreResult {
  productividad: number
  sanidad: number
  genetica: number
  economia: number
  registros: number
  crecimiento: number
  total: number
  nivel: CreditLevel
  detalle: {
    productividad: AxisDetail
    sanidad: AxisDetail
    genetica: AxisDetail
    economia: AxisDetail
    registros: AxisDetail
    crecimiento: AxisDetail
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clamp(val: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, val))
}

function determineLevel(total: number): CreditLevel {
  if (total >= 80) return "excelente"
  if (total >= 60) return "bueno"
  if (total >= 40) return "regular"
  return "bajo"
}

// ---------------------------------------------------------------------------
// Calculator
// ---------------------------------------------------------------------------

export function calculateCreditScore(input: CreditScoreInput): CreditScoreResult {
  // --- Productividad (0-100) weight=20% ---
  const gdpRatio = input.gdpBenchmark > 0
    ? input.gdpPromedio / input.gdpBenchmark
    : 0
  const gdpScore = clamp(gdpRatio * 50)
  const gdpTrendScore =
    input.gdpTendencia === "mejorando" ? 30
    : input.gdpTendencia === "estable" ? 15
    : 0
  const pesoRatio = input.pesoEstandar205 > 0
    ? input.pesoAjustado205 / input.pesoEstandar205
    : 0
  const pesoScore = clamp(pesoRatio * 20)
  const productividad = clamp(gdpScore + gdpTrendScore + pesoScore)

  // --- Sanidad (0-100) weight=15% ---
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

  // --- Genetica (0-100) weight=10% ---
  const iaTeScore = (input.usaIA ? 20 : 0) + (input.usaTE ? 20 : 0)
  const genealogiaScore = clamp((input.pctGenealogiaCompleta / 100) * 30)
  const sementalesScore = clamp(input.sementalesCalidad * 6, 0, 30)
  const genetica = clamp(iaTeScore + genealogiaScore + sementalesScore)

  // --- Economia (0-100) weight=25% ---
  const margenScore =
    input.margenBruto > 0
      ? 40
      : clamp(20 + input.margenBruto / 1000)
  const diversificacionScore = clamp(input.numFuentesIngreso * 10, 0, 30)
  const ventasScore = input.ventasRegulares ? 30 : 10
  const economia = clamp(margenScore + diversificacionScore + ventasScore)

  // --- Registros (0-100) weight=15% ---
  const frecuenciaScore = clamp(input.frecuenciaUsoSemanal * 8, 0, 40)
  const completitudScore = clamp((input.pctCamposLlenos / 100) * 30)
  const consistenciaScore =
    input.mesesTotales > 0
      ? clamp((input.mesesConsistentes / input.mesesTotales) * 30)
      : 0
  const registros = clamp(frecuenciaScore + completitudScore + consistenciaScore)

  // --- Crecimiento (0-100) weight=15% ---
  const tendenciaScore =
    input.tendenciaHato === "creciendo" ? 40
    : input.tendenciaHato === "estable" ? 20
    : 0
  const reposicionScore = clamp(input.tasaReposicion * 30, 0, 30)
  const reinversionScore = clamp(input.reinversionPct * 3, 0, 30)
  const crecimiento = clamp(tendenciaScore + reposicionScore + reinversionScore)

  // --- Total weighted score ---
  const total = Math.round(
    productividad * 0.20 +
    sanidad * 0.15 +
    genetica * 0.10 +
    economia * 0.25 +
    registros * 0.15 +
    crecimiento * 0.15
  )

  const nivel = determineLevel(total)

  return {
    productividad: Math.round(productividad),
    sanidad: Math.round(sanidad),
    genetica: Math.round(genetica),
    economia: Math.round(economia),
    registros: Math.round(registros),
    crecimiento: Math.round(crecimiento),
    total,
    nivel,
    detalle: {
      productividad: {
        score: Math.round(productividad),
        weight: 0.20,
        weightedScore: Math.round(productividad * 0.20),
        desglose: {
          gdpVsBenchmark: Math.round(gdpScore),
          gdpTendencia: gdpTrendScore,
          pesoAjustado: Math.round(pesoScore),
        },
      },
      sanidad: {
        score: Math.round(sanidad),
        weight: 0.15,
        weightedScore: Math.round(sanidad * 0.15),
        desglose: {
          vacunasAlDia: Math.round(vacunasScore),
          mortalidad: Math.round(mortalidadScore),
          campanas: Math.round(campanasScore),
        },
      },
      genetica: {
        score: Math.round(genetica),
        weight: 0.10,
        weightedScore: Math.round(genetica * 0.10),
        desglose: {
          iaYTe: iaTeScore,
          genealogia: Math.round(genealogiaScore),
          sementales: Math.round(sementalesScore),
        },
      },
      economia: {
        score: Math.round(economia),
        weight: 0.25,
        weightedScore: Math.round(economia * 0.25),
        desglose: {
          margenBruto: Math.round(margenScore),
          diversificacion: Math.round(diversificacionScore),
          ventasRegulares: ventasScore,
        },
      },
      registros: {
        score: Math.round(registros),
        weight: 0.15,
        weightedScore: Math.round(registros * 0.15),
        desglose: {
          frecuenciaUso: Math.round(frecuenciaScore),
          completitud: Math.round(completitudScore),
          consistencia: Math.round(consistenciaScore),
        },
      },
      crecimiento: {
        score: Math.round(crecimiento),
        weight: 0.15,
        weightedScore: Math.round(crecimiento * 0.15),
        desglose: {
          tendenciaHato: tendenciaScore,
          tasaReposicion: Math.round(reposicionScore),
          reinversion: Math.round(reinversionScore),
        },
      },
    },
  }
}
