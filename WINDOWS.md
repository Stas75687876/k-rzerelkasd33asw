# Windows-spezifische Hinweise

Dieses Dokument enthält wichtige Informationen für Entwickler, die dieses Projekt unter Windows ausführen.

## PowerShell-Befehle

Im Gegensatz zu Bash unterstützt PowerShell nicht das `&&`-Token für die Verkettung von Befehlen. Hier sind alternative Möglichkeiten, Befehle zu verketten:

### Option 1: Semikolon verwenden

```powershell
cd neu-website; npm run dev
```

### Option 2: Pipeline verwenden

```powershell
cd neu-website | npm run dev
```

### Option 3: Separate Befehle

Führe Befehle nacheinander aus:

```powershell
cd neu-website
npm run dev
```

## Datenbank-Initialisierung

Zum Initialisieren der Datenbank:

```powershell
cd neu-website
node src/scripts/initDb.js
```

Wenn du keine Ausgabe siehst, könnte dies an einer fehlenden Umgebungsvariable liegen. Vergewissere dich, dass die Datei `.env.local` im Hauptverzeichnis existiert und die richtige `DATABASE_URL` enthält.

## Server starten

Um den Entwicklungsserver zu starten:

```powershell
cd neu-website
npm run dev
```

## Paket-Installation

Um neue Pakete zu installieren:

```powershell
cd neu-website
npm install paketname --save
```

## Git-Befehle

Git-Befehle funktionieren unter Windows ähnlich wie unter Linux/Mac:

```powershell
git add .
git commit -m "Deine Nachricht"
git push
```

## Häufige Probleme und Lösungen

### Problem: "Das Token '&&' ist kein gültiges Anweisungstrennzeichen"

**Lösung:** Verwende ein Semikolon (`;`) oder führe Befehle nacheinander aus.

### Problem: "Der Pfad kann nicht gefunden werden"

**Lösung:** Verwende absolute Pfade oder überprüfe, ob du im richtigen Verzeichnis bist, mit:

```powershell
pwd
```

### Problem: Datenbankverbindungsfehler

**Lösung:**
1. Überprüfe, ob die `.env.local`-Datei existiert und die richtige `DATABASE_URL` enthält
2. Stelle sicher, dass dotenv installiert ist: `npm install dotenv --save`
3. Öffne die API-Route `/api/db-test` im Browser, um die Verbindung zu testen

### Problem: Pakete können nicht gefunden werden

**Lösung:** Versuche, den npm-Cache zu löschen und erneut zu installieren:

```powershell
npm cache clean --force
npm install
``` 