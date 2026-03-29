import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { rancho_id } = await req.json()

    const reporte = {
      rancho: 'Rancho Santa Cruz',
      upp: 'YUC-31-0001234',
      fecha: new Date().toISOString(),
      resumen: {
        total_animales: 28,
        con_siniiga: 24,
        sin_siniiga: 4,
        pct_cobertura: 85.7,
        animales_sin_arete: [
          { id: 'bc-019', especie: 'bovino', nombre: 'Becerro recién nacido', fecha_nacimiento: '2026-03-15', motivo: 'Pendiente de registro (< 30 días)' },
          { id: 'bc-020', especie: 'bovino', nombre: null, fecha_nacimiento: '2026-03-20', motivo: 'Pendiente de registro (< 30 días)' },
          { id: 'ov-005', especie: 'ovino', nombre: null, fecha_nacimiento: '2026-02-28', motivo: 'Sin arete SINIIGA asignado' },
          { id: 'pc-006', especie: 'porcino', nombre: null, fecha_nacimiento: '2026-03-01', motivo: 'Sin arete SINIIGA asignado' },
        ],
      },
      campanas_senasica: {
        tuberculosis: { status: 'al_dia', ultima_prueba: '2025-11-15', proxima: '2026-11-15', animales_probados: 12, total: 12 },
        brucelosis: { status: 'al_dia', ultima_prueba: '2025-10-20', proxima: '2026-10-20', animales_probados: 12, total: 12 },
        rabia: { status: 'pendiente', ultima_vacuna: '2025-06-10', proxima: '2026-06-10', animales_vacunados: 10, total: 12 },
      },
      reemo_listo: true,
      documentos_vigentes: ['Constancia UPP', 'Guía de tránsito activa', 'Certificado brucelosis'],
      documentos_faltantes: ['Renovación credencial ganadera (vence mayo 2026)'],
    }

    return NextResponse.json(reporte)
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
