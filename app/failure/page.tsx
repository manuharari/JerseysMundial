import Link from 'next/link'
export default function Failure() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-2">Pago rechazado</h1>
      <p className="text-[var(--muted)] mb-6">Intenta nuevamente o usa otro método de pago.</p>
      <Link href="/" className="btn-primary">Volver al catálogo</Link>
    </div>
  )
}
