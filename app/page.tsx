import ProductCard from '@/components/ProductCard'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div>
      <section className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Jerseys de fútbol</h1>
        <p className="text-[var(--muted)]">Catálogo listo para envío inmediato.</p>
      </section>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      {products.length === 0 && (
        <div className="text-center text-[var(--muted)] mt-8">No hay productos aún. Entra al panel de Admin para crear.</div>
      )}
    </div>
  )
}
