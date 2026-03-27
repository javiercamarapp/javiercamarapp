"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const supabase = createClient()

export function useWeights(animalId: string) {
  return useQuery({
    queryKey: ["weights", animalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pesajes")
        .select("*")
        .eq("animal_id", animalId)
        .order("fecha", { ascending: true })
      if (error) throw error
      return data
    },
    enabled: !!animalId,
  })
}

export function useRanchWeights(ranchoId: string) {
  return useQuery({
    queryKey: ["ranch-weights", ranchoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pesajes")
        .select("*, animales(numero_arete, nombre, especie)")
        .eq("rancho_id", ranchoId)
        .order("fecha", { ascending: false })
        .limit(100)
      if (error) throw error
      return data
    },
    enabled: !!ranchoId,
  })
}

export function useCreateWeight() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (pesaje: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("pesajes")
        .insert(pesaje)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["weights", data.animal_id] })
      queryClient.invalidateQueries({ queryKey: ["ranch-weights", data.rancho_id] })
      queryClient.invalidateQueries({ queryKey: ["animal", data.animal_id] })
      toast.success("Pesaje registrado")
    },
    onError: (error: Error) => toast.error("Error: " + error.message),
  })
}

export function useCreateBatchWeights() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (pesajes: Record<string, unknown>[]) => {
      const { data, error } = await supabase
        .from("pesajes")
        .insert(pesajes)
        .select()
      if (error) throw error
      return data
    },
    onSuccess: (data: any) => {
      if (data?.[0]) {
        queryClient.invalidateQueries({ queryKey: ["ranch-weights", data[0].rancho_id] })
      }
      toast.success(`${data?.length || 0} pesajes registrados`)
    },
    onError: (error: Error) => toast.error("Error: " + error.message),
  })
}
