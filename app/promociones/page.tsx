import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FooterPhoneContact from "@/components/FooterPhoneContact";
import FooterSocial from "@/components/FooterSocial";
import ContactNavBtn from "@/components/ContactNavBtn";
import pageStyles from "@/app/page.module.css";
import styles from "../(desarrollos)/promos.module.css";
import { DEVS, type DevSlug } from "../(desarrollos)/_lib/dev-content";
import { SITE_URL } from "@/lib/site";

const PHONE_E164 = "529982059044";
const OFFICE_ADDRESS = "Av. 127 SM 342 MZ 27, 77536 Cancún, Q.R.";
const OFFICE_MAP_URL = "https://maps.app.goo.gl/9sKBR1fUNSswv5d19";
const PAGE_URL = `${SITE_URL}/promociones`;

// ⚠️ ESTA PAGINA NO DEBE DUPLICAR A LAS DE CADA DESARROLLO.
// Las de /[dev]/promociones atacan busquedas de MARCA ("promociones jardines
// del sur 6"); esta ataca las GENERICAS de ciudad ("promociones casas en
// Cancun"), que tienen mucho mas volumen. Por eso el titulo, la entradilla y
// las preguntas frecuentes son propias: si fuera un copy-paste de las tarjetas,
// Google veria tres paginas casi iguales, elegiria una y hundiria las otras.
// Las tarjetas SI se reusan, pero agrupadas por desarrollo y con enlace a cada
// pagina especifica (estructura hub-and-spoke).

// Las dos frases a posicionar, completas y exactas: "promociones de casas y
// departamentos" + la marca "Altta Homes Cancún". "Cancún" va UNA sola vez,
// dentro de la marca: ponerlo tambien en la primera mitad dejaba el titulo en
// 67 caracteres y Google corta alrededor de 60. Asi cabe entero (57) y queda
// consistente con /[dev]/promociones, que ya cierran con "| Altta Homes Cancún".
const metaTitle = "Promociones de Casas y Departamentos | Altta Homes Cancún";
// Recortada para que lo importante caiga ANTES del corte de Google (~155):
// antes eran 243 caracteres y la mitad final nunca se mostraba.
const metaDescription =
  "Promociones y descuentos vigentes en casas y departamentos de Cancún: minisplits, descuentos directos y paquetes en Jardines del Sur 6 y La Rioja 2.";

export const metadata: Metadata = {
  title: { absolute: metaTitle },
  description: metaDescription,
  alternates: { canonical: "/promociones" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "/promociones",
    siteName: "Altta Homes Cancún",
    title: metaTitle,
    description: metaDescription,
    images: [
      {
        url: "/optimized/hero/alberca-desktop.webp",
        width: 1200,
        height: 630,
        alt: "Promociones de casas y departamentos en Cancún · Altta Homes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: metaTitle,
    description: metaDescription,
    images: ["/optimized/hero/alberca-desktop.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

// Preguntas frecuentes: contenido propio del hub (y fuente del JSON-LD FAQPage,
// que es lo que puede sacar resultados enriquecidos en Google). Cada respuesta
// se apega a lo que ya dice la nota de las promociones; nada inventado.
const FAQS = [
  {
    q: "¿Las promociones se pueden usar con crédito Infonavit o bancario?",
    a: "Sí. Las promociones aplican sobre la vivienda y son independientes del esquema de financiamiento: puedes comprar con crédito bancario, Infonavit, Cofinavit, FOVISSSTE o de contado. Los requisitos concretos de cada promoción los confirma tu asesor.",
  },
  {
    q: "¿Hasta cuándo aplican?",
    a: "Cada promoción tiene su fecha de vigencia indicada en su tarjeta y aplica al firmar tu expediente de venta dentro de ese mes. Las promociones cambian mes con mes, así que conviene confirmar la vigente antes de decidir.",
  },
  {
    q: "¿Aplican a cualquier casa o departamento del desarrollo?",
    a: "No. Cada promoción aplica únicamente a las ubicaciones indicadas (manzana, lote o unidad) y está sujeta a disponibilidad. Por eso en cada tarjeta aparece la ubicación exacta a la que corresponde.",
  },
  {
    q: "¿Los minisplits incluyen instalación?",
    a: "No. Los minisplits se entregan como parte de la promoción, pero la instalación corre por tu cuenta.",
  },
  {
    q: "¿Se pueden combinar varias promociones?",
    a: "Las promociones publicadas ya vienen agrupadas por vivienda: lo que ves en cada tarjeta es el paquete completo que aplica a esa ubicación. Si tienes dudas sobre un caso particular, escríbenos y lo revisamos contigo.",
  },
];

export default function Page() {
  const slugs = (Object.keys(DEVS) as DevSlug[]).filter(
    (s) => DEVS[s].promos && DEVS[s].promos!.items.length > 0
  );
  const total = slugs.reduce((n, s) => n + DEVS[s].promos!.items.length, 0);

  const waMsg =
    "Hola, vi las promociones vigentes en el sitio de Altta Homes Cancún y quiero más información y disponibilidad.";
  const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(waMsg)}`;

  // Si todos los desarrollos comparten la misma etiqueta de mes, se muestra una
  // sola; si algún día difieren, se omite en vez de mostrar una que sea falsa
  // para la mitad de las promociones.
  const etiquetas = new Set(slugs.map((s) => DEVS[s].promos!.updatedLabel));
  const updatedLabel = etiquetas.size === 1 ? [...etiquetas][0] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Promociones",
            item: PAGE_URL,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${PAGE_URL}#faq`,
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${PAGE_URL}#promociones`,
        name: "Promociones vigentes en Cancún",
        numberOfItems: total,
        itemListElement: slugs.flatMap((s, gi) =>
          DEVS[s].promos!.items.map((item, i) => ({
            "@type": "ListItem",
            position: gi * 100 + i + 1,
            name: `${item.modelo} · ${DEVS[s].name}`,
            url: item.modeloSlug
              ? `${SITE_URL}/${s}/${item.modeloSlug}`
              : `${SITE_URL}/${s}`,
          }))
        ),
      },
    ],
  };

  return (
    <div className={styles.wrapper}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader />

      <header
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(10,26,43,0.78) 0%, rgba(10,26,43,0.93) 100%), url("/optimized/hero/alberca-desktop.webp")`,
        }}
      >
        <div className="container">
          <nav className={styles.crumbs} aria-label="Ruta de navegación">
            <a href="/">Inicio</a>
            <span aria-hidden="true">/</span>
            <strong>Promociones</strong>
          </nav>
          {/* "Casas y departamentos" baja al antetitulo para que el H1 pueda
              llevar la marca al frente sin perder la palabra clave. */}
          <span className={styles.eyebrow}>Casas y departamentos · Cancún</span>
          <h1>
            Promociones en{" "}
            <span className={styles.heroDevName}>Altta Homes Cancún</span>
          </h1>
          {updatedLabel && <p className={styles.updated}>{updatedLabel}</p>}
          <p className={styles.lead}>
            Todas las promociones vigentes en casas y departamentos de la Zona
            Sur de Cancún, reunidas en un solo lugar: descuentos directos,
            minisplits y paquetes de equipamiento.
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className={styles.heroCta}
          >
            Pregunta por las promociones vigentes
          </a>

          {/* Indice por desarrollo. Sale de `slugs`, asi que si Lirios estrena
              promociones aparece su boton solo. */}
          <div className={styles.heroDevs}>
            {slugs.map((slug) => {
              const n = DEVS[slug].promos!.items.length;
              return (
                <a key={slug} href={`#${slug}`} className={styles.heroDevChip}>
                  <span>Ver promociones en {DEVS[slug].shortName}</span>
                  <span className={styles.heroDevChipCount}>
                    · {n} {n === 1 ? "promoción" : "promociones"}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </header>

      <main className={`container ${styles.main}`}>
        <section className={styles.intro}>
          <p>
            Cada mes, Grupo Sadasi libera promociones sobre viviendas
            específicas de sus desarrollos en Cancún. No son descuentos
            generales: aplican a <strong>ubicaciones concretas</strong> —una
            manzana, un lote o una unidad— y mientras haya disponibilidad, así
            que la lista cambia de un mes a otro.
          </p>
          <p>
            Hay de dos tipos. Las que <strong>bajan el precio</strong>, como el
            descuento directo, y las de <strong>equipamiento</strong>, como los
            minisplits o el paquete de paneles, que no mueven el precio pero te
            ahorran el gasto de amueblar. Ambas se pueden aprovechar con crédito
            bancario, Infonavit o de contado.
          </p>
        </section>

        {slugs.map((slug) => {
          const dev = DEVS[slug];
          const promos = dev.promos!;
          return (
            <section
              key={slug}
              id={slug}
              className={styles.devGroup}
              aria-label={`Promociones de ${dev.name}`}
            >
              <div className={styles.devGroupHead}>
                <h2 className={styles.devGroupTitle}>{dev.name}</h2>
                <a
                  className={styles.devGroupLink}
                  href={`/${slug}/promociones`}
                >
                  Ver la página de promociones de {dev.shortName} →
                </a>
              </div>

              <div className={styles.promoGrid}>
                {promos.items.map((item, i) => {
                  const isModel = Boolean(item.modeloSlug);
                  const cardMsg = isModel
                    ? `Hola, vi la promoción del ${item.modelo} en ${dev.name} (${item.beneficios[0]}) y quiero cotizar precio y disponibilidad.`
                    : `Hola, vi la promoción "${item.titulo ?? item.modelo}" de ${dev.name} y quiero que un asesor me dé informes.`;
                  const cardWaHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(cardMsg)}`;
                  return (
                    <article key={i} className={styles.promoCard}>
                      {item.titulo && (
                        <span className={styles.promoTag}>{item.titulo}</span>
                      )}
                      <h3 className={styles.promoModel}>{item.modelo}</h3>
                      {item.ubicaciones && (
                        <p className={styles.promoUbic}>{item.ubicaciones}</p>
                      )}
                      <ul className={styles.promoBenefits}>
                        {item.beneficios.map((b, j) => (
                          <li key={j}>{b}</li>
                        ))}
                      </ul>
                      <div className={styles.promoActions}>
                        <a
                          href={
                            isModel ? `/${slug}/${item.modeloSlug}` : `/${slug}`
                          }
                          className={`btn btn-secondary ${styles.promoActionBtn}`}
                        >
                          {isModel ? "Ver el modelo" : "Ver modelos y precios"}
                        </a>
                        <a
                          href={cardWaHref}
                          target="_blank"
                          rel="noreferrer"
                          className={`btn btn-primary ${styles.promoActionBtn}`}
                        >
                          {isModel ? "Cotizar ahora" : "Contacta con un asesor"}
                        </a>
                      </div>
                      <div className={styles.promoVigencia}>
                        <span>Vigencia</span> {item.vigencia}
                      </div>
                      <p className={styles.promoRestric}>
                        Aplican restricciones
                      </p>
                    </article>
                  );
                })}
              </div>

              {promos.nota && <p className={styles.nota}>{promos.nota}</p>}
            </section>
          );
        })}

        <section className={styles.faq} aria-label="Preguntas frecuentes">
          <h2 className={styles.evergreenTitle}>
            Preguntas frecuentes sobre las promociones
          </h2>
          {FAQS.map((f, i) => (
            <div key={i} className={styles.faqItem}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </section>

        <section className={styles.ctaBox}>
          <h2>¿Te interesa alguna de estas promociones?</h2>
          <p>
            Un asesor autorizado de Altta Homes te confirma disponibilidad,
            requisitos y la promoción del mes.
          </p>
          <div className={styles.ctaActions}>
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className={styles.ctaBtn}
            >
              Escribir por WhatsApp
            </a>
            <a href="/#desarrollos" className={styles.ctaSecondary}>
              Ver todos los modelos y precios
            </a>
          </div>
        </section>
      </main>

      <footer className={pageStyles.footer}>
        <div className={`container ${pageStyles.footerGrid}`}>
          <div className={pageStyles.footerBrand}>
            <h2>
              Altta<span>Homes</span>
            </h2>
            <span className={pageStyles.footerTagline}>
              by Grupo Sadasi · Cancún
            </span>
            <p>
              Promociones y planes de financiamiento en casas y departamentos de
              la Zona Sur de Cancún, con el respaldo de 50 años de Grupo Sadasi.
            </p>
          </div>
          <div className={pageStyles.footerLinks}>
            <h3>Navegación</h3>
            <ul>
              <li>
                <a href="/">Inicio</a>
              </li>
              <li>
                <a href="/jardines-del-sur-6">Jardines del Sur 6</a>
              </li>
              <li>
                <a href="/la-rioja-2">La Rioja 2</a>
              </li>
              <li>
                <a href="/#desarrollos">Desarrollos</a>
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
          <FooterSocial />
        </div>
      </footer>

      <FloatingWhatsApp />
    </div>
  );
}
