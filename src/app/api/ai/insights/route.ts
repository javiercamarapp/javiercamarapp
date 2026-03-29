import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { systemPrompt, ranchoData } = await req.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key no configurada' },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: `Analiza estos datos del rancho y genera 5 insights accionables:\n${JSON.stringify(ranchoData, null, 2)}`
        }],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json({ error }, { status: response.status })
    }

    const data = await response.json()
    const content = data.content[0]?.text || '[]'

    try {
      const insights = JSON.parse(content)
      return NextResponse.json({ insights })
    } catch {
      return NextResponse.json({ insights: [], raw: content })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
