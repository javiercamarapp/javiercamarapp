import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { callClaude, parseJSONResponse } from '@/lib/ai/client'
import { SYSTEM_PROMPT_ORCHESTRATOR } from '@/lib/ai/prompts'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { rancho_id } = await req.json()
    if (!rancho_id) return NextResponse.json({ error: 'rancho_id requerido' }, { status: 400 })

    // Gather all ranch data for the last 7 days
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const [animales, pesajes, repro, sanidad, alertas, economico] = await Promise.all([
      supabase.from('animales').select('id, nombre, numero_arete, especie, estado, estado_reproductivo, peso_actual').eq('rancho_id', rancho_id).eq('estado', 'activo'),
      supabase.from('pesajes').select('*').eq('rancho_id', rancho_id).gte('fecha', weekAgo),
      supabase.from('eventos_reproductivos').select('*').eq('rancho_id', rancho_id).gte('fecha', weekAgo),
      supabase.from('eventos_sanitarios').select('*').eq('rancho_id', rancho_id).gte('fecha', weekAgo),
      supabase.from('alertas').select('*').eq('rancho_id', rancho_id).eq('leida', false),
      supabase.from('movimientos_economicos').select('*').eq('rancho_id', rancho_id).gte('fecha', weekAgo),
    ])

    const ranchSummary = {
      total_animales: animales.data?.length || 0,
      pesajes_semana: pesajes.data?.length || 0,
      eventos_repro: repro.data?.length || 0,
      eventos_sanidad: sanidad.data?.length || 0,
      alertas_pendientes: alertas.data?.length || 0,
      ingresos_semana: economico.data?.filter(e => e.tipo === 'ingreso').reduce((s: number, e: any) => s + (e.monto || 0), 0) || 0,
      egresos_semana: economico.data?.filter(e => e.tipo === 'egreso').reduce((s: number, e: any) => s + (e.monto || 0), 0) || 0,
      gestantes: animales.data?.filter(a => a.estado_reproductivo === 'gestante').length || 0,
    }

    const content = await callClaude({
      systemPrompt: SYSTEM_PROMPT_ORCHESTRATOR + `\n\nGenera un RESUMEN SEMANAL para el ganadero. Formato:
{
  "saludo": "Buenos dias, [nombre]. Aqui esta tu resumen semanal.",
  "resumen": "Parrafo de 3-4 oraciones con lo mas importante de la semana.",
  "acciones_urgentes": ["accion 1", "accion 2"],
  "logros": ["logro 1"],
  "prediccion_semana": "Lo que viene la proxima semana",
  "score_semana": 1-10
}`,
      userMessage: `Datos del rancho esta semana:\n${JSON.stringify(ranchSummary, null, 2)}`,
      maxTokens: 1000,
    })

    const digest = parseJSONResponse(content, { resumen: 'No se pudo generar el resumen.' })
    return NextResponse.json(digest)
  } catch {
    return NextResponse.json({ error: 'Error generando resumen' }, { status: 500 })
  }
}
