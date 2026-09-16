import { getImageProps } from "next/image";
import SiteHeader from "@/components/SiteHeader";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import PropertyCard from "@/components/PropertyCard";
import AmenitiesSection from "@/components/AmenitiesSection";
import FooterPhoneContact from "@/components/FooterPhoneContact";
import FooterSocial from "@/components/FooterSocial";
import ContactNavBtn from "@/components/ContactNavBtn";
import pageStyles from "@/app/page.module.css";
import styles from "../catalog.module.css";
// El encabezado de esta pagina usa las mismas piezas que el de los silos
// (titulo serif, etiqueta, botones) y la placa del logo. Ver SiloHero.
import heroStyles from "@/components/Hero.module.css";
import siloStyles from "@/app/(desarrollos)/silo.module.css";
import { DEVS, type DevSlug } from "./dev-content";
import {
  getPropertiesByDev,
  getModelType,
  slugifyModel,
  formatPriceMxn,
} from "./model-utils";
import { type CatalogKind } from "./dev-meta";
import NivelesTable from "./NivelesTable";
import { getVariantesDepartamentos } from "@/lib/precios";
import { SITE_URL } from "@/lib/site";

const PHONE_E164 = "529982059044";
const OFFICE_ADDRESS = "Av. 127 SM 342 MZ 27, 77536 Cancún, Q.R.";
const OFFICE_MAP_URL = "https://maps.app.goo.gl/9sKBR1fUNSswv5d19";

type CatalogPageProps = {
  slug: DevSlug;
  kind: CatalogKind;
};

/**
 * Página-catálogo compartible: las viviendas de UN tipo (casas o departamentos)
 * de un desarrollo, con hero compacto, modelos, tabla de precios (departamentos)
 * y amenidades. URL corta para WhatsApp, título largo para SEO.
 */
export default function CatalogPage({ slug, kind }: CatalogPageProps) {
  const dev = DEVS[slug];
  const tipo = kind === "casas" ? "Casa" : "Departamento";
  const productoPlural = kind === "casas" ? "Casas" : "Departamentos";
  const productoSingular = kind === "casas" ? "casa" : "departamento";

  const properties = getPropertiesByDev(dev.name).filter(
    (p) => getModelType(p.nombre_modelo) === tipo
  );

  const count = properties.length;
  const prices = properties
    .map((p) => p.precio)
    .filter((n): n is number => n !== null && n > 0);
  const minPrice = prices.length ? Math.min(...prices) : null;
  // El encabezado ya dice "Casas en Jardines del Sur 6"; repetirlo aqui no
  // aporta nada y se veia redundante (lo noto Florencio). Este titulo dice que
  // hacer en esta seccion, y el nombre del desarrollo sigue en el h1, la migaja
  // y las tarjetas.
  // "Conoce" y no "Compara": decision de Florencio, pensando en quien llega
  // NUEVO al desarrollo — "compara" da por hecho que ya sabe entre que elegir.
  // Dice "modelos" (no "casas"/"departamentos") para que las dos paginas suenen
  // igual y no repita el h1 del encabezado.
  const tituloModelos =
    count === 1 ? "Conoce el modelo" : `Conoce los ${count} modelos`;

  const pageUrl = `${SITE_URL}/${dev.slug}/${kind}`;
  // Departamentos: el precio cambia por nivel y por vista. La ficha de cada
  // modelo publica una sola variante, así que esta tabla es lo único en el
  // sitio que muestra el abanico completo.
  const variantes = kind === "departamentos" ? getVariantesDepartamentos(slug) : [];
  const heroImage = dev.hero.preloadImage || dev.ogImage;
  const heroMobile = dev.hero.mobileImage || heroImage;
  // Foto distinta en celular y en escritorio, con getImageProps + <picture>
  // ("Art direction" en la guia de next/image). Con `images.unoptimized` no hay
  // srcSet y se usa el src tal cual. Sin `priority`: las precargas ya van arriba,
  // cada una con su media; con priority se duplicaban.
  const heroComun = {
    alt: `${dev.name}, Cancún`,
    fill: true,
    sizes: "100vw",
    loading: "eager" as const,
    fetchPriority: "high" as const,
  };
  const {
    props: { srcSet: srcSetCel, src: srcCel },
  } = getImageProps({ ...heroComun, src: heroMobile });
  const { props: heroImgProps } = getImageProps({ ...heroComun, src: heroImage });
  const heroCel = srcSetCel ?? srcCel;

  const waMessage = `Hola, quiero información de las ${productoPlural.toLowerCase()} en ${dev.name}, Cancún (vi la página con los modelos y precios).`;
  const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(waMessage)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${productoPlural} en ${dev.name} | Altta Homes Cancún`,
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
          // ⚠️ NO reponer aqui un nivel "Desarrollos en Cancún": apuntaba a
          // /#desarrollos, que es la MISMA pagina que "Inicio" con un ancla, asi
          // que la ruta llevaba dos escalones al mismo documento. Quitado el
          // 25 ago 2026 por decision de Florencio.
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: dev.name, item: `${SITE_URL}/${dev.slug}` },
          { "@type": "ListItem", position: 3, name: productoPlural, item: pageUrl },
        ],
      },
      {
        "@type": "OfferCatalog",
        "@id": `${pageUrl}#offers`,
        name: `${productoPlural} en ${dev.name}`,
        url: pageUrl,
        itemListElement: properties.map((property) => ({
          "@type": "Offer",
          name: property.nombre_modelo,
          price: property.precio,
          priceCurrency: "MXN",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/${dev.slug}/${slugifyModel(property.nombre_modelo)}`,
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
      <link
        rel="preload"
        as="image"
        href={heroMobile}
        type="image/webp"
        media="(max-width: 767px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={heroImage}
        type="image/webp"
        media="(min-width: 768px)"
        fetchPriority="high"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader />

      {/* ===== HERO COMPACTO ===== */}
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          {/* Antes era el componente Image de Next con la foto de escritorio tambien
              en celular: el celular precargaba su foto, no la usaba y ademas bajaba
              la de escritorio. */}
          <picture>
            <source media="(max-width: 767px)" srcSet={heroCel} />
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img {...heroImgProps} />
          </picture>
          <div className={styles.heroOverlay} />
        </div>
        <div className={`container ${styles.heroInner}`}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <a href="/">Inicio</a>
            <span aria-hidden="true">›</span>
            <a href={`/${dev.slug}`}>{dev.name}</a>
            <span aria-hidden="true">›</span>
            <span className={styles.breadcrumbCurrent}>{productoPlural}</span>
          </nav>

          {/* Mismas piezas que el encabezado del silo: logo sobre placa, etiqueta
              con puntitos, titulo serif con la linea dorada y los dos botones.
              Lo unico que NO se copia es el alto: aqui el hero es compacto para
              que las tarjetas queden cerca. */}
          {dev.logo && (
            <span
              className={
                dev.logoSobreFoto === "blanco" ? siloStyles.logoBlanco : siloStyles.logoPlate
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dev.logo}
                alt={`Logo de ${dev.name}`}
                width={dev.logoWidth}
                height={128}
              />
            </span>
          )}

          <span className={`${heroStyles.eyebrow} ${siloStyles.eyebrowSilo}`}>
            <span className={heroStyles.eyebrowDot} />
            <strong>{productoPlural.toUpperCase()}</strong>
            <span className={`${heroStyles.eyebrowSep} ${siloStyles.eyebrowSepSilo}`}>·</span>
            <span>{dev.hero.eyebrow.strong}</span>
            <span className={`${heroStyles.eyebrowSep} ${siloStyles.eyebrowSepSilo}`}>·</span>
            <span>
              {count} {count === 1 ? "MODELO" : "MODELOS"}
            </span>
          </span>

          <h1 className={heroStyles.title}>
            <span className={heroStyles.titleLine}>{productoPlural} en</span>
            <span className={heroStyles.titleLine}>{dev.name}</span>
            <em className={`${heroStyles.trustTitle} ${styles.heroTrust}`}>
              {dev.hero.title.em}
            </em>
          </h1>

          <p className={heroStyles.subtitle}>
            <span className={heroStyles.subtitleDevelopments}>
              {count === 1
                ? `Un ${productoSingular} disponible`
                : `${count} ${productoPlural.toLowerCase()} disponibles`}
              {/* El separador va DENTRO del bloque que no se parte: fuera, en
                  celular el renglón terminaba con un "·" colgando. Y el "MXN" lo
                  pone formatPriceMxn — no se repite aquí. */}
              {minPrice && (
                <span className={styles.heroPrecio}>
                  {" · "}
                  Desde {formatPriceMxn(minPrice)}
                </span>
              )}
            </span>
            <span className={heroStyles.subtitleDetail}>
              Recorridos virtuales 360°, precios actualizados e informes por WhatsApp.
            </span>
          </p>

          <div className={heroStyles.ctas}>
            <a href="#modelos" className={`btn btn-primary ${heroStyles.ctaPrimary}`}>
              Ver {productoPlural.toLowerCase()} y precios
            </a>
            <a
              href={waHref}
              className={`btn ${heroStyles.ctaSecondary}`}
              target="_blank"
              rel="noreferrer"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.5 3.5A11.4 11.4 0 0012 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.7.9 3.7 1.4 5.8 1.4 6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.5-8.3zM12 21.8c-1.8 0-3.6-.5-5.2-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.7 9.7 0 01-1.5-5.2C2 6.5 6.5 2 12 2s10 4.5 10 10-4.5 9.8-10 9.8zm5.5-7.4c-.3-.2-1.8-.9-2-1s-.5-.2-.7.1-.8 1-1 1.2-.4.2-.7 0c-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5l.3-.4c0-.2.1-.3 0-.5l-.9-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4z" />
              </svg>
              Hablar con un asesor
            </a>
          </div>
        </div>
      </section>

      {/* ===== MODELOS ===== */}
      <section id="modelos" className={styles.modelsSection} style={{ scrollMarginTop: "90px" }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            {/* "Inventario y precios" y no "Modelos y precios": el titulo de abajo ya
                dice "modelos", y asi ademas coincide con la seccion del silo. */}
              <span className="text-accent">Inventario y precios</span>
            <h2>{tituloModelos}</h2>
            <p>Precio con descuento, metros, recámaras y distribución de cada modelo.</p>
          </div>

          <div className={styles.modelsGrid}>
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {properties.length > 0 && (
            <div className={styles.modelLinks}>
              <span className={styles.modelLinksLabel}>Ver ficha completa de cada modelo:</span>
              <ul className={styles.modelLinksList}>
                {properties.map((property) => (
                  <li key={property.id}>
                    <a href={`/${dev.slug}/${slugifyModel(property.nombre_modelo)}`}>
                      {property.nombre_modelo}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ===== PRECIOS POR NIVEL Y VISTA (solo departamentos) ===== */}
      {variantes.length > 0 && (
        <NivelesTable variantes={variantes} waHref={waHref} />
      )}

      {/* ===== AMENIDADES (excepción deliberada: aquí SÍ van, es una presentación) ===== */}
      {dev.amenitiesSection && (
        <div id="amenidades" style={{ scrollMarginTop: "90px" }}>
          <AmenitiesSection
            items={dev.amenitiesSection.items}
            header={dev.amenitiesSection.header}
            trustItems={dev.amenitiesSection.trustItems}
            extraAmenities={dev.amenitiesSection.extraAmenities}
            equipment={dev.amenitiesSection.equipment}
          />
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <footer id="contacto" className={pageStyles.footer}>
        <div className={`container ${pageStyles.footerGrid}`}>
          <div className={pageStyles.footerBrand}>
            <h2>
              Altta<span>Homes</span>
            </h2>
            <span className={pageStyles.footerTagline}>by Grupo Sadasi · Cancún</span>
            <p>
              50 años de trayectoria ininterrumpida, 430,000 viviendas entregadas y el respaldo de
              la primera desarrolladora mexicana certificada{" "}
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
              <li>
                <a href="/">Inicio</a>
              </li>
              <li>
                <a href={`/${dev.slug}`}>{dev.name}</a>
              </li>
              <li>
                <a href="/#desarrollos">Desarrollos</a>
              </li>
              <li>
                {/* Dentro de un desarrollo, el pie lleva a SUS precios, no a
                    la lista general: el que esta viendo Jardines del Sur 6 no
                    quiere aterrizar en los cuatro desarrollos. Los tres
                    desarrollos de DEVS tienen su pagina de precios. */}
                <a href={`/${dev.slug}/precios`}>Precios</a>
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
          <p>&copy; 2026 Altta Homes by Grupo Sadasi. Todos los derechos reservados.</p>
          <FooterSocial />
        </div>
      </footer>

      <FloatingWhatsApp />
    </div>
  );
}
