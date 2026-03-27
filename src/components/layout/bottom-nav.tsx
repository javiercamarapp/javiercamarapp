"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Home,
  ClipboardList,
  Plus,
  Syringe,
  MoreHorizontal,
  Scale,
  RefreshCw,
  DollarSign,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const mainItems = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/dashboard/inventario", label: "Inventario", icon: ClipboardList },
]

const rightItems = [
  { href: "/dashboard/sanidad", label: "Sanidad", icon: Syringe },
]

const quickActions = [
  { href: "/dashboard/inventario/nuevo", label: "Registrar animal", icon: ClipboardList },
  { href: "/dashboard/pesajes", label: "Pesar animal", icon: Scale },
  { href: "/dashboard/reproduccion", label: "Evento reproductivo", icon: RefreshCw },
  { href: "/dashboard/sanidad", label: "Evento sanitario", icon: Syringe },
  { href: "/dashboard/economico", label: "Ingreso / Egreso", icon: DollarSign },
]

const moreItems = [
  { href: "/dashboard/reproduccion", label: "Reproducción", icon: RefreshCw },
  { href: "/dashboard/pesajes", label: "Pesajes", icon: Scale },
  { href: "/dashboard/alimentacion", label: "Alimentación" },
  { href: "/dashboard/economico", label: "Económico", icon: DollarSign },
  { href: "/dashboard/reportes", label: "Reportes" },
  { href: "/dashboard/ai-insights", label: "AI Insights" },
  { href: "/dashboard/configuracion", label: "Configuración" },
]

export function BottomNav() {
  const pathname = usePathname()
  const [showQuick, setShowQuick] = useState(false)
  const [showMore, setShowMore] = useState(false)

  return (
    <>
      {/* Quick actions overlay */}
      {showQuick && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setShowQuick(false)}>
          <div
            className="absolute bottom-20 left-4 right-4 bg-white rounded-2xl p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Acción rápida</h3>
              <button onClick={() => setShowQuick(false)} className="p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  onClick={() => setShowQuick(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <action.icon className="h-5 w-5 text-[#1B4332]" />
                  <span className="text-sm font-medium">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* More menu overlay */}
      {showMore && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setShowMore(false)}>
          <div
            className="absolute bottom-20 left-4 right-4 bg-white rounded-2xl p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Más opciones</h3>
              <button onClick={() => setShowMore(false)} className="p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {moreItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMore(false)}
                  className="p-3 rounded-lg hover:bg-muted transition-colors text-sm font-medium text-center"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-border lg:hidden safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {mainItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-12",
                  isActive ? "text-[#1B4332]" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}

          {/* Center action button */}
          <button
            onClick={() => setShowQuick(true)}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-[#1B4332] text-white shadow-lg -mt-4"
          >
            <Plus className="h-7 w-7" />
          </button>

          {rightItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-12",
                  isActive ? "text-[#1B4332]" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}

          <button
            onClick={() => setShowMore(true)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-12",
              "text-muted-foreground"
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[10px] font-medium">Más</span>
          </button>
        </div>
      </nav>
    </>
  )
}
