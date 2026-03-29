'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Warehouse,
  Heart,
  Stethoscope,
  MoreHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Inventario', href: '/inventario', icon: Warehouse },
  { label: 'Reproduccion', href: '/reproduccion', icon: Heart },
  { label: 'Sanidad', href: '/sanidad', icon: Stethoscope },
  { label: 'Mas', href: '/mas', icon: MoreHorizontal },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white lg:hidden">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <tab.icon className={cn('h-5 w-5', isActive && 'text-primary')} />
              {tab.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
