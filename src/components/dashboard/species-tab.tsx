"use client";

import { cn } from "@/lib/utils";
import type { SpeciesConfig } from "@/types/species";

interface SpeciesTabProps {
  species: SpeciesConfig;
  isActive: boolean;
  onClick: () => void;
  count: number;
}

export function SpeciesTab({ species, isActive, onClick, count }: SpeciesTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 rounded-t-lg px-4 py-3 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332]",
        isActive
          ? "border-b-2 border-[#1B4332] bg-white"
          : "border-b-2 border-transparent hover:bg-muted/50"
      )}
    >
      {/* Species icon (emoji rendered large) */}
      <span className="text-[64px] leading-none" role="img" aria-label={species.name}>
        {species.icon}
      </span>

      {/* Species name */}
      <span
        className={cn(
          "text-xs font-medium",
          isActive ? "text-[#1B4332]" : "text-muted-foreground"
        )}
      >
        {species.name}
      </span>

      {/* Count */}
      <span
        className={cn(
          "text-lg font-bold tabular-nums leading-tight",
          isActive ? "text-[#1B4332]" : "text-foreground"
        )}
      >
        {count.toLocaleString("es-MX")}
      </span>
    </button>
  );
}
