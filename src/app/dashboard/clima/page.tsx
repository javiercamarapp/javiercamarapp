'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CloudSun, Droplets, Wind, Thermometer, AlertTriangle, Sun, CloudRain, Milk } from 'lucide-react'
import { calculateTHI, getTHICategory, estimateMilkLoss } from '@/lib/utils/heat-stress'

const WEATHER_DATA = {
  ubicacion: 'Tizimin, Yucatan',
  actual: {
    temperatura: 34,
    sensacion: 38,
    humedad: 78,
    viento: 12,
    condicion: 'Parcialmente nublado',
    uv: 9,
  },
  pronostico: [
    { dia: 'Hoy', max: 36, min: 24, condicion: 'Soleado', lluvia: 10, icono: 'sol' },
    { dia: 'Mar', max: 35, min: 23, condicion: 'Nublado', lluvia: 30, icono: 'nublado' },
    { dia: 'Mie', max: 33, min: 22, condicion: 'Lluvias', lluvia: 80, icono: 'lluvia' },
    { dia: 'Jue', max: 32, min: 22, condicion: 'Lluvias', lluvia: 70, icono: 'lluvia' },
    { dia: 'Vie', max: 34, min: 23, condicion: 'Soleado', lluvia: 15, icono: 'sol' },
  ],
  alertas_ganaderas: [
    {
      tipo: 'calor',
      severidad: 'alta',
      mensaje: 'Indice de calor de 38C -- Riesgo de estres calorico en bovinos. Asegura sombra y agua fresca.',
      accion: 'Mover ganado a potreros con sombra antes de las 11am',
    },
    {
      tipo: 'lluvia',
      severidad: 'media',
      mensaje: 'Lluvias esperadas miercoles-jueves. Temporada de garrapatas se intensifica.',
      accion: 'Programar bano garrapaticida para el viernes',
    },
    {
      tipo: 'pasto',
      severidad: 'baja',
      mensaje: 'Las lluvias mejoraran el forraje en 7-10 dias. NDVI proyectado: +15%.',
      accion: 'Reducir suplementacion la proxima semana',
    },
  ],
}

const iconoClima: Record<string, React.ReactNode> = {
  sol: <Sun className="h-8 w-8 text-amber-500" />,
  nublado: <CloudSun className="h-8 w-8 text-gray-400" />,
  lluvia: <CloudRain className="h-8 w-8 text-blue-500" />,
}

const severidadColor: Record<string, string> = {
  alta: 'border-red-500 bg-red-50',
  media: 'border-amber-500 bg-amber-50',
  baja: 'border-green-500 bg-green-50',
}

export default function ClimaPage() {
  const w = WEATHER_DATA
  const thi = calculateTHI(w.actual.temperatura, w.actual.humedad)
  const thiCategory = getTHICategory(thi)
  const baseMilkLiters = 20 // Produccion base promedio litros/dia
  const milkLoss = estimateMilkLoss(thi, baseMilkLiters)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CloudSun className="h-6 w-6 text-primary" />
          Clima y Alertas Ganaderas
        </h1>
        <p className="text-muted-foreground text-sm">{w.ubicacion} -- Actualizado hace 30 min</p>
      </div>

      {/* Current weather */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Thermometer className="h-8 w-8 mx-auto text-red-500 mb-2" />
            <p className="text-3xl font-bold">{w.actual.temperatura}C</p>
            <p className="text-xs text-muted-foreground">Sensacion {w.actual.sensacion}C</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Droplets className="h-8 w-8 mx-auto text-blue-500 mb-2" />
            <p className="text-3xl font-bold">{w.actual.humedad}%</p>
            <p className="text-xs text-muted-foreground">Humedad</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Wind className="h-8 w-8 mx-auto text-gray-500 mb-2" />
            <p className="text-3xl font-bold">{w.actual.viento} km/h</p>
            <p className="text-xs text-muted-foreground">Viento</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Sun className="h-8 w-8 mx-auto text-amber-500 mb-2" />
            <p className="text-3xl font-bold">UV {w.actual.uv}</p>
            <p className="text-xs text-muted-foreground">Muy alto</p>
          </CardContent>
        </Card>
      </div>

      {/* THI - Heat Stress Index */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-orange-500" />
            Índice de Estrés Calórico (THI)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center">
              <p className={`text-5xl font-bold ${thiCategory.color}`}>{thi}</p>
              <Badge className={`mt-2 ${
                thiCategory.nivel === 'Normal' ? 'bg-green-100 text-green-700' :
                thiCategory.nivel === 'Alerta' ? 'bg-yellow-100 text-yellow-700' :
                thiCategory.nivel === 'Peligro' ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                {thiCategory.nivel}
              </Badge>
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-sm">{thiCategory.descripcion}</p>
              <div className="bg-primary/5 border border-primary/20 rounded p-2 text-sm">
                <span className="font-medium text-primary">Accion recomendada:</span>{' '}
                {thiCategory.accion}
              </div>
              {milkLoss > 0 && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded p-2 text-sm">
                  <Milk className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>
                    Pérdida estimada de leche: <strong className="text-amber-700">-{milkLoss} L/día</strong> por vaca
                    (base {baseMilkLiters} L/día → {(baseMilkLiters - milkLoss).toFixed(1)} L/día)
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-1 text-xs text-center">
            <div className="bg-green-100 rounded-l p-1">Normal &lt;72</div>
            <div className="bg-yellow-100 p-1">Alerta 72-78</div>
            <div className="bg-orange-100 p-1">Peligro 79-88</div>
            <div className="bg-red-100 rounded-r p-1">Emergencia 89+</div>
          </div>
        </CardContent>
      </Card>

      {/* 5-day forecast */}
      <Card>
        <CardHeader><CardTitle className="text-base">Pronostico 5 dias</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2 text-center text-sm">
            {w.pronostico.map((d) => (
              <div key={d.dia} className="space-y-1">
                <p className="font-medium">{d.dia}</p>
                <div className="flex justify-center">{iconoClima[d.icono]}</div>
                <p className="font-bold">{d.max}/{d.min}</p>
                <div className="flex items-center justify-center gap-1 text-xs text-blue-600">
                  <Droplets className="h-3 w-3" />{d.lluvia}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Livestock-specific alerts */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Alertas Ganaderas por Clima
        </h2>
        <div className="space-y-3">
          {w.alertas_ganaderas.map((alerta, i) => (
            <Card key={i} className={`border-l-4 ${severidadColor[alerta.severidad]}`}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{alerta.mensaje}</p>
                    <p className="text-sm text-primary mt-1 font-medium">-- {alerta.accion}</p>
                  </div>
                  <Badge variant="outline">{alerta.severidad}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
