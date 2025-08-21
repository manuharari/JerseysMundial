'use client'
import { useState } from 'react'

export default function BuyButton({ productId }: { productId: number }) {
  const [loading, setLoading] = useState(false)

  const buyNow = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error creando preferencia')
      window.location.href = data.init_point
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={buyNow} className="btn-primary" disabled={loading}>
      {loading ? 'Redirigiendo…' : 'Comprar ahora'}
    </button>
  )
}
