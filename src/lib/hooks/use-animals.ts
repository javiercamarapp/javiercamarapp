'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { AnimalFormData } from '@/lib/validations/animal'

const supabase = createClient()

export function useAnimals(ranchoId: string | null, especie?: string) {
  return useQuery({
    queryKey: ['animals', ranchoId, especie],
    queryFn: async () => {
      if (!ranchoId) return []
      let query = supabase
        .from('animales')
        .select('*')
        .eq('rancho_id', ranchoId)
        .eq('estado', 'activo')
        .order('created_at', { ascending: false })

      if (especie && especie !== 'todos') {
        query = query.eq('especie', especie)
      }

      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
    enabled: !!ranchoId,
  })
}

export function useAnimal(id: string | null) {
  return useQuery({
    queryKey: ['animal', id],
    queryFn: async () => {
      if (!id) return null
      const { data, error } = await supabase
        .from('animales')
        .select('*')
        .eq('id', id)
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
    mutationFn: async (data: AnimalFormData & { rancho_id: string }) => {
      const { data: animal, error } = await supabase
        .from('animales')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return animal
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] })
    },
  })
}

export function useUpdateAnimal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<AnimalFormData>) => {
      const { data: animal, error } = await supabase
        .from('animales')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return animal
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['animals'] })
      queryClient.invalidateQueries({ queryKey: ['animal', variables.id] })
    },
  })
}
