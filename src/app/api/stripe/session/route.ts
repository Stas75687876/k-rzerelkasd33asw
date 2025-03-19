import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { executeQuery } from '@/lib/db';

// Initialisiere Stripe mit dem Secret Key
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || '',
  {
    apiVersion: '2025-02-24.acacia',
  }
);

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Session ID ist erforderlich' },
        { status: 400 }
      );
    }
    
    // 1. Prüfen, ob eine Bestellung mit diesem Payment Intent bereits existiert
    let existingOrder = null;
    try {
      const result = await executeQuery(
        `SELECT * FROM orders WHERE payment_intent = $1`,
        [sessionId]
      );
      
      if (result && Array.isArray(result) && result.length > 0) {
        existingOrder = result[0];
        console.log('Bestehende Bestellung gefunden:', existingOrder);
      }
    } catch (dbError) {
      console.warn('Fehler beim Prüfen auf bestehende Bestellung:', dbError);
    }
    
    // 2. Wenn die Bestellung bereits existiert, gib sie zurück
    if (existingOrder) {
      // Bestellpositionen abrufen
      try {
        const orderItems = await executeQuery(
          `SELECT * FROM order_items WHERE order_id = $1`,
          [existingOrder.id]
        );
        
        if (orderItems && Array.isArray(orderItems)) {
          existingOrder.items = orderItems;
        }
      } catch (error) {
        console.warn('Fehler beim Abrufen der Bestellpositionen:', error);
        existingOrder.items = [];
      }
      
      return NextResponse.json({
        success: true,
        order: existingOrder,
        message: 'Bestehende Bestellung gefunden'
      });
    }
    
    // 3. Wenn nicht, rufe die Session-Details von Stripe ab
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items', 'customer_details']
      });
    } catch (stripeError) {
      console.error('Fehler beim Abrufen der Stripe Session:', stripeError);
      return NextResponse.json(
        { success: false, message: 'Fehler beim Abrufen der Stripe Session', error: stripeError instanceof Error ? stripeError.message : String(stripeError) },
        { status: 500 }
      );
    }
    
    // 4. Prüfe, ob die Session eine Payment Intent ID hat
    const paymentIntentId = session.payment_intent ? 
      (typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent.id) : 
      sessionId;
    
    // 5. Speichere die Bestellung in der Datenbank
    let newOrder = null;
    try {
      // Kunden-Details extrahieren
      const customerEmail = session.customer_details?.email || 'keine@email.angegeben';
      const total = session.amount_total ? session.amount_total / 100 : 0; // Umrechnung von Cent in Euro
      
      // 5.1 Prüfen ob der Kunde existiert oder anlegen
      let customerId = null;
      const customerResult = await executeQuery(
        `SELECT id FROM customers WHERE email = $1`,
        [customerEmail]
      );
      
      if (customerResult && Array.isArray(customerResult) && customerResult.length > 0) {
        customerId = customerResult[0].id;
      } else {
        // Kunde anlegen
        const name = session.customer_details?.name || null;
        const address = session.customer_details?.address ? 
          `${session.customer_details.address.line1}, ${session.customer_details.address.postal_code} ${session.customer_details.address.city}` : 
          null;
          
        const newCustomerResult = await executeQuery(
          `INSERT INTO customers (email, name, address) VALUES ($1, $2, $3) RETURNING id`,
          [customerEmail, name, address]
        );
        
        if (newCustomerResult && Array.isArray(newCustomerResult) && newCustomerResult.length > 0) {
          customerId = newCustomerResult[0].id;
        }
      }
      
      // 5.2 Bestellung anlegen
      const orderResult = await executeQuery(
        `INSERT INTO orders (customer_id, total, status, payment_intent) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [customerId, total, session.payment_status === 'paid' ? 'completed' : 'pending', paymentIntentId]
      );
      
      if (!orderResult || !Array.isArray(orderResult) || orderResult.length === 0) {
        throw new Error('Fehler beim Speichern der Bestellung');
      }
      
      newOrder = orderResult[0];
      
      // 5.3 Bestellpositionen speichern
      const orderId = newOrder.id;
      const orderItems = [];
      
      // Line Items aus der erweiterten Session abrufen
      if (session.line_items && session.line_items.data) {
        for (const item of session.line_items.data) {
          const productName = item.description || 'Unbekanntes Produkt';
          const price = item.amount_total ? item.amount_total / 100 : 0;
          const quantity = item.quantity || 1;
          
          // Produkt-ID suchen oder generisches Produkt verwenden
          let productId = 1; // Default-Produkt ID
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
          const orderItemResult = await executeQuery(
            `INSERT INTO order_items (order_id, product_id, quantity, price) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [orderId, productId, quantity, price / quantity] // Einzelpreis speichern
          );
          
          if (orderItemResult && Array.isArray(orderItemResult) && orderItemResult.length > 0) {
            const orderItem = orderItemResult[0];
            orderItem.productName = productName; // Zusätzlich den Produktnamen hinzufügen
            orderItems.push(orderItem);
          }
        }
      }
      
      // Bestellpositionen zur Bestellung hinzufügen
      newOrder.items = orderItems;
      
      console.log(`Bestellung erfolgreich gespeichert: ID ${orderId}, Kunde: ${customerEmail}, Betrag: ${total}€`);
    } catch (dbError) {
      console.error('Fehler beim Speichern der Bestellung in der Datenbank:', dbError);
      // Fallback zur Session ohne DB-Speicherung
      return NextResponse.json({
        success: true,
        order: {
          id: Date.now(),
          customerId: null,
          customerEmail: session.customer_details?.email || 'keine@email.angegeben',
          total: session.amount_total ? session.amount_total / 100 : 0,
          status: session.payment_status === 'paid' ? 'completed' : 'pending',
          paymentIntent: paymentIntentId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          items: session.line_items?.data.map(item => ({
            productName: item.description,
            price: item.amount_total ? item.amount_total / 100 : 0,
            quantity: item.quantity || 1
          })) || []
        },
        message: 'Bestellung aus Stripe-Session erstellt (ohne DB-Speicherung)'
      });
    }
    
    // 6. Bestellung zurückgeben
    return NextResponse.json({
      success: true,
      order: newOrder,
      message: 'Neue Bestellung aus Stripe-Session erstellt und gespeichert'
    });
  } catch (error) {
    console.error('Fehler bei der Verarbeitung der Anfrage:', error);
    return NextResponse.json(
      { success: false, message: 'Interner Serverfehler', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 