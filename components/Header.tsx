import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur bg-[var(--bg)]/80">
      <div className="container max-w-6xl flex items-center justify-between py-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            MundialJerseys
          </span>
        </Link>
        <nav className="flex gap-6 text-sm text-[var(--muted)]">
          <Link href="/">Catálogo</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  )
}
