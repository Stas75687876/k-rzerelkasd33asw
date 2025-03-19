'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ShoppingBag, Package, Database, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Prüfen, ob der Benutzer bereits authentifiziert ist
  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Demo-Anmeldedaten für Testzwecke
      const demoEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com';
      const demoPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'adminpassword';

      // Einfache Überprüfung der Anmeldedaten
      if (email === demoEmail && password === demoPassword) {
        // Erfolgreiche Anmeldung
        // In einer realen Anwendung würden wir einen API-Aufruf durchführen
        localStorage.setItem('admin_token', 'demo_token_' + Date.now());
        setIsAuthenticated(true);
        toast.success('Erfolgreich angemeldet');
      } else {
        // Ungültige Anmeldedaten
        toast.error('Ungültige E-Mail oder Passwort');
      }
    } catch (error) {
      console.error('Anmeldefehler:', error);
      toast.error('Fehler bei der Anmeldung. Bitte versuche es später erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    toast.info('Du wurdest abgemeldet');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8"
        >
          <Card className="bg-white/5 border-purple-500/20">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-white">Admin-Anmeldung</CardTitle>
              <CardDescription className="text-gray-400">
                Melde dich an, um auf den Admin-Bereich zuzugreifen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">E-Mail</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/10 border-purple-500/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">Passwort</label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white/10 border-purple-500/20 text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Anmeldung...' : 'Anmelden'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="border-t border-purple-500/10 pt-4">
              <div className="text-xs text-gray-400 text-center w-full">
                <p>Demo-Anmeldedaten:</p>
                <p>E-Mail: admin@example.com</p>
                <p>Passwort: adminpassword</p>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Admin-Dashboard, wenn angemeldet
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Button onClick={handleLogout} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
              Abmelden
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/admin/products">
              <Card className="bg-white/5 border-purple-500/20 hover:bg-white/10 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-purple-400" />
                    Produkte verwalten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Produkte hinzufügen, bearbeiten oder löschen und Inventar verwalten.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/orders">
              <Card className="bg-white/5 border-purple-500/20 hover:bg-white/10 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-purple-400" />
                    Bestellungen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Bestellungen anzeigen, bearbeiten und den Status aktualisieren.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Card className="bg-white/5 border-purple-500/20 hover:bg-white/10 transition-colors cursor-pointer opacity-70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-400" />
                  Kunden
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Kundeninformationen und -bestellungen anzeigen und verwalten.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-purple-500/20 hover:bg-white/10 transition-colors cursor-pointer opacity-70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-purple-400" />
                  Datenbank-Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Datenbankverbindung prüfen und Tabellen anzeigen.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 