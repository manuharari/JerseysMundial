import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { productId } = body || {}
    if (!productId) return NextResponse.json({ error: 'productId requerido' }, { status: 400 })

    const product = await prisma.product.findUnique({ where: { id: Number(productId) } })
    if (!product) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })

    const order = await prisma.order.create({ data: { productId: product.id, status: 'PENDING' } })

    const accessToken = process.env.MP_ACCESS_TOKEN
    if (!accessToken) return NextResponse.json({ error: 'MP_ACCESS_TOKEN no configurado' }, { status: 500 })

    const baseUrl = process.env.PUBLIC_BASE_URL || new URL(req.url).origin

    const preferencePayload = {
      items: [
        {
          title: product.name,
          quantity: 1,
          currency_id: 'MXN',
          unit_price: product.priceCents / 100
        }
      ],
      external_reference: String(order.id),
      back_urls: {
        success: `${baseUrl}/success?order=${order.id}`,
        failure: `${baseUrl}/failure?order=${order.id}`,
        pending: `${baseUrl}/pending?order=${order.id}`
      },
      auto_return: 'approved',
      notification_url: `${baseUrl}/api/webhook`
    }

    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(preferencePayload)
    })

    const data = await mpRes.json()
    if (!mpRes.ok) {
      console.error('MercadoPago error', data)
      return NextResponse.json({ error: 'Error creando preferencia' }, { status: 500 })
    }

    await prisma.order.update({ where: { id: order.id }, data: { preferenceId: data.id, externalRef: String(order.id) } })
    return NextResponse.json({ init_point: data.init_point || data.sandbox_init_point, preference_id: data.id })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
