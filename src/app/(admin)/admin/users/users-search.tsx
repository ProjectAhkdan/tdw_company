"use client"

import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useDebounce } from "@/shared/hooks/use-debounce"

export function UsersSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("q") || "")
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (debouncedSearch) {
      params.set("q", debouncedSearch)
    } else {
      params.delete("q")
    }
    router.push(`?${params.toString()}`)
  }, [debouncedSearch, router, searchParams])

  return (
    <div style={{ position: "relative", maxWidth: 360 }}>
      <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "#9CA3AF" }} />
      <input 
        placeholder="Cari nama atau email..."
        value={search} 
        onChange={e => setSearch(e.target.value)}
        style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10, height: 40, padding: "0 14px 0 36px", fontSize: "0.875rem", outline: "none", width: "100%", color: "#111827" }} 
      />
    </div>
  )
}



