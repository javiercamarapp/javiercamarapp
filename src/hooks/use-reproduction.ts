"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const supabase = createClient()

export function useReproductiveEvents(ranchoId: string, animalId?: string) {
  return useQuery({
    queryKey: ["reproductive-events", ranchoId, animalId],
    queryFn: async () => {
      let query = supabase
        .from("eventos_reproductivos")
        .select("*, animales(numero_arete, nombre, especie)")
        .eq("rancho_id", ranchoId)
        .order("fecha", { ascending: false })
      if (animalId) query = query.eq("animal_id", animalId)
      const { data, error } = await query.limit(100)
      if (error) throw error
      return data
    },
    enabled: !!ranchoId,
  })
}

export function useCreateReproductiveEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (event: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("eventos_reproductivos")
        .insert(event)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["reproductive-events", data.rancho_id] })
      queryClient.invalidateQueries({ queryKey: ["animal", data.animal_id] })
      toast.success("Evento reproductivo registrado")
    },
    onError: (error: Error) => toast.error("Error: " + error.message),
  })
}

export function useAnimalsByReproductiveState(ranchoId: string) {
  return useQuery({
    queryKey: ["animals-by-repro-state", ranchoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("animales")
        .select("id, numero_arete, nombre, especie, estado_reproductivo, updated_at")
        .eq("rancho_id", ranchoId)
        .is("deleted_at", null)
        .in("sexo", ["hembra"])
        .not("estado_reproductivo", "is", null)
        .order("updated_at", { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!ranchoId,
  })
}
