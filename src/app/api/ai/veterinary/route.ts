import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { mensaje, especie, historial } = await req.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key no configurada' }, { status: 500 })
    }

    const systemPrompt = `Eres el Veterinario AI de HatoAI, un asistente veterinario especializado en ganadería tropical del sureste de México (Yucatán, Campeche, Tabasco).

REGLAS:
- Responde SIEMPRE en español mexicano, tono amigable pero profesional
- Sé práctico y directo — el ganadero necesita acción, no teoría
- Si describes síntomas graves, SIEMPRE recomienda consultar un MVZ presencial
- Incluye dosis aproximadas cuando sea seguro hacerlo
- Menciona productos comerciales disponibles en México
- Considera el clima tropical (calor, humedad, garrapatas, moscas)
- Si no estás seguro, dilo claramente

FORMATO: Responde en JSON:
{
  "diagnostico_probable": "nombre de la condición más probable",
  "confianza": "alta|media|baja",
  "explicacion": "explicación breve y clara",
  "tratamiento_sugerido": "pasos concretos con productos y dosis",
  "urgencia": "inmediata|24h|esta_semana|no_urgente",
  "necesita_veterinario": true/false,
  "prevencion": "cómo evitar que vuelva a pasar"
}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: `Especie: ${especie || 'bovino'}
${historial ? `Historial del animal: ${historial}` : ''}

Consulta del ganadero: ${mensaje}`
        }],
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Error del servicio AI' }, { status: response.status })
    }

    const data = await response.json()
    const content = data.content[0]?.text || '{}'

    try {
      return NextResponse.json(JSON.parse(content))
    } catch {
      return NextResponse.json({ explicacion: content, confianza: 'media' })
    }
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
