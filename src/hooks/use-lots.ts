"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const supabase = createClient()

export function useLots(ranchoId: string, especie?: string) {
  return useQuery({
    queryKey: ["lots", ranchoId, especie],
    queryFn: async () => {
      let query = supabase
        .from("lotes")
        .select("*")
        .eq("rancho_id", ranchoId)
        .eq("estado", "activo")
        .order("created_at", { ascending: false })
      if (especie) query = query.eq("especie", especie)
      const { data, error } = await query
      if (error) throw error
      return data
    },
    enabled: !!ranchoId,
  })
}

export function useLotProduction(loteId: string) {
  return useQuery({
    queryKey: ["lot-production", loteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("produccion_lotes")
        .select("*")
        .eq("lote_id", loteId)
        .order("fecha", { ascending: false })
        .limit(60)
      if (error) throw error
      return data
    },
    enabled: !!loteId,
  })
}

export function useCreateLotProduction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (production: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("produccion_lotes")
        .insert(production)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["lot-production", data.lote_id] })
      toast.success("Producción registrada")
    },
    onError: (error: Error) => toast.error("Error: " + error.message),
  })
}
