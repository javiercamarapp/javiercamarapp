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
import { useLots } from "@/hooks/use-lots"
import { useCreateHealthEvent } from "@/hooks/use-health"
import { toast } from "sonner"
import { useState } from "react"

const eventoSanitarioSchema = z.object({
  target_type: z.enum(["animal", "lote", "colmena"]),
  animal_id: z.string().optional(),
  lote_id: z.string().optional(),
  colmena_id: z.string().optional(),
  tipo: z.enum(["vacunacion", "desparasitacion", "tratamiento", "cirugia", "laboratorio"], {
    required_error: "Selecciona el tipo",
  }),
  fecha: z.string().min(1, "La fecha es requerida"),
  producto: z.string().optional(),
  lote_producto: z.string().optional(),
  dosis: z.string().optional(),
  via_aplicacion: z.enum(["SC", "IM", "oral", "nasal", "topica", "IV"]).optional(),
  periodo_retiro_dias: z.coerce.number().int().min(0).optional(),
  diagnostico: z.string().optional(),
  sintomas: z.string().optional(),
  veterinario: z.string().optional(),
  proxima_aplicacion: z.string().optional(),
  costo: z.coerce.number().min(0).optional(),
  notas: z.string().optional(),
}).refine(
  (data) => {
    if (data.target_type === "animal") return !!data.animal_id
    if (data.target_type === "lote") return !!data.lote_id
    if (data.target_type === "colmena") return !!data.colmena_id
    return false
  },
  { message: "Selecciona el objetivo del evento", path: ["target_type"] }
)

type EventoSanitarioFormValues = z.infer<typeof eventoSanitarioSchema>

interface EventoSanitarioFormProps {
  ranchoId: string
  defaultAnimalId?: string
  onSuccess?: () => void
}

export function EventoSanitarioForm({
  ranchoId,
  defaultAnimalId,
  onSuccess,
}: EventoSanitarioFormProps) {
  const [targetType, setTargetType] = useState<"animal" | "lote" | "colmena">(
    defaultAnimalId ? "animal" : "animal"
  )
  const createEvent = useCreateHealthEvent()
  const { data: animals } = useAnimals(ranchoId)
  const { data: lotes } = useLots(ranchoId)

  const form = useForm<EventoSanitarioFormValues>({
    resolver: zodResolver(eventoSanitarioSchema),
    defaultValues: {
      target_type: "animal",
      animal_id: defaultAnimalId || "",
      fecha: new Date().toISOString().split("T")[0],
    },
  })

  const handleTargetChange = (value: "animal" | "lote" | "colmena") => {
    setTargetType(value)
    form.setValue("target_type", value)
    form.setValue("animal_id", "")
    form.setValue("lote_id", "")
    form.setValue("colmena_id", "")
  }

  const onSubmit = async (values: EventoSanitarioFormValues) => {
    createEvent.mutate(
      { ...values, rancho_id: ranchoId },
      {
        onSuccess: () => {
          toast.success("Evento sanitario registrado")
          form.reset({
            target_type: "animal",
            fecha: new Date().toISOString().split("T")[0],
          })
          onSuccess?.()
        },
      }
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Evento sanitario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Target selection */}
          <div className="space-y-2">
            <Label>Aplicar a</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["animal", "lote", "colmena"] as const).map((t) => (
                <Button
                  key={t}
                  type="button"
                  variant={targetType === t ? "default" : "outline"}
                  className="h-12 capitalize"
                  onClick={() => handleTargetChange(t)}
                >
                  {t === "animal" ? "Animal" : t === "lote" ? "Lote" : "Colmena"}
                </Button>
              ))}
            </div>
          </div>

          {targetType === "animal" && (
            <div className="space-y-2">
              <Label>Animal *</Label>
              <Select
                value={form.watch("animal_id") || ""}
                onValueChange={(v) => form.setValue("animal_id", v)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar animal..." />
                </SelectTrigger>
                <SelectContent>
                  {animals?.map((a: any) => (
                    <SelectItem key={a.id} value={a.id} className="h-12">
                      {a.numero_arete} - {a.nombre || "Sin nombre"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {targetType === "lote" && (
            <div className="space-y-2">
              <Label>Lote *</Label>
              <Select
                value={form.watch("lote_id") || ""}
                onValueChange={(v) => form.setValue("lote_id", v)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar lote..." />
                </SelectTrigger>
                <SelectContent>
                  {lotes?.map((l: any) => (
                    <SelectItem key={l.id} value={l.id} className="h-12">
                      {l.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {targetType === "colmena" && (
            <div className="space-y-2">
              <Label>Colmena *</Label>
              <Input
                placeholder="ID de colmena"
                className="h-12"
                {...form.register("colmena_id")}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de evento *</Label>
              <Select
                value={form.watch("tipo") || ""}
                onValueChange={(v) => form.setValue("tipo", v as any)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacunacion" className="h-12">Vacunacion</SelectItem>
                  <SelectItem value="desparasitacion" className="h-12">Desparasitacion</SelectItem>
                  <SelectItem value="tratamiento" className="h-12">Tratamiento</SelectItem>
                  <SelectItem value="cirugia" className="h-12">Cirugia</SelectItem>
                  <SelectItem value="laboratorio" className="h-12">Laboratorio</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.tipo && (
                <p className="text-sm text-destructive">{form.formState.errors.tipo.message}</p>
              )}
            </div>

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
              <Label htmlFor="producto">Producto</Label>
              <Input
                id="producto"
                placeholder="Nombre del producto"
                className="h-12"
                {...form.register("producto")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lote_producto">Lote del producto</Label>
              <Input
                id="lote_producto"
                placeholder="Numero de lote"
                className="h-12"
                {...form.register("lote_producto")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dosis">Dosis</Label>
              <Input
                id="dosis"
                placeholder="Ej: 5 ml"
                className="h-12"
                {...form.register("dosis")}
              />
            </div>

            <div className="space-y-2">
              <Label>Via de aplicacion</Label>
              <Select
                value={form.watch("via_aplicacion") || ""}
                onValueChange={(v) => form.setValue("via_aplicacion", v as any)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar via" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SC" className="h-12">Subcutanea (SC)</SelectItem>
                  <SelectItem value="IM" className="h-12">Intramuscular (IM)</SelectItem>
                  <SelectItem value="oral" className="h-12">Oral</SelectItem>
                  <SelectItem value="nasal" className="h-12">Nasal</SelectItem>
                  <SelectItem value="topica" className="h-12">Topica</SelectItem>
                  <SelectItem value="IV" className="h-12">Intravenosa (IV)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodo_retiro_dias">Periodo de retiro (dias)</Label>
              <Input
                id="periodo_retiro_dias"
                type="number"
                placeholder="0"
                className="h-12"
                {...form.register("periodo_retiro_dias")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="veterinario">Veterinario</Label>
              <Input
                id="veterinario"
                placeholder="Nombre del veterinario"
                className="h-12"
                {...form.register("veterinario")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proxima_aplicacion">Proxima aplicacion</Label>
              <Input
                id="proxima_aplicacion"
                type="date"
                className="h-12"
                {...form.register("proxima_aplicacion")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costo">Costo ($)</Label>
              <Input
                id="costo"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="h-12"
                {...form.register("costo")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnostico">Diagnostico</Label>
            <Textarea
              id="diagnostico"
              placeholder="Diagnostico..."
              {...form.register("diagnostico")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sintomas">Sintomas</Label>
            <Textarea
              id="sintomas"
              placeholder="Sintomas observados..."
              {...form.register("sintomas")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas">Notas</Label>
            <Textarea
              id="notas"
              placeholder="Observaciones adicionales..."
              {...form.register("notas")}
            />
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full h-12 text-base"
        disabled={createEvent.isPending}
      >
        {createEvent.isPending ? "Guardando..." : "Registrar evento sanitario"}
      </Button>
    </form>
  )
}
