"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  ClipboardList,
  RefreshCw,
  Scale,
  Syringe,
  Wheat,
  DollarSign,
  BarChart3,
  Bot,
  Settings,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/inventario", label: "Inventario", icon: ClipboardList },
  { href: "/dashboard/reproduccion", label: "Reproducción", icon: RefreshCw },
  { href: "/dashboard/pesajes", label: "Pesajes", icon: Scale },
  { href: "/dashboard/sanidad", label: "Sanidad", icon: Syringe },
  { href: "/dashboard/alimentacion", label: "Alimentación", icon: Wheat },
  { href: "/dashboard/economico", label: "Económico", icon: DollarSign },
  { href: "/dashboard/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/dashboard/ai-insights", label: "AI Insights", icon: Bot },
  { href: "/dashboard/configuracion", label: "Configuración", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { profile, signOut } = useAuth()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-[280px] lg:fixed lg:inset-y-0 border-r border-border bg-white">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[#1B4332]">HatoAI</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#1B4332]/10 text-[#1B4332]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#1B4332] flex items-center justify-center text-white text-sm font-medium">
            {profile?.nombre_completo?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {profile?.nombre_completo || "Usuario"}
            </p>
            <button
              onClick={signOut}
              className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
            >
              <LogOut className="h-3 w-3" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
