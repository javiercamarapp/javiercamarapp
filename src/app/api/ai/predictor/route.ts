import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { callClaude, parseJSONResponse } from '@/lib/ai/client'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { rancho_id, tipo } = await req.json()

    const systemPrompt = `Eres el motor predictivo de HatoAI. Genera predicciones basadas en datos ganaderos del sureste de México.

TIPOS DE PREDICCIÓN:
- parto: Calcula fechas esperadas basado en fecha de servicio + días gestación por especie
- venta: Recomienda momento óptimo considerando peso, GDP, precio de mercado, costo de alimentación
- enfermedad: Evalúa riesgo basado en temporada, ubicación, historial sanitario del hato
- peso: Proyecta peso futuro usando GDP actual y curva de crecimiento por raza
- alimentacion: Optimiza ración para minimizar costo por kg de ganancia

Responde en JSON:
{
  "predicciones": [{
    "tipo": "parto|venta|enfermedad|peso|alimentacion",
    "animal_id": "uuid o null",
    "titulo": "texto corto",
    "prediccion": "descripción detallada",
    "fecha_estimada": "YYYY-MM-DD o null",
    "confianza_pct": 0-100,
    "valor_economico_mxn": number o null,
    "accion_recomendada": "qué hacer"
  }]
}`

    const content = await callClaude({
      systemPrompt,
      userMessage: `Rancho ID: ${rancho_id}\nTipo de predicción: ${tipo || 'todos'}\nGenera 5 predicciones accionables.`,
      maxTokens: 2000,
    })

    const result = parseJSONResponse(content, { predicciones: [] })
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Error generando predicciones' }, { status: 500 })
  }
}
