'use client';

import { Input } from './ui/input';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-8 md:mb-0">
            <h3 className="text-2xl font-bold mb-4">CT Studio</h3>
            <p className="text-gray-400 mb-4">
              Wir kreieren atemberaubende digitale Erlebnisse, die begeistern und überzeugen.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-purple-500 transition-colors"
                aria-label="Instagram"
              >
                Instagram
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-purple-500 transition-colors"
                aria-label="Facebook"
              >
                Facebook
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-purple-500 transition-colors"
                aria-label="Twitter"
              >
                Twitter
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-purple-500 transition-colors"
                aria-label="LinkedIn"
              >
                LinkedIn
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Leistungen</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                  Webdesign
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                  E-Commerce
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                  SEO
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                  Content Marketing
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Unternehmen</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                  Über uns
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                  Karriere
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                  Kontakt
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Rechtliches</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/datenschutz" 
                  className="text-gray-400 hover:text-purple-500 transition-colors"
                >
                  Datenschutz
                </a>
              </li>
              <li>
                <a 
                  href="/impressum"
                  className="text-gray-400 hover:text-purple-500 transition-colors"
                >
                  Impressum
                </a>
              </li>
              <li>
                <a 
                  href="/agb"
                  className="text-gray-400 hover:text-purple-500 transition-colors"
                >
                  AGB
                </a>
              </li>
              <li>
                <a 
                  href="/cookie-richtlinie"
                  className="text-gray-400 hover:text-purple-500 transition-colors"
                >
                  Cookie-Richtlinie
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {currentYear} CT Studio. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
} 