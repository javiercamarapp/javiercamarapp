'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

// =============================================
// Apiarios
// =============================================

export function useApiarios(ranchoId: string | null) {
  return useQuery({
    queryKey: ['apiarios', ranchoId],
    queryFn: async () => {
      if (!ranchoId) return []
      const supabase = createClient()
      const { data, error } = await supabase
        .from('apiarios')
        .select('*')
        .eq('rancho_id', ranchoId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data ?? []
    },
    enabled: !!ranchoId,
  })
}

export function useApiario(id: string | null) {
  return useQuery({
    queryKey: ['apiario', id],
    queryFn: async () => {
      if (!id) return null
      const supabase = createClient()
      const { data, error } = await supabase
        .from('apiarios')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useCreateApiario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      rancho_id: string
      nombre: string
      ubicacion_lat?: number
      ubicacion_lng?: number
      ubicacion_referencia?: string
      municipio?: string
      vegetacion_predominante?: string[]
      distancia_agua?: string
      tipo_acceso?: string
      certificacion_organica?: boolean
      certificadora?: string
      notas?: string
    }) => {
      const supabase = createClient()
      const { data: apiario, error } = await supabase
        .from('apiarios')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return apiario
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiarios'] })
    },
  })
}

export function useUpdateApiario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; [key: string]: unknown }) => {
      const supabase = createClient()
      const { data: apiario, error } = await supabase
        .from('apiarios')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return apiario
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['apiarios'] })
      queryClient.invalidateQueries({ queryKey: ['apiario', variables.id] })
    },
  })
}

// =============================================
// Colmenas
// =============================================

export function useColmenas(apiarioId: string | null, ranchoId?: string | null) {
  return useQuery({
    queryKey: ['colmenas', apiarioId, ranchoId],
    queryFn: async () => {
      if (!apiarioId && !ranchoId) return []
      const supabase = createClient()
      let query = supabase
        .from('colmenas')
        .select('*, apiarios!apiario_id(nombre)')
        .order('numero', { ascending: true })

      if (apiarioId) {
        query = query.eq('apiario_id', apiarioId)
      }
      if (ranchoId) {
        query = query.eq('rancho_id', ranchoId)
      }

      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
    enabled: !!apiarioId || !!ranchoId,
  })
}

export function useColmena(id: string | null) {
  return useQuery({
    queryKey: ['colmena', id],
    queryFn: async () => {
      if (!id) return null
      const supabase = createClient()
      const { data, error } = await supabase
        .from('colmenas')
        .select('*, apiarios!apiario_id(nombre)')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useCreateColmena() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      apiario_id: string
      rancho_id: string
      numero: string
      tipo?: string
      especie_abeja?: string
      raza_reina?: string
      color_marcaje_reina?: string
      origen?: string
      estado?: string
      fortaleza?: string
      notas?: string
    }) => {
      const supabase = createClient()
      const { data: colmena, error } = await supabase
        .from('colmenas')
        .insert({
          ...data,
          especie_abeja: data.especie_abeja ?? 'apis_mellifera',
        })
        .select()
        .single()
      if (error) throw error
      return colmena
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colmenas'] })
      queryClient.invalidateQueries({ queryKey: ['apiarios'] })
    },
  })
}

export function useUpdateColmena() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; [key: string]: unknown }) => {
      const supabase = createClient()
      const { data: colmena, error } = await supabase
        .from('colmenas')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return colmena
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['colmenas'] })
      queryClient.invalidateQueries({ queryKey: ['colmena', variables.id] })
    },
  })
}

// =============================================
// Revisiones de Colmena
// =============================================

export function useRevisionesColmena(colmenaId: string | null) {
  return useQuery({
    queryKey: ['revisionesColmena', colmenaId],
    queryFn: async () => {
      if (!colmenaId) return []
      const supabase = createClient()
      const { data, error } = await supabase
        .from('revisiones_colmena')
        .select('*')
        .eq('colmena_id', colmenaId)
        .order('fecha', { ascending: false })

      if (error) throw error
      return data ?? []
    },
    enabled: !!colmenaId,
  })
}

export function useCreateRevisionColmena() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      colmena_id: string
      rancho_id: string
      fecha: string
      inspector?: string
      reina_vista?: boolean
      postura?: string
      cuadros_cria?: number
      cuadros_miel?: number
      cuadros_polen?: number
      temperamento?: string
      celdas_reales?: boolean
      varroa_conteo?: number
      varroa_metodo?: string
      enfermedades_observadas?: string[]
      alimentacion_artificial?: string
      alimentacion_cantidad?: string
      notas?: string
    }) => {
      const supabase = createClient()
      const { data: revision, error } = await supabase
        .from('revisiones_colmena')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return revision
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revisionesColmena'] })
      queryClient.invalidateQueries({ queryKey: ['colmenas'] })
    },
  })
}

// =============================================
// Cosechas de Miel
// =============================================

export function useCosechasMiel(ranchoId: string | null, apiarioId?: string) {
  return useQuery({
    queryKey: ['cosechasMiel', ranchoId, apiarioId],
    queryFn: async () => {
      if (!ranchoId) return []
      const supabase = createClient()
      let query = supabase
        .from('cosechas_miel')
        .select('*, apiarios!apiario_id(nombre)')
        .eq('rancho_id', ranchoId)
        .order('fecha', { ascending: false })

      if (apiarioId) {
        query = query.eq('apiario_id', apiarioId)
      }

      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
    enabled: !!ranchoId,
  })
}

export function useCreateCosechaMiel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      apiario_id: string
      rancho_id: string
      fecha: string
      colmena_id?: string
      alzas_cosechadas?: number
      kg_miel_bruto?: number
      kg_miel_neto?: number
      kg_cera?: number
      kg_polen?: number
      gramos_propoleo?: number
      tipo_floral?: string
      humedad_pct?: number
      color?: string
      calidad?: string
      certificacion_organica?: boolean
      precio_kg?: number
      comprador?: string
      notas?: string
    }) => {
      const supabase = createClient()
      const { data: cosecha, error } = await supabase
        .from('cosechas_miel')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return cosecha
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cosechasMiel'] })
    },
  })
}
