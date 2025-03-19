import React from 'react';
import HeroBackground from '../components/HeroBackground';
import PortfolioVideo from '../components/PortfolioVideo';
// Weitere Imports

export default function Home() {
  return (
    <div>
      {/* Hero-Sektion mit Hintergrundvideo */}
      <section className="hero-section">
        <HeroBackground />
        <div className="hero-content">
          <h1>Willkommen auf unserer Website</h1>
          <p>Entdecken Sie unsere einzigartigen Produkte und Dienstleistungen</p>
          <button className="cta-button">Mehr erfahren</button>
        </div>
      </section>

      {/* Weitere Sektionen... */}

      {/* Portfolio-Sektion mit Demo-Video */}
      <section className="portfolio-section">
        <h2>Unsere Arbeit</h2>
        <p>Sehen Sie sich unser Showcase-Video an, um einen Eindruck von unseren Projekten zu bekommen.</p>
        <PortfolioVideo />
      </section>

      {/* Weitere Sektionen... */}
    </div>
  );
} 