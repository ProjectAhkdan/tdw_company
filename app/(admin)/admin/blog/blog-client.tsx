"use client"

import { useState, useTransition } from "react"
import { Plus, Pencil, Trash2, X, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { createPost, updatePost, deletePost } from "@/server/actions/blog"

const GOLD = "oklch(0.78 0.16 55)"

type Post = { id: string; slug: string; title: string; category: string | null; is_published: boolean; published_at: string | null; created_at: string }

function PostModal({ post, onClose }: { post?: Post; onClose: () => void }) {
  const [pending, startTransition] = useTransition()
  const [form, setForm] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: "",
    content: "",
    category: post?.category ?? "",
    thumbnail_url: "",
    is_published: post?.is_published ?? false,
    read_time: 5,
  })

  function set(k: string, v: unknown) { setForm(f => ({ ...f, [k]: v })) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = post
        ? await updatePost(post.id, form)
        : await createPost(form)
      if (result && "error" in result) { toast.error(result.error); return }
      toast.success(post ? "Artikel diperbarui" : "Artikel dibuat")
      onClose()
    })
  }

  const inputCls = "h-9 w-full rounded-xl border px-3 text-sm outline-none focus:border-[oklch(0.78_0.16_55)]"
  const inputStyle = { background: "oklch(0.11 0.008 55)", borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.9 0 0)" }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "oklch(0 0 0 / 0.75)", backdropFilter: "blur(8px)" }}>
      <div className="glass w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
        style={{ border: `1px solid ${GOLD}20` }}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-semibold">{post ? "Edit Artikel" : "Artikel Baru"}</h2>
          <button onClick={onClose}><X className="size-5 text-muted-foreground" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            { key: "title", label: "Judul *", required: true },
            { key: "slug", label: "Slug (auto-generate jika kosong)" },
            { key: "excerpt", label: "Excerpt *", required: true },
            { key: "category", label: "Kategori" },
            { key: "thumbnail_url", label: "URL Thumbnail" },
          ].map(({ key, label, required }) => (
            <div key={key}>
              <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
              <input className={inputCls} style={inputStyle} required={required}
                value={(form as any)[key]} onChange={e => set(key, e.target.value)} />
            </div>
          ))}

          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Konten (Markdown) *</label>
            <textarea rows={12} required value={form.content} onChange={e => set("content", e.target.value)}
              placeholder="# Judul&#10;&#10;Tulis konten artikel dalam format Markdown..."
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none resize-y font-mono"
              style={{ ...inputStyle, minHeight: 200 }} />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-muted-foreground">Estimasi Baca (menit)</label>
              <input type="number" min={1} max={60} className={inputCls} style={inputStyle}
                value={form.read_time} onChange={e => set("read_time", parseInt(e.target.value))} />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer mt-4">
              <input type="checkbox" checked={form.is_published} onChange={e => set("is_published", e.target.checked)} />
              Publish sekarang
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-9 rounded-xl border text-sm"
              style={{ borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.65 0 0)" }}>Batal</button>
            <button type="submit" disabled={pending} className="flex-1 h-9 rounded-xl text-sm font-semibold disabled:opacity-50"
              style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>
              {pending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminBlogClient({ posts }: { posts: Post[] }) {
  const [showModal, setShowModal] = useState(false)
  const [editPost, setEditPost] = useState<Post | undefined>()
  const [pending, startTransition] = useTransition()

  function handleDelete(id: string) {
    if (!confirm("Hapus artikel ini?")) return
    startTransition(async () => {
      const r = await deletePost(id)
      if (r && "error" in r) toast.error(r.error)
      else toast.success("Artikel dihapus")
    })
  }

  function handleTogglePublish(post: Post) {
    startTransition(async () => {
      const r = await updatePost(post.id, { is_published: !post.is_published })
      if (r && "error" in r) toast.error(r.error)
      else toast.success(post.is_published ? "Artikel di-unpublish" : "Artikel dipublish")
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Blog</h1>
          <p className="mt-1 text-sm text-muted-foreground">{posts.length} artikel</p>
        </div>
        <button onClick={() => { setEditPost(undefined); setShowModal(true) }}
          className="flex h-9 items-center gap-2 rounded-xl px-4 text-sm font-semibold"
          style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>
          <Plus className="size-4" /> Artikel Baru
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground" style={{ borderColor: "oklch(0.18 0.01 55 / 0.5)" }}>
              {["Judul", "Kategori", "Status", "Tanggal", "Aksi"].map(h => (
                <th key={h} className="px-5 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">Belum ada artikel</td></tr>
            ) : posts.map(p => (
              <tr key={p.id} className="border-b transition-colors hover:bg-white/[0.02]"
                style={{ borderColor: "oklch(0.18 0.01 55 / 0.3)" }}>
                <td className="px-5 py-3">
                  <p className="font-medium line-clamp-1">{p.title}</p>
                  <p className="text-xs text-muted-foreground font-mono">{p.slug}</p>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{p.category ?? "—"}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.is_published ? "bg-emerald-500/15 text-emerald-400" : "bg-orange-500/15 text-orange-400"}`}>
                    {p.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">
                  {new Date(p.created_at).toLocaleDateString("id-ID")}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleTogglePublish(p)} disabled={pending}
                      className="text-muted-foreground hover:text-foreground transition-colors" title={p.is_published ? "Unpublish" : "Publish"}>
                      {p.is_published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                    <button onClick={() => { setEditPost(p); setShowModal(true) }}
                      className="text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil className="size-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} disabled={pending}
                      className="text-red-400 hover:text-red-300 transition-colors">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <PostModal post={editPost} onClose={() => setShowModal(false)} />}
    </div>
  )
}
