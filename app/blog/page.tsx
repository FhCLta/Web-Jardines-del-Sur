import type { Metadata } from "next";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FooterPhoneContact from "@/components/FooterPhoneContact";
import FooterSocial from "@/components/FooterSocial";
import ContactNavBtn from "@/components/ContactNavBtn";
import pageStyles from "@/app/page.module.css";
import styles from "./blog.module.css";
import { getAllPosts } from "./_lib/posts";
import { SITE_URL } from "@/lib/site";

const PHONE_E164 = "529982059044";
const OFFICE_ADDRESS = "Av. 127 SM 342 MZ 27, 77536 Cancún, Q.R.";
const OFFICE_MAP_URL = "https://maps.app.goo.gl/9sKBR1fUNSswv5d19";
const PAGE_URL = `${SITE_URL}/blog`;
const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(
  "Hola, quiero más información sobre casas y departamentos en Cancún."
)}`;

const metaTitle = "Blog · Guías para comprar casa en Cancún | Altta Homes";
const metaDescription =
  "Consejos y guías para comprar casa o departamento en Cancún: créditos Infonavit y bancario, plusvalía, preventa y todo lo que necesitas saber de la Zona Sur.";

export const metadata: Metadata = {
  title: { absolute: metaTitle },
  description: metaDescription,
  alternates: { canonical: "/blog" },
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
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function Page() {
  const posts = getAllPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${PAGE_URL}#blog`,
        url: PAGE_URL,
        name: metaTitle,
        description: metaDescription,
        inLanguage: "es-MX",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        blogPost: posts.map((p) => ({
          "@type": "BlogPosting",
          headline: p.title,
          url: `${PAGE_URL}/${p.slug}`,
          datePublished: p.date,
          description: p.description,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: PAGE_URL },
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
          <span className={styles.eyebrow}>Blog · Altta Homes Cancún</span>
          <h1>Guías para comprar casa en Cancún</h1>
          <p>
            Consejos prácticos sobre créditos, plusvalía y preventa para que
            tomes la mejor decisión en la Zona Sur de Cancún.
          </p>
        </div>
      </header>

      <section className={styles.list}>
        <div className="container">
          <div className={styles.grid}>
            {posts.map((p) => (
              <a key={p.slug} className={styles.card} href={`/blog/${p.slug}`}>
                <div className={styles.cardMedia}>
                  <Image
                    src={p.coverImage}
                    alt={p.coverAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 450px"
                  />
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.cardMeta}>
                    {p.dateLabel} · {p.readingMinutes} min de lectura
                  </span>
                  <h2>{p.title}</h2>
                  <p>{p.excerpt}</p>
                  <span className={styles.cardLink}>
                    Leer artículo
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
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
              <li><a href="/jardines-del-sur-6">Jardines del Sur 6</a></li>
              <li><a href="/jardines-del-sur-6/promociones">Promociones</a></li>
              <li><a href="/la-rioja-2">La Rioja 2</a></li>
              <li><a href="/lirios-residencial-2">Lirios Residencial 2</a></li>
              <li><a href="/jardines-del-sur-7">Jardines del Sur 7 · Próximamente</a></li>
              <li><a href="/preguntas-frecuentes">Preguntas Frecuentes</a></li>
              <li><a href="/calculadora-hipotecaria">Calculadora</a></li>
              <li><a href="/blog">Blog</a></li>
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
