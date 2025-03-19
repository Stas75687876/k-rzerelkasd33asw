// Datenbank-Initialisierungsskript
require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

// Verbindungs-URL aus den Umgebungsvariablen
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL nicht gefunden. Bitte stelle sicher, dass die .env.local Datei existiert.');
  process.exit(1);
}

// Erstelle den SQL-Client
const sql = neon(connectionString);

async function initDatabase() {
  console.log('🚀 Datenbank-Initialisierungsprozess gestartet...');
  
  try {
    // Teste die Verbindung
    await testConnection();
    
    // Erstelle die Tabellen
    await createTables();
    
    // Füge Beispieldaten ein
    await insertSampleData();
    
    console.log('✅ Datenbank erfolgreich initialisiert!');
  } catch (error) {
    console.error('❌ Fehler bei der Datenbankinitialisierung:', error);
    process.exit(1);
  }
}

async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log(`✅ Verbindung zur Datenbank hergestellt. Serverzeit: ${result[0].now}`);
  } catch (error) {
    console.error('❌ Verbindung zur Datenbank fehlgeschlagen:', error);
    throw error;
  }
}

async function createTables() {
  console.log('📋 Erstelle Tabellen...');
  
  try {
    // Erstelle Enum-Typen
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'category') THEN
          CREATE TYPE category AS ENUM ('Website', 'E-Commerce', 'Marketing', 'Design', 'Service');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
          CREATE TYPE order_status AS ENUM ('pending', 'processing', 'completed', 'cancelled');
        END IF;
      END
      $$;
    `;
    
    // Erstelle Produkte-Tabelle
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image_url TEXT NOT NULL,
        category category NOT NULL,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        available BOOLEAN DEFAULT TRUE,
        metadata JSONB
      );
    `;
    
    // Erstelle Kunden-Tabelle
    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255),
        address TEXT,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW(),
        metadata JSONB
      );
    `;
    
    // Erstelle Bestellungen-Tabelle
    await sql`
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
    `;
    
    // Erstelle Bestellpositionen-Tabelle
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) NOT NULL,
        product_id INTEGER REFERENCES products(id) NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        metadata JSONB
      );
    `;
    
    console.log('✅ Tabellen erfolgreich erstellt!');
  } catch (error) {
    console.error('❌ Fehler beim Erstellen der Tabellen:', error);
    throw error;
  }
}

async function insertSampleData() {
  console.log('📊 Füge Beispieldaten ein...');
  
  try {
    // Lösche vorhandene Daten (nur für Demo-Zwecke)
    await sql`TRUNCATE products, customers, orders, order_items CASCADE;`;
    
    // Füge Beispielprodukte ein
    const products = await sql`
      INSERT INTO products (name, description, price, image_url, category, featured)
      VALUES 
        ('Starter Website', 'Einfache, responsive Website mit bis zu 5 Seiten. Perfekt für kleine Unternehmen und Selbstständige.', 499.00, '/api/placeholder?width=600&height=400&text=Starter-Website&bg=hsl(270,50%,20%)', 'Website', TRUE),
        ('Business Website', 'Professionelle Website mit CMS-Integration, Kontaktformular und SEO-Optimierung.', 999.00, '/api/placeholder?width=600&height=400&text=Business-Website&bg=hsl(300,50%,20%)', 'Website', TRUE),
        ('E-Commerce Lösung', 'Vollständiger Online-Shop mit Zahlungsabwicklung, Produktkatalog und Kundenverwaltung.', 1499.00, '/api/placeholder?width=600&height=400&text=E-Commerce&bg=hsl(330,50%,20%)', 'E-Commerce', TRUE),
        ('Premium SEO Paket', 'Umfassende Suchmaschinenoptimierung für besseres Ranking und mehr organischen Traffic.', 299.00, '/api/placeholder?width=600&height=400&text=SEO-Paket&bg=hsl(210,50%,20%)', 'Marketing', FALSE),
        ('Logo & Branding', 'Professionelles Logo-Design und Branding-Strategie für Ihr Unternehmen.', 399.00, '/api/placeholder?width=600&height=400&text=Logo-Design&bg=hsl(240,50%,20%)', 'Design', FALSE),
        ('Content Marketing', 'Entwicklung einer Content-Strategie und Erstellung hochwertiger Inhalte.', 599.00, '/api/placeholder?width=600&height=400&text=Content-Marketing&bg=hsl(180,50%,20%)', 'Marketing', FALSE),
        ('Wartungsservice', 'Monatlicher Website-Wartungsservice inklusive Updates, Sicherheitschecks und Backup.', 99.00, '/api/placeholder?width=600&height=400&text=Wartungsservice&bg=hsl(150,50%,20%)', 'Service', FALSE)
      RETURNING id, name;
    `;
    
    console.log(`✅ ${products.length} Produkte eingefügt:`, products.map(p => p.name).join(', '));
    
    // Füge Beispielkunden ein
    const customers = await sql`
      INSERT INTO customers (email, name, address, phone)
      VALUES 
        ('kunde1@example.com', 'Max Mustermann', 'Musterstraße 1, 12345 Berlin', '+49123456789'),
        ('kunde2@example.com', 'Erika Musterfrau', 'Beispielweg 2, 54321 München', '+49987654321'),
        ('kunde3@example.com', NULL, NULL, NULL)
      RETURNING id, email;
    `;
    
    console.log(`✅ ${customers.length} Kunden eingefügt:`, customers.map(c => c.email).join(', '));
    
    // Erstelle einige Beispielbestellungen
    const orders = await sql`
      INSERT INTO orders (customer_id, total, status, payment_intent)
      VALUES 
        (1, 999.00, 'completed', 'pi_3NkL5jCIwMRVnHAd0X9Z5Z5Z'),
        (2, 1499.00, 'processing', 'pi_3NkL5jCIwMRVnHAd0X9Z5Z6Z'),
        (3, 598.00, 'pending', 'pi_3NkL5jCIwMRVnHAd0X9Z5Z7Z')
      RETURNING id;
    `;
    
    console.log(`✅ ${orders.length} Bestellungen eingefügt`);
    
    // Füge Bestellpositionen hinzu
    const orderItems = await sql`
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES 
        (${orders[0].id}, 2, 1, 999.00),
        (${orders[1].id}, 3, 1, 1499.00),
        (${orders[2].id}, 4, 2, 299.00)
      RETURNING id;
    `;
    
    console.log(`✅ ${orderItems.length} Bestellpositionen eingefügt`);
    
    console.log('✅ Beispieldaten erfolgreich eingefügt!');
  } catch (error) {
    console.error('❌ Fehler beim Einfügen der Beispieldaten:', error);
    throw error;
  }
}

// Starte die Initialisierung
initDatabase();

// Export für die API
module.exports = { initDatabase, testConnection }; 