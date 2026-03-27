// ---------------------------------------------------------------------------
// Supabase Edge Function: ai-insights
// Runs weekly via pg_cron to generate AI-powered insights for all ranches
// ---------------------------------------------------------------------------

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!

const SYSTEM_PROMPT = `Eres HatoAI, un consultor ganadero experto con 20 años de experiencia en México, especializado en ganadería tropical y subtropical.
Analizas datos de ranchos y generas insights accionables en español mexicano.
Siempre incluyes datos específicos, comparaciones con benchmarks regionales (INIFAP, CONASA, SIAP), y recomendaciones concretas.
Consideras estacionalidad (temporada de lluvias mayo-octubre, secas noviembre-abril) y normativas SENASICA.
Responde SIEMPRE en formato JSON válido sin markdown con la estructura:
{ "insights": [{ "tipo": "productividad"|"reproductivo"|"sanitario"|"economico", "prioridad": "alta"|"media"|"baja", "mensaje": string, "accion": string, "impacto_economico": string }] }`

Deno.serve(async () => {
  try {
    // Get all active ranches
    const { data: ranchos } = await supabase
      .from("ranchos")
      .select("id, nombre, especies_activas")
      .is("deleted_at", null)

    if (!ranchos || ranchos.length === 0) {
      return new Response(
        JSON.stringify({ message: "No active ranches found" }),
        { headers: { "Content-Type": "application/json" } }
      )
    }

    let totalInsights = 0
    let ranchesProcessed = 0
    const errors: string[] = []

    for (const rancho of ranchos) {
      try {
        // Gather 30-day data
        const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString()

        const [animalesRes, pesajesRes, eventosReproRes, eventosSanitRes, economicosRes] =
          await Promise.all([
            supabase
              .from("animales")
              .select("id, especie, gdp_actual, peso_actual, estado_reproductivo, estado, fecha_ultimo_pesaje")
              .eq("rancho_id", rancho.id)
              .is("deleted_at", null)
              .eq("estado", "activo"),
            supabase
              .from("pesajes")
              .select("animal_id, peso, fecha, gdp_calculada")
              .eq("rancho_id", rancho.id)
              .gte("fecha", thirtyDaysAgo),
            supabase
              .from("eventos_reproductivos")
              .select("tipo, fecha, animal_id, resultado")
              .eq("rancho_id", rancho.id)
              .gte("fecha", thirtyDaysAgo),
            supabase
              .from("eventos_sanitarios")
              .select("tipo, fecha, producto, animal_id")
              .eq("rancho_id", rancho.id)
              .gte("fecha", thirtyDaysAgo),
            supabase
              .from("movimientos_economicos")
              .select("tipo, monto, categoria, fecha")
              .eq("rancho_id", rancho.id)
              .gte("fecha", thirtyDaysAgo),
          ])

        const animales = animalesRes.data || []
        const pesajes = pesajesRes.data || []
        const eventosRepro = eventosReproRes.data || []
        const eventosSanit = eventosSanitRes.data || []
        const economicos = economicosRes.data || []

        // Skip ranches with no animals
        if (animales.length === 0) continue

        // Calculate metrics
        const gdps = animales
          .filter((a) => a.gdp_actual)
          .map((a) => a.gdp_actual as number)
        const avgGdp =
          gdps.length > 0 ? gdps.reduce((a, b) => a + b, 0) / gdps.length : 0

        const pesos = animales
          .filter((a) => a.peso_actual)
          .map((a) => a.peso_actual as number)
        const avgPeso =
          pesos.length > 0 ? pesos.reduce((a, b) => a + b, 0) / pesos.length : 0

        const gestantes = animales.filter(
          (a) => a.estado_reproductivo === "gestante"
        )
        const servicios = eventosRepro.filter((e) => e.tipo === "servicio")
        const partos = eventosRepro.filter((e) => e.tipo === "parto")
        const vacunaciones = eventosSanit.filter((e) => e.tipo === "vacunacion")
        const tratamientos = eventosSanit.filter((e) => e.tipo === "tratamiento")

        const ingresos = economicos
          .filter((e) => e.tipo === "ingreso")
          .reduce((s, e) => s + (e.monto || 0), 0)
        const egresos = economicos
          .filter((e) => e.tipo === "egreso")
          .reduce((s, e) => s + (e.monto || 0), 0)

        // Count animals without recent weighing
        const sinPesaje = animales.filter((a) => {
          if (!a.fecha_ultimo_pesaje) return true
          return new Date(a.fecha_ultimo_pesaje).getTime() < Date.now() - 30 * 86400000
        })

        // Get mortality count
        const { count: muertos30d } = await supabase
          .from("animales")
          .select("id", { count: "exact", head: true })
          .eq("rancho_id", rancho.id)
          .eq("estado", "muerto")
          .gte("updated_at", thirtyDaysAgo)

        const month = new Date().getMonth()
        const temporada = month >= 4 && month <= 9 ? "lluvias" : "secas"
        const especie = (rancho.especies_activas as string[])?.[0] || "bovino"

        const prompt = `Datos del rancho "${rancho.nombre}" - Resumen 30 días (${temporada}):

INVENTARIO:
- Especie principal: ${especie}
- Total animales activos: ${animales.length}
- Sin pesaje reciente: ${sinPesaje.length}

PRODUCTIVIDAD:
- GDP promedio: ${avgGdp.toFixed(3)} kg/día (benchmark regional: 0.8 kg/día)
- Peso promedio: ${avgPeso.toFixed(1)} kg
- Pesajes registrados: ${pesajes.length}

REPRODUCCION:
- Gestantes actuales: ${gestantes.length} (${animales.length > 0 ? ((gestantes.length / animales.length) * 100).toFixed(1) : 0}% del hato)
- Servicios realizados: ${servicios.length}
- Partos registrados: ${partos.length}

SANIDAD:
- Vacunaciones aplicadas: ${vacunaciones.length}
- Tratamientos realizados: ${tratamientos.length}
- Muertes registradas: ${muertos30d || 0}
- Mortalidad mensual: ${animales.length > 0 ? (((muertos30d || 0) / animales.length) * 100).toFixed(2) : 0}%

ECONOMIA:
- Ingresos: $${ingresos.toLocaleString()} MXN
- Egresos: $${egresos.toLocaleString()} MXN
- Balance: $${(ingresos - egresos).toLocaleString()} MXN
- Costo por cabeza/mes: $${animales.length > 0 ? Math.round(egresos / animales.length).toLocaleString() : 0} MXN

Genera 3-5 insights accionables priorizados para este rancho. Enfócate en las áreas con mayor oportunidad de mejora.`

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1500,
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: prompt }],
          }),
        })

        if (!response.ok) {
          errors.push(`Ranch ${rancho.id}: API error ${response.status}`)
          continue
        }

        const data = await response.json()
        const content = data.content?.[0]?.text || "{}"

        let parsed: { insights?: Array<{ tipo?: string; prioridad?: string; mensaje?: string; accion?: string; impacto_economico?: string }> }
        try {
          parsed = JSON.parse(content)
        } catch {
          errors.push(`Ranch ${rancho.id}: Failed to parse AI response`)
          continue
        }

        const insights = parsed.insights || []

        // Insert each insight as an alert
        for (const insight of insights) {
          if (!insight.mensaje) continue

          const { error: insertError } = await supabase.from("alertas").insert({
            rancho_id: rancho.id,
            tipo: "ia_insight",
            mensaje: `[${insight.tipo || "general"}] ${insight.mensaje}`,
            prioridad: insight.prioridad || "media",
            accion_sugerida: insight.accion || null,
            metadata: {
              impacto_economico: insight.impacto_economico || null,
              tipo_insight: insight.tipo || null,
              generado_por: "ai-insights-weekly",
            },
            fecha_alerta: new Date().toISOString().split("T")[0],
          })

          if (!insertError) {
            totalInsights++
          }
        }

        ranchesProcessed++

        // Small delay between ranches to avoid API rate limits
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (ranchError) {
        errors.push(`Ranch ${rancho.id}: ${(ranchError as Error).message}`)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        insightsGenerated: totalInsights,
        ranchesProcessed,
        totalRanches: ranchos.length,
        errors: errors.length > 0 ? errors : undefined,
        timestamp: new Date().toISOString(),
      }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("AI insights error:", error)
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})
