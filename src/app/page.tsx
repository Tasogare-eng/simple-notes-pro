import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import PricingSection from '@/components/landing/PricingSection'
import FAQSection from '@/components/landing/FAQSection'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/landing/Footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <section id="features">
        <FeaturesSection />
      </section>
      <section id="pricing">
        <PricingSection />
      </section>
      <section id="faq">
        <FAQSection />
      </section>
      <CTASection />
      <Footer />
    </div>
  )
}

export const metadata = {
  title: 'Simple Notes Pro - The easiest way to organize your thoughts',
  description: 'Capture, organize, and access your thoughts with Simple Notes Pro. Start with 3 free notes, upgrade to unlimited when you\'re ready. No credit card required.',
}
