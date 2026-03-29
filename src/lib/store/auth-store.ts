import { create } from 'zustand'

interface UserProfile {
  id: string
  nombre: string
  email: string | null
  telefono: string | null
  rol: string
  avatar_url: string | null
  onboarding_completado: boolean
}

interface AuthStore {
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
}))
