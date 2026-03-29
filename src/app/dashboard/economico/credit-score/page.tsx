'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ShieldCheck } from 'lucide-react'

const variables = [
  { nombre: 'Completitud de datos', valor: 85, color: 'text-green-600' },
  { nombre: 'Regularidad de registros', valor: 70, color: 'text-blue-600' },
  { nombre: 'Productividad', valor: 65, color: 'text-amber-600' },
  { nombre: 'Financiero', valor: 80, color: 'text-green-600' },
  { nombre: 'Antigüedad', valor: 50, color: 'text-amber-600' },
  { nombre: 'Sanitario', valor: 90, color: 'text-green-600' },
  { nombre: 'Tamaño del hato', valor: 60, color: 'text-amber-600' },
]

export default function CreditScorePage() {
  const score = 72

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Credit Score Ganadero</h1>
        <p className="text-muted-foreground">
          Puntuación de confiabilidad para acceso a crédito
        </p>
      </div>

      {/* Score Circle */}
      <Card>
        <CardContent className="pt-6 flex flex-col items-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="16"
              />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke={score >= 70 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 502.65} 502.65`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold">{score}</span>
              <span className="text-muted-foreground text-sm">de 100</span>
            </div>
          </div>
          <p className="text-lg font-medium mt-4 text-green-600">Buen puntaje</p>
          <p className="text-sm text-muted-foreground text-center max-w-md mt-1">
            Tu rancho tiene un buen historial. Mejora la antigüedad y el tamaño del hato para subir tu puntuación.
          </p>
        </CardContent>
      </Card>

      {/* Variables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            Variables del Score
          </CardTitle>
          <CardDescription>
            Estos 7 factores determinan tu puntuación crediticia ganadera
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {variables.map((v) => (
            <div key={v.nombre} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{v.nombre}</span>
                <span className={`font-bold ${v.color}`}>{v.valor}%</span>
              </div>
              <Progress value={v.valor} className="h-2.5" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
