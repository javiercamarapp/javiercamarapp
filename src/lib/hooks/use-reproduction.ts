'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { ReproEventFormData } from '@/lib/validations/animal'

export function useReproEvents(ranchoId: string | null, animalId?: string) {
  return useQuery({
    queryKey: ['reproEvents', ranchoId, animalId],
    queryFn: async () => {
      if (!ranchoId) return []
      const supabase = createClient()
      let query = supabase
        .from('eventos_reproductivos')
        .select('*, animales!animal_id(numero_arete, nombre)')
        .eq('rancho_id', ranchoId)
        .order('fecha', { ascending: false })

      if (animalId) {
        query = query.eq('animal_id', animalId)
      }

      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
    enabled: !!ranchoId,
  })
}

export function useReproEvent(id: string | null) {
  return useQuery({
    queryKey: ['reproEvent', id],
    queryFn: async () => {
      if (!id) return null
      const supabase = createClient()
      const { data, error } = await supabase
        .from('eventos_reproductivos')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useCreateReproEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: ReproEventFormData & { rancho_id: string }) => {
      const supabase = createClient()
      const { data: event, error } = await supabase
        .from('eventos_reproductivos')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return event
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reproEvents'] })
      queryClient.invalidateQueries({ queryKey: ['animals'] })
    },
  })
}

export function useUpdateReproEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<ReproEventFormData>) => {
      const supabase = createClient()
      const { data: event, error } = await supabase
        .from('eventos_reproductivos')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return event
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reproEvents'] })
      queryClient.invalidateQueries({ queryKey: ['reproEvent', variables.id] })
    },
  })
}
