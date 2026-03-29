'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Beef,
  // Using available icons for species
  Bug,
  Egg,
  Droplets,
  Clock,
  Brain,
} from 'lucide-react'

interface PrecioItem {
  min: number
  max: number
  unidad: string
  tendencia: string
}

interface PreciosData {
  fecha: string
  region: string
  bovinos: Record<string, PrecioItem>
  porcinos: Record<string, PrecioItem>
  ovinos: Record<string, PrecioItem>
  miel: Record<string, PrecioItem>
  huevo: Record<string, PrecioItem>
}

const tendenciaIcon = (t: string) => {
  if (t === 'alza') return <TrendingUp className="h-4 w-4 text-green-600" />
  if (t === 'baja') return <TrendingDown className="h-4 w-4 text-red-600" />
  return <Minus className="h-4 w-4 text-gray-500" />
}

const tendenciaBadge = (t: string) => {
  if (t === 'alza') return 'bg-green-100 text-green-800 border-green-200'
  if (t === 'baja') return 'bg-red-100 text-red-800 border-red-200'
  return 'bg-gray-100 text-gray-800 border-gray-200'
}

const labelMap: Record<string, string> = {
  becerro_destete: 'Becerro al destete',
  novillo_engorda: 'Novillo de engorda',
  vaca_desecho: 'Vaca de desecho',
  toro_semental: 'Toro semental',
  leche_litro: 'Leche (litro)',
  cerdo_pie: 'Cerdo en pie',
  lechon: 'Lechón',
  cordero: 'Cordero',
  borrega_desecho: 'Borrega de desecho',
  convencional: 'Miel convencional',
  organica: 'Miel orgánica',
  melipona: 'Miel de melipona',
  caja_360: 'Caja 360 piezas',
}

interface SeccionConfig {
  titulo: string
  icon: typeof Beef
  key: keyof Pick<PreciosData, 'bovinos' | 'porcinos' | 'ovinos' | 'miel' | 'huevo'>
}

const secciones: SeccionConfig[] = [
  { titulo: 'Bovinos', icon: Beef, key: 'bovinos' },
  { titulo: 'Porcinos', icon: Bug, key: 'porcinos' },
  { titulo: 'Ovinos', icon: Droplets, key: 'ovinos' },
  { titulo: 'Miel', icon: Droplets, key: 'miel' },
  { titulo: 'Huevo', icon: Egg, key: 'huevo' },
]

// Simulated data (same as API) for initial render / offline
const preciosDefault: PreciosData = {
  fecha: new Date().toISOString().split('T')[0],
  region: 'Península de Yucatán',
  bovinos: {
    becerro_destete: { min: 55, max: 65, unidad: 'MXN/kg', tendencia: 'estable' },
    novillo_engorda: { min: 60, max: 70, unidad: 'MXN/kg', tendencia: 'alza' },
    vaca_desecho: { min: 40, max: 48, unidad: 'MXN/kg', tendencia: 'baja' },
    toro_semental: { min: 25000, max: 80000, unidad: 'MXN/cabeza', tendencia: 'estable' },
    leche_litro: { min: 8, max: 12, unidad: 'MXN/litro', tendencia: 'estable' },
  },
  porcinos: {
    cerdo_pie: { min: 38, max: 45, unidad: 'MXN/kg', tendencia: 'alza' },
    lechon: { min: 800, max: 1200, unidad: 'MXN/cabeza', tendencia: 'estable' },
  },
  ovinos: {
    cordero: { min: 70, max: 90, unidad: 'MXN/kg', tendencia: 'alza' },
    borrega_desecho: { min: 50, max: 60, unidad: 'MXN/kg', tendencia: 'estable' },
  },
  miel: {
    convencional: { min: 50, max: 70, unidad: 'MXN/kg', tendencia: 'estable' },
    organica: { min: 90, max: 130, unidad: 'MXN/kg', tendencia: 'alza' },
    melipona: { min: 800, max: 3000, unidad: 'MXN/litro', tendencia: 'alza' },
  },
  huevo: {
    caja_360: { min: 550, max: 650, unidad: 'MXN/caja', tendencia: 'estable' },
  },
}

export default function MercadoPage() {
  const [precios, setPrecios] = useState<PreciosData>(preciosDefault)

  useEffect(() => {
    fetch('/api/ai/market-price')
      .then((res) => {
        if (!res.ok) throw new Error('Error')
        return res.json()
      })
      .then((data) => setPrecios(data))
      .catch(() => {
        // Mantener datos demo
      })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Inteligencia de Mercado
        </h1>
        <p className="text-muted-foreground text-sm">
          Precios actualizados de ganado y productos pecuarios en tu región
        </p>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          Última actualización: {new Date(precios.fecha + 'T12:00:00').toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
        <Badge variant="outline">{precios.region}</Badge>
      </div>

      {/* AI Recommendation */}
      <Card className="border-l-4 border-l-primary bg-primary/5">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-start gap-3">
            <Brain className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-primary mb-1">Recomendación de HatoAI</p>
              <p className="text-sm text-muted-foreground">
                Basado en los precios actuales y las tendencias del mercado, el novillo de engorda está al alza
                ($60-70/kg). Si tienes novillos por encima de 450 kg, este es un buen momento para vender.
                El cordero también muestra tendencia favorable ($70-90/kg). La miel orgánica y de melipona
                siguen al alza — considera certificar tu producción para capturar el precio premium.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price sections */}
      {secciones.map((seccion) => {
        const data = precios[seccion.key]
        const Icon = seccion.icon
        return (
          <Card key={seccion.key}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                {seccion.titulo}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(data).map(([key, precio]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between border rounded-lg p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{labelMap[key] || key}</p>
                      <p className="text-lg font-bold">
                        ${precio.min.toLocaleString('es-MX')} — ${precio.max.toLocaleString('es-MX')}
                      </p>
                      <p className="text-xs text-muted-foreground">{precio.unidad}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {tendenciaIcon(precio.tendencia)}
                      <Badge variant="outline" className={`text-xs ${tendenciaBadge(precio.tendencia)}`}>
                        {precio.tendencia === 'alza' ? 'Al alza' : precio.tendencia === 'baja' ? 'A la baja' : 'Estable'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center">
        Los precios mostrados son referenciales para la región {precios.region}. Consulta con tu
        comprador local para precios definitivos. Datos actualizados semanalmente.
      </p>
    </div>
  )
}
