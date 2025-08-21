import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function mapStatus(mpStatus: string) {
  switch (mpStatus) {
    case 'approved': return 'APPROVED'
    case 'rejected': return 'REJECTED'
    case 'cancelled': return 'CANCELLED'
    case 'pending':
    case 'in_process':
    default: return 'PENDING'
  }
}

export async function POST(req: Request) {
  try {
    const token = process.env.MP_ACCESS_TOKEN
    if (!token) return NextResponse.json({ ok: false }, { status: 500 })

    const body = await req.json().catch(() => ({}))
    let paymentId: string | null = null

    if (body?.data?.id) {
      paymentId = String(body.data.id)
    }

    if (!paymentId) {
      const url = new URL(req.url)
      const idQ = url.searchParams.get('id')
      const topic = url.searchParams.get('topic') || url.searchParams.get('type')
      if (idQ && topic === 'payment') paymentId = idQ
    }

    if (!paymentId) return NextResponse.json({ ok: true })

    const r = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!r.ok) {
      console.error('MP fetch failed')
      return NextResponse.json({ ok: true })
    }
    const payment = await r.json()
    const ext = payment.external_reference
    const status = mapStatus(payment.status)

    if (ext) {
      const orderId = Number(ext)
      await prisma.order.update({
        where: { id: orderId },
        data: { status, paymentId: String(payment.id) }
      })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ ok: true })
  }
}
