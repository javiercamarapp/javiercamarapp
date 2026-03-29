'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { HealthEventFormData } from '@/lib/validations/animal'

export function useHealthEvents(ranchoId: string | null, filters?: { animalId?: string; loteId?: string; colmenaId?: string; tipo?: string }) {
  return useQuery({
    queryKey: ['healthEvents', ranchoId, filters],
    queryFn: async () => {
      if (!ranchoId) return []
      const supabase = createClient()
      let query = supabase
        .from('eventos_sanitarios')
        .select('*, animales!animal_id(numero_arete, nombre)')
        .eq('rancho_id', ranchoId)
        .order('fecha', { ascending: false })

      if (filters?.animalId) {
        query = query.eq('animal_id', filters.animalId)
      }
      if (filters?.loteId) {
        query = query.eq('lote_id', filters.loteId)
      }
      if (filters?.colmenaId) {
        query = query.eq('colmena_id', filters.colmenaId)
      }
      if (filters?.tipo) {
        query = query.eq('tipo', filters.tipo)
      }

      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
    enabled: !!ranchoId,
  })
}

export function useHealthEvent(id: string | null) {
  return useQuery({
    queryKey: ['healthEvent', id],
    queryFn: async () => {
      if (!id) return null
      const supabase = createClient()
      const { data, error } = await supabase
        .from('eventos_sanitarios')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useCreateHealthEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: HealthEventFormData & { rancho_id: string }) => {
      const supabase = createClient()
      const { data: event, error } = await supabase
        .from('eventos_sanitarios')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return event
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthEvents'] })
      queryClient.invalidateQueries({ queryKey: ['animals'] })
    },
  })
}

export function useUpdateHealthEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<HealthEventFormData>) => {
      const supabase = createClient()
      const { data: event, error } = await supabase
        .from('eventos_sanitarios')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return event
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['healthEvents'] })
      queryClient.invalidateQueries({ queryKey: ['healthEvent', variables.id] })
    },
  })
}
