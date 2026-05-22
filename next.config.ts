import type { NextConfig } from "next"

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.midtrans.com https://app.sandbox.midtrans.com https://fonts.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in",
      "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co https://api.resend.com",
      "frame-src https://app.midtrans.com https://app.sandbox.midtrans.com",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; "),
  },
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "rgwquajbnjghbyzyxwxc.supabase.co" },
    ],
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
    ]
  },
}

export default nextConfig
