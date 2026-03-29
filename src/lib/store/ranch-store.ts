import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SpeciesKey } from '@/lib/species/config'

interface Ranch {
  id: string
  nombre: string
  estado: string
  municipio: string
  especies_activas: SpeciesKey[]
  tipo_produccion: string | null
  superficie_ha: number | null
}

interface RanchStore {
  currentRanch: Ranch | null
  setCurrentRanch: (ranch: Ranch | null) => void
  speciesActivas: SpeciesKey[]
  setSpeciesActivas: (species: SpeciesKey[]) => void
}

export const useRanchStore = create<RanchStore>()(
  persist(
    (set) => ({
      currentRanch: null,
      setCurrentRanch: (ranch) =>
        set({
          currentRanch: ranch,
          speciesActivas: (ranch?.especies_activas ?? []) as SpeciesKey[],
        }),
      speciesActivas: [],
      setSpeciesActivas: (species) => set({ speciesActivas: species }),
    }),
    { name: 'hatoai-ranch' }
  )
)
