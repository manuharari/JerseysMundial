import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  const body = await req.json()
  const { name, description, priceCents, imageUrl } = body || {}
  const product = await prisma.product.update({ where: { id }, data: { name, description, priceCents, imageUrl } })
  return NextResponse.json({ product })
}
