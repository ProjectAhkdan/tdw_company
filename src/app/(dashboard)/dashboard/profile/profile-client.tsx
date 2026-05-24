import type { UserProfile } from "@/infrastructure/storage/supabase-queries"
import { ProfileForm } from "./profile-form"

export default function ProfileContent({ profile, email }: { profile: UserProfile | null; email: string }) {
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Profil Saya</h1>
        <p className="mt-1 text-sm text-muted-foreground">Kelola informasi akun Anda</p>
      </div>

      <ProfileForm profile={profile} email={email} />
    </div>
  )
}


