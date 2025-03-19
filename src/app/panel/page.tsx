'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Edit, Trash2, BarChart, Package, Users, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

// Admin Panel Login (simplified, in real app would use NextAuth)
export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Mock products data
  const [products, setProducts] = useState([
    {
      id: 'prod_1',
      name: 'Starter Website',
      description: 'Eine einfache, responsive Website mit bis zu 5 Seiten für kleine Unternehmen.',
      price: 499,
      image: '/product-1.jpg',
      category: 'Website'
    },
    {
      id: 'prod_2',
      name: 'Business Website',
      description: 'Eine professionelle Website mit CMS, bis zu 10 Seiten und SEO-Optimierung.',
      price: 999,
      image: '/product-2.jpg',
      category: 'Website'
    },
    {
      id: 'prod_3',
      name: 'E-Commerce Lösung',
      description: 'Ein vollständiger Online-Shop mit Produktverwaltung, Zahlungsabwicklung und mehr.',
      price: 1499,
      image: '/product-3.jpg',
      category: 'E-Commerce'
    },
  ]);

  // Form state for new/edit product
  const [formState, setFormState] = useState({
    id: '',
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
  });
  
  // Mock orders data
  const orders = [
    { id: 'ord_1', customer: 'Max Mustermann', product: 'Business Website', price: 999, date: '2023-05-15', status: 'Abgeschlossen' },
    { id: 'ord_2', customer: 'Maria Schmidt', product: 'Premium SEO Paket', price: 299, date: '2023-05-18', status: 'In Bearbeitung' },
    { id: 'ord_3', customer: 'Thomas Müller', product: 'E-Commerce Lösung', price: 1499, date: '2023-05-20', status: 'Bezahlt' },
  ];
  
  // Monthly revenue data for chart
  const revenueData = [
    { month: 'Jan', revenue: 2500 },
    { month: 'Feb', revenue: 3200 },
    { month: 'Mär', revenue: 4100 },
    { month: 'Apr', revenue: 3800 },
    { month: 'Mai', revenue: 5200 },
    { month: 'Jun', revenue: 4800 },
  ];
  
  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In real application, this would be a proper authentication
    if (email === 'admin@example.com' && password === 'password123') {
      setIsLoggedIn(true);
      toast.success('Erfolgreich eingeloggt');
    } else {
      toast.error('Ungültige Anmeldeinformationen');
    }
  };
  
  // Product form handlers
  const handleCreateProduct = () => {
    const newProduct = {
      ...formState,
      id: `prod_${products.length + 1}`,
    };
    
    setProducts([...products, newProduct]);
    setFormState({
      id: '',
      name: '',
      description: '',
      price: 0,
      image: '',
      category: '',
    });
    
    toast.success('Produkt erfolgreich erstellt');
  };
  
  const handleEditProduct = (product: any) => {
    setFormState(product);
  };
  
  const handleUpdateProduct = () => {
    const updatedProducts = products.map(product => 
      product.id === formState.id ? formState : product
    );
    
    setProducts(updatedProducts);
    setFormState({
      id: '',
      name: '',
      description: '',
      price: 0,
      image: '',
      category: '',
    });
    
    toast.success('Produkt erfolgreich aktualisiert');
  };
  
  const handleDeleteProduct = (id: string) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    toast.success('Produkt erfolgreich gelöscht');
  };
  
  // If not logged in, show login form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/5 border-purple-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center">Admin Login</CardTitle>
            <CardDescription className="text-center text-gray-300">
              Bitte melden Sie sich an, um auf das Admin-Panel zuzugreifen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">E-Mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="bg-white/10 border-purple-500/30 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Passwort</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-white/10 border-purple-500/30 text-white"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Demo: admin@example.com / password123
                </p>
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Anmelden
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/" className="text-sm text-purple-400 hover:text-purple-300">
              Zurück zur Hauptseite
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Admin panel UI when logged in
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-black/80 border-r border-white/10 p-4">
          <div className="mb-8">
            <Link href="/" className="text-2xl font-bold">
              WOW<span className="text-purple-500">Web</span> <span className="text-sm font-normal">Admin</span>
            </Link>
          </div>
          
          <nav className="space-y-2">
            <Link href="#dashboard" className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300">
              <BarChart size={20} />
              <span>Dashboard</span>
            </Link>
            <Link href="#products" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
              <Package size={20} />
              <span>Produkte</span>
            </Link>
            <Link href="#orders" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
              <CreditCard size={20} />
              <span>Bestellungen</span>
            </Link>
            <Link href="#customers" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
              <Users size={20} />
              <span>Kunden</span>
            </Link>
          </nav>
          
          <div className="absolute bottom-4 left-4 right-4">
            <Button 
              variant="outline" 
              className="w-full border-white/10 text-white hover:bg-white/5"
              onClick={() => setIsLoggedIn(false)}
            >
              Abmelden
            </Button>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-black to-purple-950/30 p-6">
          <Tabs defaultValue="dashboard">
            <TabsList className="mb-6 bg-black/40">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="products">Produkte</TabsTrigger>
              <TabsTrigger value="orders">Bestellungen</TabsTrigger>
            </TabsList>
            
            {/* Dashboard Tab */}
            <TabsContent value="dashboard">
              <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-white/5 border-green-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Gesamtumsatz</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">€19,800</div>
                    <p className="text-sm text-green-500">+12% im Vergleich zum Vormonat</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 border-blue-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Bestellungen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">24</div>
                    <p className="text-sm text-blue-500">8 neue Bestellungen heute</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 border-purple-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Kunden</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">156</div>
                    <p className="text-sm text-purple-500">+5 in den letzten 7 Tagen</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Revenue Chart Placeholder */}
              <Card className="bg-white/5 border-purple-500/20 mb-8">
                <CardHeader>
                  <CardTitle>Umsatzentwicklung</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    {/* Simple chart visualization */}
                    <div className="flex h-60 items-end space-x-2">
                      {revenueData.map((item) => (
                        <div key={item.month} className="flex flex-col items-center">
                          <div 
                            className="w-12 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-md"
                            style={{ height: `${(item.revenue / 6000) * 100}%` }}
                          />
                          <div className="text-xs mt-2">{item.month}</div>
                          <div className="text-xs text-gray-400">€{item.revenue}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Orders */}
              <Card className="bg-white/5 border-purple-500/20">
                <CardHeader>
                  <CardTitle>Neueste Bestellungen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left pb-2">ID</th>
                          <th className="text-left pb-2">Kunde</th>
                          <th className="text-left pb-2">Produkt</th>
                          <th className="text-left pb-2">Preis</th>
                          <th className="text-left pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3">{order.id}</td>
                            <td className="py-3">{order.customer}</td>
                            <td className="py-3">{order.product}</td>
                            <td className="py-3">€{order.price}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                order.status === 'Abgeschlossen' ? 'bg-green-500/20 text-green-400' :
                                order.status === 'In Bearbeitung' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Products Tab */}
            <TabsContent value="products">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Produkte</h1>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Neues Produkt
                </Button>
              </div>
              
              {/* Product Form */}
              <Card className="bg-white/5 border-purple-500/20 mb-8">
                <CardHeader>
                  <CardTitle>{formState.id ? 'Produkt bearbeiten' : 'Neues Produkt erstellen'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Name</Label>
                      <Input 
                        id="name" 
                        value={formState.name}
                        onChange={(e) => setFormState({...formState, name: e.target.value})}
                        className="bg-white/10 border-purple-500/30 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-white">Kategorie</Label>
                      <Input 
                        id="category" 
                        value={formState.category}
                        onChange={(e) => setFormState({...formState, category: e.target.value})}
                        className="bg-white/10 border-purple-500/30 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-white">Preis (€)</Label>
                      <Input 
                        id="price" 
                        type="number"
                        value={formState.price}
                        onChange={(e) => setFormState({...formState, price: Number(e.target.value)})}
                        className="bg-white/10 border-purple-500/30 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="image" className="text-white">Bild URL</Label>
                      <Input 
                        id="image" 
                        value={formState.image}
                        onChange={(e) => setFormState({...formState, image: e.target.value})}
                        className="bg-white/10 border-purple-500/30 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description" className="text-white">Beschreibung</Label>
                      <textarea 
                        id="description" 
                        rows={3}
                        value={formState.description}
                        onChange={(e) => setFormState({...formState, description: e.target.value})}
                        className="w-full rounded-md border border-purple-500/30 bg-white/10 p-2 text-white"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700 mr-2"
                    onClick={formState.id ? handleUpdateProduct : handleCreateProduct}
                  >
                    {formState.id ? 'Aktualisieren' : 'Erstellen'}
                  </Button>
                  {formState.id && (
                    <Button 
                      variant="outline"
                      className="border-white/10 text-white hover:bg-white/5"
                      onClick={() => setFormState({
                        id: '',
                        name: '',
                        description: '',
                        price: 0,
                        image: '',
                        category: '',
                      })}
                    >
                      Abbrechen
                    </Button>
                  )}
                </CardFooter>
              </Card>
              
              {/* Products List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="bg-white/5 border-purple-500/20">
                    <div 
                      className="h-36 w-full"
                      style={{ 
                        backgroundImage: `url(${product.image})`, 
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <CardHeader>
                      <CardTitle className="text-xl text-white">{product.name}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-purple-400">€{product.price}</span>
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                          {product.category}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-white/10 text-white hover:bg-white/5"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Bearbeiten
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Löschen
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Orders Tab */}
            <TabsContent value="orders">
              <h1 className="text-3xl font-bold mb-6">Bestellungen</h1>
              
              <Card className="bg-white/5 border-purple-500/20">
                <CardHeader>
                  <CardTitle>Alle Bestellungen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left pb-2">ID</th>
                          <th className="text-left pb-2">Kunde</th>
                          <th className="text-left pb-2">Produkt</th>
                          <th className="text-left pb-2">Preis</th>
                          <th className="text-left pb-2">Datum</th>
                          <th className="text-left pb-2">Status</th>
                          <th className="text-left pb-2">Aktionen</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3">{order.id}</td>
                            <td className="py-3">{order.customer}</td>
                            <td className="py-3">{order.product}</td>
                            <td className="py-3">€{order.price}</td>
                            <td className="py-3">{order.date}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                order.status === 'Abgeschlossen' ? 'bg-green-500/20 text-green-400' :
                                order.status === 'In Bearbeitung' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-white/10 text-white hover:bg-white/5"
                              >
                                Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
} 