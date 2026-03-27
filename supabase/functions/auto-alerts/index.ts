// ---------------------------------------------------------------------------
// Supabase Edge Function: auto-alerts
// Runs daily via pg_cron to detect rule-based alerts across all ranches
// ---------------------------------------------------------------------------

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

// Gestation days per species
const GESTATION_DAYS: Record<string, number> = {
  bovino: 283,
  porcino: 114,
  ovino: 150,
  caprino: 150,
  ave: 21,
  equido: 340,
  conejo: 31,
  diversificado: 200,
}

// Mortality benchmarks (annual %)
const MORTALITY_BENCHMARKS: Record<string, number> = {
  bovino: 5,
  porcino: 8,
  ovino: 5,
  caprino: 5,
  ave: 5,
  equido: 3,
  conejo: 10,
  diversificado: 5,
}

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

    // Get all active ranches
    const { data: ranchos } = await supabase
      .from("ranchos")
      .select("id")
      .is("deleted_at", null)

    if (!ranchos || ranchos.length === 0) {
      return new Response(
        JSON.stringify({ success: true, alertsGenerated: 0, message: "No active ranches" }),
        { headers: { "Content-Type": "application/json" } }
      )
    }

    // Clear today's auto-generated alerts to avoid duplicates
    await supabase
      .from("alertas")
      .delete()
      .eq("fecha_alerta", today)
      .neq("tipo", "ia_insight")

    // -------------------------------------------------------------------
    // 1. Upcoming births (gestationDays - currentDays < 15)
    // -------------------------------------------------------------------
    const { data: gestantes } = await supabase
      .from("animales")
      .select("id, rancho_id, numero_arete, nombre, especie")
      .eq("estado_reproductivo", "gestante")
      .eq("estado", "activo")
      .is("deleted_at", null)

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
          const gestationDays = GESTATION_DAYS[animal.especie] || 283
          const dueDate = new Date(serviceDate.getTime() + gestationDays * 86400000)
          const daysUntilDue = Math.floor((dueDate.getTime() - Date.now()) / 86400000)

          if (daysUntilDue <= 15 && daysUntilDue >= 0) {
            const label = animal.nombre || animal.numero_arete || animal.id
            alerts.push({
              rancho_id: animal.rancho_id,
              animal_id: animal.id,
              especie: animal.especie,
              tipo: "parto_proximo",
              mensaje: `${label} — Parto estimado en ${daysUntilDue} día${daysUntilDue !== 1 ? "s" : ""} (${dueDate.toISOString().split("T")[0]})`,
              prioridad: daysUntilDue <= 5 ? "alta" : "media",
              accion_sugerida: "Preparar maternidad, verificar condición corporal, y vigilar signos de parto inminente",
              fecha_alerta: today,
            })
          }
        }
      }
    }

    // -------------------------------------------------------------------
    // 2. Overdue weighing (> 30 days since last weigh)
    // -------------------------------------------------------------------
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString()

    const { data: overdueWeighing } = await supabase
      .from("animales")
      .select("id, rancho_id, numero_arete, nombre, especie, fecha_ultimo_pesaje")
      .eq("estado", "activo")
      .is("deleted_at", null)
      .not("fecha_ultimo_pesaje", "is", null)
      .lt("fecha_ultimo_pesaje", thirtyDaysAgo)

    if (overdueWeighing) {
      // Group by ranch to avoid per-animal noise
      const byRancho = new Map<string, typeof overdueWeighing>()
      for (const a of overdueWeighing) {
        const list = byRancho.get(a.rancho_id) || []
        list.push(a)
        byRancho.set(a.rancho_id, list)
      }
      for (const [ranchoId, animals] of byRancho) {
        const oldest = animals.reduce((prev, curr) => {
          const prevDate = new Date(prev.fecha_ultimo_pesaje!).getTime()
          const currDate = new Date(curr.fecha_ultimo_pesaje!).getTime()
          return currDate < prevDate ? curr : prev
        })
        const daysOverdue = Math.floor(
          (Date.now() - new Date(oldest.fecha_ultimo_pesaje!).getTime()) / 86400000
        )

        alerts.push({
          rancho_id: ranchoId,
          especie: animals[0].especie,
          tipo: "pesaje_atrasado",
          mensaje: `${animals.length} animales sin pesaje hace más de 30 días (máximo: ${daysOverdue} días)`,
          prioridad: daysOverdue > 60 ? "alta" : "media",
          accion_sugerida: "Programar jornada de pesaje para actualizar GDP y monitorear crecimiento",
          fecha_alerta: today,
        })
      }
    }

    // -------------------------------------------------------------------
    // 3. Expired vaccines (next application < today)
    // -------------------------------------------------------------------
    const { data: expiredVaccines } = await supabase
      .from("eventos_sanitarios")
      .select("id, rancho_id, animal_id, producto, proxima_aplicacion")
      .eq("tipo", "vacunacion")
      .not("proxima_aplicacion", "is", null)
      .lt("proxima_aplicacion", today)

    if (expiredVaccines) {
      // Group by ranch
      const byRancho = new Map<string, typeof expiredVaccines>()
      for (const v of expiredVaccines) {
        const list = byRancho.get(v.rancho_id) || []
        list.push(v)
        byRancho.set(v.rancho_id, list)
      }
      for (const [ranchoId, vaccines] of byRancho) {
        const products = [...new Set(vaccines.map((v) => v.producto).filter(Boolean))]
        alerts.push({
          rancho_id: ranchoId,
          tipo: "vacuna_vencida",
          mensaje: `${vaccines.length} vacunas vencidas pendientes de aplicación: ${products.slice(0, 3).join(", ")}${products.length > 3 ? "..." : ""}`,
          prioridad: vaccines.length > 10 ? "alta" : "media",
          accion_sugerida: "Organizar jornada de vacunación. Verificar cadena de frío y disponibilidad de biológico",
          fecha_alerta: today,
        })
      }
    }

    // -------------------------------------------------------------------
    // 4. High mortality (above benchmark by ranch/species)
    // -------------------------------------------------------------------
    const oneMonthAgo = new Date(Date.now() - 30 * 86400000).toISOString()

    const { data: recentDeaths } = await supabase
      .from("animales")
      .select("rancho_id, especie")
      .eq("estado", "muerto")
      .gte("updated_at", oneMonthAgo)

    if (recentDeaths && recentDeaths.length > 0) {
      // Group by ranch+species
      const grouped = new Map<string, { rancho_id: string; especie: string; count: number }>()
      for (const d of recentDeaths) {
        const key = `${d.rancho_id}:${d.especie}`
        const existing = grouped.get(key)
        if (existing) {
          existing.count++
        } else {
          grouped.set(key, { rancho_id: d.rancho_id, especie: d.especie, count: 1 })
        }
      }

      for (const [, data] of grouped) {
        // Get total animals for this ranch+species
        const { count: totalActive } = await supabase
          .from("animales")
          .select("id", { count: "exact", head: true })
          .eq("rancho_id", data.rancho_id)
          .eq("especie", data.especie)
          .is("deleted_at", null)

        const total = (totalActive || 0) + data.count
        const mortalityPctAnnual = total > 0 ? (data.count / total) * 100 * 12 : 0
        const benchmark = MORTALITY_BENCHMARKS[data.especie] || 5

        if (mortalityPctAnnual > benchmark) {
          alerts.push({
            rancho_id: data.rancho_id,
            especie: data.especie,
            tipo: "mortalidad_alta",
            mensaje: `Mortalidad de ${data.especie} proyectada al ${mortalityPctAnnual.toFixed(1)}% anual (${data.count} muertes en 30 días). Benchmark: ${benchmark}%`,
            prioridad: mortalityPctAnnual > benchmark * 2 ? "alta" : "media",
            accion_sugerida: "Investigar causas de muerte. Realizar necropsia. Revisar condiciones sanitarias, agua y alimento. Consultar MVZ",
            fecha_alerta: today,
          })
        }
      }
    }

    // -------------------------------------------------------------------
    // 5. Overdue hive inspection (> 15 days)
    // -------------------------------------------------------------------
    const fifteenDaysAgo = new Date(Date.now() - 15 * 86400000).toISOString()

    const { data: hives } = await supabase
      .from("colmenas")
      .select("id, rancho_id, numero, fecha_ultima_revision")
      .eq("estado", "activa")
      .lt("fecha_ultima_revision", fifteenDaysAgo)

    if (hives) {
      for (const hive of hives) {
        const daysOverdue = Math.floor(
          (Date.now() - new Date(hive.fecha_ultima_revision).getTime()) / 86400000
        )
        alerts.push({
          rancho_id: hive.rancho_id,
          colmena_id: hive.id,
          especie: "abeja",
          tipo: "revision_colmena",
          mensaje: `Colmena ${hive.numero} sin revisión hace ${daysOverdue} días`,
          prioridad: daysOverdue > 30 ? "alta" : "media",
          accion_sugerida: "Programar revisión: verificar reina, reservas de miel, nivel de Varroa, y estado general de la colonia",
          fecha_alerta: today,
        })
      }
    }

    // -------------------------------------------------------------------
    // 6. Active medication withdrawal periods
    // -------------------------------------------------------------------
    const { data: activeWithdrawals } = await supabase
      .from("eventos_sanitarios")
      .select("id, rancho_id, animal_id, producto, retiro_fin")
      .not("retiro_fin", "is", null)
      .gt("retiro_fin", today)

    if (activeWithdrawals) {
      const byRancho = new Map<string, typeof activeWithdrawals>()
      for (const w of activeWithdrawals) {
        const list = byRancho.get(w.rancho_id) || []
        list.push(w)
        byRancho.set(w.rancho_id, list)
      }

      for (const [ranchoId, withdrawals] of byRancho) {
        alerts.push({
          rancho_id: ranchoId,
          tipo: "retiro_activo",
          mensaje: `${withdrawals.length} animal${withdrawals.length !== 1 ? "es" : ""} en periodo de retiro por medicamento. No comercializar hasta cumplir el periodo`,
          prioridad: "media",
          accion_sugerida: "Verificar fechas de vencimiento de retiro. Marcar físicamente los animales en retiro",
          fecha_alerta: today,
        })
      }
    }

    // -------------------------------------------------------------------
    // 7. Low feed stock (< 7 days of supply)
    // -------------------------------------------------------------------
    const { data: feedStock } = await supabase
      .from("inventario_alimento")
      .select("id, rancho_id, producto, cantidad_kg, consumo_diario_kg")

    if (feedStock) {
      for (const item of feedStock) {
        const dailyConsumption = item.consumo_diario_kg || 0
        const quantity = item.cantidad_kg || 0

        if (dailyConsumption <= 0) {
          // Fallback: alert if quantity is very low
          if (quantity < 50) {
            alerts.push({
              rancho_id: item.rancho_id,
              tipo: "alimento_bajo",
              mensaje: `Stock bajo de ${item.producto}: ${quantity} kg restantes`,
              prioridad: quantity < 20 ? "alta" : "media",
              accion_sugerida: "Reabastecer alimento lo antes posible",
              fecha_alerta: today,
            })
          }
          continue
        }

        const daysOfSupply = quantity / dailyConsumption

        if (daysOfSupply < 7) {
          alerts.push({
            rancho_id: item.rancho_id,
            tipo: "alimento_bajo",
            mensaje: `Stock bajo de ${item.producto}: ${Math.round(quantity)} kg (${daysOfSupply.toFixed(1)} días de suministro). Consumo diario: ${dailyConsumption} kg`,
            prioridad: daysOfSupply < 3 ? "alta" : "media",
            accion_sugerida: `Reabastecer ${item.producto}. Se requieren al menos ${Math.round(dailyConsumption * 14)} kg para 2 semanas`,
            fecha_alerta: today,
          })
        }
      }
    }

    // -------------------------------------------------------------------
    // Insert all alerts
    // -------------------------------------------------------------------
    if (alerts.length > 0) {
      const { error } = await supabase.from("alertas").insert(alerts)
      if (error) {
        console.error("Error inserting alerts:", error)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        alertsGenerated: alerts.length,
        ranchesProcessed: ranchos.length,
        timestamp: new Date().toISOString(),
      }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Auto-alert generation error:", error)
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})
