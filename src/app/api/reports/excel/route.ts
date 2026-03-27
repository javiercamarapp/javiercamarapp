import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import * as XLSX from "xlsx"

type ReportType = "inventario" | "reproductivo" | "sanitario" | "economico" | "completo"

// Spanish column headers per report type
const HEADERS: Record<string, string[]> = {
  inventario: [
    "No. Arete",
    "Nombre",
    "Especie",
    "Raza",
    "Sexo",
    "Categoría",
    "Estado",
    "Peso Actual (kg)",
    "GDP (kg/día)",
    "Fecha Nacimiento",
    "Edad (meses)",
    "Corral/Lote",
  ],
  reproductivo: [
    "Animal (Arete)",
    "Nombre",
    "Tipo Evento",
    "Fecha",
    "Semental",
    "Método",
    "Resultado",
    "Estado Reproductivo",
    "Observaciones",
  ],
  sanitario: [
    "Animal (Arete)",
    "Nombre",
    "Tipo",
    "Producto/Vacuna",
    "Dosis",
    "Vía Administración",
    "Fecha Aplicación",
    "Próxima Aplicación",
    "Periodo Retiro (días)",
    "Fin Retiro",
    "MVZ Responsable",
    "Observaciones",
  ],
  economico: [
    "Fecha",
    "Tipo",
    "Categoría",
    "Concepto",
    "Monto (MXN)",
    "Método de Pago",
    "Referencia",
    "Observaciones",
  ],
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

    const validTypes: ReportType[] = [
      "inventario",
      "reproductivo",
      "sanitario",
      "economico",
      "completo",
    ]
    if (!validTypes.includes(tipo as ReportType)) {
      return NextResponse.json(
        { error: `Tipo inválido. Use: ${validTypes.join(", ")}` },
        { status: 400 }
      )
    }

    const { data: rancho } = await supabase
      .from("ranchos")
      .select("nombre")
      .eq("id", ranchoId)
      .single()

    if (!rancho) {
      return NextResponse.json(
        { error: "Rancho no encontrado" },
        { status: 404 }
      )
    }

    const inicio =
      fechaInicio ||
      new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0]
    const fin = fechaFin || new Date().toISOString().split("T")[0]

    const wb = XLSX.utils.book_new()

    // --- Inventario worksheet ---
    if (tipo === "inventario" || tipo === "completo") {
      const { data } = await supabase
        .from("animales")
        .select(
          "numero_arete, nombre, especie, raza, sexo, categoria, estado, peso_actual, gdp_actual, fecha_nacimiento, corral"
        )
        .eq("rancho_id", ranchoId)
        .is("deleted_at", null)
        .order("especie")
        .order("numero_arete")

      const rows = (data || []).map((a) => {
        const birthDate = a.fecha_nacimiento
          ? new Date(a.fecha_nacimiento)
          : null
        const edadMeses = birthDate
          ? Math.floor(
              (Date.now() - birthDate.getTime()) / (30 * 86400000)
            )
          : ""

        return [
          a.numero_arete || "",
          a.nombre || "",
          a.especie || "",
          a.raza || "",
          a.sexo || "",
          a.categoria || "",
          a.estado || "",
          a.peso_actual || "",
          a.gdp_actual || "",
          a.fecha_nacimiento || "",
          edadMeses,
          a.corral || "",
        ]
      })

      const wsData = [HEADERS.inventario, ...rows]
      const ws = XLSX.utils.aoa_to_sheet(wsData)

      // Set column widths
      ws["!cols"] = HEADERS.inventario.map((h) => ({
        wch: Math.max(h.length, 12),
      }))

      XLSX.utils.book_append_sheet(wb, ws, "Inventario")
    }

    // --- Reproductivo worksheet ---
    if (tipo === "reproductivo" || tipo === "completo") {
      const { data } = await supabase
        .from("eventos_reproductivos")
        .select(
          "animal:animales(numero_arete, nombre, estado_reproductivo), tipo, fecha, semental_id, metodo, resultado, observaciones"
        )
        .eq("rancho_id", ranchoId)
        .gte("fecha", inicio)
        .lte("fecha", fin)
        .order("fecha", { ascending: false })

      const rows = (data || []).map((e) => {
        const animal = e.animal as { numero_arete?: string; nombre?: string; estado_reproductivo?: string } | null
        return [
          animal?.numero_arete || "",
          animal?.nombre || "",
          e.tipo || "",
          e.fecha || "",
          e.semental_id || "",
          e.metodo || "",
          e.resultado || "",
          animal?.estado_reproductivo || "",
          e.observaciones || "",
        ]
      })

      const wsData = [HEADERS.reproductivo, ...rows]
      const ws = XLSX.utils.aoa_to_sheet(wsData)
      ws["!cols"] = HEADERS.reproductivo.map((h) => ({
        wch: Math.max(h.length, 12),
      }))
      XLSX.utils.book_append_sheet(wb, ws, "Reproductivo")
    }

    // --- Sanitario worksheet ---
    if (tipo === "sanitario" || tipo === "completo") {
      const { data } = await supabase
        .from("eventos_sanitarios")
        .select(
          "animal:animales(numero_arete, nombre), tipo, producto, dosis, via, fecha, proxima_aplicacion, retiro_dias, retiro_fin, mvz, observaciones"
        )
        .eq("rancho_id", ranchoId)
        .gte("fecha", inicio)
        .lte("fecha", fin)
        .order("fecha", { ascending: false })

      const rows = (data || []).map((e) => {
        const animal = e.animal as { numero_arete?: string; nombre?: string } | null
        return [
          animal?.numero_arete || "",
          animal?.nombre || "",
          e.tipo || "",
          e.producto || "",
          e.dosis || "",
          e.via || "",
          e.fecha || "",
          e.proxima_aplicacion || "",
          e.retiro_dias || "",
          e.retiro_fin || "",
          e.mvz || "",
          e.observaciones || "",
        ]
      })

      const wsData = [HEADERS.sanitario, ...rows]
      const ws = XLSX.utils.aoa_to_sheet(wsData)
      ws["!cols"] = HEADERS.sanitario.map((h) => ({
        wch: Math.max(h.length, 12),
      }))
      XLSX.utils.book_append_sheet(wb, ws, "Sanitario")
    }

    // --- Económico worksheet ---
    if (tipo === "economico" || tipo === "completo") {
      const { data } = await supabase
        .from("movimientos_economicos")
        .select(
          "fecha, tipo, categoria, descripcion, monto, metodo_pago, referencia, observaciones"
        )
        .eq("rancho_id", ranchoId)
        .gte("fecha", inicio)
        .lte("fecha", fin)
        .order("fecha", { ascending: false })

      const rows = (data || []).map((m) => [
        m.fecha || "",
        m.tipo || "",
        m.categoria || "",
        m.descripcion || "",
        m.monto || 0,
        m.metodo_pago || "",
        m.referencia || "",
        m.observaciones || "",
      ])

      // Add totals row
      const ingresos = (data || [])
        .filter((m) => m.tipo === "ingreso")
        .reduce((s, m) => s + (m.monto || 0), 0)
      const egresos = (data || [])
        .filter((m) => m.tipo === "egreso")
        .reduce((s, m) => s + (m.monto || 0), 0)

      rows.push([])
      rows.push(["", "RESUMEN", "", "", "", "", "", ""])
      rows.push(["", "Total Ingresos", "", "", ingresos, "", "", ""])
      rows.push(["", "Total Egresos", "", "", egresos, "", "", ""])
      rows.push(["", "Margen", "", "", ingresos - egresos, "", "", ""])

      const wsData = [HEADERS.economico, ...rows]
      const ws = XLSX.utils.aoa_to_sheet(wsData)
      ws["!cols"] = HEADERS.economico.map((h) => ({
        wch: Math.max(h.length, 14),
      }))
      XLSX.utils.book_append_sheet(wb, ws, "Económico")
    }

    // Generate buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })
    const filename = `${rancho.nombre.replace(/\s+/g, "_")}_${tipo}_${fin}.xlsx`

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Excel report error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
