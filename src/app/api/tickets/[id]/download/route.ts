import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@infrastructure/storage/db-client'
import { getServerSession } from '@infrastructure/session/auth-server'
import { generateETicket } from '@shared/lib/eticket'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: orderId } = await params

  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('id, status, user_id, eticket_url')
    .eq('id', orderId)
    .single()

  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const o = order as unknown as { id: string; status: string; user_id: string; eticket_url: string | null }

  if (o.user_id !== session.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (o.status !== 'PAID') return NextResponse.json({ error: 'Order not paid' }, { status: 400 })

  if (o.eticket_url) return NextResponse.redirect(o.eticket_url)

  const result = await generateETicket(orderId)
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: 500 })

  return NextResponse.redirect(result.url)
}
