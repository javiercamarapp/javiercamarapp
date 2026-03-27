import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

function clamp(val: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, val))
}

Deno.serve(async () => {
  try {
    const { data: ranchos } = await supabase
      .from("ranchos")
      .select("id")
      .is("deleted_at", null)

    if (!ranchos) {
      return new Response(JSON.stringify({ message: "No ranches" }), {
        headers: { "Content-Type": "application/json" },
      })
    }

    let calculated = 0

    for (const rancho of ranchos) {
      const yearAgo = new Date(Date.now() - 365 * 86400000).toISOString()

      const [animalesRes, economicosRes, sanitariosRes] = await Promise.all([
        supabase
          .from("animales")
          .select("id, gdp_actual, padre_id, madre_id, estado_reproductivo")
          .eq("rancho_id", rancho.id)
          .is("deleted_at", null)
          .eq("estado", "activo"),
        supabase
          .from("movimientos_economicos")
          .select("tipo, monto, categoria")
          .eq("rancho_id", rancho.id)
          .gte("fecha", yearAgo),
        supabase
          .from("eventos_sanitarios")
          .select("tipo")
          .eq("rancho_id", rancho.id)
          .gte("fecha", yearAgo),
      ])

      const animales = animalesRes.data || []
      const economicos = economicosRes.data || []
      const sanitarios = sanitariosRes.data || []

      const gdps = animales.filter((a) => a.gdp_actual).map((a) => a.gdp_actual as number)
      const avgGdp = gdps.length > 0 ? gdps.reduce((a, b) => a + b, 0) / gdps.length : 0

      const ingresos = economicos.filter((e) => e.tipo === "ingreso").reduce((s, e) => s + (e.monto || 0), 0)
      const egresos = economicos.filter((e) => e.tipo === "egreso").reduce((s, e) => s + (e.monto || 0), 0)
      const withGenealogy = animales.filter((a) => a.padre_id && a.madre_id).length
      const vacunaciones = sanitarios.filter((e) => e.tipo === "vacunacion").length

      // Calculate scores
      const productividad = clamp(Math.min(avgGdp / 0.8, 1) * 70 + 15)
      const sanidad = clamp(Math.min(vacunaciones / Math.max(animales.length, 1), 1) * 60 + 20)
      const genetica = clamp((animales.length > 0 ? (withGenealogy / animales.length) * 60 : 0) + 10)
      const economia = clamp(ingresos > egresos ? 70 : 30 + Math.min(ingresos / Math.max(egresos, 1), 1) * 30)
      const registros = clamp(60) // placeholder based on activity
      const crecimiento = clamp(50) // placeholder

      const total = Math.round(
        productividad * 0.2 + sanidad * 0.15 + genetica * 0.1 +
        economia * 0.25 + registros * 0.15 + crecimiento * 0.15
      )

      const nivel = total >= 80 ? "excelente" : total >= 60 ? "bueno" : total >= 40 ? "regular" : "bajo"

      await supabase.from("perfil_crediticio").upsert({
        rancho_id: rancho.id,
        fecha_calculo: new Date().toISOString().split("T")[0],
        total_cabezas: animales.length,
        ingresos_12m: ingresos,
        egresos_12m: egresos,
        flujo_neto_12m: ingresos - egresos,
        score_productividad: Math.round(productividad),
        score_sanidad: Math.round(sanidad),
        score_genetica: Math.round(genetica),
        score_economia: Math.round(economia),
        score_registros: Math.round(registros),
        score_crecimiento: Math.round(crecimiento),
        score_total: total,
        nivel,
      }, { onConflict: "rancho_id" })

      calculated++
    }

    return new Response(
      JSON.stringify({ success: true, ranchesCalculated: calculated }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Credit score error:", error)
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})
