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
            __html: `(function(){try{var ua=navigator.userAgent||"";var isMeta=/FBAN|FBAV|FB_IAB|Instagram/i.test(ua);var d=document.documentElement;var ratio=1,probe=0;
var measure=function(){try{var t="mmmmmmmmmmmmmmmmmmmm";var sp=document.createElement("span");sp.style.cssText="position:absolute;visibility:hidden;font:16px sans-serif;white-space:nowrap;letter-spacing:0";sp.textContent=t;d.appendChild(sp);var w=sp.getBoundingClientRect().width;d.removeChild(sp);var c=document.createElement("canvas").getContext("2d");c.font="16px sans-serif";var cw=c.measureText(t).width;if(cw>0&&w>0)ratio=w/cw;}catch(e){}};
if(isMeta){d.classList.add("meta-inapp");measure();var p=document.createElement("div");p.style.cssText="font:-apple-system-body;position:absolute;visibility:hidden";d.appendChild(p);probe=parseFloat(getComputedStyle(p).fontSize)||0;d.removeChild(p);var f=ratio;if(probe>17.5)f=Math.max(f,probe/17);if(f>1.04){d.style.fontSize=(100/f).toFixed(1)+"%";d.style.setProperty("--mz",(1/f).toFixed(4));}}
if(/debugmeta/.test(location.search)){if(!isMeta)measure();var show=function(){if(document.getElementById("dbgmeta"))return;var b=document.createElement("div");b.id="dbgmeta";b.style.cssText="position:fixed;left:8px;bottom:8px;right:8px;z-index:2147483647;background:#000;color:#0f0;font:12px/1.5 monospace;padding:10px;border-radius:8px;word-break:break-all;opacity:.95";b.textContent="meta="+isMeta+" ratio="+ratio.toFixed(3)+" probe="+probe+" htmlFont="+getComputedStyle(d).fontSize+" innerW="+window.innerWidth+" dpr="+(window.devicePixelRatio||1)+" UA:"+ua;(document.body||d).appendChild(b);};if(document.readyState!=="loading")show();else document.addEventListener("DOMContentLoaded",show);setTimeout(show,2500);}}catch(e){}})();`,
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
