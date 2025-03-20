/* @jsx React.createElement */
/* @jsxFrag React.Fragment */
'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from './ui/button';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';

import { motion, useInView } from 'framer-motion';
import { Button } from './ui/button';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';

import { motion, useInView } from 'framer-motion';
import { Button } from './ui/button';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function PortfolioSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <section id="portfolio" className="py-24 bg-black relative overflow-hidden">
      {/* Hintergrund-Effekt */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent z-10"></div>

      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
            Unsere Arbeit im Überblick
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Sehen Sie sich unser Werbevideo an und erfahren Sie mehr über unsere Dienstleistungen und wie wir Ihnen helfen können.
          </p>
        </motion.div>

        {/* Video-Container mit Vimeo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl shadow-purple-900/30"
        >
          <div className="aspect-video bg-gray-900 relative">
            <iframe
              className="w-full h-full"
              src="https://player.vimeo.com/video/76979871?autoplay=0^&loop=0"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Demo Video"
            </iframe>
          </div>

          <div className="bg-gray-900/95 p-6 border-t border-purple-500/20">
            <h3 className="text-xl font-bold text-white mb-2">Entdecken Sie unsere digitalen Lösungen</h3>
            <p className="text-gray-300 mb-4">
              Von der Konzeption bis zur Umsetzung - wir bieten maßgeschneiderte Webdesign- und Entwicklungslösungen für Ihr Unternehmen.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white border-0"
                onClick={() => document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Kontakt aufnehmen
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
