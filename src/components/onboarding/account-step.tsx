'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface AccountStepProps {
  onNext: (data: Record<string, any>) => void
}

export function AccountStep({ onNext }: AccountStepProps) {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) return
    onNext({ nombre: nombre.trim(), telefono: telefono.trim(), email: email.trim() })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tu cuenta</CardTitle>
        <CardDescription>
          Cuéntanos un poco sobre ti para personalizar tu experiencia.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre completo *</Label>
            <Input
              id="nombre"
              placeholder="Ej. Juan Pérez García"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              type="tel"
              placeholder="Ej. 55 1234 5678"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Opcional. Lo usaremos solo para notificaciones importantes.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="Ej. juan@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Opcional. Para recibir reportes y respaldos.
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={!nombre.trim()}>
              Siguiente
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
