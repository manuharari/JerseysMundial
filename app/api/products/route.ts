import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ products })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, description, priceCents, imageUrl } = body || {}
  if (!name || !Number.isInteger(priceCents)) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  const product = await prisma.product.create({ data: { name, description, priceCents, imageUrl } })
  return NextResponse.json({ product }, { status: 201 })
}
