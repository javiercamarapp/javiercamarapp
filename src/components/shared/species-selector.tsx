"use client"

import { cn } from "@/lib/utils"
import { SpeciesIcon } from "@/components/icons/species-icons"
import { SPECIES_CONFIG } from "@/lib/species/config"
import type { SpeciesId } from "@/types/species"

interface SpeciesSelectorProps {
  activeSpecies: string[]
  selected: string | null
  onSelect: (species: string) => void
}

export function SpeciesSelector({
  activeSpecies,
  selected,
  onSelect,
}: SpeciesSelectorProps) {
  const species = activeSpecies
    .map((id) => SPECIES_CONFIG[id as SpeciesId])
    .filter(Boolean)

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
      <button
        onClick={() => onSelect("")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors shrink-0",
          !selected
            ? "border-[#1B4332] bg-[#1B4332]/10 text-[#1B4332]"
            : "border-border text-muted-foreground hover:bg-muted"
        )}
      >
        Todas
      </button>
      {species.map((sp) => (
        <button
          key={sp.id}
          onClick={() => onSelect(sp.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors shrink-0",
            selected === sp.id
              ? "border-[#1B4332] bg-[#1B4332]/10 text-[#1B4332]"
              : "border-border text-muted-foreground hover:bg-muted"
          )}
        >
          <SpeciesIcon species={sp.id} size={20} />
          {sp.namePlural}
        </button>
      ))}
    </div>
  )
}
