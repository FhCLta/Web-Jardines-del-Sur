import type { Metadata } from "next";
import { Montserrat, Lato, Playfair_Display } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Stitch | Ecosistema Inmobiliario Cancún 2026",
  description: "Casas y departamentos en Cancún respaldados por Grupo Sadasi: 50 años de trayectoria, 430,000 viviendas entregadas y certificación Best Place to Live. Jardines del Sur 6, La Rioja 2 y Lirios Residencial — plusvalía anual del 15% en el Polígono Sur.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} ${lato.variable} ${playfair.variable}`}>
      <head>
        {/* Preload primera imagen del hero para mejor LCP */}
        <link
          rel="preload"
          as="image"
          href="/jardines/Imagnes%20de%20amenidades%20y%20hero/alberca.webp"
          type="image/webp"
        />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
