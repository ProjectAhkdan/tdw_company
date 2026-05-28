import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/infrastructure/storage/db-client"

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, ...fields } = body

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const { error } = await (supabaseAdmin
    .from("social_media_contents") as any)
    .update(fields)
    .eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
