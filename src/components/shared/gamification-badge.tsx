'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Flame, Star, Shield, Target } from 'lucide-react'

const BADGES = [
  { id: 'streak-7', nombre: 'Racha de 7 días', descripcion: 'Registraste datos 7 días seguidos', icon: Flame, color: 'text-orange-500', earned: true },
  { id: 'first-animal', nombre: 'Primer registro', descripcion: 'Registraste tu primer animal', icon: Star, color: 'text-yellow-500', earned: true },
  { id: 'sanidad-100', nombre: 'Hato sano', descripcion: '100% de vacunas al día', icon: Shield, color: 'text-green-500', earned: true },
  { id: 'streak-30', nombre: 'Racha de 30 días', descripcion: '30 días seguidos registrando', icon: Flame, color: 'text-red-500', earned: false },
  { id: 'credit-80', nombre: 'Score crediticio 80+', descripcion: 'Tu score crediticio superó 80', icon: Target, color: 'text-blue-500', earned: false },
  { id: 'top-productor', nombre: 'Top productor', descripcion: 'GDP en el top 25% de tu región', icon: Trophy, color: 'text-purple-500', earned: false },
]

export function GamificationBadges() {
  const earned = BADGES.filter(b => b.earned).length
  const total = BADGES.length

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold">Logros</h3>
          </div>
          <Badge variant="outline">{earned}/{total}</Badge>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {BADGES.map((badge) => {
            const Icon = badge.icon
            return (
              <div
                key={badge.id}
                className={`flex flex-col items-center text-center p-2 rounded-lg ${
                  badge.earned ? 'bg-muted' : 'bg-muted/30 opacity-40'
                }`}
              >
                <Icon className={`h-8 w-8 mb-1 ${badge.earned ? badge.color : 'text-gray-300'}`} />
                <p className="text-xs font-medium leading-tight">{badge.nombre}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
