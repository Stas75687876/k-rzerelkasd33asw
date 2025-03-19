import { NextRequest, NextResponse } from 'next/server';

// Hilfsfunktion zur Überprüfung der Admin-Authentifizierung
function isAuthenticated(req: NextRequest) {
  // In einer realen Anwendung sollten JWT-Token oder Sessions verwendet werden
  const authHeader = req.headers.get('Authorization');
  return authHeader && authHeader.startsWith('Bearer ');
}

// Typendefinition für den Bestellstatus
type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

// Handler für PATCH-Anfragen (Aktualisieren des Status)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Überprüfen der Admin-Authentifizierung
  if (!isAuthenticated(req)) {
    return NextResponse.json(
      { success: false, message: 'Nicht autorisiert' },
      { status: 401 }
    );
  }

  const orderId = params.id;

  try {
    // Daten aus dem Request-Body lesen
    const data = await req.json();
    const { status } = data;

    // Validierung des Status
    if (!status || !['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Ungültiger Status' },
        { status: 400 }
      );
    }

    // In einer realen Anwendung: Status in der Datenbank aktualisieren
    // const updatedOrder = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    
    // Für diese Demo: Simuliere eine erfolgreiche Aktualisierung
    const updatedOrder = {
      id: parseInt(orderId),
      status: status as OrderStatus,
      updatedAt: new Date().toISOString(),
      // Die anderen Felder würden aus der Datenbank kommen
      customerEmail: 'kundenservice@ct-studio.store',
      total: 499,
      customerId: null,
      paymentIntent: 'cs_live_123456',
      createdAt: new Date().toISOString(),
      items: [
        {
          id: 1,
          productId: 1,
          productName: 'Starter Website',
          price: 499,
          quantity: 1
        }
      ]
    };

    return NextResponse.json({
      success: true,
      message: `Status erfolgreich auf "${status}" aktualisiert`,
      order: updatedOrder
    });
  } catch (error) {
    console.error(`Fehler beim Aktualisieren des Status für Bestellung ${orderId}:`, error);
    return NextResponse.json(
      { success: false, message: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
} 