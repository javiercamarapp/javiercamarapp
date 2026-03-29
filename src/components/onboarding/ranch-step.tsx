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

interface RanchStepProps {
  onNext: (data: Record<string, any>) => void
  onBack: () => void
}

const ESTADOS_MEXICO = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila',
  'Colima',
  'Durango',
  'Estado de México',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas',
]

export function RanchStep({ onNext, onBack }: RanchStepProps) {
  const [nombreRancho, setNombreRancho] = useState('')
  const [estado, setEstado] = useState('')
  const [municipio, setMunicipio] = useState('')
  const [superficie, setSuperficie] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombreRancho.trim()) return
    onNext({
      nombreRancho: nombreRancho.trim(),
      estado,
      municipio: municipio.trim(),
      superficie: superficie ? Number(superficie) : undefined,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tu rancho</CardTitle>
        <CardDescription>
          Registra los datos de tu unidad de producción pecuaria.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombreRancho">Nombre del rancho *</Label>
            <Input
              id="nombreRancho"
              placeholder="Ej. Rancho Los Alamos"
              value={nombreRancho}
              onChange={(e) => setNombreRancho(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger id="estado">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                {ESTADOS_MEXICO.map((est) => (
                  <SelectItem key={est} value={est}>
                    {est}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="municipio">Municipio</Label>
            <Input
              id="municipio"
              placeholder="Ej. Texcoco"
              value={municipio}
              onChange={(e) => setMunicipio(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="superficie">Superficie (hectáreas)</Label>
            <Input
              id="superficie"
              type="number"
              min="0"
              step="0.1"
              placeholder="Ej. 50"
              value={superficie}
              onChange={(e) => setSuperficie(e.target.value)}
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Anterior
            </Button>
            <Button type="submit" disabled={!nombreRancho.trim()}>
              Siguiente
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
