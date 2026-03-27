"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const forgotSchema = z.object({
  email: z.string().email("Correo electr\u00f3nico inv\u00e1lido"),
})

type ForgotForm = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  })

  const onSubmit = async (data: ForgotForm) => {
    setIsLoading(true)
    try {
      await resetPassword(data.email)
      setSent(true)
    } catch {
      // Error toast is handled by useAuth
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-[#1B4332]">
          Recuperar contrase\u00f1a
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {sent ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1B4332]/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#1B4332]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1B4332]">
              Te enviamos un correo
            </h3>
            <p className="text-base text-gray-600">
              Revisa tu bandeja de entrada y sigue las instrucciones para
              restablecer tu contrase\u00f1a.
            </p>
            <Link
              href="/login"
              className="inline-block text-base font-semibold text-[#1B4332] hover:underline"
            >
              &larr; Volver a iniciar sesi\u00f3n
            </Link>
          </div>
        ) : (
          <>
            <p className="text-center text-base text-gray-600">
              Ingresa tu correo electr\u00f3nico y te enviaremos un enlace para
              restablecer tu contrase\u00f1a.
            </p>

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
                  <p className="text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="h-12 w-full text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-spin mr-2">&#9696;</span>
                ) : null}
                Enviar enlace
              </Button>
            </form>

            <div className="text-center">
              <Link
                href="/login"
                className="text-base font-semibold text-[#1B4332] hover:underline"
              >
                &larr; Volver a iniciar sesi\u00f3n
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
