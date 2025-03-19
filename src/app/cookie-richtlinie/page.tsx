'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function CookieRichtliniePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Cookie-Richtlinie
          </h1>
          
          <div className="space-y-8">
            <section className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Was sind Cookies?</h2>
              
              <p className="mb-4 text-gray-300">
                Cookies sind kleine Textdateien, die auf Ihrem Computer oder mobilen Gerät gespeichert werden, wenn Sie 
                unsere Website besuchen. Cookies helfen uns, Ihre Nutzererfahrung zu verbessern, indem sie es uns ermöglichen, 
                Ihre Präferenzen zu erkennen und bestimmte Funktionen bereitzustellen.
              </p>
            </section>
            
            <section className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Arten von Cookies, die wir verwenden</h2>
              
              <p className="mb-4 text-gray-300">
                Wir verwenden verschiedene Arten von Cookies auf unserer Website:
              </p>
              
              <div className="mb-4 text-gray-300">
                <h3 className="text-xl font-semibold mb-2">Notwendige Cookies</h3>
                <p className="mb-2">
                  Diese Cookies sind für den Betrieb unserer Website unerlässlich. Sie ermöglichen grundlegende Funktionen 
                  wie Seitennavigation und Zugriff auf sichere Bereiche der Website. Die Website kann ohne diese Cookies 
                  nicht richtig funktionieren.
                </p>
              </div>
              
              <div className="mb-4 text-gray-300">
                <h3 className="text-xl font-semibold mb-2">Präferenz-Cookies</h3>
                <p className="mb-2">
                  Diese Cookies ermöglichen es der Website, sich an Informationen zu erinnern, die das Verhalten oder das 
                  Erscheinungsbild der Website verändern, wie Ihre bevorzugte Sprache oder die Region, in der Sie sich befinden.
                </p>
              </div>
              
              <div className="mb-4 text-gray-300">
                <h3 className="text-xl font-semibold mb-2">Statistik-Cookies</h3>
                <p className="mb-2">
                  Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, indem sie Informationen 
                  anonym sammeln und melden. Sie helfen uns, die Nutzung unserer Website zu analysieren und zu verbessern.
                </p>
              </div>
              
              <div className="mb-4 text-gray-300">
                <h3 className="text-xl font-semibold mb-2">Marketing-Cookies</h3>
                <p className="mb-2">
                  Diese Cookies werden verwendet, um Besucher auf Websites zu verfolgen. Die Absicht ist, Anzeigen zu schalten, 
                  die für den einzelnen Nutzer relevant und ansprechend sind und daher für Publisher und Drittanbieter wertvoller sind.
                </p>
              </div>
            </section>
            
            <section className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Cookies von Drittanbietern</h2>
              
              <p className="mb-4 text-gray-300">
                Zusätzlich zu unseren eigenen Cookies verwenden wir auch Cookies von Drittanbietern, um die Nutzung unserer 
                Website zu analysieren, die Benutzerfreundlichkeit zu verbessern und zu Marketingzwecken. Zu diesen Drittanbietern 
                gehören:
              </p>
              
              <ul className="list-disc list-inside mb-4 text-gray-300 pl-4">
                <li className="mb-2">Google Analytics (Analysedienst)</li>
                <li className="mb-2">Google Ads (Marketingdienst)</li>
                <li className="mb-2">Facebook (Marketingdienst)</li>
                <li className="mb-2">Hotjar (Analysedienst)</li>
              </ul>
              
              <p className="mb-4 text-gray-300">
                Diese Drittanbieter können Ihre personenbezogenen Daten für ihre eigenen Zwecke verwenden, wie z.B. für 
                zielgerichtete Werbung oder das Erstellen von Profilen. Bitte beachten Sie die Datenschutzrichtlinien 
                dieser Drittanbieter für weitere Informationen.
              </p>
            </section>
            
            <section className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Cookie-Verwaltung</h2>
              
              <p className="mb-4 text-gray-300">
                Sie können Ihre Cookie-Einstellungen jederzeit ändern. Die meisten Webbrowser akzeptieren Cookies automatisch, 
                aber Sie können Ihren Browser in der Regel so einstellen, dass er Cookies ablehnt, wenn Sie dies bevorzugen.
              </p>
              
              <p className="mb-4 text-gray-300">
                Sie können Cookies in Ihrem Browser löschen oder blockieren, indem Sie die Einstellungen in Ihrem Browser ändern. 
                Bitte beachten Sie, dass das Blockieren oder Löschen von Cookies die Funktionalität unserer Website beeinträchtigen 
                kann.
              </p>
              
              <p className="mb-4 text-gray-300">
                Hier finden Sie Anleitungen zum Verwalten von Cookies in den gängigsten Browsern:
              </p>
              
              <ul className="list-disc list-inside mb-4 text-gray-300 pl-4">
                <li className="mb-2">
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                    Google Chrome
                  </a>
                </li>
                <li className="mb-2">
                  <a href="https://support.mozilla.org/de/kb/cookies-erlauben-und-ablehnen" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                    Mozilla Firefox
                  </a>
                </li>
                <li className="mb-2">
                  <a href="https://support.microsoft.com/de-de/microsoft-edge/cookies-in-microsoft-edge-löschen-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                    Microsoft Edge
                  </a>
                </li>
                <li className="mb-2">
                  <a href="https://support.apple.com/de-de/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                    Safari
                  </a>
                </li>
              </ul>
            </section>
            
            <section className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Änderungen an unserer Cookie-Richtlinie</h2>
              
              <p className="mb-4 text-gray-300">
                Wir behalten uns das Recht vor, diese Cookie-Richtlinie jederzeit zu ändern. Alle Änderungen werden auf 
                dieser Seite veröffentlicht. Wenn die Änderungen erheblich sind, werden wir Sie über einen auffälligen 
                Hinweis auf unserer Website informieren.
              </p>
              
              <p className="mb-4 text-gray-300">
                Datum der letzten Aktualisierung: 01.12.2023
              </p>
            </section>
            
            <section className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Kontakt</h2>
              
              <p className="mb-4 text-gray-300">
                Wenn Sie Fragen zu unserer Cookie-Richtlinie haben, kontaktieren Sie uns bitte unter:
              </p>
              
              <p className="mb-4 text-gray-300">
                CT Studio<br />
                Flurweg 13<br />
                93527 Aholming<br />
                Deutschland<br /><br />
                E-Mail: kundenservice@ct-studio.store<br />
                Telefon: +49 (0) 123 456789
              </p>
            </section>
            
            <div className="text-center mt-12">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple-600 hover:bg-purple-700 text-white h-10 px-4 py-2"
              >
                Zurück zur Startseite
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 