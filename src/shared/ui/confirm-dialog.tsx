'use client'

import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

export function ConfirmDialog({
  title, message, confirmLabel = "Hapus", onConfirm, onCancel, danger = true
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "oklch(0 0 0 / 0.7)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-sm rounded-2xl p-6 space-y-4"
        style={{ background: "oklch(0.12 0.008 55)", border: "1px solid oklch(0.22 0.01 55 / 0.5)" }}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ background: danger ? "oklch(0.45 0.18 25 / 0.15)" : "rgba(217,242,93,0.15)" }}>
            <AlertTriangle className="size-5" style={{ color: danger ? "#f87171" : "#D9F25D" }} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel}
            className="h-9 rounded-xl border px-4 text-sm font-medium transition-colors hover:bg-white/5"
            style={{ borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.65 0 0)" }}>
            Batal
          </button>
          <button onClick={onConfirm}
            className="h-9 rounded-xl px-4 text-sm font-semibold transition-all hover:opacity-90"
            style={danger
              ? { background: "#ef4444", color: "#fff" }
              : { background: "#D9F25D", color: "oklch(0.08 0 0)" }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}


