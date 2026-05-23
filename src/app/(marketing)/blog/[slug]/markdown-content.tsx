"use client"

import { useEffect, useState } from "react"
import { marked } from "marked"

export default function MarkdownContent({ content }: { content: string }) {
  const [html, setHtml] = useState<string>("")

  useEffect(() => {
    async function parseAndSanitize() {
      const raw = marked.parse(content, { async: false }) as string
      try {
        const DOMPurify = (await import("dompurify")).default
        setHtml(DOMPurify.sanitize(raw))
      } catch (e) {
        setHtml(raw) // fallback if import fails
      }
    }
    parseAndSanitize()
  }, [content])

  return (
    <div
      className="prose-blog"
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        color: "oklch(0.75 0.005 60)",
        lineHeight: "1.8",
      }}
    />
  )
}
