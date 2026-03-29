'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bot, Brain, Bell, Loader2, CheckCircle2, Truck, Calendar } from 'lucide-react'

const AGENTS = [
  {
    id: 'daily-digest',
    nombre: 'Resumen Semanal AI',
    descripcion: 'Genera un resumen inteligente de todo lo que paso en tu rancho esta semana. Acciones urgentes, logros, y predicciones.',
    icon: Calendar,
    endpoint: '/api/ai/agents/daily-digest',
    frecuencia: 'Semanal (lunes 7am)',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    id: 'auto-alerts',
    nombre: 'Alertas Automaticas AI',
    descripcion: 'Analiza tus datos y genera alertas: partos proximos, vacunas pendientes, animales improductivos, pesajes atrasados.',
    icon: Bell,
    endpoint: '/api/ai/agents/auto-alerts',
    frecuencia: 'Diario (6am)',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    id: 'guia-transito',
    nombre: 'Pre-Guia de Transito REEMO',
    descripcion: 'Genera automaticamente el pre-formato de guia de transito con datos SINIIGA y estatus sanitario de cada animal.',
    icon: Truck,
    endpoint: '/api/ai/agents/guia-transito',
    frecuencia: 'Bajo demanda',
    color: 'text-green-600 bg-green-50',
  },
]

export default function AgentesPage() {
  const [running, setRunning] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, any>>({})

  const runAgent = async (agent: typeof AGENTS[0]) => {
    setRunning(agent.id)
    try {
      const res = await fetch(agent.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rancho_id: 'demo' }),
      })
      const data = await res.json()
      setResults(prev => ({ ...prev, [agent.id]: data }))
    } catch {
      setResults(prev => ({ ...prev, [agent.id]: { error: 'Error ejecutando agente' } }))
    } finally {
      setRunning(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          Agentes AI Autonomos
        </h1>
        <p className="text-muted-foreground text-sm">
          Agentes inteligentes que trabajan por ti -- analizan, alertan, y automatizan procesos de papel
        </p>
      </div>

      <div className="grid gap-4">
        {AGENTS.map((agent) => {
          const Icon = agent.icon
          const result = results[agent.id]
          const isRunning = running === agent.id

          return (
            <Card key={agent.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${agent.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-lg">{agent.nombre}</h3>
                      <Badge variant="outline">{agent.frecuencia}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{agent.descripcion}</p>

                    <Button
                      onClick={() => runAgent(agent)}
                      disabled={isRunning}
                      size="sm"
                    >
                      {isRunning ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Ejecutando...</>
                      ) : result ? (
                        <><CheckCircle2 className="h-4 w-4 mr-2" />Ejecutar de nuevo</>
                      ) : (
                        <><Brain className="h-4 w-4 mr-2" />Ejecutar ahora</>
                      )}
                    </Button>

                    {result && !result.error && (
                      <div className="mt-3 bg-muted/50 rounded-lg p-3 text-sm">
                        <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(result, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-dashed">
        <CardContent className="pt-6 text-center text-muted-foreground">
          <Bot className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Proximamente: mas agentes</p>
          <p className="text-sm mt-1">
            Facturacion automatica - Solicitud de credito FIRA - Reporte SENASICA - Certificado sanitario
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
