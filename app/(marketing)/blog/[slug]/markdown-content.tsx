"use client"

import { useMemo } from "react"
import { marked } from "marked"

// DOMPurify only works in browser — import dynamically
export default function MarkdownContent({ content }: { content: string }) {
  const html = useMemo(() => {
    const raw = marked.parse(content, { async: false }) as string
    // Sanitize only in browser
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const DOMPurify = require("dompurify")
      return DOMPurify.sanitize(raw)
    }
    return raw
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
