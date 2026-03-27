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

    // Get ranch data
    const { data: rancho } = await supabase
      .from("ranchos")
      .select("*")
      .eq("id", ranchoId)
      .single()

    if (!rancho) {
      return NextResponse.json({ error: "Rancho no encontrado" }, { status: 404 })
    }

    // For now, return a placeholder response
    // Full PDF generation with @react-pdf/renderer would be done client-side
    return NextResponse.json({
      message: "Reporte generado",
      tipo,
      rancho: rancho.nombre,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("PDF report error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
