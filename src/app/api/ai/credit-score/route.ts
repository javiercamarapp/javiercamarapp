import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { calculateCreditScore, type CreditScoreInput } from "@/lib/ai/credit-score"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const ranchoId = request.nextUrl.searchParams.get("ranchoId")
    if (!ranchoId) {
      return NextResponse.json(
        { error: "ranchoId es requerido" },
        { status: 400 }
      )
    }

    // Gather ranch data for credit score calculation
    const [animalesRes, pesajesRes, sanitariosRes, economicosRes] =
      await Promise.all([
        supabase
          .from("animales")
          .select("id, gdp_actual, estado_reproductivo, padre_id, madre_id")
          .eq("rancho_id", ranchoId)
          .is("deleted_at", null),
        supabase
          .from("pesajes")
          .select("id")
          .eq("rancho_id", ranchoId)
          .gte("fecha", new Date(Date.now() - 30 * 86400000).toISOString()),
        supabase
          .from("eventos_sanitarios")
          .select("id, tipo")
          .eq("rancho_id", ranchoId)
          .gte("fecha", new Date(Date.now() - 365 * 86400000).toISOString()),
        supabase
          .from("movimientos_economicos")
          .select("tipo, monto")
          .eq("rancho_id", ranchoId)
          .gte("fecha", new Date(Date.now() - 365 * 86400000).toISOString()),
      ])

    const animales = animalesRes.data || []
    const gdps = animales
      .filter((a) => a.gdp_actual)
      .map((a) => a.gdp_actual as number)
    const gdpPromedio = gdps.length > 0 ? gdps.reduce((a, b) => a + b, 0) / gdps.length : 0

    const ingresos = (economicosRes.data || [])
      .filter((m) => m.tipo === "ingreso")
      .reduce((sum, m) => sum + (m.monto || 0), 0)
    const egresos = (economicosRes.data || [])
      .filter((m) => m.tipo === "egreso")
      .reduce((sum, m) => sum + (m.monto || 0), 0)

    const withGenealogy = animales.filter((a) => a.padre_id && a.madre_id).length

    const input: CreditScoreInput = {
      gdpPromedio,
      gdpBenchmark: 0.8,
      gdpTendencia: "estable",
      pesoAjustado205: 180,
      pesoEstandar205: 200,
      pctVacunasAlDia: 75,
      tasaMortalidad: 3,
      mortalidadBenchmark: 5,
      campanasCompletadas: (sanitariosRes.data || []).filter((e) => e.tipo === "vacunacion").length > 0 ? 1 : 0,
      campanasTotal: 2,
      usaIA: false,
      usaTE: false,
      pctGenealogiaCompleta: animales.length > 0 ? (withGenealogy / animales.length) * 100 : 0,
      sementalesCalidad: 2,
      margenBruto: ingresos - egresos,
      numFuentesIngreso: 2,
      ventasRegulares: ingresos > 0,
      frecuenciaUsoSemanal: 3,
      pctCamposLlenos: 60,
      mesesConsistentes: 4,
      mesesTotales: 6,
      tendenciaHato: "creciendo",
      tasaReposicion: 0.8,
      reinversionPct: 5,
    }

    const score = calculateCreditScore(input)

    return NextResponse.json({ score, input })
  } catch (error) {
    console.error("Credit score error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
