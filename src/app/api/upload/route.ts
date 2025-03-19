import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// API-Route für das Hochladen von Bildern
export async function POST(req: NextRequest) {
  try {
    // Überprüfe Admin-Authentifizierung
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Nicht autorisiert' },
        { status: 401 }
      );
    }
    
    // Stelle sicher, dass es sich um eine FormData-Anfrage handelt
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Keine Datei hochgeladen' },
        { status: 400 }
      );
    }
    
    // Überprüfe, ob es sich um ein Bild handelt
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Ungültiger Dateityp. Nur Bilder sind erlaubt.' },
        { status: 400 }
      );
    }
    
    // Erstelle einen eindeutigen Dateinamen
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const filename = `product_${timestamp}.${fileExtension}`;
    
    // Stelle sicher, dass das Upload-Verzeichnis existiert
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Speichere die Datei im Upload-Verzeichnis
    const filePath = join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    
    // Gib den URL-Pfad zur gespeicherten Datei zurück
    const fileUrl = `/uploads/${filename}`;
    
    return NextResponse.json({
      success: true,
      message: 'Datei erfolgreich hochgeladen',
      url: fileUrl
    });
  } catch (error) {
    console.error('Fehler beim Hochladen der Datei:', error);
    return NextResponse.json(
      { success: false, message: 'Fehler beim Hochladen der Datei', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 