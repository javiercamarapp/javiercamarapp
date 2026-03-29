'use client'

import { useState } from 'react'
import { Plus, Scale, Heart, Syringe, Milk, Receipt, XCircle, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

const quickActions = [
  { label: 'Registrar pesaje', icon: Scale, color: 'text-blue-600 bg-blue-50' },
  { label: 'Evento reproductivo', icon: Heart, color: 'text-pink-600 bg-pink-50' },
  { label: 'Evento sanitario', icon: Syringe, color: 'text-red-600 bg-red-50' },
  { label: 'Produccion', icon: Milk, color: 'text-amber-600 bg-amber-50' },
  { label: 'Compra/Venta', icon: Receipt, color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Muerte/Baja', icon: XCircle, color: 'text-gray-600 bg-gray-50' },
  { label: 'Nuevo animal', icon: PlusCircle, color: 'text-primary bg-secondary' },
]

export function QuickActionFAB() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="icon"
        className="fixed bottom-24 right-4 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 lg:bottom-6"
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Acciones rapidas</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader className="pb-4">
            <SheetTitle>Acciones rapidas</SheetTitle>
            <SheetDescription>Selecciona una accion para registrar</SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-3 pb-6 sm:grid-cols-4">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => setOpen(false)}
                className="flex flex-col items-center gap-2 rounded-xl p-3 transition-colors hover:bg-muted"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-center leading-tight">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
