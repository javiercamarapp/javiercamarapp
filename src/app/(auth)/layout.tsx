"use client"

import React from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-8 font-[Inter]">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <svg
          width="160"
          height="48"
          viewBox="0 0 160 48"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="HatoAI"
        >
          <text
            x="50%"
            y="50%"
            dominantBaseline="central"
            textAnchor="middle"
            fill="#1B4332"
            fontWeight="700"
            fontSize="32"
            fontFamily="Inter, sans-serif"
          >
            HatoAI
          </text>
        </svg>
        <p className="text-base text-[#1B4332]/70">
          La inteligencia de tu hato
        </p>
      </div>

      {/* Page content */}
      <div className="w-full max-w-md">{children}</div>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-gray-400">
        HatoAI &copy; 2026 &mdash; M&eacute;rida, Yucat&aacute;n
      </footer>
    </div>
  )
}
