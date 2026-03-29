import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { rancho_id, animal_ids, destino_upp, motivo } = await req.json()

    // Get ranch info
    const { data: rancho } = await supabase
      .from('ranchos')
      .select('nombre, siniiga_upp, estado, municipio')
      .eq('id', rancho_id)
      .single()

    // Get animals with their health status
    const { data: animales } = await supabase
      .from('animales')
      .select('id, numero_arete, id_siniiga, especie, raza, sexo, estatus_brucela, estatus_tuberculosis')
      .in('id', animal_ids || [])

    // Get latest health events for compliance
    const animalIds = animales?.map(a => a.id) || []
    const { data: healthEvents } = await supabase
      .from('eventos_sanitarios')
      .select('animal_id, tipo, campana, resultado_prueba, fecha')
      .in('animal_id', animalIds)
      .order('fecha', { ascending: false })

    const guia = {
      fecha_emision: new Date().toISOString().split('T')[0],
      tipo_documento: 'Guia de Transito / Pre-REEMO',
      origen: {
        rancho: rancho?.nombre,
        upp: rancho?.siniiga_upp || 'Pendiente',
        estado: rancho?.estado,
        municipio: rancho?.municipio,
      },
      destino: {
        upp: destino_upp || 'Por definir',
        motivo: motivo || 'Venta',
      },
      animales: animales?.map(a => {
        const animalHealth = healthEvents?.filter(h => h.animal_id === a.id) || []
        const tbTest = animalHealth.find(h => h.campana?.includes('tuberculosis'))
        const brTest = animalHealth.find(h => h.campana?.includes('brucelosis'))

        return {
          arete_siniiga: a.id_siniiga || a.numero_arete,
          especie: a.especie,
          raza: a.raza,
          sexo: a.sexo,
          tuberculosis: {
            resultado: tbTest?.resultado_prueba || a.estatus_tuberculosis || 'Sin prueba',
            fecha: tbTest?.fecha || null,
          },
          brucelosis: {
            resultado: brTest?.resultado_prueba || a.estatus_brucela || 'Sin prueba',
            fecha: brTest?.fecha || null,
          },
          apto_movilizacion: (tbTest?.resultado_prueba === 'negativo' || a.estatus_tuberculosis === 'negativo') &&
            (brTest?.resultado_prueba === 'negativo' || a.estatus_brucela === 'negativo'),
        }
      }),
      total_animales: animales?.length || 0,
      animales_aptos: 0,
      animales_no_aptos: 0,
      nota: 'Este documento es un PRE-formato. La guia oficial REEMO debe tramitarse en la ventanilla SINIIGA de su Union Ganadera Regional.',
    }

    guia.animales_aptos = guia.animales?.filter(a => a.apto_movilizacion).length || 0
    guia.animales_no_aptos = (guia.total_animales || 0) - guia.animales_aptos

    return NextResponse.json(guia)
  } catch {
    return NextResponse.json({ error: 'Error generando guia' }, { status: 500 })
  }
}
