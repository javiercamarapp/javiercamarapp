import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { lat, lng } = await req.json()

    // Agromonitoring API (OpenWeather) — free tier
    const apiKey = process.env.AGROMONITORING_API_KEY

    if (!apiKey) {
      // Return demo data if no API key
      return NextResponse.json({
        ndvi: 0.42,
        evi: 0.38,
        fecha: new Date().toISOString().split('T')[0],
        interpretacion: 'Vegetación moderada — pasturas en condición aceptable',
        recomendacion: 'Capacidad de carga actual: ~1.5 UA/ha. Considerar rotación si el NDVI baja de 0.35.',
        historico: [
          { mes: 'Oct', ndvi: 0.31 },
          { mes: 'Nov', ndvi: 0.28 },
          { mes: 'Dic', ndvi: 0.25 },
          { mes: 'Ene', ndvi: 0.33 },
          { mes: 'Feb', ndvi: 0.38 },
          { mes: 'Mar', ndvi: 0.42 },
        ],
        escala: { bajo: '< 0.2 (suelo desnudo)', moderado: '0.2-0.4 (pasto seco/escaso)', bueno: '0.4-0.6 (pasto verde)', excelente: '> 0.6 (vegetación densa)' },
      })
    }

    // Real API call to Agromonitoring
    const polygonRes = await fetch(`http://api.agromonitoring.com/agro/1.0/ndvi?lat=${lat}&lon=${lng}&appid=${apiKey}`)
    const ndviData = await polygonRes.json()

    return NextResponse.json(ndviData)
  } catch {
    return NextResponse.json({ error: 'Error obteniendo datos satelitales' }, { status: 500 })
  }
}
