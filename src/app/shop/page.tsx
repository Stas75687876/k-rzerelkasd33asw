'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ShoppingCart, Filter, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { initiateStripeCheckout } from '@/lib/stripeClient';
import { toast } from 'sonner';
import { Product as ProductType } from '@/lib/services/productService';
import { useCartStore } from '@/lib/store/cartStore';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowRight } from 'lucide-react';

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

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCartStore();

  // Produkte von der API abrufen
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Produkte');
        }

        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
          
          // Kategorien aus Produkten extrahieren
          const uniqueCategories = Array.from(
            new Set(data.products.map((product: Product) => product.category))
          ) as string[];
          setCategories(uniqueCategories);
          
          // Initial alle Produkte anzeigen
          setFilteredProducts(data.products);
        } else {
          throw new Error(data.message || 'Fehler beim Laden der Produkte');
        }
      } catch (error) {
        console.error('Fehler beim Laden der Produkte:', error);
        setError('Produkte konnten nicht geladen werden. Bitte versuche es später noch einmal.');
        
        // Fallback-Produkte für Entwicklungszwecke
        const sampleProducts = [
          {
            id: 1,
            name: 'Starter Website',
            description: 'Einfache, responsive Website mit bis zu 5 Seiten',
            price: 499,
            imageUrl: '/api/placeholder?width=600&height=400&text=Starter-Website&bg=hsl(270,50%,30%)',
            category: 'Website'
          },
          {
            id: 2,
            name: 'Business Website',
            description: 'Professionelle Website mit CMS und SEO-Optimierung',
            price: 999,
            imageUrl: '/api/placeholder?width=600&height=400&text=Business-Website&bg=hsl(300,50%,30%)',
            category: 'Website'
          },
          {
            id: 3,
            name: 'E-Commerce Shop',
            description: 'Vollständige E-Commerce-Lösung mit Zahlungsabwicklung',
            price: 1999,
            imageUrl: '/api/placeholder?width=600&height=400&text=E-Commerce&bg=hsl(330,50%,30%)',
            category: 'E-Commerce'
          },
          {
            id: 4,
            name: 'SEO Paket',
            description: 'Umfassende SEO-Optimierung zur Verbesserung der Sichtbarkeit',
            price: 599,
            imageUrl: '/api/placeholder?width=600&height=400&text=SEO-Paket&bg=hsl(200,50%,30%)',
            category: 'Marketing'
          }
        ];
        
        setProducts(sampleProducts);
        setFilteredProducts(sampleProducts);
        setCategories(['Website', 'E-Commerce', 'Marketing']);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter anwenden, wenn Kategorie geändert wird
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => product.category === selectedCategory);
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  // Zum Warenkorb hinzufügen
  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      category: product.category
    });
  };

  // Direkt zum Checkout (Stripe) weiterleiten
  const handleBuyNow = async (product: Product) => {
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
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Unser <span className="text-purple-400">Shop</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-300 max-w-2xl mx-auto"
          >
            Entdecke unsere professionellen Dienstleistungen und Produkte, 
            die deine digitale Präsenz auf das nächste Level bringen.
          </motion.p>
        </div>
        
        {/* Kategorie-Filter */}
        <div className="mb-8">
          <Tabs defaultValue="all" onValueChange={setSelectedCategory}>
            <TabsList className="bg-black/50 border border-purple-500/20 mb-2">
              <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
                Alle
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="data-[state=active]:bg-purple-600"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
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
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">Keine Produkte gefunden</p>
            <Button onClick={() => setSelectedCategory('all')}>Alle Produkte anzeigen</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden bg-white/5 border-purple-500/20 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 h-full flex flex-col">
                  {/* Produktbild */}
                  <div 
                    className="h-48 w-full"
                    style={{ 
                      backgroundImage: `url(${product.imageUrl})`, 
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: 'rgba(139, 92, 246, 0.1)'
                    }}
                  />
                  
                  <CardHeader>
                    <CardTitle className="text-xl text-white">{product.name}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {product.description.length > 120 
                        ? `${product.description.substring(0, 120)}...` 
                        : product.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-grow">
                    <div className="flex justify-between items-center">
                      <p className="text-2xl font-bold text-purple-400">€{formatPrice(product.price)}</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                        {product.category}
                      </span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex flex-col gap-2">
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      In den Warenkorb
                    </Button>
                    <Button 
                      className="w-full bg-transparent border border-purple-500 hover:bg-purple-500/20 text-white"
                      variant="outline"
                      onClick={() => handleBuyNow(product)}
                    >
                      Jetzt kaufen
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Call-to-Action */}
        <motion.div 
          className="mt-16 text-center bg-gradient-to-r from-purple-800 to-indigo-800 p-8 rounded-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
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
      </main>
      
      <Footer />
    </div>
  );
} 