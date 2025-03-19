'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TroubleshootingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Problembehandlung
          </h1>
          
          <div className="bg-white/5 p-8 rounded-lg mb-10">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">
              Hydration-Fehler durch Browser-Erweiterungen
            </h2>
            
            <p className="mb-4">
              Sie sehen möglicherweise einen Hydration-Fehler in der Konsole, der folgendermaßen aussieht:
            </p>
            
            <pre className="bg-black/50 p-4 rounded-md text-sm overflow-x-auto mb-6">
              {`Warning: Prop 'style' did not match. Server: "" Client: "..."`}
            </pre>
            
            <p className="mb-4">
              Dies wird durch <strong>Browser-Erweiterungen verursacht</strong>, die HTML-Elemente modifizieren, bevor React sie hydratisieren kann. Insbesondere:
            </p>
            
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>E-Mail-Validierungs-Erweiterungen</li>
              <li>Passwort-Manager wie LastPass, 1Password oder Bitwarden</li>
              <li>Formular-Autofill-Erweiterungen</li>
              <li>Ad-Blocker, die bestimmte Elemente modifizieren</li>
            </ul>
            
            <h3 className="text-xl font-bold mb-3 text-white">Lösungsmöglichkeiten:</h3>
            
            <ol className="list-decimal pl-6 mb-6 space-y-3">
              <li>
                <strong>Temporär Browser-Erweiterungen deaktivieren</strong> - Besonders solche für Formularausfüllung oder E-Mail-Validierung
              </li>
              <li>
                <strong>Inkognito-/Privaten Modus verwenden</strong> - Browser im Inkognito- oder privaten Modus öffnen, wo Erweiterungen standardmäßig deaktiviert sind
              </li>
              <li>
                <strong>Einen anderen Browser testen</strong> - Versuchen Sie, die Website in einem anderen Browser zu öffnen, um zu sehen, ob das Problem dort auch auftritt
              </li>
              <li>
                <strong>Warnungen ignorieren</strong> - Diese Fehler beeinträchtigen die Funktionalität der Website nicht und können ignoriert werden
              </li>
            </ol>
          </div>
          
          <div className="bg-purple-900/30 p-6 rounded-lg border border-purple-500/30">
            <h2 className="text-xl font-bold mb-3">
              Technische Hinweise für Entwickler
            </h2>
            <p className="mb-4">
              Die WOWWeb-Anwendung verwendet bereits die <code>suppressHydrationWarning</code>-Eigenschaft 
              für Input-Elemente und Form-Controls. Zusätzlich können Sie:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Alle Formular-Komponenten als Client-Komponenten kennzeichnen</li>
              <li>Client-only-Rendering für bestimmte Formularkomponenten erzwingen</li>
              <li>Next.js auf 13.4.x oder höher aktualisieren für verbesserte Hydration-Handhabung</li>
            </ul>
            
            <p>
              Siehe die <a href="https://nextjs.org/docs/messages/react-hydration-error" className="text-purple-400 underline">Next.js Dokumentation zu Hydration-Fehlern</a> für weitere Informationen.
            </p>
          </div>
          
          <div className="mt-8 flex justify-center">
            <Link href="/">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Zurück zur Startseite
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 