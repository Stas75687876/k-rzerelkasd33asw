import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialisiere Stripe mit dem Secret Key
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || 'sk_test_yourTestKeyHere',
  {
    apiVersion: '2025-02-24.acacia',
  }
);

export async function POST(req: NextRequest) {
  try {
    const { priceId, productName, productPrice } = await req.json();

    // In einer echten Anwendung würden wir hier eine Datenbank-Suche nach dem Produkt durchführen
    // und sein priceId verwenden, das bereits in Stripe erstellt wurde.
    // Für diese Demo erstellen wir eine Session direkt:

    let sessionConfig: Stripe.Checkout.SessionCreateParams = {
      // Automatische Zahlungsmethoden-Erkennung statt expliziter Liste
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: productName,
            },
            unit_amount: productPrice * 100, // Preis in Cent
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/shop`,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['DE', 'AT', 'CH'],
      },
      locale: 'de',
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
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
      { error: 'Internal server error', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 