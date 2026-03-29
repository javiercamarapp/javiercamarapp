'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, MapPin, Shield, Bell, TrendingDown, Bug } from 'lucide-react'

const ALERTAS = [
  {
    id: 1,
    tipo: 'sanitaria',
    severidad: 'critica',
    titulo: 'Posible brote de derriengue en municipio de Candelaria',
    descripcion: '3 ranchos reportaron mortalidad bovina con signos neurologicos en los ultimos 7 dias. Patron consistente con rabia paralitica (derriengue). SENASICA debe ser notificado.',
    municipio: 'Candelaria',
    ranchos_afectados: 3,
    animales_afectados: 8,
    fecha: '2026-03-28',
    accion: 'Activar brigada de vacunacion antirrabica de emergencia',
    icon: Bug,
  },
  {
    id: 2,
    tipo: 'climatica',
    severidad: 'alta',
    titulo: 'Sequia prolongada afecta 12 municipios -- forraje en minimos',
    descripcion: 'NDVI promedio de la region bajo a 0.28 (normal: 0.45). Los ranchos del programa reportan consumo de reservas de heno. Sin lluvia en los proximos 10 dias.',
    municipio: 'Regional',
    ranchos_afectados: 45,
    animales_afectados: 3200,
    fecha: '2026-03-25',
    accion: 'Activar programa de emergencia alimentaria -- distribucion de pacas',
    icon: TrendingDown,
  },
  {
    id: 3,
    tipo: 'sanitaria',
    severidad: 'media',
    titulo: 'Mortalidad elevada en lotes avicolas -- municipio de Carmen',
    descripcion: '2 granjas avicolas reportaron mortalidad >3% diaria esta semana. Posible Newcastle o bronquitis infecciosa. Requiere muestreo de laboratorio.',
    municipio: 'Carmen',
    ranchos_afectados: 2,
    animales_afectados: 450,
    fecha: '2026-03-27',
    accion: 'Enviar equipo de muestreo SENASICA + cuarentena preventiva',
    icon: AlertTriangle,
  },
  {
    id: 4,
    tipo: 'programa',
    severidad: 'baja',
    titulo: '15 beneficiarios sin actividad en 30+ dias',
    descripcion: 'Productores del programa Renacer Ganadero no han registrado actividad. Posible abandono o falta de capacitacion en la plataforma.',
    municipio: 'Varios',
    ranchos_afectados: 15,
    animales_afectados: 0,
    fecha: '2026-03-29',
    accion: 'Programar visitas de seguimiento con promotores de campo',
    icon: Bell,
  },
]

const severidadStyles: Record<string, { badge: string; border: string }> = {
  critica: { badge: 'bg-red-600 text-white', border: 'border-l-red-600' },
  alta: { badge: 'bg-amber-600 text-white', border: 'border-l-amber-600' },
  media: { badge: 'bg-yellow-500 text-white', border: 'border-l-yellow-500' },
  baja: { badge: 'bg-blue-500 text-white', border: 'border-l-blue-500' },
}

export default function GobiernoAlertasPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-600" />
            Sistema de Alerta Temprana
          </h1>
          <p className="text-muted-foreground text-sm">
            Alertas generadas automaticamente por HatoAI basadas en datos de {45} ranchos del programa
          </p>
        </div>
        <Badge variant="outline" className="text-red-600 border-red-300">
          {ALERTAS.filter(a => a.severidad === 'critica').length} alertas criticas
        </Badge>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-600">
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-red-600">{ALERTAS.filter(a => a.severidad === 'critica').length}</p>
            <p className="text-xs text-muted-foreground">Criticas</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{ALERTAS.filter(a => a.severidad === 'alta').length}</p>
            <p className="text-xs text-muted-foreground">Altas</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{ALERTAS.filter(a => a.severidad === 'media').length}</p>
            <p className="text-xs text-muted-foreground">Medias</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{ALERTAS.filter(a => a.severidad === 'baja').length}</p>
            <p className="text-xs text-muted-foreground">Bajas</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {ALERTAS.map((alerta) => {
          const styles = severidadStyles[alerta.severidad]
          const Icon = alerta.icon
          return (
            <Card key={alerta.id} className={`border-l-4 ${styles.border}`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-muted">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{alerta.titulo}</h3>
                      <Badge className={styles.badge}>{alerta.severidad}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alerta.descripcion}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{alerta.municipio}</span>
                      <span>{alerta.ranchos_afectados} ranchos</span>
                      {alerta.animales_afectados > 0 && <span>{alerta.animales_afectados.toLocaleString()} animales</span>}
                      <span>{alerta.fecha}</span>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded p-2 text-sm">
                      <span className="font-medium text-primary">Accion recomendada:</span> {alerta.accion}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
