"use client"

import dynamic from "next/dynamic"

const DarkVeil = dynamic(() => import("./dark-veil"), { ssr: false })

export function DarkVeilHero() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <DarkVeil speed={0.4} hueShift={0} noiseIntensity={0.02} warpAmount={0.3} />
      <div className="absolute inset-0 bg-black/50" />
    </div>
  )
}
