'use client';

import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import PortfolioSection from '@/components/PortfolioSection';
import ShopSection from '@/components/ShopSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <ShopSection />
      <div id="kontakt">
        <ContactSection />
      </div>
      <Footer />
    </main>
  );
}
