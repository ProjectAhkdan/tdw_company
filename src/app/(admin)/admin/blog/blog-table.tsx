"use client"

import { useState, useTransition } from "react"
import { Pencil, Trash2, Eye, EyeOff, FileText, Plus } from "lucide-react"
import { toast } from "sonner"
import { updatePost, deletePost } from "@/app/actions/blog/action"
import { ConfirmDialog } from "@shared/ui/confirm-dialog"
import dynamic from "next/dynamic"

const PostModal = dynamic(() => import("./blog-modal").then(mod => mod.PostModal), { ssr: false })

const ORANGE      = "oklch(0.72 0.18 55)"
const ORANGE_BG   = "oklch(0.97 0.04 60)"
const ORANGE_TEXT = "oklch(0.45 0.15 50)"

type Post = { id: string; slug: string; title: string; category: string | null; is_published: boolean; published_at: string | null; created_at: string }

export function BlogTable({ posts }: { posts: Post[] }) {
  const [showModal,  setShowModal]  = useState(false)
  const [editPost,   setEditPost]   = useState<Post | undefined>()
  const [pending,    startTransition] = useTransition()
  const [selected,   setSelected]   = useState<Set<string>>(new Set())
  const [bulkPending,setBulkPending]= useState(false)
  const [confirm,    setConfirm]    = useState<{ title: string; message: string; onConfirm: () => void } | null>(null)

  const allSelected = posts.length > 0 && posts.every(p => selected.has(p.id))

  function toggleAll()           { if (allSelected) setSelected(new Set()); else setSelected(new Set(posts.map(p => p.id))) }
  function toggleOne(id: string) { setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n }) }

  function handleBulkDelete() {
    setConfirm({
      title: "Hapus Artikel Terpilih",
      message: `Hapus ${selected.size} artikel secara permanen?`,
      onConfirm: async () => {
        setBulkPending(true)
        const { deletePostsBulk } = await import("@/app/actions/blog/action")
        const r = await (deletePostsBulk as any)([...selected])
        if (r?.error) toast.error(r.error)
        else { toast.success(`${selected.size} artikel dihapus`); setSelected(new Set()) }
        setBulkPending(false)
      }
    })
  }

  function handleDelete(id: string) {
    setConfirm({
      title: "Hapus Artikel",
      message: "Hapus artikel ini secara permanen?",
      onConfirm: () => startTransition(async () => {
        const r = await deletePost(id)
        if (r && "error" in r) toast.error(r.error)
        else toast.success("Artikel dihapus")
      })
    })
  }

  function handleTogglePublish(post: Post) {
    startTransition(async () => {
      const r = await updatePost(post.id, { is_published: !post.is_published })
      if (r && "error" in r) toast.error(r.error)
      else toast.success(post.is_published ? "Artikel di-unpublish" : "Artikel dipublish ✓")
    })
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 16, marginTop: -56 }}>
        {selected.size > 0 && (
          <button onClick={handleBulkDelete} disabled={bulkPending}
            style={{ display: "flex", alignItems: "center", gap: 8, height: 40, borderRadius: 999, padding: "0 18px", background: "#FEF2F2", color: "#991B1B", border: "none", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", opacity: bulkPending ? 0.5 : 1 }}>
            {bulkPending ? "Menghapus..." : `🗑 Hapus ${selected.size} terpilih`}
          </button>
        )}
        <button onClick={() => { setEditPost(undefined); setShowModal(true) }}
          style={{ display: "flex", alignItems: "center", gap: 8, height: 40, borderRadius: 999, padding: "0 20px", background: ORANGE, color: "#1a0a00", border: "none", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer", transition: "opacity 0.15s" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.88"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}>
          <Plus style={{ width: 16, height: 16 }} /> Artikel Baru
        </button>
      </div>

      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                <th style={{ padding: "12px 16px", width: 40, background: "#F8F9FA" }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor: "pointer", width: 15, height: 15 }} />
                </th>
                {["Judul", "Kategori", "Status", "Tanggal", "Aksi"].map(h => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9CA3AF", background: "#F8F9FA", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "80px 20px", textAlign: "center" }}>
                    <FileText style={{ width: 40, height: 40, color: "#E5E7EB", margin: "0 auto 12px" }} />
                    <p style={{ color: "#9CA3AF", margin: 0, fontWeight: 500 }}>Belum ada artikel</p>
                    <p style={{ color: "#D1D5DB", margin: "6px 0 0", fontSize: "0.85rem" }}>Mulai buat artikel pertama untuk blog</p>
                  </td>
                </tr>
              ) : posts.map(p => (
                <tr key={p.id}
                  style={{ borderBottom: "1px solid #F3F4F6", transition: "background 0.1s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#F8F9FA"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#fff"}>
                  <td style={{ padding: "14px 16px" }}>
                    <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleOne(p.id)} style={{ cursor: "pointer", width: 15, height: 15 }} />
                  </td>
                  <td style={{ padding: "14px 20px", maxWidth: 280 }}>
                    <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
                    <p style={{ margin: "2px 0 0", fontSize: "0.7rem", color: "#9CA3AF", fontFamily: "monospace" }}>{p.slug}</p>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "0.875rem", color: "#6B7280" }}>{p.category ?? "—"}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span className={p.is_published ? "dz-badge dz-badge-green" : "dz-badge dz-badge-orange"}>
                      {p.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "0.8rem", color: "#9CA3AF" }}>
                    {new Date(p.created_at).toLocaleDateString("id-ID")}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button onClick={() => handleTogglePublish(p)} disabled={pending}
                        style={{
                          background: "#F3F4F6", border: "none", borderRadius: 8,
                          width: 30, height: 30, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          title: p.is_published ? "Unpublish" : "Publish",
                        } as any}
                        title={p.is_published ? "Unpublish" : "Publish"}>
                        {p.is_published
                          ? <EyeOff style={{ width: 14, height: 14, color: "#6B7280" }} />
                          : <Eye    style={{ width: 14, height: 14, color: "#6B7280" }} />}
                      </button>
                      <button onClick={() => { setEditPost(p); setShowModal(true) }}
                        style={{ background: ORANGE_BG, border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Pencil style={{ width: 14, height: 14, color: ORANGE_TEXT }} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} disabled={pending}
                        style={{ background: "#FEF2F2", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Trash2 style={{ width: 14, height: 14, color: "#EF4444" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <PostModal post={editPost} onClose={() => setShowModal(false)} />}
      {confirm && (
        <ConfirmDialog title={confirm.title} message={confirm.message} confirmLabel="Hapus"
          onConfirm={() => { confirm.onConfirm(); setConfirm(null) }}
          onCancel={() => setConfirm(null)} />
      )}
    </>
  )
}
