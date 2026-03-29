import { NextResponse } from 'next/server'
import { callClaude, parseJSONResponse } from '@/lib/ai/client'

export async function POST(req: Request) {
  try {
    const { systemPrompt, ranchoData } = await req.json()

    const content = await callClaude({
      systemPrompt,
      userMessage: `Analiza estos datos del rancho y genera 5 insights accionables:\n${JSON.stringify(ranchoData, null, 2)}`,
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
