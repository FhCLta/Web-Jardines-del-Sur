import type { Metadata } from "next";
import { Montserrat, Lato, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Altta Homes Cancún | Casas y Departamentos en Venta",
    template: "%s | Altta Homes Cancún",
  },
  description:
    "Casas y departamentos con alta plusvalía en la Zona Sur de Cancún: Jardines del Sur 6, La Rioja 2, Lirios Residencial 2 y Jardines del Sur 7 (próxima apertura). Chatea con un asesor autorizado de Altta Homes. Crédito bancario e Infonavit.",
  applicationName: "Altta Homes Cancún",
  keywords: [
    "casas en venta en Cancún",
    "departamentos en Cancún",
    "Zona Sur Cancún",
    "Jardines del Sur 6",
    "La Rioja 2 Cancún",
    "Lirios Residencial 2",
    "Jardines del Sur 7",
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
    url: SITE_URL,
    siteName: "Altta Homes Cancún",
    title: "Altta Homes Cancún | Casas y Departamentos en Venta",
    description:
      "Casas y departamentos con alta plusvalía en la Zona Sur de Cancún: Jardines del Sur 6, La Rioja 2, Lirios Residencial 2 y Jardines del Sur 7 (próxima apertura). Chatea con un asesor autorizado de Altta Homes. Crédito bancario e Infonavit.",
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
    title: "Altta Homes Cancún | Casas y Departamentos en Venta",
    description:
      "Casas y departamentos con alta plusvalía en la Zona Sur de Cancún: Jardines del Sur 6, La Rioja 2, Lirios Residencial 2 y Jardines del Sur 7. Crédito bancario e Infonavit.",
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
        {/* Navegador interno de FB/IG (iOS): aplica el Dynamic Type del sistema y el
            texto se infla; Chrome/Safari lo ignoran. Solo en ese WebView: se desactiva
            el auto-ajuste y se compensa la inflación medida. No toca el pinch-zoom. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var ua=navigator.userAgent||"";if(!/FBAN|FBAV|FB_IAB|Instagram/i.test(ua))return;var d=document.documentElement;d.classList.add("meta-inapp");var p=document.createElement("div");p.style.cssText="font:-apple-system-body;position:absolute;visibility:hidden";d.appendChild(p);var s=parseFloat(getComputedStyle(p).fontSize);d.removeChild(p);if(s>17.5){d.style.fontSize=(17/s*92).toFixed(1)+"%";}}catch(e){}})();`,
          }}
        />
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
