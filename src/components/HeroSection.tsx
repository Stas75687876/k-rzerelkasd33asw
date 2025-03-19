'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function HeroSection() {
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    // Register ScrollTrigger plugin
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      // Animate the hero text
      const textElements = textRef.current?.querySelectorAll('.animate-text');
      if (textElements) {
        gsap.fromTo(textElements, {
          y: 100,
          opacity: 0
        }, {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 1,
          ease: "power3.out"
        });
      }
      
      // Parallax effect for video background
      if (videoRef.current) {
        gsap.to(videoRef.current, {
          y: '30%',
          scrollTrigger: {
            trigger: videoRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    }
  }, []);

  // Scroll to contact section when requesting offer
  const scrollToContact = () => {
    const contactSection = document.getElementById('kontakt');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: Direkte URL-Navigation, falls Element nicht gefunden wird
      window.location.href = '/#kontakt';
    }
  };

  // Scroll to portfolio section
  const scrollToPortfolio = () => {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: Direkte URL-Navigation, falls Element nicht gefunden wird
      window.location.href = '/#portfolio';
    }
  };
  
  return (
    <div className="relative h-screen overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full bg-black">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover opacity-60"
          src="/videos/hero-background.mp4"
        ></video>
        {/* Overlay für besseren Kontrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
      </div>

      {/* Content Layer */}
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center relative z-10">
        <div ref={textRef} className="max-w-4xl mx-auto">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-text bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-500"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Moderne Websites mit <span className="text-purple-400">Wow-Effekt</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-10 animate-text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Wir entwickeln maßgeschneiderte Webseiten, die Ihre Besucher begeistern
            und Ihr Unternehmen digital erfolgreich machen.
          </motion.p>
          
          <motion.div 
            className="flex flex-col md:flex-row gap-4 justify-center animate-text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg"
              onClick={scrollToContact}
            >
              Angebot anfordern
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
              onClick={scrollToPortfolio}
            >
              Unsere Arbeit sehen
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Gradient overlay at the bottom for smooth transition */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
} 