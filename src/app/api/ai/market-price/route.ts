import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  // Simulated market prices for Yucatan/Campeche region
  const precios = {
    fecha: new Date().toISOString().split('T')[0],
    region: 'Península de Yucatán',
    bovinos: {
      becerro_destete: { min: 55, max: 65, unidad: 'MXN/kg', tendencia: 'estable' },
      novillo_engorda: { min: 60, max: 70, unidad: 'MXN/kg', tendencia: 'alza' },
      vaca_desecho: { min: 40, max: 48, unidad: 'MXN/kg', tendencia: 'baja' },
      toro_semental: { min: 25000, max: 80000, unidad: 'MXN/cabeza', tendencia: 'estable' },
      leche_litro: { min: 8, max: 12, unidad: 'MXN/litro', tendencia: 'estable' },
    },
    porcinos: {
      cerdo_pie: { min: 38, max: 45, unidad: 'MXN/kg', tendencia: 'alza' },
      lechon: { min: 800, max: 1200, unidad: 'MXN/cabeza', tendencia: 'estable' },
    },
    ovinos: {
      cordero: { min: 70, max: 90, unidad: 'MXN/kg', tendencia: 'alza' },
      borrega_desecho: { min: 50, max: 60, unidad: 'MXN/kg', tendencia: 'estable' },
    },
    miel: {
      convencional: { min: 50, max: 70, unidad: 'MXN/kg', tendencia: 'estable' },
      organica: { min: 90, max: 130, unidad: 'MXN/kg', tendencia: 'alza' },
      melipona: { min: 800, max: 3000, unidad: 'MXN/litro', tendencia: 'alza' },
    },
    huevo: {
      caja_360: { min: 550, max: 650, unidad: 'MXN/caja', tendencia: 'estable' },
    },
  }

  return NextResponse.json(precios)
}
