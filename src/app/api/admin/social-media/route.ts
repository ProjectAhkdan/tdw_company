import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/infrastructure/storage/db-client"

const table = () => supabaseAdmin.from("social_media_contents") as any

export async function POST(req: NextRequest) {
  const { id, ...body } = await req.json()
  const { error } = await table().insert(body)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function PUT(req: NextRequest) {
  const { id, ...body } = await req.json()
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  const { error } = await table().update(body).eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
  const { id, ...fields } = await req.json()
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  const { error } = await table().update(fields).eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  const { error } = await table().delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
