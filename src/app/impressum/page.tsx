'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Impressum
          </h1>
          
          <div className="space-y-8">
            <section className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Angaben gemäß § 5 TMG</h2>
              
              <p className="mb-4 text-gray-300">
                CT Studio<br />
                Flurweg 13<br />
                93527 Aholming<br />
                Deutschland
              </p>
              
              <p className="mb-4 text-gray-300">
                <strong>Handelsregister:</strong><br />
                HRB 123456<br />
                Amtsgericht Musterstadt
              </p>
              
              <p className="mb-4 text-gray-300">
                <strong>Umsatzsteuer-ID:</strong><br />
                DE123456789
              </p>
            </section>
            
            <section className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Kontakt</h2>
              
              <p className="mb-4 text-gray-300">
                Telefon: +49 (0) 123 456789<br />
                E-Mail: kundenservice@ct-studio.store
              </p>
            </section>
            
            <section className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Vertretungsberechtigte</h2>
              
              <p className="mb-4 text-gray-300">
                <strong>Geschäftsinhaber:</strong><br />
                Christian Stasiczek
              </p>
            </section>
            
            <section className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
              
              <p className="mb-4 text-gray-300">
                Christian Stasiczek<br />
                Flurweg 13<br />
                93527 Aholming<br />
                Deutschland
              </p>
            </section>
            
            <section className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Haftungsausschluss</h2>
              
              <h3 className="text-xl font-semibold mb-2">Haftung für Inhalte</h3>
              <p className="mb-4 text-gray-300">
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den 
                allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht 
                verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen 
                zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
              <p className="mb-4 text-gray-300">
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen 
                Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt 
                der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden 
                Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
              </p>
              
              <h3 className="text-xl font-semibold mb-2">Haftung für Links</h3>
              <p className="mb-4 text-gray-300">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
                Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der 
                verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten 
                Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige 
                Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
              </p>
              <p className="mb-4 text-gray-300">
                Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte 
                einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige 
                Links umgehend entfernen.
              </p>
              
              <h3 className="text-xl font-semibold mb-2">Urheberrecht</h3>
              <p className="mb-4 text-gray-300">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen 
                Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der 
                Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. 
                Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
              </p>
              <p className="mb-4 text-gray-300">
                Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter 
                beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine 
                Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden 
                von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
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