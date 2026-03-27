"use client"

import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Buenos días"
  if (hour < 18) return "Buenas tardes"
  return "Buenas noches"
}

function formatDate() {
  return new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function Header() {
  const { profile, signOut } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const firstName = profile?.nombre_completo?.split(" ")[0] || "Usuario"

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-border px-4 lg:px-6">
      <div className="flex items-center justify-between h-16">
        {/* Greeting - mobile: compact, desktop: full */}
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            {formatDate()}
          </p>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive text-white text-[10px] flex items-center justify-center font-bold">
              3
            </span>
          </button>

          {/* User menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-[#1B4332] flex items-center justify-center text-white text-sm font-medium">
                {firstName.charAt(0).toUpperCase()}
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border py-1 z-50">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-medium">{profile?.nombre_completo}</p>
                  <p className="text-xs text-muted-foreground">{profile?.tipo_cuenta}</p>
                </div>
                <Link
                  href="/dashboard/configuracion"
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  <Settings className="h-4 w-4" />
                  Configuración
                </Link>
                <button
                  onClick={() => {
                    setShowDropdown(false)
                    signOut()
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
