import type { Metadata } from "next"
import { getSocialMediaContents } from "@/infrastructure/storage/social-media-queries"
import { SocialMediaTabs } from "./social-media-tabs"

export const metadata: Metadata = {
  title: "Social Media",
  description: "Ikuti konten inspiratif Tung Desem Waringin di Instagram, TikTok, dan YouTube",
}

export default async function SocialMediaPage() {
  const { data } = await getSocialMediaContents()

  return (
    <section className="px-6 py-20" style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      <div className="mx-auto max-w-[1280px]">
        <p className="section-label mb-3">Social Media</p>
        <h1 className="text-[clamp(28px,5vw,48px)] font-bold text-white mb-10">
          Konten <span style={{ color: "#D9F25D" }}>TDW</span>
        </h1>
        <SocialMediaTabs contents={data ?? []} />
      </div>
    </section>
  )
}
