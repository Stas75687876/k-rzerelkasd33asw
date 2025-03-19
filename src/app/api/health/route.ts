import { NextResponse } from 'next/server';

/**
 * GET-Handler für /api/health - Einfacher Gesundheitscheck für Render.com
 */
export async function GET() {
  try {
    // Grundlegende Systeminfo sammeln
    const healthInfo = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      nextVersion: process.env.NEXT_VERSION || 'unbekannt',
      uptime: process.uptime(),
    };

    // Erfolgsantwort zurückgeben
    return NextResponse.json(healthInfo, { status: 200 });
  } catch (error) {
    // Fehler protokollieren und Fehlerantwort zurückgeben
    console.error('Health-Check fehlgeschlagen:', error);
    return NextResponse.json(
      { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 