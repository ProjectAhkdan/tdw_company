export const revalidate = 300

import { getFeaturedTestimonials, getBlogPosts } from "@/infrastructure/storage/supabase-queries"
import { RevealObserver } from "./_components/reveal-observer"
import { HeroSection, LogoBar, AboutSection, StatsSection } from "./_components/home-sections-a"
import { ServicesHeading, ServicesSection, CaseStudiesSection, TestimonialsSection, AwardsSection } from "./_components/home-sections-b"
import { TeamSection, CtaMidSection, BlogSection } from "./_components/home-sections-c"

export default async function HomePage() {
  const [{ data: testimonials }, { data: posts }] = await Promise.all([
    getFeaturedTestimonials(),
    getBlogPosts({ page: 1 }),
  ])

  const blogItems = (posts ?? []).map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category ?? undefined,
    published_at: p.published_at,
    thumbnail_url: p.thumbnail_url,
  }))

  const testimonialItems = (testimonials ?? []).map(t => ({
    id: t.id,
    author_name: t.author_name,
    author_role: t.author_role ?? "",
    content: t.content,
    rating: t.rating,
    is_featured: t.is_featured,
  }))

  return (
    <div style={{ background: "#0A0A0A" }}>
      <RevealObserver />
      <HeroSection />
      <LogoBar />
      <AboutSection />
      <StatsSection />
      <ServicesHeading />
      <ServicesSection />
      <CaseStudiesSection />
      <TestimonialsSection items={testimonialItems} />
      <AwardsSection />
      <TeamSection />
      <CtaMidSection />
      <BlogSection posts={blogItems} />
    </div>
  )
}
