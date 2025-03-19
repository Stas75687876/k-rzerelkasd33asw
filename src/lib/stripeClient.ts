// Hilfsfunktion für Stripe-Checkout
export async function initiateStripeCheckout(productName: string, productPrice: number) {
  try {
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            id: Date.now(),
            name: productName,
            price: productPrice,
            quantity: 1,
          }
        ],
      }),
    });

    const { success, url, message } = await response.json();
    
    if (!success || !url) {
      throw new Error(message || 'Keine Checkout-URL erhalten');
    }
    
    // Weiterleitung zur Stripe Checkout-Seite
    window.location.href = url;
  } catch (error) {
    console.error('Fehler beim Initiieren des Checkouts:', error);
    throw error;
  }
}

// Hilfsfunktion für Stripe-Checkout mit mehreren Produkten (Warenkorb)
export async function initiateStripeCheckoutWithCart(items: Array<{
  id: string | number;
  name: string;
  price: number;
  quantity: number;
}>) {
  try {
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });

    const { success, url, message } = await response.json();
    
    if (!success || !url) {
      throw new Error(message || 'Keine Checkout-URL erhalten');
    }
    
    // Weiterleitung zur Stripe Checkout-Seite
    window.location.href = url;
  } catch (error) {
    console.error('Fehler beim Initiieren des Checkouts:', error);
    throw error;
  }
} 