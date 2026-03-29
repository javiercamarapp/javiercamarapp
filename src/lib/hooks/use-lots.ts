'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { LoteFormData, ProduccionLoteFormData } from '@/lib/validations/animal'

// =============================================
// Lotes
// =============================================

export function useLotes(ranchoId: string | null, especie?: string) {
  return useQuery({
    queryKey: ['lotes', ranchoId, especie],
    queryFn: async () => {
      if (!ranchoId) return []
      const supabase = createClient()
      let query = supabase
        .from('lotes')
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

export function useLote(id: string | null) {
  return useQuery({
    queryKey: ['lote', id],
    queryFn: async () => {
      if (!id) return null
      const supabase = createClient()
      const { data, error } = await supabase
        .from('lotes')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useCreateLote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: LoteFormData & { rancho_id: string }) => {
      const supabase = createClient()
      const { data: lote, error } = await supabase
        .from('lotes')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return lote
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotes'] })
    },
  })
}

export function useUpdateLote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<LoteFormData>) => {
      const supabase = createClient()
      const { data: lote, error } = await supabase
        .from('lotes')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return lote
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lotes'] })
      queryClient.invalidateQueries({ queryKey: ['lote', variables.id] })
    },
  })
}

// =============================================
// Produccion de Lotes
// =============================================

export function useProduccionLote(loteId: string | null, ranchoId?: string | null) {
  return useQuery({
    queryKey: ['produccionLote', loteId, ranchoId],
    queryFn: async () => {
      if (!loteId) return []
      const supabase = createClient()
      let query = supabase
        .from('produccion_lotes')
        .select('*')
        .eq('lote_id', loteId)
        .order('fecha', { ascending: false })

      if (ranchoId) {
        query = query.eq('rancho_id', ranchoId)
      }

      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
    enabled: !!loteId,
  })
}

export function useCreateProduccionLote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: ProduccionLoteFormData & { rancho_id: string }) => {
      const supabase = createClient()
      const { data: produccion, error } = await supabase
        .from('produccion_lotes')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return produccion
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produccionLote'] })
      queryClient.invalidateQueries({ queryKey: ['lotes'] })
    },
  })
}

export function useUpdateProduccionLote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<ProduccionLoteFormData>) => {
      const supabase = createClient()
      const { data: produccion, error } = await supabase
        .from('produccion_lotes')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return produccion
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produccionLote'] })
    },
  })
}
