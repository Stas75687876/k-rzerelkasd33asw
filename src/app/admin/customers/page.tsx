'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Search, User, Mail, Loader2, RefreshCw, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

// Typen für Kunden und Bestellungen
interface Order {
  id: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

interface Customer {
  id: number;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string | null;
  orders?: Order[];
}

// Beispieldaten für Kunden
const sampleCustomers: Customer[] = [
  {
    id: 1,
    email: 'kunde1@example.com',
    name: 'Max Mustermann',
    createdAt: '2023-10-15T14:30:00Z',
    updatedAt: '2023-11-15T14:35:00Z',
    ordersCount: 3,
    totalSpent: 2497,
    lastOrderDate: '2023-11-15T14:30:00Z',
    orders: [
      {
        id: 10001,
        total: 999,
        status: 'completed',
        createdAt: '2023-11-15T14:30:00Z'
      },
      {
        id: 10005,
        total: 499,
        status: 'completed',
        createdAt: '2023-11-01T10:45:00Z'
      },
      {
        id: 10008,
        total: 999,
        status: 'completed',
        createdAt: '2023-10-20T16:15:00Z'
      }
    ]
  },
  {
    id: 2,
    email: 'kunde2@example.com',
    name: 'Erika Musterfrau',
    createdAt: '2023-10-20T10:15:00Z',
    updatedAt: '2023-11-20T10:20:00Z',
    ordersCount: 2,
    totalSpent: 1798,
    lastOrderDate: '2023-11-20T10:15:00Z',
    orders: [
      {
        id: 10002,
        total: 1499,
        status: 'processing',
        createdAt: '2023-11-20T10:15:00Z'
      },
      {
        id: 10006,
        total: 299,
        status: 'completed',
        createdAt: '2023-10-25T09:30:00Z'
      }
    ]
  },
  {
    id: 3,
    email: 'kunde3@example.com',
    name: null,
    createdAt: '2023-11-05T09:45:00Z',
    updatedAt: '2023-11-25T09:45:00Z',
    ordersCount: 1,
    totalSpent: 598,
    lastOrderDate: '2023-11-25T09:45:00Z',
    orders: [
      {
        id: 10003,
        total: 598,
        status: 'pending',
        createdAt: '2023-11-25T09:45:00Z'
      }
    ]
  },
  {
    id: 4,
    email: 'kunde4@example.com',
    name: 'Thomas Test',
    createdAt: '2023-11-10T16:20:00Z',
    updatedAt: '2023-11-30T18:30:00Z',
    ordersCount: 1,
    totalSpent: 499,
    lastOrderDate: '2023-11-30T16:20:00Z',
    orders: [
      {
        id: 10004,
        total: 499,
        status: 'cancelled',
        createdAt: '2023-11-30T16:20:00Z'
      }
    ]
  },
  {
    id: 5,
    email: 'kunde5@example.com',
    name: 'Lisa Beispiel',
    createdAt: '2023-09-18T11:25:00Z',
    updatedAt: '2023-11-22T13:10:00Z',
    ordersCount: 2,
    totalSpent: 798,
    lastOrderDate: '2023-11-22T13:10:00Z',
    orders: [
      {
        id: 10007,
        total: 499,
        status: 'completed',
        createdAt: '2023-11-22T13:10:00Z'
      },
      {
        id: 10009,
        total: 299,
        status: 'completed',
        createdAt: '2023-10-05T14:50:00Z'
      }
    ]
  }
];

export default function CustomersAdminPage() {
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

  // Prüfen, ob der Benutzer angemeldet ist
  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      setIsAuthenticated(true);
      // fetchCustomers(); // Hier würden wir normalerweise Kunden von der API laden
    } else {
      // Wenn nicht authentifiziert, zur Anmeldeseite umleiten
      window.location.href = '/admin';
    }
  }, []);

  // Funktion zum Formatieren des Datums
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nie';
    try {
      return format(new Date(dateString), 'PP', { locale: de });
    } catch (error) {
      return dateString;
    }
  };

  // Funktion zum Laden der Kunden (Simuliert API-Aufruf)
  const fetchCustomers = async () => {
    setIsLoadingCustomers(true);
    try {
      // Hier würden wir normalerweise Kunden von der API laden
      // const response = await fetch('/api/customers');
      // if (!response.ok) throw new Error('Fehler beim Laden der Kunden');
      // const data = await response.json();
      // if (data.success) setCustomers(data.customers);
      
      // Simuliere eine kleine Verzögerung
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Verwende Beispieldaten für die Demo
      setCustomers(sampleCustomers);
      toast.success('Kunden erfolgreich geladen');
    } catch (error) {
      console.error('Fehler beim Laden der Kunden:', error);
      toast.error('Fehler beim Laden der Kunden');
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  // Funktion zum Anzeigen der Kundendetails
  const handleShowDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  // Kunden nach Suchbegriff filtern
  const filteredCustomers = customers.filter(customer => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        customer.id.toString().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.name?.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Status Badge für Bestellungen
  const getStatusBadge = (status: Order['status']) => {
    const statusClasses = {
      pending: 'bg-yellow-500/20 text-yellow-300',
      processing: 'bg-blue-500/20 text-blue-300',
      completed: 'bg-green-500/20 text-green-300',
      cancelled: 'bg-red-500/20 text-red-300',
    };
    
    const statusTexts = {
      pending: 'Ausstehend',
      processing: 'In Bearbeitung',
      completed: 'Abgeschlossen',
      cancelled: 'Storniert',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {statusTexts[status]}
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Link href="/admin" className="mr-4">
              <Button variant="ghost" size="icon" className="text-white">
                <ArrowLeft />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Kunden</h1>
          </div>
          <Button 
            onClick={fetchCustomers} 
            className="bg-purple-600 hover:bg-purple-700"
            disabled={isLoadingCustomers}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingCustomers ? 'animate-spin' : ''}`} />
            Aktualisieren
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Linke Spalte: Kundenliste */}
          <div className={`lg:col-span-${selectedCustomer ? '7' : '12'}`}>
            <Card className="bg-white/5 border-purple-500/20">
              <CardHeader className="border-b border-purple-500/10 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Kunden</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Kunden suchen..."
                      className="bg-white/10 border-purple-500/20 pl-10 text-white w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  {isLoadingCustomers ? (
                    <div className="p-8 text-center">
                      <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-purple-500" />
                      <p className="text-gray-400">Kunden werden geladen...</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="bg-black/30 text-left">
                          <th className="px-4 py-3 text-gray-400 font-medium text-sm">ID</th>
                          <th className="px-4 py-3 text-gray-400 font-medium text-sm">Kunde</th>
                          <th className="px-4 py-3 text-gray-400 font-medium text-sm">Registriert am</th>
                          <th className="px-4 py-3 text-gray-400 font-medium text-sm text-center">Bestellungen</th>
                          <th className="px-4 py-3 text-gray-400 font-medium text-sm text-right">Ausgegeben</th>
                          <th className="px-4 py-3 text-gray-400 font-medium text-sm text-center">Aktionen</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-500/10">
                        {filteredCustomers.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                              <User className="mx-auto mb-2 text-gray-500" size={32} />
                              <p>Keine Kunden gefunden</p>
                            </td>
                          </tr>
                        ) : (
                          filteredCustomers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-white/5">
                              <td className="px-4 py-3 font-medium">{customer.id}</td>
                              <td className="px-4 py-3">
                                <div>
                                  <p className="font-medium">{customer.name || 'Unbenannt'}</p>
                                  <p className="text-gray-400 text-sm">{customer.email}</p>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-gray-400 text-sm">{formatDate(customer.createdAt)}</td>
                              <td className="px-4 py-3 text-center font-medium">{customer.ordersCount}</td>
                              <td className="px-4 py-3 text-right font-medium text-purple-400">
                                €{customer.totalSpent.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex justify-center gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-gray-400 hover:text-white h-8"
                                    onClick={() => handleShowDetails(customer)}
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
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rechte Spalte: Kundendetails */}
          {selectedCustomer && (
            <div className="lg:col-span-5">
              <Card className="bg-white/5 border-purple-500/20 sticky top-4">
                <CardHeader className="border-b border-purple-500/10">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">
                      Kunde #{selectedCustomer.id}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCustomer(null)}
                      className="h-8 px-2 text-gray-400 hover:text-white"
                    >
                      Schließen
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 divide-y divide-purple-500/10">
                  <div className="pb-4">
                    <h3 className="text-lg font-medium mb-3">Kundeninformationen</h3>
                    <div className="bg-black/20 p-3 rounded-md mb-4 flex items-center">
                      <User className="h-12 w-12 text-purple-400 p-3 bg-purple-400/10 rounded-full mr-3" />
                      <div>
                        <p className="font-medium text-lg">{selectedCustomer.name || 'Unbenannt'}</p>
                        <p className="text-gray-400 flex items-center mt-1">
                          <Mail className="h-4 w-4 mr-1" />
                          {selectedCustomer.email}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-400">Kundennummer:</p>
                      <p>#{selectedCustomer.id}</p>
                      
                      <p className="text-gray-400">Registriert am:</p>
                      <p>{formatDate(selectedCustomer.createdAt)}</p>
                      
                      <p className="text-gray-400">Letzte Aktivität:</p>
                      <p>{formatDate(selectedCustomer.updatedAt)}</p>
                      
                      <p className="text-gray-400">Bestellungen:</p>
                      <p>{selectedCustomer.ordersCount}</p>
                      
                      <p className="text-gray-400">Gesamtausgaben:</p>
                      <p className="text-purple-400 font-medium">€{selectedCustomer.totalSpent.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="py-4">
                    <h3 className="text-lg font-medium mb-3">Bestellungsverlauf</h3>
                    {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                      <div className="space-y-3">
                        {selectedCustomer.orders.map((order) => (
                          <Link href={`/admin/orders`} key={order.id} className="block">
                            <div className="bg-black/20 p-3 rounded-md hover:bg-white/5 transition-colors">
                              <div className="flex justify-between mb-1">
                                <p className="font-medium flex items-center">
                                  <ShoppingBag className="h-4 w-4 mr-1" />
                                  Bestellung #{order.id}
                                </p>
                                <p className="text-purple-400 font-medium">€{order.total.toFixed(2)}</p>
                              </div>
                              <div className="flex justify-between text-sm">
                                <p className="text-gray-400">{formatDate(order.createdAt)}</p>
                                <div>{getStatusBadge(order.status)}</div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-black/20 p-4 rounded-md text-center">
                        <ShoppingBag className="mx-auto mb-2 text-gray-500" size={24} />
                        <p className="text-gray-400">Keine Bestellungen vorhanden</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-3">Aktionen</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-500/30 text-white hover:bg-purple-500/10"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        E-Mail senden
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        Kunden löschen
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