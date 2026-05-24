"use client"

import { useRouter, useSearchParams } from "next/navigation"

const inputStyle: React.CSSProperties = {
  background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10,
  color: "#111827", height: 40, padding: "0 14px", fontSize: "0.875rem", outline: "none",
}

export function ReportsDateFilter({ defaultFrom, defaultTo }: { defaultFrom: string; defaultTo: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const q = searchParams.get("q") ?? ""

  function handleDateChange(from: string, to: string) {
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    params.set("from", from)
    params.set("to", to)
    router.push(`?${params.toString()}`)
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input type="date" value={defaultFrom} onChange={e => handleDateChange(e.target.value, defaultTo)} style={inputStyle} />
      <span style={{ color: "#9CA3AF", fontWeight: 700 }}>—</span>
      <input type="date" value={defaultTo}   onChange={e => handleDateChange(defaultFrom, e.target.value)}   style={inputStyle} />
    </div>
  )
}



