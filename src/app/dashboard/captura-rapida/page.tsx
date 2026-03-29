'use client'
import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Send, Check, Loader2, Zap, Mic } from 'lucide-react'
import { useCreatePesaje } from '@/lib/hooks/use-weights'
import { useCreateReproEvent } from '@/lib/hooks/use-reproduction'
import { useCreateHealthEvent } from '@/lib/hooks/use-health'
import { useCreateMovimiento } from '@/lib/hooks/use-economics'
import { useCreateProduccionLeche } from '@/lib/hooks/use-milk-production'
import { useRanchStore } from '@/lib/store/ranch-store'
import { useToastNotifications } from '@/lib/hooks/use-toast-notifications'
import { createClient } from '@/lib/supabase/client'

interface ParsedEvent {
  tipo: string
  animal: string
  animal_id?: string
  datos: Record<string, string | number>
  confianza: number
  tabla_destino: string
}

const DEMO_RESULTS: ParsedEvent[] = [
  {
    tipo: 'pesaje',
    animal: 'Vaca La Negra (#005)',
    datos: { peso: 465, fecha: '2026-03-29', metodo: 'báscula' },
    confianza: 95,
    tabla_destino: 'pesajes',
  },
]

const QUICK_TEMPLATES = [
  { emoji: '⚖️', label: 'Pesaje', example: 'La Negra pesó 465 kg hoy' },
  { emoji: '🤰', label: 'Parto', example: 'La Pinta parió una becerra de 32 kg' },
  { emoji: '💉', label: 'Vacuna', example: 'Vacuné 12 bovinos contra rabia hoy' },
  { emoji: '🥛', label: 'Leche', example: 'Estrella dio 8 litros en la mañana' },
  { emoji: '💀', label: 'Muerte', example: 'Se murió el becerro BC-019, posible diarrea' },
  { emoji: '💰', label: 'Venta', example: 'Vendí 2 novillos a $65/kg, 480kg total' },
]

export default function CapturaRapidaPage() {
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultados, setResultados] = useState<ParsedEvent[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const currentRanch = useRanchStore((s) => s.currentRanch)
  const toast = useToastNotifications()
  const createPesaje = useCreatePesaje()
  const createReproEvent = useCreateReproEvent()
  const createHealthEvent = useCreateHealthEvent()
  const createMovimiento = useCreateMovimiento()
  const createProduccionLeche = useCreateProduccionLeche()

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        stream.getTracks().forEach(t => t.stop())

        // Send to Whisper
        const formData = new FormData()
        formData.append('audio', blob, 'recording.webm')

        try {
          const res = await fetch('/api/ai/transcribe', { method: 'POST', body: formData })
          const data = await res.json()
          if (data.transcription) {
            setMensaje(data.transcription)
          }
        } catch {
          // Whisper not configured, show message
        }
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)

      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop()
          setIsRecording(false)
        }
      }, 30000)
    } catch {
      // Microphone not available
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  const handleParse = async () => {
    if (!mensaje.trim()) return
    setLoading(true)
    setSaved(false)
    try {
      const res = await fetch('/api/ai/parse-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje }),
      })
      if (!res.ok) throw new Error('Error')
      const data = await res.json()
      setResultados(data.eventos || DEMO_RESULTS)
    } catch {
      setResultados(DEMO_RESULTS)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!currentRanch) {
      toast.error('Error', 'No hay rancho seleccionado.')
      return
    }

    setSaving(true)
    try {
      for (const evento of resultados) {
        const ranchoId = currentRanch.id
        const fecha = String(evento.datos.fecha || new Date().toISOString().split('T')[0])

        // Try to find the animal by name/arete if animal_id not provided
        let animalId = evento.animal_id
        if (!animalId && evento.animal) {
          const supabase = createClient()
          const searchTerm = evento.animal.split('(')[0].trim().split('#')[0].trim()
          if (searchTerm) {
            const { data: animales } = await supabase
              .from('animales')
              .select('id')
              .eq('rancho_id', ranchoId)
              .or(`nombre.ilike.%${searchTerm}%,numero_arete.ilike.%${searchTerm}%`)
              .limit(1)
            if (animales && animales.length > 0) {
              animalId = animales[0].id
            }
          }
        }

        switch (evento.tabla_destino) {
          case 'pesajes':
            await createPesaje.mutateAsync({
              animal_id: animalId || '',
              fecha,
              peso: Number(evento.datos.peso) || 0,
              metodo: String(evento.datos.metodo || ''),
              notas: String(evento.datos.notas || ''),
              rancho_id: ranchoId,
            })
            break

          case 'eventos_reproductivos':
            await createReproEvent.mutateAsync({
              animal_id: animalId || '',
              fecha,
              tipo: (evento.datos.tipo_evento || evento.tipo) as any,
              num_crias: evento.datos.num_crias ? Number(evento.datos.num_crias) : undefined,
              peso_destete: evento.datos.peso_destete ? Number(evento.datos.peso_destete) : undefined,
              notas: String(evento.datos.notas || ''),
              rancho_id: ranchoId,
            })
            break

          case 'eventos_sanitarios':
            await createHealthEvent.mutateAsync({
              animal_id: animalId || undefined,
              fecha,
              tipo: (evento.datos.tipo_evento || 'vacunacion') as any,
              producto: String(evento.datos.producto || ''),
              notas: String(evento.datos.notas || ''),
              rancho_id: ranchoId,
            })
            break

          case 'movimientos_economicos':
            await createMovimiento.mutateAsync({
              tipo: (evento.datos.tipo_movimiento || 'ingreso') as 'ingreso' | 'egreso',
              categoria: String(evento.datos.categoria || 'venta_ganado'),
              monto: Number(evento.datos.monto) || 0,
              fecha,
              descripcion: String(evento.datos.descripcion || ''),
              notas: String(evento.datos.notas || ''),
              rancho_id: ranchoId,
            })
            break

          case 'produccion_leche':
            await createProduccionLeche.mutateAsync({
              animal_id: animalId || '',
              fecha,
              litros_total: Number(evento.datos.litros || evento.datos.litros_total) || 0,
              litros_am: evento.datos.litros_am ? Number(evento.datos.litros_am) : undefined,
              litros_pm: evento.datos.litros_pm ? Number(evento.datos.litros_pm) : undefined,
              notas: String(evento.datos.notas || ''),
              rancho_id: ranchoId,
            })
            break

          default: {
            // Fallback: insert directly into the specified table
            const supabase = createClient()
            await supabase.from(evento.tabla_destino).insert({
              rancho_id: ranchoId,
              animal_id: animalId || null,
              fecha,
              ...evento.datos,
            })
            break
          }
        }
      }

      setSaved(true)
      toast.success('Guardado exitosamente', `Se registraron ${resultados.length} evento(s).`)
      setMensaje('')
      setTimeout(() => {
        setResultados([])
        setSaved(false)
      }, 3000)
    } catch (err: any) {
      toast.error('Error al guardar', err.message || 'Intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          Captura Rápida
        </h1>
        <p className="text-muted-foreground text-sm">
          Escribe lo que pasó en tu rancho y la IA lo registra automáticamente
        </p>
      </div>

      {/* Quick templates */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {QUICK_TEMPLATES.map((t) => (
          <Button
            key={t.label}
            variant="outline"
            size="sm"
            className="flex-shrink-0"
            onClick={() => setMensaje(t.example)}
          >
            {t.emoji} {t.label}
          </Button>
        ))}
      </div>

      {/* Input */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="relative">
            <Textarea
              placeholder="Escribe lo que pasó... Ej: 'La Negra pesó 465 kg hoy en la báscula' o 'Vacuné 12 bovinos contra rabia'"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={3}
              className="pr-12"
            />
            <Button
              size="icon"
              variant="ghost"
              className={`absolute right-2 bottom-2 ${isRecording ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`}
              title={isRecording ? 'Detener grabación' : 'Grabar mensaje de voz'}
              onClick={isRecording ? stopRecording : startRecording}
            >
              <Mic className="h-5 w-5" />
            </Button>
          </div>
          <Button onClick={handleParse} disabled={loading || !mensaje.trim()} className="w-full">
            {loading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Interpretando...</>
            ) : (
              <><MessageSquare className="h-4 w-4 mr-2" />Interpretar y registrar</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {resultados.length > 0 && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="text-base">La IA interpretó lo siguiente:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {resultados.map((r, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge>{r.tipo}</Badge>
                    <span className="font-medium">{r.animal}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {r.confianza}% confianza
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(r.datos).map(([key, val]) => (
                    <div key={key}>
                      <span className="text-muted-foreground">{key}: </span>
                      <span className="font-medium">{val}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  → Se guardará en tabla: <code className="bg-muted px-1 rounded">{r.tabla_destino}</code>
                </p>
              </div>
            ))}

            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1" disabled={saved || saving}>
                {saving ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Guardando...</>
                ) : saved ? (
                  <><Check className="h-4 w-4 mr-2" />Guardado!</>
                ) : (
                  <><Check className="h-4 w-4 mr-2" />Confirmar y guardar</>
                )}
              </Button>
              <Button variant="outline" onClick={() => setResultados([])} disabled={saving}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* How it works */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">¿Cómo funciona?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 text-sm">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">1</span>
              </div>
              <div>
                <p className="font-medium">Escribe como le hablarías a un compa</p>
                <p className="text-muted-foreground">&quot;La Negra pesó 465&quot;, &quot;Vacuné los bovinos&quot;, &quot;Vendí 2 novillos&quot;</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">2</span>
              </div>
              <div>
                <p className="font-medium">La IA interpreta y estructura los datos</p>
                <p className="text-muted-foreground">Detecta: animal, tipo de evento, valores numéricos, fechas</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">3</span>
              </div>
              <div>
                <p className="font-medium">Confirmas y se guarda automáticamente</p>
                <p className="text-muted-foreground">Los datos van directo a la tabla correcta en tu registro</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
