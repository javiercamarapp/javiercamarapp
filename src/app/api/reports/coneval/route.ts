import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { programa_id } = await req.json()

    // Generate CONEVAL MIR (Matriz de Indicadores para Resultados) data
    const mir = {
      programa: 'Renacer Ganadero 2026',
      dependencia: 'SEDER Yucatán',
      fecha_generacion: new Date().toISOString(),
      indicadores: {
        fin: {
          nivel: 'Fin',
          resumen: 'Contribuir al incremento de la producción pecuaria en el estado',
          indicador: 'Variación % en producción pecuaria vs línea base',
          formula: '((Producción actual - Producción base) / Producción base) × 100',
          valor_actual: 12.5,
          meta: 15,
          unidad: 'porcentaje',
          fuente: 'HatoAI — Módulo de Producción agregado',
        },
        proposito: {
          nivel: 'Propósito',
          resumen: 'Productores pecuarios mejoran su inventario ganadero',
          indicador: '% de beneficiarios que incrementaron su inventario',
          formula: '(Beneficiarios con incremento / Total beneficiarios) × 100',
          valor_actual: 68,
          meta: 75,
          unidad: 'porcentaje',
          fuente: 'HatoAI — Inventario por beneficiario (antes vs después)',
        },
        componentes: [
          {
            nivel: 'Componente 1',
            resumen: 'Sementales de calidad genética entregados',
            indicador: '# sementales entregados con registro genealógico',
            valor_actual: 120,
            meta: 334,
            unidad: 'sementales',
            fuente: 'HatoAI — Registro de entregas con SINIIGA',
          },
          {
            nivel: 'Componente 2',
            resumen: 'Inseminaciones artificiales realizadas',
            indicador: '# inseminaciones con preñez confirmada',
            valor_actual: 34500,
            meta: 100000,
            unidad: 'inseminaciones',
            fuente: 'HatoAI — Módulo de Reproducción',
          },
          {
            nivel: 'Componente 3',
            resumen: 'Asistencia técnica veterinaria otorgada',
            indicador: '# visitas de seguimiento realizadas',
            valor_actual: 450,
            meta: 600,
            unidad: 'visitas',
            fuente: 'HatoAI — Registro de visitas + Veterinario AI',
          },
        ],
        actividades: [
          {
            nivel: 'Actividad 1',
            resumen: 'Solicitudes dictaminadas en tiempo',
            indicador: '% dictaminación oportuna',
            valor_actual: 89,
            meta: 95,
            unidad: 'porcentaje',
            fuente: 'HatoAI — Fechas de registro vs dictamen',
          },
          {
            nivel: 'Actividad 2',
            resumen: 'Seguimiento sanitario al día',
            indicador: '% de animales con vacunas vigentes',
            valor_actual: 78,
            meta: 90,
            unidad: 'porcentaje',
            fuente: 'HatoAI — Módulo Sanidad',
          },
        ],
      },
    }

    return NextResponse.json(mir)
  } catch {
    return NextResponse.json({ error: 'Error generando reporte' }, { status: 500 })
  }
}
