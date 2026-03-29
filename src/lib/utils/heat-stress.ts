// THI = Temperature-Humidity Index for livestock heat stress
// Formula: THI = (1.8 × T + 32) - (0.55 - 0.0055 × RH) × (1.8 × T - 26)
// Where T = temperature in °C, RH = relative humidity in %

export function calculateTHI(temperatureC: number, humidityPct: number): number {
  const T = temperatureC
  const RH = humidityPct
  return Number(((1.8 * T + 32) - (0.55 - 0.0055 * RH) * (1.8 * T - 26)).toFixed(1))
}

export function getTHICategory(thi: number): {
  nivel: string
  color: string
  descripcion: string
  accion: string
} {
  if (thi < 72) return {
    nivel: 'Normal',
    color: 'text-green-600',
    descripcion: 'Sin estrés calórico. Condiciones normales para el ganado.',
    accion: 'Ninguna acción especial requerida.',
  }
  if (thi < 79) return {
    nivel: 'Alerta',
    color: 'text-yellow-600',
    descripcion: 'Estrés calórico leve. El ganado puede reducir consumo de alimento.',
    accion: 'Asegurar acceso a agua fresca y sombra. Evitar manejo entre 11am-3pm.',
  }
  if (thi < 89) return {
    nivel: 'Peligro',
    color: 'text-orange-600',
    descripcion: 'Estrés calórico moderado-severo. Riesgo de reducción en producción de leche y fertilidad.',
    accion: 'Activar ventiladores/aspersores. No mover ganado. Ofrecer electrolitos. Posponer vacunaciones.',
  }
  return {
    nivel: 'Emergencia',
    color: 'text-red-600',
    descripcion: 'Estrés calórico severo. Riesgo de muerte, especialmente en animales gordos y/o gestantes.',
    accion: 'Emergencia: mojar animales, maximizar sombra, NO mover ganado. Monitorear respiración.',
  }
}

// Estimate milk production loss due to heat stress (bovinos)
export function estimateMilkLoss(thi: number, baseLiters: number): number {
  if (thi < 72) return 0
  if (thi < 79) return Number((baseLiters * 0.05).toFixed(1)) // 5% loss
  if (thi < 89) return Number((baseLiters * 0.15).toFixed(1)) // 15% loss
  return Number((baseLiters * 0.30).toFixed(1)) // 30% loss
}
