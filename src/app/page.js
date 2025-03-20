// page.js - Keine JSX-Syntax, nur React.createElement 
import React from 'react'; 
import HeroSection from '../components/HeroSection'; 
import ServicesSection from '../components/ServicesSection'; 
import PortfolioSection from '../components/PortfolioSection'; 
import TestimonialsSection from '../components/TestimonialsSection'; 
import ContactSection from '../components/ContactSection'; 
import FeaturesSection from '../components/FeaturesSection'; 
 
export default function Home() { 
  return React.createElement( 
    'main', 
    { className: 'min-h-screen bg-black text-white' }, 
    React.createElement(HeroSection, null), 
    React.createElement(ServicesSection, null), 
    React.createElement(FeaturesSection, null), 
    React.createElement(PortfolioSection, null), 
    React.createElement(TestimonialsSection, null), 
    React.createElement(ContactSection, null) 
  ); 
} 
