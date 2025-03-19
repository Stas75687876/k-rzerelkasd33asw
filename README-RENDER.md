# Deployment auf Render.com

Dieses Next.js-Projekt kann leicht auf [Render.com](https://render.com) deployt werden.

## Voraussetzungen

1. Ein Render.com-Konto
2. Ein GitHub-Repository mit dem Projektcode

## Schritte zum Deployment

1. Melden Sie sich bei Render.com an
2. Klicken Sie auf "New" und wählen Sie "Web Service"
3. Verbinden Sie Ihr GitHub-Repository
4. Verwenden Sie die folgenden Einstellungen:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Starter (oder höher)

## Umgebungsvariablen

Fügen Sie die folgenden Umgebungsvariablen in den Render-Einstellungen hinzu:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Ihr Stripe Public Key
- `STRIPE_SECRET_KEY`: Ihr Stripe Secret Key
- `DATABASE_URL`: Ihre Neon Database URL

## Automatisches Deployment

Render unterstützt automatisches Deployment bei jedem Push in den main/master-Branch.

## Datenbank

Für die Datenbank empfehlen wir, [Neon](https://neon.tech) als PostgreSQL-Datenbank zu verwenden, da sie eine gute Integration mit Render bietet. 