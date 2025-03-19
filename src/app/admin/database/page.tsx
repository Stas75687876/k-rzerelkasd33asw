'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Database, Table, RefreshCw, Loader2, Check, AlertCircle, RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

// Interface für Tabelleninformationen
interface TableInfo {
  name: string;
  rowCount: number;
  lastUpdated: string | null;
  status: 'ok' | 'warning' | 'error';
}

// Interface für Datenbankstatusinformationen
interface DatabaseStatus {
  connected: boolean;
  version: string;
  uptime: string;
  error: string | null;
  tables: TableInfo[];
}

// Simulierte Datenbankstatus-Daten
const mockDatabaseStatus: DatabaseStatus = {
  connected: true,
  version: 'PostgreSQL 15.3 (Neon) on x86_64-pc-linux-gnu',
  uptime: '15 days, 7 hours, 23 minutes',
  error: null,
  tables: [
    { name: 'products', rowCount: 10, lastUpdated: '2023-11-28T15:42:30Z', status: 'ok' },
    { name: 'customers', rowCount: 25, lastUpdated: '2023-11-29T09:15:22Z', status: 'ok' },
    { name: 'orders', rowCount: 18, lastUpdated: '2023-11-30T11:20:15Z', status: 'ok' },
    { name: 'order_items', rowCount: 43, lastUpdated: '2023-11-30T11:20:15Z', status: 'ok' }
  ]
};

export default function DatabaseAdminPage() {
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Prüfen, ob der Benutzer angemeldet ist
  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      setIsAuthenticated(true);
      fetchDatabaseStatus();
    } else {
      // Wenn nicht authentifiziert, zur Anmeldeseite umleiten
      window.location.href = '/admin';
    }
  }, []);

  // Funktion zum Abrufen des Datenbankstatus
  const fetchDatabaseStatus = async () => {
    setIsLoading(true);
    try {
      // Hier würden wir normalerweise den Datenbankstatus von der API abrufen
      // const response = await fetch('/api/admin/database/status');
      // if (!response.ok) throw new Error('Fehler beim Abrufen des Datenbankstatus');
      // const data = await response.json();
      // setDbStatus(data);
      
      // Simuliere eine kleine Verzögerung
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verwende Beispieldaten für die Demo
      setDbStatus(mockDatabaseStatus);
      toast.success('Datenbankstatus erfolgreich abgerufen');
    } catch (error) {
      console.error('Fehler beim Abrufen des Datenbankstatus:', error);
      toast.error('Fehler beim Abrufen des Datenbankstatus');
      setDbStatus({
        connected: false,
        version: 'Unbekannt',
        uptime: 'Unbekannt',
        error: 'Verbindung zur Datenbank konnte nicht hergestellt werden',
        tables: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Funktion zur Initialisierung/Synchronisierung der Datenbank
  const initializeDatabase = async () => {
    setIsInitializing(true);
    try {
      // Hier würden wir normalerweise die Datenbank initialisieren/synchronisieren
      // const response = await fetch('/api/admin/database/init', { method: 'POST' });
      // if (!response.ok) throw new Error('Fehler bei der Datenbankinitialisierung');
      // const data = await response.json();
      
      // Simuliere eine kleine Verzögerung
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Datenbank erfolgreich initialisiert/synchronisiert');
      fetchDatabaseStatus(); // Status nach der Initialisierung aktualisieren
    } catch (error) {
      console.error('Fehler bei der Datenbankinitialisierung:', error);
      toast.error('Fehler bei der Datenbankinitialisierung');
    } finally {
      setIsInitializing(false);
    }
  };

  // Funktion zum Formatieren des Datums
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nie';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Anzeige für nicht authentifizierte Benutzer
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
            <h1 className="text-3xl font-bold">Datenbank-Status</h1>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={initializeDatabase}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isInitializing}
            >
              <RotateCw className={`mr-2 h-4 w-4 ${isInitializing ? 'animate-spin' : ''}`} />
              {isInitializing ? 'Initialisiere...' : 'DB synchronisieren'}
            </Button>
            <Button
              onClick={fetchDatabaseStatus}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Aktualisieren
            </Button>
          </div>
        </div>

        {/* Lade-Indikator */}
        {isLoading && !dbStatus && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
            <p className="text-gray-400">Datenbankstatus wird geladen...</p>
          </div>
        )}

        {/* Verbindungsstatus */}
        {dbStatus && (
          <div className="grid gap-6">
            <Card className={`bg-white/5 border-${dbStatus.connected ? 'green' : 'red'}-500/20`}>
              <CardHeader className="border-b border-purple-500/10 pb-4">
                <CardTitle className="text-white flex items-center">
                  <Database className="mr-2 h-5 w-5 text-purple-400" />
                  Datenbankverbindung
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className={`w-3 h-3 rounded-full mr-2 bg-${dbStatus.connected ? 'green' : 'red'}-500`}></div>
                  <span className={`text-${dbStatus.connected ? 'green' : 'red'}-400 font-medium`}>
                    {dbStatus.connected ? 'Verbunden' : 'Nicht verbunden'}
                  </span>
                </div>

                {dbStatus.connected ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-black/20 p-4 rounded-md">
                      <p className="text-gray-400 text-sm mb-1">Datenbankversion</p>
                      <p className="font-medium">{dbStatus.version}</p>
                    </div>
                    <div className="bg-black/20 p-4 rounded-md">
                      <p className="text-gray-400 text-sm mb-1">Betriebszeit</p>
                      <p className="font-medium">{dbStatus.uptime}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-md text-red-300">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Verbindungsfehler</p>
                        <p className="mt-1 text-sm opacity-80">
                          {dbStatus.error || 'Ein unbekannter Fehler ist aufgetreten. Bitte überprüfe deine Datenbankverbindung.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tabellenstatus */}
            {dbStatus.connected && (
              <Card className="bg-white/5 border-purple-500/20">
                <CardHeader className="border-b border-purple-500/10 pb-4">
                  <CardTitle className="text-white flex items-center">
                    <Table className="mr-2 h-5 w-5 text-purple-400" />
                    Datenbanktabellen
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-black/30 text-left">
                          <th className="px-4 py-3 text-gray-400 font-medium text-sm">Tabellenname</th>
                          <th className="px-4 py-3 text-gray-400 font-medium text-sm text-center">Anzahl Zeilen</th>
                          <th className="px-4 py-3 text-gray-400 font-medium text-sm">Letzte Aktualisierung</th>
                          <th className="px-4 py-3 text-gray-400 font-medium text-sm text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-500/10">
                        {dbStatus.tables.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                              <Database className="mx-auto mb-2 text-gray-500" size={32} />
                              <p>Keine Tabellen gefunden</p>
                            </td>
                          </tr>
                        ) : (
                          dbStatus.tables.map((table) => (
                            <tr key={table.name} className="hover:bg-white/5">
                              <td className="px-4 py-3 font-medium">
                                {table.name}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {table.rowCount}
                              </td>
                              <td className="px-4 py-3 text-gray-400">
                                {formatDate(table.lastUpdated)}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {table.status === 'ok' ? (
                                  <span className="inline-flex items-center text-green-400">
                                    <Check className="h-4 w-4 mr-1" />
                                    OK
                                  </span>
                                ) : table.status === 'warning' ? (
                                  <span className="inline-flex items-center text-yellow-400">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    Warnung
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center text-red-400">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    Fehler
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Verbindungsdetails */}
            <Card className="bg-white/5 border-purple-500/20">
              <CardHeader className="border-b border-purple-500/10 pb-4">
                <CardTitle className="text-white">Datenbankverbindungsdetails</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-black/20 p-4 rounded-md">
                  <p className="text-gray-400 mb-2">Verbindungs-URL</p>
                  <div className="bg-black/40 p-3 rounded border border-purple-500/20 font-mono text-sm break-all">
                    <code>postgres://<span className="text-purple-400">username</span>:<span className="text-gray-500">****</span>@<span className="text-blue-400">db.example.neon.tech</span>/<span className="text-green-400">neondb</span>?sslmode=require</code>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">
                    Hinweis: Aus Sicherheitsgründen wird das Passwort nicht angezeigt
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-black/20 p-4 rounded-md">
                    <p className="text-gray-400 text-sm mb-1">Host</p>
                    <p className="font-medium">db.example.neon.tech</p>
                  </div>
                  <div className="bg-black/20 p-4 rounded-md">
                    <p className="text-gray-400 text-sm mb-1">Datenbankname</p>
                    <p className="font-medium">neondb</p>
                  </div>
                  <div className="bg-black/20 p-4 rounded-md">
                    <p className="text-gray-400 text-sm mb-1">Benutzer</p>
                    <p className="font-medium">username</p>
                  </div>
                  <div className="bg-black/20 p-4 rounded-md">
                    <p className="text-gray-400 text-sm mb-1">SSL-Modus</p>
                    <p className="font-medium">require</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-400 mb-2">
                    Die Datenbankverbindung wird mit der folgenden Umgebungsvariable konfiguriert:
                  </p>
                  <div className="bg-black/40 p-3 rounded border border-purple-500/20 font-mono text-sm">
                    <code>DATABASE_URL=postgres://username:password@db.example.neon.tech/neondb?sslmode=require</code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 