'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Menu, X, ShoppingBag } from 'lucide-react';
import CartDropdown from './Cart/CartDropdown';
import { useCartStore } from '@/lib/store/cartStore';

// Separate normale Links und Hash-Links
const pageLinks = [
  { name: 'Home', path: '/' as const },
  { name: 'Shop', path: '/shop' as const },
];

const hashLinks = [
  { name: 'Unsere Leistungen', hash: 'leistungen' },
  { name: 'Portfolio', hash: 'portfolio' },
  { name: 'Kontakt', hash: 'kontakt' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCartStore();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Funktion zum Scrollen zu einem Anker
  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Funktion zur Weiterleitung zum Kontaktformular
  const handleRequestQuote = () => {
    const contactSection = document.getElementById('kontakt');
    if (contactSection) {
      setIsMobileMenuOpen(false);
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Falls wir nicht auf der Startseite sind
      window.location.href = '/#kontakt';
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md py-2' : 'bg-transparent py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-white font-bold text-2xl">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white">CT</span><span className="text-purple-500"> Studio</span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="text-white hover:text-purple-400 transition-colors">
              Home
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <button 
              onClick={() => scrollToSection('leistungen')}
              className="text-white hover:text-purple-400 transition-colors"
            >
              Unsere Leistungen
            </button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <button 
              onClick={() => scrollToSection('portfolio')}
              className="text-white hover:text-purple-400 transition-colors"
            >
              Portfolio
            </button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link href="/shop" className="text-white hover:text-purple-400 transition-colors">
              Shop
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <button 
              onClick={() => scrollToSection('kontakt')}
              className="text-white hover:text-purple-400 transition-colors"
            >
              Kontakt
            </button>
          </motion.div>
          
          {/* Warenkorb */}
          <div className="relative">
            <CartDropdown />
          </div>
          
          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white"
            size="sm"
            onClick={handleRequestQuote}
          >
            Angebot anfordern
          </Button>
        </nav>

        {/* Mobile Menu Button and Cart */}
        <div className="md:hidden flex items-center gap-4">
          {/* Mobile Cart */}
          <div className="relative z-20">
            <CartDropdown />
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          className="md:hidden bg-black/95 backdrop-blur-md"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-purple-400 py-2 transition-colors"
            >
              Home
            </Link>
            
            <button 
              onClick={() => scrollToSection('leistungen')}
              className="text-white hover:text-purple-400 py-2 transition-colors text-left"
            >
              Unsere Leistungen
            </button>
            
            <button 
              onClick={() => scrollToSection('portfolio')}
              className="text-white hover:text-purple-400 py-2 transition-colors text-left"
            >
              Portfolio
            </button>
            
            <Link 
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-purple-400 py-2 transition-colors"
            >
              Shop
            </Link>
            
            <button 
              onClick={() => scrollToSection('kontakt')}
              className="text-white hover:text-purple-400 py-2 transition-colors text-left"
            >
              Kontakt
            </button>
            
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white w-full"
              onClick={handleRequestQuote}
            >
              Angebot anfordern
            </Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
} 