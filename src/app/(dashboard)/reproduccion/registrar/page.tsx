'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ClipboardPlus, Save } from 'lucide-react'

const tiposEvento = [
  { value: 'celo', label: 'Celo detectado' },
  { value: 'monta_natural', label: 'Monta natural' },
  { value: 'inseminacion', label: 'Inseminación artificial' },
  { value: 'diagnostico_gestacion', label: 'Diagnóstico de gestación' },
  { value: 'parto', label: 'Parto' },
  { value: 'destete', label: 'Destete' },
  { value: 'aborto', label: 'Aborto' },
]

export default function RegistrarReproduccionPage() {
  const [tipo, setTipo] = useState('')

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardPlus className="h-6 w-6 text-pink-500" />
          Registrar Evento Reproductivo
        </h1>
        <p className="text-muted-foreground">
          Captura un nuevo evento reproductivo para un animal
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Datos del Evento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Animal */}
          <div className="space-y-2">
            <Label htmlFor="animal">Animal</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar animal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vaca-negra">Vaca La Negra</SelectItem>
                <SelectItem value="vaca-pinta">Vaca La Pinta</SelectItem>
                <SelectItem value="marrana-001">Marrana PC-001</SelectItem>
                <SelectItem value="yegua-luna">Yegua Luna</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de evento */}
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de evento</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo de evento" />
              </SelectTrigger>
              <SelectContent>
                {tiposEvento.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fecha */}
          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha del evento</Label>
            <Input type="date" id="fecha" />
          </div>

          {/* Campos condicionales */}
          {(tipo === 'monta_natural' || tipo === 'inseminacion') && (
            <div className="space-y-2">
              <Label htmlFor="semental">
                {tipo === 'inseminacion' ? 'Pajilla / Toro donante' : 'Semental'}
              </Label>
              <Input id="semental" placeholder="Identificación del semental o pajilla" />
            </div>
          )}

          {tipo === 'inseminacion' && (
            <div className="space-y-2">
              <Label htmlFor="tecnico">Técnico inseminador</Label>
              <Input id="tecnico" placeholder="Nombre del técnico" />
            </div>
          )}

          {tipo === 'diagnostico_gestacion' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="resultado">Resultado</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar resultado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="positivo">Positivo (gestante)</SelectItem>
                    <SelectItem value="negativo">Negativo (vacía)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metodo">Método de diagnóstico</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="palpacion">Palpación rectal</SelectItem>
                    <SelectItem value="ultrasonido">Ultrasonido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {tipo === 'parto' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="crias">Número de crías</Label>
                <Input id="crias" type="number" placeholder="1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo_parto">Tipo de parto</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="asistido">Asistido</SelectItem>
                    <SelectItem value="cesarea">Cesárea</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {tipo === 'destete' && (
            <div className="space-y-2">
              <Label htmlFor="peso_destete">Peso al destete (kg)</Label>
              <Input id="peso_destete" type="number" placeholder="180" />
            </div>
          )}

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notas">Notas adicionales</Label>
            <Textarea id="notas" placeholder="Observaciones..." />
          </div>

          <Button className="w-full" size="lg">
            <Save className="h-4 w-4 mr-2" />
            Guardar Evento
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
