import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import PropertyCard from "@/components/PropertyCard";
import AmenitiesSection from "@/components/AmenitiesSection";
import FooterPhoneContact from "@/components/FooterPhoneContact";
import FooterSocial from "@/components/FooterSocial";
import ContactNavBtn from "@/components/ContactNavBtn";
import pageStyles from "@/app/page.module.css";
import styles from "../catalog.module.css";
import { DEVS, type DevSlug } from "./dev-content";
import {
  getPropertiesByDev,
  getModelType,
  slugifyModel,
  formatPriceMxn,
  parseStat,
} from "./model-utils";
import { type CatalogKind } from "./dev-meta";
import NivelesTable from "./NivelesTable";
import { getVariantesDepartamentos } from "@/lib/precios";
import { SITE_URL } from "@/lib/site";
import fs from "node:fs";
import path from "node:path";

const PHONE_E164 = "529982059044";
const OFFICE_ADDRESS = "Av. 127 SM 342 MZ 27, 77536 Cancún, Q.R.";
const OFFICE_MAP_URL = "https://maps.app.goo.gl/9sKBR1fUNSswv5d19";

/**
 * FOLLETO PDF RETIRADO (decisión de Florencio, 11 ago 2026).
 *
 * El flujo pasó a ser compartir el LINK de esta página: siempre está al día,
 * mientras que el PDF hay que regenerarlo a mano cada vez que cambian precios
 * o fotos — y si no se regenera, el cliente recibe un documento que miente
 * mientras la web dice otra cosa.
 *
 * Se deja solo esta bandera en false: el markup del brochure, los estilos de
 * `@media print` y los scripts `gen-brochure-*` quedan dormidos por si algún
 * día se retoma. Volver a activarlo es cambiar esta palabra.
 */
const MOSTRAR_FOLLETO_PDF = false;

/**
 * Versión LIGERA (JPEG ~1000-1600px) de una imagen del sitio, para el brochure
 * imprimible: mantiene el PDF por debajo de ~2 MB (compartible por WhatsApp).
 * Las genera scripts/gen-brochure-img — la misma regla de slug debe coincidir.
 */
function brImg(src: string): string {
  const slug = src
    .replace(/^\//, "")
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `/brochure-img/${slug}.jpg`;
}

type CatalogPageProps = {
  slug: DevSlug;
  kind: CatalogKind;
};

/**
 * Página-catálogo compartible: las viviendas de UN tipo (casas o departamentos)
 * de un desarrollo, con hero compacto, comparativa y (en pasos siguientes)
 * amenidades + botón de imprimir. URL corta para WhatsApp, título largo para SEO.
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
  const prices = properties.map((p) => p.precio).filter((n) => n > 0);
  const minPrice = prices.length ? Math.min(...prices) : null;

  const pageUrl = `${SITE_URL}/${dev.slug}/${kind}`;
  const pageUrlShort = `alttahomescancun.mx/${dev.slug}/${kind}`;
  // Folleto PDF pre-generado (links clicables + peso ligero). Se regenera con
  // scripts/gen-brochure-img + puppeteer al cambiar precios/fotos.
  const brochurePdf = `/brochure-pdf/${dev.slug}-${kind}.pdf`;
  const brochureName = `${productoPlural}-${dev.name.replace(/\s+/g, "-")}-Altta-Homes.pdf`;
  // El PDF se genera a mano y no existe para todos los catálogos: sin el
  // `existsSync`, un catálogo nuevo publicaba un botón de descarga que daba 404.
  // Hoy además está apagado por bandera (ver MOSTRAR_FOLLETO_PDF).
  const hayBrochure =
    MOSTRAR_FOLLETO_PDF &&
    fs.existsSync(
      path.join(process.cwd(), "public", "brochure-pdf", `${dev.slug}-${kind}.pdf`)
    );

  // Departamentos: el precio cambia por nivel y por vista. La ficha de cada
  // modelo publica una sola variante, así que esta tabla es lo único en el
  // sitio que muestra el abanico completo.
  const variantes = kind === "departamentos" ? getVariantesDepartamentos(slug) : [];
  const heroImage = dev.hero.preloadImage || dev.ogImage;
  const heroMobile = dev.hero.mobileImage || heroImage;

  const waMessage = `Hola, quiero información de las ${productoPlural.toLowerCase()} en ${dev.name}, Cancún (vi la página con los modelos y precios).`;
  const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(waMessage)}`;

  const today = new Date().toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Amenidades en texto para la hoja impresa (sin las fotos pesadas de pantalla).
  const amenidadesList: string[] = dev.amenitiesSection
    ? [
        ...dev.amenitiesSection.items.map((a) => a.label),
        ...(dev.amenitiesSection.extraAmenities ?? []),
      ]
    : [];

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

      {/* ===== BROCHURE IMPRIMIBLE (solo al imprimir / guardar PDF) =====
          Folleto de varias páginas: portada + una página por vivienda +
          amenidades/contacto. Se genera de la misma página → precios al día.
          QR y link de vuelta a la web en cada pie. */}
      <div className={styles.brochure} aria-hidden="true">
        {/* --- PORTADA --- */}
        <section className={styles.brCover}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={brImg(heroImage)} alt="" className={styles.brCoverImg} />
          <div className={styles.brCoverOverlay} />
          <div className={styles.brCoverContent}>
            <p className={styles.brCoverBrand}>
              Altta<span>Homes</span> Cancún
            </p>
            <div className={styles.brCoverMain}>
              <p className={styles.brCoverKicker}>Catálogo de {productoPlural.toLowerCase()}</p>
              <h1>
                {productoPlural} en {dev.name}
              </h1>
              <p className={styles.brCoverSub}>
                Cancún, Quintana Roo · {count} {count === 1 ? "modelo" : "modelos"}
                {minPrice && <> · Desde {formatPriceMxn(minPrice)}</>}
              </p>
              {dev.amenitiesSection && dev.amenitiesSection.items.length > 0 && (
                <ul className={styles.brCoverHighlights}>
                  {dev.amenitiesSection.items.slice(0, 5).map((a) => (
                    <li key={a.label}>{a.label}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className={styles.brCoverFoot}>
              <a href={pageUrl} className={styles.brCoverLink}>
                {pageUrlShort}
              </a>
              <a href={waHref} className={styles.brCoverLink}>
                WhatsApp 998 205 9044
              </a>
            </div>
          </div>
        </section>

        {/* --- UNA PÁGINA POR VIVIENDA --- */}
        {properties.map((property) => {
          const rec = parseStat(property.amenidades_key, /^([\d.]+)\s*Rec/i);
          const ban = parseStat(property.amenidades_key, /^([\d.]+)\s*Ba/i);
          const specs = [
            property.metros_construccion && `${property.metros_construccion} m² construcción`,
            property.metros_terreno && `${property.metros_terreno} m² terreno`,
            rec && `${rec} recámaras`,
            ban && `${ban} baños`,
          ].filter(Boolean) as string[];
          const modelUrl = `${SITE_URL}/${dev.slug}/${slugifyModel(property.nombre_modelo)}`;
          // WhatsApp con el modelo ya escrito: al tocar el número del folleto se
          // abre WhatsApp (no la web) con el mensaje listo para enviar.
          const waModelMsg = `Hola, me interesa la ${property.nombre_modelo} en ${dev.name}, Cancún (${formatPriceMxn(property.precio)}). ¿Me pueden dar más información?`;
          const waModelHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(waModelMsg)}`;
          return (
            <section key={property.id} className={styles.brPage}>
              {/* Foto a sangre completa con la marca arriba y el nombre+precio
                  sobre la imagen: portada editorial por modelo, sin huecos. */}
              {property.images?.[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <a href={modelUrl} className={styles.brPhotoLink}>
                  <img src={brImg(property.images[0])} alt={property.nombre_modelo} className={styles.brPhoto} />
                  <div className={styles.brPhotoOverlay} />
                  <span className={styles.brPhotoBrand}>
                    Altta<span>Homes</span> Cancún
                  </span>
                  <span className={styles.brPhotoDev}>{dev.name} · Cancún</span>
                  <div className={styles.brPhotoTitle}>
                    <p className={styles.brKicker}>Modelo</p>
                    <h2>{property.nombre_modelo}</h2>
                    <p className={styles.brPrice}>{formatPriceMxn(property.precio)}</p>
                  </div>
                </a>
              )}

              <div className={styles.brBody}>
                <ul className={styles.brSpecs}>
                  {specs.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>

                {property.levels?.length > 0 && (
                  <div className={styles.brDist}>
                    <h3>Distribución</h3>
                    {property.levels.map((lvl) => (
                      <p key={lvl.nivel}>
                        <strong>Nivel {lvl.nivel}:</strong> {lvl.desc}
                      </p>
                    ))}
                  </div>
                )}

                <a href={modelUrl} className={styles.brModelCta}>
                  Ver ficha y recorrido virtual 360° →
                </a>

                <footer className={styles.brFoot}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/jds6/casas-qr.png" alt="" className={styles.brFootQr} />
                  <span className={styles.brFootText}>
                    Más fotos y recorrido virtual 360° en{" "}
                    <a href={modelUrl} className={styles.brFootLink}>
                      {pageUrlShort}
                    </a>{" "}
                    ·{" "}
                    <a href={waModelHref} className={styles.brFootWa}>
                      WhatsApp 998 205 9044
                    </a>
                  </span>
                </footer>
              </div>
            </section>
          );
        })}

        {/* --- AMENIDADES + CONTACTO --- */}
        <section className={`${styles.brPage} ${styles.brAmenPage}`}>
          <header className={styles.brHead}>
            <span className={styles.brHeadBrand}>
              Altta<span>Homes</span> Cancún
            </span>
            <span className={styles.brHeadDev}>{dev.name} · Cancún</span>
          </header>

          <h2 className={styles.brSectionTitle}>Amenidades del desarrollo</h2>

          {dev.amenitiesSection && (
            <div className={styles.brAmenGrid}>
              {dev.amenitiesSection.items.map((a) => (
                <figure key={a.label}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={brImg(a.img)} alt={a.label} />
                  <figcaption>{a.label}</figcaption>
                </figure>
              ))}
            </div>
          )}

          {dev.amenitiesSection?.extraAmenities && (
            <ul className={styles.brChips}>
              {dev.amenitiesSection.extraAmenities.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          )}

          {/* Contacto + legal anclados al fondo de la hoja (margin-top:auto):
              rellena el espacio sobrante sea cual sea el nº de amenidades. */}
          <div className={styles.brAmenFoot}>
            <div className={styles.brContact}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/jds6/casas-qr.png" alt="" className={styles.brContactQr} />
              <div>
                <p className={styles.brContactLead}>
                  Precios al día, más fotos y recorridos virtuales 360°:
                </p>
                <a href={pageUrl} className={styles.brContactUrl}>
                  {pageUrlShort}
                </a>
                <a href={waHref} className={styles.brContactWa}>
                  WhatsApp 998 205 9044 · Altta Homes Cancún
                </a>
                <p className={styles.brContactAddr}>{OFFICE_ADDRESS}</p>
              </div>
            </div>

            <p className={styles.brLegal}>
              Precios en pesos mexicanos, no incluyen gastos de escrituración; sujetos a cambio sin
              previo aviso. Documento informativo, no constituye oferta ni contrato. Impreso el {today}.
            </p>
          </div>
        </section>
      </div>

      {/* ===== HERO COMPACTO ===== */}
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          <Image src={heroImage} alt={`${dev.name}, Cancún`} fill priority sizes="100vw" />
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

          <h1 className={styles.title}>
            {productoPlural} en{" "}
            <em>{dev.name}</em>
          </h1>
          <p className={styles.subtitle}>
            {count === 1
              ? `Un ${productoSingular} disponible`
              : `${count} ${productoPlural.toLowerCase()} disponibles`}
            {minPrice && (
              /* En celular baja a su propio renglón: en una sola línea el
                 importe se partía ("$1,758,830" / "MXN") y se veía desalineado.
                 En escritorio sigue en la misma línea, con el separador. */
              <span className={styles.subtitleDesde}>
                <span className={styles.subtitleSep} aria-hidden="true"> · </span>
                Desde <strong>{formatPriceMxn(minPrice)}</strong>
              </span>
            )}
          </p>

          <div className={styles.ctaRow}>
            <a href="#modelos" className="btn btn-primary">
              Ver {productoPlural.toLowerCase()} y precios
            </a>
            <a href={waHref} target="_blank" rel="noreferrer" className={styles.ctaGhost}>
              Informes por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ===== MODELOS ===== */}
      <section id="modelos" className={styles.modelsSection} style={{ scrollMarginTop: "90px" }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="text-accent">Modelos y precios</span>
            <h2>
              {productoPlural} en {dev.name}
            </h2>
            <p>Recorridos virtuales 360°, precios actualizados y atención directa por WhatsApp.</p>
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

      {/* ===== DESCARGAR FOLLETO PDF (banda, fuera del hero) ===== */}
      {hayBrochure && (
      <section className={styles.printCtaSection}>
        <div className="container">
          <div className={styles.printCtaInner}>
            <div className={styles.printCtaText}>
              <h2>Llévate el folleto completo</h2>
              <p>
                {count === 1 ? "El modelo" : `Las ${count} ${productoPlural.toLowerCase()}`}, precios,
                distribución y amenidades en un PDF con enlaces a cada ficha — listo para compartir o
                imprimir.
              </p>
            </div>
            <a
              href={brochurePdf}
              download={brochureName}
              target="_blank"
              rel="noreferrer"
              className={styles.printCtaBtn}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="M7 10l5 5 5-5" />
                <path d="M12 15V3" />
              </svg>
              Descargar folleto (PDF)
            </a>
          </div>
        </div>
      </section>
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
