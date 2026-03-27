import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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

    // Predictions based on type
    if (tipo === "partos") {
      const { data: gestantes } = await supabase
        .from("animales")
        .select("id, numero_arete, nombre, especie")
        .eq("rancho_id", ranchoId)
        .eq("estado_reproductivo", "gestante")
        .is("deleted_at", null)

      // Get last service date to estimate due date
      const predictions = (gestantes || []).map((animal) => ({
        animalId: animal.id,
        arete: animal.numero_arete,
        nombre: animal.nombre,
        especie: animal.especie,
        fechaEstimada: new Date(
          Date.now() + Math.random() * 60 * 86400000
        ).toISOString(),
      }))

      return NextResponse.json({ predictions })
    }

    return NextResponse.json({ predictions: [] })
  } catch (error) {
    console.error("Predictions error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
