import { prisma } from '@/lib/prisma'
import BuyButton from '@/components/BuyButton'

export default async function ProductPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return <div>Producto no encontrado</div>
  const price = (product.priceCents / 100).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.imageUrl || `https://picsum.photos/seed/jersey-${product.id}/1200/900`} alt={product.name} className="w-full object-cover" />
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-[var(--muted)] mb-6">{price}</p>
        {product.description && <p className="mb-6 text-white/80">{product.description}</p>}
        <BuyButton productId={product.id} />
      </div>
    </div>
  )
}
