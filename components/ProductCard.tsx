import Link from 'next/link'

export default function ProductCard({ product }: { product: { id: number; name: string; priceCents: number; imageUrl?: string|null } }) {
  const price = (product.priceCents / 100).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
  return (
    <Link href={`/product/${product.id}`} className="card overflow-hidden group">
      <div className="aspect-[4/3] bg-white/5 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl || `https://picsum.photos/seed/jersey-${product.id}/800/600`}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-[1.02] transition"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-[var(--muted)]">{price}</p>
      </div>
    </Link>
  )
}
