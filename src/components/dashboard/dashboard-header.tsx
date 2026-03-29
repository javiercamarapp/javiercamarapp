'use client'

import { CloudSun, MapPin } from 'lucide-react'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos dias'
  if (hour < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

function formatDate(): string {
  return new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {getGreeting()}, Juan
        </h1>
        <p className="text-sm text-muted-foreground capitalize">{formatDate()}</p>
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-white border border-border px-3 py-2 text-sm text-muted-foreground">
        <CloudSun className="h-5 w-5 text-amber-500" />
        <div>
          <span className="font-medium text-foreground">28°C</span>
          <span className="mx-1">·</span>
          <span>Parcialmente nublado</span>
        </div>
        <span className="hidden sm:inline text-xs">
          <MapPin className="inline h-3 w-3 mr-0.5" />
          Aguascalientes
        </span>
      </div>
    </div>
  )
}
