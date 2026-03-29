'use client'

import { createClient } from '@/lib/supabase/client'

export async function saveOnboardingData(data: {
  nombre: string
  telefono?: string
  email?: string
  nombreRancho: string
  estado: string
  municipio: string
  superficie?: number
  especies: string[]
  corrales: Array<{ nombre: string; tipo: string }>
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  // Update profile
  const { error: profileError } = await supabase
    .from('perfiles')
    .update({
      nombre: data.nombre,
      telefono: data.telefono || null,
      email: data.email || user.email,
      onboarding_completado: true,
    })
    .eq('id', user.id)

  if (profileError) throw profileError

  // Create ranch
  const { data: ranch, error: ranchError } = await supabase
    .from('ranchos')
    .insert({
      nombre: data.nombreRancho,
      estado: data.estado,
      municipio: data.municipio,
      superficie_ha: data.superficie || null,
      especies_activas: data.especies,
    })
    .select()
    .single()

  if (ranchError) throw ranchError

  // Link user to ranch
  await supabase.from('rancho_usuarios').insert({
    rancho_id: ranch.id,
    user_id: user.id,
    rol: 'propietario',
  })

  // Create corrales
  if (data.corrales.length > 0) {
    const corralesData = data.corrales
      .filter(c => c.nombre.trim())
      .map(c => ({
        rancho_id: ranch.id,
        nombre: c.nombre,
        tipo: c.tipo,
      }))
    if (corralesData.length > 0) {
      await supabase.from('corrales').insert(corralesData)
    }
  }

  return ranch
}
