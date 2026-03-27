import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

interface AlertData {
  rancho_id: string
  animal_id?: string
  lote_id?: string
  colmena_id?: string
  especie?: string
  tipo: string
  mensaje: string
  prioridad: "alta" | "media" | "baja"
  accion_sugerida?: string
  fecha_alerta: string
}

Deno.serve(async () => {
  try {
    const today = new Date().toISOString().split("T")[0]
    const alerts: AlertData[] = []

    // 1. Upcoming births (within 15 days)
    const { data: gestantes } = await supabase
      .from("animales")
      .select("id, rancho_id, numero_arete, nombre, especie")
      .eq("estado_reproductivo", "gestante")
      .eq("estado", "activo")
      .is("deleted_at", null)

    // For each gestante, check last service event to estimate due date
    if (gestantes) {
      for (const animal of gestantes) {
        const { data: lastService } = await supabase
          .from("eventos_reproductivos")
          .select("fecha")
          .eq("animal_id", animal.id)
          .eq("tipo", "servicio")
          .order("fecha", { ascending: false })
          .limit(1)
          .single()

        if (lastService) {
          const serviceDate = new Date(lastService.fecha)
          const gestationDays = animal.especie === "bovino" ? 283 : animal.especie === "porcino" ? 114 : 150
          const dueDate = new Date(serviceDate.getTime() + gestationDays * 86400000)
          const daysUntilDue = Math.floor((dueDate.getTime() - Date.now()) / 86400000)

          if (daysUntilDue <= 15 && daysUntilDue >= 0) {
            alerts.push({
              rancho_id: animal.rancho_id,
              animal_id: animal.id,
              especie: animal.especie,
              tipo: "parto_proximo",
              mensaje: `${animal.nombre || animal.numero_arete} — Parto estimado en ${daysUntilDue} días`,
              prioridad: daysUntilDue <= 5 ? "alta" : "media",
              accion_sugerida: "Preparar maternidad y vigilar signos de parto",
              fecha_alerta: today,
            })
          }
        }
      }
    }

    // 2. Overdue weighing (>30 days)
    const { data: overdueWeighing } = await supabase
      .from("animales")
      .select("id, rancho_id, numero_arete, nombre, especie, fecha_ultimo_pesaje")
      .eq("estado", "activo")
      .is("deleted_at", null)
      .lt("fecha_ultimo_pesaje", new Date(Date.now() - 30 * 86400000).toISOString())

    if (overdueWeighing) {
      const byRancho = new Map<string, typeof overdueWeighing>()
      for (const a of overdueWeighing) {
        const list = byRancho.get(a.rancho_id) || []
        list.push(a)
        byRancho.set(a.rancho_id, list)
      }
      for (const [ranchoId, animals] of byRancho) {
        alerts.push({
          rancho_id: ranchoId,
          especie: animals[0].especie,
          tipo: "pesaje_atrasado",
          mensaje: `${animals.length} animales sin pesaje hace más de 30 días`,
          prioridad: "media",
          accion_sugerida: "Programar jornada de pesaje",
          fecha_alerta: today,
        })
      }
    }

    // 3. Overdue hive inspection (>15 days)
    const { data: hives } = await supabase
      .from("colmenas")
      .select("id, rancho_id, numero, apiario_id, fecha_ultima_revision")
      .eq("estado", "activa")
      .lt("fecha_ultima_revision", new Date(Date.now() - 15 * 86400000).toISOString())

    if (hives) {
      for (const hive of hives) {
        alerts.push({
          rancho_id: hive.rancho_id,
          colmena_id: hive.id,
          especie: "abeja",
          tipo: "revision_colmena",
          mensaje: `Colmena ${hive.numero} sin revisión hace más de 15 días`,
          prioridad: "media",
          accion_sugerida: "Programar revisión de colmena",
          fecha_alerta: today,
        })
      }
    }

    // 4. Low feed stock (< 7 days supply)
    const { data: lowStock } = await supabase
      .from("inventario_alimento")
      .select("id, rancho_id, producto, cantidad_kg")
      .lt("cantidad_kg", 100) // rough threshold

    if (lowStock) {
      for (const item of lowStock) {
        alerts.push({
          rancho_id: item.rancho_id,
          tipo: "alimento_bajo",
          mensaje: `Stock bajo de ${item.producto}: ${item.cantidad_kg} kg restantes`,
          prioridad: item.cantidad_kg < 50 ? "alta" : "media",
          accion_sugerida: "Reabastecer alimento",
          fecha_alerta: today,
        })
      }
    }

    // Insert alerts (upsert to avoid duplicates for same day)
    if (alerts.length > 0) {
      const { error } = await supabase.from("alertas").insert(alerts)
      if (error) console.error("Error inserting alerts:", error)
    }

    return new Response(
      JSON.stringify({ success: true, alertsGenerated: alerts.length }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Alert generation error:", error)
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})
