import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialisiere Stripe mit dem Secret Key
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || '',
  {
    apiVersion: '2025-02-24.acacia',
  }
);

// Interface für Bestell-Item
interface OrderItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Keine Artikel angegeben' },
        { status: 400 }
      );
    }
    
    // Erstelle Stripe Line Items aus den Artikeln
    const lineItems = items.map((item: OrderItem) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          description: item.description || undefined,
        },
        unit_amount: Math.round(item.price * 100), // Preis in Cent
      },
      quantity: item.quantity || 1,
    }));
    
    // Erstelle eine Checkout-Session
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL}/shop`,
      metadata: {
        items_count: items.length.toString(),
      },
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['DE', 'AT', 'CH'],
      },
      locale: 'de',
    });
    
    return NextResponse.json({ 
      success: true, 
      url: session.url 
    });
  } catch (error) {
    console.error('Fehler beim Erstellen der Checkout-Session:', error);
    // Ausführlichere Fehlerdetails für Debugging-Zwecke
    if (error instanceof Stripe.errors.StripeError) {
      console.error('Stripe-spezifischer Fehler:', {
        type: error.type,
        code: error.code,
        param: error.param,
        message: error.message
      });
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Fehler beim Erstellen der Checkout-Session',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 