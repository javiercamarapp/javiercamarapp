// Gompertz growth model: W(t) = A * exp(-B * exp(-k * t))
// A = mature weight, B = integration constant, k = growth rate

interface GrowthParams {
  A: number  // mature weight (kg)
  B: number  // integration constant
  k: number  // growth rate
}

// Default parameters by species and breed (based on published research)
const GROWTH_PARAMS: Record<string, Record<string, GrowthParams>> = {
  bovino: {
    brahman_macho: { A: 650, B: 3.2, k: 0.0035 },
    brahman_hembra: { A: 480, B: 3.1, k: 0.0038 },
    suizo_macho: { A: 700, B: 3.3, k: 0.0032 },
    suizo_hembra: { A: 520, B: 3.2, k: 0.0035 },
    nelore_macho: { A: 580, B: 3.1, k: 0.0037 },
    nelore_hembra: { A: 440, B: 3.0, k: 0.0040 },
    default_macho: { A: 600, B: 3.2, k: 0.0035 },
    default_hembra: { A: 460, B: 3.1, k: 0.0038 },
  },
  porcino: {
    default_macho: { A: 130, B: 4.5, k: 0.012 },
    default_hembra: { A: 110, B: 4.3, k: 0.013 },
  },
  ovino: {
    pelibuey_macho: { A: 75, B: 3.8, k: 0.008 },
    pelibuey_hembra: { A: 55, B: 3.6, k: 0.009 },
    dorper_macho: { A: 85, B: 3.9, k: 0.0075 },
    default_macho: { A: 70, B: 3.7, k: 0.008 },
    default_hembra: { A: 50, B: 3.5, k: 0.009 },
  },
  caprino: {
    boer_macho: { A: 90, B: 3.5, k: 0.007 },
    default_macho: { A: 65, B: 3.4, k: 0.008 },
    default_hembra: { A: 45, B: 3.3, k: 0.009 },
  },
}

export function getGrowthParams(especie: string, raza: string, sexo: string): GrowthParams {
  const speciesParams = GROWTH_PARAMS[especie] || GROWTH_PARAMS.bovino
  const key = `${raza.toLowerCase().replace(/\s+/g, '_')}_${sexo}`
  return speciesParams[key] || speciesParams[`default_${sexo}`] || speciesParams.default_macho
}

export function predictWeight(params: GrowthParams, ageDays: number): number {
  return params.A * Math.exp(-params.B * Math.exp(-params.k * ageDays))
}

export function predictDaysToWeight(params: GrowthParams, targetWeight: number): number {
  if (targetWeight >= params.A) return Infinity
  return Math.round(-Math.log(-Math.log(targetWeight / params.A) / params.B) / params.k)
}

export function generateGrowthCurve(params: GrowthParams, maxDays: number = 730, interval: number = 30): Array<{ dia: number; peso: number }> {
  const points: Array<{ dia: number; peso: number }> = []
  for (let d = 0; d <= maxDays; d += interval) {
    points.push({ dia: d, peso: Math.round(predictWeight(params, d)) })
  }
  return points
}

export function calculateGDP(currentWeight: number, previousWeight: number, daysBetween: number): number {
  if (daysBetween <= 0) return 0
  return Number(((currentWeight - previousWeight) / daysBetween).toFixed(2))
}

// Benchmark data for Yucatan/Campeche region
export const REGIONAL_BENCHMARKS: Record<string, { gdp_promedio: number; tasa_prenez: number; mortalidad: number; produccion_leche: number }> = {
  bovino: { gdp_promedio: 0.7, tasa_prenez: 55, mortalidad: 5, produccion_leche: 5.2 },
  porcino: { gdp_promedio: 0.65, tasa_prenez: 85, mortalidad: 10, produccion_leche: 0 },
  ovino: { gdp_promedio: 0.15, tasa_prenez: 80, mortalidad: 8, produccion_leche: 0 },
  caprino: { gdp_promedio: 0.12, tasa_prenez: 75, mortalidad: 7, produccion_leche: 2.5 },
}
