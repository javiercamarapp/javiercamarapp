'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SPECIES_CONFIG } from '@/lib/species/config'
import type { SpeciesKey } from '@/lib/species/config'

interface SpeciesStepProps {
  onNext: (data: Record<string, any>) => void
  onBack: () => void
}

export function SpeciesStep({ onNext, onBack }: SpeciesStepProps) {
  const [selected, setSelected] = useState<SpeciesKey[]>([])

  const toggleSpecies = (key: SpeciesKey) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    )
  }

  const handleSubmit = () => {
    if (selected.length === 0) return
    onNext({ especies: selected })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tus especies</CardTitle>
        <CardDescription>
          Selecciona las especies que manejas en tu rancho. Puedes elegir más de una.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(Object.entries(SPECIES_CONFIG) as [SpeciesKey, typeof SPECIES_CONFIG[SpeciesKey]][]).map(
            ([key, config]) => {
              const isSelected = selected.includes(key)
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleSpecies(key)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-lg border-2 p-4 transition-colors hover:bg-accent ${
                    isSelected
                      ? 'border-green-600 bg-green-50 dark:bg-green-950'
                      : 'border-muted'
                  }`}
                >
                  <span className="text-3xl">{config.emoji}</span>
                  <span className="text-sm font-medium">{config.nombre}</span>
                  {isSelected && (
                    <span className="text-xs text-green-600 font-medium">Seleccionado</span>
                  )}
                </button>
              )
            }
          )}
        </div>

        {selected.length === 0 && (
          <p className="text-sm text-muted-foreground text-center mb-4">
            Selecciona al menos una especie para continuar.
          </p>
        )}

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Anterior
          </Button>
          <Button onClick={handleSubmit} disabled={selected.length === 0}>
            Siguiente
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
