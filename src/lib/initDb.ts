import { db, executeQuery } from './db';
import { customers, products, orders, orderItems } from './schema';
import { sql } from 'drizzle-orm';

/**
 * Initialisiert die Datenbankverbindung und erstellt die erforderlichen Tabellen
 */
export async function initDatabase() {
  try {
    console.log('Datenbank-Initialisierung wird gestartet...');

    // Prüfe die Datenbankverbindung
    const result = await executeQuery('SELECT NOW()');
    console.log('Datenbankverbindung erfolgreich hergestellt:', result);

    // Erstelle Tabellen
    await createTables();
    
    // Prüfe, ob Beispieldaten eingefügt werden sollen
    const shouldInsertSampleData = process.env.INSERT_SAMPLE_DATA === 'true';
    if (shouldInsertSampleData) {
      await insertSampleData();
    }

    console.log('Datenbank-Initialisierung abgeschlossen');
    return { success: true };
  } catch (error) {
    console.error('Fehler bei der Datenbank-Initialisierung:', error);
    return { success: false, error };
  }
}

/**
 * Erstellt die benötigten Tabellen in der Datenbank
 */
async function createTables() {
  try {
    console.log('Erstelle Datenbanktabellen...');

    // Erstelle Tabellen mit SQL (für mehr Kontrolle über die Tabellenerstellung)
    // Kategorie-Enum
    await executeQuery(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'category') THEN
          CREATE TYPE category AS ENUM ('Website', 'E-Commerce', 'Marketing', 'Design', 'Service');
        END IF;
      END
      $$;
    `);

    // Order-Status-Enum
    await executeQuery(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
          CREATE TYPE order_status AS ENUM ('pending', 'processing', 'completed', 'cancelled');
        END IF;
      END
      $$;
    `);

    // Produkte-Tabelle
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image_url TEXT NOT NULL,
        category category NOT NULL,
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        available BOOLEAN DEFAULT true,
        metadata JSONB
      );
    `);

    // Kunden-Tabelle
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255),
        address TEXT,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW(),
        metadata JSONB
      );
    `);

    // Bestellungen-Tabelle
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id),
        total DECIMAL(10, 2) NOT NULL,
        status order_status DEFAULT 'pending',
        payment_intent VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        metadata JSONB
      );
    `);

    // Bestellpositionen-Tabelle
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) NOT NULL,
        product_id INTEGER REFERENCES products(id) NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        metadata JSONB
      );
    `);

    console.log('Tabellen erfolgreich erstellt oder schon vorhanden');
  } catch (error) {
    console.error('Fehler beim Erstellen der Tabellen:', error);
    throw error;
  }
}

/**
 * Fügt Beispieldaten in die Datenbank ein
 */
async function insertSampleData() {
  try {
    console.log('Füge Beispieldaten ein...');

    // Prüfe, ob bereits Produkte vorhanden sind
    const existingProducts = await executeQuery('SELECT COUNT(*) FROM products');
    if (existingProducts[0].count > 0) {
      console.log('Beispieldaten bereits vorhanden, überspringe Einfügen');
      return;
    }

    // Beispielprodukte
    const sampleProducts = [
      {
        name: 'Starter Website',
        description: 'Eine einfache, responsive Website mit bis zu 5 Seiten für kleine Unternehmen.',
        price: 499,
        image_url: '/api/placeholder?width=800&height=600&text=Starter%20Website&bg=hsl(270,60%,30%)',
        category: 'Website',
        featured: true
      },
      {
        name: 'Business Website',
        description: 'Eine professionelle Website mit CMS, bis zu 10 Seiten und SEO-Optimierung.',
        price: 999,
        image_url: '/api/placeholder?width=800&height=600&text=Business%20Website&bg=hsl(240,60%,40%)',
        category: 'Website',
        featured: false
      },
      {
        name: 'E-Commerce Lösung',
        description: 'Ein vollständiger Online-Shop mit Produktverwaltung, Zahlungsabwicklung und mehr.',
        price: 1499,
        image_url: '/api/placeholder?width=800&height=600&text=E-Commerce&bg=hsl(210,60%,35%)',
        category: 'E-Commerce',
        featured: true
      },
      {
        name: 'Premium SEO Paket',
        description: 'Umfassende SEO-Optimierung für Ihre Website, um in Suchmaschinen besser zu ranken.',
        price: 299,
        image_url: '/api/placeholder?width=800&height=600&text=SEO%20Paket&bg=hsl(300,60%,25%)',
        category: 'Marketing',
        featured: false
      }
    ];

    // Füge Beispielprodukte ein
    for (const product of sampleProducts) {
      await executeQuery(`
        INSERT INTO products (name, description, price, image_url, category, featured)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        product.name,
        product.description,
        product.price,
        product.image_url,
        product.category,
        product.featured
      ]);
    }

    console.log('Beispieldaten erfolgreich eingefügt');
  } catch (error) {
    console.error('Fehler beim Einfügen der Beispieldaten:', error);
    throw error;
  }
}

// Exportiere eine Funktion zum Testen der Datenbankverbindung
export async function testDatabaseConnection() {
  try {
    const result = await executeQuery('SELECT NOW() as current_time');
    return {
      success: true,
      message: 'Datenbankverbindung erfolgreich',
      timestamp: result[0].current_time
    };
  } catch (error) {
    console.error('Datenbankverbindungsfehler:', error);
    return {
      success: false,
      message: 'Datenbankverbindung fehlgeschlagen',
      error: error instanceof Error ? error.message : String(error)
    };
  }
} 