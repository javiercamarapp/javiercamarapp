export const SYSTEM_PROMPT = `Eres un consultor ganadero experto con 20 años de experiencia en la Península de Yucatán, México.
Analizas datos de ranchos y generas insights accionables en español mexicano.
Siempre incluyes datos específicos, comparaciones con benchmarks regionales, y recomendaciones concretas con impacto económico estimado.
Responde SIEMPRE en formato JSON.`

export function productivityPrompt(data: {
  especie: string
  totalCabezas: number
  gdpPromedio: number
  benchmarkRegional: number
  top5: string[]
  bottom5: string[]
  porCorral: Record<string, number>
}) {
  return `Analiza estos datos de productividad de un rancho en Yucatán:
- Especie: ${data.especie}
- Total cabezas: ${data.totalCabezas}
- GDP promedio: ${data.gdpPromedio} kg/día
- Benchmark regional: ${data.benchmarkRegional} kg/día
- Top 5 animales por GDP: ${data.top5.join(", ")}
- Bottom 5 animales por GDP: ${data.bottom5.join(", ")}
- GDP por corral: ${JSON.stringify(data.porCorral)}

Genera 3-5 insights accionables. Cada insight debe tener:
- "tipo": "productividad"
- "prioridad": "alta"|"media"|"baja"
- "mensaje": texto descriptivo con datos específicos
- "accion": recomendación concreta
- "impacto_economico": estimación en MXN

Responde en JSON: { "insights": [...] }`
}

export function reproductivePrompt(data: {
  tasaPrenez: number
  serviciosConcepcion: number
  ipp: number
  tasaDestete: number
  rankingSementales: { nombre: string; tasaExito: number }[]
}) {
  return `Analiza estos datos reproductivos:
- Tasa de preñez: ${data.tasaPrenez}%
- Servicios por concepción: ${data.serviciosConcepcion}
- Intervalo parto-parto: ${data.ipp} días
- Tasa de destete: ${data.tasaDestete}%
- Ranking sementales: ${JSON.stringify(data.rankingSementales)}

Genera 3-5 insights. Cada insight: tipo "reproduccion", prioridad, mensaje, accion, impacto_economico.
Responde en JSON: { "insights": [...] }`
}

export function healthPrompt(data: {
  tratamientos30d: number
  mortalidad30d: number
  vacunasPendientes: number
  retirosActivos: number
}) {
  return `Analiza patrones sanitarios:
- Tratamientos últimos 30 días: ${data.tratamientos30d}
- Mortalidad últimos 30 días: ${data.mortalidad30d}
- Vacunas pendientes: ${data.vacunasPendientes}
- Retiros activos: ${data.retirosActivos}

Genera 3-5 insights. Cada insight: tipo "sanidad", prioridad, mensaje, accion, impacto_economico.
Detecta posibles focos infecciosos y sugiere prevención.
Responde en JSON: { "insights": [...] }`
}

export function economicPrompt(data: {
  ingresos30d: number
  egresos30d: number
  costoPorCabeza: number
  margenPorVenta: number
  flujoCaja: number
}) {
  return `Analiza P&L ganadero:
- Ingresos 30 días: $${data.ingresos30d} MXN
- Egresos 30 días: $${data.egresos30d} MXN
- Costo por cabeza: $${data.costoPorCabeza} MXN
- Margen por venta: $${data.margenPorVenta} MXN
- Flujo de caja: $${data.flujoCaja} MXN

Genera 3-5 insights. Cada insight: tipo "economico", prioridad, mensaje, accion, impacto_economico.
Identifica oportunidades de ahorro y crecimiento.
Responde en JSON: { "insights": [...] }`
}
