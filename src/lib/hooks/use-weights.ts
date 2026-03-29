'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { PesajeFormData } from '@/lib/validations/animal'

const supabase = createClient()

export function usePesajes(ranchoId: string | null, animalId?: string) {
  return useQuery({
    queryKey: ['pesajes', ranchoId, animalId],
    queryFn: async () => {
      if (!ranchoId) return []
      let query = supabase
        .from('pesajes')
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

export function useCreatePesaje() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: PesajeFormData & { rancho_id: string }) => {
      const { data: pesaje, error } = await supabase
        .from('pesajes')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return pesaje
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pesajes'] })
      queryClient.invalidateQueries({ queryKey: ['animals'] })
    },
  })
}

export function useUpdatePesaje() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<PesajeFormData>) => {
      const { data: pesaje, error } = await supabase
        .from('pesajes')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return pesaje
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pesajes'] })
    },
  })
}

export function useDeletePesaje() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pesajes')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pesajes'] })
    },
  })
}
