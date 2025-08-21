import '@/styles/globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'MundialJerseys',
  description: 'E-commerce de jerseys de fútbol',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="container max-w-6xl flex-1 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
