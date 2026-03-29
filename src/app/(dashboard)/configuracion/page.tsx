import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Settings, User, MapPin, CreditCard } from 'lucide-react'

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Configuración
        </h1>
        <p className="text-muted-foreground">
          Administra tu perfil, rancho y plan
        </p>
      </div>

      {/* Perfil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Perfil
          </CardTitle>
          <CardDescription>Datos personales del productor</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre completo</Label>
            <Input id="nombre" defaultValue="Juan Pérez García" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" defaultValue="juan.perez@correo.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input id="telefono" defaultValue="+52 614 123 4567" />
          </div>
          <Button>Guardar cambios</Button>
        </CardContent>
      </Card>

      {/* Rancho */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            Rancho
          </CardTitle>
          <CardDescription>Información de la unidad de producción</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rancho">Nombre del rancho</Label>
            <Input id="rancho" defaultValue="Rancho El Porvenir" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ubicacion">Ubicación</Label>
            <Input id="ubicacion" defaultValue="Aldama, Chihuahua, México" />
          </div>
          <div className="space-y-2">
            <Label>Especies registradas</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Bovinos</Badge>
              <Badge variant="secondary">Porcinos</Badge>
              <Badge variant="secondary">Equinos</Badge>
            </div>
          </div>
          <Button>Guardar cambios</Button>
        </CardContent>
      </Card>

      {/* Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-purple-600" />
            Plan Actual
          </CardTitle>
          <CardDescription>Detalles de tu suscripción</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-purple-50">
            <div>
              <p className="font-bold text-lg">Plan Productor</p>
              <p className="text-sm text-muted-foreground">Hasta 50 cabezas</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-600">$149</p>
              <p className="text-xs text-muted-foreground">MXN / mes</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Renovación: 1 de abril 2026</p>
            <p>Cabezas registradas: 12 de 50</p>
            <p>Insights de IA: Incluidos</p>
          </div>
          <Button variant="outline">Cambiar plan</Button>
        </CardContent>
      </Card>
    </div>
  )
}
