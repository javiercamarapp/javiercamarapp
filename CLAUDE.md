# HatoAI — CLAUDE.md

## Qué es HatoAI
Plataforma SaaS de gestión pecuaria integral con AI para productores y gobierno de México.
9 especies del PGN | B2C SaaS | B2G Gobierno | AI | Fintech-ready | Offline-first

## Tech Stack
- Next.js 14 (App Router) + TypeScript strict
- Tailwind CSS + shadcn/ui (New York style)
- Supabase (Auth + PostgreSQL + Storage + Edge Functions)
- TanStack Query v5 + Zustand
- Recharts + Leaflet
- Claude API (claude-sonnet-4-20250514)

## Comandos
```bash
npm run dev          # Desarrollo local
npm run build        # Build producción
npm run lint         # ESLint
```

## Estructura del Proyecto
```
src/
├── app/
│   ├── (auth)/          # Login, Register, Forgot Password
│   ├── auth/callback/   # OAuth callback
│   ├── dashboard/       # App del productor (B2C)
│   ├── gobierno/        # Portal gobierno (B2G)
│   ├── onboarding/      # Wizard 5 pasos
│   └── api/ai/          # AI endpoints
├── components/
│   ├── ui/              # shadcn/ui (25+ componentes)
│   ├── shared/          # Sidebar, Topbar, MobileNav, FAB, KPICard
│   ├── dashboard/       # KPI cards, alerts, timeline
│   └── onboarding/      # 5 step components
├── lib/
│   ├── supabase/        # Client, Server, Middleware
│   ├── store/           # Zustand (auth-store, ranch-store)
│   ├── hooks/           # TanStack Query (9 hooks)
│   ├── validations/     # Zod schemas
│   ├── species/         # SPECIES_CONFIG (9 especies)
│   └── ai/              # Prompts, insights, credit-score
├── types/               # database.ts
└── supabase/migrations/ # 4 SQL files (1,480 lines)
```

## Reglas Críticas
1. TODO en español (México) — labels, placeholders, mensajes, alertas
2. Mobile-first — viewport 375px primero, luego desktop
3. Offline-first — formularios funcionan sin internet
4. SINIIGA es central — cada animal DEBE tener campo de arete
5. Gobierno es read-only — no puede editar datos de ranchos
6. Multi-tenant — RLS en Supabase, usuarios solo ven SUS ranchos
7. Brand colors — primario #1B6B3C, fondo blanco, alertas amber #D97706
8. Soft delete — NUNCA borrar registros, solo marcar estado='inactivo'

## Base de Datos
25+ tablas en Supabase PostgreSQL. Schema completo en src/supabase/migrations/.
Ejecutar en orden: 001 → 002 → 003 → 004

## AI Sub-agentes
9 sub-agentes especializados por especie:
BovAI, PorcAI, OviAI, CapriAI, AviAI, ApiAI, EquiAI, CuniAI, DivAI
Orquestador principal prioriza por impacto económico.

## Variables de Entorno
Ver .env.local.example para configuración de Supabase y Anthropic.
