'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin } from 'lucide-react'

// Demo ranch data for Yucatán/Campeche
const ranchLocations = [
  { id: 1, nombre: 'Rancho Santa Cruz', lat: 21.1431, lng: -87.3919, municipio: 'Tizimín', cabezas: 45, estado: 'activo', licencia: 'activa' },
  { id: 2, nombre: 'Rancho El Porvenir', lat: 21.0876, lng: -87.4512, municipio: 'Tizimín', cabezas: 120, estado: 'activo', licencia: 'activa' },
  { id: 3, nombre: 'Rancho Las Palmas', lat: 20.9734, lng: -87.3211, municipio: 'Tizimín', cabezas: 78, estado: 'activo', licencia: 'pendiente' },
  { id: 4, nombre: 'Rancho San Miguel', lat: 18.8114, lng: -90.0307, municipio: 'Candelaria', cabezas: 200, estado: 'activo', licencia: 'activa' },
  { id: 5, nombre: 'Rancho La Esperanza', lat: 18.7432, lng: -90.1234, municipio: 'Candelaria', cabezas: 95, estado: 'inactivo', licencia: 'expirada' },
  { id: 6, nombre: 'Rancho Nuevo Amanecer', lat: 18.6512, lng: -91.8234, municipio: 'Carmen', cabezas: 150, estado: 'activo', licencia: 'activa' },
  { id: 7, nombre: 'Rancho El Paraíso', lat: 18.5912, lng: -90.7512, municipio: 'Escárcega', cabezas: 65, estado: 'activo', licencia: 'pendiente' },
  { id: 8, nombre: 'Rancho Los Cedros', lat: 20.4212, lng: -87.5123, municipio: 'Valladolid', cabezas: 35, estado: 'activo', licencia: 'activa' },
  { id: 9, nombre: 'Rancho La Ceiba', lat: 20.2312, lng: -89.6234, municipio: 'Mérida', cabezas: 88, estado: 'rezagado', licencia: 'activa' },
  { id: 10, nombre: 'Rancho Don Pedro', lat: 19.8456, lng: -90.5321, municipio: 'Campeche', cabezas: 110, estado: 'activo', licencia: 'activa' },
  { id: 11, nombre: 'Apiario Monte Alto', lat: 20.8912, lng: -87.2345, municipio: 'Tizimín', cabezas: 35, estado: 'activo', licencia: 'activa' },
  { id: 12, nombre: 'Rancho El Cenote', lat: 20.7123, lng: -88.1234, municipio: 'Izamal', cabezas: 42, estado: 'activo', licencia: 'pendiente' },
]

const statusColors: Record<string, string> = {
  activo: '#16A34A',
  inactivo: '#DC2626',
  rezagado: '#D97706',
}

const licenciaColors: Record<string, string> = {
  activa: '#16A34A',
  pendiente: '#D97706',
  expirada: '#DC2626',
}

export function CoverageMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || mapInstanceRef.current) return

    const initMap = async () => {
      const L = (await import('leaflet')).default

      // Inject Leaflet CSS if not already present
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      const map = L.map(mapRef.current!, {
        scrollWheelZoom: true,
        zoomControl: true,
      }).setView([19.8, -89.5], 7)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map)

      ranchLocations.forEach((ranch) => {
        const color = statusColors[ranch.estado] || '#6B7280'
        const licColor = licenciaColors[ranch.licencia] || '#6B7280'

        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            width: 24px; height: 24px; border-radius: 50%;
            background: ${color}; border: 3px solid ${licColor};
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex; align-items: center; justify-content: center;
            color: white; font-size: 10px; font-weight: bold;
          ">${ranch.cabezas > 99 ? '99+' : ranch.cabezas}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })

        L.marker([ranch.lat, ranch.lng], { icon })
          .bindPopup(`
            <div style="min-width: 200px; font-family: system-ui;">
              <h3 style="font-weight: bold; margin: 0 0 4px 0; font-size: 14px;">${ranch.nombre}</h3>
              <p style="margin: 0 0 2px 0; color: #666; font-size: 12px;">📍 ${ranch.municipio}</p>
              <p style="margin: 0 0 2px 0; font-size: 12px;">🐄 <strong>${ranch.cabezas}</strong> cabezas</p>
              <p style="margin: 0 0 2px 0; font-size: 12px;">
                Estado: <span style="color: ${color}; font-weight: bold;">${ranch.estado}</span>
              </p>
              <p style="margin: 0; font-size: 12px;">
                Licencia: <span style="color: ${licColor}; font-weight: bold;">${ranch.licencia}</span>
              </p>
            </div>
          `)
          .addTo(map)
      })

      // Legend
      const legend = (L.control as unknown as (opts: { position: string }) => L.Control)({ position: 'bottomright' })
      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'leaflet-control')
        div.style.cssText = 'background: white; padding: 8px 12px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); font-size: 11px;'
        div.innerHTML = `
          <div style="font-weight: bold; margin-bottom: 4px;">Estado del Rancho</div>
          <div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#16A34A;margin-right:4px;"></span> Activo</div>
          <div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#D97706;margin-right:4px;"></span> Rezagado</div>
          <div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#DC2626;margin-right:4px;"></span> Inactivo</div>
          <div style="font-weight: bold; margin: 6px 0 4px;">Borde = Licencia</div>
          <div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;border:2px solid #16A34A;margin-right:4px;"></span> Activa</div>
          <div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;border:2px solid #D97706;margin-right:4px;"></span> Pendiente</div>
          <div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;border:2px solid #DC2626;margin-right:4px;"></span> Expirada</div>
        `
        return div
      }
      legend.addTo(map)

      mapInstanceRef.current = map
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Mapa de Cobertura — Ranchos del Programa
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {ranchLocations.length} ranchos registrados en Yucatán y Campeche.
          Color del marcador = estado del rancho. Borde = estado de licencia.
        </p>
      </CardHeader>
      <CardContent>
        <div
          ref={mapRef}
          style={{ height: '450px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}
        />
      </CardContent>
    </Card>
  )
}
