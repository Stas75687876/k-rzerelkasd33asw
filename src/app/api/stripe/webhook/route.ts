import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { executeQuery } from '@/lib/db';

// Stripe Secret Key aus Umgebungsvariablen
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

// Webhook Secret aus Umgebungsvariablen
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    // Stripe Webhook Payload als Text lesen (wichtig für Signaturverifizierung)
    const payload = await req.text();
    
    // Stripe-Webhook Signatur aus Header extrahieren
    const signature = req.headers.get('stripe-signature') || '';
    
    // Event verifizieren und konstruieren
    let event;
    try {
      // Wenn Webhook Secret vorhanden ist, verifiziere die Signatur
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      } else {
        // Für Entwicklungszwecke: Ohne Signaturprüfung (nicht für Produktion empfohlen)
        console.warn('Kein STRIPE_WEBHOOK_SECRET definiert, Signatur wird nicht überprüft!');
        event = JSON.parse(payload);
      }
    } catch (err) {
      console.error(`Webhook Signatur Verifizierung fehlgeschlagen: ${err instanceof Error ? err.message : String(err)}`);
      return NextResponse.json(
        { success: false, message: 'Webhook Signatur ungültig' },
        { status: 400 }
      );
    }
    
    // Debug-Informationen
    console.log(`Stripe Webhook empfangen: ${event.type}`);
    
    // Verarbeite das Event basierend auf dem Typ
    switch (event.type) {
      case 'checkout.session.completed':
        // Bestellung erfolgreich abgeschlossen
        await handleCheckoutSessionCompleted(event.data.object);
        break;
        
      case 'payment_intent.succeeded':
        // Zahlung erfolgreich
        await handlePaymentIntentSucceeded(event.data.object);
        break;
        
      default:
        // Unbekannter Event-Typ - ignorieren oder loggen
        console.log(`Unverarbeiteter Webhook Typ: ${event.type}`);
    }
    
    // Erfolgreiche Antwort
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe Webhook Fehler:', error);
    return NextResponse.json(
      { success: false, message: 'Webhook Verarbeitungsfehler', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * Verarbeitet ein erfolgreich abgeschlossenes Checkout
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    // Session-Daten ausgeben
    console.log('Checkout Session abgeschlossen:', {
      id: session.id,
      customer: session.customer,
      customer_email: session.customer_details?.email,
      amount_total: session.amount_total,
      payment_status: session.payment_status,
    });
    
    // Prüfen ob die Session einen validen Kunden und Betrag hat
    if (!session.customer_details?.email || !session.amount_total) {
      console.error('Checkout Session ohne E-Mail oder Betrag');
      return;
    }
    
    // Bestelldaten für die Datenbank vorbereiten
    const customerEmail = session.customer_details.email;
    const total = session.amount_total / 100; // Umrechnung von Cent in Euro
    const paymentIntent = session.payment_intent as string;
    
    // Bestellung in der Datenbank speichern
    try {
      // 1. Prüfen, ob der Kunde bereits existiert - sonst anlegen
      let customerId = null;
      const customerResult = await executeQuery(
        `SELECT id FROM customers WHERE email = $1`,
        [customerEmail]
      );
      
      if (customerResult && Array.isArray(customerResult) && customerResult.length > 0) {
        customerId = customerResult[0].id;
      } else {
        // Neuen Kunden anlegen
        const name = session.customer_details.name || null;
        const address = session.customer_details.address ? 
          `${session.customer_details.address.line1}, ${session.customer_details.address.postal_code} ${session.customer_details.address.city}` : null;
          
        const newCustomerResult = await executeQuery(
          `INSERT INTO customers (email, name, address) VALUES ($1, $2, $3) RETURNING id`,
          [customerEmail, name, address]
        );
        
        if (newCustomerResult && Array.isArray(newCustomerResult) && newCustomerResult.length > 0) {
          customerId = newCustomerResult[0].id;
        }
      }
      
      // 2. Neue Bestellung anlegen
      const orderResult = await executeQuery(
        `INSERT INTO orders (customer_id, total, status, payment_intent) VALUES ($1, $2, $3, $4) RETURNING id`,
        [customerId, total, 'completed', paymentIntent]
      );
      
      if (!orderResult || !Array.isArray(orderResult) || orderResult.length === 0) {
        throw new Error('Fehler beim Speichern der Bestellung');
      }
      
      const orderId = orderResult[0].id;
      
      // 3. Bestellpositionen speichern
      // Wir müssen die Produktdaten aus der Session oder Stripe-API holen
      // Für dieses Beispiel verwenden wir vereinfachte Daten
      
      // Line Items aus der Session abrufen
      let lineItems;
      try {
        lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      } catch (error) {
        console.error('Fehler beim Abrufen der Line Items:', error);
        lineItems = { data: [] };
      }
      
      // Jede Position speichern
      for (const item of lineItems.data) {
        const productName = item.description || 'Unbekanntes Produkt';
        const price = item.amount_total ? item.amount_total / 100 : 0;
        const quantity = item.quantity || 1;
        
        // Produkt-ID suchen oder generisches Produkt verwenden
        let productId = 1; // Default-Produkt
        try {
          const productResult = await executeQuery(
            `SELECT id FROM products WHERE name LIKE $1 LIMIT 1`,
            [`%${productName}%`]
          );
          
          if (productResult && Array.isArray(productResult) && productResult.length > 0) {
            productId = productResult[0].id;
          }
        } catch (error) {
          console.warn('Fehler beim Suchen des Produkts, verwende Standard-Produkt:', error);
        }
        
        // Bestellposition speichern
        await executeQuery(
          `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)`,
          [orderId, productId, quantity, price / quantity] // Einzelpreis speichern
        );
      }
      
      console.log(`Bestellung erfolgreich gespeichert: ID ${orderId}, Kunde: ${customerEmail}, Betrag: ${total}€`);
    } catch (dbError) {
      console.error('Fehler beim Speichern der Bestellung in der Datenbank:', dbError);
      throw dbError;
    }
  } catch (error) {
    console.error('Fehler bei der Verarbeitung des Checkout-Session-Events:', error);
    throw error;
  }
}

/**
 * Verarbeitet einen erfolgreichen Payment Intent
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Loggen zur Diagnose
  console.log('Payment Intent erfolgreich:', {
    id: paymentIntent.id,
    amount: paymentIntent.amount,
    status: paymentIntent.status,
  });
  
  // In diesem Fall müssen wir nichts tun, da die Bestellung bereits bei checkout.session.completed verarbeitet wurde
  // Falls die Bestellung nur über PaymentIntent ohne Session erstellt wurde, könnte hier eine ähnliche Verarbeitung stattfinden
} 