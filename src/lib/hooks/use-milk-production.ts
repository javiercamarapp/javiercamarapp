'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { ProduccionLecheFormData } from '@/lib/validations/animal'

const supabase = createClient()

export function useProduccionLeche(ranchoId: string | null, filters?: { animalId?: string; fechaDesde?: string; fechaHasta?: string }) {
  return useQuery({
    queryKey: ['produccionLeche', ranchoId, filters],
    queryFn: async () => {
      if (!ranchoId) return []
      let query = supabase
        .from('produccion_leche')
        .select('*, animales!animal_id(numero_arete, nombre)')
        .eq('rancho_id', ranchoId)
        .order('fecha', { ascending: false })

      if (filters?.animalId) {
        query = query.eq('animal_id', filters.animalId)
      }
      if (filters?.fechaDesde) {
        query = query.gte('fecha', filters.fechaDesde)
      }
      if (filters?.fechaHasta) {
        query = query.lte('fecha', filters.fechaHasta)
      }

      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
    enabled: !!ranchoId,
  })
}

export function useCreateProduccionLeche() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: ProduccionLecheFormData & { rancho_id: string }) => {
      const { data: produccion, error } = await supabase
        .from('produccion_leche')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return produccion
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produccionLeche'] })
    },
  })
}

export function useUpdateProduccionLeche() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<ProduccionLecheFormData>) => {
      const { data: produccion, error } = await supabase
        .from('produccion_leche')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return produccion
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produccionLeche'] })
    },
  })
}

export function useDeleteProduccionLeche() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('produccion_leche')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produccionLeche'] })
    },
  })
}

export function useResumenLecheDiario(ranchoId: string | null, fecha?: string) {
  return useQuery({
    queryKey: ['resumenLecheDiario', ranchoId, fecha],
    queryFn: async () => {
      if (!ranchoId) return { total: 0, registros: 0 }
      const targetDate = fecha ?? new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('produccion_leche')
        .select('litros_total')
        .eq('rancho_id', ranchoId)
        .eq('fecha', targetDate)

      if (error) throw error
      const total = (data ?? []).reduce((sum, r) => sum + r.litros_total, 0)
      return { total, registros: data?.length ?? 0 }
    },
    enabled: !!ranchoId,
  })
}
