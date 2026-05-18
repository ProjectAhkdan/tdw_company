"use client"

import { PillButton } from "@shared/ui/button"

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="id" className="dark">
      <body style={{ background: "#0D0D0D", color: "#E5E5E5", fontFamily: "Arial, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", margin: 0 }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <p style={{ color: "#C9A84C", fontSize: 12, letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>Error</p>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>Terjadi Kesalahan</h1>
          <p style={{ color: "#888", marginBottom: 32 }}>Maaf, terjadi kesalahan yang tidak terduga. Tim kami sudah diberitahu.</p>
          <PillButton onClick={reset} pillColor="#C9A84C" textColor="#0D0D0D" hoverCircleColor="#0D0D0D" hoverTextColor="#C9A84C">
            Coba Lagi
          </PillButton>
        </div>
      </body>
    </html>
  )
}
