'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, Building2, Target } from 'lucide-react'
import Link from 'next/link'

const programas = [
  {
    id: 'renacer-ganadero-2026',
    nombre: 'Renacer Ganadero 2026',
    dependencia: 'SEDER Yucat\u00e1n',
    avance: 50,
    presupuesto: '$98,000,000',
    ejercido: '$42,000,000',
    beneficiarios: 25,
    metaBeneficiarios: 50,
    inicio: '15 ene 2026',
    fin: '31 dic 2026',
    estado: 'Activo',
    descripcion: 'Programa estatal de mejoramiento gen\u00e9tico y productivo para el sector ganadero. Inseminaci\u00f3n artificial, entrega de sementales y capacitaci\u00f3n t\u00e9cnica.',
  },
  {
    id: 'credito-ganadero-palabra',
    nombre: 'Cr\u00e9dito Ganadero a la Palabra',
    dependencia: 'SADER Federal',
    avance: 34,
    presupuesto: '$250,000,000',
    ejercido: '$85,000,000',
    beneficiarios: 1240,
    metaBeneficiarios: 3600,
    inicio: '1 feb 2026',
    fin: '31 dic 2026',
    estado: 'Activo',
    descripcion: 'Cr\u00e9ditos a tasa cero para adquisici\u00f3n de ganado bovino, ovino y caprino. Devoluci\u00f3n en especie al t\u00e9rmino del ciclo productivo.',
  },
  {
    id: 'mejoramiento-genetico-ovino',
    nombre: 'Mejoramiento Gen\u00e9tico Ovino',
    dependencia: 'SEDER Yucat\u00e1n',
    avance: 72,
    presupuesto: '$18,500,000',
    ejercido: '$13,320,000',
    beneficiarios: 86,
    metaBeneficiarios: 120,
    inicio: '10 ene 2026',
    fin: '30 nov 2026',
    estado: 'Activo',
    descripcion: 'Introducci\u00f3n de sementales de razas c\u00e1rnicas (Dorper, Katahdin, Pelibuey mejorado) para incrementar peso al destete y calidad de la canal.',
  },
  {
    id: 'plan-campeche-ganadero',
    nombre: 'Plan Campeche Ganadero',
    dependencia: 'SDA Campeche',
    avance: 45,
    presupuesto: '$65,000,000',
    ejercido: '$29,250,000',
    beneficiarios: 340,
    metaBeneficiarios: 750,
    inicio: '1 mar 2026',
    fin: '28 feb 2027',
    estado: 'Activo',
    descripcion: 'Plan integral de desarrollo ganadero para Campeche. Incluye infraestructura productiva, asistencia t\u00e9cnica y vinculaci\u00f3n comercial.',
  },
]

function getEstadoBadge(estado: string) {
  switch (estado) {
    case 'Activo':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Activo</Badge>
    case 'Finalizado':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Finalizado</Badge>
    case 'Suspendido':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspendido</Badge>
    default:
      return <Badge variant="outline">{estado}</Badge>
  }
}

function getAvanceColor(avance: number) {
  if (avance >= 70) return 'text-green-600'
  if (avance >= 40) return 'text-amber-600'
  return 'text-red-600'
}

export default function ProgramasPage() {
  return (
    <div className="space-y-6 mt-4">
      <div>
        <h2 className="text-2xl font-bold">Programas de Gobierno</h2>
        <p className="text-muted-foreground">
          Listado de programas ganaderos estatales y federales monitoreados por HatoAI
        </p>
      </div>

      {/* Resumen r\u00e1pido */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{programas.length}</p>
            <p className="text-sm text-muted-foreground">Programas activos</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-600">
              {programas.reduce((acc, p) => acc + p.beneficiarios, 0).toLocaleString('es-MX')}
            </p>
            <p className="text-sm text-muted-foreground">Beneficiarios actuales</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-purple-600">$431.5M</p>
            <p className="text-sm text-muted-foreground">Presupuesto total</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-amber-600">39%</p>
            <p className="text-sm text-muted-foreground">Avance promedio</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de programas */}
      <div className="space-y-4">
        {programas.map((prog) => (
          <Link key={prog.id} href={`/gobierno/programa/${prog.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary mb-4">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">{prog.nombre}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Building2 className="h-3.5 w-3.5" />
                      {prog.dependencia}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getEstadoBadge(prog.estado)}
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{prog.descripcion}</p>

                {/* Avance */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Target className="h-3.5 w-3.5" />
                      Avance general
                    </span>
                    <span className={`font-bold ${getAvanceColor(prog.avance)}`}>
                      {prog.avance}%
                    </span>
                  </div>
                  <Progress value={prog.avance} className="h-2.5" />
                </div>

                {/* Detalles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t text-sm">
                  <div>
                    <p className="text-muted-foreground">Presupuesto</p>
                    <p className="font-semibold">{prog.presupuesto}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ejercido</p>
                    <p className="font-semibold">{prog.ejercido}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Beneficiarios</p>
                    <p className="font-semibold">
                      {prog.beneficiarios.toLocaleString('es-MX')} / {prog.metaBeneficiarios.toLocaleString('es-MX')}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Periodo
                    </p>
                    <p className="font-semibold">{prog.inicio} - {prog.fin}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
