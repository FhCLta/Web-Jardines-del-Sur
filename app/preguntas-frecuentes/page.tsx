import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FooterPhoneContact from "@/components/FooterPhoneContact";
import ContactNavBtn from "@/components/ContactNavBtn";
import pageStyles from "@/app/page.module.css";
import styles from "./faq.module.css";
import { SITE_URL } from "@/lib/site";

const PHONE_E164 = "529982059044";
const OFFICE_ADDRESS = "Av. 127 SM 342 MZ 27, 77536 Cancún, Q.R.";
const OFFICE_MAP_URL = "https://maps.app.goo.gl/9sKBR1fUNSswv5d19";
const PAGE_URL = `${SITE_URL}/preguntas-frecuentes`;

const WA_MESSAGE =
  "Hola, tengo una pregunta sobre las casas y departamentos de Altta Homes en Cancún.";
const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(WA_MESSAGE)}`;

type Faq = { q: string; a: string; link?: { href: string; label: string } };

// Fuente única: alimenta tanto el acordeón visible como el schema FAQPage.
const FAQS: Faq[] = [
  {
    q: "¿Dónde están ubicados los desarrollos de Altta Homes en Cancún?",
    a: "Cada desarrollo tiene su propia ubicación dentro de la Zona Sur de Cancún, una de las zonas de mayor crecimiento y plusvalía de la ciudad, con acceso a escuelas, plazas comerciales y vialidades principales. Por ejemplo, Jardines del Sur 6 está sobre la Av. 127, La Rioja 2 sobre la Av. 135 esquina con Av. 127, y Lirios Residencial 2 sobre la Av. Robles. Te compartimos la ubicación exacta y cómo llegar al desarrollo que te interese por WhatsApp.",
  },
  {
    q: "¿Qué desarrollos tiene Altta Homes en Cancún?",
    a: "Actualmente tenemos tres desarrollos disponibles: Jardines del Sur 6 (casas y departamentos), La Rioja 2 (casas residenciales premium) y Lirios Residencial 2 (departamentos). Además, viene en camino Jardines del Sur 7, que ya está en obra.",
    link: { href: "/#modelos", label: "Ver nuestros desarrollos" },
  },
  {
    q: "¿Puedo comprar con crédito Infonavit, FOVISSSTE o bancario?",
    a: "Sí. Todos nuestros desarrollos aceptan crédito Infonavit y crédito bancario. El crédito FOVISSSTE aplica únicamente en unidades seleccionadas de Jardines del Sur 6. Un asesor puede revisar tu caso y decirte el mejor esquema según tu tipo de crédito.",
    link: {
      href: "/jardines-del-sur-6",
      label: "Ver Jardines del Sur 6",
    },
  },
  {
    q: "¿Cuánto cuestan las casas y departamentos en Cancún?",
    a: "Los precios varían según el desarrollo y el modelo. Jardines del Sur 6 inicia desde alrededor de $1.85 millones de pesos, Lirios Residencial 2 desde alrededor de $2.25 millones, y La Rioja 2 (premium) desde alrededor de $4 millones. Como los precios se actualizan, te confirmamos el precio vigente de cada modelo por WhatsApp.",
    link: { href: "/#modelos", label: "Ver modelos y precios" },
  },
  {
    q: "¿Puedo ver la vivienda antes de comprar? ¿Tienen recorridos virtuales?",
    a: "Sí. Cada modelo cuenta con recorrido virtual 360° para conocerlo desde tu celular, y puedes agendar una visita presencial a los modelos muestra sin costo ni compromiso.",
  },
  {
    q: "¿Cuánto necesito para apartar una casa o departamento?",
    a: "El apartado y el enganche dependen del modelo y del esquema de crédito que elijas. Escríbenos por WhatsApp y un asesor te explica el monto exacto y las facilidades de pago disponibles para el modelo que te interese.",
    link: { href: waHref, label: "Preguntar por WhatsApp" },
  },
  {
    q: "¿Quién construye los desarrollos? ¿Es seguro comprar?",
    a: "Los desarrollos son de Altta Homes, respaldada por Grupo Sadasi: más de 50 años de trayectoria y más de 430,000 viviendas entregadas en 12 estados de México. Es la primera desarrolladora mexicana certificada como Best Place to Live, lo que te da certeza y respaldo en tu compra.",
  },
  {
    q: "¿Las viviendas son nuevas o de preventa? ¿Cuándo se entregan?",
    a: "Manejamos vivienda nueva, varias en etapa de preventa 2026. La fecha de entrega depende del desarrollo y la etapa. Dinos qué modelo te interesa por WhatsApp y te damos la fecha estimada de entrega vigente.",
  },
  {
    q: "¿Qué amenidades tienen los residenciales?",
    a: "Varían por desarrollo, pero incluyen alberca, casa club, gimnasio, áreas verdes, juegos infantiles, canchas deportivas y seguridad con control de acceso. Cada página de desarrollo detalla sus amenidades específicas.",
    link: { href: "/#modelos", label: "Ver amenidades por desarrollo" },
  },
  {
    q: "¿Cómo los contacto o agendo una visita?",
    a: "La forma más rápida es por WhatsApp, donde un asesor te atiende directamente, te envía información, precios y recorridos, y agenda tu visita. También puedes visitarnos en la oficina de ventas en Av. 127 SM 342 MZ 27, Cancún.",
    link: { href: waHref, label: "Escríbenos por WhatsApp" },
  },
];

const metaTitle =
  "Preguntas Frecuentes · Casas y Departamentos en Cancún | Altta Homes";
const metaDescription =
  "Resolvemos tus dudas sobre comprar casa o departamento en Cancún con Altta Homes: créditos Infonavit, FOVISSSTE y bancario, precios, apartado, recorridos virtuales, entrega y más.";

export const metadata: Metadata = {
  title: { absolute: metaTitle },
  description: metaDescription,
  alternates: { canonical: "/preguntas-frecuentes" },
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "@id": `${PAGE_URL}#faq`,
      url: PAGE_URL,
      inLanguage: "es-MX",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumbs`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Preguntas Frecuentes",
          item: PAGE_URL,
        },
      ],
    },
  ],
};

export default function Page() {
  return (
    <div className={styles.wrapper}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader />

      <header className={styles.head}>
        <div className="container">
          <span className={styles.eyebrow}>Centro de ayuda</span>
          <h1>Preguntas frecuentes sobre comprar en Cancún</h1>
          <p>
            Todo lo que necesitas saber sobre nuestras casas y departamentos en
            la Zona Sur de Cancún: créditos, precios, visitas y más.
          </p>
        </div>
      </header>

      <section className={styles.faqSection}>
        <div className="container">
          <div className={styles.faqList}>
            {FAQS.map((f, i) => (
              <details key={i} className={styles.item}>
                <summary className={styles.question}>
                  <span>{f.q}</span>
                  <svg
                    className={styles.chev}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <div className={styles.answer}>
                  <p>{f.a}</p>
                  {f.link && (
                    <a
                      className={styles.answerLink}
                      href={f.link.href}
                      {...(f.link.href.startsWith("http")
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                    >
                      {f.link.label}
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </a>
                  )}
                </div>
              </details>
            ))}
          </div>

          <div className={styles.cta}>
            <h2>¿No encontraste tu respuesta?</h2>
            <p>Escríbenos y un asesor te atiende al momento, sin costo.</p>
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              <svg
                className={styles.ctaIcon}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Pregúntanos por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer id="contacto" className={pageStyles.footer}>
        <div className={`container ${pageStyles.footerGrid}`}>
          <div className={pageStyles.footerBrand}>
            <h2>
              Altta<span>Homes</span>
            </h2>
            <span className={pageStyles.footerTagline}>
              by Grupo Sadasi · Cancún
            </span>
            <p>
              50 años de trayectoria ininterrumpida, 430,000 viviendas
              entregadas y el respaldo de la primera desarrolladora mexicana
              certificada{" "}
              <em style={{ whiteSpace: "nowrap" }}>Best Place to Live</em>.
            </p>
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className={pageStyles.footerBrandCta}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Informes por WhatsApp
            </a>
          </div>
          <div className={pageStyles.footerLinks}>
            <h3>Navegación</h3>
            <ul>
              <li>
                <a href="/">Inicio</a>
              </li>
              <li>
                <a href="/jardines-del-sur-6">
                  Jardines del Sur 6
                </a>
              </li>
              <li>
                <a href="/jardines-del-sur-6/promociones">Promociones</a>
              </li>
              <li>
                <a href="/la-rioja-2">La Rioja 2</a>
              </li>
              <li>
                <a href="/lirios-residencial-2">
                  Lirios Residencial 2
                </a>
              </li>
              <li>
                <a href="/jardines-del-sur-7">
                  Jardines del Sur 7 · Próximamente
                </a>
              </li>
              <li>
                <a href="/preguntas-frecuentes">Preguntas Frecuentes</a>
              </li>
              <li>
                <ContactNavBtn />
              </li>
            </ul>
          </div>
          <div className={pageStyles.footerContact}>
            <h3>Contacto</h3>
            <div className={pageStyles.footerContactItem}>
              <span className={pageStyles.footerContactIcon}>📍</span>
              <a href={OFFICE_MAP_URL} target="_blank" rel="noreferrer">
                {OFFICE_ADDRESS}
              </a>
            </div>
            <div className={pageStyles.footerContactItem}>
              <span className={pageStyles.footerContactIcon}>📞</span>
              <FooterPhoneContact />
            </div>
          </div>
        </div>
        <div className={pageStyles.footerBottom}>
          <p>
            &copy; 2026 Altta Homes by Grupo Sadasi. Todos los derechos
            reservados.
          </p>
        </div>
      </footer>

      <FloatingWhatsApp />
    </div>
  );
}
