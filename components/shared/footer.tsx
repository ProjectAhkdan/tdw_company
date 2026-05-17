import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#0A0A0A]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Logo & Tagline */}
          <div className="md:col-span-1">
            <Link href="/" className="text-lg font-bold text-[oklch(0.75_0.18_55)]">
              TDW Resources
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Investasi Terbaik Adalah Investasi Pada Diri Sendiri
            </p>
          </div>

          {/* Seminar */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Seminar</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/seminars" className="text-sm text-muted-foreground hover:text-foreground">
                  Daftar Seminar
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="text-sm text-muted-foreground hover:text-foreground">
                  Jadwal
                </Link>
              </li>
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Perusahaan</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Kontak</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:info@tdwresources.com" className="text-sm text-muted-foreground hover:text-foreground">
                  info@tdwresources.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
                  WhatsApp
                </a>
              </li>
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
