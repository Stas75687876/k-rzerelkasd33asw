import { NextRequest, NextResponse } from 'next/server';
import { db, executeQuery } from '@/lib/db';
import { orders } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// Typdefinition für DB Ergebnisse
interface DbResult {
  rowCount?: number;
  [key: string]: any;
}

// Typdefinition für Bestellpositionen
interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

// Typdefinition für Bestellungen
interface Order {
  id: number;
  customerId: number | null;
  customerEmail: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentIntent: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

// Beispieldaten für Bestellungen (später durch Datenbankabfragen ersetzen)
const sampleOrders: Order[] = [
  {
    id: 10001,
    customerId: 1,
    customerEmail: 'kunde1@example.com',
    total: 999,
    status: 'completed',
    paymentIntent: 'pi_3NkL5jCIwMRVnHAd0X9Z5Z5Z',
    createdAt: '2023-11-15T14:30:00Z',
    updatedAt: '2023-11-15T14:35:00Z',
    items: [
      {
        id: 1,
        productId: 2,
        productName: 'Business Website',
        price: 999,
        quantity: 1
      }
    ]
  },
  {
    id: 10002,
    customerId: 2,
    customerEmail: 'kunde2@example.com',
    total: 1499,
    status: 'processing',
    paymentIntent: 'pi_3NkL5jCIwMRVnHAd0X9Z5Z6Z',
    createdAt: '2023-11-20T10:15:00Z',
    updatedAt: '2023-11-20T10:20:00Z',
    items: [
      {
        id: 2,
        productId: 3,
        productName: 'E-Commerce Lösung',
        price: 1499,
        quantity: 1
      }
    ]
  },
  {
    id: 10003,
    customerId: 3,
    customerEmail: 'kunde3@example.com',
    total: 598,
    status: 'pending',
    paymentIntent: 'pi_3NkL5jCIwMRVnHAd0X9Z5Z7Z',
    createdAt: '2023-11-25T09:45:00Z',
    updatedAt: '2023-11-25T09:45:00Z',
    items: [
      {
        id: 3,
        productId: 4,
        productName: 'Premium SEO Paket',
        price: 299,
        quantity: 2
      }
    ]
  },
  {
    id: 10004,
    customerId: 4,
    customerEmail: 'kunde4@example.com',
    total: 499,
    status: 'cancelled',
    paymentIntent: 'pi_3NkL5jCIwMRVnHAd0X9Z5Z8Z',
    createdAt: '2023-11-30T16:20:00Z',
    updatedAt: '2023-11-30T18:30:00Z',
    items: [
      {
        id: 4,
        productId: 1,
        productName: 'Starter Website',
        price: 499,
        quantity: 1
      }
    ]
  },
  // Stripe-Bestelldaten (für reale Test-Bestellungen)
  {
    id: 20001,
    customerId: null,
    customerEmail: 'kundenservice@ct-studio.store',
    total: 499,
    status: 'completed',
    paymentIntent: 'cs_live_123456',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 5,
        productId: 1,
        productName: 'Starter Website',
        price: 499,
        quantity: 1
      }
    ]
  }
];

// Speichere die neuesten Bestellungen (für Demo-Zwecke)
let latestOrders: Order[] = [...sampleOrders];

// Hilfsfunktion zur Überprüfung der Admin-Authentifizierung
function isAuthenticated(req: NextRequest) {
  // In einer realen Anwendung sollten JWT-Token oder Sessions verwendet werden
  const authHeader = req.headers.get('Authorization');
  return authHeader && authHeader.startsWith('Bearer ');
}

export async function GET(req: NextRequest) {
  // Überprüfen der Admin-Authentifizierung
  if (!isAuthenticated(req)) {
    return NextResponse.json(
      { success: false, message: 'Nicht autorisiert' },
      { status: 401 }
    );
  }

  try {
    // URL-Parameter prüfen
    const { searchParams } = new URL(req.url);
    const forceRefresh = searchParams.get('forceRefresh') === 'true';
    
    // In einer realen Anwendung: Daten aus der Datenbank laden
    let dbOrders: Order[] = [];
    try {
      const result = await executeQuery('SELECT * FROM orders ORDER BY created_at DESC');
      if (result && Array.isArray(result) && result.length > 0) {
        // Erfolgreicher DB-Zugriff, die Bestellungen verwenden
        dbOrders = result as Order[];
        console.log(`${dbOrders.length} Bestellungen aus der Datenbank geladen`);
      }
    } catch (dbError) {
      console.warn('Datenbankzugriff fehlgeschlagen, fallback zu lokalen Daten', dbError);
    }
    
    // Wenn Datenbankzugriff erfolgreich war oder Aktualisierung erzwungen wurde
    if (dbOrders.length > 0 || forceRefresh) {
      // Aktualisiere die latestOrders mit den DB-Daten (oder leere sie, wenn keine da sind)
      latestOrders = dbOrders.length > 0 ? dbOrders : [];
    }
    
    return NextResponse.json({
      success: true,
      orders: latestOrders,
      source: dbOrders.length > 0 ? 'database' : 'local'
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Bestellungen:', error);
    return NextResponse.json(
      { success: false, message: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

// DELETE-Handler zum Löschen aller Bestellungen
export async function DELETE(req: NextRequest) {
  // Überprüfen der Admin-Authentifizierung
  if (!isAuthenticated(req)) {
    return NextResponse.json(
      { success: false, message: 'Nicht autorisiert' },
      { status: 401 }
    );
  }

  try {
    // In einer realen Anwendung: Alle Bestellungen aus der Datenbank löschen
    let deletedCount = 0;
    
    try {
      // Erst Bestellpositionen löschen (wegen der Fremdschlüsselbeziehung)
      await executeQuery('DELETE FROM order_items');
      
      // Dann die Bestellungen selbst löschen
      const result = await executeQuery('DELETE FROM orders') as DbResult;
      
      if (result) {
        // In PostgreSQL gibt rowCount die Anzahl der gelöschten Zeilen an
        deletedCount = result.rowCount || 0;
        console.log(`${deletedCount} Bestellungen aus der Datenbank gelöscht`);
      }
    } catch (dbError) {
      console.warn('Datenbankzugriff zum Löschen fehlgeschlagen', dbError);
      // Fallback zu lokalem Löschen
      deletedCount = latestOrders.length;
    }
    
    // Leere auch die lokalen Bestellungen
    latestOrders = [];
    
    return NextResponse.json({
      success: true,
      message: `Alle Bestellungen erfolgreich gelöscht (${deletedCount} Einträge)`,
      deletedCount
    });
  } catch (error) {
    console.error('Fehler beim Löschen der Bestellungen:', error);
    return NextResponse.json(
      { success: false, message: 'Interner Serverfehler beim Löschen der Bestellungen' },
      { status: 500 }
    );
  }
} 