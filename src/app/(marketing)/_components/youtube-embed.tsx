"use client"
import { useState } from "react"

export function YoutubeEmbed({ id, title }: { id: string; title: string }) {
  const [clicked, setClicked] = useState(false)
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl"
      style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)" }}>
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
      {!clicked && (
        <div className="absolute inset-0 cursor-pointer" onClick={() => setClicked(true)} />
      )}
    </div>
  )
}


