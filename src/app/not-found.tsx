import Link from 'next/link'
import { Navbar } from '@/components/marketing/Navbar'
import { Footer } from '@/components/marketing/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 py-24 text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-6">Page Not Found</h2>
        <p className="text-lg text-gray-300 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-block bg-[#00FF7F] text-black px-8 py-3 rounded-lg font-semibold hover:brightness-95 transition-all"
          >
            Go Home
          </Link>
          <Link
            href="/book-demo"
            className="inline-block bg-transparent border-2 border-[#00FF7F] text-[#00FF7F] px-8 py-3 rounded-lg font-semibold hover:bg-[#00FF7F] hover:text-black transition-all"
          >
            Book a Demo
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

