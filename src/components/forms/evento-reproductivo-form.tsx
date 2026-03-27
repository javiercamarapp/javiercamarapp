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
import { useCreateReproductiveEvent } from "@/hooks/use-reproduction"
import { toast } from "sonner"

const eventoReproductivoSchema = z.object({
  animal_id: z.string().min(1, "Selecciona un animal"),
  tipo: z.enum(["celo", "servicio", "diagnostico", "parto", "destete", "secado", "aborto"], {
    required_error: "Selecciona el tipo de evento",
  }),
  fecha: z.string().min(1, "La fecha es requerida"),
  hora: z.string().optional(),
  // Servicio fields
  toro_id: z.string().optional(),
  metodo_servicio: z.string().optional(),
  pajilla_lote: z.string().optional(),
  // Diagnostico fields
  resultado_diagnostico: z.string().optional(),
  metodo_diagnostico: z.string().optional(),
  veterinario: z.string().optional(),
  // Parto fields
  tipo_parto: z.string().optional(),
  num_crias: z.coerce.number().int().min(0).optional(),
  num_crias_vivas: z.coerce.number().int().min(0).optional(),
  // Destete fields
  peso_destete: z.coerce.number().min(0).optional(),
  // General
  notas: z.string().optional(),
})

type EventoReproductivoFormValues = z.infer<typeof eventoReproductivoSchema>

interface EventoReproductivoFormProps {
  ranchoId: string
  defaultAnimalId?: string
  onSuccess?: () => void
}

export function EventoReproductivoForm({
  ranchoId,
  defaultAnimalId,
  onSuccess,
}: EventoReproductivoFormProps) {
  const createEvent = useCreateReproductiveEvent()
  const { data: animals } = useAnimals(ranchoId)

  const females = animals?.filter((a: any) => a.sexo === "hembra") || []
  const males = animals?.filter((a: any) => a.sexo === "macho") || []

  const form = useForm<EventoReproductivoFormValues>({
    resolver: zodResolver(eventoReproductivoSchema),
    defaultValues: {
      animal_id: defaultAnimalId || "",
      fecha: new Date().toISOString().split("T")[0],
    },
  })

  const tipoEvento = form.watch("tipo")

  const onSubmit = async (values: EventoReproductivoFormValues) => {
    createEvent.mutate(
      { ...values, rancho_id: ranchoId },
      {
        onSuccess: () => {
          toast.success("Evento reproductivo registrado")
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
          <CardTitle>Evento reproductivo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hembra *</Label>
              <Select
                value={form.watch("animal_id")}
                onValueChange={(v) => form.setValue("animal_id", v)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar hembra..." />
                </SelectTrigger>
                <SelectContent>
                  {females.map((f: any) => (
                    <SelectItem key={f.id} value={f.id} className="h-12">
                      {f.numero_arete} - {f.nombre || "Sin nombre"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.animal_id && (
                <p className="text-sm text-destructive">{form.formState.errors.animal_id.message}</p>
              )}
            </div>

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
                  <SelectItem value="celo" className="h-12">Celo</SelectItem>
                  <SelectItem value="servicio" className="h-12">Servicio / Monta</SelectItem>
                  <SelectItem value="diagnostico" className="h-12">Diagnostico de gestacion</SelectItem>
                  <SelectItem value="parto" className="h-12">Parto</SelectItem>
                  <SelectItem value="destete" className="h-12">Destete</SelectItem>
                  <SelectItem value="secado" className="h-12">Secado</SelectItem>
                  <SelectItem value="aborto" className="h-12">Aborto</SelectItem>
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
              <Label htmlFor="hora">Hora</Label>
              <Input
                id="hora"
                type="time"
                className="h-12"
                {...form.register("hora")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Servicio conditional fields */}
      {tipoEvento === "servicio" && (
        <Card>
          <CardHeader>
            <CardTitle>Datos del servicio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Toro / Semental</Label>
                <Select
                  value={form.watch("toro_id") || ""}
                  onValueChange={(v) => form.setValue("toro_id", v)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Seleccionar toro..." />
                  </SelectTrigger>
                  <SelectContent>
                    {males.map((m: any) => (
                      <SelectItem key={m.id} value={m.id} className="h-12">
                        {m.numero_arete} - {m.nombre || "Sin nombre"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Metodo de servicio</Label>
                <Select
                  value={form.watch("metodo_servicio") || ""}
                  onValueChange={(v) => form.setValue("metodo_servicio", v)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Seleccionar metodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monta_natural" className="h-12">Monta natural</SelectItem>
                    <SelectItem value="inseminacion_artificial" className="h-12">Inseminacion artificial</SelectItem>
                    <SelectItem value="transferencia_embriones" className="h-12">Transferencia de embriones</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pajilla_lote">Lote de pajilla</Label>
                <Input
                  id="pajilla_lote"
                  placeholder="Numero de lote"
                  className="h-12"
                  {...form.register("pajilla_lote")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diagnostico conditional fields */}
      {tipoEvento === "diagnostico" && (
        <Card>
          <CardHeader>
            <CardTitle>Datos del diagnostico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Resultado</Label>
                <Select
                  value={form.watch("resultado_diagnostico") || ""}
                  onValueChange={(v) => form.setValue("resultado_diagnostico", v)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Seleccionar resultado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="positivo" className="h-12">Positivo (gestante)</SelectItem>
                    <SelectItem value="negativo" className="h-12">Negativo (vacia)</SelectItem>
                    <SelectItem value="dudoso" className="h-12">Dudoso</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Metodo</Label>
                <Select
                  value={form.watch("metodo_diagnostico") || ""}
                  onValueChange={(v) => form.setValue("metodo_diagnostico", v)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Seleccionar metodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="palpacion" className="h-12">Palpacion rectal</SelectItem>
                    <SelectItem value="ultrasonido" className="h-12">Ultrasonido</SelectItem>
                    <SelectItem value="analisis_sangre" className="h-12">Analisis de sangre</SelectItem>
                  </SelectContent>
                </Select>
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parto conditional fields */}
      {tipoEvento === "parto" && (
        <Card>
          <CardHeader>
            <CardTitle>Datos del parto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de parto</Label>
                <Select
                  value={form.watch("tipo_parto") || ""}
                  onValueChange={(v) => form.setValue("tipo_parto", v)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal" className="h-12">Normal</SelectItem>
                    <SelectItem value="distocico" className="h-12">Distocico</SelectItem>
                    <SelectItem value="cesarea" className="h-12">Cesarea</SelectItem>
                    <SelectItem value="asistido" className="h-12">Asistido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="num_crias">Numero de crias</Label>
                <Input
                  id="num_crias"
                  type="number"
                  placeholder="1"
                  className="h-12"
                  {...form.register("num_crias")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="num_crias_vivas">Crias vivas</Label>
                <Input
                  id="num_crias_vivas"
                  type="number"
                  placeholder="1"
                  className="h-12"
                  {...form.register("num_crias_vivas")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Destete conditional fields */}
      {tipoEvento === "destete" && (
        <Card>
          <CardHeader>
            <CardTitle>Datos del destete</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="peso_destete">Peso al destete (kg)</Label>
              <Input
                id="peso_destete"
                type="number"
                step="0.1"
                placeholder="0.0"
                className="h-12"
                {...form.register("peso_destete")}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notas */}
      <Card>
        <CardContent className="pt-6">
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
        {createEvent.isPending ? "Guardando..." : "Registrar evento reproductivo"}
      </Button>
    </form>
  )
}
