'use client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ClipboardPlus, Save, Loader2 } from 'lucide-react'
import { reproEventSchema, type ReproEventFormData } from '@/lib/validations/animal'
import { useCreateReproEvent } from '@/lib/hooks/use-reproduction'
import { useAnimals } from '@/lib/hooks/use-animals'
import { useRanchStore } from '@/lib/store/ranch-store'
import { useToastNotifications } from '@/lib/hooks/use-toast-notifications'

const tiposEvento = [
  { value: 'celo', label: 'Celo detectado' },
  { value: 'monta_natural', label: 'Monta natural' },
  { value: 'inseminacion', label: 'Inseminacion artificial' },
  { value: 'diagnostico_gestacion', label: 'Diagnostico de gestacion' },
  { value: 'parto', label: 'Parto' },
  { value: 'destete', label: 'Destete' },
  { value: 'aborto', label: 'Aborto' },
]

export default function RegistrarReproduccionPage() {
  const router = useRouter()
  const toast = useToastNotifications()
  const currentRanch = useRanchStore((s) => s.currentRanch)
  const createReproEvent = useCreateReproEvent()
  const { data: animales = [] } = useAnimals(currentRanch?.id ?? null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReproEventFormData>({
    resolver: zodResolver(reproEventSchema),
    defaultValues: {
      animal_id: '',
      fecha: new Date().toISOString().split('T')[0],
      tipo: undefined,
    },
  })

  const tipo = watch('tipo')

  const onSubmit = (data: ReproEventFormData) => {
    if (!currentRanch) {
      toast.error('Error', 'No hay rancho seleccionado.')
      return
    }

    createReproEvent.mutate(
      { ...data, rancho_id: currentRanch.id },
      {
        onSuccess: () => {
          toast.success('Evento registrado', 'El evento reproductivo se guardo correctamente.')
          router.push('/dashboard/reproduccion')
        },
        onError: (error) => {
          toast.error('Error al guardar', error.message || 'Intenta de nuevo.')
        },
      }
    )
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardPlus className="h-6 w-6 text-pink-500" />
          Registrar Evento Reproductivo
        </h1>
        <p className="text-muted-foreground">
          Captura un nuevo evento reproductivo para un animal
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Datos del Evento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Animal */}
            <div className="space-y-2">
              <Label htmlFor="animal">Animal *</Label>
              <Select onValueChange={(val) => setValue('animal_id', val, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar animal" />
                </SelectTrigger>
                <SelectContent>
                  {animales.length > 0 ? (
                    animales.map((a: any) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.nombre ? `${a.nombre} (${a.numero_arete})` : a.numero_arete}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="__none" disabled>
                      No hay animales registrados
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.animal_id && (
                <p className="text-sm text-destructive">{errors.animal_id.message}</p>
              )}
            </div>

            {/* Tipo de evento */}
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de evento *</Label>
              <Select onValueChange={(val) => setValue('tipo', val as ReproEventFormData['tipo'], { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de evento" />
                </SelectTrigger>
                <SelectContent>
                  {tiposEvento.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tipo && (
                <p className="text-sm text-destructive">{errors.tipo.message}</p>
              )}
            </div>

            {/* Fecha */}
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha del evento *</Label>
              <Input type="date" id="fecha" {...register('fecha')} />
              {errors.fecha && (
                <p className="text-sm text-destructive">{errors.fecha.message}</p>
              )}
            </div>

            {/* Campos condicionales */}
            {(tipo === 'monta_natural' || tipo === 'inseminacion') && (
              <div className="space-y-2">
                <Label htmlFor="macho_id">
                  {tipo === 'inseminacion' ? 'Pajilla / Toro donante' : 'Semental'}
                </Label>
                <Input
                  id="macho_id"
                  placeholder="Identificacion del semental o pajilla"
                  {...register('macho_id')}
                />
              </div>
            )}

            {tipo === 'inseminacion' && (
              <div className="space-y-2">
                <Label htmlFor="inseminador">Tecnico inseminador</Label>
                <Input
                  id="inseminador"
                  placeholder="Nombre del tecnico"
                  {...register('inseminador')}
                />
              </div>
            )}

            {tipo === 'diagnostico_gestacion' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="resultado">Resultado</Label>
                  <Select onValueChange={(val) => setValue('resultado', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar resultado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="positivo">Positivo (gestante)</SelectItem>
                      <SelectItem value="negativo">Negativo (vacia)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metodo_diagnostico">Metodo de diagnostico</Label>
                  <Select onValueChange={(val) => setValue('metodo_diagnostico', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar metodo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="palpacion">Palpacion rectal</SelectItem>
                      <SelectItem value="ultrasonido">Ultrasonido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {tipo === 'parto' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="num_crias">Numero de crias</Label>
                  <Input
                    id="num_crias"
                    type="number"
                    placeholder="1"
                    {...register('num_crias', { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facilidad_parto">Tipo de parto</Label>
                  <Select onValueChange={(val) => setValue('facilidad_parto', Number(val))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Normal</SelectItem>
                      <SelectItem value="2">Asistido</SelectItem>
                      <SelectItem value="3">Cesarea</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {tipo === 'destete' && (
              <div className="space-y-2">
                <Label htmlFor="peso_destete">Peso al destete (kg)</Label>
                <Input
                  id="peso_destete"
                  type="number"
                  placeholder="180"
                  {...register('peso_destete', { valueAsNumber: true })}
                />
              </div>
            )}

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notas">Notas adicionales</Label>
              <Textarea id="notas" placeholder="Observaciones..." {...register('notas')} />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={createReproEvent.isPending}
            >
              {createReproEvent.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {createReproEvent.isPending ? 'Guardando...' : 'Guardar Evento'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
