import Link from "next/link"
import { getTranslations } from "@shared/lib/i18n"

export async function Footer() {
  const { t } = await getTranslations()
  return (
    <footer className="border-t border-border bg-[#0A0A0A]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="text-lg font-bold text-[oklch(0.75_0.18_55)]">TDW Resources</Link>
            <p className="mt-2 text-xs text-muted-foreground">
              Investasi Terbaik Adalah Investasi Pada Diri Sendiri
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Program</h4>
            <ul className="space-y-2">
              <li><Link href="/seminars" className="text-sm text-muted-foreground hover:text-foreground">Life Revolution</Link></li>
              <li><Link href="/seminars" className="text-sm text-muted-foreground hover:text-foreground">Business Revolution</Link></li>
              <li><Link href="/seminars" className="text-sm text-muted-foreground hover:text-foreground">Financial Revolution</Link></li>
              <li><Link href="/schedule" className="text-sm text-muted-foreground hover:text-foreground">{t.nav.schedule}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Perusahaan</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">{t.nav.about}</Link></li>
              <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">{t.nav.blog}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Kontak</h4>
            <ul className="space-y-2">
              <li><a href="tel:02154766677" className="text-sm text-muted-foreground hover:text-foreground">(021) 547-6677</a></li>
              <li><a href="mailto:info@dahsyat.com" className="text-sm text-muted-foreground hover:text-foreground">info@dahsyat.com</a></li>
              <li><a href="https://tdwresources.id" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">tdwresources.id</a></li>
              <li className="text-sm text-muted-foreground">Jl. Janur Hijau 1, Blok AA-5 No. 16-17,<br />Gading Serpong, Tangerang, Banten 15810</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          &copy; 2026 TDW Resources. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
