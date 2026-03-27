"use client"

import { create } from "zustand"

interface SpeciesState {
  activeSpecies: string | null
  setActiveSpecies: (species: string | null) => void
}

export const useSpeciesStore = create<SpeciesState>((set) => ({
  activeSpecies: null,
  setActiveSpecies: (activeSpecies) => set({ activeSpecies }),
}))
