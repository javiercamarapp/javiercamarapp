"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Syringe, Calendar } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export interface EventoSanitario {
  id: string
  fecha: string
  tipo: string
  producto?: string | null
  dosis?: string | null
  via?: string | null
  veterinario?: string | null
  notas?: string | null
  fecha_fin_retiro?: string | null
}

export interface ProximaVacuna {
  nombre: string
  fecha_programada: string
}

interface HealthRecordProps {
  eventos: EventoSanitario[]
  proximasVacunas?: ProximaVacuna[]
}

const TIPO_COLORS: Record<string, string> = {
  vacunacion: "bg-blue-100 text-blue-800 border-blue-200",
  desparasitacion: "bg-purple-100 text-purple-800 border-purple-200",
  tratamiento: "bg-yellow-100 text-yellow-800 border-yellow-200",
  cirugia: "bg-red-100 text-red-800 border-red-200",
  diagnostico: "bg-cyan-100 text-cyan-800 border-cyan-200",
  revision: "bg-green-100 text-green-800 border-green-200",
}

function getTipoColor(tipo: string): string {
  const key = tipo.toLowerCase().replace(/[áéíóú]/g, (c) => {
    const map: Record<string, string> = { á: "a", é: "e", í: "i", ó: "o", ú: "u" }
    return map[c] || c
  })
  return TIPO_COLORS[key] || "bg-gray-100 text-gray-800 border-gray-200"
}

function isRetiroActivo(fechaFinRetiro: string): boolean {
  return new Date(fechaFinRetiro) > new Date()
}

export function HealthRecord({ eventos, proximasVacunas }: HealthRecordProps) {
  const sortedEventos = [...eventos].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  )

  return (
    <div className="space-y-6">
      {/* Proximas vacunas */}
      {proximasVacunas && proximasVacunas.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Syringe className="h-4 w-4" />
              Proximas vacunas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {proximasVacunas.map((vacuna, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm border rounded-lg px-3 py-2"
                >
                  <span className="font-medium">{vacuna.nombre}</span>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(vacuna.fecha_programada), "dd MMM yyyy", { locale: es })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historial */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Historial sanitario</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedEventos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Sin eventos sanitarios registrados
            </p>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[7px] top-3 bottom-3 w-px bg-border" />

              <div className="space-y-4">
                {sortedEventos.map((evento) => {
                  const retiroActivo =
                    evento.fecha_fin_retiro && isRetiroActivo(evento.fecha_fin_retiro)

                  return (
                    <div key={evento.id} className="relative pl-6">
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-[#2D6A4F] bg-background" />

                      <div className="border rounded-lg p-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Badge className={getTipoColor(evento.tipo)}>
                              {evento.tipo}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(evento.fecha), "dd MMM yyyy", {
                                locale: es,
                              })}
                            </span>
                          </div>
                          {retiroActivo && (
                            <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              <AlertTriangle className="h-3 w-3" />
                              <span>
                                Retiro hasta{" "}
                                {format(
                                  new Date(evento.fecha_fin_retiro!),
                                  "dd MMM yyyy",
                                  { locale: es }
                                )}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 mt-2 text-xs">
                          {evento.producto && (
                            <div>
                              <span className="text-muted-foreground">Producto:</span>{" "}
                              <span className="font-medium">{evento.producto}</span>
                            </div>
                          )}
                          {evento.dosis && (
                            <div>
                              <span className="text-muted-foreground">Dosis:</span>{" "}
                              <span className="font-medium">{evento.dosis}</span>
                            </div>
                          )}
                          {evento.via && (
                            <div>
                              <span className="text-muted-foreground">Via:</span>{" "}
                              <span className="font-medium">{evento.via}</span>
                            </div>
                          )}
                          {evento.veterinario && (
                            <div>
                              <span className="text-muted-foreground">Veterinario:</span>{" "}
                              <span className="font-medium">{evento.veterinario}</span>
                            </div>
                          )}
                        </div>

                        {evento.notas && (
                          <p className="text-xs text-muted-foreground mt-2 italic">
                            {evento.notas}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
