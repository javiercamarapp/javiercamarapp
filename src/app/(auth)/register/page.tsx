"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

const registerSchema = z
  .object({
    nombre: z.string().min(2, "El nombre es obligatorio"),
    email: z.string().email("Correo electr\u00f3nico inv\u00e1lido"),
    telefono: z
      .string()
      .regex(/^\d{10}$/, "Ingresa 10 d\u00edgitos")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "La contrase\u00f1a debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
    terms: z.literal(true, {
      message: "Debes aceptar los t\u00e9rminos y condiciones",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contrase\u00f1as no coinciden",
    path: ["confirmPassword"],
  })

type RegisterForm = z.infer<typeof registerSchema>

function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score: 1, label: "D\u00e9bil", color: "bg-red-500" }
  if (score <= 2) return { score: 2, label: "Regular", color: "bg-orange-500" }
  if (score <= 3) return { score: 3, label: "Buena", color: "bg-yellow-500" }
  if (score <= 4) return { score: 4, label: "Fuerte", color: "bg-green-500" }
  return { score: 5, label: "Muy fuerte", color: "bg-[#1B4332]" }
}

export default function RegisterPage() {
  const { signUp, signInWithGoogle } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      password: "",
      confirmPassword: "",
    },
  })

  const passwordValue = watch("password") || ""
  const strength = passwordValue.length > 0 ? getPasswordStrength(passwordValue) : null

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      await signUp(data.email, data.password, {
        full_name: data.nombre,
        phone: data.telefono ? `+52${data.telefono}` : undefined,
      })
      router.push("/verify-email")
    } catch {
      // Error toast is handled by useAuth
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogle = async () => {
    setIsGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch {
      toast.error("Error al registrarse con Google")
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-[#1B4332]">
          Crear cuenta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Google */}
        <Button
          type="button"
          variant="outline"
          className="h-12 w-full text-base"
          onClick={handleGoogle}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <span className="animate-spin mr-2">&#9696;</span>
          ) : (
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          Continuar con Google
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">o</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre completo</Label>
            <Input
              id="nombre"
              placeholder="Juan P\u00e9rez"
              className="h-12 text-base"
              {...register("nombre")}
            />
            {errors.nombre && (
              <p className="text-sm text-red-500">{errors.nombre.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Correo electr\u00f3nico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              className="h-12 text-base"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Telefono */}
          <div className="space-y-2">
            <Label htmlFor="telefono">Tel\u00e9fono</Label>
            <div className="flex gap-2">
              <div className="flex h-12 items-center rounded-md border border-input bg-gray-50 px-3 text-base text-gray-500">
                +52
              </div>
              <Input
                id="telefono"
                type="tel"
                placeholder="9991234567"
                className="h-12 flex-1 text-base"
                maxLength={10}
                {...register("telefono")}
              />
            </div>
            {errors.telefono && (
              <p className="text-sm text-red-500">{errors.telefono.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Contrase\u00f1a</Label>
            <Input
              id="password"
              type="password"
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              className="h-12 text-base"
              {...register("password")}
            />
            {strength && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${
                        i <= strength.score ? strength.color : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">{strength.label}</p>
              </div>
            )}
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contrase\u00f1a</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              className="h-12 text-base"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              className="mt-0.5 h-5 w-5"
              onCheckedChange={(checked) =>
                setValue("terms", checked === true ? true : (false as any), {
                  shouldValidate: true,
                })
              }
            />
            <Label
              htmlFor="terms"
              className="text-sm font-normal leading-snug text-gray-600"
            >
              Acepto los{" "}
              <Link
                href="/terminos"
                className="text-[#1B4332] underline"
                target="_blank"
              >
                t\u00e9rminos y condiciones
              </Link>
            </Label>
          </div>
          {errors.terms && (
            <p className="text-sm text-red-500">{errors.terms.message}</p>
          )}

          <Button
            type="submit"
            className="h-12 w-full text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-spin mr-2">&#9696;</span>
            ) : null}
            Crear cuenta
          </Button>
        </form>

        <p className="text-center text-base text-gray-600">
          \u00bfYa tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#1B4332] hover:underline"
          >
            Iniciar sesi\u00f3n
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
