import { NextRequest, NextResponse } from 'next/server';
import { testDatabaseConnection, initDatabase } from '@/lib/initDb';

export async function GET(req: NextRequest) {
  try {
    // Teste die Datenbankverbindung
    const connectionTest = await testDatabaseConnection();
    
    if (!connectionTest.success) {
      return NextResponse.json(
        { success: false, message: 'Datenbankverbindung fehlgeschlagen', error: connectionTest.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Datenbankverbindung erfolgreich',
      timestamp: connectionTest.timestamp,
      connectionString: `${process.env.DATABASE_URL?.substring(0, 25)}...` // Zeige nur den Anfang der Verbindung aus Sicherheitsgründen
    });
    
  } catch (error) {
    console.error('Fehler beim Testen der Datenbankverbindung:', error);
    return NextResponse.json(
      { success: false, message: 'Interner Serverfehler', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// POST-Endpunkt zur Initialisierung der Datenbank
export async function POST(req: NextRequest) {
  try {
    // Administrator-Token prüfen (in der Produktion sollte dies strenger sein)
    const { searchParams } = new URL(req.url);
    const adminToken = searchParams.get('token');
    
    if (!adminToken || adminToken !== 'init_db_token') {
      return NextResponse.json(
        { success: false, message: 'Nicht autorisiert' },
        { status: 401 }
      );
    }
    
    // Initialisiere die Datenbank
    const initResult = await initDatabase();
    
    if (!initResult.success) {
      return NextResponse.json(
        { success: false, message: 'Datenbankinitialisierung fehlgeschlagen', error: initResult.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Datenbank erfolgreich initialisiert'
    });
    
  } catch (error) {
    console.error('Fehler bei der Datenbankinitialisierung:', error);
    return NextResponse.json(
      { success: false, message: 'Interner Serverfehler', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 