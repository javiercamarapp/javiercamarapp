import { SYSTEM_PROMPT_ORCHESTRATOR, SPECIES_PROMPTS } from './prompts'

interface RanchoSummary {
  rancho_id: string
  nombre: string
  especies_activas: string[]
  animales_total: number
  datos_por_especie: Record<string, {
    total: number
    gestantes: number
    mortalidad_pct: number
    gdp_promedio: number
    tasa_prenez: number
    alertas_pendientes: number
  }>
}

export async function generateInsights(summary: RanchoSummary) {
  const speciesContext = summary.especies_activas
    .map(sp => SPECIES_PROMPTS[sp] || '')
    .join('\n\n')

  const response = await fetch('/api/ai/insights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemPrompt: SYSTEM_PROMPT_ORCHESTRATOR + '\n\n' + speciesContext,
      ranchoData: summary,
    }),
  })

  if (!response.ok) throw new Error('Error generando insights')
  return response.json()
}
