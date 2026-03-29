import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { callClaude, parseJSONResponse } from '@/lib/ai/client'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { mensaje } = await req.json()
    const safeMensaje = (mensaje || '').substring(0, 500)

    const systemPrompt = `Eres el parser de lenguaje natural de HatoAI. Conviertes mensajes de ganaderos mexicanos en datos estructurados.

El ganadero escribe en español coloquial. Tu trabajo es:
1. Detectar qué tipo de evento registró (pesaje, parto, vacunación, producción leche, muerte, venta, compra, enfermedad)
2. Extraer: animal identificado, valores numéricos, fechas, productos, observaciones
3. Mapear a la tabla correcta de Supabase

TABLAS DISPONIBLES:
- pesajes: {animal_id, fecha, peso, metodo}
- eventos_reproductivos: {animal_id, fecha, tipo, num_crias, peso_destete}
- eventos_sanitarios: {animal_id, fecha, tipo, producto, dosis}
- produccion_leche: {animal_id, fecha, litros_am, litros_pm, litros_total}
- movimientos_economicos: {tipo: ingreso|egreso, categoria, monto, descripcion}
- animales: {estado: muerto, causa_baja, fecha_baja}

Responde SOLO en JSON:
{
  "eventos": [{
    "tipo": "pesaje|parto|vacunacion|leche|muerte|venta|compra|enfermedad",
    "animal": "nombre o ID del animal mencionado",
    "datos": {"campo": "valor"},
    "confianza": 0-100,
    "tabla_destino": "nombre de la tabla"
  }]
}`

    const content = await callClaude({
      systemPrompt,
      userMessage: safeMensaje,
      maxTokens: 1000,
    })

    const result = parseJSONResponse(content, { eventos: [] })
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Error interpretando mensaje' }, { status: 500 })
  }
}
