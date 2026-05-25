"use client"

import { useState, useRef, useCallback } from "react"
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Camera, X, Check, Upload } from "lucide-react"

const GOLD = "#D9F25D"

function centerAspectCrop(w: number, h: number, aspect: number): Crop {
  return centerCrop(makeAspectCrop({ unit: "%", width: 90 }, aspect, w, h), w, h)
}

async function getCroppedBlob(image: HTMLImageElement, crop: Crop): Promise<Blob> {
  const canvas = document.createElement("canvas")
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  const cropX = (crop.x / 100) * image.width * scaleX
  const cropY = (crop.y / 100) * image.height * scaleY
  const cropW = (crop.width / 100) * image.width * scaleX
  const cropH = (crop.height / 100) * image.height * scaleY

  canvas.width = cropW
  canvas.height = cropH
  const ctx = canvas.getContext("2d")!
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(image, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH)
  return new Promise(resolve => canvas.toBlob(b => resolve(b!), "image/jpeg", 0.92))
}

interface Props {
  currentUrl?: string | null
  onUpload: (file: File) => Promise<void>
  shape?: "circle" | "rect"
  aspect?: number
  size?: number
  label?: string
}

export default function ImageUpload({ currentUrl, onUpload, shape = "circle", aspect = 1, size = 80, label }: Props) {
  const [srcImg, setSrcImg] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const [loading, setLoading] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert("Maksimal 5MB"); return }
    const reader = new FileReader()
    reader.onload = () => setSrcImg(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, aspect))
  }

  async function handleConfirm() {
    if (!imgRef.current || !crop) return
    setLoading(true)
    try {
      const blob = await getCroppedBlob(imgRef.current, crop)
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" })
      await onUpload(file)
      setSrcImg(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Trigger */}
      <div className="relative inline-block" style={{ width: size, height: size }}>
        {currentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentUrl} alt="foto" className="object-cover w-full h-full"
            style={{ borderRadius: shape === "circle" ? "50%" : 12 }} />
        ) : (
          <div className="flex w-full h-full items-center justify-center text-lg font-bold"
            style={{ borderRadius: shape === "circle" ? "50%" : 12, background: `${GOLD}20`, color: GOLD }}>
            {label ?? <Upload className="size-5" />}
          </div>
        )}
        <button onClick={() => inputRef.current?.click()}
          className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors hover:opacity-90"
          style={{ background: GOLD, borderColor: "oklch(0.09 0.006 55)", color: "oklch(0.08 0 0)" }}
          title="Ganti foto">
          <Camera className="size-3.5" />
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
      </div>

      {/* Crop Modal */}
      {srcImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "oklch(0 0 0 / 0.8)", backdropFilter: "blur(8px)" }}>
          <div className="glass w-full max-w-md rounded-2xl p-6 space-y-4"
            style={{ border: `1px solid ${GOLD}20` }}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Crop Foto</h3>
              <button onClick={() => setSrcImg(null)}><X className="size-5 text-muted-foreground" /></button>
            </div>

            <div className="flex justify-center overflow-hidden rounded-xl"
              style={{ maxHeight: 360 }}>
              <ReactCrop crop={crop} onChange={c => setCrop(c)} aspect={aspect}
                circularCrop={shape === "circle"} keepSelection>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img ref={imgRef} src={srcImg} alt="crop" onLoad={onImageLoad}
                  style={{ maxHeight: 340, maxWidth: "100%", objectFit: "contain" }} />
              </ReactCrop>
            </div>

            <p className="text-xs text-center text-muted-foreground">Seret untuk memilih area foto</p>

            <div className="flex gap-3">
              <button onClick={() => setSrcImg(null)}
                className="flex-1 h-9 rounded-xl border text-sm"
                style={{ borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.65 0 0)" }}>
                Batal
              </button>
              <button onClick={handleConfirm} disabled={loading}
                className="flex-1 h-9 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>
                {loading ? "Mengupload..." : <><Check className="size-4" /> Simpan</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


