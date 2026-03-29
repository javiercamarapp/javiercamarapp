'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { MovimientoFormData } from '@/lib/validations/animal'

export function useMovimientos(ranchoId: string | null, filters?: { tipo?: string; categoria?: string; fechaDesde?: string; fechaHasta?: string }) {
  return useQuery({
    queryKey: ['movimientos', ranchoId, filters],
    queryFn: async () => {
      if (!ranchoId) return []
      const supabase = createClient()
      let query = supabase
        .from('movimientos_economicos')
        .select('*, animales!animal_id(numero_arete, nombre)')
        .eq('rancho_id', ranchoId)
        .order('fecha', { ascending: false })

      if (filters?.tipo) {
        query = query.eq('tipo', filters.tipo)
      }
      if (filters?.categoria) {
        query = query.eq('categoria', filters.categoria)
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

export function useMovimiento(id: string | null) {
  return useQuery({
    queryKey: ['movimiento', id],
    queryFn: async () => {
      if (!id) return null
      const supabase = createClient()
      const { data, error } = await supabase
        .from('movimientos_economicos')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useCreateMovimiento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: MovimientoFormData & { rancho_id: string }) => {
      const supabase = createClient()
      const { data: movimiento, error } = await supabase
        .from('movimientos_economicos')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return movimiento
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movimientos'] })
    },
  })
}

export function useUpdateMovimiento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<MovimientoFormData>) => {
      const supabase = createClient()
      const { data: movimiento, error } = await supabase
        .from('movimientos_economicos')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return movimiento
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['movimientos'] })
      queryClient.invalidateQueries({ queryKey: ['movimiento', variables.id] })
    },
  })
}

export function useDeleteMovimiento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('movimientos_economicos')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movimientos'] })
    },
  })
}

export function useResumenEconomico(ranchoId: string | null, periodo?: { desde: string; hasta: string }) {
  return useQuery({
    queryKey: ['resumenEconomico', ranchoId, periodo],
    queryFn: async () => {
      if (!ranchoId) return { ingresos: 0, egresos: 0, balance: 0 }
      const supabase = createClient()
      let query = supabase
        .from('movimientos_economicos')
        .select('tipo, monto')
        .eq('rancho_id', ranchoId)

      if (periodo?.desde) {
        query = query.gte('fecha', periodo.desde)
      }
      if (periodo?.hasta) {
        query = query.lte('fecha', periodo.hasta)
      }

      const { data, error } = await query
      if (error) throw error

      const ingresos = (data ?? [])
        .filter((m) => m.tipo === 'ingreso')
        .reduce((sum, m) => sum + m.monto, 0)
      const egresos = (data ?? [])
        .filter((m) => m.tipo === 'egreso')
        .reduce((sum, m) => sum + m.monto, 0)

      return { ingresos, egresos, balance: ingresos - egresos }
    },
    enabled: !!ranchoId,
  })
}
