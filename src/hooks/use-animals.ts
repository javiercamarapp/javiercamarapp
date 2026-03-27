"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const supabase = createClient()

export function useAnimals(ranchoId: string, especie?: string) {
  return useQuery({
    queryKey: ["animals", ranchoId, especie],
    queryFn: async () => {
      let query = supabase
        .from("animales")
        .select("*")
        .eq("rancho_id", ranchoId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
      if (especie) query = query.eq("especie", especie)
      const { data, error } = await query
      if (error) throw error
      return data
    },
    enabled: !!ranchoId,
  })
}

export function useAnimal(id: string) {
  return useQuery({
    queryKey: ["animal", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("animales")
        .select("*, corrales(nombre)")
        .eq("id", id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useCreateAnimal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (animal: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("animales")
        .insert(animal)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["animals", data.rancho_id] })
      toast.success("Animal registrado exitosamente")
    },
    onError: (error: Error) => toast.error("Error al registrar: " + error.message),
  })
}

export function useUpdateAnimal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: Record<string, unknown> & { id: string }) => {
      const { data, error } = await supabase
        .from("animales")
        .update(updates)
        .eq("id", id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["animals", data.rancho_id] })
      queryClient.invalidateQueries({ queryKey: ["animal", data.id] })
      toast.success("Animal actualizado")
    },
    onError: (error: Error) => toast.error("Error: " + error.message),
  })
}
