"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApiaries, useHives, useCreateHiveInspection } from "@/hooks/use-apiaries"
import { toast } from "sonner"
import { useState } from "react"

const revisionSchema = z.object({
  colmena_id: z.string().min(1, "Selecciona una colmena"),
  fecha: z.string().min(1, "La fecha es requerida"),
  reina_vista: z.boolean().default(false),
  postura: z.string().optional(),
  cuadros_cria: z.coerce.number().int().min(0).optional(),
  cuadros_miel: z.coerce.number().int().min(0).optional(),
  cuadros_polen: z.coerce.number().int().min(0).optional(),
  temperamento: z.enum(["mansa", "nerviosa", "agresiva"]).optional(),
  presencia_varroa: z.boolean().default(false),
  nivel_varroa: z.coerce.number().min(0).max(100).optional(),
  celdas_reales: z.boolean().default(false),
  provision_alimento: z.string().optional(),
  estado_general: z.string().optional(),
  notas: z.string().optional(),
})

type RevisionFormValues = z.infer<typeof revisionSchema>

interface RevisionColmenaFormProps {
  ranchoId: string
  defaultColmenaId?: string
  onSuccess?: () => void
}

export function RevisionColmenaForm({
  ranchoId,
  defaultColmenaId,
  onSuccess,
}: RevisionColmenaFormProps) {
  const [selectedApiario, setSelectedApiario] = useState("")
  const [fotos, setFotos] = useState<File[]>([])

  const createInspection = useCreateHiveInspection()
  const { data: apiarios } = useApiaries(ranchoId)
  const { data: hives } = useHives(selectedApiario)

  const form = useForm<RevisionFormValues>({
    resolver: zodResolver(revisionSchema),
    defaultValues: {
      colmena_id: defaultColmenaId || "",
      fecha: new Date().toISOString().split("T")[0],
      reina_vista: false,
      presencia_varroa: false,
      celdas_reales: false,
    },
  })

  const presenciaVarroa = form.watch("presencia_varroa")

  const onSubmit = async (values: RevisionFormValues) => {
    createInspection.mutate(
      { ...values, rancho_id: ranchoId },
      {
        onSuccess: () => {
          toast.success("Revision de colmena registrada")
          form.reset({
            fecha: new Date().toISOString().split("T")[0],
            colmena_id: "",
            reina_vista: false,
            presencia_varroa: false,
            celdas_reales: false,
          })
          setFotos([])
          onSuccess?.()
        },
      }
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Revision de colmena</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Apiario</Label>
              <Select value={selectedApiario} onValueChange={setSelectedApiario}>
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
            </div>

            <div className="space-y-2">
              <Label>Colmena *</Label>
              <Select
                value={form.watch("colmena_id")}
                onValueChange={(v) => form.setValue("colmena_id", v)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar colmena" />
                </SelectTrigger>
                <SelectContent>
                  {hives?.map((h: any) => (
                    <SelectItem key={h.id} value={h.id} className="h-12">
                      {h.numero}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.colmena_id && (
                <p className="text-sm text-destructive">{form.formState.errors.colmena_id.message}</p>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estado de la colmena</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="reina_vista"
                checked={form.watch("reina_vista")}
                onCheckedChange={(checked) => form.setValue("reina_vista", !!checked)}
                className="h-6 w-6"
              />
              <Label htmlFor="reina_vista" className="text-base">Reina vista</Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="celdas_reales"
                checked={form.watch("celdas_reales")}
                onCheckedChange={(checked) => form.setValue("celdas_reales", !!checked)}
                className="h-6 w-6"
              />
              <Label htmlFor="celdas_reales" className="text-base">Celdas reales</Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="presencia_varroa"
                checked={form.watch("presencia_varroa")}
                onCheckedChange={(checked) => form.setValue("presencia_varroa", !!checked)}
                className="h-6 w-6"
              />
              <Label htmlFor="presencia_varroa" className="text-base">Presencia de Varroa</Label>
            </div>
          </div>

          {presenciaVarroa && (
            <div className="space-y-2">
              <Label htmlFor="nivel_varroa">Nivel de Varroa (%)</Label>
              <Input
                id="nivel_varroa"
                type="number"
                step="0.1"
                placeholder="0.0"
                className="h-12"
                {...form.register("nivel_varroa")}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="postura">Postura</Label>
            <Textarea
              id="postura"
              placeholder="Descripcion de la postura observada..."
              {...form.register("postura")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cuadros_cria">Cuadros de cria</Label>
              <Input
                id="cuadros_cria"
                type="number"
                placeholder="0"
                className="h-12"
                {...form.register("cuadros_cria")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cuadros_miel">Cuadros de miel</Label>
              <Input
                id="cuadros_miel"
                type="number"
                placeholder="0"
                className="h-12"
                {...form.register("cuadros_miel")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cuadros_polen">Cuadros de polen</Label>
              <Input
                id="cuadros_polen"
                type="number"
                placeholder="0"
                className="h-12"
                {...form.register("cuadros_polen")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Temperamento</Label>
              <Select
                value={form.watch("temperamento") || ""}
                onValueChange={(v) => form.setValue("temperamento", v as any)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Seleccionar temperamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mansa" className="h-12">Mansa</SelectItem>
                  <SelectItem value="nerviosa" className="h-12">Nerviosa</SelectItem>
                  <SelectItem value="agresiva" className="h-12">Agresiva</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="provision_alimento">Provision de alimento</Label>
              <Input
                id="provision_alimento"
                placeholder="Tipo y cantidad"
                className="h-12"
                {...form.register("provision_alimento")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado_general">Estado general</Label>
            <Textarea
              id="estado_general"
              placeholder="Descripcion del estado general de la colmena..."
              {...form.register("estado_general")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fotos-revision">Fotos</Label>
            <Input
              id="fotos-revision"
              type="file"
              accept="image/*"
              multiple
              className="h-12"
              onChange={(e) => setFotos(Array.from(e.target.files || []))}
            />
            {fotos.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {fotos.length} foto(s) seleccionada(s)
              </p>
            )}
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
        disabled={createInspection.isPending}
      >
        {createInspection.isPending ? "Guardando..." : "Registrar revision"}
      </Button>
    </form>
  )
}
