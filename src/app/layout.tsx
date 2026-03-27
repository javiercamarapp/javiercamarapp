import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Providers } from "@/components/providers"

export const metadata: Metadata = {
  title: {
    default: "HatoAI — Gestión Pecuaria Inteligente",
    template: "%s | HatoAI",
  },
  description:
    "Plataforma SaaS de gestión pecuaria integral con inteligencia artificial para México. Bovinos, porcinos, ovinos, caprinos, aves, abejas, équidos, conejos y ganadería diversificada.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-512.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1B4332",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
