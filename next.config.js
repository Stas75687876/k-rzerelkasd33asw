/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Konfiguration für bessere Performance und Entwicklungserfahrung
  experimental: {
    // Optimierte Kompilierung für schnellere Builds (critters ist jetzt installiert)
    optimizeCss: true,
    // Verbesserte Typprüfung während der Entwicklung
    typedRoutes: true
  },
  // ESLint während des Builds überspringen
  eslint: {
    // Keine ESLint-Fehler während des Builds anzeigen
    ignoreDuringBuilds: true,
  },
  // TypeScript-Typprüfung überspringen (optional)
  typescript: {
    // Keine TypeScript-Fehler während des Builds anzeigen
    ignoreBuildErrors: true,
  },
  // Spezifische Konfigurationen für Entwicklungsumgebung
  webpack(config) {
    return config;
  },
}

module.exports = nextConfig 