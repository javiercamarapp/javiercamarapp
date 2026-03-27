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
import { useCorrales } from "@/hooks/use-ranch"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

const loteSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  especie: z.enum(["ave", "conejo"], { required_error: "Selecciona la especie" }),
  tipo: z.string().min(1, "El tipo es requerido"),
  raza: z.string().optional(),
  linea_genetica: z.string().optional(),
  cantidad_inicial: z.coerce.number().int().min(1, "La cantidad es requerida"),
  fecha_ingreso: z.string().min(1, "La fecha de ingreso es requerida"),
  fecha_nacimiento_lote: z.string().optional(),
  galpon_id: z.string().optional(),
  proveedor: z.string().optional(),
  precio_por_ave: z.coerce.number().min(0).optional(),
  programa_vacunacion_inicial: z.string().optional(),
  notas: z.string().optional(),
})

type LoteFormValues = z.infer<typeof loteSchema>

interface LoteFormProps {
  ranchoId: string
  onSuccess?: () => void
}

function useCreateLot() {
  const queryClient = useQueryClient()
  const supabase = createClient()
  return useMutation({
    mutationFn: async (lote: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("lotes")
        .insert(lote)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["lots", data.rancho_id] })
      toast.success("Lote registrado exitosamente")
    },
    onError: (error: Error) => toast.error("Error al registrar: " + error.message),
  })
}

const TIPOS_AVE = [
  { value: "postura", label: "Postura" },
  { value: "engorda", label: "Engorda" },
  { value: "reproductoras", label: "Reproductoras" },
  { value: "doble_proposito", label: "Doble proposito" },
  { value: "guajolotes", label: "Guajolotes" },
]

const TIPOS_CONEJO = [
  { value: "engorda", label: "Engorda" },
  { value: "reproductoras", label: "Reproductoras" },
  { value: "doble_proposito", label: "Doble proposito" },
]

export function LoteForm({ ranchoId, onSuccess }: LoteFormProps) {
  const createLot = useCreateLot()
  const { data: corrales } = useCorrales(ranchoId)

  const form = useForm<LoteFormValues>({
    resolver: zodResolver(loteSchema),
    defaultValues: {
      fecha_ingreso: new Date().toISOString().split("T")[0],
    },
  })

  const selectedSpecies = form.watch("especie")
  const tipos = selectedSpecies === "conejo" ? TIPOS_CONEJO : TIPOS_AVE

  const onSubmit = async (values: LoteFormValues) => {
    createLot.mutate(
      {
        ...values,
        rancho_id: ranchoId,
        cantidad_actual: values.cantidad_inicial,
        estado: "activo",
      },
      {
        onSuccess: () => {
          form.reset()
          onSuccess?.()
        },
      }
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Datos del lote</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del lote *</Label>
              <Input
                id="nombre"
                placeholder="Ej: Lote Postura 2026-A"
                className="h-12"
                {...form.register("nombre")}
              />
              {form.formState.errors.nombre && (
                <p className="text-sm text-destructive">{form.formState.errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Especie *</Label>
              <Select
                value={form.watch("especie") || ""}
                onValueChange={(v) => {
                  form.setValue("especie", v as "ave" | "conejo")
                  form.setValue("tipo", "")
                }}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar especie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ave" className="h-12">Ave</SelectItem>
                  <SelectItem value="conejo" className="h-12">Conejo</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.especie && (
                <p className="text-sm text-destructive">{form.formState.errors.especie.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tipo *</Label>
              <Select
                value={form.watch("tipo") || ""}
                onValueChange={(v) => form.setValue("tipo", v)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tipos.map((t) => (
                    <SelectItem key={t.value} value={t.value} className="h-12">
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.tipo && (
                <p className="text-sm text-destructive">{form.formState.errors.tipo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="raza">Raza</Label>
              <Input
                id="raza"
                placeholder="Ej: ISA Brown"
                className="h-12"
                {...form.register("raza")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linea_genetica">Linea genetica</Label>
              <Input
                id="linea_genetica"
                placeholder="Linea genetica"
                className="h-12"
                {...form.register("linea_genetica")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cantidad_inicial">Cantidad inicial *</Label>
              <Input
                id="cantidad_inicial"
                type="number"
                placeholder="0"
                className="h-12"
                {...form.register("cantidad_inicial")}
              />
              {form.formState.errors.cantidad_inicial && (
                <p className="text-sm text-destructive">{form.formState.errors.cantidad_inicial.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_ingreso">Fecha de ingreso *</Label>
              <Input
                id="fecha_ingreso"
                type="date"
                className="h-12"
                {...form.register("fecha_ingreso")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_nacimiento_lote">Fecha de nacimiento del lote</Label>
              <Input
                id="fecha_nacimiento_lote"
                type="date"
                className="h-12"
                {...form.register("fecha_nacimiento_lote")}
              />
            </div>

            <div className="space-y-2">
              <Label>Galpon / Corral</Label>
              <Select
                value={form.watch("galpon_id") || ""}
                onValueChange={(v) => form.setValue("galpon_id", v)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar galpon" />
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

            <div className="space-y-2">
              <Label htmlFor="proveedor">Proveedor</Label>
              <Input
                id="proveedor"
                placeholder="Nombre del proveedor"
                className="h-12"
                {...form.register("proveedor")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio_por_ave">Precio por unidad ($)</Label>
              <Input
                id="precio_por_ave"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="h-12"
                {...form.register("precio_por_ave")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="programa_vacunacion_inicial">Programa de vacunacion inicial</Label>
            <Textarea
              id="programa_vacunacion_inicial"
              placeholder="Detalle del programa de vacunacion aplicado..."
              {...form.register("programa_vacunacion_inicial")}
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
        disabled={createLot.isPending}
      >
        {createLot.isPending ? "Guardando..." : "Registrar lote"}
      </Button>
    </form>
  )
}
