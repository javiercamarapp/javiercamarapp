'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { saveOnboardingData } from '@/lib/actions/save-onboarding'
import { useToastNotifications } from '@/lib/hooks/use-toast-notifications'
import { useRanchStore } from '@/lib/store/ranch-store'
import { useAuthStore } from '@/lib/store/auth-store'

interface CompletionStepProps {
  data: Record<string, any>
}

export function CompletionStep({ data }: CompletionStepProps) {
  const router = useRouter()
  const toast = useToastNotifications()
  const setCurrentRanch = useRanchStore((s) => s.setCurrentRanch)
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleGoToDashboard = async () => {
    setSaving(true)
    try {
      const ranch = await saveOnboardingData({
        nombre: data.nombre || '',
        telefono: data.telefono,
        email: data.email,
        nombreRancho: data.nombreRancho || '',
        estado: data.estado || '',
        municipio: data.municipio || '',
        superficie: data.superficie ? Number(data.superficie) : undefined,
        especies: data.especies || [],
        corrales: data.corrales || [],
      })

      // Update local stores
      setCurrentRanch({
        id: ranch.id,
        nombre: ranch.nombre,
        estado: ranch.estado,
        municipio: ranch.municipio,
        especies_activas: ranch.especies_activas || [],
        tipo_produccion: ranch.tipo_produccion || null,
        superficie_ha: ranch.superficie_ha || null,
      })

      if (user) {
        setUser({
          ...user,
          nombre: data.nombre || user.nombre,
          onboarding_completado: true,
        })
      }

      setSaved(true)
      toast.success('Configuracion completa', 'Tu rancho fue creado exitosamente.')
      router.push('/dashboard')
    } catch (err: any) {
      toast.error('Error al guardar', err.message || 'Intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <CardTitle className="text-2xl">Felicidades!</CardTitle>
        <CardDescription className="text-base">
          Tu cuenta de HatoAI esta lista. Ya puedes comenzar a gestionar tu rancho.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary */}
        <div className="rounded-lg border bg-muted/50 p-4 mb-6 space-y-2 text-sm">
          <h3 className="font-semibold text-base mb-3">Resumen de configuracion</h3>
          {data.nombre && (
            <p>
              <span className="text-muted-foreground">Nombre:</span> {data.nombre}
            </p>
          )}
          {data.nombreRancho && (
            <p>
              <span className="text-muted-foreground">Rancho:</span> {data.nombreRancho}
            </p>
          )}
          {data.estado && (
            <p>
              <span className="text-muted-foreground">Ubicacion:</span> {data.estado}
              {data.municipio ? `, ${data.municipio}` : ''}
            </p>
          )}
          {data.superficie && (
            <p>
              <span className="text-muted-foreground">Superficie:</span> {data.superficie} ha
            </p>
          )}
          {data.especies && data.especies.length > 0 && (
            <p>
              <span className="text-muted-foreground">Especies:</span>{' '}
              {data.especies.join(', ')}
            </p>
          )}
          {data.corrales && data.corrales.length > 0 && (
            <p>
              <span className="text-muted-foreground">Instalaciones:</span>{' '}
              {data.corrales.length} registrada{data.corrales.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard/inventario/nuevo">Registrar tu primer animal</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleGoToDashboard}
            disabled={saving || saved}
          >
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {saving ? 'Guardando...' : saved ? 'Guardado!' : 'Ir al dashboard'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
