"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const supabase = createClient()

export function useEconomicMovements(ranchoId: string, tipo?: "ingreso" | "egreso") {
  return useQuery({
    queryKey: ["economics", ranchoId, tipo],
    queryFn: async () => {
      let query = supabase
        .from("movimientos_economicos")
        .select("*")
        .eq("rancho_id", ranchoId)
        .order("fecha", { ascending: false })
      if (tipo) query = query.eq("tipo", tipo)
      const { data, error } = await query.limit(200)
      if (error) throw error
      return data
    },
    enabled: !!ranchoId,
  })
}

export function useCreateEconomicMovement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (movement: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("movimientos_economicos")
        .insert(movement)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["economics", data.rancho_id] })
      toast.success(data.tipo === "ingreso" ? "Ingreso registrado" : "Egreso registrado")
    },
    onError: (error: Error) => toast.error("Error: " + error.message),
  })
}
