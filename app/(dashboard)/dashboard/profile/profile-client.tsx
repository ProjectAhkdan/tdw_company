"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { updateProfile } from "@/server/actions/profile"
import { uploadAvatar } from "@/server/actions/upload"
import ImageUpload from "@/components/ui/image-upload"
import type { UserProfile } from "@/lib/supabase/queries"

const GOLD = "oklch(0.78 0.16 55)"

const schema = z.object({
  full_name: z.string().min(2, "Minimal 2 karakter"),
  phone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, "Nomor HP tidak valid").or(z.literal("")).optional(),
  city: z.string().min(2, "Wajib diisi").or(z.literal("")).optional(),
  occupation: z.string().optional(),
  notify_email: z.boolean(),
  notify_wa: z.boolean(),
})
type Form = z.infer<typeof schema>

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className="relative h-6 w-11 rounded-full transition-all duration-200"
      style={{ background: checked ? GOLD : "oklch(0.22 0.01 55)" }}>
      <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200"
        style={{ left: checked ? "calc(100% - 1.375rem)" : "0.125rem" }} />
    </button>
  )
}

export default function ProfileClient({ profile, email }: { profile: UserProfile | null; email: string }) {
  const [pending, startTransition] = useTransition()
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? null)
  const router = useRouter()
  const initial = (profile?.full_name ?? email).charAt(0).toUpperCase()

  async function handleAvatarUpload(file: File) {
    const fd = new FormData(); fd.append("file", file)
    const r = await uploadAvatar(fd)
    if ("error" in r) { toast.error(r.error); return }
    setAvatarUrl(r.url!)
    toast.success("Foto profil diperbarui")
    router.refresh() // re-render layout server component agar sidebar/header update
  }

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: profile?.full_name ?? "",
      phone: profile?.phone ?? "",
      city: profile?.city ?? "",
      occupation: profile?.occupation ?? "",
      notify_email: profile?.notify_email ?? true,
      notify_wa: profile?.notify_wa ?? true,
    },
  })

  const notifyEmail = watch("notify_email")
  const notifyWa = watch("notify_wa")

  function onSubmit(data: Form) {
    startTransition(async () => {
      const r = await updateProfile({
        full_name: data.full_name,
        phone: data.phone || null,
        city: data.city || null,
        occupation: data.occupation || null,
        notify_email: data.notify_email,
        notify_wa: data.notify_wa,
      })
      if (r && "error" in r) toast.error(r.error)
      else toast.success("Profil berhasil disimpan")
    })
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Profil Saya</h1>
        <p className="mt-1 text-sm text-muted-foreground">Kelola informasi akun Anda</p>
      </div>

      {/* Avatar */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <ImageUpload
            currentUrl={avatarUrl}
            onUpload={handleAvatarUpload}
            shape="circle"
            aspect={1}
            size={64}
            label={initial}
          />
          <div>
            <p className="font-semibold">{profile?.full_name ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
            <span className="mt-1 inline-block rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400">Member</span>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold">Edit Profil</h2>
          {[
            { id: "full_name", label: "Nama Lengkap", key: "full_name" as const },
            { id: "phone", label: "Nomor HP", key: "phone" as const },
            { id: "city", label: "Kota", key: "city" as const },
            { id: "occupation", label: "Pekerjaan", key: "occupation" as const },
          ].map(({ id, label, key }) => (
            <div key={id}>
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">{label}</label>
              <input id={id} {...register(key)}
                className="h-10 w-full rounded-xl border px-4 text-sm outline-none transition-colors focus:ring-1"
                style={{ background: "oklch(0.11 0.008 55)", borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.9 0 0)" }} />
              {errors[key] && <p className="mt-1 text-xs text-red-400">{errors[key]?.message}</p>}
            </div>
          ))}
        </div>

        {/* Notifications */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold">Preferensi Notifikasi</h2>
          {[
            { label: "Notifikasi Email", sub: "Konfirmasi pesanan & pengingat seminar", key: "notify_email" as const, value: notifyEmail },
            { label: "Notifikasi WhatsApp", sub: "Update real-time via WhatsApp", key: "notify_wa" as const, value: notifyWa },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
              <Toggle checked={item.value} onChange={(v) => setValue(item.key, v)} />
            </div>
          ))}
        </div>

        <button type="submit" disabled={pending}
          className="h-10 w-full rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  )
}
