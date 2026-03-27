"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const supabase = createClient()

export function useHealthEvents(ranchoId: string, animalId?: string) {
  return useQuery({
    queryKey: ["health-events", ranchoId, animalId],
    queryFn: async () => {
      let query = supabase
        .from("eventos_sanitarios")
        .select("*, animales(numero_arete, nombre)")
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

export function useCreateHealthEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (event: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("eventos_sanitarios")
        .insert(event)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["health-events", data.rancho_id] })
      toast.success("Evento sanitario registrado")
    },
    onError: (error: Error) => toast.error("Error: " + error.message),
  })
}

export function useCampaigns(ranchoId: string) {
  return useQuery({
    queryKey: ["campaigns", ranchoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campanas_sanitarias")
        .select("*")
        .eq("rancho_id", ranchoId)
        .order("fecha_inicio", { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!ranchoId,
  })
}
