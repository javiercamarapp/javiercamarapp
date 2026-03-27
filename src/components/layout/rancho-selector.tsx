"use client"

import { useAuth } from "@/hooks/use-auth"
import { ChevronDown, MapPin } from "lucide-react"
import { useState, useRef, useEffect } from "react"

export function RanchoSelector() {
  const { ranches, currentRanch, setCurrentRanch } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (ranches.length <= 1) {
    return currentRanch ? (
      <div className="flex items-center gap-2 px-3 py-2 text-sm">
        <MapPin className="h-4 w-4 text-[#22C55E]" />
        <span className="font-medium truncate">{currentRanch.nombre}</span>
      </div>
    ) : null
  }

  return (
    <div className="relative px-3" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
      >
        <MapPin className="h-4 w-4 text-[#22C55E] shrink-0" />
        <span className="font-medium truncate flex-1 text-left">
          {currentRanch?.nombre || "Seleccionar rancho"}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
      </button>

      {open && (
        <div className="absolute left-3 right-3 mt-1 bg-white rounded-lg shadow-lg border border-border py-1 z-50">
          {ranches.map((ranch) => (
            <button
              key={ranch.id}
              onClick={() => {
                setCurrentRanch(ranch)
                setOpen(false)
              }}
              className="flex items-center gap-2 px-3 py-2 w-full text-sm hover:bg-muted transition-colors text-left"
            >
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{ranch.nombre}</p>
                <p className="text-xs text-muted-foreground">
                  {ranch.municipio}, {ranch.estado}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
