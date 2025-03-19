'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';

// Produkttyp-Definition
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  featured?: boolean;
}

// Produkt-Karte Komponente
const ProductCard = ({ product, index }: { product: Product, index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const { addItem } = useCartStore();
  
  // Zum Warenkorb hinzufügen
  const handleAddToCart = () => {
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      category: product.category
    });
  };
  
  // Direkt zum Checkout (Stripe) weiterleiten
  const handleBuyNow = async () => {
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: 1
            }
          ]
        })
      });

      const session = await response.json();
      if (session.url) {
        window.location.href = session.url;
      }
    } catch (error) {
      console.error('Fehler beim Checkout:', error);
    }
  };
  
  // Formatiere Preis mit Euro-Symbol
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
  };
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col h-full"
    >
      <div className="bg-white/5 border border-purple-500/20 rounded-lg overflow-hidden flex flex-col h-full hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
        {/* Produktbild */}
        <div 
          className="aspect-[4/3] bg-gradient-to-br from-purple-900/50 to-pink-900/50 relative"
          style={{ 
            backgroundImage: `url(${product.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute bottom-3 left-3">
            <span className="bg-purple-600/80 text-white text-xs px-2 py-1 rounded">
              {product.category}
            </span>
          </div>
        </div>
        
        {/* Produktinfo */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
          <p className="text-gray-400 mb-4 flex-grow">{product.description}</p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-purple-400">{formatPrice(product.price)}</span>
          </div>
          <div className="space-y-2">
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={handleAddToCart}
            >
              Zum Warenkorb hinzufügen
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-purple-500/30 text-white hover:bg-purple-500/10"
              onClick={handleBuyNow}
            >
              Sofort kaufen
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ShopSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });
  
  // Lade featured Produkte aus der Datenbank
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Produkte');
        }

        const data = await response.json();
        if (data.success) {
          // Sortiere nach featured und ID und nimm die neuesten 4
          const sortedProducts = [...data.products]
            .sort((a, b) => {
              // Zuerst nach featured sortieren
              if (a.featured && !b.featured) return -1;
              if (!a.featured && b.featured) return 1;
              // Dann nach ID (absteigend für neueste)
              return b.id - a.id;
            })
            .slice(0, 4);
          
          setProducts(sortedProducts);
        } else {
          throw new Error(data.message || 'Fehler beim Laden der Produkte');
        }
      } catch (error) {
        console.error('Fehler beim Laden der Produkte:', error);
        setError('Produkte konnten nicht geladen werden');
        
        // Fallback zu Beispiel-Produkten
        setProducts([
          {
            id: 1,
            name: 'Starter Website',
            description: 'Einfache, responsive Website mit bis zu 5 Seiten.',
            price: 499,
            imageUrl: '/api/placeholder?width=600&height=400&text=Starter-Website&bg=hsl(270,50%,30%)',
            category: 'Website',
            featured: true
          },
          {
            id: 2,
            name: 'Business Website',
            description: 'Professionelle Website mit CMS und SEO-Optimierung.',
            price: 999,
            imageUrl: '/api/placeholder?width=600&height=400&text=Business-Website&bg=hsl(300,50%,30%)',
            category: 'Website',
            featured: true
          },
          {
            id: 3,
            name: 'E-Commerce Shop',
            description: 'Vollständige E-Commerce-Lösung mit Zahlungsabwicklung.',
            price: 1999,
            imageUrl: '/api/placeholder?width=600&height=400&text=E-Commerce&bg=hsl(330,50%,30%)',
            category: 'E-Commerce'
          },
          {
            id: 4,
            name: 'SEO Paket',
            description: 'Umfassende SEO-Optimierung zur Verbesserung der Sichtbarkeit.',
            price: 599,
            imageUrl: '/api/placeholder?width=600&height=400&text=SEO-Paket&bg=hsl(200,50%,30%)',
            category: 'Marketing'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section 
      id="shop" 
      className="py-20 md:py-32 bg-gradient-to-b from-purple-950 to-black"
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
            Unsere <span className="text-purple-400">Produkte</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Entdecken Sie unsere digitalen Lösungen und Services, die Ihrem Unternehmen helfen, online zu wachsen.
          </p>
        </motion.div>
        
        {/* Produkte */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
            <span className="ml-3 text-xl text-gray-300">Produkte werden geladen...</span>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center text-red-300">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6 text-center">
            <h3 className="text-xl text-gray-200 mb-2">Keine Produkte gefunden</h3>
            <p className="text-gray-400">
              Derzeit sind keine Produkte verfügbar.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, index) => (
              <ProductCard 
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        )}
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <Link href="/shop" passHref>
            <Button 
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Alle Produkte ansehen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
        
        <motion.div 
          className="mt-24 text-center bg-gradient-to-br from-purple-900/50 to-pink-900/50 p-8 rounded-xl border border-purple-500/30"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <h2 className="text-2xl font-bold mb-3 text-white">Maßgeschneiderte Lösungen benötigt?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Unsere vorgefertigten Pakete decken nicht Ihre speziellen Anforderungen ab? 
            Wir erstellen individuelle Lösungen, die perfekt zu Ihrem Unternehmen passen.
          </p>
          <Button 
            variant="default" 
            size="lg"
            className="bg-white text-purple-900 hover:bg-gray-100"
            onClick={() => window.location.href = '/contact'}
          >
            Individuelles Angebot anfordern
          </Button>
        </motion.div>
      </div>
    </section>
  );
} 