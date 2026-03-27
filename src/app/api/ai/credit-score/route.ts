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
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString()
    const oneYearAgo = new Date(Date.now() - 365 * 86400000).toISOString()
    const sixMonthsAgo = new Date(Date.now() - 180 * 86400000).toISOString()

    const [animalesRes, pesajesRes, sanitariosRes, economicosRes, actividadRes, inventarioAnteriorRes] =
      await Promise.all([
        supabase
          .from("animales")
          .select("id, gdp_actual, estado_reproductivo, padre_id, madre_id, peso_actual, created_at")
          .eq("rancho_id", ranchoId)
          .is("deleted_at", null),
        supabase
          .from("pesajes")
          .select("id, fecha")
          .eq("rancho_id", ranchoId)
          .gte("fecha", thirtyDaysAgo),
        supabase
          .from("eventos_sanitarios")
          .select("id, tipo, fecha")
          .eq("rancho_id", ranchoId)
          .gte("fecha", oneYearAgo),
        supabase
          .from("movimientos_economicos")
          .select("tipo, monto, categoria, fecha")
          .eq("rancho_id", ranchoId)
          .gte("fecha", oneYearAgo),
        supabase
          .from("actividad_usuario")
          .select("fecha")
          .eq("rancho_id", ranchoId)
          .gte("fecha", thirtyDaysAgo),
        supabase
          .from("animales")
          .select("id", { count: "exact", head: true })
          .eq("rancho_id", ranchoId)
          .lt("created_at", sixMonthsAgo)
          .is("deleted_at", null),
      ])

    const animales = animalesRes.data || []
    const pesajes = pesajesRes.data || []
    const sanitarios = sanitariosRes.data || []
    const economicos = economicosRes.data || []
    const actividad = actividadRes.data || []

    // Productivity metrics
    const gdps = animales
      .filter((a) => a.gdp_actual)
      .map((a) => a.gdp_actual as number)
    const gdpPromedio =
      gdps.length > 0 ? gdps.reduce((a, b) => a + b, 0) / gdps.length : 0

    // Determine GDP trend from recent pesajes
    let gdpTendencia: "mejorando" | "estable" | "empeorando" = "estable"
    if (pesajes.length > 10) {
      gdpTendencia = "mejorando"
    } else if (pesajes.length === 0) {
      gdpTendencia = "empeorando"
    }

    // Economics
    const ingresos = economicos
      .filter((m) => m.tipo === "ingreso")
      .reduce((sum, m) => sum + (m.monto || 0), 0)
    const egresos = economicos
      .filter((m) => m.tipo === "egreso")
      .reduce((sum, m) => sum + (m.monto || 0), 0)

    // Income diversification
    const categorias = new Set(
      economicos.filter((m) => m.tipo === "ingreso").map((m) => m.categoria)
    )

    // Sales regularity
    const salesMonths = new Set(
      economicos
        .filter((m) => m.tipo === "ingreso")
        .map((m) => m.fecha?.substring(0, 7))
    )

    // Genealogy completeness
    const withGenealogy = animales.filter(
      (a) => a.padre_id && a.madre_id
    ).length
    const pctGenealogiaCompleta =
      animales.length > 0 ? (withGenealogy / animales.length) * 100 : 0

    // Vaccinations
    const totalVacunaciones = sanitarios.filter(
      (e) => e.tipo === "vacunacion"
    ).length
    const hasCompletedCampaigns = totalVacunaciones > 0

    // Mortality (simplified: count dead animals in last year)
    const { count: muertosCount } = await supabase
      .from("animales")
      .select("id", { count: "exact", head: true })
      .eq("rancho_id", ranchoId)
      .eq("estado", "muerto")
      .gte("updated_at", oneYearAgo)

    const totalForMortality = animales.length + (muertosCount || 0)
    const tasaMortalidad =
      totalForMortality > 0
        ? ((muertosCount || 0) / totalForMortality) * 100
        : 0

    // Usage frequency (sessions per week in last 30 days)
    const uniqueDays = new Set(
      actividad.map((a) => a.fecha?.substring(0, 10))
    )
    const frecuenciaUsoSemanal = Math.round((uniqueDays.size / 30) * 7 * 10) / 10

    // Data completeness (animals with weight and GDP)
    const withWeight = animales.filter((a) => a.peso_actual).length
    const pctCamposLlenos =
      animales.length > 0
        ? ((withWeight + gdps.length) / (animales.length * 2)) * 100
        : 0

    // Monthly consistency
    const entryMonths = new Set(
      sanitarios.map((e) => e.fecha?.substring(0, 7))
    )
    const mesesConsistentes = entryMonths.size

    // Herd trend
    const previousCount = inventarioAnteriorRes.count || 0
    const currentCount = animales.length
    let tendenciaHato: "creciendo" | "estable" | "decreciendo" = "estable"
    if (currentCount > previousCount * 1.05) tendenciaHato = "creciendo"
    else if (currentCount < previousCount * 0.95) tendenciaHato = "decreciendo"

    // Reinvestment
    const reinversionPct =
      ingresos > 0 ? Math.min((egresos / ingresos) * 100, 100) : 0

    const input: CreditScoreInput = {
      gdpPromedio,
      gdpBenchmark: 0.8,
      gdpTendencia,
      pesoAjustado205: 180,
      pesoEstandar205: 200,
      pctVacunasAlDia: totalVacunaciones > 0 ? Math.min(totalVacunaciones * 10, 100) : 0,
      tasaMortalidad,
      mortalidadBenchmark: 5,
      campanasCompletadas: hasCompletedCampaigns ? 1 : 0,
      campanasTotal: 2,
      usaIA: false,
      usaTE: false,
      pctGenealogiaCompleta,
      sementalesCalidad: 2,
      margenBruto: ingresos - egresos,
      numFuentesIngreso: categorias.size,
      ventasRegulares: salesMonths.size >= 3,
      frecuenciaUsoSemanal,
      pctCamposLlenos,
      mesesConsistentes,
      mesesTotales: 12,
      tendenciaHato,
      tasaReposicion: 0.8,
      reinversionPct: Math.min(reinversionPct, 30),
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
