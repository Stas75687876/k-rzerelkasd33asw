import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WOWWeb - Beeindruckende Websites mit WOW-Effekt",
  description: "Wir erstellen hochwertige, moderne Websites mit WOW-Effekt, die Ihre Kunden begeistern werden.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth">
      <body className={`${inter.className} bg-black`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
