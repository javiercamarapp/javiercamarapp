// ---------------------------------------------------------------------------
// AI prompt templates for HatoAI modules
// Context: Mexican ranching (ganaderia) in Spanish
// ---------------------------------------------------------------------------

export const SYSTEM_PROMPT = `Eres HatoAI, un consultor ganadero experto con 20 años de experiencia en México, especializado en ganadería tropical y subtropical.
Analizas datos de ranchos y generas insights accionables en español mexicano.
Siempre incluyes datos específicos, comparaciones con benchmarks regionales (INIFAP, CONASA, SIAP), y recomendaciones concretas con impacto económico estimado en MXN.
Consideras estacionalidad (temporada de lluvias mayo-octubre, secas noviembre-abril), condiciones del trópico mexicano, y normativas SENASICA vigentes.
Responde SIEMPRE en formato JSON válido sin markdown.`

// ---------------------------------------------------------------------------
// Productivity prompt
// ---------------------------------------------------------------------------
export interface ProductivityPromptData {
  especie: string
  totalCabezas: number
  gdpPromedio: number
  benchmarkRegional: number
  top5: string[]
  bottom5: string[]
  porCorral: Record<string, number>
  pesoPromedio?: number
  conversionAlimenticia?: number
  diasEnEngorda?: number
}

export function productivityPrompt(data: ProductivityPromptData): string {
  return `Analiza estos datos de productividad de un rancho ganadero en México:
- Especie: ${data.especie}
- Total cabezas: ${data.totalCabezas}
- GDP promedio actual: ${data.gdpPromedio} kg/día
- Benchmark regional INIFAP: ${data.benchmarkRegional} kg/día
- Desviación vs benchmark: ${((data.gdpPromedio - data.benchmarkRegional) / data.benchmarkRegional * 100).toFixed(1)}%
- Top 5 animales por GDP: ${data.top5.join(", ")}
- Bottom 5 animales por GDP: ${data.bottom5.join(", ")}
- GDP por corral/lote: ${JSON.stringify(data.porCorral)}
${data.pesoPromedio ? `- Peso promedio del hato: ${data.pesoPromedio} kg` : ""}
${data.conversionAlimenticia ? `- Conversión alimenticia: ${data.conversionAlimenticia} kg/kg` : ""}
${data.diasEnEngorda ? `- Días promedio en engorda: ${data.diasEnEngorda}` : ""}

Genera 3-5 insights accionables. Cada insight debe tener:
- "tipo": "productividad"
- "prioridad": "alta"|"media"|"baja"
- "mensaje": texto descriptivo con datos específicos y comparación con benchmarks
- "accion_sugerida": recomendación concreta y paso a paso
- "impacto_economico": estimación del impacto en MXN con cálculo base

Responde en JSON: { "insights": [...] }`
}

// ---------------------------------------------------------------------------
// Reproductive prompt
// ---------------------------------------------------------------------------
export interface ReproductivePromptData {
  especie: string
  tasaPrenez: number
  serviciosConcepcion: number
  intervaloParto: number
  tasaDestete: number
  diasAbiertos: number
  rankingSementales: Array<{ nombre: string; tasaExito: number }>
  gestantesActuales: number
  proximosPartos30d: number
}

export function reproductivePrompt(data: ReproductivePromptData): string {
  return `Analiza estos datos reproductivos de un rancho de ${data.especie} en México:
- Tasa de preñez: ${data.tasaPrenez}% (benchmark: ${data.especie === "bovino" ? "60-70%" : "75-85%"})
- Servicios por concepción: ${data.serviciosConcepcion} (ideal: ${data.especie === "bovino" ? "1.5-2.0" : "1.0-1.5"})
- Intervalo parto-parto: ${data.intervaloParto} días (ideal: ${data.especie === "bovino" ? "365-400" : "210-240"} días)
- Días abiertos promedio: ${data.diasAbiertos} días
- Tasa de destete: ${data.tasaDestete}%
- Gestantes actuales: ${data.gestantesActuales}
- Partos estimados próximos 30 días: ${data.proximosPartos30d}
- Ranking sementales: ${JSON.stringify(data.rankingSementales)}

Genera 3-5 insights. Cada insight debe incluir: tipo "reproductivo", prioridad, mensaje con datos concretos, accion_sugerida con pasos específicos, impacto_economico en MXN.
Considera: estacionalidad reproductiva, estrés calórico en trópico, y programas de sincronización.
Responde en JSON: { "insights": [...] }`
}

// ---------------------------------------------------------------------------
// Health/Sanitary prompt
// ---------------------------------------------------------------------------
export interface HealthPromptData {
  especie: string
  totalCabezas: number
  tratamientos30d: number
  mortalidad30d: number
  mortalidadPct: number
  vacunasPendientes: number
  vacunasAlDia: number
  retirosActivos: number
  enfermedadesFrecuentes: Array<{ nombre: string; casos: number }>
  desparasitacionesPendientes: number
  temporada: "lluvias" | "secas"
}

export function healthPrompt(data: HealthPromptData): string {
  return `Analiza patrones sanitarios de un rancho de ${data.especie} en México (${data.totalCabezas} cabezas):
- Tratamientos últimos 30 días: ${data.tratamientos30d}
- Mortalidad últimos 30 días: ${data.mortalidad30d} cabezas (${data.mortalidadPct.toFixed(2)}%)
- Mortalidad benchmark CONASA: ${data.especie === "bovino" ? "3-5%" : "5-8%"} anual
- Vacunas al día: ${data.vacunasAlDia} | Pendientes: ${data.vacunasPendientes}
- Retiros por medicamento activos: ${data.retirosActivos}
- Enfermedades más frecuentes: ${JSON.stringify(data.enfermedadesFrecuentes)}
- Desparasitaciones pendientes: ${data.desparasitacionesPendientes}
- Temporada actual: ${data.temporada}

Genera 3-5 insights. Cada insight: tipo "sanitario", prioridad, mensaje, accion_sugerida, impacto_economico.
Detecta posibles focos infecciosos, evalúa riesgos estacionales (garrapatas en lluvias, respiratorias en secas), y sugiere medidas preventivas según calendario SENASICA.
Responde en JSON: { "insights": [...] }`
}

// ---------------------------------------------------------------------------
// Economic prompt
// ---------------------------------------------------------------------------
export interface EconomicPromptData {
  especie: string
  totalCabezas: number
  ingresos30d: number
  egresos30d: number
  costoPorCabeza: number
  margenPorVenta: number
  flujoCaja: number
  desgloseCostos: Record<string, number>
  precioMercadoKg: number
  tendenciaPrecios: "subiendo" | "estable" | "bajando"
}

export function economicPrompt(data: EconomicPromptData): string {
  return `Analiza el P&L ganadero de un rancho de ${data.especie} (${data.totalCabezas} cabezas) en México:
- Ingresos 30 días: $${data.ingresos30d.toLocaleString()} MXN
- Egresos 30 días: $${data.egresos30d.toLocaleString()} MXN
- Margen 30 días: $${(data.ingresos30d - data.egresos30d).toLocaleString()} MXN
- Costo por cabeza/mes: $${data.costoPorCabeza.toLocaleString()} MXN
- Margen promedio por venta: $${data.margenPorVenta.toLocaleString()} MXN
- Flujo de caja disponible: $${data.flujoCaja.toLocaleString()} MXN
- Desglose de costos: ${JSON.stringify(data.desgloseCostos)}
- Precio de mercado: $${data.precioMercadoKg}/kg en pie
- Tendencia de precios: ${data.tendenciaPrecios}

Genera 3-5 insights. Cada insight: tipo "economico", prioridad, mensaje con datos en MXN, accion_sugerida concreta, impacto_economico.
Identifica oportunidades de ahorro, optimización de compras por volumen, alternativas de comercialización, y riesgos financieros.
Responde en JSON: { "insights": [...] }`
}
