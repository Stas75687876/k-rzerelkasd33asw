'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Pencil, Plus, Search, Trash2, Loader2, CheckCircle, UploadCloud, Image, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Typ für Produkt
interface ProductType {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  featured: boolean;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

// Produktkategorie-Optionen
const categoryOptions = [
  { value: 'Website', label: 'Website' },
  { value: 'E-Commerce', label: 'E-Commerce' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Design', label: 'Design' },
  { value: 'Service', label: 'Service' },
];

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: '',
    featured: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prüfen, ob der Benutzer angemeldet ist
  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      setIsAuthenticated(true);
      fetchProducts();
    } else {
      window.location.href = '/admin';
    }
  }, []);

  // Produkte abrufen
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Fehler beim Laden der Produkte');
      
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
        toast.success('Produkte erfolgreich geladen');
      }
    } catch (error) {
      console.error('Fehler beim Laden der Produkte:', error);
      toast.error('Fehler beim Laden der Produkte');
      
      // Für Testzwecke: Verwende Beispieldaten, wenn die API nicht verfügbar ist
      setProducts([
        {
          id: 1,
          name: 'Starter Website',
          description: 'Einfache, responsive Website mit bis zu 5 Seiten.',
          price: 499,
          imageUrl: '/api/placeholder?width=600&height=400&text=Starter-Website&bg=hsl(270,50%,20%)',
          category: 'Website',
          featured: true,
          available: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Business Website',
          description: 'Professionelle Website mit CMS.',
          price: 999,
          imageUrl: '/api/placeholder?width=600&height=400&text=Business-Website&bg=hsl(300,50%,20%)',
          category: 'Website',
          featured: true,
          available: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Form Input Handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'price') {
      // Stelle sicher, dass der Preis eine Zahl ist
      const price = parseFloat(value) || 0;
      setFormData(prev => ({ ...prev, [name]: price }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Datei-Upload-Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Überprüfe Dateityp
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Ungültiger Dateityp. Nur Bilder sind erlaubt.');
        return;
      }
      
      // Überprüfe Dateigröße (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Datei ist zu groß. Maximale Größe ist 5MB.');
        return;
      }
      
      setImageFile(file);
      
      // Lokale Vorschau erstellen
      const objectUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imageUrl: objectUrl }));
    }
  };

  // Funktion zum Hochladen des Bildes
  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const token = localStorage.getItem('admin_token');
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Fehler beim Hochladen des Bildes');
      }
      
      const result = await response.json();
      
      if (result.success && result.url) {
        toast.success('Bild erfolgreich hochgeladen');
        return result.url;
      } else {
        throw new Error(result.message || 'Ein Fehler ist aufgetreten');
      }
    } catch (error) {
      console.error('Fehler beim Hochladen:', error);
      toast.error('Fehler beim Hochladen des Bildes');
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
  };

  // Toggle zwischen Upload- und URL-Modus
  const toggleUploadMode = () => {
    setUploadMode(prev => prev === 'upload' ? 'url' : 'upload');
  };

  // Öffne den Datei-Dialog
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Nach Suchbegriff filtern
  const filteredProducts = searchQuery 
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  // Produkt zum Bearbeiten auswählen
  const handleEdit = (product: ProductType) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category,
      featured: product.featured
    });
    setIsEditing(true);
  };

  // Formular für neues Produkt öffnen
  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: 'Website',
      featured: false
    });
    setIsEditing(true);
    setImageFile(null);
    setUploadProgress(0);
    setUploadMode('upload');
  };

  // Produkt speichern (erstellen oder aktualisieren)
  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Validierung
      if (!formData.name || !formData.description || formData.price <= 0 || !formData.category) {
        toast.error('Bitte fülle alle Pflichtfelder aus');
        setIsLoading(false);
        return;
      }
      
      // Bei Upload-Modus: Wenn ein neues Bild ausgewählt wurde, lade es hoch
      let imageUrl = formData.imageUrl;
      if (uploadMode === 'upload' && imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else if (!imageUrl.startsWith('/')) {
          // Wenn kein URL und kein Upload erfolgreich war
          toast.error('Bitte lade ein Bild hoch oder gib eine URL ein');
          setIsLoading(false);
          return;
        }
      }
      
      // Wenn URL-Modus und keine URL angegeben
      if (uploadMode === 'url' && !imageUrl) {
        toast.error('Bitte gib eine Bild-URL ein');
        setIsLoading(false);
        return;
      }
      
      const token = localStorage.getItem('admin_token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      let response;
      
      const productData = {
        ...formData,
        imageUrl: imageUrl
      };
      
      if (editingProduct) {
        // Aktualisiere bestehendes Produkt
        response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(productData)
        });
      } else {
        // Erstelle neues Produkt
        response = await fetch('/api/products', {
          method: 'POST',
          headers,
          body: JSON.stringify(productData)
        });
      }
      
      if (!response.ok) throw new Error('Fehler beim Speichern des Produkts');
      
      const result = await response.json();
      
      if (result.success) {
        toast.success(editingProduct ? 'Produkt aktualisiert' : 'Produkt erstellt');
        fetchProducts();
        setIsEditing(false);
        // Zurücksetzen der Formularfelder
        setImageFile(null);
        setUploadProgress(0);
      } else {
        throw new Error(result.message || 'Ein Fehler ist aufgetreten');
      }
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      toast.error('Fehler beim Speichern des Produkts');
      
      // Für Testzwecke: Simuliere erfolgreiche Speicherung
      if (editingProduct) {
        // Aktualisiere bestehendes Produkt
        setProducts(prev => prev.map(p => 
          p.id === editingProduct.id ? { ...p, ...formData, updatedAt: new Date().toISOString() } : p
        ));
      } else {
        // Erstelle neues Produkt
        const newProduct = {
          ...formData,
          id: Math.max(0, ...products.map(p => p.id)) + 1,
          available: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setProducts(prev => [...prev, newProduct as ProductType]);
      }
      
      setIsEditing(false);
      toast.success(editingProduct ? 'Produkt aktualisiert (Demo)' : 'Produkt erstellt (Demo)');
      // Zurücksetzen der Formularfelder
      setImageFile(null);
      setUploadProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Produkt löschen
  const handleDelete = async (id: number) => {
    if (!confirm('Möchtest du dieses Produkt wirklich löschen?')) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Fehler beim Löschen des Produkts');
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Produkt gelöscht');
        fetchProducts();
      } else {
        throw new Error(result.message || 'Ein Fehler ist aufgetreten');
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
      toast.error('Fehler beim Löschen des Produkts');
      
      // Für Testzwecke: Simuliere erfolgreiche Löschung
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Produkt gelöscht (Demo)');
    } finally {
      setIsLoading(false);
    }
  };

  // Formular schließen
  const handleCancel = () => {
    setIsEditing(false);
  };

  // Preis formatieren
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Zugriff verweigert</h1>
          <p className="mb-4">Du musst angemeldet sein, um auf diesen Bereich zuzugreifen.</p>
          <Link href="/admin">
            <Button>Zum Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Link href="/admin" className="mr-4">
              <Button variant="ghost" size="icon" className="text-white">
                <ArrowLeft />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Produktverwaltung</h1>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={fetchProducts} 
              variant="outline"
              className="border-purple-500/30 text-white hover:bg-purple-500/10"
              disabled={isLoading}
            >
              <Loader2 className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Aktualisieren
            </Button>
            <Button 
              onClick={handleAddNew}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isLoading || isEditing}
            >
              <Plus className="mr-2 h-4 w-4" />
              Neues Produkt
            </Button>
          </div>
        </div>

        {/* Produktliste */}
        {!isEditing && (
          <div>
            <Card className="bg-white/5 border-purple-500/20 mb-8">
              <CardHeader className="border-b border-purple-500/10 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Produkte</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Produkte suchen..."
                      className="bg-white/10 border-purple-500/20 pl-10 text-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  {isLoading ? (
                    <div className="p-8 text-center">
                      <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-purple-500" />
                      <p className="text-gray-400">Produkte werden geladen...</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="bg-black/30 text-left">
                          <th className="px-4 py-3 text-gray-400 font-medium text-sm">Bild</th>
                          <th className="px-4 py-3 text-gray-400 font-medium text-sm">Name</th>
                          <th className="px-4 py-3 text-gray-400 font-medium text-sm">Kategorie</th>
                          <th className="px-4 py-3 text-gray-400 font-medium text-sm text-right">Preis</th>
                          <th className="px-4 py-3 text-gray-400 font-medium text-sm text-center">Featured</th>
                          <th className="px-4 py-3 text-gray-400 font-medium text-sm text-center">Aktionen</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-500/10">
                        {filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                              <Image className="mx-auto mb-2 text-gray-500" size={32} />
                              <p>Keine Produkte gefunden</p>
                              {searchQuery && (
                                <p className="mt-2 text-sm">Versuche einen anderen Suchbegriff oder <button onClick={() => setSearchQuery('')} className="text-purple-400 hover:underline">zeige alle</button></p>
                              )}
                            </td>
                          </tr>
                        ) : (
                          filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-white/5">
                              <td className="px-4 py-3">
                                <div 
                                  className="w-12 h-12 rounded bg-purple-900/30 overflow-hidden"
                                  style={{ 
                                    backgroundImage: `url(${product.imageUrl})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                  }}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-gray-400 text-sm truncate max-w-xs">{product.description}</p>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                                  {product.category}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right font-medium text-purple-400">
                                {formatPrice(product.price)}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {product.featured ? (
                                  <CheckCircle className="mx-auto h-5 w-5 text-green-400" />
                                ) : (
                                  <div className="mx-auto h-5 w-5 rounded-full border border-gray-500/30" />
                                )}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex justify-center gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                                    onClick={() => handleEdit(product)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                    onClick={() => handleDelete(product.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Produkt-Formular */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white/5 border-purple-500/20">
              <CardHeader className="border-b border-purple-500/10">
                <CardTitle className="text-white">
                  {editingProduct ? `Produkt bearbeiten: ${editingProduct.name}` : 'Neues Produkt erstellen'}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-6">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Produktname"
                        className="bg-white/10 border-purple-500/20 text-white"
                        required
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Beschreibung *</label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full rounded-md border bg-white/10 border-purple-500/20 text-white px-3 py-2 text-sm"
                        placeholder="Produktbeschreibung"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">Preis (€) *</label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="bg-white/10 border-purple-500/20 text-white"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Kategorie *</label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full rounded-md border bg-white/10 border-purple-500/20 text-white px-3 py-2 text-sm h-10"
                          required
                        >
                          {categoryOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-center">
                        <input
                          id="featured"
                          name="featured"
                          type="checkbox"
                          checked={formData.featured}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-purple-500/50 text-purple-600 focus:ring-purple-500"
                        />
                        <label htmlFor="featured" className="ml-2 block text-sm text-gray-300">
                          Als Featured markieren
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-300">Produktbild *</label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={toggleUploadMode}
                          className="text-xs text-gray-400 hover:text-white"
                        >
                          {uploadMode === 'upload' ? (
                            <>
                              <LinkIcon className="h-3 w-3 mr-1" />
                              URL stattdessen eingeben
                            </>
                          ) : (
                            <>
                              <UploadCloud className="h-3 w-3 mr-1" />
                              Datei hochladen
                            </>
                          )}
                        </Button>
                      </div>
                      
                      {uploadMode === 'upload' ? (
                        <div className="border-2 border-dashed border-purple-500/30 rounded-md p-4 text-center cursor-pointer hover:bg-purple-500/5 transition-colors mb-2" onClick={triggerFileInput}>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                          <UploadCloud className="h-10 w-10 mx-auto mb-2 text-purple-400" />
                          <p className="text-sm text-gray-300 mb-1">
                            {imageFile ? imageFile.name : 'Klicke, um ein Bild hochzuladen'}
                          </p>
                          <p className="text-xs text-gray-500">
                            JPG, PNG, WEBP, GIF oder SVG (max. 5MB)
                          </p>
                          
                          {uploadProgress > 0 && (
                            <div className="w-full mt-2 bg-black/30 rounded-full h-2 overflow-hidden">
                              <div 
                                className="bg-purple-500 h-2 transition-all"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <Input
                          id="imageUrl"
                          name="imageUrl"
                          value={formData.imageUrl}
                          onChange={handleInputChange}
                          placeholder="https://example.com/image.jpg oder /api/placeholder?..."
                          className="bg-white/10 border-purple-500/20 text-white mb-2"
                        />
                      )}
                      
                      {uploadMode === 'url' && (
                        <p className="text-xs text-gray-400 mb-2">
                          Du kannst den Placeholder-Generator verwenden: /api/placeholder?width=600&height=400&text=Produktname
                        </p>
                      )}
                    </div>
                    
                    <div className="aspect-video bg-black/20 rounded-md overflow-hidden relative mb-6">
                      {formData.imageUrl ? (
                        <img 
                          src={formData.imageUrl} 
                          alt="Produktvorschau" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center text-gray-400">
                            <UploadCloud className="mx-auto h-12 w-12 mb-2" />
                            <p>{uploadMode === 'upload' ? 'Lade ein Bild hoch, um eine Vorschau zu sehen' : 'Bild-URL eingeben, um eine Vorschau zu sehen'}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="border-white/20 text-white hover:bg-white/10"
                    disabled={isLoading}
                  >
                    Abbrechen
                  </Button>
                  
                  <Button
                    onClick={handleSave}
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Speichern...
                      </>
                    ) : (
                      'Speichern'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
} 