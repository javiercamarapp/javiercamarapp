'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface CompletionStepProps {
  data: Record<string, any>
}

export function CompletionStep({ data }: CompletionStepProps) {
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
        <CardTitle className="text-2xl">¡Felicidades!</CardTitle>
        <CardDescription className="text-base">
          Tu cuenta de HatoAI está lista. Ya puedes comenzar a gestionar tu rancho.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary */}
        <div className="rounded-lg border bg-muted/50 p-4 mb-6 space-y-2 text-sm">
          <h3 className="font-semibold text-base mb-3">Resumen de configuración</h3>
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
              <span className="text-muted-foreground">Ubicación:</span> {data.estado}
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
            <Link href="/inventario/nuevo">Registrar tu primer animal</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Ir al dashboard</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
