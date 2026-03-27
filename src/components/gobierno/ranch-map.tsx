"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// ---------------------------------------------------------------------------
// Leaflet dynamic import — uncomment when ready to integrate
// ---------------------------------------------------------------------------
// import dynamic from "next/dynamic";
// const MapContainer = dynamic(
//   () => import("react-leaflet").then((m) => m.MapContainer),
//   { ssr: false }
// );
// const TileLayer = dynamic(
//   () => import("react-leaflet").then((m) => m.TileLayer),
//   { ssr: false }
// );
// const GeoJSON = dynamic(
//   () => import("react-leaflet").then((m) => m.GeoJSON),
//   { ssr: false }
// );

type MetricKey = "densidad" | "crecimiento" | "vacunacion";

interface Municipality {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

const MUNICIPALITIES: Municipality[] = [
  { name: "Mérida", x: 120, y: 80, width: 60, height: 50, color: "#22c55e" },
  { name: "Tizimín", x: 220, y: 40, width: 70, height: 55, color: "#16a34a" },
  { name: "Valladolid", x: 240, y: 110, width: 55, height: 45, color: "#4ade80" },
  { name: "Tekax", x: 160, y: 160, width: 65, height: 50, color: "#86efac" },
  { name: "Motul", x: 140, y: 30, width: 50, height: 40, color: "#bbf7d0" },
  { name: "Hunucmá", x: 60, y: 60, width: 50, height: 45, color: "#dcfce7" },
];

const METRIC_OPTIONS: { key: MetricKey; label: string }[] = [
  { key: "densidad", label: "Densidad ganadera" },
  { key: "crecimiento", label: "Crecimiento del hato" },
  { key: "vacunacion", label: "Cobertura vacunal" },
];

const LEGEND_ITEMS = [
  { color: "#16a34a", label: "Alta" },
  { color: "#4ade80", label: "Media" },
  { color: "#bbf7d0", label: "Baja" },
];

interface RanchMapProps {
  municipalities?: string[];
  onMunicipalitySelect?: (name: string) => void;
}

export function RanchMap({ onMunicipalitySelect }: RanchMapProps) {
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("");
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("densidad");

  function handleMunicipalityClick(name: string) {
    setSelectedMunicipality(name);
    onMunicipalitySelect?.(name);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Mapa Regional</CardTitle>
        <div className="flex flex-wrap gap-3 pt-2">
          {/* Municipality selector */}
          <select
            value={selectedMunicipality}
            onChange={(e) => handleMunicipalityClick(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
          >
            <option value="">Todos los municipios</option>
            {MUNICIPALITIES.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>

          {/* Metric selector */}
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as MetricKey)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
          >
            {METRIC_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent>
        {/* SVG Yucatan placeholder */}
        <div className="relative rounded-lg border bg-slate-50 p-4">
          <svg
            viewBox="0 0 360 240"
            className="h-auto w-full"
            role="img"
            aria-label="Mapa de la Península de Yucatán"
          >
            {/* Peninsula outline */}
            <path
              d="M 20,200 Q 20,20 180,10 Q 340,20 340,120 Q 340,220 200,230 Q 100,235 20,200 Z"
              fill="#f1f5f9"
              stroke="#94a3b8"
              strokeWidth="1.5"
            />

            {/* Municipality rectangles */}
            {MUNICIPALITIES.map((m) => {
              const isSelected = selectedMunicipality === m.name;
              return (
                <g
                  key={m.name}
                  className="cursor-pointer"
                  onClick={() => handleMunicipalityClick(m.name)}
                >
                  <rect
                    x={m.x}
                    y={m.y}
                    width={m.width}
                    height={m.height}
                    rx={4}
                    fill={m.color}
                    stroke={isSelected ? "#1B4332" : "#16a34a"}
                    strokeWidth={isSelected ? 2.5 : 1}
                    opacity={
                      selectedMunicipality === "" || isSelected ? 1 : 0.4
                    }
                  />
                  <text
                    x={m.x + m.width / 2}
                    y={m.y + m.height / 2 + 4}
                    textAnchor="middle"
                    className="pointer-events-none select-none fill-gray-800 text-[9px] font-medium"
                  >
                    {m.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="font-medium">
              {METRIC_OPTIONS.find((o) => o.key === selectedMetric)?.label}:
            </span>
            {LEGEND_ITEMS.map((item) => (
              <span key={item.label} className="flex items-center gap-1">
                <span
                  className="inline-block h-3 w-3 rounded"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
