'use client'
import { useEffect, useState } from 'react'

type Product = { id: number; name: string; description?: string|null; priceCents: number; imageUrl?: string|null }
type Order = { id: number; productId: number; status: string; preferenceId?: string|null; paymentId?: string|null; createdAt: string }

export default function AdminClient({ authed }: { authed: boolean }) {
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState<'products'|'orders'>('products')

  const [products, setProducts] = useState<Product[]>([])
  const [editing, setEditing] = useState<Product | null>(null)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (authed) {
      refreshProducts()
      refreshOrders()
    }
  }, [authed])

  const refreshProducts = async () => {
    const res = await fetch('/api/products', { credentials: 'same-origin' })
    const data = await res.json()
    setProducts(data.products || [])
  }
  const refreshOrders = async () => {
    const res = await fetch('/api/orders', { credentials: 'same-origin' })
    const data = await res.json()
    setOrders(data.orders || [])
  }

  const saveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = {
      name: String(form.get('name')),
      description: String(form.get('description') || ''),
      priceCents: Math.round(Number(form.get('price')) * 100),
      imageUrl: String(form.get('imageUrl') || '')
    }
    if (editing) {
      const res = await fetch('/api/products/' + editing.id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), credentials: 'same-origin' })
      if (res.ok) { setEditing(null); refreshProducts() } else alert('Error actualizando')
    } else {
      const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), credentials: 'same-origin' })
      if (res.ok) { (e.target as HTMLFormElement).reset(); refreshProducts() } else alert('Error creando')
    }
  }

  if (!authed) {
    const login = async (e: React.FormEvent) => {
      e.preventDefault()
      const res = await fetch('/api/admin-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }), credentials: 'same-origin' })
      if (res.ok) window.location.reload()
      else alert('Contraseña incorrecta')
    }
    return (
      <div className="max-w-sm mx-auto card p-6">
        <h1 className="text-xl font-bold mb-4">Acceso Admin</h1>
        <form onSubmit={login} className="space-y-3">
          <div>
            <label className="label">Contraseña</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button className="btn-primary w-full" type="submit">Entrar</button>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <div className="flex gap-2">
          <button onClick={() => setTab('products')} className={`px-3 py-1 rounded-xl border ${tab==='products' ? 'border-blue-600' : 'border-white/10'}`}>Productos</button>
          <button onClick={() => setTab('orders')} className={`px-3 py-1 rounded-xl border ${tab==='orders' ? 'border-blue-600' : 'border-white/10'}`}>Órdenes</button>
          <a href="/api/admin-logout" className="px-3 py-1 rounded-xl border border-white/10">Salir</a>
        </div>
      </div>

      {tab === 'products' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-5">
            <h2 className="font-semibold mb-4">{editing ? 'Editar producto' : 'Crear producto'}</h2>
            <form onSubmit={saveProduct} className="space-y-3">
              <div>
                <label className="label">Nombre</label>
                <input name="name" className="input" defaultValue={editing?.name || ''} required />
              </div>
              <div>
                <label className="label">Descripción</label>
                <textarea name="description" className="textarea" defaultValue={editing?.description || ''} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Precio (MXN)</label>
                  <input name="price" type="number" step="0.01" min="0" className="input" defaultValue={editing ? (editing.priceCents/100).toFixed(2) : ''} required />
                </div>
                <div>
                  <label className="label">Imagen URL</label>
                  <input name="imageUrl" className="input" defaultValue={editing?.imageUrl || ''} />
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-primary" type="submit">{editing ? 'Guardar' : 'Crear'}</button>
                {editing && <button type="button" onClick={() => setEditing(null)} className="px-3 py-2 rounded-xl border border-white/10">Cancelar</button>}
              </div>
            </form>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold mb-4">Productos</h2>
            <div className="space-y-3">
              {products.map(p => (
                <div key={p.id} className="flex items-center gap-3 border border-white/10 rounded-xl p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.imageUrl || `https://picsum.photos/seed/jersey-${p.id}/200/150`} alt={p.name} className="w-24 h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-[var(--muted)]">{(p.priceCents/100).toLocaleString('es-MX', { style:'currency', currency:'MXN' })}</div>
                  </div>
                  <button onClick={() => setEditing(p)} className="px-3 py-2 rounded-xl border border-white/10">Editar</button>
                </div>
              ))}
              {products.length===0 && <div className="text-[var(--muted)]">No hay productos.</div>}
            </div>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="card p-5">
          <h2 className="font-semibold mb-4">Órdenes recientes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[var(--muted)]">
                <tr>
                  <th className="py-2">ID</th>
                  <th>Producto</th>
                  <th>Estado</th>
                  <th>Pref ID</th>
                  <th>Pago ID</th>
                  <th>Creada</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-t border-white/10">
                    <td className="py-2">{o.id}</td>
                    <td>{o.productId}</td>
                    <td>{o.status}</td>
                    <td className="truncate max-w-[160px]">{o.preferenceId || '-'}</td>
                    <td className="truncate max-w-[160px]">{o.paymentId || '-'}</td>
                    <td>{new Date(o.createdAt).toLocaleString('es-MX')}</td>
                  </tr>
                ))}
                {orders.length===0 && <tr><td colSpan={6} className="py-4 text-[var(--muted)]">Sin órdenes aún.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
