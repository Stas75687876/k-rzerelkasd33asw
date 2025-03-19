'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Allgemeine Geschäftsbedingungen
          </h1>
          
          <div className="space-y-8">
            <section className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">1. Geltungsbereich</h2>
              
              <p className="mb-4 text-gray-300">
                1.1 Diese Allgemeinen Geschäftsbedingungen (nachfolgend "AGB") gelten für alle Verträge, die zwischen der 
                CT Studio, Flurweg 13, 93527 Aholming (nachfolgend "Anbieter") und dem Kunden (nachfolgend "Kunde") 
                geschlossen werden.
              </p>
              
              <p className="mb-4 text-gray-300">
                1.2 Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, der Anbieter stimmt ihrer 
                Geltung ausdrücklich schriftlich zu.
              </p>
            </section>
            
            <section className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">2. Vertragsgegenstand und Leistungsbeschreibung</h2>
              
              <p className="mb-4 text-gray-300">
                2.1 Der Anbieter erbringt Dienstleistungen im Bereich der Webentwicklung, Webdesign und Online-Marketing. 
                Der genaue Umfang der Dienstleistungen ergibt sich aus der jeweiligen Leistungsbeschreibung des Angebots.
              </p>
              
              <p className="mb-4 text-gray-300">
                2.2 Der Anbieter ist berechtigt, zur Erfüllung der vertraglichen Verpflichtungen Dritte als Erfüllungsgehilfen 
                einzusetzen.
              </p>
            </section>
            
            <section className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">3. Vertragsschluss</h2>
              
              <p className="mb-4 text-gray-300">
                3.1 Die Darstellung der Produkte und Dienstleistungen auf der Website stellt kein rechtlich bindendes Angebot, 
                sondern eine Aufforderung zur Abgabe eines Angebots dar.
              </p>
              
              <p className="mb-4 text-gray-300">
                3.2 Der Vertrag kommt zustande, wenn der Anbieter das Angebot des Kunden durch eine Auftragsbestätigung 
                annimmt oder mit der Ausführung der Leistung beginnt.
              </p>
            </section>
            
            <section className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">4. Preise und Zahlungsbedingungen</h2>
              
              <p className="mb-4 text-gray-300">
                4.1 Alle Preise verstehen sich in Euro und zuzüglich der gesetzlichen Mehrwertsteuer, sofern nicht anders angegeben.
              </p>
              
              <p className="mb-4 text-gray-300">
                4.2 Die Zahlung erfolgt per Vorkasse, Rechnung oder über die auf der Website angebotenen Zahlungsmethoden. 
                Der Anbieter behält sich vor, bestimmte Zahlungsarten auszuschließen.
              </p>
              
              <p className="mb-4 text-gray-300">
                4.3 Bei Zahlungsverzug ist der Anbieter berechtigt, Verzugszinsen in Höhe von 9 Prozentpunkten über dem 
                Basiszinssatz zu berechnen. Die Geltendmachung eines höheren Verzugsschadens bleibt vorbehalten.
              </p>
            </section>
            
            <section className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">5. Lieferung und Leistungserbringung</h2>
              
              <p className="mb-4 text-gray-300">
                5.1 Liefertermine oder -fristen sind unverbindlich, sofern sie nicht ausdrücklich als verbindlich vereinbart wurden.
              </p>
              
              <p className="mb-4 text-gray-300">
                5.2 Der Anbieter ist zu Teillieferungen berechtigt, soweit dies für den Kunden zumutbar ist.
              </p>
              
              <p className="mb-4 text-gray-300">
                5.3 Liefer- und Leistungsverzögerungen aufgrund höherer Gewalt und aufgrund von Ereignissen, die dem Anbieter 
                die Lieferung oder Leistung wesentlich erschweren oder unmöglich machen, hat der Anbieter auch bei verbindlich 
                vereinbarten Fristen nicht zu vertreten.
              </p>
            </section>
            
            <section className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">6. Mitwirkungspflichten des Kunden</h2>
              
              <p className="mb-4 text-gray-300">
                6.1 Der Kunde ist verpflichtet, dem Anbieter alle für die Durchführung des Auftrags erforderlichen Informationen 
                und Unterlagen rechtzeitig zur Verfügung zu stellen.
              </p>
              
              <p className="mb-4 text-gray-300">
                6.2 Der Kunde ist für die Richtigkeit und Vollständigkeit der bereitgestellten Informationen und Materialien 
                verantwortlich.
              </p>
            </section>
            
            <section className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">7. Gewährleistung und Haftung</h2>
              
              <p className="mb-4 text-gray-300">
                7.1 Der Anbieter haftet nach den gesetzlichen Bestimmungen für Schäden an Leben, Körper und Gesundheit, die 
                auf einer fahrlässigen oder vorsätzlichen Pflichtverletzung des Anbieters, seiner gesetzlichen Vertreter oder 
                Erfüllungsgehilfen beruhen, sowie für Schäden, die von der Haftung nach dem Produkthaftungsgesetz umfasst werden.
              </p>
              
              <p className="mb-4 text-gray-300">
                7.2 Für Schäden, die nicht von Ziffer 7.1 erfasst werden und die auf vorsätzlichen oder grob fahrlässigen 
                Vertragsverletzungen sowie Arglist des Anbieters, seiner gesetzlichen Vertreter oder Erfüllungsgehilfen beruhen, 
                haftet der Anbieter nach den gesetzlichen Bestimmungen.
              </p>
              
              <p className="mb-4 text-gray-300">
                7.3 Der Anbieter haftet auch für Schäden, die durch einfache Fahrlässigkeit verursacht werden, soweit diese 
                Fahrlässigkeit die Verletzung solcher Vertragspflichten betrifft, deren Einhaltung für die Erreichung des 
                Vertragszwecks von besonderer Bedeutung ist (Kardinalpflichten). Der Anbieter haftet jedoch nur, soweit die 
                Schäden in typischer Weise mit dem Vertrag verbunden und vorhersehbar sind.
              </p>
              
              <p className="mb-4 text-gray-300">
                7.4 Eine weitergehende Haftung des Anbieters ist ohne Rücksicht auf die Rechtsnatur des geltend gemachten 
                Anspruchs ausgeschlossen.
              </p>
            </section>
            
            <section className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">8. Urheberrechte und Nutzungsrechte</h2>
              
              <p className="mb-4 text-gray-300">
                8.1 Alle Rechte an den vom Anbieter erstellten Werken, insbesondere Urheberrechte, verbleiben beim Anbieter, 
                soweit sie nicht ausdrücklich dem Kunden eingeräumt werden.
              </p>
              
              <p className="mb-4 text-gray-300">
                8.2 Der Anbieter räumt dem Kunden ein einfaches, nicht ausschließliches Nutzungsrecht an den erstellten Werken ein, 
                sofern nichts anderes vereinbart ist.
              </p>
              
              <p className="mb-4 text-gray-300">
                8.3 Die Weitergabe der Nutzungsrechte an Dritte bedarf der vorherigen schriftlichen Zustimmung des Anbieters.
              </p>
            </section>
            
            <section className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">9. Datenschutz</h2>
              
              <p className="mb-4 text-gray-300">
                9.1 Der Anbieter erhebt, verarbeitet und nutzt personenbezogene Daten des Kunden unter Beachtung der 
                datenschutzrechtlichen Bestimmungen.
              </p>
              
              <p className="mb-4 text-gray-300">
                9.2 Näheres regelt die Datenschutzerklärung des Anbieters, die auf der Website eingesehen werden kann.
              </p>
            </section>
            
            <section className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">10. Schlussbestimmungen</h2>
              
              <p className="mb-4 text-gray-300">
                10.1 Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
              </p>
              
              <p className="mb-4 text-gray-300">
                10.2 Erfüllungsort und ausschließlicher Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist der 
                Geschäftssitz des Anbieters, sofern der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder 
                öffentlich-rechtliches Sondervermögen ist.
              </p>
              
              <p className="mb-4 text-gray-300">
                10.3 Sollten einzelne Bestimmungen dieses Vertrages unwirksam sein oder werden, so wird dadurch die Wirksamkeit 
                der übrigen Bestimmungen nicht berührt. Die Parteien verpflichten sich, anstelle der unwirksamen Bestimmung eine 
                dieser Bestimmung möglichst nahekommende wirksame Regelung zu treffen.
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