"use client"

import { useState, useCallback } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAnimals } from "@/hooks/use-animals"
import { useCorrales } from "@/hooks/use-ranch"
import { useCreateBatchWeights } from "@/hooks/use-weights"
import { toast } from "sonner"

interface WeightEntry {
  animal_id: string
  animal_arete: string
  animal_nombre: string
  peso: number | null
}

interface BatchWeighFormProps {
  ranchoId: string
  onSuccess?: () => void
}

export function BatchWeighForm({ ranchoId, onSuccess }: BatchWeighFormProps) {
  const [selectedCorral, setSelectedCorral] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [entries, setEntries] = useState<WeightEntry[]>([])
  const [currentWeight, setCurrentWeight] = useState("")
  const [started, setStarted] = useState(false)
  const [fecha] = useState(new Date().toISOString().split("T")[0])

  const { data: corrales } = useCorrales(ranchoId)
  const { data: animals } = useAnimals(ranchoId)
  const createBatchWeights = useCreateBatchWeights()

  const corralAnimals = animals?.filter((a: any) => a.corral_id === selectedCorral) || []

  const handleStart = useCallback(() => {
    if (corralAnimals.length === 0) {
      toast.error("No hay animales en este corral")
      return
    }
    const initialEntries: WeightEntry[] = corralAnimals.map((a: any) => ({
      animal_id: a.id,
      animal_arete: a.numero_arete,
      animal_nombre: a.nombre || "Sin nombre",
      peso: null,
    }))
    setEntries(initialEntries)
    setCurrentIndex(0)
    setCurrentWeight("")
    setStarted(true)
  }, [corralAnimals])

  const handleNext = useCallback(() => {
    const peso = parseFloat(currentWeight)
    if (!peso || peso <= 0) {
      toast.error("Ingresa un peso valido")
      return
    }

    const updated = [...entries]
    updated[currentIndex] = { ...updated[currentIndex], peso }
    setEntries(updated)

    if (currentIndex < entries.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setCurrentWeight("")
    }
  }, [currentWeight, entries, currentIndex])

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      const prevEntry = entries[currentIndex - 1]
      setCurrentWeight(prevEntry.peso?.toString() || "")
    }
  }, [currentIndex, entries])

  const handleSkip = useCallback(() => {
    if (currentIndex < entries.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setCurrentWeight("")
    }
  }, [currentIndex, entries.length])

  const completedCount = entries.filter((e) => e.peso !== null).length
  const isLastAnimal = currentIndex === entries.length - 1
  const currentAnimal = entries[currentIndex]

  const handleSaveAll = useCallback(() => {
    // Save current weight if entered
    let finalEntries = [...entries]
    const peso = parseFloat(currentWeight)
    if (peso > 0) {
      finalEntries[currentIndex] = { ...finalEntries[currentIndex], peso }
    }

    const validEntries = finalEntries.filter((e) => e.peso !== null && e.peso > 0)
    if (validEntries.length === 0) {
      toast.error("No hay pesajes para guardar")
      return
    }

    const pesajes = validEntries.map((e) => ({
      animal_id: e.animal_id,
      peso: e.peso,
      fecha,
      rancho_id: ranchoId,
      tipo_pesaje: "rutina",
    }))

    createBatchWeights.mutate(pesajes, {
      onSuccess: () => {
        toast.success(`${validEntries.length} pesajes registrados exitosamente`)
        setStarted(false)
        setEntries([])
        setCurrentIndex(0)
        setCurrentWeight("")
        setSelectedCorral("")
        onSuccess?.()
      },
    })
  }, [entries, currentWeight, currentIndex, fecha, ranchoId, createBatchWeights, onSuccess])

  if (!started) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pesaje en modo manga</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Seleccionar corral</Label>
            <Select value={selectedCorral} onValueChange={setSelectedCorral}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Seleccionar corral" />
              </SelectTrigger>
              <SelectContent>
                {corrales?.map((c: any) => (
                  <SelectItem key={c.id} value={c.id} className="h-12">
                    {c.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCorral && (
            <p className="text-sm text-muted-foreground">
              {corralAnimals.length} animales en este corral
            </p>
          )}

          <Button
            onClick={handleStart}
            disabled={!selectedCorral || corralAnimals.length === 0}
            className="w-full h-14 text-lg"
          >
            Iniciar pesaje
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Progreso</span>
          <span className="text-muted-foreground">
            {completedCount + (parseFloat(currentWeight) > 0 ? 1 : 0)} de {entries.length}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className="bg-[#1B4332] h-3 rounded-full transition-all"
            style={{ width: `${(completedCount / entries.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current animal */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Animal {currentIndex + 1} de {entries.length}</p>
            <p className="text-2xl font-bold mt-1">{currentAnimal?.animal_arete}</p>
            <p className="text-lg text-muted-foreground">{currentAnimal?.animal_nombre}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="peso-batch" className="text-center block text-base">
              Peso (kg)
            </Label>
            <Input
              id="peso-batch"
              type="number"
              step="0.1"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              placeholder="0.0"
              className="h-28 text-5xl text-center font-bold w-full"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  if (isLastAnimal) {
                    handleSaveAll()
                  } else {
                    handleNext()
                  }
                }
              }}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="h-12 flex-1"
            >
              Anterior
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleSkip}
              disabled={isLastAnimal}
              className="h-12"
            >
              Saltar
            </Button>
            {isLastAnimal ? (
              <Button
                type="button"
                onClick={handleSaveAll}
                disabled={createBatchWeights.isPending}
                className="h-14 flex-[2] text-lg bg-[#1B4332] hover:bg-[#1B4332]/90"
              >
                {createBatchWeights.isPending ? "Guardando..." : "GUARDAR TODO"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                className="h-14 flex-[2] text-lg bg-[#1B4332] hover:bg-[#1B4332]/90"
              >
                SIGUIENTE
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary of completed entries */}
      {completedCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pesajes registrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {entries
                .filter((e) => e.peso !== null)
                .map((e, i) => (
                  <div key={i} className="flex justify-between text-sm py-1">
                    <span>{e.animal_arete}</span>
                    <span className="font-medium">{e.peso} kg</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={() => {
          if (completedCount > 0 && confirm("Tienes pesajes sin guardar. Deseas salir?")) {
            setStarted(false)
          } else if (completedCount === 0) {
            setStarted(false)
          }
        }}
        className="w-full h-12"
      >
        Cancelar
      </Button>
    </div>
  )
}
