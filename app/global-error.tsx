"use client"

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="id" className="dark">
      <body style={{ background: "#0D0D0D", color: "#E5E5E5", fontFamily: "Arial, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", margin: 0 }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <p style={{ color: "#C9A84C", fontSize: 12, letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>Error</p>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>Terjadi Kesalahan</h1>
          <p style={{ color: "#888", marginBottom: 32 }}>Maaf, terjadi kesalahan yang tidak terduga. Tim kami sudah diberitahu.</p>
          <button onClick={reset} style={{ background: "#C9A84C", color: "#0D0D0D", border: "none", borderRadius: 12, padding: "12px 32px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
            Coba Lagi
          </button>
        </div>
      </body>
    </html>
  )
}
