import type { Metadata } from "next"
import { getSocialMediaByPlatform } from "@/infrastructure/storage/social-media-queries"
import { YoutubeEmbed } from "../_components/youtube-embed"

export const metadata: Metadata = {
  title: "Video",
  description: "Tonton video inspiratif dari Tung Desem Waringin",
}

const L = "#D9F25D"

export default async function VideosPage() {
  const { data } = await getSocialMediaByPlatform('youtube')
  const videos = data ?? []

  return (
    <div className="min-h-screen pt-20 pb-20 px-6" style={{ background: "#0A0A0A" }}>
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-12">
          <p className="section-label mb-3">Video</p>
          <h1 className="text-[clamp(32px,5vw,56px)] font-black text-white leading-tight">
            Video <span style={{ color: L }}>TDW Resources</span>
          </h1>
          <p className="mt-3 text-[14px]" style={{ color: "#8A8A8A" }}>
            Tonton video inspiratif dan edukatif dari Tung Desem Waringin
          </p>
        </div>

        {videos.length === 0 ? (
          <p className="text-center py-20 text-[14px]" style={{ color: "#8A8A8A" }}>Konten segera hadir</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2">
            {videos.map((v) => (
              <div key={v.id} className="overflow-hidden rounded-xl"
                style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)" }}>
                <YoutubeEmbed id={v.embed_id} title={v.title} />
                <div className="p-4">
                  <h2 className="text-[15px] font-semibold text-white">{v.title}</h2>
                  <p className="mt-1 text-[13px]" style={{ color: "#8A8A8A" }}>{v.caption ?? ""}</p>
                  <a href={v.content_url} target="_blank" rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium transition-colors hover:opacity-80"
                    style={{ color: L }}>
                    Tonton di YouTube →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
