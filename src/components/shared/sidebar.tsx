'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Warehouse,
  Heart,
  Scale,
  Stethoscope,
  Wheat,
  DollarSign,
  Brain,
  HeartPulse,
  Zap,
  Sparkles,
  TrendingUp,
  FileText,
  Settings,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Inventario', href: '/dashboard/inventario', icon: Warehouse },
  { label: 'Reproducción', href: '/dashboard/reproduccion', icon: Heart },
  { label: 'Pesajes', href: '/dashboard/pesajes', icon: Scale },
  { label: 'Sanidad', href: '/dashboard/sanidad', icon: Stethoscope },
  { label: 'Alimentación', href: '/dashboard/alimentacion', icon: Wheat },
  { label: 'Económico', href: '/dashboard/economico', icon: DollarSign },
  { label: 'AI Insights', href: '/dashboard/ai-insights', icon: Brain },
  { label: 'Captura Rápida', href: '/dashboard/captura-rapida', icon: Zap },
  { label: 'Veterinario AI', href: '/dashboard/veterinario', icon: HeartPulse },
  { label: 'Predicciones', href: '/dashboard/predicciones', icon: Sparkles },
  { label: 'Mercado', href: '/dashboard/mercado', icon: TrendingUp },
  { label: 'Reportes', href: '/dashboard/reportes', icon: FileText },
  { label: 'Configuración', href: '/dashboard/configuracion', icon: Settings },
  { label: 'Cumplimiento', href: '/dashboard/cumplimiento', icon: ShieldCheck },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex h-full flex-col bg-white border-r border-border">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
            H
          </div>
          <div>
            <span className="font-bold text-lg text-foreground">HatoAI</span>
            <p className="text-xs text-muted-foreground leading-none">Registro Ganadero</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <p className="text-xs text-muted-foreground text-center">
            HatoAI v1.0
          </p>
        </div>
      </div>
    </aside>
  )
}
