"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAnimals } from "@/hooks/use-animals"
import { useWeights, useCreateWeight } from "@/hooks/use-weights"
import { toast } from "sonner"
import { useMemo } from "react"

const pesajeSchema = z.object({
  animal_id: z.string().min(1, "Selecciona un animal"),
  peso: z.coerce.number().min(0.1, "El peso es requerido"),
  fecha: z.string().min(1, "La fecha es requerida"),
  tipo_pesaje: z.string().optional(),
  condicion_corporal: z.coerce.number().min(1).max(5).optional(),
  alzada_cm: z.coerce.number().min(0).optional(),
  notas: z.string().optional(),
})

type PesajeFormValues = z.infer<typeof pesajeSchema>

interface PesajeFormProps {
  ranchoId: string
  defaultAnimalId?: string
  onSuccess?: () => void
}

export function PesajeForm({ ranchoId, defaultAnimalId, onSuccess }: PesajeFormProps) {
  const createWeight = useCreateWeight()
  const { data: animals } = useAnimals(ranchoId)

  const form = useForm<PesajeFormValues>({
    resolver: zodResolver(pesajeSchema),
    defaultValues: {
      animal_id: defaultAnimalId || "",
      fecha: new Date().toISOString().split("T")[0],
    },
  })

  const selectedAnimalId = form.watch("animal_id")
  const { data: previousWeights } = useWeights(selectedAnimalId)

  const lastWeight = useMemo(() => {
    if (!previousWeights || previousWeights.length === 0) return null
    return previousWeights[previousWeights.length - 1]
  }, [previousWeights])

  const currentPeso = form.watch("peso")
  const gdpPreview = useMemo(() => {
    if (!lastWeight || !currentPeso) return null
    const lastDate = new Date(lastWeight.fecha)
    const currentDate = new Date(form.watch("fecha") || new Date())
    const diffDays = Math.max(1, Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)))
    const gdp = (currentPeso - lastWeight.peso) / diffDays
    return { gdp: gdp.toFixed(3), days: diffDays, diff: (currentPeso - lastWeight.peso).toFixed(1) }
  }, [lastWeight, currentPeso, form.watch("fecha")])

  const onSubmit = async (values: PesajeFormValues) => {
    createWeight.mutate(
      { ...values, rancho_id: ranchoId },
      {
        onSuccess: () => {
          toast.success("Pesaje registrado exitosamente")
          form.reset({ fecha: new Date().toISOString().split("T")[0], animal_id: "" })
          onSuccess?.()
        },
      }
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Registrar pesaje</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Animal *</Label>
            <Select
              value={form.watch("animal_id")}
              onValueChange={(v) => form.setValue("animal_id", v)}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Buscar animal por arete o nombre..." />
              </SelectTrigger>
              <SelectContent>
                {animals?.map((a: any) => (
                  <SelectItem key={a.id} value={a.id} className="h-12">
                    {a.numero_arete} - {a.nombre || "Sin nombre"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.animal_id && (
              <p className="text-sm text-destructive">{form.formState.errors.animal_id.message}</p>
            )}
          </div>

          {lastWeight && (
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                Ultimo peso: <span className="font-semibold text-foreground">{lastWeight.peso} kg</span>
                {" "}({lastWeight.fecha})
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="peso">Peso (kg) *</Label>
            <Input
              id="peso"
              type="number"
              step="0.1"
              placeholder="0.0"
              className="h-20 text-4xl text-center font-bold"
              {...form.register("peso")}
            />
            {form.formState.errors.peso && (
              <p className="text-sm text-destructive">{form.formState.errors.peso.message}</p>
            )}
          </div>

          {gdpPreview && (
            <div className="rounded-lg bg-muted/50 p-4 space-y-1">
              <p className="text-sm font-medium">Vista previa GDP</p>
              <p className="text-lg font-bold">
                {Number(gdpPreview.gdp) >= 0 ? "+" : ""}{gdpPreview.gdp} kg/dia
              </p>
              <p className="text-sm text-muted-foreground">
                {gdpPreview.diff} kg en {gdpPreview.days} dias
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                className="h-12"
                {...form.register("fecha")}
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de pesaje</Label>
              <Select
                value={form.watch("tipo_pesaje") || ""}
                onValueChange={(v) => form.setValue("tipo_pesaje", v)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rutina" className="h-12">Rutina</SelectItem>
                  <SelectItem value="nacimiento" className="h-12">Nacimiento</SelectItem>
                  <SelectItem value="destete" className="h-12">Destete</SelectItem>
                  <SelectItem value="ajuste_205" className="h-12">Ajuste 205 dias</SelectItem>
                  <SelectItem value="ajuste_365" className="h-12">Ajuste 365 dias</SelectItem>
                  <SelectItem value="venta" className="h-12">Venta</SelectItem>
                  <SelectItem value="compra" className="h-12">Compra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Condicion corporal (1-5)</Label>
              <Select
                value={form.watch("condicion_corporal")?.toString() || ""}
                onValueChange={(v) => form.setValue("condicion_corporal", parseInt(v))}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={n.toString()} className="h-12">
                      {n} - {["Emaciado", "Delgado", "Optimo", "Gordo", "Obeso"][n - 1]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alzada_cm">Alzada (cm)</Label>
              <Input
                id="alzada_cm"
                type="number"
                step="0.1"
                placeholder="0.0"
                className="h-12"
                {...form.register("alzada_cm")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas">Notas</Label>
            <Textarea
              id="notas"
              placeholder="Observaciones..."
              {...form.register("notas")}
            />
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full h-12 text-base"
        disabled={createWeight.isPending}
      >
        {createWeight.isPending ? "Guardando..." : "Registrar pesaje"}
      </Button>
    </form>
  )
}
