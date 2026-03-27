// ---------------------------------------------------------------------------
// AI Insight generation module for HatoAI
// Takes structured ranch data and returns actionable insights
// ---------------------------------------------------------------------------

import type { SpeciesId } from "@/types/species"

// ---------------------------------------------------------------------------
// Input interfaces
// ---------------------------------------------------------------------------

export interface ReproductionStats {
  tasaPrenez: number
  serviciosPorConcepcion: number
  intervaloParto: number
  tasaDestete: number
  diasAbiertos: number
  gestantesActuales: number
}

export interface HealthEventSummary {
  tratamientos30d: number
  mortalidad30d: number
  vacunasPendientes: number
  vacunasAlDia: number
  retirosActivos: number
  enfermedadesFrecuentes: Array<{ nombre: string; casos: number }>
}

export interface EconomicSummary {
  ingresos30d: number
  egresos30d: number
  costoPorCabeza: number
  margenPorVenta: number
  flujoCaja: number
}

export interface WeightStats {
  pesoPromedio: number
  gdpPromedio: number
  gdpBenchmark: number
  pesoDestete205: number
  pesoAnual365: number
}

export interface RanchInsightData {
  ranchoId: string
  ranchoNombre: string
  especie: SpeciesId
  totalCabezas: number
  weights: WeightStats
  reproduction: ReproductionStats
  health: HealthEventSummary
  economics: EconomicSummary
}

// ---------------------------------------------------------------------------
// Output interfaces
// ---------------------------------------------------------------------------

export type InsightType = "productividad" | "reproductivo" | "sanitario" | "economico" | "general"
export type InsightPriority = "alta" | "media" | "baja"

export interface Insight {
  tipo: InsightType
  prioridad: InsightPriority
  mensaje: string
  accionSugerida: string
  impactoEconomico: string
}

export interface InsightResult {
  ranchoId: string
  generatedAt: string
  insights: Insight[]
}

// ---------------------------------------------------------------------------
// Benchmark constants per species
// ---------------------------------------------------------------------------

const GDP_BENCHMARKS: Partial<Record<SpeciesId, number>> = {
  bovino: 0.8,
  porcino: 0.7,
  ovino: 0.15,
  caprino: 0.12,
  equido: 0.5,
  conejo: 0.035,
}

const MORTALITY_BENCHMARKS: Partial<Record<SpeciesId, number>> = {
  bovino: 3,
  porcino: 5,
  ovino: 5,
  caprino: 5,
  equido: 2,
  conejo: 8,
  ave: 5,
}

const PREGNANCY_RATE_BENCHMARKS: Partial<Record<SpeciesId, number>> = {
  bovino: 65,
  porcino: 85,
  ovino: 80,
  caprino: 80,
  equido: 60,
  conejo: 90,
}

// ---------------------------------------------------------------------------
// Main function
// ---------------------------------------------------------------------------

export function generateInsights(data: RanchInsightData): InsightResult {
  const insights: Insight[] = []

  // --- Productivity insights ---
  const gdpBenchmark = GDP_BENCHMARKS[data.especie] ?? data.weights.gdpBenchmark
  if (gdpBenchmark > 0 && data.weights.gdpPromedio > 0) {
    const gdpRatio = data.weights.gdpPromedio / gdpBenchmark
    if (gdpRatio < 0.8) {
      insights.push({
        tipo: "productividad",
        prioridad: "alta",
        mensaje: `La GDP promedio (${data.weights.gdpPromedio.toFixed(3)} kg/día) está ${((1 - gdpRatio) * 100).toFixed(0)}% por debajo del benchmark regional (${gdpBenchmark} kg/día). Esto representa una pérdida significativa de productividad en ${data.totalCabezas} cabezas.`,
        accionSugerida: "Revisar formulación de dieta, evaluar calidad de forraje disponible, y considerar suplementación estratégica con minerales y energéticos. Realizar análisis bromatológico del alimento actual.",
        impactoEconomico: `Mejorar GDP al benchmark podría generar $${Math.round((gdpBenchmark - data.weights.gdpPromedio) * data.totalCabezas * 60 * 30).toLocaleString()} MXN adicionales en 30 días (estimando $60 MXN/kg en pie).`,
      })
    } else if (gdpRatio >= 1.1) {
      insights.push({
        tipo: "productividad",
        prioridad: "baja",
        mensaje: `GDP promedio (${data.weights.gdpPromedio.toFixed(3)} kg/día) supera el benchmark regional por ${((gdpRatio - 1) * 100).toFixed(0)}%. Excelente desempeño productivo.`,
        accionSugerida: "Documentar el protocolo de alimentación actual como referencia. Considerar expandir el programa a más lotes. Evaluar si los animales top pueden ser candidatos a selección genética.",
        impactoEconomico: "Mantener este nivel genera una ventaja competitiva estimada en 15-20% sobre la media regional.",
      })
    }
  }

  // Low average weight at 205 days
  if (data.weights.pesoDestete205 > 0 && data.weights.pesoDestete205 < 160) {
    insights.push({
      tipo: "productividad",
      prioridad: "media",
      mensaje: `Peso al destete ajustado a 205 días (${data.weights.pesoDestete205} kg) está por debajo del estándar de 180-200 kg. Indica posible deficiencia en alimentación de la madre o manejo del creep feeding.`,
      accionSugerida: "Implementar programa de creep feeding 60 días antes del destete. Evaluar condición corporal de las madres y ajustar suplementación pre-parto.",
      impactoEconomico: `Cada kg adicional al destete equivale a ~$60 MXN/cabeza. Meta: ganar 20 kg extra = $${(20 * 60 * data.totalCabezas * 0.3).toLocaleString()} MXN (estimando 30% en etapa de cría).`,
    })
  }

  // --- Reproductive insights ---
  const pregnancyBenchmark = PREGNANCY_RATE_BENCHMARKS[data.especie] ?? 65
  if (data.reproduction.tasaPrenez > 0 && data.reproduction.tasaPrenez < pregnancyBenchmark * 0.8) {
    insights.push({
      tipo: "reproductivo",
      prioridad: "alta",
      mensaje: `Tasa de preñez (${data.reproduction.tasaPrenez}%) muy por debajo del benchmark (${pregnancyBenchmark}%). ${data.reproduction.serviciosPorConcepcion > 2 ? `Servicios por concepción altos (${data.reproduction.serviciosPorConcepcion}) indican posible problema de fertilidad.` : ""}`,
      accionSugerida: "Evaluar condición corporal de hembras al servicio (ideal CC 3-3.5/5). Realizar examen reproductivo de sementales. Considerar programa de sincronización de celos e IATF para mejorar eficiencia.",
      impactoEconomico: `Cada punto porcentual de mejora en preñez equivale a ~${Math.round(data.totalCabezas * 0.01 * 15000)} MXN/año en becerros adicionales (valor al destete ~$15,000 MXN).`,
    })
  }

  if (data.reproduction.intervaloParto > 420 && data.especie === "bovino") {
    insights.push({
      tipo: "reproductivo",
      prioridad: "media",
      mensaje: `Intervalo entre partos de ${data.reproduction.intervaloParto} días excede el ideal de 365-400 días. Días abiertos promedio: ${data.reproduction.diasAbiertos} días.`,
      accionSugerida: "Implementar periodo de espera voluntario de 45 días. Iniciar detección de celos intensiva a partir del día 45 post-parto. Evaluar programa de IATF para vacas con más de 90 días abiertos.",
      impactoEconomico: `Reducir IPP a 400 días generaría ${Math.round(data.totalCabezas * 0.3 * 0.1)} becerros adicionales/año, equivalente a ~$${Math.round(data.totalCabezas * 0.3 * 0.1 * 15000).toLocaleString()} MXN.`,
    })
  }

  // --- Health insights ---
  const mortalityBenchmark = MORTALITY_BENCHMARKS[data.especie] ?? 5
  const mortalityPct = data.totalCabezas > 0
    ? (data.health.mortalidad30d / data.totalCabezas) * 100 * 12
    : 0

  if (mortalityPct > mortalityBenchmark) {
    insights.push({
      tipo: "sanitario",
      prioridad: "alta",
      mensaje: `Mortalidad proyectada anual (${mortalityPct.toFixed(1)}%) supera el benchmark de ${mortalityBenchmark}%. Se registraron ${data.health.mortalidad30d} muertes en los últimos 30 días.`,
      accionSugerida: "Realizar necropsia de los próximos casos. Revisar programa de vacunación, condiciones de manejo, y bioseguridad. Consultar al MVZ para diagnóstico diferencial.",
      impactoEconomico: `Cada muerte representa una pérdida promedio de $12,000-$20,000 MXN. Reducir mortalidad al benchmark ahorraría ~$${Math.round(Math.max(0, data.health.mortalidad30d - (data.totalCabezas * mortalityBenchmark / 100 / 12)) * 15000).toLocaleString()} MXN/mes.`,
    })
  }

  if (data.health.vacunasPendientes > data.totalCabezas * 0.2) {
    insights.push({
      tipo: "sanitario",
      prioridad: "alta",
      mensaje: `${data.health.vacunasPendientes} vacunas pendientes detectadas. Solo ${data.health.vacunasAlDia} animales tienen esquema al día. Riesgo de brotes infecciosos elevado.`,
      accionSugerida: "Organizar jornada de vacunación prioritaria. Verificar cadena de frío del biológico. Actualizar calendario SENASICA según campañas vigentes en la región.",
      impactoEconomico: "Un brote por falta de vacunación puede generar pérdidas de $50,000-$200,000 MXN dependiendo de la enfermedad y escala del hato.",
    })
  }

  if (data.health.retirosActivos > 0) {
    insights.push({
      tipo: "sanitario",
      prioridad: "media",
      mensaje: `${data.health.retirosActivos} animales en periodo de retiro por medicamento. No pueden ser comercializados hasta que termine el periodo.`,
      accionSugerida: "Verificar fechas de vencimiento de retiro. Marcar físicamente los animales en retiro. No incluir en lotes de venta hasta cumplir el periodo establecido.",
      impactoEconomico: "Comercializar animales en retiro puede resultar en decomiso y multas de SENASICA. Asegurar trazabilidad.",
    })
  }

  // --- Economic insights ---
  const margen30d = data.economics.ingresos30d - data.economics.egresos30d
  if (margen30d < 0) {
    insights.push({
      tipo: "economico",
      prioridad: "alta",
      mensaje: `Margen negativo de $${Math.abs(margen30d).toLocaleString()} MXN en los últimos 30 días. Egresos ($${data.economics.egresos30d.toLocaleString()}) superan ingresos ($${data.economics.ingresos30d.toLocaleString()}).`,
      accionSugerida: "Analizar estructura de costos para identificar gastos reducibles. Evaluar si el periodo de inversión (compra de insumos, mejoras) justifica el déficit temporal. Considerar ventas estratégicas de animales de desecho.",
      impactoEconomico: `Si la tendencia se mantiene, el déficit anual proyectado sería de $${Math.abs(margen30d * 12).toLocaleString()} MXN. Requiere acción inmediata.`,
    })
  }

  if (data.economics.costoPorCabeza > 0 && data.economics.margenPorVenta > 0) {
    const rentabilidad = (data.economics.margenPorVenta / data.economics.costoPorCabeza) * 100
    if (rentabilidad < 15) {
      insights.push({
        tipo: "economico",
        prioridad: "media",
        mensaje: `Rentabilidad por cabeza vendida del ${rentabilidad.toFixed(1)}%. El margen ($${data.economics.margenPorVenta.toLocaleString()} MXN) sobre costo ($${data.economics.costoPorCabeza.toLocaleString()} MXN) es ajustado.`,
        accionSugerida: "Negociar compras de alimento por volumen para reducir costo 10-15%. Evaluar venta directa vs intermediarios. Considerar agregar valor con engorda a peso óptimo de mercado.",
        impactoEconomico: `Mejorar rentabilidad al 25% representaría $${Math.round(data.economics.costoPorCabeza * 0.10).toLocaleString()} MXN adicionales por cabeza vendida.`,
      })
    }
  }

  // --- General insight if everything looks good ---
  if (insights.length === 0) {
    insights.push({
      tipo: "general",
      prioridad: "baja",
      mensaje: `El rancho "${data.ranchoNombre}" muestra indicadores dentro de los rangos aceptables en productividad, reproducción, sanidad y economía. ${data.totalCabezas} cabezas activas.`,
      accionSugerida: "Continuar con los protocolos actuales. Mantener registros actualizados para monitoreo continuo. Considerar metas de mejora incremental en GDP y tasa reproductiva.",
      impactoEconomico: "Mantener la operación estable protege la inversión actual. Buscar mejoras marginales del 5-10% en indicadores clave.",
    })
  }

  return {
    ranchoId: data.ranchoId,
    generatedAt: new Date().toISOString(),
    insights,
  }
}
