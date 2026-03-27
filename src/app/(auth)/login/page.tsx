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

const loginSchema = z.object({
  email: z.string().email("Correo electr\u00f3nico inv\u00e1lido"),
  password: z.string().min(6, "La contrase\u00f1a debe tener al menos 6 caracteres"),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      await signIn(data.email, data.password)
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
      toast.error("Error al iniciar sesi\u00f3n con Google")
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-[#1B4332]">
          Iniciar sesi\u00f3n
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

        {/* Email form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="password">Contrase\u00f1a</Label>
            <Input
              id="password"
              type="password"
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              className="h-12 text-base"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-[#1B4332] hover:underline"
            >
              \u00bfOlvidaste tu contrase\u00f1a?
            </Link>
          </div>

          <Button
            type="submit"
            className="h-12 w-full text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-spin mr-2">&#9696;</span>
            ) : null}
            Iniciar sesi\u00f3n
          </Button>
        </form>

        <p className="text-center text-base text-gray-600">
          \u00bfNo tienes cuenta?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#1B4332] hover:underline"
          >
            Reg\u00edstrate
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
