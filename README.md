# 🐄 HatoAI — Registro Ganadero Inteligente

**La plataforma integral de gestión pecuaria con IA para productores y gobierno de México.**

9 especies del PGN | B2C SaaS | B2G Gobierno | AI Agents | Fintech-ready | Offline-first

---

## ¿Qué es HatoAI?

HatoAI digitaliza la ganadería mexicana. Reemplaza libretas, formatos en papel y Excel con una plataforma inteligente que:

- **Para el ganadero**: Registra animales, pesajes, reproducción, sanidad y producción desde el celular — incluso sin internet. La IA predice partos, recomienda ventas, y diagnostica enfermedades.
- **Para el gobierno**: Dashboard en tiempo real de programas pecuarios con KPIs, mapa de cobertura, reportes CONEVAL automáticos, y detección de anomalías.

## Features Principales

### 🤖 IA que trabaja por ti
- **Captura Rápida**: Escribe "La Negra pesó 465 kg" y la IA estructura los datos automáticamente
- **Veterinario AI**: Diagnóstico veterinario en español con tratamiento, urgencia y prevención
- **Predicciones**: Partos, momento óptimo de venta, riesgo de enfermedades, proyección de peso
- **Agentes Autónomos**: Resumen semanal, alertas automáticas, pre-guía de tránsito REEMO
- **WhatsApp**: Envía datos por WhatsApp y la IA los registra
- **Voz**: Dicta al micrófono y Whisper transcribe en español

### 📊 Dashboard del Productor
- KPIs por especie (bovinos, porcinos, ovinos, caprinos, aves, abejas, equinos, conejos, diversificados)
- Inventario multi-especie con formulario dinámico
- Reproducción: panel de estados + calendario de partos
- Sanidad: kanban + campañas SENASICA
- Pesajes con gráficas de tendencia + GDP automático
- Producción: leche, huevo, miel
- Económico: P&L + credit score ganadero (7 variables)
- Clima: pronóstico + índice de estrés calórico (THI)
- Pasturas: monitoreo NDVI satelital
- Curvas de crecimiento Gompertz por raza
- Benchmarking anónimo regional

### 🏛️ Portal de Gobierno (B2G)
- Dashboard ejecutivo con 6 KPIs del programa
- Mapa interactivo Leaflet con estado de licencias por rancho
- Reportes CONEVAL/MIR auto-generados
- Detección de fraude (Ley de Benford + verificación cruzada)
- Sistema de alertas tempranas (brotes sanitarios, sequía, inactividad)
- Gestión de licencias (asignar, recordatorio, exportar CSV)
- Vista read-only de ranchos del programa
- Cumplimiento SINIIGA/SENASICA

### 💰 Planes
| Plan | Precio | Animales | Especies | AI |
|------|--------|----------|----------|----|
| Gratis | $0 | 20 | 1 | ❌ |
| Productor | $349 MXN/mes | 200 | 3 | Básico |
| Profesional | $699 MXN/mes | Ilimitado | 9 | Completo + WhatsApp |
| Gobierno | $499 MXN/licencia | — | — | Dashboard + CONEVAL |

7 días de prueba gratis en planes de pago. 20% descuento anual.

## Tech Stack

```
Frontend:   Next.js 14 (App Router) + TypeScript strict
Styling:    Tailwind CSS + shadcn/ui (New York)
State:      Zustand + TanStack Query v5
Charts:     Recharts (peso, leche, NDVI, radar, benchmark)
Maps:       Leaflet (mapa de ranchos gobierno)
Auth:       Supabase Auth (email + Google OAuth)
Database:   Supabase PostgreSQL (25+ tablas, RLS)
AI:         Claude API (9 sub-agentes por especie)
Voice:      OpenAI Whisper (transcripción español)
WhatsApp:   Meta Business API (webhook)
Satellite:  Agromonitoring API (NDVI gratuito)
PWA:        Offline indicator + manifest
```

## Setup Rápido

### 1. Clonar e instalar
```bash
git clone https://github.com/javiercamarapp/hato-ai.git
cd hato-ai
npm install
```

### 2. Configurar Supabase
1. Crea un proyecto en [supabase.com](https://supabase.com)
2. En **SQL Editor**, ejecuta en orden:
   - `src/supabase/migrations/001_initial_schema.sql`
   - `src/supabase/migrations/002_indexes_rls.sql`
   - `src/supabase/migrations/003_functions_triggers.sql`
   - `src/supabase/migrations/004_seed_data.sql`

### 3. Variables de entorno
```bash
cp .env.local.example .env.local
```
Edita `.env.local` con tus keys:
```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
ANTHROPIC_API_KEY=sk-ant-tu-key          # Para AI
OPENAI_API_KEY=sk-tu-key                  # Para voz (opcional)
```

### 4. Correr
```bash
npm run dev
# Abre http://localhost:3000
```

### 5. Deploy
```bash
# Vercel (recomendado)
vercel --prod

# O cualquier plataforma que soporte Next.js
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── (auth)/              # Login, Register, Forgot Password
│   ├── auth/callback/       # OAuth callback
│   ├── dashboard/           # 20+ páginas del productor
│   │   ├── inventario/      # Multi-especie + lotes + apiarios
│   │   ├── reproduccion/    # Estados + calendario + eventos
│   │   ├── sanidad/         # Kanban + campañas SENASICA
│   │   ├── pesajes/         # Gráficas + producción
│   │   ├── economico/       # P&L + credit score
│   │   ├── captura-rapida/  # NLP + voz
│   │   ├── veterinario/     # AI diagnóstico
│   │   ├── predicciones/    # AI predictivo
│   │   ├── mercado/         # Precios regionales
│   │   ├── clima/           # Pronóstico + THI
│   │   ├── pasturas/        # NDVI satelital
│   │   ├── crecimiento/     # Curvas Gompertz
│   │   ├── benchmark/       # Comparación regional
│   │   ├── agentes/         # AI agents hub
│   │   └── planes/          # Suscripción
│   ├── gobierno/            # Portal B2G
│   │   ├── programa/        # Detalle de programa
│   │   ├── ranchos/         # Vista read-only
│   │   ├── coneval/         # Reporte MIR
│   │   ├── fraude/          # Detección anomalías
│   │   ├── alertas/         # Alertas tempranas
│   │   └── licencias/       # Gestión licencias
│   └── api/                 # 17 API endpoints
│       ├── ai/              # Claude + Whisper
│       ├── reports/         # CONEVAL + SINIIGA
│       ├── satellite/       # NDVI
│       ├── webhooks/        # WhatsApp
│       └── health/          # Health check
├── components/
│   ├── ui/                  # shadcn/ui (30+ componentes)
│   ├── shared/              # Sidebar, Topbar, FAB, Skeletons
│   ├── dashboard/           # KPIs, alerts, timeline
│   ├── gobierno/            # CoverageMap
│   └── onboarding/          # 5 step components
├── lib/
│   ├── supabase/            # Client, Server, Middleware
│   ├── store/               # Zustand (auth, ranch)
│   ├── hooks/               # 10 TanStack Query hooks
│   ├── validations/         # Zod schemas
│   ├── species/             # SPECIES_CONFIG (9 especies)
│   ├── ai/                  # Prompts, client, credit-score, growth-curves
│   ├── constants.ts         # Enums y configuración
│   └── utils/               # CSV export, heat stress
└── supabase/migrations/     # 4 SQL files (1,500+ líneas)
```

## Base de Datos

25+ tablas PostgreSQL con Row Level Security:

| Categoría | Tablas |
|-----------|--------|
| Core | perfiles, ranchos, rancho_usuarios, corrales |
| Animales | animales, lotes, crias |
| Producción | pesajes, produccion_leche, produccion_lotes |
| Reproducción | eventos_reproductivos |
| Sanidad | eventos_sanitarios |
| Apicultura | apiarios, colmenas, revisiones_colmena, cosechas_miel |
| Economía | movimientos_economicos, inventario_alimentos, consumo_alimento |
| Gobierno | programas_gobierno, programa_ranchos |
| Sistema | alertas, activity_log, credit_score, documentos |

## 9 Sub-agentes AI por Especie

| Agente | Especie | Especialidad |
|--------|---------|-------------|
| BovAI | 🐄 Bovinos | GDP, tasa preñez, IPP, leche |
| PorcAI | 🐖 Porcinos | PSY, mortalidad predestete, FCR |
| OviAI | 🐑 Ovinos | FAMACHA, prolificidad, parasitosis |
| CapriAI | 🐐 Caprinos | Leche caprina, FAMACHA |
| AviAI | 🐔 Aves | % postura, FCR, Newcastle |
| ApiAI | 🐝 Abejas | Varroa, floración Yucatán, cosecha miel |
| EquiAI | 🐴 Equinos | Herraje, dental, AIE Coggins |
| CuniAI | 🐰 Conejos | Gazapos/año, RHDV2 |
| DivAI | 🦌 Otros | UMA, venado, búfalo |

## Seguridad

- Auth en todos los API endpoints (401 si no autenticado)
- Row Level Security en todas las tablas
- HMAC SHA-256 en webhook de WhatsApp
- Security headers: CSP, X-Frame-Options, XSS Protection
- Input validation con Zod
- LLM trust boundary (whitelist de campos, no systemPrompt del cliente)
- Open redirect protection en OAuth callback

## Licencia

Privado — © 2026 HatoAI. Todos los derechos reservados.
