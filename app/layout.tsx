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
  metadataBase: new URL("https://jardinesdelsurcancun.mx"),
  title: {
    default: "Jardines del Sur Cancún | Casas y Departamentos en Polígono Sur",
    template: "%s | Jardines del Sur Cancún",
  },
  description:
    "Casas y departamentos en Polígono Sur Cancún con respaldo de Grupo Sadasi y Altta Homes. Conoce Jardines del Sur 6, La Rioja 2 y Lirios Residencial 2.",
  applicationName: "Jardines del Sur Cancún",
  keywords: [
    "casas en venta en Cancún",
    "departamentos en Cancún",
    "Polígono Sur Cancún",
    "Jardines del Sur 6",
    "La Rioja 2 Cancún",
    "Lirios Residencial 2",
    "Grupo Sadasi Cancún",
    "Altta Homes Cancún",
  ],
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "56V8fWzyWT3rfN3-l9RNvaDx5c29znVGDubsdArLYys",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://jardinesdelsurcancun.mx",
    siteName: "Jardines del Sur Cancún",
    title: "Jardines del Sur Cancún | Casas y Departamentos en Polígono Sur",
    description:
      "Modelos y precios de Jardines del Sur 6, La Rioja 2 y Lirios Residencial 2 con atención directa por WhatsApp.",
    images: [
      {
        url: "/jardines/Imagnes de amenidades y hero/alberca.webp",
        width: 1200,
        height: 630,
        alt: "Amenidades residenciales en Cancún",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jardines del Sur Cancún | Casas y Departamentos",
    description:
      "Inventario actualizado de desarrollos en Polígono Sur Cancún con respaldo de Grupo Sadasi.",
    images: ["/jardines/Imagnes de amenidades y hero/alberca.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
          href="/optimized/hero/alberca-mobile.webp"
          type="image/webp"
          media="(max-width: 767px)"
        />
        <link
          rel="preload"
          as="image"
          href="/optimized/hero/alberca-desktop.webp"
          type="image/webp"
          media="(min-width: 768px)"
        />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
