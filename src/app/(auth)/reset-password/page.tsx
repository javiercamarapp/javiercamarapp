"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contrase\u00f1a debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contrase\u00f1as no coinciden",
    path: ["confirmPassword"],
  })

type ResetForm = z.infer<typeof resetSchema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  })

  const onSubmit = async (data: ResetForm) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success("Contrase\u00f1a actualizada correctamente")
      router.push("/login")
    } catch {
      toast.error("Ocurri\u00f3 un error inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-[#1B4332]">
          Nueva contrase\u00f1a
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-center text-base text-gray-600">
          Ingresa tu nueva contrase\u00f1a.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nueva contrase\u00f1a</Label>
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

          <Button
            type="submit"
            className="h-12 w-full text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-spin mr-2">&#9696;</span>
            ) : null}
            Actualizar contrase\u00f1a
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
