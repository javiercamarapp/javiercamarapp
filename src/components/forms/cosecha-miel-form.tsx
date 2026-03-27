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
import { useApiaries, useHives } from "@/hooks/use-apiaries"
import { toast } from "sonner"
import { useMemo, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

const cosechaSchema = z.object({
  apiario_id: z.string().min(1, "Selecciona un apiario"),
  colmena_id: z.string().optional(),
  fecha: z.string().min(1, "La fecha es requerida"),
  kg_miel: z.coerce.number().min(0).optional(),
  kg_cera: z.coerce.number().min(0).optional(),
  kg_polen: z.coerce.number().min(0).optional(),
  kg_propoleo: z.coerce.number().min(0).optional(),
  floracion: z.string().optional(),
  humedad_pct: z.coerce.number().min(0).max(100).optional(),
  color: z.enum(["claro", "ambar", "oscuro"]).optional(),
  comprador: z.string().optional(),
  precio_kg: z.coerce.number().min(0).optional(),
  notas: z.string().optional(),
})

type CosechaFormValues = z.infer<typeof cosechaSchema>

interface CosechaMielFormProps {
  ranchoId: string
  onSuccess?: () => void
}

function useCreateHoneyHarvest() {
  const queryClient = useQueryClient()
  const supabase = createClient()
  return useMutation({
    mutationFn: async (harvest: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from("cosechas_miel")
        .insert(harvest)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["honey-harvests", data.rancho_id] })
      toast.success("Cosecha registrada exitosamente")
    },
    onError: (error: Error) => toast.error("Error al registrar: " + error.message),
  })
}

export function CosechaMielForm({ ranchoId, onSuccess }: CosechaMielFormProps) {
  const [selectedApiario, setSelectedApiario] = useState("")
  const createHarvest = useCreateHoneyHarvest()
  const { data: apiarios } = useApiaries(ranchoId)
  const { data: hives } = useHives(selectedApiario)

  const form = useForm<CosechaFormValues>({
    resolver: zodResolver(cosechaSchema),
    defaultValues: {
      fecha: new Date().toISOString().split("T")[0],
    },
  })

  const kgMiel = form.watch("kg_miel")
  const precioKg = form.watch("precio_kg")

  const ingresoTotal = useMemo(() => {
    if (kgMiel && kgMiel > 0 && precioKg && precioKg > 0) {
      return (kgMiel * precioKg).toFixed(2)
    }
    return null
  }, [kgMiel, precioKg])

  const handleApiarioChange = (value: string) => {
    setSelectedApiario(value)
    form.setValue("apiario_id", value)
    form.setValue("colmena_id", "")
  }

  const onSubmit = async (values: CosechaFormValues) => {
    createHarvest.mutate(
      {
        ...values,
        rancho_id: ranchoId,
        ingreso_total: ingresoTotal ? parseFloat(ingresoTotal) : undefined,
      },
      {
        onSuccess: () => {
          form.reset({ fecha: new Date().toISOString().split("T")[0] })
          setSelectedApiario("")
          onSuccess?.()
        },
      }
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cosecha de miel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Apiario *</Label>
              <Select value={selectedApiario} onValueChange={handleApiarioChange}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar apiario" />
                </SelectTrigger>
                <SelectContent>
                  {apiarios?.map((a: any) => (
                    <SelectItem key={a.id} value={a.id} className="h-12">
                      {a.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.apiario_id && (
                <p className="text-sm text-destructive">{form.formState.errors.apiario_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Colmena (opcional)</Label>
              <Select
                value={form.watch("colmena_id") || ""}
                onValueChange={(v) => form.setValue("colmena_id", v)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Todas las colmenas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="" className="h-12">Todas las colmenas</SelectItem>
                  {hives?.map((h: any) => (
                    <SelectItem key={h.id} value={h.id} className="h-12">
                      {h.numero}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Produccion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kg_miel">Miel (kg)</Label>
              <Input
                id="kg_miel"
                type="number"
                step="0.1"
                placeholder="0.0"
                className="h-12"
                {...form.register("kg_miel")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kg_cera">Cera (kg)</Label>
              <Input
                id="kg_cera"
                type="number"
                step="0.1"
                placeholder="0.0"
                className="h-12"
                {...form.register("kg_cera")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kg_polen">Polen (kg)</Label>
              <Input
                id="kg_polen"
                type="number"
                step="0.1"
                placeholder="0.0"
                className="h-12"
                {...form.register("kg_polen")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kg_propoleo">Propoleo (kg)</Label>
              <Input
                id="kg_propoleo"
                type="number"
                step="0.1"
                placeholder="0.0"
                className="h-12"
                {...form.register("kg_propoleo")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="floracion">Floracion</Label>
              <Input
                id="floracion"
                placeholder="Tipo de floracion"
                className="h-12"
                {...form.register("floracion")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="humedad_pct">Humedad (%)</Label>
              <Input
                id="humedad_pct"
                type="number"
                step="0.1"
                placeholder="18.0"
                className="h-12"
                {...form.register("humedad_pct")}
              />
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <Select
                value={form.watch("color") || ""}
                onValueChange={(v) => form.setValue("color", v as any)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claro" className="h-12">Claro</SelectItem>
                  <SelectItem value="ambar" className="h-12">Ambar</SelectItem>
                  <SelectItem value="oscuro" className="h-12">Oscuro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Venta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="comprador">Comprador</Label>
              <Input
                id="comprador"
                placeholder="Nombre del comprador"
                className="h-12"
                {...form.register("comprador")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio_kg">Precio por kg ($)</Label>
              <Input
                id="precio_kg"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="h-12"
                {...form.register("precio_kg")}
              />
            </div>
          </div>

          {ingresoTotal && (
            <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-4">
              <p className="text-sm text-muted-foreground">Ingreso total estimado</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                $ {ingresoTotal}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

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
        disabled={createHarvest.isPending}
      >
        {createHarvest.isPending ? "Guardando..." : "Registrar cosecha"}
      </Button>
    </form>
  )
}
