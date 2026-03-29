import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { callClaude, parseJSONResponse } from '@/lib/ai/client'
import { SYSTEM_PROMPT_ORCHESTRATOR, SPECIES_PROMPTS } from '@/lib/ai/prompts'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { ranchoData } = await req.json()

    const safeData = {
      rancho_id: ranchoData?.rancho_id,
      nombre: ranchoData?.nombre,
      especies_activas: ranchoData?.especies_activas,
      animales_total: ranchoData?.animales_total,
      datos_por_especie: ranchoData?.datos_por_especie,
    }

    const speciesContext = (safeData.especies_activas || [])
      .map((sp: string) => SPECIES_PROMPTS[sp] || '')
      .filter(Boolean)
      .join('\n\n')

    const content = await callClaude({
      systemPrompt: SYSTEM_PROMPT_ORCHESTRATOR + '\n\n' + speciesContext,
      userMessage: `Analiza estos datos del rancho y genera 5 insights accionables:\n${JSON.stringify(safeData, null, 2)}`,
    })

    const insights = parseJSONResponse(content, [])
    return NextResponse.json({ insights })
  } catch (error) {
    console.error('Error generating insights:', error)
    return NextResponse.json({ error: 'Error generando insights' }, { status: 500 })
  }
}
