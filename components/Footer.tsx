export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16">
      <div className="container max-w-6xl py-10 text-center text-sm text-[var(--muted)]">
        © {new Date().getFullYear()} MundialJerseys — Todos los derechos reservados.
      </div>
    </footer>
  )
}
