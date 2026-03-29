import { NextResponse } from 'next/server'
import { callClaude, parseJSONResponse } from '@/lib/ai/client'

export async function POST(req: Request) {
  try {
    const { systemPrompt, ranchoData } = await req.json()

    // Whitelist fields before sending to LLM
    const safeData = {
      rancho_id: ranchoData.rancho_id,
      nombre: ranchoData.nombre,
      especies_activas: ranchoData.especies_activas,
      animales_total: ranchoData.animales_total,
      datos_por_especie: ranchoData.datos_por_especie,
    }

    const content = await callClaude({
      systemPrompt,
      userMessage: `Analiza estos datos del rancho y genera 5 insights accionables:\n${JSON.stringify(safeData, null, 2)}`,
    })

    const insights = parseJSONResponse(content, [])
    return NextResponse.json({ insights })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno del servidor'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
