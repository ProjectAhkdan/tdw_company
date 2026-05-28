import { getSocialMediaByPlatform } from "@/infrastructure/storage/social-media-queries"
import { YoutubeEmbed } from "./youtube-embed"

const L = "#D9F25D"

export async function VideosSectionServer() {
  const { data } = await getSocialMediaByPlatform('youtube')
  const featured = (data ?? []).filter(v => v.is_featured).slice(0, 3)

  if (!featured.length) return null

  return (
    <section className="px-6 py-20" style={{ background: "#0A0A0A" }}>
      <div className="mx-auto max-w-[1280px]">
        <h2 className="mb-10 text-[clamp(60px,10vw,100px)] font-black leading-none text-white">VIDEO</h2>

        <div className="space-y-8">
          {featured.map((v, i) => (
            <div key={v.id} className={`grid gap-6 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <YoutubeEmbed id={v.embed_id} title={v.title} />
              <div className="flex flex-col justify-center gap-4">
                <span className="text-[11px] font-semibold" style={{ color: L }}>Video</span>
                <h3 className="text-[18px] font-semibold text-white">{v.title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "#8A8A8A" }}>{v.caption ?? ""}</p>
                <a href={v.content_url} target="_blank" rel="noopener noreferrer" className="pill-lime self-start">
                  Tonton di YouTube → <span className="pill-dot" />
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href="/social-media" className="pill-lime inline-flex">
            See All Videos → <span className="pill-dot" />
          </a>
        </div>
      </div>
    </section>
  )
}
