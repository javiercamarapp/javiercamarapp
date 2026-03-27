import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  SYSTEM_PROMPT,
  productivityPrompt,
  reproductivePrompt,
  healthPrompt,
  economicPrompt,
} from "@/lib/ai/prompts"
import {
  generateInsights,
  type RanchInsightData,
  type WeightStats,
  type ReproductionStats,
  type HealthEventSummary,
  type EconomicSummary,
} from "@/lib/ai/insights"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { ranchoId, modulo } = await request.json()

    if (!ranchoId) {
      return NextResponse.json(
        { error: "ranchoId es requerido" },
        { status: 400 }
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key de Anthropic no configurada" },
        { status: 500 }
      )
    }

    // Gather ranch data from DB
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString()
    const oneYearAgo = new Date(Date.now() - 365 * 86400000).toISOString()

    const [animalesRes, pesajesRes, sanitariosRes, reproductivosRes, economicosRes, ranchoRes] =
      await Promise.all([
        supabase
          .from("animales")
          .select("id, numero_arete, nombre, especie, gdp_actual, peso_actual, estado_reproductivo, padre_id, madre_id, fecha_ultimo_pesaje")
          .eq("rancho_id", ranchoId)
          .eq("estado", "activo")
          .is("deleted_at", null),
        supabase
          .from("pesajes")
          .select("animal_id, peso, fecha, gdp_calculada")
          .eq("rancho_id", ranchoId)
          .gte("fecha", thirtyDaysAgo),
        supabase
          .from("eventos_sanitarios")
          .select("id, tipo, animal_id, fecha, proxima_aplicacion, retiro_fin, producto")
          .eq("rancho_id", ranchoId)
          .gte("fecha", oneYearAgo),
        supabase
          .from("eventos_reproductivos")
          .select("tipo, fecha, animal_id")
          .eq("rancho_id", ranchoId)
          .gte("fecha", oneYearAgo),
        supabase
          .from("movimientos_economicos")
          .select("tipo, monto, categoria, fecha")
          .eq("rancho_id", ranchoId)
          .gte("fecha", thirtyDaysAgo),
        supabase
          .from("ranchos")
          .select("nombre, especies_activas")
          .eq("id", ranchoId)
          .single(),
      ])

    const animales = animalesRes.data || []
    const pesajes = pesajesRes.data || []
    const sanitarios = sanitariosRes.data || []
    const reproductivos = reproductivosRes.data || []
    const economicos = economicosRes.data || []
    const rancho = ranchoRes.data

    if (!rancho) {
      return NextResponse.json({ error: "Rancho no encontrado" }, { status: 404 })
    }

    // Calculate stats
    const gdps = animales.filter((a) => a.gdp_actual).map((a) => a.gdp_actual as number)
    const avgGdp = gdps.length > 0 ? gdps.reduce((a, b) => a + b, 0) / gdps.length : 0

    const pesos = animales.filter((a) => a.peso_actual).map((a) => a.peso_actual as number)
    const avgPeso = pesos.length > 0 ? pesos.reduce((a, b) => a + b, 0) / pesos.length : 0

    const ingresos = economicos
      .filter((m) => m.tipo === "ingreso")
      .reduce((sum, m) => sum + (m.monto || 0), 0)
    const egresos = economicos
      .filter((m) => m.tipo === "egreso")
      .reduce((sum, m) => sum + (m.monto || 0), 0)

    const gestantes = animales.filter((a) => a.estado_reproductivo === "gestante")
    const vacunaciones = sanitarios.filter((e) => e.tipo === "vacunacion")
    const tratamientos30d = sanitarios.filter(
      (e) => e.tipo === "tratamiento" && new Date(e.fecha).getTime() > Date.now() - 30 * 86400000
    )

    // Build prompt based on requested module
    let prompt: string

    const especie = (rancho.especies_activas as string[])?.[0] || "bovino"

    if (modulo === "productividad") {
      const sorted = [...animales].filter((a) => a.gdp_actual).sort((a, b) => (b.gdp_actual || 0) - (a.gdp_actual || 0))
      prompt = productivityPrompt({
        especie,
        totalCabezas: animales.length,
        gdpPromedio: avgGdp,
        benchmarkRegional: 0.8,
        top5: sorted.slice(0, 5).map((a) => `${a.nombre || a.numero_arete}: ${a.gdp_actual} kg/d`),
        bottom5: sorted.slice(-5).map((a) => `${a.nombre || a.numero_arete}: ${a.gdp_actual} kg/d`),
        porCorral: {},
        pesoPromedio: avgPeso,
      })
    } else if (modulo === "reproductivo") {
      const servicios = reproductivos.filter((e) => e.tipo === "servicio")
      prompt = reproductivePrompt({
        especie,
        tasaPrenez: animales.length > 0 ? (gestantes.length / animales.length) * 100 : 0,
        serviciosConcepcion: servicios.length > 0 ? servicios.length / Math.max(gestantes.length, 1) : 0,
        intervaloParto: 400,
        tasaDestete: 85,
        diasAbiertos: 120,
        rankingSementales: [],
        gestantesActuales: gestantes.length,
        proximosPartos30d: 0,
      })
    } else if (modulo === "sanitario") {
      const month = new Date().getMonth()
      prompt = healthPrompt({
        especie,
        totalCabezas: animales.length,
        tratamientos30d: tratamientos30d.length,
        mortalidad30d: 0,
        mortalidadPct: 0,
        vacunasPendientes: 0,
        vacunasAlDia: vacunaciones.length,
        retirosActivos: sanitarios.filter((e) => e.retiro_fin && new Date(e.retiro_fin).getTime() > Date.now()).length,
        enfermedadesFrecuentes: [],
        desparasitacionesPendientes: 0,
        temporada: month >= 4 && month <= 9 ? "lluvias" : "secas",
      })
    } else if (modulo === "economico") {
      prompt = economicPrompt({
        especie,
        totalCabezas: animales.length,
        ingresos30d: ingresos,
        egresos30d: egresos,
        costoPorCabeza: animales.length > 0 ? egresos / animales.length : 0,
        margenPorVenta: 0,
        flujoCaja: ingresos - egresos,
        desgloseCostos: {},
        precioMercadoKg: 60,
        tendenciaPrecios: "estable",
      })
    } else {
      // General analysis - generate rule-based insights first, then ask AI
      const weights: WeightStats = {
        pesoPromedio: avgPeso,
        gdpPromedio: avgGdp,
        gdpBenchmark: 0.8,
        pesoDestete205: 180,
        pesoAnual365: 300,
      }
      const reproduction: ReproductionStats = {
        tasaPrenez: animales.length > 0 ? (gestantes.length / animales.length) * 100 : 0,
        serviciosPorConcepcion: 1.8,
        intervaloParto: 400,
        tasaDestete: 85,
        diasAbiertos: 120,
        gestantesActuales: gestantes.length,
      }
      const health: HealthEventSummary = {
        tratamientos30d: tratamientos30d.length,
        mortalidad30d: 0,
        vacunasPendientes: 0,
        vacunasAlDia: vacunaciones.length,
        retirosActivos: 0,
        enfermedadesFrecuentes: [],
      }
      const economics: EconomicSummary = {
        ingresos30d: ingresos,
        egresos30d: egresos,
        costoPorCabeza: animales.length > 0 ? egresos / animales.length : 0,
        margenPorVenta: 0,
        flujoCaja: ingresos - egresos,
      }

      const ranchData: RanchInsightData = {
        ranchoId,
        ranchoNombre: rancho.nombre,
        especie: especie as RanchInsightData["especie"],
        totalCabezas: animales.length,
        weights,
        reproduction,
        health,
        economics,
      }

      const ruleBasedInsights = generateInsights(ranchData)

      // Also get AI-powered insights
      prompt = `Datos del rancho "${rancho.nombre}" (últimos 30 días):
- Especie principal: ${especie}
- Total animales activos: ${animales.length}
- GDP promedio: ${avgGdp.toFixed(3)} kg/día (benchmark: 0.8 kg/día)
- Peso promedio: ${avgPeso.toFixed(1)} kg
- Pesajes registrados: ${pesajes.length}
- Eventos reproductivos: ${reproductivos.length}
- Gestantes: ${gestantes.length}
- Tratamientos sanitarios: ${tratamientos30d.length}
- Ingresos: $${ingresos.toLocaleString()} MXN
- Egresos: $${egresos.toLocaleString()} MXN
- Balance: $${(ingresos - egresos).toLocaleString()} MXN

Genera 3-5 insights accionables cubriendo productividad, reproducción, sanidad y economía.
Cada insight: { "tipo": string, "prioridad": "alta"|"media"|"baja", "mensaje": string, "accion_sugerida": string, "impacto_economico": string }
Responde en JSON: { "insights": [...] }`

      // Call Claude API
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: prompt }],
        }),
      })

      if (!response.ok) {
        // Fall back to rule-based insights if AI fails
        return NextResponse.json({
          insights: ruleBasedInsights.insights,
          source: "rule_based",
        })
      }

      const data = await response.json()
      const content = data.content?.[0]?.text || "{}"

      let aiInsights: { insights?: unknown[] } = {}
      try {
        aiInsights = JSON.parse(content)
      } catch {
        // Fall back to rule-based
        return NextResponse.json({
          insights: ruleBasedInsights.insights,
          source: "rule_based",
        })
      }

      return NextResponse.json({
        insights: [
          ...ruleBasedInsights.insights,
          ...(aiInsights.insights || []),
        ],
        source: "hybrid",
      })
    }

    // For specific modules, call Claude API directly
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: "Error de AI: " + errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.content?.[0]?.text || "{}"

    let insights: unknown
    try {
      insights = JSON.parse(content)
    } catch {
      insights = { raw: content }
    }

    return NextResponse.json({ insights, source: "ai" })
  } catch (error) {
    console.error("AI insights error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
