# Neon Datenbankintegration

Dieses Projekt verwendet [Neon Database](https://neon.tech) als PostgreSQL-Datenbank. Neon ist eine serverlose PostgreSQL-Lösung mit automatischer Skalierung und einer großzügigen kostenlosen Stufe, die sich hervorragend für Next.js-Projekte eignet.

## ⚙️ Konfiguration

Die Datenbankverbindung wurde mit dem folgenden Connection-String konfiguriert:

```
postgresql://neondb_owner:npg_1LPtfTAO0wdl@ep-wispy-forest-a2kn6k40-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

Diese Verbindungszeichenfolge ist in der `.env.local`-Datei als `DATABASE_URL` gespeichert.

## 📊 Datenmodell

Das Projekt verwendet folgende Tabellen:

1. **products**
   - `id`: Primärschlüssel
   - `name`: Produktname
   - `description`: Produktbeschreibung
   - `price`: Preis (Dezimalzahl)
   - `image_url`: URL des Produktbildes
   - `category`: Produktkategorie (Enum: Website, E-Commerce, Marketing, Design, Service)
   - `featured`: Hervorgehoben (Boolean)
   - `created_at`: Erstellungsdatum
   - `updated_at`: Aktualisierungsdatum
   - `available`: Verfügbarkeit (Boolean)
   - `metadata`: Zusätzliche Daten (JSONB)

2. **customers**
   - `id`: Primärschlüssel
   - `email`: E-Mail-Adresse (einzigartig)
   - `name`: Kundenname
   - `address`: Adresse
   - `phone`: Telefonnummer
   - `created_at`: Erstellungsdatum
   - `metadata`: Zusätzliche Daten (JSONB)

3. **orders**
   - `id`: Primärschlüssel
   - `customer_id`: Fremdschlüssel zum Kunden
   - `total`: Gesamtbetrag
   - `status`: Bestellstatus (Enum: pending, processing, completed, cancelled)
   - `payment_intent`: Stripe Payment Intent ID
   - `created_at`: Erstellungsdatum
   - `updated_at`: Aktualisierungsdatum
   - `metadata`: Zusätzliche Daten (JSONB)

4. **order_items**
   - `id`: Primärschlüssel
   - `order_id`: Fremdschlüssel zur Bestellung
   - `product_id`: Fremdschlüssel zum Produkt
   - `quantity`: Menge
   - `price`: Preis zum Zeitpunkt der Bestellung
   - `metadata`: Zusätzliche Daten (JSONB)

## 🚀 Initialisierung

Um die Datenbank zu initialisieren und mit Beispieldaten zu füllen, führe das folgende Skript aus:

```bash
node src/scripts/initDb.js
```

## 🔍 API-Endpunkte

Die Anwendung stellt folgende API-Endpunkte für die Datenbankinteraktion bereit:

### Produkte

- `GET /api/products`: Alle Produkte abrufen
  - Optionale Query-Parameter: `category`
- `GET /api/products/:id`: Ein bestimmtes Produkt abrufen
- `POST /api/products`: Neues Produkt erstellen (erfordert Authentifizierung)
- `PUT /api/products/:id`: Produkt aktualisieren (erfordert Authentifizierung)
- `DELETE /api/products/:id`: Produkt löschen (erfordert Authentifizierung)

### Datenbanktest

- `GET /api/db-test`: Datenbankverbindung testen
- `POST /api/db-test?token=init_db_token`: Datenbank initialisieren

## 📝 Verwendung im Code

Die Datenbank kann mit den Services in `src/lib/services/` verwendet werden, zum Beispiel:

```typescript
import { ProductService } from '@/lib/services/productService';

// Alle Produkte abrufen
const products = await ProductService.getAllProducts();

// Produkt nach ID abrufen
const product = await ProductService.getProductById(1);

// Neues Produkt erstellen
const newProduct = await ProductService.createProduct({
  name: 'Neues Produkt',
  description: 'Beschreibung',
  price: 99.99,
  imageUrl: '/images/product.jpg',
  category: 'Website',
  featured: true
});
```

## 🔧 Fehlerbehebung

Wenn Probleme mit der Datenbankverbindung auftreten:

1. Überprüfe die Verbindung mit `/api/db-test` im Browser
2. Stelle sicher, dass die Umgebungsvariable `DATABASE_URL` korrekt ist
3. Prüfe, ob die Neon-Datenbank aktiv ist und der verwendete Host zugänglich ist

## 💡 Tipps

- Für Produktionsdaten empfehlen wir, die Anmeldeinformationen regelmäßig zu wechseln
- Neon bietet ein Dashboard zur Überwachung der Datenbankleistung
- Verwende das Neon-CLI oder das Dashboard, um Backups zu erstellen, bevor du größere Änderungen vornimmst 