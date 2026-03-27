import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

type ReportType = "inventario" | "reproductivo" | "sanitario" | "economico" | "completo"

interface ReportSection {
  titulo: string
  descripcion: string
  campos: string[]
  totalRegistros: number
}

interface ReportMetadata {
  tipo: ReportType
  rancho: string
  ranchoId: string
  generatedAt: string
  periodo: { inicio: string; fin: string }
  secciones: ReportSection[]
  resumen: Record<string, number | string>
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

    const { ranchoId, tipo, fechaInicio, fechaFin } = await request.json()

    if (!ranchoId || !tipo) {
      return NextResponse.json(
        { error: "ranchoId y tipo son requeridos" },
        { status: 400 }
      )
    }

    const validTypes: ReportType[] = ["inventario", "reproductivo", "sanitario", "economico", "completo"]
    if (!validTypes.includes(tipo as ReportType)) {
      return NextResponse.json(
        { error: `Tipo inválido. Use: ${validTypes.join(", ")}` },
        { status: 400 }
      )
    }

    // Get ranch info
    const { data: rancho } = await supabase
      .from("ranchos")
      .select("nombre, especies_activas")
      .eq("id", ranchoId)
      .single()

    if (!rancho) {
      return NextResponse.json({ error: "Rancho no encontrado" }, { status: 404 })
    }

    const inicio = fechaInicio || new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0]
    const fin = fechaFin || new Date().toISOString().split("T")[0]

    const secciones: ReportSection[] = []
    const resumen: Record<string, number | string> = {}

    // Build report sections based on type
    if (tipo === "inventario" || tipo === "completo") {
      const { count: totalAnimales } = await supabase
        .from("animales")
        .select("id", { count: "exact", head: true })
        .eq("rancho_id", ranchoId)
        .eq("estado", "activo")
        .is("deleted_at", null)

      const { data: bySpecies } = await supabase
        .from("animales")
        .select("especie")
        .eq("rancho_id", ranchoId)
        .eq("estado", "activo")
        .is("deleted_at", null)

      const speciesCounts = (bySpecies || []).reduce<Record<string, number>>((acc, a) => {
        acc[a.especie] = (acc[a.especie] || 0) + 1
        return acc
      }, {})

      secciones.push({
        titulo: "Inventario General",
        descripcion: "Resumen del hato activo por especie, categoría y estado",
        campos: ["Número de Arete", "Nombre", "Especie", "Raza", "Sexo", "Categoría", "Estado", "Peso Actual", "Fecha Nacimiento", "Corral/Lote"],
        totalRegistros: totalAnimales || 0,
      })

      resumen["totalAnimalesActivos"] = totalAnimales || 0
      Object.entries(speciesCounts).forEach(([sp, count]) => {
        resumen[`total_${sp}`] = count
      })
    }

    if (tipo === "reproductivo" || tipo === "completo") {
      const { count: eventosRepro } = await supabase
        .from("eventos_reproductivos")
        .select("id", { count: "exact", head: true })
        .eq("rancho_id", ranchoId)
        .gte("fecha", inicio)
        .lte("fecha", fin)

      const { count: gestantes } = await supabase
        .from("animales")
        .select("id", { count: "exact", head: true })
        .eq("rancho_id", ranchoId)
        .eq("estado_reproductivo", "gestante")
        .is("deleted_at", null)

      secciones.push({
        titulo: "Reporte Reproductivo",
        descripcion: "Eventos reproductivos, gestaciones activas, y métricas de eficiencia",
        campos: ["Animal", "Tipo Evento", "Fecha", "Semental", "Método", "Resultado", "Observaciones"],
        totalRegistros: eventosRepro || 0,
      })

      resumen["eventosReproductivos"] = eventosRepro || 0
      resumen["gestantesActuales"] = gestantes || 0
    }

    if (tipo === "sanitario" || tipo === "completo") {
      const { count: eventosSanit } = await supabase
        .from("eventos_sanitarios")
        .select("id", { count: "exact", head: true })
        .eq("rancho_id", ranchoId)
        .gte("fecha", inicio)
        .lte("fecha", fin)

      secciones.push({
        titulo: "Reporte Sanitario",
        descripcion: "Vacunaciones, tratamientos, desparasitaciones y eventos de salud",
        campos: ["Animal", "Tipo", "Producto", "Dosis", "Vía", "Fecha Aplicación", "Próxima Aplicación", "Retiro (días)", "MVZ Responsable"],
        totalRegistros: eventosSanit || 0,
      })

      resumen["eventosSanitarios"] = eventosSanit || 0
    }

    if (tipo === "economico" || tipo === "completo") {
      const { data: movimientos } = await supabase
        .from("movimientos_economicos")
        .select("tipo, monto")
        .eq("rancho_id", ranchoId)
        .gte("fecha", inicio)
        .lte("fecha", fin)

      const ingresos = (movimientos || [])
        .filter((m) => m.tipo === "ingreso")
        .reduce((sum, m) => sum + (m.monto || 0), 0)
      const egresos = (movimientos || [])
        .filter((m) => m.tipo === "egreso")
        .reduce((sum, m) => sum + (m.monto || 0), 0)

      secciones.push({
        titulo: "Reporte Económico",
        descripcion: "Estado de resultados: ingresos, egresos, y análisis de rentabilidad",
        campos: ["Fecha", "Tipo", "Categoría", "Concepto", "Monto (MXN)", "Método de Pago", "Referencia"],
        totalRegistros: (movimientos || []).length,
      })

      resumen["ingresosPeriodo"] = ingresos
      resumen["egresosPeriodo"] = egresos
      resumen["margenPeriodo"] = ingresos - egresos
      resumen["totalMovimientos"] = (movimientos || []).length
    }

    const metadata: ReportMetadata = {
      tipo: tipo as ReportType,
      rancho: rancho.nombre,
      ranchoId,
      generatedAt: new Date().toISOString(),
      periodo: { inicio, fin },
      secciones,
      resumen,
    }

    // Note: Actual PDF rendering is done client-side with @react-pdf/renderer
    // This endpoint provides the structured data and metadata for the report
    return NextResponse.json({
      message: "Metadatos de reporte generados exitosamente",
      metadata,
      nota: "Use estos metadatos con @react-pdf/renderer en el cliente para generar el PDF",
    })
  } catch (error) {
    console.error("PDF report error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
