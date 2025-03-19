'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, Search, Package, Loader2, RefreshCw,
  ShoppingBag, Check, Clock, Ban, FileText, AlertCircle, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

// Typ für Bestellungen
interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  customerId: number | null;
  customerEmail: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentIntent: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

// Beispieldaten für Bestellungen
const sampleOrders: Order[] = [
  {
    id: 10001,
    customerId: 1,
    customerEmail: 'kunde1@example.com',
    total: 999,
    status: 'completed',
    paymentIntent: 'pi_3R4PwyCIwMRVnHAd1v2WcIhy',
    createdAt: '2023-11-15T14:30:00Z',
    updatedAt: '2023-11-15T14:35:00Z',
    items: [
      {
        id: 1,
        productId: 2,
        productName: 'Business Website',
        price: 999,
        quantity: 1
      }
    ]
  },
  {
    id: 10002,
    customerId: 2,
    customerEmail: 'kunde2@example.com',
    total: 1499,
    status: 'processing',
    paymentIntent: 'pi_3R4PwyARFDJdCIwM9sBVnH0a',
    createdAt: '2023-11-20T10:15:00Z',
    updatedAt: '2023-11-20T10:20:00Z',
    items: [
      {
        id: 2,
        productId: 3,
        productName: 'E-Commerce Lösung',
        price: 1499,
        quantity: 1
      }
    ]
  },
  {
    id: 10003,
    customerId: 3,
    customerEmail: 'kunde3@example.com',
    total: 598,
    status: 'pending',
    paymentIntent: 'pi_3R4PwvnHAdCIwMRV0X9Z5F7Z',
    createdAt: '2023-11-25T09:45:00Z',
    updatedAt: '2023-11-25T09:45:00Z',
    items: [
      {
        id: 3,
        productId: 4,
        productName: 'Premium SEO Paket',
        price: 299,
        quantity: 2
      }
    ]
  },
  {
    id: 10004,
    customerId: 4,
    customerEmail: 'kunde4@example.com',
    total: 499,
    status: 'cancelled',
    paymentIntent: 'pi_3R4PwypQd7dhCIwMRVnHZ8Z',
    createdAt: '2023-11-30T16:20:00Z',
    updatedAt: '2023-11-30T18:30:00Z',
    items: [
      {
        id: 4,
        productId: 1,
        productName: 'Starter Website',
        price: 499,
        quantity: 1
      }
    ]
  },
];

// Erstelle eine originale Kopie der Beispieldaten, die nie verändert wird
// und als Basis für den Reset dient
const ORIGINAL_ORDERS: Order[] = [
  {
    id: 10001,
    customerId: 1,
    customerEmail: 'kunde1@example.com',
    total: 999,
    status: 'completed' as const,
    paymentIntent: 'pi_3R4PwyCIwMRVnHAd1v2WcIhy',
    createdAt: '2023-11-15T14:30:00Z',
    updatedAt: '2023-11-15T14:35:00Z',
    items: [
      {
        id: 1,
        productId: 2,
        productName: 'Business Website',
        price: 999,
        quantity: 1
      }
    ]
  },
  {
    id: 10002,
    customerId: 2,
    customerEmail: 'kunde2@example.com',
    total: 1499,
    status: 'processing' as const,
    paymentIntent: 'pi_3R4PwyARFDJdCIwM9sBVnH0a',
    createdAt: '2023-11-20T10:15:00Z',
    updatedAt: '2023-11-20T10:20:00Z',
    items: [
      {
        id: 2,
        productId: 3,
        productName: 'E-Commerce Lösung',
        price: 1499,
        quantity: 1
      }
    ]
  },
  {
    id: 10003,
    customerId: 3,
    customerEmail: 'kunde3@example.com',
    total: 598,
    status: 'pending' as const,
    paymentIntent: 'pi_3R4PwvnHAdCIwMRV0X9Z5F7Z',
    createdAt: '2023-11-25T09:45:00Z',
    updatedAt: '2023-11-25T09:45:00Z',
    items: [
      {
        id: 3,
        productId: 4,
        productName: 'Premium SEO Paket',
        price: 299,
        quantity: 2
      }
    ]
  },
  {
    id: 10004,
    customerId: 4,
    customerEmail: 'kunde4@example.com',
    total: 499,
    status: 'cancelled' as const,
    paymentIntent: 'pi_3R4PwypQd7dhCIwMRVnHZ8Z',
    createdAt: '2023-11-30T16:20:00Z',
    updatedAt: '2023-11-30T18:30:00Z',
    items: [
      {
        id: 4,
        productId: 1,
        productName: 'Starter Website',
        price: 499,
        quantity: 1
      }
    ]
  },
];

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [debugMode, setDebugMode] = useState(false);

  // Bestellungen vollständig zurücksetzen
  function handleReset() {
    setIsLoading(true);
    
    // API-Aufruf zum Löschen aller Bestellungen
    fetch('/api/admin/orders', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Fehler beim Löschen der Bestellungen');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        // Alle Bestellungen löschen (leeres Array setzen)
        setOrders([]);
        
        // Löschen im localStorage speichern
        localStorage.setItem('orders_deleted', 'true');
        
        // Alle anderen Status zurücksetzen
        setSelectedOrder(null);
        setSearchQuery('');
        setActiveTab('all');
        
        // Erfolgsbenachrichtigung anzeigen
        toast.success(`Alle Bestellungen wurden gelöscht (${data.deletedCount} Einträge)`);
        
        if (debugMode) {
          console.log('Reset durchgeführt. Bestellungsliste geleert.', data);
        }
      } else {
        throw new Error(data.message || 'Unbekannter Fehler beim Löschen');
      }
    })
    .catch(error => {
      console.error('Fehler beim Löschen aller Bestellungen:', error);
      toast.error('Fehler beim Löschen aller Bestellungen');
      
      // Fallback: Lokales Löschen
      setOrders([]);
      localStorage.setItem('orders_deleted', 'true');
      setSelectedOrder(null);
      setSearchQuery('');
      setActiveTab('all');
    })
    .finally(() => {
      setIsLoading(false);
    });
  }

  // Debug-Modus umschalten
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
    if (!debugMode) {
      toast.info('Debug-Modus aktiviert. Bestelldaten werden angezeigt.');
    } else {
      toast.info('Debug-Modus deaktiviert.');
    }
  };

  // Prüfen, ob der Benutzer angemeldet ist
  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      setIsAuthenticated(true);
      
      // Prüfen, ob Bestellungen gelöscht wurden
      const ordersDeleted = localStorage.getItem('orders_deleted') === 'true';
      
      if (ordersDeleted) {
        // Wenn Bestellungen gelöscht wurden, leere Liste beibehalten
        setOrders([]);
      } else {
        // Sonst mit den Originaldaten beginnen
        setOrders([...ORIGINAL_ORDERS]);
      }
      
      setIsLoadingOrders(false);
      
      // Versuche dann API-Daten zu laden (nur wenn nicht gelöscht)
      if (!ordersDeleted) {
        setTimeout(() => {
          fetchOrders();
        }, 500);
      }
    } else {
      // Wenn nicht authentifiziert, zur Anmeldeseite umleiten
      window.location.href = '/admin';
    }
  }, []);

  // Funktion zum Formatieren des Datums
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: de });
    } catch (error) {
      return dateString;
    }
  };

  // Funktion zum Formatieren der Bestellnummer
  const formatOrderNumber = (id: number) => {
    const order = orders.find(order => order.id === id);
    
    // Debug-Ausgabe (nur im Debug-Modus)
    if (debugMode && order) {
      console.log('Bestellung gefunden:', order);
      console.log('Payment Intent:', order.paymentIntent);
    }
    
    if (order?.paymentIntent) {
      // Wenn ein Payment Intent vorhanden ist, diesen als Basis für die Bestellnummer verwenden
      return `#${order.paymentIntent}`;
    }
    // Fallback-Format, falls kein Payment Intent vorhanden ist
    return `#CTORD-${id.toString().padStart(5, '0')}`;
  };

  // Funktion zum Formatieren des Preises
  const formatPrice = (price: number) => {
    // Stelle sicher, dass der Preis eine gültige Zahl ist
    const validPrice = isNaN(price) ? 0 : price;
    
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(validPrice);
  };

  // Funktion zum Laden der Bestellungen
  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      // Zurücksetzen des gelöschten Status im localStorage
      localStorage.removeItem('orders_deleted');
      
      // API-Aufruf zum Laden der Bestellungen mit Erzwingung der Aktualisierung
      const response = await fetch('/api/admin/orders?forceRefresh=true', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        // Verhindere Caching, um immer frische Daten zu erhalten
        cache: 'no-store'
      });

      if (!response.ok) {
        // Wenn API nicht verfügbar, Beispieldaten verwenden
        console.warn('API nicht verfügbar, verwende Beispieldaten');
        setOrders([...ORIGINAL_ORDERS]);
        return;
      }

      const data = await response.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
        
        if (debugMode) {
          console.log(`Bestellungen geladen (Quelle: ${data.source})`, data.orders);
        }
        
        if (data.orders.length === 0) {
          toast.info('Keine Bestellungen gefunden');
        } else {
          toast.success(`${data.orders.length} Bestellungen geladen`);
        }
      } else {
        // Fallback zu Beispieldaten bei API-Fehler
        console.warn('API-Fehler, verwende Beispieldaten');
        setOrders([...ORIGINAL_ORDERS]);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Bestellungen:', error);
      toast.error('Fehler beim Laden der Bestellungen');
      // Fallback zu Beispieldaten
      setOrders([...ORIGINAL_ORDERS]);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // Funktion zum Generieren einer Rechnung
  const generateInvoice = async (order: Order) => {
    setIsLoading(true);
    try {
      toast.info('Rechnung wird generiert...');
      
      // API-Aufruf zum Generieren einer Rechnung
      const response = await fetch(`/api/admin/orders/${order.id}/invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Fehler beim Generieren der Rechnung');
      }
      
      const data = await response.json();
      
      if (data.success && data.invoiceUrl) {
        // Rechnung in neuem Tab öffnen
        window.open(data.invoiceUrl, '_blank');
        toast.success('Rechnung erfolgreich generiert');
      } else {
        throw new Error(data.message || 'Unbekannter Fehler');
      }
    } catch (error) {
      console.error('Fehler beim Generieren der Rechnung:', error);
      toast.error('Rechnung konnte nicht generiert werden');
    } finally {
      setIsLoading(false);
    }
  };

  // Funktion zum Ändern des Bestellstatus
  const handleStatusChange = async (orderId: number, newStatus: Order['status']) => {
    setIsLoading(true);
    try {
      // API-Aufruf zum Aktualisieren des Status
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      // Fallback für den Fall, dass die API nicht verfügbar ist
      if (!response.ok) {
        // In einer Produktionsumgebung sollte dies anders gehandhabt werden
        console.warn('API nicht verfügbar, simuliere Statusänderung');
        
        // Aktualisiere den Status in der lokalen Liste
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
              : order
          )
        );
        
        // Wenn ausgewählte Bestellung, diese auch aktualisieren
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({
            ...selectedOrder,
            status: newStatus,
            updatedAt: new Date().toISOString()
          });
        }
        
        toast.success(`Bestellstatus erfolgreich auf "${newStatus}" geändert`);
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Aktualisiere den Status in der lokalen Liste
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId ? data.order : order
          )
        );
        
        // Wenn ausgewählte Bestellung, diese auch aktualisieren
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.order);
        }
        
        toast.success(`Bestellstatus erfolgreich auf "${newStatus}" geändert`);
      } else {
        throw new Error(data.message || 'Fehler beim Aktualisieren des Status');
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Status:', error);
      toast.error('Fehler beim Aktualisieren des Status');
    } finally {
      setIsLoading(false);
    }
  };

  // Funktion zum Melden eines Problems
  const reportIssue = (order: Order) => {
    const subject = `Problem mit Bestellung ${formatOrderNumber(order.id)}`;
    const body = `Bestelldetails:\n- ID: ${order.id}\n- Kunde: ${order.customerEmail}\n- Datum: ${formatDate(order.createdAt)}\n- Status: ${order.status}\n\nBeschreibung des Problems:`;
    
    // E-Mail-Client öffnen
    window.location.href = `mailto:kundenservice@ct-studio.store?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Funktion zum Anzeigen der Bestelldetails
  const handleShowDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  // Bestellungen nach Status filtern
  const filteredOrders = orders && orders.length > 0 
    ? orders.filter(order => {
        // Nach Tab filtern
        if (activeTab !== 'all' && order.status !== activeTab) {
          return false;
        }
        
        // Nach Suchbegriff filtern
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            order.id.toString().includes(query) ||
            formatOrderNumber(order.id).toLowerCase().includes(query) ||
            order.customerEmail.toLowerCase().includes(query) ||
            order.paymentIntent?.toLowerCase().includes(query) ||
            order.items.some(item => item.productName.toLowerCase().includes(query))
          );
        }
        
        return true;
      })
    : [];

  // Status Badge und Icon
  const getStatusBadge = (status: Order['status']) => {
    const badges = {
      pending: { icon: <Clock size={14} />, text: 'Ausstehend', class: 'bg-yellow-500/20 text-yellow-300' },
      processing: { icon: <Package size={14} />, text: 'In Bearbeitung', class: 'bg-blue-500/20 text-blue-300' },
      completed: { icon: <Check size={14} />, text: 'Abgeschlossen', class: 'bg-green-500/20 text-green-300' },
      cancelled: { icon: <Ban size={14} />, text: 'Storniert', class: 'bg-red-500/20 text-red-300' },
    };
    
    const badge = badges[status];
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.class}`}>
        {badge.icon}
        {badge.text}
      </span>
    );
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
      <div className="container max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Link href="/admin" className="mr-4">
              <Button variant="ghost" size="icon" className="text-white">
                <ArrowLeft />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Bestellungen</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={toggleDebugMode} 
              variant="outline"
              className="border-purple-500/30 text-white hover:bg-purple-500/10"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Debug
            </Button>
            <Button 
              onClick={handleReset} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoadingOrders}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Zurücksetzen
            </Button>
            <Button 
              onClick={fetchOrders} 
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isLoadingOrders}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingOrders ? 'animate-spin' : ''}`} />
              Aktualisieren
            </Button>
          </div>
        </div>

        {debugMode && (
          <Card className="bg-red-900/20 border-red-500/30 mb-4">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold mb-2">Debug-Informationen</h3>
              <div className="space-y-1 text-sm">
                <p>Anzahl der Bestellungen: <span className="font-mono">{orders.length}</span></p>
                <p>Aktiver Tab: <span className="font-mono">{activeTab}</span></p>
                <p>Bestellungsdaten:</p>
                <pre className="bg-black/50 p-2 rounded overflow-auto max-h-40 text-xs">
                  {JSON.stringify(orders, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Linke Spalte: Bestellungsliste */}
          <div className={`w-full ${selectedOrder ? "lg:w-3/5" : "lg:w-full"}`}>
            <Card className="bg-white/5 border-purple-500/20">
              <CardHeader className="border-b border-purple-500/10 pb-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div className="flex items-center">
                    <CardTitle className="text-white">Bestellungen</CardTitle>
                    <span className="ml-2 text-sm text-gray-400">({filteredOrders.length} von {orders.length})</span>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Bestellungen suchen..."
                      className="bg-white/10 border-purple-500/20 pl-10 text-white md:w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <Tabs defaultValue="all" className="mt-4" onValueChange={setActiveTab}>
                  <TabsList className="bg-black/20 w-full overflow-x-auto">
                    <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">Alle</TabsTrigger>
                    <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-600">Ausstehend</TabsTrigger>
                    <TabsTrigger value="processing" className="data-[state=active]:bg-blue-600">In Bearbeitung</TabsTrigger>
                    <TabsTrigger value="completed" className="data-[state=active]:bg-green-600">Abgeschlossen</TabsTrigger>
                    <TabsTrigger value="cancelled" className="data-[state=active]:bg-red-600">Storniert</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  {isLoadingOrders ? (
                    <div className="p-8 text-center">
                      <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-purple-500" />
                      <p className="text-gray-400">Bestellungen werden geladen...</p>
                    </div>
                  ) : (
                    <div className="min-w-full overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-black/30 text-left">
                            <th className="px-4 py-3 text-gray-400 font-medium text-sm">Bestellnummer</th>
                            <th className="px-4 py-3 text-gray-400 font-medium text-sm">Kunde</th>
                            <th className="px-4 py-3 text-gray-400 font-medium text-sm">Datum</th>
                            <th className="px-4 py-3 text-gray-400 font-medium text-sm text-right">Betrag</th>
                            <th className="px-4 py-3 text-gray-400 font-medium text-sm">Status</th>
                            <th className="px-4 py-3 text-gray-400 font-medium text-sm text-center">Aktionen</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-purple-500/10">
                          {filteredOrders.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                                <ShoppingBag className="mx-auto mb-2 text-gray-500" size={32} />
                                <p>Keine Bestellungen gefunden</p>
                                {searchQuery && (
                                  <p className="mt-4">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => setSearchQuery('')}
                                      className="bg-purple-500/10 hover:bg-purple-500/20 text-white"
                                    >
                                      Suche zurücksetzen
                                    </Button>
                                  </p>
                                )}
                              </td>
                            </tr>
                          ) : (
                            filteredOrders.map((order) => (
                              <tr key={order.id} className="hover:bg-white/5">
                                <td className="px-4 py-3 font-medium text-gray-100">{formatOrderNumber(order.id)}</td>
                                <td className="px-4 py-3 text-gray-100">{order.customerEmail}</td>
                                <td className="px-4 py-3 text-gray-400 text-sm">{formatDate(order.createdAt)}</td>
                                <td className="px-4 py-3 text-right font-medium text-purple-400">
                                  {formatPrice(order.total)}
                                </td>
                                <td className="px-4 py-3">
                                  {getStatusBadge(order.status)}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <div className="flex justify-center gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-gray-400 hover:text-white h-8"
                                      onClick={() => handleShowDetails(order)}
                                      disabled={isLoading}
                                    >
                                      Details
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rechte Spalte: Bestellungsdetails */}
          {selectedOrder && (
            <div className="w-full lg:w-2/5">
              <Card className="bg-white/5 border-purple-500/20 sticky top-4">
                <CardHeader className="border-b border-purple-500/10">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">
                      Bestellung {formatOrderNumber(selectedOrder.id)}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrder(null)}
                      className="h-8 px-2 text-gray-400 hover:text-white"
                    >
                      Schließen
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 divide-y divide-purple-500/10">
                  <div className="pb-4">
                    <h3 className="text-lg font-medium mb-3 text-white">Bestelldetails</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-400">Status:</p>
                      <p className="text-gray-100">{getStatusBadge(selectedOrder.status)}</p>
                      
                      <p className="text-gray-400">Bestellt am:</p>
                      <p className="text-gray-100">{formatDate(selectedOrder.createdAt)}</p>
                      
                      <p className="text-gray-400">Aktualisiert am:</p>
                      <p className="text-gray-100">{formatDate(selectedOrder.updatedAt)}</p>
                      
                      <p className="text-gray-400">Bezahlmethode:</p>
                      <p className="truncate text-gray-100">Stripe</p>
                      
                      <p className="text-gray-400">Zahlungs-ID:</p>
                      <p className="truncate text-gray-100 flex items-center">
                        {selectedOrder.paymentIntent ? (
                          <>
                            <span className="break-all mr-2">{selectedOrder.paymentIntent}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 p-0 inline-flex items-center text-purple-400 hover:text-purple-300 shrink-0"
                              onClick={() => window.open(`https://dashboard.stripe.com/payments/${selectedOrder.paymentIntent}`, '_blank')}
                            >
                              <ExternalLink size={14} />
                            </Button>
                          </>
                        ) : (
                          '-'
                        )}
                      </p>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-md font-medium mb-2 text-white">Status ändern:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant={selectedOrder.status === 'pending' ? 'default' : 'outline'}
                          onClick={() => handleStatusChange(selectedOrder.id, 'pending')}
                          disabled={isLoading || selectedOrder.status === 'pending'}
                          className={selectedOrder.status === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                        >
                          <Clock className="mr-1 h-4 w-4" />
                          Ausstehend
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedOrder.status === 'processing' ? 'default' : 'outline'}
                          onClick={() => handleStatusChange(selectedOrder.id, 'processing')}
                          disabled={isLoading || selectedOrder.status === 'processing'}
                          className={selectedOrder.status === 'processing' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                        >
                          <Package className="mr-1 h-4 w-4" />
                          In Bearbeitung
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedOrder.status === 'completed' ? 'default' : 'outline'}
                          onClick={() => handleStatusChange(selectedOrder.id, 'completed')}
                          disabled={isLoading || selectedOrder.status === 'completed'}
                          className={selectedOrder.status === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Abgeschlossen
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedOrder.status === 'cancelled' ? 'default' : 'outline'}
                          onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                          disabled={isLoading || selectedOrder.status === 'cancelled'}
                          className={selectedOrder.status === 'cancelled' ? 'bg-red-600 hover:bg-red-700' : ''}
                        >
                          <Ban className="mr-1 h-4 w-4" />
                          Storniert
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-4">
                    <h3 className="text-lg font-medium mb-3 text-white">Kunde</h3>
                    <div className="text-sm">
                      <p className="text-gray-400 mb-1">E-Mail:</p>
                      <p className="text-gray-100">{selectedOrder.customerEmail || '-'}</p>
                      
                      <p className="text-gray-400 mt-2 mb-1">Kunden-ID:</p>
                      <p className="text-gray-100">{selectedOrder.customerId || 'Nicht registriert'}</p>
                    </div>
                  </div>
                  
                  <div className="py-4">
                    <h3 className="text-lg font-medium mb-3 text-white">Artikel</h3>
                    <div className="space-y-3">
                      {selectedOrder && selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item) => (
                          <div key={item.id} className="bg-black/20 p-3 rounded-md">
                            <div className="flex justify-between mb-1">
                              <p className="font-medium text-gray-100">{item.productName}</p>
                              <p className="text-purple-400 font-medium">{formatPrice(item.price)}</p>
                            </div>
                            <div className="flex justify-between text-sm text-gray-400">
                              <p>Artikel-ID: {item.productId}</p>
                              <p>Anzahl: {item.quantity}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-black/20 p-3 rounded-md">
                          <p className="text-gray-400 text-center">Keine Artikeldetails verfügbar</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-purple-500/10">
                      <div className="flex justify-between font-bold">
                        <p className="text-gray-100">Gesamtbetrag:</p>
                        <p className="text-purple-400">{formatPrice(selectedOrder.total)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-3 text-white">Aktionen</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-500/30 text-white hover:bg-purple-500/10"
                        onClick={() => generateInvoice(selectedOrder)}
                        disabled={isLoading}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Rechnung generieren
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-500/30 text-white hover:bg-purple-500/10"
                        onClick={() => reportIssue(selectedOrder)}
                      >
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Problem melden
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-500/30 text-white hover:bg-purple-500/10"
                        onClick={() => {
                          if (selectedOrder.paymentIntent) {
                            // Bei einer vorhandenen Payment Intent ID direkt zur Zahlungsseite
                            const paymentId = selectedOrder.paymentIntent;
                            console.log('Öffne Stripe mit Payment ID:', paymentId);
                            
                            // Im Debug-Modus mehr Informationen anzeigen
                            if (debugMode) {
                              console.log('Vollständige Bestelldaten:', selectedOrder);
                            }
                            
                            window.open(`https://dashboard.stripe.com/payments/${paymentId}`, '_blank');
                          } else {
                            // Wenn keine Payment Intent ID vorhanden ist, zur Stripe-Suchseite weiterleiten
                            console.log('Keine Payment ID gefunden, öffne Suchseite mit ID:', selectedOrder.id);
                            window.open(`https://dashboard.stripe.com/search?query=CTORD-${selectedOrder.id.toString().padStart(5, '0')}`, '_blank');
                          }
                        }}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Auf Stripe ansehen
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 