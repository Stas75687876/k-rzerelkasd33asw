'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { initiateStripeCheckout } from '@/lib/stripeClient';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function TestShopPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleStripeCheckout = async () => {
    try {
      setIsLoading(true);
      toast.info('Stripe-Checkout wird initialisiert...');
      
      // Test-Produkt für Checkout
      await initiateStripeCheckout('Test Produkt', 9.99);
    } catch (error) {
      console.error('Fehler beim Initiieren des Checkouts:', error);
      toast.error('Fehler beim Initiieren des Checkouts');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-8">
              Stripe-Checkout Testseite
            </h1>
            
            <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-bold mb-4">
                API-Umgebung testen
              </h2>
              <p className="mb-6">
                Dieser Test verwendet die konfigurierten Stripe-API-Schlüssel, um einen Checkout-Prozess zu starten.
                Durch Klicken des Buttons wird eine Checkout-Session für ein Test-Produkt (9,99 €) erstellt.
              </p>
              
              <Button 
                onClick={handleStripeCheckout}
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isLoading ? 'Wird initialisiert...' : 'Stripe-Checkout testen'}
              </Button>
            </div>
            
            <div className="text-left bg-white/5 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">API-Informationen:</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• API-Modus: <span className="text-green-400 font-semibold">Live</span></li>
                <li>• Publishable Key: <span className="text-yellow-400 font-mono text-sm">pk_live_51R42us...</span></li>
                <li>• Redirect URL: <span className="text-blue-400 font-mono text-sm">{process.env.NEXT_PUBLIC_SITE_URL}/success</span></li>
              </ul>
              
              <div className="mt-4 text-amber-400 bg-amber-400/10 p-3 rounded-md">
                <p className="text-sm">
                  <strong>Hinweis:</strong> Da Sie Live-Schlüssel verwenden, werden tatsächliche Transaktionen durchgeführt.
                  Für Testzwecke empfehlen wir die Verwendung von Test-Schlüsseln.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 