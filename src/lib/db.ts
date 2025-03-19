import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Konfiguration für Neon Database
neonConfig.fetchConnectionCache = true;

// Verbindungs-URL aus den Umgebungsvariablen - Bereinigen des Strings, falls er "DATABASE_URL=" enthält
const rawConnectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/wowweb';
const connectionString = rawConnectionString.startsWith('DATABASE_URL=') 
  ? rawConnectionString.substring('DATABASE_URL='.length) 
  : rawConnectionString;

console.log('Verbindung zur Datenbank mit bereinigter Connection-String');

// Erstelle den SQL-Client
const sql = neon(connectionString);

// Erstelle den Drizzle-Client
export const db = drizzle(sql);

// Globaler Helfer für die Datenbank
export async function executeQuery(query: string, params: any[] = []) {
  try {
    return await sql(query, params);
  } catch (error) {
    console.error('Fehler bei der Datenbankabfrage:', error);
    throw error;
  }
} 