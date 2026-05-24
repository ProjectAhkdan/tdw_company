import type { Metadata } from "next"
import { YoutubeEmbed } from "../_components/youtube-embed"

export const metadata: Metadata = {
  title: "Video",
  description: "Tonton video inspiratif dari Tung Desem Waringin",
}

const VIDEOS = [
  { id: "FK63rFTjsDE", title: "Video TDW 1", desc: "Tonton video inspiratif dari Tung Desem Waringin" },
  { id: "g7A34zlAX9U", title: "Video TDW 2", desc: "Strategi bisnis dan pengembangan diri bersama TDW" },
  { id: "BQ5yPlTpUd8", title: "Video TDW 3", desc: "Highlight seminar dan training TDW Resources" },
  { id: "wfcmUxAzjQE", title: "Video TDW 4", desc: "Insight eksklusif dari Tung Desem Waringin" },
]

const L = "#D9F25D"

export default function VideosPage() {
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

        <div className="grid gap-8 sm:grid-cols-2">
          {VIDEOS.map((v) => (
            <div key={v.id} className="overflow-hidden rounded-xl"
              style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)" }}>
              <YoutubeEmbed id={v.id} title={v.title} />
              <div className="p-4">
                <h2 className="text-[15px] font-semibold text-white">{v.title}</h2>
                <p className="mt-1 text-[13px]" style={{ color: "#8A8A8A" }}>{v.desc}</p>
                <a href={`https://youtu.be/${v.id}`} target="_blank" rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium transition-colors hover:opacity-80"
                  style={{ color: L }}>
                  Tonton di YouTube →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
