# WOWWeb - Beeindruckende Websites mit WOW-Effekt

Eine moderne, hochperformante Website mit WOW-Effekt, Admin-Panel und Stripe-Integration. Gebaut mit Next.js, TailwindCSS, Framer Motion, GSAP und Shadcn UI.

![WOWWeb Screenshot](/public/screenshot.jpg)

## ⚠️ Wichtiger Hinweis zu Stripe-Schlüsseln

**Achtung:** Dieses Projekt ist mit **Stripe Live-API-Schlüsseln** konfiguriert. Dies bedeutet:

- Alle Transaktionen sind **echte Zahlungen**
- Kreditkarten werden tatsächlich belastet
- Bestellungen erscheinen in Ihrem Stripe-Dashboard

Für Entwicklungs- und Testzwecke empfehlen wir dringend, auf Stripe-Testschlüssel umzustellen:

1. Besuchen Sie das [Stripe Dashboard](https://dashboard.stripe.com/)
2. Schalten Sie in den Testmodus um
3. Kopieren Sie die Testschlüssel und aktualisieren Sie die `.env.local`-Datei

Eine Test-Checkout-Seite ist unter `/testshop` verfügbar.

## 🚀 Features

- **Responsive Design**: Perfekt auf allen Geräten
- **Performance-optimiert**: Schnelle Ladezeiten dank Next.js
- **WOW-Effekte**: Beeindruckende Animationen mit GSAP und Framer Motion
- **Shop-Funktionalität**: Produktkatalog mit Stripe-Integration
- **Admin-Panel**: Verwalten von Produkten, Bestellungen und mehr
- **Moderne UI-Komponenten**: Mit Shadcn UI und TailwindCSS

## 🔧 Technologie-Stack

- **Frontend**: Next.js, React, TailwindCSS
- **UI-Komponenten**: Shadcn UI
- **Animationen**: Framer Motion, GSAP
- **Payment**: Stripe API
- **Hosting**: Vercel (empfohlen)

## 📦 Installation

1. Repository klonen:
   ```bash
   git clone https://github.com/yourusername/wowweb.git
   cd wowweb
   ```

2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```

3. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```

4. Browser öffnen und zu [http://localhost:3000](http://localhost:3000) navigieren

## 💳 Stripe Integration einrichten

1. Erstellen Sie ein [Stripe-Konto](https://stripe.com)
2. Kopieren Sie Ihre API-Schlüssel
3. Erstellen Sie eine `.env.local`-Datei im Hauptverzeichnis und fügen Sie Ihre Schlüssel hinzu:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   STRIPE_SECRET_KEY=sk_test_your_key
   ```

## 🔐 Admin-Panel

Das Admin-Panel ermöglicht die Verwaltung von Produkten, Bestellungen und Kunden sowie die Überwachung des Datenbankstatus. Das Panel ist mit einer einfachen Authentifizierung geschützt.

### Funktionen des Admin-Panels:

1. **Produktverwaltung**
   - Produkte hinzufügen, bearbeiten und löschen
   - Produkte als "featured" markieren
   - Produktbilder hochladen

2. **Bestellungsverwaltung**
   - Bestellungen anzeigen und filtern
   - Bestellstatus aktualisieren (ausstehend, in Bearbeitung, abgeschlossen, storniert)
   - Detailansicht mit allen Bestellpositionen

3. **Kundenverwaltung**
   - Kundeninformationen anzeigen
   - Bestellhistorie einsehen
   - Kommunikation mit Kunden

4. **Datenbankstatus**
   - Verbindungsstatus überwachen
   - Tabelleninformationen anzeigen
   - Datenbank synchronisieren

### Zugriff auf das Admin-Panel:

1. Navigiere zu `/admin` in deinem Browser
2. Melde dich mit den Anmeldedaten an (für Demozwecke: `admin@example.com` / `adminpassword`)
3. Die Anmeldedaten können in der `.env.local` Datei konfiguriert werden:
   ```
   ADMIN_EMAIL=dein-admin@email.com
   ADMIN_PASSWORD=dein-sicheres-passwort
   ```

In einer Produktionsumgebung sollte eine sicherere Authentifizierungsmethode verwendet werden.

## 🖼️ Bilder und Assets

Platzieren Sie Ihre Bilder im `/public`-Verzeichnis:
- `/public/hero-bg.jpg` für den Hero-Bereich
- `/public/product-1.jpg`, `/public/product-2.jpg`, etc. für Shop-Produkte
- Zahlungs-Icons: `/public/visa.svg`, `/public/mastercard.svg`, etc.

## 🚀 Deployment

Diese Website ist optimiert für Vercel-Deployment:

```bash
npm run build
vercel deploy
```

## 📝 Anpassungen

- Farben und Design können in der `globals.css` und den Komponenten angepasst werden
- Produkte können im Admin-Panel verwaltet werden
- Für zusätzliche Funktionen kann das Projekt einfach erweitert werden

## 📄 Lizenz

MIT

## 🏁 Inbetriebnahme dieses Projekts

1. Klone das Repository und wechsle in das Projektverzeichnis

2. Installiere die Abhängigkeiten:
   ```bash
   npm install
   ```

3. Kopiere die Beispiel-Umgebungsvariablen und passe sie an:
   ```bash
   cp .env.local.example .env.local
   ```
   (Bearbeite `.env.local` und trage deine eigenen Stripe-API-Schlüssel ein)

4. Starte den Entwicklungsserver:
   ```bash
   npm run dev
   ```

5. Öffne deinen Browser und gehe zu [http://localhost:3000](http://localhost:3000)

## 🖼️ Platzhalterbilder

Die Anwendung verwendet eine eigene Platzhalterbilder-API für die Entwicklung:

- Hero-Bild: `/api/placeholder?width=1920&height=1080&text=Hero-Bild`
- Produktbilder: `/api/placeholder?width=800&height=600&text=Produkt%201`

In der Produktionsumgebung sollten diese durch echte Bilder ersetzt werden.

## 📑 Ordnerstruktur

```
neu-website/
├── public/          # Statische Dateien (Bilder, Favicon, etc.)
├── src/             # Quellcode
│   ├── app/         # App-Router und Seiten
│   ├── components/  # UI-Komponenten
│   ├── lib/         # Hilfsklassen und Funktionen
│   └── styles/      # CSS-Dateien
└── ...              # Konfigurationsdateien
```

## GitHub-Upload und Deployment

Dieses Projekt enthält Werkzeuge, um den Upload auf GitHub und das Deployment auf Render.com zu erleichtern:

1. **GitHub-Upload-Anleitung**: Die Datei `GITHUB-UPLOAD.md` enthält detaillierte Anweisungen zum Hochladen des Projekts auf GitHub.

2. **Automatisiertes Upload-Skript**: Die Datei `upload-to-github.bat` ist ein Windows-Batch-Skript, das den Upload-Prozess automatisiert. Führen Sie es einfach aus und folgen Sie den Anweisungen.

3. **Render.com-Konfiguration**: Die Datei `render.yaml` enthält die Konfiguration für das Deployment auf Render.com. Sie enthält optimierte Einstellungen für die Bereitstellung dieser Next.js-Anwendung.

4. **Health-Check-Endpunkt**: Ein Gesundheitscheck-Endpunkt `/api/health` wurde hinzugefügt, um die Verfügbarkeit des Dienstes zu überwachen.

### Schritte zum Deployment

1. Laden Sie das Projekt auf GitHub hoch, indem Sie entweder:
   - Die Anweisungen in `GITHUB-UPLOAD.md` befolgen
   - Das `upload-to-github.bat`-Skript ausführen

2. Registrieren Sie sich bei [Render.com](https://render.com) und verbinden Sie Ihr GitHub-Repository.

3. Render.com erkennt automatisch die `render.yaml`-Datei und konfiguriert den Dienst entsprechend.

4. Setzen Sie die erforderlichen Umgebungsvariablen in den Render.com-Einstellungen.

5. Starten Sie den Deployment-Prozess und überwachen Sie ihn in der Render.com-Konsole.

Weitere Informationen finden Sie in der Datei `README-RENDER.md`.

---

Entwickelt mit ❤️ für atemberaubende Web-Erlebnisse
