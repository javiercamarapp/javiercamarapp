"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyEmailPage() {
  const supabase = createClient()
  const [isResending, setIsResending] = useState(false)

  const handleResend = async () => {
    setIsResending(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user?.email) {
        toast.error("No se encontr\u00f3 un correo asociado")
        return
      }
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: user.email,
      })
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success("Correo de verificaci\u00f3n reenviado")
    } catch {
      toast.error("Ocurri\u00f3 un error inesperado")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-[#1B4332]">
          Revisa tu correo electr\u00f3nico
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#1B4332]/10">
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
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <p className="text-base text-gray-600">
          Te enviamos un enlace de verificaci\u00f3n a tu correo electr\u00f3nico.
          Haz clic en el enlace para activar tu cuenta.
        </p>

        <Button
          type="button"
          variant="outline"
          className="h-12 w-full text-base"
          onClick={handleResend}
          disabled={isResending}
        >
          {isResending ? (
            <span className="animate-spin mr-2">&#9696;</span>
          ) : null}
          Reenviar correo
        </Button>

        <Link
          href="/login"
          className="inline-block text-base font-semibold text-[#1B4332] hover:underline"
        >
          &larr; Volver a iniciar sesi\u00f3n
        </Link>
      </CardContent>
    </Card>
  )
}
