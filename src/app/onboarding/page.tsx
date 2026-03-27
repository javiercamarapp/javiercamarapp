"use client"

import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import {
  ALL_STATE_NAMES,
  MEXICAN_STATES,
  type Municipality,
} from "@/lib/constants"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

// ---------------------------------------------------------------------------
// Types & Constants
// ---------------------------------------------------------------------------

const TIPOS_PRODUCCION = [
  "Carne",
  "Leche",
  "Doble prop\u00f3sito",
  "Engorda",
  "Cr\u00eda",
  "Mixto",
] as const

const ESPECIES = [
  { id: "bovino", label: "Bovino" },
  { id: "porcino", label: "Porcino" },
  { id: "ovino", label: "Ovino" },
  { id: "caprino", label: "Caprino" },
  { id: "ave", label: "Ave" },
  { id: "abeja", label: "Abeja" },
  { id: "equido", label: "\u00c9quido" },
  { id: "conejo", label: "Conejo" },
  { id: "diversificado", label: "Diversificado" },
] as const

const TIPOS_CORRAL = [
  "potrero",
  "corral",
  "galp\u00f3n",
  "apiario",
  "manga",
  "enfermer\u00eda",
  "maternidad",
] as const

// ---------------------------------------------------------------------------
// Zod Schemas
// ---------------------------------------------------------------------------

const step1Schema = z.object({
  nombre: z.string().min(1, "El nombre del rancho es obligatorio"),
  estado: z.string().min(1, "Selecciona un estado"),
  municipio: z.string().min(1, "Selecciona un municipio"),
  tipo_produccion: z
    .array(z.string())
    .min(1, "Selecciona al menos un tipo de producci\u00f3n"),
  superficie_hectareas: z.string().optional(),
})

type Step1FormValues = z.infer<typeof step1Schema>

interface Step1Data {
  nombre: string
  estado: string
  municipio: string
  tipo_produccion: string[]
  superficie_hectareas?: number
}

interface Corral {
  nombre: string
  tipo: string
  capacidad: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Shared state across steps
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null)
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([])
  const [corrales, setCorrales] = useState<Corral[]>([
    { nombre: "", tipo: "", capacidad: "" },
  ])

  const totalSteps = 4
  const progressValue = (currentStep / totalSteps) * 100

  // ---- Step 1 ----
  const step1Form = useForm<Step1FormValues>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      nombre: "",
      estado: "",
      municipio: "",
      tipo_produccion: [],
      superficie_hectareas: "",
    },
  })

  const watchEstado = step1Form.watch("estado")
  const watchTipoProduccion = step1Form.watch("tipo_produccion") || []

  // Look up municipalities from MEXICAN_STATES by matching state name
  const municipios: string[] = (() => {
    if (!watchEstado) return []
    const stateEntry = Object.values(MEXICAN_STATES).find(
      (s) => s.name === watchEstado
    )
    return stateEntry ? stateEntry.municipalities.map((m) => m.name) : []
  })()

  const toggleTipoProduccion = (tipo: string) => {
    const current = step1Form.getValues("tipo_produccion") || []
    const next = current.includes(tipo)
      ? current.filter((t) => t !== tipo)
      : [...current, tipo]
    step1Form.setValue("tipo_produccion", next, { shouldValidate: true })
  }

  const handleStep1Next = step1Form.handleSubmit((data) => {
    setStep1Data({
      nombre: data.nombre,
      estado: data.estado,
      municipio: data.municipio,
      tipo_produccion: data.tipo_produccion,
      superficie_hectareas: data.superficie_hectareas
        ? Number(data.superficie_hectareas)
        : undefined,
    })
    setCurrentStep(2)
  })

  // ---- Step 2 ----
  const toggleSpecies = (speciesId: string) => {
    setSelectedSpecies((prev) =>
      prev.includes(speciesId)
        ? prev.filter((s) => s !== speciesId)
        : [...prev, speciesId]
    )
  }

  const handleStep2Next = () => {
    if (selectedSpecies.length === 0) {
      toast.error("Selecciona al menos una especie")
      return
    }
    setCurrentStep(3)
  }

  // ---- Step 3 ----
  const updateCorral = (
    index: number,
    field: keyof Corral,
    value: string
  ) => {
    setCorrales((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: value }
      return copy
    })
  }

  const addCorral = () => {
    setCorrales((prev) => [...prev, { nombre: "", tipo: "", capacidad: "" }])
  }

  const removeCorral = (index: number) => {
    if (corrales.length <= 1) return
    setCorrales((prev) => prev.filter((_, i) => i !== index))
  }

  const handleStep3Next = () => {
    const valid = corrales.every(
      (c) => c.nombre.trim() !== "" && c.tipo.trim() !== ""
    )
    if (!valid) {
      toast.error("Completa los datos de cada corral (nombre y tipo)")
      return
    }
    setCurrentStep(4)
  }

  // ---- Step 4: Submit ----
  const handleFinish = async () => {
    if (!user || !step1Data) return
    setIsSubmitting(true)

    try {
      // 1. Create ranch
      const { data: ranch, error: ranchError } = await supabase
        .from("ranchos")
        .insert({
          nombre: step1Data.nombre,
          estado: step1Data.estado,
          municipio: step1Data.municipio,
          tipo_produccion: step1Data.tipo_produccion,
          superficie_hectareas: step1Data.superficie_hectareas || null,
          especies: selectedSpecies,
        })
        .select("id")
        .single()

      if (ranchError) throw ranchError

      // 2. Create rancho_usuarios relationship
      const { error: ruError } = await supabase
        .from("rancho_usuarios")
        .insert({
          rancho_id: ranch.id,
          user_id: user.id,
          rol: "propietario",
          activo: true,
        })

      if (ruError) throw ruError

      // 3. Create corrales
      if (corrales.length > 0) {
        const corralesData = corrales.map((c) => ({
          rancho_id: ranch.id,
          nombre: c.nombre,
          tipo: c.tipo,
          capacidad: c.capacidad ? Number(c.capacidad) : null,
        }))

        const { error: corralesError } = await supabase
          .from("corrales")
          .insert(corralesData)

        if (corralesError) throw corralesError
      }

      // 4. Mark onboarding as complete
      const { error: profileError } = await supabase
        .from("perfiles")
        .update({ onboarding_completado: true })
        .eq("id", user.id)

      if (profileError) throw profileError

      toast.success("\u00a1Rancho creado exitosamente!")
      router.push("/")
    } catch (error: any) {
      toast.error(error?.message || "Error al crear el rancho")
    } finally {
      setIsSubmitting(false)
    }
  }

  const goBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="flex min-h-screen flex-col bg-white font-[Inter]">
      {/* Header */}
      <div className="border-b px-4 py-4">
        <div className="mx-auto max-w-2xl">
          <svg
            width="120"
            height="36"
            viewBox="0 0 120 36"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="HatoAI"
          >
            <text
              x="50%"
              y="50%"
              dominantBaseline="central"
              textAnchor="middle"
              fill="#1B4332"
              fontWeight="700"
              fontSize="24"
              fontFamily="Inter, sans-serif"
            >
              HatoAI
            </text>
          </svg>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 pt-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-2 flex justify-between text-sm text-gray-500">
            <span>
              Paso {currentStep} de {totalSteps}
            </span>
            <span>{Math.round(progressValue)}%</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          {/* ============= STEP 1 ============= */}
          {currentStep === 1 && (
            <Card className="border-0 shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#1B4332]">
                  Tu rancho
                </CardTitle>
                <p className="text-base text-gray-600">
                  Cu\u00e9ntanos sobre tu unidad de producci\u00f3n pecuaria.
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Nombre */}
                <div className="space-y-2">
                  <Label htmlFor="ranch-name">
                    Nombre del rancho <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ranch-name"
                    placeholder="Ej. Rancho San Miguel"
                    className="h-12 text-base"
                    {...step1Form.register("nombre")}
                  />
                  {step1Form.formState.errors.nombre && (
                    <p className="text-sm text-red-500">
                      {step1Form.formState.errors.nombre.message}
                    </p>
                  )}
                </div>

                {/* Estado */}
                <div className="space-y-2">
                  <Label>
                    Estado <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watchEstado}
                    onValueChange={(val) => {
                      step1Form.setValue("estado", val, {
                        shouldValidate: true,
                      })
                      step1Form.setValue("municipio", "", {
                        shouldValidate: false,
                      })
                    }}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_STATE_NAMES.map((estado) => (
                        <SelectItem key={estado} value={estado}>
                          {estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {step1Form.formState.errors.estado && (
                    <p className="text-sm text-red-500">
                      {step1Form.formState.errors.estado.message}
                    </p>
                  )}
                </div>

                {/* Municipio */}
                <div className="space-y-2">
                  <Label>
                    Municipio <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={step1Form.watch("municipio")}
                    onValueChange={(val) =>
                      step1Form.setValue("municipio", val, {
                        shouldValidate: true,
                      })
                    }
                    disabled={!watchEstado}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue
                        placeholder={
                          watchEstado
                            ? "Selecciona un municipio"
                            : "Primero selecciona un estado"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {municipios.map((mun) => (
                        <SelectItem key={mun} value={mun}>
                          {mun}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {step1Form.formState.errors.municipio && (
                    <p className="text-sm text-red-500">
                      {step1Form.formState.errors.municipio.message}
                    </p>
                  )}
                </div>

                {/* Tipo produccion (multi-select chips) */}
                <div className="space-y-2">
                  <Label>
                    Tipo de producci\u00f3n{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {TIPOS_PRODUCCION.map((tipo) => {
                      const selected = watchTipoProduccion.includes(tipo)
                      return (
                        <button
                          key={tipo}
                          type="button"
                          onClick={() => toggleTipoProduccion(tipo)}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                            selected
                              ? "border-[#1B4332] bg-[#1B4332] text-white"
                              : "border-gray-300 bg-white text-gray-700 hover:border-[#1B4332]"
                          }`}
                        >
                          {tipo}
                        </button>
                      )
                    })}
                  </div>
                  {step1Form.formState.errors.tipo_produccion && (
                    <p className="text-sm text-red-500">
                      {step1Form.formState.errors.tipo_produccion.message}
                    </p>
                  )}
                </div>

                {/* Superficie */}
                <div className="space-y-2">
                  <Label htmlFor="superficie">
                    Superficie (hect\u00e1reas)
                  </Label>
                  <Input
                    id="superficie"
                    type="number"
                    placeholder="Ej. 150"
                    className="h-12 text-base"
                    {...step1Form.register("superficie_hectareas")}
                  />
                </div>

                {/* Navigation */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    className="h-12 min-w-[120px] text-base"
                    onClick={handleStep1Next}
                  >
                    Siguiente
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ============= STEP 2 ============= */}
          {currentStep === 2 && (
            <Card className="border-0 shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#1B4332]">
                  \u00bfQu\u00e9 especies manejas?
                </CardTitle>
                <p className="text-base text-gray-600">
                  Selecciona todas las especies que manejas en tu rancho.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {ESPECIES.map((especie) => {
                    const selected = selectedSpecies.includes(especie.id)
                    return (
                      <button
                        key={especie.id}
                        type="button"
                        onClick={() => toggleSpecies(especie.id)}
                        className={`relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                          selected
                            ? "border-[#1B4332] bg-[#1B4332]/5"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        {/* Checkmark */}
                        {selected && (
                          <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1B4332]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                        {/* Circle icon placeholder */}
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full ${
                            selected
                              ? "bg-[#1B4332]/10 text-[#1B4332]"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <span className="text-lg font-bold uppercase">
                            {especie.label.charAt(0)}
                          </span>
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            selected ? "text-[#1B4332]" : "text-gray-700"
                          }`}
                        >
                          {especie.label}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {selectedSpecies.length === 0 && (
                  <p className="text-center text-sm text-gray-400">
                    Selecciona al menos una especie para continuar.
                  </p>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 min-w-[120px] text-base"
                    onClick={goBack}
                  >
                    Atr\u00e1s
                  </Button>
                  <Button
                    type="button"
                    className="h-12 min-w-[120px] text-base"
                    onClick={handleStep2Next}
                  >
                    Siguiente
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ============= STEP 3 ============= */}
          {currentStep === 3 && (
            <Card className="border-0 shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#1B4332]">
                  Tu infraestructura
                </CardTitle>
                <p className="text-base text-gray-600">
                  Agrega los corrales, potreros y \u00e1reas de tu rancho.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {corrales.map((corral, index) => (
                  <div
                    key={index}
                    className="space-y-4 rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#1B4332]">
                        Corral {index + 1}
                      </span>
                      {corrales.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCorral(index)}
                          className="text-sm text-red-500 hover:underline"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>

                    {/* Nombre */}
                    <div className="space-y-2">
                      <Label>
                        Nombre <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Ej. Potrero Norte"
                        className="h-12 text-base"
                        value={corral.nombre}
                        onChange={(e) =>
                          updateCorral(index, "nombre", e.target.value)
                        }
                      />
                    </div>

                    {/* Tipo */}
                    <div className="space-y-2">
                      <Label>
                        Tipo <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={corral.tipo}
                        onValueChange={(val) =>
                          updateCorral(index, "tipo", val)
                        }
                      >
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIPOS_CORRAL.map((tipo) => (
                            <SelectItem key={tipo} value={tipo}>
                              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Capacidad */}
                    <div className="space-y-2">
                      <Label>Capacidad (cabezas)</Label>
                      <Input
                        type="number"
                        placeholder="Ej. 50"
                        className="h-12 text-base"
                        value={corral.capacidad}
                        onChange={(e) =>
                          updateCorral(index, "capacidad", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full text-base"
                  onClick={addCorral}
                >
                  + Agregar otro
                </Button>

                {/* Navigation */}
                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 min-w-[120px] text-base"
                    onClick={goBack}
                  >
                    Atr\u00e1s
                  </Button>
                  <Button
                    type="button"
                    className="h-12 min-w-[120px] text-base"
                    onClick={handleStep3Next}
                  >
                    Siguiente
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ============= STEP 4 ============= */}
          {currentStep === 4 && (
            <Card className="border-0 shadow-none">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#1B4332]/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-[#1B4332]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <CardTitle className="text-2xl font-bold text-[#1B4332]">
                  \u00a1Listo!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <p className="text-base text-gray-600">
                  Todo est\u00e1 configurado. Tu rancho{" "}
                  <span className="font-semibold text-[#1B4332]">
                    {step1Data?.nombre}
                  </span>{" "}
                  est\u00e1 listo para empezar a trabajar con HatoAI.
                </p>

                {/* Summary */}
                <div className="space-y-3 rounded-lg bg-gray-50 p-4 text-left text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estado</span>
                    <span className="font-medium">{step1Data?.estado}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Municipio</span>
                    <span className="font-medium">{step1Data?.municipio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Especies</span>
                    <span className="font-medium">
                      {selectedSpecies
                        .map(
                          (s) =>
                            ESPECIES.find((e) => e.id === s)?.label || s
                        )
                        .join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Corrales</span>
                    <span className="font-medium">{corrales.length}</span>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex flex-col gap-3 pt-4">
                  <Button
                    type="button"
                    className="h-12 w-full text-base"
                    onClick={handleFinish}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="animate-spin mr-2">&#9696;</span>
                    ) : null}
                    Ir al Dashboard
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 w-full text-base"
                    onClick={goBack}
                    disabled={isSubmitting}
                  >
                    Atr\u00e1s
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
