import { Construction } from "lucide-react"

export default function AffiliatePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: "oklch(0.78 0.16 55 / 0.12)" }}>
        <Construction className="size-8" style={{ color: "oklch(0.78 0.16 55)" }} />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Fitur Dalam Pengembangan</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Fitur afiliasi sedang dalam tahap pengembangan dan belum tersedia saat ini. Harap tunggu pembaruan selanjutnya.
        </p>
      </div>
    </div>
  )
}
