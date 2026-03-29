'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export function useAlertas(ranchoId: string | null, soloNoLeidas?: boolean) {
  return useQuery({
    queryKey: ['alertas', ranchoId, soloNoLeidas],
    queryFn: async () => {
      if (!ranchoId) return []
      let query = supabase
        .from('alertas')
        .select('*')
        .eq('rancho_id', ranchoId)
        .order('created_at', { ascending: false })

      if (soloNoLeidas) {
        query = query.eq('leida', false)
      }

      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
    enabled: !!ranchoId,
  })
}

export function useAlertasCount(ranchoId: string | null) {
  return useQuery({
    queryKey: ['alertasCount', ranchoId],
    queryFn: async () => {
      if (!ranchoId) return 0
      const { count, error } = await supabase
        .from('alertas')
        .select('*', { count: 'exact', head: true })
        .eq('rancho_id', ranchoId)
        .eq('leida', false)

      if (error) throw error
      return count ?? 0
    },
    enabled: !!ranchoId,
    refetchInterval: 60000, // Refetch every minute
  })
}

export function useMarcarAlertaLeida() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('alertas')
        .update({ leida: true })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] })
      queryClient.invalidateQueries({ queryKey: ['alertasCount'] })
    },
  })
}

export function useMarcarTodasLeidas() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ranchoId: string) => {
      const { error } = await supabase
        .from('alertas')
        .update({ leida: true })
        .eq('rancho_id', ranchoId)
        .eq('leida', false)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] })
      queryClient.invalidateQueries({ queryKey: ['alertasCount'] })
    },
  })
}

export function useCreateAlerta() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      rancho_id: string
      animal_id?: string
      lote_id?: string
      colmena_id?: string
      tipo?: string
      mensaje: string
      prioridad?: string
      generada_por?: string
      fecha_alerta?: string
      accion_sugerida?: string
    }) => {
      const { data: alerta, error } = await supabase
        .from('alertas')
        .insert({
          ...data,
          prioridad: data.prioridad ?? 'media',
          generada_por: data.generada_por ?? 'usuario',
        })
        .select()
        .single()
      if (error) throw error
      return alerta
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] })
      queryClient.invalidateQueries({ queryKey: ['alertasCount'] })
    },
  })
}
