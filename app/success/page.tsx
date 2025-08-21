import Link from 'next/link'
export default function Success() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-2">¡Pago aprobado!</h1>
      <p className="text-[var(--muted)] mb-6">Gracias por tu compra.</p>
      <Link href="/" className="btn-primary">Volver al catálogo</Link>
    </div>
  )
}
