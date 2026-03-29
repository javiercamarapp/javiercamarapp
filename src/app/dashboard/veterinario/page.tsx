'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Stethoscope, Send, AlertTriangle, Clock, Pill, Shield, Loader2 } from 'lucide-react'
import { SPECIES_CONFIG, type SpeciesKey } from '@/lib/species/config'

interface Diagnostico {
  diagnostico_probable: string
  confianza: string
  explicacion: string
  tratamiento_sugerido: string
  urgencia: string
  necesita_veterinario: boolean
  prevencion: string
}

export default function VeterinarioPage() {
  const [mensaje, setMensaje] = useState('')
  const [especie, setEspecie] = useState<string>('bovino')
  const [loading, setLoading] = useState(false)
  const [diagnostico, setDiagnostico] = useState<Diagnostico | null>(null)
  const [historial, setHistorial] = useState<Array<{ pregunta: string; respuesta: Diagnostico }>>([])

  const handleConsultar = async () => {
    if (!mensaje.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/ai/veterinary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje, especie }),
      })
      const data = await res.json()
      setDiagnostico(data)
      setHistorial((prev) => [...prev, { pregunta: mensaje, respuesta: data }])
      setMensaje('')
    } catch {
      setDiagnostico(null)
    } finally {
      setLoading(false)
    }
  }

  const urgenciaColor: Record<string, string> = {
    inmediata: 'bg-red-100 text-red-800 border-red-200',
    '24h': 'bg-amber-100 text-amber-800 border-amber-200',
    esta_semana: 'bg-blue-100 text-blue-800 border-blue-200',
    no_urgente: 'bg-green-100 text-green-800 border-green-200',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-primary" />
          Veterinario AI
        </h1>
        <p className="text-muted-foreground text-sm">
          Describe los síntomas de tu animal y recibe un diagnóstico preliminar con IA
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={especie} onValueChange={setEspecie}>
                <SelectTrigger>
                  <SelectValue placeholder="Especie" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SPECIES_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.emoji} {config.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Textarea
            placeholder="Describe los síntomas... Ej: Mi vaca tiene diarrea desde ayer, no quiere comer, y tiene temperatura alta"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            rows={3}
          />
          <Button onClick={handleConsultar} disabled={loading || !mensaje.trim()} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            {loading ? 'Analizando síntomas...' : 'Consultar Veterinario AI'}
          </Button>
        </CardContent>
      </Card>

      {diagnostico && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{diagnostico.diagnostico_probable}</CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className={urgenciaColor[diagnostico.urgencia] || ''}>
                  <Clock className="h-3 w-3 mr-1" />
                  {diagnostico.urgencia}
                </Badge>
                <Badge variant="outline">
                  Confianza: {diagnostico.confianza}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium flex items-center gap-1 mb-1">
                <AlertTriangle className="h-4 w-4" /> Explicación
              </h4>
              <p className="text-sm text-muted-foreground">{diagnostico.explicacion}</p>
            </div>
            <div>
              <h4 className="font-medium flex items-center gap-1 mb-1">
                <Pill className="h-4 w-4" /> Tratamiento sugerido
              </h4>
              <p className="text-sm text-muted-foreground">{diagnostico.tratamiento_sugerido}</p>
            </div>
            <div>
              <h4 className="font-medium flex items-center gap-1 mb-1">
                <Shield className="h-4 w-4" /> Prevención
              </h4>
              <p className="text-sm text-muted-foreground">{diagnostico.prevencion}</p>
            </div>
            {diagnostico.necesita_veterinario && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                <strong>⚠️ Importante:</strong> Esta condición requiere atención de un Médico Veterinario Zootecnista presencial. La IA no sustituye al veterinario.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {historial.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Historial de consultas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {historial.slice(0, -1).reverse().map((item, i) => (
                <div key={i} className="border-b pb-3 last:border-0">
                  <p className="text-sm font-medium">{item.pregunta}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Diagnóstico: {item.respuesta.diagnostico_probable} ({item.respuesta.urgencia})
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
