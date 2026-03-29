'use client'

import { Bell, Menu } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-white px-4 lg:px-6">
      {/* Left: hamburger (mobile) + logo */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>

        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            H
          </div>
          <span className="font-bold text-foreground">HatoAI</span>
        </div>

        <div className="hidden lg:block">
          <h2 className="text-sm font-semibold text-foreground">Rancho Santa Cruz</h2>
          <p className="text-xs text-muted-foreground">UPP: MX-AGS-0012345</p>
        </div>
      </div>

      {/* Right: notifications + avatar */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 items-center justify-center p-0 text-[10px]">
            3
          </Badge>
          <span className="sr-only">Notificaciones</span>
        </Button>

        <Avatar className="h-9 w-9 cursor-pointer">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
            JC
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
