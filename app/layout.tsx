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
  description: "Descubre los mejores desarrollos inmobiliarios en Cancún: Jardines del Sur 6, La Rioja 2 y Lirios Residencial. Innovación, seguridad y plusvalía garantizada por Grupo Sadasi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} ${lato.variable} ${playfair.variable}`}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
