'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save, Camera } from 'lucide-react'
import Link from 'next/link'
import { SPECIES_CONFIG, SPECIES_LIST, type SpeciesKey } from '@/lib/species/config'

const CORRALES_DEMO = [
  { id: '1', nombre: 'Corral Principal' },
  { id: '2', nombre: 'Potrero Norte' },
  { id: '3', nombre: 'Potrero Sur' },
  { id: '4', nombre: 'Corral de Manejo' },
  { id: '5', nombre: 'Paridero' },
]

export default function NuevoAnimalPage() {
  const [especie, setEspecie] = useState<SpeciesKey | ''>('')
  const speciesConfig = especie ? SPECIES_CONFIG[especie] : null

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/inventario">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Registrar nuevo animal</h1>
          <p className="text-muted-foreground text-sm">
            Completa los datos del animal
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          alert('Guardado (demo)')
        }}
        className="space-y-4"
      >
        {/* Especie */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Especie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {SPECIES_LIST.map((sp) => (
                <button
                  key={sp.key}
                  type="button"
                  onClick={() => setEspecie(sp.key)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ${
                    especie === sp.key
                      ? 'border-primary bg-primary/5'
                      : 'border-transparent bg-muted/50 hover:bg-muted'
                  }`}
                >
                  <span className="text-2xl">{sp.emoji}</span>
                  <span className="text-xs font-medium">{sp.nombre}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Identificacion */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Identificacion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="numero_arete">Numero de arete *</Label>
              <Input
                id="numero_arete"
                placeholder="Ej: 484-0-2601234001"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre (opcional)</Label>
              <Input id="nombre" placeholder="Ej: La Negra" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo *</Label>
                <Select required>
                  <SelectTrigger id="sexo">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="macho">Macho</SelectItem>
                    <SelectItem value="hembra">Hembra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select disabled={!speciesConfig}>
                  <SelectTrigger id="categoria">
                    <SelectValue
                      placeholder={
                        speciesConfig
                          ? 'Seleccionar'
                          : 'Selecciona especie primero'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {speciesConfig?.categorias.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Raza y produccion */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Raza y produccion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="raza">Raza</Label>
              <Select disabled={!speciesConfig}>
                <SelectTrigger id="raza">
                  <SelectValue
                    placeholder={
                      speciesConfig
                        ? 'Seleccionar raza'
                        : 'Selecciona especie primero'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {speciesConfig?.razas.map((raza) => (
                    <SelectItem key={raza} value={raza}>
                      {raza}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_produccion">Tipo de produccion</Label>
              <Select disabled={!speciesConfig}>
                <SelectTrigger id="tipo_produccion">
                  <SelectValue
                    placeholder={
                      speciesConfig
                        ? 'Seleccionar tipo'
                        : 'Selecciona especie primero'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {speciesConfig?.tipos_produccion.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo.charAt(0).toUpperCase() + tipo.slice(1).replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Datos fisicos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Datos fisicos y origen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
                <Input id="fecha_nacimiento" type="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="peso_actual">Peso actual (kg)</Label>
                <Input
                  id="peso_actual"
                  type="number"
                  placeholder="Ej: 450"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="origen">Origen</Label>
              <Select>
                <SelectTrigger id="origen">
                  <SelectValue placeholder="Seleccionar origen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nacido_rancho">Nacido en el rancho</SelectItem>
                  <SelectItem value="comprado">Comprado</SelectItem>
                  <SelectItem value="donado">Donado</SelectItem>
                  <SelectItem value="intercambio">Intercambio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="corral">Corral / Potrero</Label>
              <Select>
                <SelectTrigger id="corral">
                  <SelectValue placeholder="Seleccionar corral" />
                </SelectTrigger>
                <SelectContent>
                  {CORRALES_DEMO.map((corral) => (
                    <SelectItem key={corral.id} value={corral.id}>
                      {corral.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Foto */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Foto del animal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Camera className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                Toca para tomar o seleccionar una foto
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG. Maximo 5 MB.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Notas adicionales sobre el animal..."
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 pt-2 pb-4">
          <Link href="/inventario" className="flex-1">
            <Button type="button" variant="outline" className="w-full">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Guardar animal
          </Button>
        </div>
      </form>
    </div>
  )
}
