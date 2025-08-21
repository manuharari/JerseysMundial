import Link from 'next/link'
export default function Pending() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-2">Pago pendiente</h1>
      <p className="text-[var(--muted)] mb-6">Estamos procesando tu pago.</p>
      <Link href="/" className="btn-primary">Volver al catálogo</Link>
    </div>
  )
}
