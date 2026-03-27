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

    if (!ranchoId || !tipo) {
      return NextResponse.json(
        { error: "ranchoId y tipo son requeridos" },
        { status: 400 }
      )
    }

    // Get ranch data based on report type
    const { data: rancho } = await supabase
      .from("ranchos")
      .select("nombre")
      .eq("id", ranchoId)
      .single()

    if (!rancho) {
      return NextResponse.json({ error: "Rancho no encontrado" }, { status: 404 })
    }

    // For now return JSON data that client can convert to Excel using SheetJS
    let reportData: Record<string, unknown>[] = []

    if (tipo === "inventario") {
      const { data } = await supabase
        .from("animales")
        .select("numero_arete, nombre, especie, raza, sexo, estado, peso_actual, fecha_nacimiento")
        .eq("rancho_id", ranchoId)
        .is("deleted_at", null)
      reportData = data || []
    } else if (tipo === "economico") {
      const { data } = await supabase
        .from("movimientos_economicos")
        .select("fecha, tipo, categoria, monto, descripcion")
        .eq("rancho_id", ranchoId)
        .order("fecha", { ascending: false })
      reportData = data || []
    }

    return NextResponse.json({
      data: reportData,
      rancho: rancho.nombre,
      tipo,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Excel report error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
