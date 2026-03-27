"use client"

import { useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuthStore } from "@/stores/auth-store"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function useAuth() {
  const router = useRouter()
  const supabase = createClient()
  const {
    user,
    profile,
    currentRanch,
    ranches,
    isGobierno,
    loading,
    setUser,
    setProfile,
    setCurrentRanch,
    setRanches,
    setLoading,
    reset,
  } = useAuthStore()

  const fetchProfile = useCallback(
    async (userId: string) => {
      const { data } = await supabase
        .from("perfiles")
        .select("*")
        .eq("id", userId)
        .single()
      if (data) setProfile(data)
      return data
    },
    [supabase, setProfile]
  )

  const fetchRanches = useCallback(
    async (userId: string) => {
      const { data } = await supabase
        .from("rancho_usuarios")
        .select("rancho_id, rol, ranchos(*)")
        .eq("user_id", userId)
        .eq("activo", true)
      if (data && data.length > 0) {
        const ranchList = data
          .map((ru: any) => ru.ranchos)
          .filter(Boolean)
        setRanches(ranchList)
        if (!currentRanch && ranchList.length > 0) {
          setCurrentRanch(ranchList[0])
        }
      }
    },
    [supabase, setRanches, setCurrentRanch, currentRanch]
  )

  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()
      if (currentUser) {
        setUser(currentUser)
        await fetchProfile(currentUser.id)
        await fetchRanches(currentUser.id)
      }
      setLoading(false)
    }

    initAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (event: any, session: any) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
          await fetchRanches(session.user.id)
        } else if (event === "SIGNED_OUT") {
          reset()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, setUser, setLoading, fetchProfile, fetchRanches, reset])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message)
      throw error
    }
    router.push("/")
  }

  const signUp = async (
    email: string,
    password: string,
    metadata: { full_name: string; phone?: string }
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    })
    if (error) {
      toast.error(error.message)
      throw error
    }
    router.push("/verify-email")
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    })
    if (error) toast.error(error.message)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    reset()
    router.push("/login")
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      toast.error(error.message)
      throw error
    }
    toast.success("Te enviamos un correo para restablecer tu contraseña")
  }

  return {
    user,
    profile,
    currentRanch,
    ranches,
    isGobierno,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    setCurrentRanch,
  }
}
