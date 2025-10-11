import { Header, Footer } from '@/components/layout'
import { HeroSection, Features, Testimonials } from '@/components/landing'

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header />
      <HeroSection />
      <Features />
      <Testimonials />
      <Footer />
    </main>
  )
}