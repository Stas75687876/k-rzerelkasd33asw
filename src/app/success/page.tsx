'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, CheckCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCartStore } from '@/lib/store/cartStore';

// Neue Komponente für die Bestelldetails
const OrderDetails = ({ sessionId }: { sessionId: string }) => {
  const [order, setOrder] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { clearCart } = useCartStore();

  React.useEffect(() => {
    // Warenkorb leeren, da die Bestellung erfolgreich war
    clearCart();
    
    // Bestellung über die API speichern und Bestelldetails holen
    const saveOrderAndGetDetails = async () => {
      if (!sessionId) {
        setError('Keine Bestellnummer gefunden');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/stripe/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Fehler beim Abrufen der Bestelldetails');
        }

        setOrder(data.order);
      } catch (err) {
        console.error('Fehler beim Abrufen der Bestelldetails:', err);
        setError('Bestelldetails konnten nicht geladen werden');
      } finally {
        setLoading(false);
      }
    };

    saveOrderAndGetDetails();
  }, [sessionId, clearCart]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-40 py-10">
        <div className="text-center space-y-4">
          <div className="animate-spin w-10 h-10 rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-300">Bestelldetails werden abgerufen...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-red-500 mb-4">{error}</p>
        <p className="text-gray-300">Ihre Bestellung wurde dennoch erfolgreich verarbeitet.</p>
        <p className="text-gray-300">Bestellnummer: {sessionId}</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 mt-8 bg-purple-900/30 backdrop-blur-sm text-white shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-white">Bestelldetails</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between border-b border-white/20 pb-2">
          <span className="text-gray-300">Bestellnummer:</span>
          <span className="font-medium text-white break-all">
            {order.payment_intent || order.paymentIntent || sessionId}
          </span>
        </div>
        
        <div className="flex justify-between border-b border-white/20 pb-2">
          <span className="text-gray-300">Status:</span>
          <span className="font-medium text-green-400">
            {order.status === 'completed' ? 'Bezahlt' : order.status === 'pending' ? 'In Bearbeitung' : order.status}
          </span>
        </div>
        
        <div className="flex justify-between border-b border-white/20 pb-2">
          <span className="text-gray-300">Bezahlmethode:</span>
          <span className="font-medium text-white">Stripe</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-300">Gesamtbetrag:</span>
          <span className="font-semibold text-white">{formatCurrency(order.total)}</span>
        </div>
      </div>

      {order.items && order.items.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium mb-2 text-white">Bestellte Artikel</h4>
          <ul className="space-y-2">
            {order.items.map((item: any, index: number) => (
              <li key={index} className="flex justify-between py-2 border-b border-white/20">
                <div className="flex-1">
                  <p className="font-medium text-white">{item.productName || `Produkt #${item.product_id}`}</p>
                  <p className="text-sm text-gray-300">Menge: {item.quantity}</p>
                </div>
                <p className="font-medium text-white">{formatCurrency(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function SuccessPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const sessionId = searchParams.session_id || '';

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <main className="container mx-auto py-24 px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="text-green-600 w-8 h-8" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Vielen Dank für Ihren Einkauf!
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Ihre Bestellung wurde erfolgreich abgeschlossen und wird nun bearbeitet.
          </p>
        </div>

        {sessionId ? (
          <OrderDetails sessionId={sessionId} />
        ) : (
          <div className="text-center py-6 bg-white/5 rounded-lg p-8">
            <p className="text-amber-400 mb-4">Keine Bestellnummer gefunden</p>
            <p className="text-gray-300">Falls Probleme auftreten, kontaktieren Sie bitte unseren Kundenservice.</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 justify-center mt-10">
          <Link href="/shop">
            <Button variant="outline" className="w-full md:w-auto">
              Zurück zum Shop
            </Button>
          </Link>

          <Link href="/">
            <Button className="w-full md:w-auto bg-purple-600 hover:bg-purple-700">
              Zur Startseite
            </Button>
          </Link>
        </div>
        
        <div className="text-center mt-12 text-sm text-gray-400">
          <p>Eine Bestätigungsmail wurde an Ihre E-Mail-Adresse gesendet.</p>
          <p className="mt-1">Bei Fragen kontaktieren Sie uns bitte unter <a href="mailto:info@neu.com" className="text-purple-400 hover:underline">info@neu.com</a></p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 