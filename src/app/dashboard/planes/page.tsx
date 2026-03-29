'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, Crown, Zap, Building2 } from 'lucide-react'

const PLANES = [
  {
    id: 'gratis',
    nombre: 'Gratis',
    precio: 0,
    periodo: 'siempre',
    descripcion: 'Para empezar a digitalizar tu rancho',
    icon: Zap,
    color: 'border-gray-200',
    popular: false,
    features: [
      { nombre: 'Hasta 20 animales', incluido: true },
      { nombre: 'Registro básico (inventario)', incluido: true },
      { nombre: '1 especie', incluido: true },
      { nombre: 'Dashboard con KPIs', incluido: true },
      { nombre: 'App móvil (PWA)', incluido: true },
      { nombre: 'AI Insights', incluido: false },
      { nombre: 'Veterinario AI', incluido: false },
      { nombre: 'Captura por voz/WhatsApp', incluido: false },
      { nombre: 'Predicciones AI', incluido: false },
      { nombre: 'Reportes PDF', incluido: false },
      { nombre: 'Credit Score', incluido: false },
      { nombre: 'Soporte prioritario', incluido: false },
    ],
  },
  {
    id: 'productor',
    nombre: 'Productor',
    precio: 349,
    periodo: '/mes',
    descripcion: 'Para el ganadero que quiere crecer',
    icon: Crown,
    color: 'border-primary',
    popular: true,
    trial: '7 días gratis',
    features: [
      { nombre: 'Hasta 200 animales', incluido: true },
      { nombre: 'Registro completo multi-especie', incluido: true },
      { nombre: 'Hasta 3 especies', incluido: true },
      { nombre: 'Dashboard con KPIs avanzados', incluido: true },
      { nombre: 'App móvil (PWA) + offline', incluido: true },
      { nombre: 'AI Insights (5/semana)', incluido: true },
      { nombre: 'Veterinario AI (10 consultas/mes)', incluido: true },
      { nombre: 'Captura por voz/WhatsApp', incluido: false },
      { nombre: 'Predicciones AI', incluido: true },
      { nombre: 'Reportes PDF', incluido: true },
      { nombre: 'Credit Score', incluido: true },
      { nombre: 'Soporte por WhatsApp', incluido: true },
    ],
  },
  {
    id: 'profesional',
    nombre: 'Profesional',
    precio: 699,
    periodo: '/mes',
    descripcion: 'Para ranchos tecnificados y asociaciones',
    icon: Crown,
    color: 'border-amber-500',
    popular: false,
    trial: '7 días gratis',
    features: [
      { nombre: 'Animales ilimitados', incluido: true },
      { nombre: 'Registro completo multi-especie', incluido: true },
      { nombre: '9 especies (todas)', incluido: true },
      { nombre: 'Dashboard avanzado + benchmark', incluido: true },
      { nombre: 'PWA + offline + sincronización', incluido: true },
      { nombre: 'AI Insights ilimitados', incluido: true },
      { nombre: 'Veterinario AI ilimitado', incluido: true },
      { nombre: 'Captura por voz + WhatsApp', incluido: true },
      { nombre: 'Predicciones AI + mercado', incluido: true },
      { nombre: 'Reportes PDF + exportar Excel', incluido: true },
      { nombre: 'Credit Score + solicitud crédito', incluido: true },
      { nombre: 'Soporte prioritario 24/7', incluido: true },
    ],
  },
]

const PLAN_GOBIERNO = {
  id: 'gobierno',
  nombre: 'Gobierno (B2G)',
  precio: 499,
  periodo: '/licencia/mes',
  descripcion: 'Para dependencias y programas gubernamentales',
  icon: Building2,
  features: [
    'Dashboard ejecutivo con KPIs del programa',
    'Mapa de cobertura con Leaflet',
    'Reporte CONEVAL/MIR automático',
    'Detección de anomalías/fraude',
    'Sistema de alertas tempranas',
    'Gestión de licencias de productores',
    'Vista read-only de ranchos',
    'Exportar CSV/Excel/PDF',
    'Soporte dedicado + capacitación',
    'API de integración (próximamente)',
  ],
}

export default function PlanesPage() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Planes y Precios</h1>
        <p className="text-muted-foreground mt-2">
          Empieza gratis. Escala cuando crezcas. 7 días de prueba en planes de pago.
        </p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className={annual ? 'text-muted-foreground' : 'font-medium'}>Mensual</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-12 h-6 rounded-full transition-colors ${annual ? 'bg-primary' : 'bg-muted'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${annual ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
          <span className={annual ? 'font-medium' : 'text-muted-foreground'}>
            Anual <Badge variant="outline" className="ml-1 text-green-600">-20%</Badge>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {PLANES.map((plan) => {
          const Icon = plan.icon
          const precio = annual ? Math.round(plan.precio * 0.8) : plan.precio
          return (
            <Card key={plan.id} className={`relative ${plan.color} ${plan.popular ? 'border-2 shadow-lg' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-white">Más popular</Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <Icon className={`h-8 w-8 mx-auto mb-2 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                <CardTitle>{plan.nombre}</CardTitle>
                <CardDescription>{plan.descripcion}</CardDescription>
                <div className="mt-3">
                  {precio === 0 ? (
                    <span className="text-3xl font-bold">Gratis</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">${precio.toLocaleString('es-MX')}</span>
                      <span className="text-muted-foreground"> MXN{plan.periodo}</span>
                    </>
                  )}
                </div>
                {plan.trial && <Badge variant="outline" className="mt-2 text-green-600">{plan.trial}</Badge>}
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f.nombre} className="flex items-center gap-2 text-sm">
                      {f.incluido ? (
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-gray-300 flex-shrink-0" />
                      )}
                      <span className={f.incluido ? '' : 'text-muted-foreground'}>{f.nombre}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                  {precio === 0 ? 'Empezar gratis' : `Iniciar prueba de 7 días`}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* Plan Gobierno */}
      <Card className="border-2 border-[#1a1a2e] bg-[#1a1a2e]/5">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="h-8 w-8 text-[#1a1a2e]" />
                <div>
                  <h3 className="text-xl font-bold">{PLAN_GOBIERNO.nombre}</h3>
                  <p className="text-muted-foreground text-sm">{PLAN_GOBIERNO.descripcion}</p>
                </div>
              </div>
              <div className="mt-3 mb-4">
                <span className="text-2xl font-bold">${PLAN_GOBIERNO.precio}</span>
                <span className="text-muted-foreground"> MXN{PLAN_GOBIERNO.periodo}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {PLAN_GOBIERNO.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <Button size="lg">Solicitar demo</Button>
              <Button size="lg" variant="outline">Contactar ventas</Button>
              <p className="text-xs text-muted-foreground text-center">Mínimo 50 licencias</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>Todos los precios en MXN + IVA. Cancela cuando quieras. Sin permanencia.</p>
        <p className="mt-1">¿Eres parte de un programa de gobierno? Tu licencia puede ser cubierta por la dependencia.</p>
      </div>
    </div>
  )
}
