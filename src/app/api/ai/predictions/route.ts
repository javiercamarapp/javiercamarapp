import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { SPECIES_CONFIG } from "@/lib/species/config"
import type { SpeciesId } from "@/types/species"

interface BirthPrediction {
  animalId: string
  arete: string
  nombre: string | null
  especie: string
  fechaServicio: string
  fechaEstimadaParto: string
  diasRestantes: number
}

interface SalesForecast {
  mes: string
  ingresosEstimados: number
  cabezasEstimadas: number
  precioPromedioKg: number
}

interface ProductionEstimate {
  especie: string
  metrica: string
  valorActual: number
  valorEstimado30d: number
  unidad: string
  tendencia: "subiendo" | "estable" | "bajando"
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { ranchoId, tipo } = await request.json()

    if (!ranchoId) {
      return NextResponse.json(
        { error: "ranchoId es requerido" },
        { status: 400 }
      )
    }

    // --- Upcoming births prediction ---
    if (tipo === "partos") {
      const { data: gestantes } = await supabase
        .from("animales")
        .select("id, numero_arete, nombre, especie")
        .eq("rancho_id", ranchoId)
        .eq("estado_reproductivo", "gestante")
        .eq("estado", "activo")
        .is("deleted_at", null)

      const predictions: BirthPrediction[] = []

      if (gestantes) {
        for (const animal of gestantes) {
          // Get last service event
          const { data: lastService } = await supabase
            .from("eventos_reproductivos")
            .select("fecha")
            .eq("animal_id", animal.id)
            .eq("tipo", "servicio")
            .order("fecha", { ascending: false })
            .limit(1)
            .single()

          if (lastService) {
            const speciesId = animal.especie as SpeciesId
            const config = SPECIES_CONFIG[speciesId]
            const gestationDays = config?.gestationDays || 283

            const serviceDate = new Date(lastService.fecha)
            const dueDate = new Date(
              serviceDate.getTime() + gestationDays * 86400000
            )
            const diasRestantes = Math.floor(
              (dueDate.getTime() - Date.now()) / 86400000
            )

            if (diasRestantes >= -7) {
              predictions.push({
                animalId: animal.id,
                arete: animal.numero_arete,
                nombre: animal.nombre,
                especie: animal.especie,
                fechaServicio: lastService.fecha,
                fechaEstimadaParto: dueDate.toISOString().split("T")[0],
                diasRestantes: Math.max(0, diasRestantes),
              })
            }
          }
        }
      }

      // Sort by nearest due date
      predictions.sort((a, b) => a.diasRestantes - b.diasRestantes)

      return NextResponse.json({ predictions, tipo: "partos" })
    }

    // --- Sales forecast ---
    if (tipo === "ventas") {
      const threeMonthsAgo = new Date(
        Date.now() - 90 * 86400000
      ).toISOString()

      const { data: ventasRecientes } = await supabase
        .from("movimientos_economicos")
        .select("monto, fecha, categoria")
        .eq("rancho_id", ranchoId)
        .eq("tipo", "ingreso")
        .gte("fecha", threeMonthsAgo)
        .order("fecha", { ascending: true })

      const ventas = ventasRecientes || []

      // Group by month and calculate averages
      const byMonth = new Map<string, number[]>()
      for (const v of ventas) {
        const month = v.fecha?.substring(0, 7) || "unknown"
        const list = byMonth.get(month) || []
        list.push(v.monto || 0)
        byMonth.set(month, list)
      }

      const monthlyAverages = Array.from(byMonth.entries()).map(
        ([mes, montos]) => ({
          mes,
          total: montos.reduce((a, b) => a + b, 0),
          count: montos.length,
        })
      )

      const avgMonthlyIncome =
        monthlyAverages.length > 0
          ? monthlyAverages.reduce((sum, m) => sum + m.total, 0) /
            monthlyAverages.length
          : 0

      const avgMonthlySales =
        monthlyAverages.length > 0
          ? Math.round(
              monthlyAverages.reduce((sum, m) => sum + m.count, 0) /
                monthlyAverages.length
            )
          : 0

      // Project next 3 months
      const forecasts: SalesForecast[] = []
      for (let i = 1; i <= 3; i++) {
        const futureDate = new Date(Date.now() + i * 30 * 86400000)
        const mes = futureDate.toISOString().substring(0, 7)
        forecasts.push({
          mes,
          ingresosEstimados: Math.round(avgMonthlyIncome),
          cabezasEstimadas: avgMonthlySales,
          precioPromedioKg: 60,
        })
      }

      return NextResponse.json({
        forecasts,
        promedioMensual: Math.round(avgMonthlyIncome),
        tipo: "ventas",
      })
    }

    // --- Production estimates ---
    if (tipo === "produccion") {
      const { data: animales } = await supabase
        .from("animales")
        .select("especie, gdp_actual, peso_actual")
        .eq("rancho_id", ranchoId)
        .eq("estado", "activo")
        .is("deleted_at", null)

      const animals = animales || []
      const estimates: ProductionEstimate[] = []

      // Group by species
      const bySpecies = new Map<string, typeof animals>()
      for (const a of animals) {
        const list = bySpecies.get(a.especie) || []
        list.push(a)
        bySpecies.set(a.especie, list)
      }

      for (const [especie, speciesAnimals] of bySpecies) {
        const gdps = speciesAnimals
          .filter((a) => a.gdp_actual)
          .map((a) => a.gdp_actual as number)
        const avgGdp =
          gdps.length > 0
            ? gdps.reduce((a, b) => a + b, 0) / gdps.length
            : 0

        const pesos = speciesAnimals
          .filter((a) => a.peso_actual)
          .map((a) => a.peso_actual as number)
        const avgPeso =
          pesos.length > 0
            ? pesos.reduce((a, b) => a + b, 0) / pesos.length
            : 0

        if (avgGdp > 0) {
          estimates.push({
            especie,
            metrica: "Peso promedio estimado",
            valorActual: Math.round(avgPeso * 10) / 10,
            valorEstimado30d:
              Math.round((avgPeso + avgGdp * 30) * 10) / 10,
            unidad: "kg",
            tendencia: avgGdp >= 0.8 ? "subiendo" : avgGdp >= 0.5 ? "estable" : "bajando",
          })
        }

        estimates.push({
          especie,
          metrica: "GDP promedio",
          valorActual: Math.round(avgGdp * 1000) / 1000,
          valorEstimado30d: Math.round(avgGdp * 1000) / 1000,
          unidad: "kg/día",
          tendencia: avgGdp >= 0.8 ? "subiendo" : avgGdp >= 0.5 ? "estable" : "bajando",
        })
      }

      return NextResponse.json({ estimates, tipo: "produccion" })
    }

    return NextResponse.json(
      { error: "Tipo de predicción no soportado. Use: partos, ventas, produccion" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Predictions error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
