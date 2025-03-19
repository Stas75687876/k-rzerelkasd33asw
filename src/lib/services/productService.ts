import { db, executeQuery } from '../db';
import { products } from '../schema';
import { eq } from 'drizzle-orm';

export type ProductInput = {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  featured?: boolean;
};

export type Product = ProductInput & {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  available: boolean;
};

/**
 * Produktservice für Datenbankoperationen mit Produkten
 */
export class ProductService {
  /**
   * Alle Produkte abrufen
   */
  static async getAllProducts(): Promise<Product[]> {
    try {
      const results = await executeQuery(`
        SELECT * FROM products WHERE available = true ORDER BY featured DESC, name ASC
      `);
      
      return results.map(this.mapDbProductToProduct);
    } catch (error) {
      console.error('Fehler beim Abrufen der Produkte:', error);
      throw error;
    }
  }

  /**
   * Produkt nach ID abrufen
   */
  static async getProductById(id: number): Promise<Product | null> {
    try {
      const results = await executeQuery(`
        SELECT * FROM products WHERE id = $1
      `, [id]);
      
      if (results.length === 0) {
        return null;
      }
      
      return this.mapDbProductToProduct(results[0]);
    } catch (error) {
      console.error(`Fehler beim Abrufen des Produkts mit ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Produkt erstellen
   */
  static async createProduct(productData: ProductInput): Promise<Product> {
    try {
      const result = await executeQuery(`
        INSERT INTO products 
        (name, description, price, image_url, category, featured) 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [
        productData.name,
        productData.description,
        productData.price,
        productData.imageUrl,
        productData.category,
        productData.featured || false
      ]);
      
      return this.mapDbProductToProduct(result[0]);
    } catch (error) {
      console.error('Fehler beim Erstellen des Produkts:', error);
      throw error;
    }
  }

  /**
   * Produkt aktualisieren
   */
  static async updateProduct(id: number, productData: Partial<ProductInput>): Promise<Product | null> {
    try {
      // Erstelle SET-Anweisungen und Parameter dynamisch
      const updateFields: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      if (productData.name !== undefined) {
        updateFields.push(`name = $${paramIndex++}`);
        params.push(productData.name);
      }

      if (productData.description !== undefined) {
        updateFields.push(`description = $${paramIndex++}`);
        params.push(productData.description);
      }

      if (productData.price !== undefined) {
        updateFields.push(`price = $${paramIndex++}`);
        params.push(productData.price);
      }

      if (productData.imageUrl !== undefined) {
        updateFields.push(`image_url = $${paramIndex++}`);
        params.push(productData.imageUrl);
      }

      if (productData.category !== undefined) {
        updateFields.push(`category = $${paramIndex++}`);
        params.push(productData.category);
      }

      if (productData.featured !== undefined) {
        updateFields.push(`featured = $${paramIndex++}`);
        params.push(productData.featured);
      }

      // Immer das updated_at-Feld aktualisieren
      updateFields.push(`updated_at = NOW()`);

      // Wenn keine Felder zum Aktualisieren vorhanden sind, beende frühzeitig
      if (updateFields.length === 1) { // Nur updated_at
        return await this.getProductById(id);
      }

      // ID an die Parameter anhängen
      params.push(id);

      const result = await executeQuery(`
        UPDATE products 
        SET ${updateFields.join(', ')} 
        WHERE id = $${paramIndex}
        RETURNING *
      `, params);

      if (result.length === 0) {
        return null;
      }

      return this.mapDbProductToProduct(result[0]);
    } catch (error) {
      console.error(`Fehler beim Aktualisieren des Produkts mit ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Produkt löschen (markiere als nicht verfügbar)
   */
  static async deleteProduct(id: number): Promise<boolean> {
    try {
      // Soft-Delete: Markiere das Produkt als nicht verfügbar
      const result = await executeQuery(`
        UPDATE products 
        SET available = false, updated_at = NOW() 
        WHERE id = $1
        RETURNING id
      `, [id]);
      
      return result.length > 0;
    } catch (error) {
      console.error(`Fehler beim Löschen des Produkts mit ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Produkte nach Kategorie filtern
   */
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const results = await executeQuery(`
        SELECT * FROM products 
        WHERE category = $1 AND available = true 
        ORDER BY featured DESC, name ASC
      `, [category]);
      
      return results.map(this.mapDbProductToProduct);
    } catch (error) {
      console.error(`Fehler beim Abrufen der Produkte in der Kategorie ${category}:`, error);
      throw error;
    }
  }

  /**
   * Konvertiere DB-Produkt in ein Product-Objekt
   */
  private static mapDbProductToProduct(dbProduct: any): Product {
    return {
      id: dbProduct.id,
      name: dbProduct.name,
      description: dbProduct.description,
      price: parseFloat(dbProduct.price),
      imageUrl: dbProduct.image_url,
      category: dbProduct.category,
      featured: dbProduct.featured,
      createdAt: new Date(dbProduct.created_at),
      updatedAt: new Date(dbProduct.updated_at),
      available: dbProduct.available
    };
  }
} 