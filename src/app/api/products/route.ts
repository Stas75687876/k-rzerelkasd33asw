import { NextRequest, NextResponse } from 'next/server';
import { ProductService, ProductInput } from '@/lib/services/productService';

/**
 * GET-Handler für /api/products - Alle Produkte abrufen
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
    let products;
    if (category) {
      products = await ProductService.getProductsByCategory(category);
    } else {
      products = await ProductService.getAllProducts();
    }
    
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Fehler beim Abrufen der Produkte:', error);
    return NextResponse.json(
      { success: false, message: 'Fehler beim Abrufen der Produkte', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST-Handler für /api/products - Neues Produkt erstellen
 */
export async function POST(req: NextRequest) {
  try {
    // Überprüfe Admin-Authentifizierung (in einer echten App würde dies strenger sein)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Nicht autorisiert' },
        { status: 401 }
      );
    }
    
    // Parse das Produkt aus dem Request-Body
    const productData: ProductInput = await req.json();
    
    // Validiere die erforderlichen Felder
    if (!productData.name || !productData.description || !productData.price || !productData.imageUrl || !productData.category) {
      return NextResponse.json(
        { success: false, message: 'Fehlende erforderliche Felder' },
        { status: 400 }
      );
    }
    
    // Erstelle das Produkt
    const newProduct = await ProductService.createProduct(productData);
    
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Fehler beim Erstellen des Produkts:', error);
    return NextResponse.json(
      { success: false, message: 'Fehler beim Erstellen des Produkts', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 