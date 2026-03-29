import { NextResponse } from 'next/server'
import { callClaude, parseJSONResponse } from '@/lib/ai/client'

const VETERINARY_SYSTEM_PROMPT = `Eres el Veterinario AI de HatoAI, un asistente veterinario especializado en ganadería tropical del sureste de México (Yucatán, Campeche, Tabasco).

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

export async function POST(req: Request) {
  try {
    const { mensaje, especie, historial } = await req.json()

    const userMessage = `Especie: ${especie || 'bovino'}
${historial ? `Historial del animal: ${historial}` : ''}

Consulta del ganadero: ${mensaje}`

    const content = await callClaude({
      systemPrompt: VETERINARY_SYSTEM_PROMPT,
      userMessage,
      maxTokens: 1500,
    })

    const fallback = { explicacion: content, confianza: 'media' }
    return NextResponse.json(parseJSONResponse(content, fallback))
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
