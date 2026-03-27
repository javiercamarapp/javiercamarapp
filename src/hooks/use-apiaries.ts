"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const supabase = createClient()

export function useApiaries(ranchoId: string) {
  return useQuery({
    queryKey: ["apiaries", ranchoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apiarios")
        .select("*")
        .eq("rancho_id", ranchoId)
        .order("nombre")
      if (error) throw error
      return data
    },
    enabled: !!ranchoId,
  })
}

export function useHives(apiarioId: string) {
  return useQuery({
    queryKey: ["hives", apiarioId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("colmenas")
        .select("*")
        .eq("apiario_id", apiarioId)
        .order("numero")
      if (error) throw error
      return data
    },
    enabled: !!apiarioId,
  })
}

export function useHiveInspections(colmenaId: string) {
  return useQuery({
    queryKey: ["hive-inspections", colmenaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("revisiones_colmena")
        .select("*")
        .eq("colmena_id", colmenaId)
        .order("fecha", { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!colmenaId,
  })
}

export function useHoneyHarvests(ranchoId: string) {
  return useQuery({
    queryKey: ["honey-harvests", ranchoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cosechas_miel")
        .select("*, apiarios(nombre)")
        .eq("rancho_id", ranchoId)
        .order("fecha", { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!ranchoId,
  })
}

export function useCreateHiveInspection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (inspection: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("revisiones_colmena")
        .insert(inspection)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["hive-inspections", data.colmena_id] })
      toast.success("Revisión registrada")
    },
    onError: (error: Error) => toast.error("Error: " + error.message),
  })
}
