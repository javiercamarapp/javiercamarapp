"use client"

import { create } from "zustand"

interface RanchState {
  selectedRanchId: string | null
  setSelectedRanchId: (id: string | null) => void
}

export const useRanchStore = create<RanchState>((set) => ({
  selectedRanchId: null,
  setSelectedRanchId: (selectedRanchId) => set({ selectedRanchId }),
}))
