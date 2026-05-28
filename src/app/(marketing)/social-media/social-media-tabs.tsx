"use client"

import { useState } from "react"
import type { Platform, SocialMediaContent } from "@/shared/types/domain.types"
import { YoutubeEmbed } from "../_components/youtube-embed"

const TABS: { key: Platform; label: string }[] = [
  { key: "youtube", label: "YouTube" },
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
]

function InstagramEmbed({ embedId, title }: { embedId: string; title: string }) {
  const [error, setError] = useState(false)
  if (error) return <div className="flex items-center justify-center aspect-square rounded-xl text-[13px]" style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", color: "#8A8A8A" }}>Konten tidak tersedia</div>
  return (
    <div className="relative aspect-square overflow-hidden rounded-xl" style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)" }}>
      <iframe src={`https://www.instagram.com/p/${embedId}/embed/`} title={title} className="absolute inset-0 h-full w-full" allowTransparency onError={() => setError(true)} />
    </div>
  )
}

function TiktokEmbed({ embedId, title }: { embedId: string; title: string }) {
  const [error, setError] = useState(false)
  if (error) return <div className="flex items-center justify-center aspect-[9/16] rounded-xl text-[13px]" style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", color: "#8A8A8A" }}>Konten tidak tersedia</div>
  return (
    <div className="relative aspect-[9/16] overflow-hidden rounded-xl" style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)" }}>
      <iframe src={`https://www.tiktok.com/embed/v2/${embedId}`} title={title} className="absolute inset-0 h-full w-full" allowFullScreen onError={() => setError(true)} />
    </div>
  )
}

function formatViews(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K views`
  return `${n} views`
}

function ContentCard({ item, children }: { item: SocialMediaContent; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      {children}
      <h3 className="text-[14px] font-semibold text-white line-clamp-1">{item.title}</h3>
      {item.caption && <p className="text-[12px] line-clamp-2" style={{ color: "#8A8A8A" }}>{item.caption}</p>}
      <div className="flex items-center gap-3 text-[11px]" style={{ color: "#5A5A5A" }}>
        <span>{formatViews(item.view_count)}</span>
        <span>{new Date(item.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
      </div>
    </div>
  )
}

export function SocialMediaTabs({ contents }: { contents: SocialMediaContent[] }) {
  const [active, setActive] = useState<Platform>("youtube")
  const filtered = contents.filter(c => c.platform === active)

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-10" style={{ scrollbarWidth: "none" }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActive(t.key)}
            className="px-5 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors"
            style={{ background: active === t.key ? "#D9F25D" : "rgba(255,255,255,0.06)", color: active === t.key ? "#0A0A0A" : "#8A8A8A" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center py-20 text-[14px]" style={{ color: "#8A8A8A" }}>Konten segera hadir</p>
      ) : active === "youtube" ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map(item => (
            <ContentCard key={item.id} item={item}>
              <YoutubeEmbed id={item.embed_id} title={item.title} />
            </ContentCard>
          ))}
        </div>
      ) : active === "instagram" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(item => (
            <ContentCard key={item.id} item={item}>
              <InstagramEmbed embedId={item.embed_id} title={item.title} />
            </ContentCard>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {filtered.map(item => (
            <ContentCard key={item.id} item={item}>
              <TiktokEmbed embedId={item.embed_id} title={item.title} />
            </ContentCard>
          ))}
        </div>
      )}
    </>
  )
}
