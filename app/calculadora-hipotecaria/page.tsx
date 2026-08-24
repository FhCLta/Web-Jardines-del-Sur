import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FooterPhoneContact from "@/components/FooterPhoneContact";
import FooterSocial from "@/components/FooterSocial";
import ContactNavBtn from "@/components/ContactNavBtn";
import MortgageCalculator from "@/components/MortgageCalculator";
import pageStyles from "@/app/page.module.css";
import styles from "./calculadora.module.css";
// Via getInventory (no leyendo inventory.json directo) para que los precios
// salgan de data/precios.json, la misma fuente que alimenta al cotizador.
import { getInventory } from "@/app/(desarrollos)/_lib/model-utils";
import { SITE_URL } from "@/lib/site";

const PHONE_E164 = "529982059044";
const OFFICE_ADDRESS = "Av. 127 SM 342 MZ 27, 77536 Cancún, Q.R.";
const OFFICE_MAP_URL = "https://maps.app.goo.gl/9sKBR1fUNSswv5d19";
const PAGE_URL = `${SITE_URL}/calculadora-hipotecaria`;
const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(
  "Hola, quiero más información sobre casas y departamentos en Cancún."
)}`;

const metaTitle =
  "Calculadora Hipotecaria Cancún · ¿Cuánto pagarías al mes? | Altta Homes";
const metaDescription =
  "Calcula tu mensualidad estimada para comprar casa o departamento en Cancún: elige el modelo, ajusta enganche, plazo y tasa. Incluye seguros, gastos iniciales e ingreso sugerido. Gratis y sin registro.";

export const metadata: Metadata = {
  title: { absolute: metaTitle },
  description: metaDescription,
  keywords: [
    "calculadora hipotecaria cancún",
    "calculadora de mensualidad casa",
    "cuánto pago al mes por una casa en cancún",
    "crédito hipotecario cancún",
    "mensualidad casa cancún",
  ],
  alternates: { canonical: "/calculadora-hipotecaria" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: PAGE_URL,
    siteName: "Altta Homes Cancún",
    title: metaTitle,
    description: metaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: metaTitle,
    description: metaDescription,
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

type InventoryItem = {
  id: string;
  development: string;
  nombre_modelo: string;
  precio: number;
  valor_avaluo?: number;
  precio_variable?: boolean;
  status?: string;
};

export default function Page() {
  const models = (getInventory() as unknown as InventoryItem[])
    .filter((p) => typeof p.precio === "number" && p.precio > 0)
    .map((p) => ({
      id: p.id,
      name: p.nombre_modelo,
      dev: p.development,
      price: p.precio,
      avaluo: p.valor_avaluo,
      variablePrice: p.precio_variable === true,
    }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: metaTitle,
        description: metaDescription,
        inLanguage: "es-MX",
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Calculadora hipotecaria",
            item: PAGE_URL,
          },
        ],
      },
    ],
  };

  return (
    <div className={styles.wrapper}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SiteHeader />

      <header className={styles.head}>
        <div className="container">
          <span className={styles.eyebrow}>Cotización estimada · Altta Homes Cancún</span>
          <h1>¿Cuánto pagarías al mes por tu casa en Cancún?</h1>
          <p>
            Elige el modelo y conoce tu mensualidad estimada en segundos. La
            mayoría de nuestros modelos aplican para estrenar{" "}
            <strong>sin enganche</strong> gracias al crédito sobre avalúo.
            Gratis, sin registro y sin compromiso.
          </p>
        </div>
      </header>

      <section className={styles.calcSection}>
        <div className="container">
          <MortgageCalculator models={models} />
        </div>
      </section>

      <section className={styles.content}>
        <div className="container">
          <div className={styles.contentInner}>
            <h2>¿Cómo funciona esta cotización?</h2>
            <p>
              Usamos la misma fórmula de amortización que emplean los bancos en
              México y la calibramos con simuladores reales de la banca (2026).
              El resultado incluye el pago del crédito más una estimación de
              seguros y accesorios, para que el número que ves se parezca al que
              te dará el banco — no a uno de comercial.
            </p>

            <h2>Valor de avalúo y precio neto: cuál es cuál</h2>
            <p>
              Son dos palabras que se usan todo el tiempo en una compra y casi
              nadie explica. Con estas dos entiendes cualquier cotización:
            </p>
            <ul className={styles.glossary}>
              <li>
                <strong>Valor de avalúo</strong> — lo que la vivienda vale en el
                mercado según un perito autorizado. Es un documento formal, y{" "}
                <strong>
                  es sobre este valor que el banco decide cuánto te presta
                </strong>
                . También se le dice valor comercial. No es lo que tú pagas.
              </li>
              <li>
                <strong>Precio neto</strong> — lo que realmente te cuesta la
                propiedad: el precio que te da el desarrollador, ya con
                descuentos y promociones aplicados, o el que acuerdas en una
                compra directa. Es el número que importa para tu bolsillo y el
                que usamos en esta calculadora.
              </li>
            </ul>
            <p>
              ¿No conoces el avalúo de la vivienda que te interesa?{" "}
              <strong>Es normal</strong>: el avalúo formal lo realiza un perito
              durante el trámite del crédito. Para nuestros modelos, esta
              calculadora usa valores de avalúo recientes de cada vivienda, para
              que el ejercicio tenga coherencia y formalidad.
            </p>

            <h2>¿Cómo es posible estrenar sin enganche?</h2>
            <p>
              El banco no presta sobre el precio que tú pagas: presta sobre el{" "}
              <strong>valor avalúo</strong>, que es el{" "}
              <strong>valor comercial</strong> de la vivienda — lo que la casa
              realmente vale en el mercado, determinado por un perito
              independiente, no por nosotros.
            </p>
            <p>
              Y aquí está la clave: en nuestros desarrollos{" "}
              <strong>ese valor comercial es mayor que el precio de venta</strong>.
              Como el banco financia hasta el 90% del avalúo, ese 90% suele
              alcanzar para cubrir el precio completo{" "}
              <strong>y además los gastos de escrituración</strong>. Por eso
              estrenas sin enganche — y con plusvalía desde el día que firmas,
              porque tu casa vale más de lo que pagaste por ella.
            </p>

            <h2>Gastos de escrituración incluidos en el cálculo</h2>
            <p>
              Comprar vivienda implica gastos de escrituración, impuestos,
              avalúo y trámites que en la práctica llegan a ser alrededor del
              8.5% del valor de avalúo. Esta cotización ya los incluye — y en
              la mayoría de nuestros modelos el propio crédito los cubre, para
              que planees tu compra completa, sin sorpresas.
            </p>

            <h2>¿Y si tengo Infonavit?</h2>
            <p>
              Puedes combinar tu crédito Infonavit con un crédito bancario
              (cofinanciamiento) para ampliar tu poder de compra. En Jardines
              del Sur 6 y Lirios Residencial 2 aceptamos Infonavit, bancario y
              cofinanciamiento; La Rioja 2 se maneja con crédito bancario.
            </p>
            <a className={styles.inlineCta} href="/blog/comprar-casa-con-infonavit-en-cancun-2026">
              Guía: comprar con Infonavit en Cancún
            </a>{" "}
            <a className={styles.inlineCta} href="/blog/comprar-casa-con-credito-bancario-en-cancun-2026">
              Guía: crédito bancario en Cancún
            </a>

            <h2>¿Qué tan cerca está este número del real?</h2>
            <p>
              Cerca, pero conviene que sepas exactamente de qué depende. El{" "}
              <strong>monto exacto de tu crédito no se define aquí ni te lo
              puede prometer nadie</strong>: lo determina el banco cuando haces
              tu trámite y te entrega tu{" "}
              <strong>tabla de amortización real</strong>, ya con tu perfil, tus
              ingresos, tu historial crediticio y la tasa que te autorice esa
              institución.
            </p>
            <p>
              Mientras llegas a ese punto, no tienes que quedarte con una
              estimación:{" "}
              <strong>
                podemos compartirte tablas de amortización con las mensualidades
                reales de los bancos
              </strong>{" "}
              para el modelo que te interesa. Vas a ver que se parecen mucho a
              lo que acabas de calcular aquí — esta herramienta está construida
              con las mismas fórmulas y los mismos factores que usa la banca.
            </p>

            <h2>El siguiente paso</h2>
            <p>
              Uno de nuestros ejecutivos te prepara una{" "}
              <strong>cotización exacta</strong> con las tablas de los bancos
              que apliquen a tu caso y las promociones vigentes, sin costo ni
              compromiso. Escríbenos por WhatsApp con el resultado que te dio la
              calculadora y te la preparamos el mismo día.
            </p>
          </div>
        </div>
      </section>

      <footer id="contacto" className={pageStyles.footer}>
        <div className={`container ${pageStyles.footerGrid}`}>
          <div className={pageStyles.footerBrand}>
            <h2>
              Altta<span>Homes</span>
            </h2>
            <span className={pageStyles.footerTagline}>by Grupo Sadasi · Cancún</span>
            <p>
              50 años de trayectoria ininterrumpida, 430,000 viviendas entregadas y el respaldo de la primera desarrolladora mexicana certificada{" "}
              <em style={{ whiteSpace: "nowrap" }}>Best Place to Live</em>.
            </p>
            <a href={waHref} target="_blank" rel="noreferrer" className={pageStyles.footerBrandCta}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Informes por WhatsApp
            </a>
          </div>
          <div className={pageStyles.footerLinks}>
            <h3>Navegación</h3>
            <ul>
              <li><a href="/">Inicio</a></li>
              <li><a href="/jardines-del-sur-cancun">Jardines del Sur Cancún</a></li>
              <li><a href="/jardines-del-sur-6">Jardines del Sur 6</a></li>
              <li><a href="/promociones">Promociones</a></li>
              <li><a href="/la-rioja-2">La Rioja 2</a></li>
              <li><a href="/lirios-residencial-2">Lirios Residencial 2</a></li>
              <li><a href="/jardines-del-sur-7">Jardines del Sur 7 · Próximamente</a></li>
              <li><a href="/preguntas-frecuentes">Preguntas Frecuentes</a></li>
              <li><a href="/calculadora-hipotecaria">Calculadora</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/precios">Precios</a></li>
              <li><ContactNavBtn /></li>
            </ul>
          </div>
          <div className={pageStyles.footerContact}>
            <h3>Contacto</h3>
            <div className={pageStyles.footerContactItem}>
              <span className={pageStyles.footerContactIcon}>📍</span>
              <a href={OFFICE_MAP_URL} target="_blank" rel="noreferrer">{OFFICE_ADDRESS}</a>
            </div>
            <div className={pageStyles.footerContactItem}>
              <span className={pageStyles.footerContactIcon}>📞</span>
              <FooterPhoneContact />
            </div>
          </div>
        </div>
        <div className={pageStyles.footerBottom}>
          <p>&copy; 2026 Altta Homes by Grupo Sadasi. Todos los derechos reservados.</p>
          <FooterSocial />
        </div>
      </footer>

      <FloatingWhatsApp />
    </div>
  );
}
