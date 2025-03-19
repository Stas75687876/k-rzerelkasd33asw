import { NextRequest, NextResponse } from 'next/server';

// Funktion zum Generieren zufälliger Farben
function getRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 80%, 50%)`;
}

// Generiere eine SVG mit Platzhaltertext
export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  // Parameter für das Bild
  const width = searchParams.get('width') || '800';
  const height = searchParams.get('height') || '600';
  const text = searchParams.get('text') || 'Placeholder';
  const bgColor = searchParams.get('bg') || getRandomColor();
  const textColor = searchParams.get('color') || 'white';
  
  // SVG-Template erstellen
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}" />
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial, sans-serif" 
        font-size="24" 
        fill="${textColor}" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >
        ${text}
      </text>
    </svg>
  `;
  
  // SVG als Antwort zurückgeben
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
} 