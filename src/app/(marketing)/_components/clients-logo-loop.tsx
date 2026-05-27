'use client'

import { LogoLoop } from '@/shared/ui/logo-loop'

const CLIENTS = [
  "Gapura Prima Group","Gas Negara (PGN)","Muncul Group","Bayer CropScience",
  "Bank BRI","REI","Toyota","Honda","Suzuki","Daihatsu","BatikKeris","Nokia",
  "ERA Real Estate","Hyundai","Jamsostek","Agung Sedayu Group","Telkomsel",
  "Angkasa Pura II","Pertamina","Sun Life Financial","Tiens","Mitsubishi Motors",
  "Adira Finance","Nestle","Sosro","Bank Sinarmas","InHealth","Bappenas",
  "Pos Indonesia","Astra CMG","PT United Tractors","Holcim","Bank Indonesia",
  "Kimia Farma","Allianz","Bridgestone","SCTV","Metro TV","BTPN","PaninBank",
  "Grand Indonesia","BSD City","Milagros","Hino","Sophie Paris","Samsung",
  "Yamaha","LG","BNI","BCA","Unilever","ARA Indonesia","JAPFA","Bakrieland",
  "Mitraio","Nu Skin","Novartis","Prasetya Mulya","Telkom Indonesia","IBM",
  "Takeda","Alfamart",
]

const logos = CLIENTS.map(name => ({
  node: (
    <div className="flex items-center justify-center rounded-xl px-4 py-3 text-center"
      style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)", minWidth: "120px" }}>
      <span className="text-[11px] font-semibold leading-tight whitespace-nowrap" style={{ color: "#5A5A5A" }}>
        {name}
      </span>
    </div>
  ),
}))

export function ClientsLogoLoop() {
  return (
    <LogoLoop
      logos={logos}
      speed={60}
      direction="left"
      gap={12}
      logoHeight={44}
      pauseOnHover
      fadeOut
      fadeOutColor="#0A0A0A"
      ariaLabel="Klien TDW Resources"
    />
  )
}
