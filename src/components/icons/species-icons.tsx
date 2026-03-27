"use client"

import { type SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

export function BovinoIcon({ size = 48, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      <ellipse cx="32" cy="40" rx="20" ry="14" fill="#8B6914" />
      <ellipse cx="32" cy="38" rx="18" ry="12" fill="#A0782C" />
      <circle cx="24" cy="28" r="6" fill="#A0782C" />
      <circle cx="40" cy="28" r="6" fill="#A0782C" />
      <ellipse cx="32" cy="30" rx="10" ry="8" fill="#B8923E" />
      <circle cx="29" cy="28" r="2" fill="#1F2937" />
      <circle cx="35" cy="28" r="2" fill="#1F2937" />
      <ellipse cx="32" cy="33" rx="4" ry="2.5" fill="#D4A853" />
      <circle cx="30" cy="32.5" r="0.8" fill="#1F2937" />
      <circle cx="34" cy="32.5" r="0.8" fill="#1F2937" />
      <path d="M18 26 C16 20, 14 18, 12 20" stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M46 26 C48 20, 50 18, 52 20" stroke="#8B6914" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export function PorcinoIcon({ size = 48, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      <ellipse cx="32" cy="38" rx="18" ry="14" fill="#F4A0B0" />
      <ellipse cx="32" cy="36" rx="16" ry="12" fill="#F8B4C0" />
      <circle cx="32" cy="28" r="10" fill="#F8B4C0" />
      <ellipse cx="32" cy="31" rx="6" ry="4" fill="#F4A0B0" />
      <circle cx="30" cy="30.5" r="1" fill="#1F2937" />
      <circle cx="34" cy="30.5" r="1" fill="#1F2937" />
      <circle cx="28" cy="26" r="2.5" fill="#1F2937" />
      <circle cx="36" cy="26" r="2.5" fill="#1F2937" />
      <path d="M22 22 L20 18" stroke="#F4A0B0" strokeWidth="3" strokeLinecap="round" />
      <path d="M42 22 L44 18" stroke="#F4A0B0" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function OvinoIcon({ size = 48, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      <ellipse cx="32" cy="38" rx="18" ry="14" fill="#E8E0D0" />
      <circle cx="26" cy="34" r="5" fill="#F0EAE0" />
      <circle cx="38" cy="34" r="5" fill="#F0EAE0" />
      <circle cx="32" cy="30" r="6" fill="#F0EAE0" />
      <circle cx="28" cy="38" r="4" fill="#F0EAE0" />
      <circle cx="36" cy="38" r="4" fill="#F0EAE0" />
      <circle cx="32" cy="24" r="7" fill="#3D3D3D" />
      <circle cx="29" cy="23" r="1.5" fill="#FFFFFF" />
      <circle cx="35" cy="23" r="1.5" fill="#FFFFFF" />
      <circle cx="29" cy="23" r="0.8" fill="#1F2937" />
      <circle cx="35" cy="23" r="0.8" fill="#1F2937" />
    </svg>
  )
}

export function CaprinoIcon({ size = 48, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      <ellipse cx="32" cy="40" rx="16" ry="12" fill="#C4A882" />
      <ellipse cx="32" cy="38" rx="14" ry="10" fill="#D4B892" />
      <circle cx="32" cy="26" r="8" fill="#D4B892" />
      <circle cx="29" cy="25" r="1.5" fill="#1F2937" />
      <circle cx="35" cy="25" r="1.5" fill="#1F2937" />
      <path d="M30 29 Q32 31 34 29" stroke="#8B6914" strokeWidth="1.5" fill="none" />
      <path d="M24 22 L20 14" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
      <path d="M40 22 L44 14" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
      <path d="M30 30 Q30 34 29 36" stroke="#D4B892" strokeWidth="2" fill="none" />
    </svg>
  )
}

export function AveIcon({ size = 48, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      <ellipse cx="32" cy="40" rx="12" ry="10" fill="#D4782C" />
      <ellipse cx="32" cy="38" rx="10" ry="8" fill="#E8923E" />
      <circle cx="32" cy="24" r="8" fill="#E8923E" />
      <circle cx="30" cy="22" r="1.5" fill="#1F2937" />
      <circle cx="34" cy="22" r="1.5" fill="#1F2937" />
      <path d="M28 26 L24 27 L28 28" fill="#E8641E" />
      <path d="M30 18 Q32 14 34 18" fill="#DC2626" />
      <rect x="26" y="48" width="3" height="6" rx="1" fill="#E8A832" />
      <rect x="35" y="48" width="3" height="6" rx="1" fill="#E8A832" />
    </svg>
  )
}

export function AbejaIcon({ size = 48, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      <ellipse cx="32" cy="36" rx="12" ry="16" fill="#F5C542" />
      <rect x="20" y="30" width="24" height="4" fill="#1F2937" />
      <rect x="20" y="38" width="24" height="4" fill="#1F2937" />
      <circle cx="32" cy="18" r="6" fill="#F5C542" />
      <circle cx="30" cy="17" r="1.2" fill="#1F2937" />
      <circle cx="34" cy="17" r="1.2" fill="#1F2937" />
      <ellipse cx="22" cy="28" rx="8" ry="4" fill="#FFFFFF" opacity="0.6" transform="rotate(-30 22 28)" />
      <ellipse cx="42" cy="28" rx="8" ry="4" fill="#FFFFFF" opacity="0.6" transform="rotate(30 42 28)" />
      <line x1="30" y1="12" x2="28" y2="8" stroke="#1F2937" strokeWidth="1.5" />
      <line x1="34" y1="12" x2="36" y2="8" stroke="#1F2937" strokeWidth="1.5" />
    </svg>
  )
}

export function EquidoIcon({ size = 48, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      <ellipse cx="32" cy="38" rx="16" ry="12" fill="#8B6914" />
      <ellipse cx="32" cy="36" rx="14" ry="10" fill="#A07828" />
      <ellipse cx="22" cy="26" rx="6" ry="10" fill="#A07828" transform="rotate(-10 22 26)" />
      <circle cx="20" cy="22" r="2" fill="#1F2937" />
      <path d="M16 20 L12 14" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 20 L16 14" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 16 Q24 10 20 10" stroke="#6B4E0A" strokeWidth="3" strokeLinecap="round" fill="none" />
      <rect x="24" y="46" width="3" height="8" rx="1" fill="#6B4E0A" />
      <rect x="37" y="46" width="3" height="8" rx="1" fill="#6B4E0A" />
    </svg>
  )
}

export function ConejoIcon({ size = 48, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      <ellipse cx="32" cy="40" rx="14" ry="12" fill="#E0D0C0" />
      <ellipse cx="32" cy="38" rx="12" ry="10" fill="#F0E4D8" />
      <circle cx="32" cy="26" r="8" fill="#F0E4D8" />
      <circle cx="29" cy="25" r="1.5" fill="#DC2626" />
      <circle cx="35" cy="25" r="1.5" fill="#DC2626" />
      <circle cx="32" cy="29" r="2" fill="#F4A0B0" />
      <ellipse cx="26" cy="14" rx="3" ry="10" fill="#F0E4D8" />
      <ellipse cx="38" cy="14" rx="3" ry="10" fill="#F0E4D8" />
      <ellipse cx="26" cy="14" rx="2" ry="8" fill="#F4A0B0" />
      <ellipse cx="38" cy="14" rx="2" ry="8" fill="#F4A0B0" />
    </svg>
  )
}

export function DiversificadoIcon({ size = 48, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" {...props}>
      <ellipse cx="32" cy="40" rx="14" ry="12" fill="#A07828" />
      <ellipse cx="32" cy="38" rx="12" ry="10" fill="#B8923E" />
      <ellipse cx="26" cy="24" rx="5" ry="12" fill="#B8923E" transform="rotate(-5 26 24)" />
      <circle cx="24" cy="18" r="2" fill="#1F2937" />
      <path d="M22 14 Q20 8 24 6" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M26 14 Q28 8 32 8" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="32" cy="44" r="2" fill="#FFFFFF" opacity="0.3" />
      <circle cx="28" cy="42" r="1.5" fill="#FFFFFF" opacity="0.3" />
      <circle cx="36" cy="42" r="1.5" fill="#FFFFFF" opacity="0.3" />
    </svg>
  )
}

export const SPECIES_ICONS: Record<string, React.FC<IconProps>> = {
  bovino: BovinoIcon,
  porcino: PorcinoIcon,
  ovino: OvinoIcon,
  caprino: CaprinoIcon,
  ave: AveIcon,
  abeja: AbejaIcon,
  equido: EquidoIcon,
  conejo: ConejoIcon,
  diversificado: DiversificadoIcon,
}

export function SpeciesIcon({
  species,
  size = 48,
  ...props
}: IconProps & { species: string }) {
  const Icon = SPECIES_ICONS[species]
  if (!Icon) return null
  return <Icon size={size} {...props} />
}
