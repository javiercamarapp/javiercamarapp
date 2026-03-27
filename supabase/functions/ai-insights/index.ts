import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY")!

const SYSTEM_PROMPT = `Eres un consultor ganadero experto con 20 años de experiencia en la Península de Yucatán, México.
Analizas datos de ranchos y generas insights accionables en español mexicano.
Responde SIEMPRE en formato JSON con la estructura: { "insights": [{ "tipo": string, "prioridad": "alta"|"media"|"baja", "mensaje": string, "accion": string }] }`

Deno.serve(async () => {
  try {
    // Get all active ranches
    const { data: ranchos } = await supabase
      .from("ranchos")
      .select("id, nombre, especies_activas")
      .is("deleted_at", null)

    if (!ranchos || ranchos.length === 0) {
      return new Response(JSON.stringify({ message: "No ranches found" }), {
        headers: { "Content-Type": "application/json" },
      })
    }

    let totalInsights = 0

    for (const rancho of ranchos) {
      // Gather 30-day data
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString()

      const [animalesRes, pesajesRes, eventosRes, economicosRes] = await Promise.all([
        supabase
          .from("animales")
          .select("id, especie, gdp_actual, peso_actual, estado_reproductivo")
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
          .select("tipo, fecha, animal_id")
          .eq("rancho_id", rancho.id)
          .gte("fecha", thirtyDaysAgo),
        supabase
          .from("movimientos_economicos")
          .select("tipo, monto, categoria")
          .eq("rancho_id", rancho.id)
          .gte("fecha", thirtyDaysAgo),
      ])

      const animales = animalesRes.data || []
      const pesajes = pesajesRes.data || []
      const eventos = eventosRes.data || []
      const economicos = economicosRes.data || []

      const ingresos = economicos.filter((e) => e.tipo === "ingreso").reduce((s, e) => s + (e.monto || 0), 0)
      const egresos = economicos.filter((e) => e.tipo === "egreso").reduce((s, e) => s + (e.monto || 0), 0)
      const gdps = animales.filter((a) => a.gdp_actual).map((a) => a.gdp_actual as number)
      const avgGdp = gdps.length > 0 ? gdps.reduce((a, b) => a + b, 0) / gdps.length : 0

      const prompt = `Datos del rancho "${rancho.nombre}" (últimos 30 días):
- Total animales activos: ${animales.length}
- GDP promedio: ${avgGdp.toFixed(3)} kg/día (benchmark: 0.8 kg/día)
- Pesajes registrados: ${pesajes.length}
- Eventos reproductivos: ${eventos.length}
- Gestantes: ${animales.filter((a) => a.estado_reproductivo === "gestante").length}
- Ingresos: $${ingresos.toLocaleString()} MXN
- Egresos: $${egresos.toLocaleString()} MXN
- Balance: $${(ingresos - egresos).toLocaleString()} MXN

Genera 3-4 insights accionables para este rancho.`

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: prompt }],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const content = data.content?.[0]?.text || "{}"

        try {
          const parsed = JSON.parse(content)
          const insights = parsed.insights || []

          for (const insight of insights) {
            await supabase.from("alertas").insert({
              rancho_id: rancho.id,
              tipo: "ia_insight",
              mensaje: insight.mensaje,
              prioridad: insight.prioridad || "media",
              accion_sugerida: insight.accion,
              fecha_alerta: new Date().toISOString().split("T")[0],
            })
            totalInsights++
          }
        } catch {
          console.error("Failed to parse AI response for ranch:", rancho.id)
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, insightsGenerated: totalInsights }),
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
