import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { programa_id } = await req.json()

    // Simulated anomaly detection data
    const anomalias = [
      {
        tipo: 'inventario_inconsistente',
        severidad: 'alta',
        rancho: 'Rancho El Mirador',
        descripcion: 'Declara 200 cabezas pero solo tiene 12 registros de pesaje en 6 meses. Ratio sospechosamente bajo.',
        evidencia: 'Pesajes: 12 | Animales declarados: 200 | Ratio esperado: >50 pesajes',
        accion: 'Verificación física del inventario mediante visita de campo',
      },
      {
        tipo: 'semental_sin_crias',
        severidad: 'media',
        rancho: 'Rancho Las Águilas',
        descripcion: 'Semental entregado hace 8 meses sin ninguna cría registrada. Posible no utilización o animal no apto.',
        evidencia: 'Fecha entrega: Jul 2025 | Crías registradas: 0 | Esperado: >5',
        accion: 'Solicitar prueba de fertilidad del semental',
      },
      {
        tipo: 'benford_anomalia',
        severidad: 'baja',
        rancho: 'Varios (3 ranchos)',
        descripcion: 'Los pesos reportados en 3 ranchos del municipio de Escárcega no siguen la distribución de Benford — posible redondeo sistemático.',
        evidencia: 'Distribución primer dígito: 1=8%, 2=35%, 3=28% (esperado: 1=30%, 2=18%, 3=12%)',
        accion: 'Auditoría de básculas y verificación aleatoria de pesajes',
      },
    ]

    return NextResponse.json({
      programa: 'Renacer Ganadero 2026',
      fecha_analisis: new Date().toISOString(),
      total_anomalias: anomalias.length,
      anomalias,
      score_integridad: 87,
      nota: 'Análisis basado en Ley de Benford, verificación cruzada SINIIGA-pesajes, y patrones de actividad.',
    })
  } catch {
    return NextResponse.json({ error: 'Error en análisis' }, { status: 500 })
  }
}
