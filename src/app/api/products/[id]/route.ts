import { NextRequest, NextResponse } from 'next/server';
import { ProductService, ProductInput } from '@/lib/services/productService';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET-Handler für /api/products/[id] - Ein Produkt abrufen
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const productId = parseInt(params.id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, message: 'Ungültige Produkt-ID' },
        { status: 400 }
      );
    }
    
    const product = await ProductService.getProductById(productId);
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Produkt nicht gefunden' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error(`Fehler beim Abrufen des Produkts mit ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Fehler beim Abrufen des Produkts', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * PUT-Handler für /api/products/[id] - Ein Produkt aktualisieren
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    // Überprüfe Admin-Authentifizierung
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Nicht autorisiert' },
        { status: 401 }
      );
    }
    
    const productId = parseInt(params.id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, message: 'Ungültige Produkt-ID' },
        { status: 400 }
      );
    }
    
    // Parse die Produktdaten aus dem Request-Body
    const productData: Partial<ProductInput> = await req.json();
    
    // Aktualisiere das Produkt
    const updatedProduct = await ProductService.updateProduct(productId, productData);
    
    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: 'Produkt nicht gefunden' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error(`Fehler beim Aktualisieren des Produkts mit ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Fehler beim Aktualisieren des Produkts', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE-Handler für /api/products/[id] - Ein Produkt löschen
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    // Überprüfe Admin-Authentifizierung
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Nicht autorisiert' },
        { status: 401 }
      );
    }
    
    const productId = parseInt(params.id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, message: 'Ungültige Produkt-ID' },
        { status: 400 }
      );
    }
    
    const success = await ProductService.deleteProduct(productId);
    
    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Produkt nicht gefunden' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Produkt erfolgreich gelöscht' });
  } catch (error) {
    console.error(`Fehler beim Löschen des Produkts mit ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Fehler beim Löschen des Produkts', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 