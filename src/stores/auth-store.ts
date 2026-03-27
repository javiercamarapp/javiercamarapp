"use client"

import { create } from "zustand"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  nombre_completo: string
  telefono: string | null
  avatar_url: string | null
  tipo_cuenta: "rancho" | "gobierno" | "admin"
  onboarding_completado: boolean
}

interface Ranch {
  id: string
  nombre: string
  estado: string
  municipio: string
  especies_activas: string[]
}

interface AuthState {
  user: User | null
  profile: Profile | null
  currentRanch: Ranch | null
  ranches: Ranch[]
  isGobierno: boolean
  loading: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setCurrentRanch: (ranch: Ranch | null) => void
  setRanches: (ranches: Ranch[]) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  currentRanch: null,
  ranches: [],
  isGobierno: false,
  loading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) =>
    set({ profile, isGobierno: profile?.tipo_cuenta === "gobierno" }),
  setCurrentRanch: (currentRanch) => set({ currentRanch }),
  setRanches: (ranches) => set({ ranches }),
  setLoading: (loading) => set({ loading }),
  reset: () =>
    set({
      user: null,
      profile: null,
      currentRanch: null,
      ranches: [],
      isGobierno: false,
      loading: false,
    }),
}))
