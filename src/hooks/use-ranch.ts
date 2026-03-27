"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const supabase = createClient()

export function useRanch(ranchoId: string) {
  return useQuery({
    queryKey: ["ranch", ranchoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ranchos")
        .select("*")
        .eq("id", ranchoId)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!ranchoId,
  })
}

export function useCorrales(ranchoId: string) {
  return useQuery({
    queryKey: ["corrales", ranchoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("corrales")
        .select("*")
        .eq("rancho_id", ranchoId)
        .order("nombre")
      if (error) throw error
      return data
    },
    enabled: !!ranchoId,
  })
}

export function useAlerts(ranchoId: string) {
  return useQuery({
    queryKey: ["alerts", ranchoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alertas")
        .select("*")
        .eq("rancho_id", ranchoId)
        .eq("leida", false)
        .order("prioridad")
        .order("created_at", { ascending: false })
        .limit(20)
      if (error) throw error
      return data
    },
    enabled: !!ranchoId,
  })
}

export function useUpdateRanch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: Record<string, unknown> & { id: string }) => {
      const { data, error } = await supabase
        .from("ranchos")
        .update(updates)
        .eq("id", id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["ranch", data.id] })
      toast.success("Rancho actualizado")
    },
    onError: (error: Error) => toast.error("Error: " + error.message),
  })
}
