import { Navbar } from "@/widgets/navbar"
import { Footer } from "@/widgets/footer"
import { SmoothScroll } from "@shared/ui/smooth-scroll"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </SmoothScroll>
  )
}


