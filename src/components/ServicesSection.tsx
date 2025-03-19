'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Code, Palette, Globe, BarChart, ArrowRight } from 'lucide-react';

// Service card types and data
type ServiceCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
};

const services = [
  {
    title: 'Webdesign',
    description: 'Wir kreieren ästhetisch ansprechende und funktionale Designs, die Ihre Marke perfekt repräsentieren und Besucher begeistern.',
    icon: <Palette size={48} strokeWidth={1.5} />,
  },
  {
    title: 'Webentwicklung',
    description: 'Unsere Entwickler setzen moderne Technologien ein, um schnelle, responsive und zuverlässige Webseiten zu schaffen.',
    icon: <Code size={48} strokeWidth={1.5} />,
  },
  {
    title: 'E-Commerce Lösungen',
    description: 'Wir entwickeln maßgeschneiderte Onlineshops, die Ihre Produkte perfekt präsentieren und Conversions steigern.',
    icon: <Globe size={48} strokeWidth={1.5} />,
  },
  {
    title: 'SEO & Marketing',
    description: 'Mit gezielter Suchmaschinenoptimierung und digitalen Marketingstrategien erreichen wir mehr Sichtbarkeit für Ihre Website.',
    icon: <BarChart size={48} strokeWidth={1.5} />,
  },
];

// Individual service card component
function ServiceCard({ title, description, icon, delay }: ServiceCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay: delay * 0.1 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    >
      <Card className="bg-white/5 border-purple-500/20 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 h-full">
        <CardHeader>
          <div className="text-purple-500 mb-4">{icon}</div>
          <CardTitle className="text-2xl text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-gray-300 text-base">{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });
  
  return (
    <section 
      id="leistungen" 
      className="py-20 md:py-32 bg-gradient-to-b from-black to-purple-950"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Unsere <span className="text-purple-400">Leistungen</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Entdecken Sie unser umfassendes Angebot an Webdesign- und Entwicklungsdienstleistungen, 
            die Ihrem Unternehmen einen Wettbewerbsvorteil verschaffen.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={service.title}
              title={service.title}
              description={service.description}
              icon={service.icon}
              delay={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 