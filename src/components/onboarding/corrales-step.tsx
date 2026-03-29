'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CorralesStepProps {
  onNext: (data: Record<string, any>) => void
  onBack: () => void
}

const TIPOS_INSTALACION = [
  { value: 'corral', label: 'Corral' },
  { value: 'potrero', label: 'Potrero' },
  { value: 'manga', label: 'Manga' },
  { value: 'enfermeria', label: 'Enfermería' },
  { value: 'maternidad', label: 'Maternidad' },
  { value: 'galpon', label: 'Galpón' },
  { value: 'apiario', label: 'Apiario' },
  { value: 'conejar', label: 'Conejar' },
  { value: 'establo', label: 'Establo' },
]

interface Corral {
  nombre: string
  tipo: string
}

export function CorralesStep({ onNext, onBack }: CorralesStepProps) {
  const [corrales, setCorrales] = useState<Corral[]>([{ nombre: '', tipo: 'corral' }])

  const addCorral = () => {
    setCorrales((prev) => [...prev, { nombre: '', tipo: 'corral' }])
  }

  const removeCorral = (index: number) => {
    setCorrales((prev) => prev.filter((_, i) => i !== index))
  }

  const updateCorral = (index: number, field: keyof Corral, value: string) => {
    setCorrales((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    )
  }

  const handleSubmit = () => {
    const validCorrales = corrales.filter((c) => c.nombre.trim())
    onNext({ corrales: validCorrales })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tus corrales e instalaciones</CardTitle>
        <CardDescription>
          Agrega los corrales, potreros y demás instalaciones de tu rancho. Puedes omitir este paso y
          agregarlos después.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {corrales.map((corral, index) => (
            <div key={index} className="flex items-end gap-3">
              <div className="flex-1 space-y-2">
                <Label htmlFor={`corral-nombre-${index}`}>Nombre</Label>
                <Input
                  id={`corral-nombre-${index}`}
                  placeholder="Ej. Potrero Norte"
                  value={corral.nombre}
                  onChange={(e) => updateCorral(index, 'nombre', e.target.value)}
                />
              </div>
              <div className="w-40 space-y-2">
                <Label htmlFor={`corral-tipo-${index}`}>Tipo</Label>
                <Select
                  value={corral.tipo}
                  onValueChange={(value) => updateCorral(index, 'tipo', value)}
                >
                  <SelectTrigger id={`corral-tipo-${index}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_INSTALACION.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {corrales.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCorral(index)}
                  className="text-destructive hover:text-destructive"
                >
                  ✕
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button type="button" variant="outline" size="sm" onClick={addCorral}>
          + Agregar otro
        </Button>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onBack}>
            Anterior
          </Button>
          <Button onClick={handleSubmit}>Siguiente</Button>
        </div>
      </CardContent>
    </Card>
  )
}
