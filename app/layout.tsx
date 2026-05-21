import type { Metadata } from "next";
import { Montserrat, Lato, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GTM_ID = "GTM-53BHDRWC";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
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
        {/* Google Tag Manager — lazyOnload para no bloquear LCP. Los clicks en wa.me
            se trackean igual porque GTM usa dataLayer con buffer interno. */}
        <Script id="gtm-init" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <main>{children}</main>
      </body>
    </html>
  );
}
