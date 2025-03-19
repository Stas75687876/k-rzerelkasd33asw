'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import type { CartItem as CartItemType } from '@/lib/store/cartStore';
import { initiateStripeCheckoutWithCart } from '@/lib/stripeClient';
import { toast } from 'sonner';
import { useClickAway } from 'react-use';

export default function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { 
    items, 
    totalItems, 
    totalPrice, 
    removeItem, 
    updateQuantity, 
    clearCart 
  } = useCartStore();

  // Schließe das Dropdown bei Klick außerhalb
  useClickAway(ref, () => setIsOpen(false));

  // Schließe das Dropdown beim Routing
  useEffect(() => {
    return () => setIsOpen(false);
  }, []);

  // Formatiere den Preis mit Währung
  const formatPrice = (price: number) => {
    return `€${price.toFixed(2)}`;
  };

  // Checkout-Handler mit Stripe
  const handleCheckout = async () => {
    try {
      if (items.length === 0) {
        toast.error('Dein Warenkorb ist leer');
        return;
      }
      
      // Vorbereitung der Checkout-Items
      const checkoutItems = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));
      
      // Zeige Toast-Nachricht
      toast.info('Checkout wird vorbereitet...');
      
      // Starte den Stripe-Checkout mit Cart-Items
      await initiateStripeCheckoutWithCart(checkoutItems);
      
      // Beachte: Der Warenkorb wird erst geleert, wenn die Zahlung erfolgreich war
      // Dies geschieht auf der Erfolgsseite
      
    } catch (error) {
      console.error('Checkout fehlgeschlagen', error);
      toast.error('Checkout konnte nicht initialisiert werden. Bitte versuche es später erneut.');
    }
  };

  // Prüfe, ob der Warenkorb leer ist
  const isCartEmpty = items.length === 0;

  return (
    <div className="relative z-50" ref={ref}>
      {/* Warenkorb-Button mit Zähler */}
      <Button
        variant="ghost"
        size="icon"
        className="relative text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ShoppingCart size={20} />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Button>

      {/* Warenkorb-Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-black border border-purple-500/30 rounded-lg shadow-2xl backdrop-blur-md overflow-hidden"
          >
            <div className="p-4 border-b border-purple-500/30 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Dein Warenkorb</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                <X size={16} />
              </Button>
            </div>

            {/* Warenkorbinhalt */}
            <div className="max-h-96 overflow-y-auto">
              {isCartEmpty ? (
                <div className="p-6 text-center text-gray-400">
                  <ShoppingCart className="mx-auto mb-2 text-gray-500" size={32} />
                  <p>Dein Warenkorb ist leer</p>
                </div>
              ) : (
                <ul className="divide-y divide-purple-500/10">
                  {items.map((item) => (
                    <CartItem 
                      key={item.id} 
                      item={item} 
                      onRemove={removeItem}
                      onUpdateQuantity={updateQuantity} 
                    />
                  ))}
                </ul>
              )}
            </div>

            {/* Warenkorb-Footer mit Gesamtpreis und Checkout-Button */}
            <div className="p-4 border-t border-purple-500/30 bg-purple-900/20">
              <div className="flex justify-between mb-4">
                <span className="text-gray-300">Gesamtsumme:</span>
                <span className="font-bold text-white">{formatPrice(totalPrice)}</span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  onClick={clearCart}
                  disabled={isCartEmpty}
                >
                  <Trash2 size={16} className="mr-1" />
                  Leeren
                </Button>
                
                <Button
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={handleCheckout}
                  disabled={isCartEmpty}
                >
                  Zur Kasse
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Einzelner Warenkorbposten
function CartItem({ 
  item, 
  onRemove, 
  onUpdateQuantity 
}: { 
  item: CartItemType; 
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}) {
  // Artikelmenge erhöhen
  const increaseQuantity = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  // Artikelmenge verringern
  const decreaseQuantity = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    } else {
      onRemove(item.id);
    }
  };

  return (
    <li className="p-3 flex items-center gap-3 hover:bg-white/5 transition-colors">
      {/* Artikelbild */}
      <div 
        className="h-14 w-14 rounded bg-purple-500/10 flex-shrink-0 overflow-hidden"
        style={{ 
          backgroundImage: `url(${item.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Artikeldetails */}
      <div className="flex-grow min-w-0">
        <h4 className="text-white text-sm font-medium truncate">{item.name}</h4>
        <p className="text-purple-400 text-sm">€{item.price.toFixed(2)}</p>
      </div>
      
      {/* Mengenkontrolle */}
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 text-gray-400 hover:text-white"
          onClick={decreaseQuantity}
        >
          <Minus size={14} />
        </Button>
        
        <span className="w-6 text-center text-white text-sm">{item.quantity}</span>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 text-gray-400 hover:text-white"
          onClick={increaseQuantity}
        >
          <Plus size={14} />
        </Button>
      </div>
    </li>
  );
} 