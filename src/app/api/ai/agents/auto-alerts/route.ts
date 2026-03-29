import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { callClaude, parseJSONResponse } from '@/lib/ai/client'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { rancho_id } = await req.json()

    // Get animals with potential issues
    const { data: animales } = await supabase
      .from('animales')
      .select('id, nombre, numero_arete, especie, estado_reproductivo, peso_actual, fecha_ultimo_pesaje, estado_sanitario')
      .eq('rancho_id', rancho_id)
      .eq('estado', 'activo')

    // Get upcoming events
    const { data: reproEvents } = await supabase
      .from('eventos_reproductivos')
      .select('animal_id, tipo, fecha, fecha_parto_esperada')
      .eq('rancho_id', rancho_id)
      .not('fecha_parto_esperada', 'is', null)

    const content = await callClaude({
      systemPrompt: `Eres el motor de alertas automaticas de HatoAI. Analiza datos del rancho y genera alertas.

Tipos de alerta a detectar:
- parto_proximo: animal gestante con parto en los proximos 7 dias
- vacuna_pendiente: ultimo evento sanitario hace >6 meses
- pesaje_atrasado: ultimo pesaje hace >30 dias
- celo_estimado: hembra vacia que deberia entrar en celo
- mortalidad_alta: patrones de mortalidad en el hato
- descarte_sugerido: animal improductivo
- revision_colmena: colmena sin revision >30 dias

Responde en JSON:
{ "alertas": [{ "tipo": "string", "animal_id": "uuid|null", "mensaje": "texto", "prioridad": "alta|media|baja", "accion_sugerida": "texto" }] }`,
      userMessage: `Animales activos: ${JSON.stringify(animales?.slice(0, 50))}\nEventos reproductivos: ${JSON.stringify(reproEvents?.slice(0, 20))}`,
      maxTokens: 1500,
    })

    const result = parseJSONResponse(content, { alertas: [] })

    // Save alerts to database
    if (result.alertas?.length > 0) {
      const alertasToInsert = result.alertas.map((a: any) => ({
        rancho_id,
        animal_id: a.animal_id || null,
        tipo: a.tipo,
        mensaje: a.mensaje,
        prioridad: a.prioridad || 'media',
        generada_por: 'ai',
        accion_sugerida: a.accion_sugerida,
        fecha_alerta: new Date().toISOString().split('T')[0],
      }))

      await supabase.from('alertas').insert(alertasToInsert)
    }

    return NextResponse.json({ alertas_generadas: result.alertas?.length || 0, alertas: result.alertas })
  } catch {
    return NextResponse.json({ error: 'Error generando alertas' }, { status: 500 })
  }
}
