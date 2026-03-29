import { z } from 'zod'

export const animalSchema = z.object({
  numero_arete: z.string().min(1, 'El número de arete es requerido'),
  nombre: z.string().optional(),
  especie: z.string().min(1, 'Selecciona una especie'),
  sexo: z.enum(['macho', 'hembra'], { message: 'Selecciona el sexo' }),
  categoria: z.string().optional(),
  raza: z.string().optional(),
  color: z.string().optional(),
  fecha_nacimiento: z.string().optional(),
  fecha_nacimiento_estimada: z.boolean().default(false),
  tipo_produccion: z.string().optional(),
  origen: z.string().default('nacido_en_rancho'),
  precio_compra: z.number().optional(),
  proveedor: z.string().optional(),
  peso_actual: z.number().optional(),
  condicion_corporal: z.number().optional(),
  corral_id: z.string().optional(),
  notas: z.string().optional(),
  foto_url: z.string().optional(),
})

export type AnimalFormData = z.infer<typeof animalSchema>

export const reproEventSchema = z.object({
  animal_id: z.string().min(1, 'Selecciona un animal'),
  fecha: z.string().min(1, 'La fecha es requerida'),
  tipo: z.enum(['celo', 'monta_natural', 'inseminacion', 'transferencia_embrion', 'diagnostico_gestacion', 'parto', 'destete', 'aborto', 'secado'], { message: 'Selecciona el tipo de evento' }),
  macho_id: z.string().optional(),
  inseminador: z.string().optional(),
  pajilla_id: z.string().optional(),
  toro_raza_semen: z.string().optional(),
  tipo_semen: z.string().optional(),
  protocolo_iatf: z.string().optional(),
  metodo_diagnostico: z.string().optional(),
  resultado: z.string().optional(),
  dias_gestacion_estimados: z.number().optional(),
  num_crias: z.number().optional(),
  facilidad_parto: z.number().optional(),
  peso_destete: z.number().optional(),
  edad_destete_dias: z.number().optional(),
  notas: z.string().optional(),
})

export type ReproEventFormData = z.infer<typeof reproEventSchema>

export const pesajeSchema = z.object({
  animal_id: z.string().min(1, 'Selecciona un animal'),
  fecha: z.string().min(1, 'La fecha es requerida'),
  peso: z.number().min(0.1, 'El peso debe ser mayor a 0'),
  metodo: z.string().optional(),
  condicion_corporal: z.number().optional(),
  notas: z.string().optional(),
})

export type PesajeFormData = z.infer<typeof pesajeSchema>

export const healthEventSchema = z.object({
  animal_id: z.string().optional(),
  lote_id: z.string().optional(),
  colmena_id: z.string().optional(),
  fecha: z.string().min(1, 'La fecha es requerida'),
  tipo: z.enum(['vacunacion', 'desparasitacion', 'tratamiento', 'diagnostico', 'cirugia', 'muerte', 'famacha', 'prueba_lab'], { message: 'Selecciona el tipo' }),
  campana: z.string().optional(),
  producto: z.string().optional(),
  lote_producto: z.string().optional(),
  dosis: z.string().optional(),
  via: z.string().optional(),
  proxima_aplicacion: z.string().optional(),
  diagnostico: z.string().optional(),
  medicamento: z.string().optional(),
  duracion_dias: z.number().optional(),
  dias_retiro_carne: z.number().optional(),
  dias_retiro_leche: z.number().optional(),
  veterinario: z.string().optional(),
  costo: z.number().optional(),
  notas: z.string().optional(),
})

export type HealthEventFormData = z.infer<typeof healthEventSchema>

export const movimientoSchema = z.object({
  tipo: z.enum(['ingreso', 'egreso'], { message: 'Selecciona tipo' }),
  categoria: z.string().min(1, 'Selecciona categoría'),
  monto: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  descripcion: z.string().optional(),
  fecha: z.string().min(1, 'La fecha es requerida'),
  animal_id: z.string().optional(),
  comprador_vendedor: z.string().optional(),
  notas: z.string().optional(),
})

export type MovimientoFormData = z.infer<typeof movimientoSchema>

export const loteSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  especie: z.enum(['ave', 'conejo'], { message: 'Selecciona especie' }),
  tipo: z.string().optional(),
  especie_ave: z.string().optional(),
  raza: z.string().optional(),
  cantidad_inicial: z.number().min(1, 'La cantidad debe ser al menos 1'),
  fecha_ingreso: z.string().optional(),
  galpon_id: z.string().optional(),
  proveedor: z.string().optional(),
  costo_por_unidad: z.number().optional(),
  notas: z.string().optional(),
})

export type LoteFormData = z.infer<typeof loteSchema>

export const produccionLoteSchema = z.object({
  lote_id: z.string().min(1, 'Selecciona un lote'),
  fecha: z.string().min(1, 'La fecha es requerida'),
  huevos_totales: z.number().optional(),
  huevos_rotos: z.number().optional(),
  huevos_sucios: z.number().optional(),
  huevos_vendibles: z.number().optional(),
  peso_promedio_muestra: z.number().optional(),
  alimento_consumido_kg: z.number().optional(),
  mortalidad_dia: z.number().default(0),
  descarte_dia: z.number().default(0),
  causa_mortalidad: z.string().optional(),
  notas: z.string().optional(),
})

export type ProduccionLoteFormData = z.infer<typeof produccionLoteSchema>

export const produccionLecheSchema = z.object({
  animal_id: z.string().min(1, 'Selecciona una vaca'),
  fecha: z.string().min(1, 'La fecha es requerida'),
  litros_am: z.number().optional(),
  litros_pm: z.number().optional(),
  litros_total: z.number().min(0.1, 'Los litros deben ser mayor a 0'),
  notas: z.string().optional(),
})

export type ProduccionLecheFormData = z.infer<typeof produccionLecheSchema>
