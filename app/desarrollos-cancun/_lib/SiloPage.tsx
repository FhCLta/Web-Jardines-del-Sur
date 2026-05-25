import fs from "fs";
import path from "path";
import SiteHeader from "@/components/SiteHeader";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import PropertyCard from "@/components/PropertyCard";
import FooterPhoneContact from "@/components/FooterPhoneContact";
import ContactNavBtn from "@/components/ContactNavBtn";
import SiloHero from "@/components/SiloHero";
import AmenitiesSection from "@/components/AmenitiesSection";
import pageStyles from "@/app/page.module.css";
import styles from "../silo.module.css";
import { DEVS, type DevSlug } from "./dev-content";
import { slugifyModel } from "./model-utils";

const SITE_URL = "https://jardinesdelsurcancun.mx";
const PHONE_E164 = "529982059044";
const OFFICE_ADDRESS = "Av. 127 SM 342 MZ 27, 77536 Cancún, Q.R.";
const OFFICE_MAP_URL = "https://maps.app.goo.gl/9sKBR1fUNSswv5d19";

type InventoryProperty = {
  id: string;
  development: string;
  status: string;
  nombre_modelo: string;
  precio: number;
  metros_construccion: number;
  metros_terreno: number | null;
  levels: { nivel: number; desc: string }[];
  amenidades_key: string[];
  url_recorrido_virtual: string;
  images: string[];
};

async function getInventory(): Promise<InventoryProperty[]> {
  const filePath = path.join(process.cwd(), "data", "inventory.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContents);
  return data.inventory_stitch_2026;
}

export default async function SiloPage({ slug }: { slug: DevSlug }) {
  const dev = DEVS[slug];
  const location = dev.location;
  const inventory = await getInventory();
  const properties = inventory.filter((p) => p.development === dev.name);

  const pageUrl = `${SITE_URL}/desarrollos-cancun/${dev.slug}`;
  const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(dev.whatsappMessage)}`;

  const casasCount = properties.filter((p) => /^(Casa)\s/i.test(p.nombre_modelo)).length;
  const deptosCount = properties.filter((p) => /^(Departamento)\s/i.test(p.nombre_modelo)).length;
  const total = properties.length;
  const minPrice = Math.min(...properties.map((p) => p.precio));
  const priceFmt = `$${minPrice.toLocaleString("es-MX")} MXN`;
  const dynamicSubtitleBold = `${total} ${total === 1 ? "modelo" : "modelos"} · Desde ${priceFmt}`;
  const dynamicSubtitleBreakdown = casasCount > 0 && deptosCount > 0
    ? `${casasCount} ${casasCount === 1 ? "casa" : "casas"} y ${deptosCount} ${deptosCount === 1 ? "departamento" : "departamentos"}`
    : undefined;
  const dynamicSubtitleDetail = dev.hero.subtitle.detail;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: dev.metaTitle,
        description: dev.metaDescription,
        inLanguage: "es-MX",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#business` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE_URL}${dev.ogImage}`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Desarrollos en Cancún",
            item: `${SITE_URL}/#desarrollos`,
          },
          { "@type": "ListItem", position: 3, name: dev.name, item: pageUrl },
        ],
      },
      {
        "@type": "OfferCatalog",
        "@id": `${pageUrl}#offers`,
        name: `Modelos disponibles en ${dev.name}`,
        url: pageUrl,
        itemListElement: properties.map((property) => ({
          "@type": "Offer",
          name: property.nombre_modelo,
          price: property.precio,
          priceCurrency: "MXN",
          availability: "https://schema.org/InStock",
          itemOffered: {
            "@type": "Residence",
            name: `${property.nombre_modelo} · ${dev.name}`,
            floorSize: {
              "@type": "QuantitativeValue",
              value: property.metros_construccion,
              unitCode: "MTK",
            },
            address: {
              "@type": "PostalAddress",
              addressLocality: "Cancún",
              addressRegion: "Quintana Roo",
              addressCountry: "MX",
            },
          },
        })),
      },
    ],
  };

  return (
    <div className={styles.wrapper}>
      {dev.hero.mobileImage && (
        <link
          rel="preload"
          as="image"
          href={dev.hero.mobileImage}
          type="image/webp"
          media="(max-width: 767px)"
          fetchPriority="high"
        />
      )}
      {dev.hero.preloadImage && (
        <link
          rel="preload"
          as="image"
          href={dev.hero.preloadImage}
          type="image/webp"
          media="(min-width: 768px)"
          fetchPriority="high"
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader />

      <SiloHero dev={dev} waHref={waHref} subtitleBold={dynamicSubtitleBold} subtitleBreakdown={dynamicSubtitleBreakdown} subtitleDetail={dynamicSubtitleDetail} />

      <section id="modelos" className={styles.modelsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="text-accent">Inventario y Precios</span>
            <h2>Modelos disponibles en {dev.name}</h2>
            <p>
              Recorridos virtuales 360°, precios actualizados y atención directa por WhatsApp.
            </p>
          </div>

          <div className={styles.modelsGrid}>
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {properties.length > 0 && (
            <div className={styles.modelLinks}>
              <span className={styles.modelLinksLabel}>
                Ver ficha completa de cada modelo:
              </span>
              <ul className={styles.modelLinksList}>
                {properties.map((property) => (
                  <li key={property.id}>
                    <a
                      href={`/desarrollos-cancun/${dev.slug}/${slugifyModel(property.nombre_modelo)}`}
                    >
                      {property.nombre_modelo}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className={styles.aboutSection}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutCopy}>
              <h2>Sobre {dev.name}</h2>
              {dev.intro.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <aside className={styles.highlightsCard}>
              <h3>Lo esencial</h3>
              <ul className={styles.highlightsList}>
                {dev.highlights.map((h, i) => (
                  <li key={i}>
                    <svg
                      className={styles.highlightCheck}
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              {location && (
                <div className={styles.locationStrip}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>
                    <strong>{location.label}:</strong> {location.value}
                  </span>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {dev.amenitiesSection && (
        <AmenitiesSection
          items={dev.amenitiesSection.items}
          header={dev.amenitiesSection.header}
          trustItems={dev.amenitiesSection.trustItems}
          extraAmenities={dev.amenitiesSection.extraAmenities}
          equipment={dev.amenitiesSection.equipment}
        />
      )}

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
              50 años de trayectoria ininterrumpida, 430,000 viviendas entregadas y el respaldo de la primera desarrolladora mexicana certificada <em style={{ whiteSpace: "nowrap" }}>Best Place to Live</em>.
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
                <a href="/#desarrollos">Desarrollos</a>
              </li>
              <li>
                <a href="/#modelos">Modelos y Precios</a>
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
            &copy; 2026 Altta Homes by Grupo Sadasi. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      <FloatingWhatsApp />
    </div>
  );
}
