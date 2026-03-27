"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

const ranchosData = [
  { id: "rancho-san-pedro", rancho: "Rancho San Pedro", propietario: "Juan Carlos Pech", municipio: "Tizimín", cabezas: 245, sementales: 3, crias: 18, ultimaActividad: "2026-03-25", status: "Activo" },
  { id: "hacienda-santa-rosa", rancho: "Hacienda Santa Rosa", propietario: "María Elena Canul", municipio: "Valladolid", cabezas: 180, sementales: 2, crias: 12, ultimaActividad: "2026-03-24", status: "Activo" },
  { id: "el-cenote", rancho: "El Cenote", propietario: "Roberto Dzul Poot", municipio: "Tekax", cabezas: 320, sementales: 4, crias: 22, ultimaActividad: "2026-03-22", status: "Activo" },
  { id: "los-aluxes", rancho: "Los Aluxes", propietario: "Fernando Chi May", municipio: "Mérida", cabezas: 95, sementales: 1, crias: 6, ultimaActividad: "2026-02-15", status: "Sin actividad" },
  { id: "rancho-nuevo", rancho: "Rancho Nuevo", propietario: "Patricia Balam Uc", municipio: "Motul", cabezas: 150, sementales: 2, crias: 10, ultimaActividad: "2026-03-20", status: "Activo" },
  { id: "san-miguel-kahua", rancho: "San Miguel Kahua", propietario: "Andrés Couoh Tun", municipio: "Oxkutzcab", cabezas: 275, sementales: 3, crias: 15, ultimaActividad: "2026-03-26", status: "Activo" },
  { id: "la-ceiba", rancho: "La Ceiba", propietario: "Laura Mex Chan", municipio: "Tizimín", cabezas: 410, sementales: 5, crias: 28, ultimaActividad: "2026-03-23", status: "Activo" },
  { id: "hacienda-uxmal", rancho: "Hacienda Uxmal", propietario: "Diego Nah Puc", municipio: "Santa Elena", cabezas: 60, sementales: 1, crias: 3, ultimaActividad: "2025-12-10", status: "Suspendido" },
  { id: "el-ramonal", rancho: "El Ramonal", propietario: "Carmen Tuz Hau", municipio: "Peto", cabezas: 190, sementales: 2, crias: 14, ultimaActividad: "2026-03-18", status: "Activo" },
  { id: "tres-hermanos", rancho: "Tres Hermanos", propietario: "Miguel Ángel Cen", municipio: "Valladolid", cabezas: 135, sementales: 2, crias: 9, ultimaActividad: "2026-01-05", status: "Sin actividad" },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Activo: "bg-green-100 text-green-700",
    "Sin actividad": "bg-amber-100 text-amber-700",
    Suspendido: "bg-red-100 text-red-700",
  }
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status] ?? "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  )
}

export default function RanchosPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("Todos")

  const filtered = ranchosData.filter((r) => {
    const matchesSearch =
      r.rancho.toLowerCase().includes(search.toLowerCase()) ||
      r.propietario.toLowerCase().includes(search.toLowerCase()) ||
      r.municipio.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "Todos" || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ranchos</h1>
        <p className="mt-1 text-sm text-gray-500">
          Padrón de ranchos inscritos en los programas ganaderos
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <Input
          placeholder="Buscar rancho, propietario o municipio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          {["Todos", "Activo", "Sin actividad", "Suspendido"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === s
                  ? "bg-[#1B4332] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">Rancho</th>
              <th className="px-4 py-3 font-medium text-gray-600">Propietario</th>
              <th className="px-4 py-3 font-medium text-gray-600">Municipio</th>
              <th className="px-4 py-3 font-medium text-gray-600 text-right">Cabezas</th>
              <th className="px-4 py-3 font-medium text-gray-600 text-right">Sementales</th>
              <th className="px-4 py-3 font-medium text-gray-600 text-right">Crías</th>
              <th className="px-4 py-3 font-medium text-gray-600">Última actividad</th>
              <th className="px-4 py-3 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/gobierno/ranchos/${r.id}`}
                    className="font-medium text-[#1B4332] hover:underline"
                  >
                    {r.rancho}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600">{r.propietario}</td>
                <td className="px-4 py-3 text-gray-600">{r.municipio}</td>
                <td className="px-4 py-3 text-right text-gray-900">{r.cabezas.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-gray-900">{r.sementales}</td>
                <td className="px-4 py-3 text-right text-gray-900">{r.crias}</td>
                <td className="px-4 py-3 text-gray-500">{r.ultimaActividad}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
