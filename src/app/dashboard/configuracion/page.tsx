'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Settings, User, MapPin, CreditCard, Smartphone, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/auth-store'
import { useRanchStore } from '@/lib/store/ranch-store'
import { useToastNotifications } from '@/lib/hooks/use-toast-notifications'

export default function ConfiguracionPage() {
  const toast = useToastNotifications()
  const user = useAuthStore((s) => s.user)
  const currentRanch = useRanchStore((s) => s.currentRanch)
  const setCurrentRanch = useRanchStore((s) => s.setCurrentRanch)
  const setUser = useAuthStore((s) => s.setUser)

  const [nombre, setNombre] = useState(user?.nombre ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [telefono, setTelefono] = useState(user?.telefono ?? '')
  const [savingProfile, setSavingProfile] = useState(false)

  const [ranchoNombre, setRanchoNombre] = useState(currentRanch?.nombre ?? '')
  const [ranchoUbicacion, setRanchoUbicacion] = useState(
    currentRanch ? `${currentRanch.municipio ?? ''}, ${currentRanch.estado ?? ''}` : ''
  )
  const [savingRanch, setSavingRanch] = useState(false)

  useEffect(() => {
    if (user) {
      setNombre(user.nombre ?? '')
      setEmail(user.email ?? '')
      setTelefono(user.telefono ?? '')
    }
  }, [user])

  useEffect(() => {
    if (currentRanch) {
      setRanchoNombre(currentRanch.nombre ?? '')
      setRanchoUbicacion(
        `${currentRanch.municipio ?? ''}, ${currentRanch.estado ?? ''}`
      )
    }
  }, [currentRanch])

  const handleSaveProfile = async () => {
    if (!user) return
    setSavingProfile(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('perfiles')
        .update({
          nombre,
          email: email || null,
          telefono: telefono || null,
        })
        .eq('id', user.id)

      if (error) throw error

      setUser({ ...user, nombre, email, telefono })
      toast.success('Perfil actualizado', 'Los cambios se guardaron correctamente.')
    } catch (err: any) {
      toast.error('Error al guardar', err.message || 'Intenta de nuevo.')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleSaveRanch = async () => {
    if (!currentRanch) return
    setSavingRanch(true)
    try {
      const supabase = createClient()
      // Parse ubicacion into municipio + estado
      const parts = ranchoUbicacion.split(',').map((s) => s.trim())
      const municipio = parts[0] || currentRanch.municipio
      const estado = parts[1] || currentRanch.estado

      const { error } = await supabase
        .from('ranchos')
        .update({
          nombre: ranchoNombre,
          municipio,
          estado,
        })
        .eq('id', currentRanch.id)

      if (error) throw error

      setCurrentRanch({
        ...currentRanch,
        nombre: ranchoNombre,
        municipio,
        estado,
      })
      toast.success('Rancho actualizado', 'Los cambios se guardaron correctamente.')
    } catch (err: any) {
      toast.error('Error al guardar', err.message || 'Intenta de nuevo.')
    } finally {
      setSavingRanch(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Configuracion
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
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electronico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefono">Telefono</Label>
            <Input
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>
          <Button onClick={handleSaveProfile} disabled={savingProfile}>
            {savingProfile && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {savingProfile ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </CardContent>
      </Card>

      {/* Rancho */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            Rancho
          </CardTitle>
          <CardDescription>Informacion de la unidad de produccion</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rancho">Nombre del rancho</Label>
            <Input
              id="rancho"
              value={ranchoNombre}
              onChange={(e) => setRanchoNombre(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ubicacion">Ubicacion (municipio, estado)</Label>
            <Input
              id="ubicacion"
              value={ranchoUbicacion}
              onChange={(e) => setRanchoUbicacion(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Especies registradas</Label>
            <div className="flex flex-wrap gap-2">
              {(currentRanch?.especies_activas ?? []).map((sp) => (
                <Badge key={sp} variant="secondary">
                  {sp.charAt(0).toUpperCase() + sp.slice(1)}
                </Badge>
              ))}
              {(!currentRanch?.especies_activas || currentRanch.especies_activas.length === 0) && (
                <span className="text-sm text-muted-foreground">Sin especies configuradas</span>
              )}
            </div>
          </div>
          <Button onClick={handleSaveRanch} disabled={savingRanch}>
            {savingRanch && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {savingRanch ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </CardContent>
      </Card>

      {/* Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-purple-600" />
            Plan Actual
          </CardTitle>
          <CardDescription>Detalles de tu suscripcion</CardDescription>
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
            <p>Renovacion: 1 de abril 2026</p>
            <p>Cabezas registradas: 12 de 50</p>
            <p>Insights de IA: Incluidos</p>
          </div>
          <Button variant="outline">Cambiar plan</Button>
        </CardContent>
      </Card>

      {/* Instalar App */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-green-700" />
            Instalar HatoAI
          </CardTitle>
          <CardDescription>Usa HatoAI como aplicacion en tu celular</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg border bg-green-50 text-sm space-y-2">
            <p className="font-semibold">Para instalar HatoAI en tu celular:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Abre esta pagina en Chrome</li>
              <li>Toca los tres puntos en la esquina superior</li>
              <li>Selecciona &quot;Instalar aplicacion&quot; o &quot;Agregar a pantalla de inicio&quot;</li>
            </ol>
            <p className="text-muted-foreground">
              Una vez instalada, HatoAI funcionara sin conexion a internet, ideal para zonas rurales con senal limitada.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
