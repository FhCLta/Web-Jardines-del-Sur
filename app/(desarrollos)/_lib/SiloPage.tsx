import fs from "fs";
import path from "path";
import SiteHeader from "@/components/SiteHeader";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import PropertyCard from "@/components/PropertyCard";
import FooterPhoneContact from "@/components/FooterPhoneContact";
import FooterSocial from "@/components/FooterSocial";
import ContactNavBtn from "@/components/ContactNavBtn";
import SiloHero from "@/components/SiloHero";
import SiloTiposTabs from "@/components/SiloTiposTabs";
import AmenitiesSection from "@/components/AmenitiesSection";
import MapEmbedCard from "@/components/MapEmbedCard";
import pageStyles from "@/app/page.module.css";
import styles from "../silo.module.css";
import { DEVS, type DevSlug } from "./dev-content";
import { slugifyModel } from "./model-utils";
import { SITE_URL } from "@/lib/site";
import { PHONE_E164, OFFICE_ADDRESS, OFFICE_MAP_URL } from "@/lib/contacto";


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
  // ⚠️ Este lector NO pasa por model-utils.getInventory, asi que el filtro de
  // `oculto_web` se repite aqui. Sin el, lo oculto reaparece en el silo.
  return data.inventory_stitch_2026.filter(
    (p: { oculto_web?: boolean }) => !p.oculto_web
  );
}

export default async function SiloPage({ slug }: { slug: DevSlug }) {
  const dev = DEVS[slug];
  const location = dev.location;
  const mapa = dev.mapa;
  // El embed va por el id del perfil (cid): muestra SOLO ese pin, con su ficha.
  // Buscando por nombre (q=) salían también los lugares de nombre parecido.
  const mapaEmbed = mapa
    ? `https://maps.google.com/maps?cid=${mapa.cid}&z=16&hl=es&output=embed`
    : null;
  const inventory = await getInventory();
  const properties = inventory.filter((p) => p.development === dev.name);

  const pageUrl = `${SITE_URL}/${dev.slug}`;
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

  // Un desarrollo con casas Y departamentos (hoy solo Jardines del Sur 6) muestra
  // un selector Departamentos / Casas (SiloTiposTabs) en vez de una sola rejilla. Son dos compradores distintos
  // —presupuesto y credito distintos—: quien busca casa no deberia tener que
  // pasar primero por departamentos de otro rango de precio para encontrar lo
  // suyo. La Rioja y Lirios, con un solo tipo, siguen con una sola rejilla.
  const separarPorTipo = casasCount > 0 && deptosCount > 0;
  const grupos = separarPorTipo
    ? [
        // Casas PRIMERO, y es la pestana que se ve al entrar: decision de Florencio.
        {
          tipo: "casas",
          titulo: "Casas",
          verSolo: "las casas",
          props: properties.filter((p) => /^Casa\s/i.test(p.nombre_modelo)),
        },
        {
          tipo: "departamentos",
          titulo: "Departamentos",
          verSolo: "los departamentos",
          props: properties.filter((p) => /^Departamento\s/i.test(p.nombre_modelo)),
        },
      ]
    : [];

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
          // ⚠️ NO reponer aqui un nivel "Desarrollos en Cancún": apuntaba a
          // /#desarrollos, que es la MISMA pagina que "Inicio" con un ancla, asi
          // que la ruta llevaba dos escalones al mismo documento. Quitado el
          // 25 ago 2026 por decision de Florencio.
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: dev.name, item: pageUrl },
        ],
      },
      // El lugar, con coordenadas y enlace a su perfil de Google: el mismo
      // nodo que tiene /jardines-del-sur-7. Solo si el desarrollo trae `mapa`.
      ...(mapa
        ? [
            {
              "@type": "Residence",
              "@id": `${pageUrl}#residence`,
              name: dev.name,
              alternateName: mapa.placeName,
              description: dev.heroSubtitle,
              url: pageUrl,
              address: {
                "@type": "PostalAddress",
                streetAddress: mapa.street,
                addressLocality: "Cancún",
                addressRegion: "Quintana Roo",
                postalCode: mapa.postalCode,
                addressCountry: "MX",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: mapa.geo.lat,
                longitude: mapa.geo.lng,
              },
              telephone: `+${PHONE_E164}`,
              hasMap: mapa.placeUrl,
              sameAs: [mapa.placeUrl, mapa.url],
            },
          ]
        : []),
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

      <nav className={styles.anchorNav} aria-label={`Secciones de ${dev.name}`}>
        <div className={`container ${styles.anchorNavInner}`}>
          <a href="#modelos">Modelos</a>
          {dev.promos && <a href={`/${dev.slug}/promociones`}>Promociones</a>}
          <a href="#amenidades">Amenidades</a>
          {location && <a href="#ubicacion">Ubicación</a>}
          <a href="#contacto">Contacto</a>
        </div>
      </nav>

      <section id="modelos" className={styles.modelsSection} style={{ scrollMarginTop: "110px" }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="text-accent">Inventario y Precios</span>
            <h2>Modelos disponibles en {dev.name}</h2>
            <p>
              Recorridos virtuales 360°, precios actualizados y atención directa por WhatsApp.
            </p>
          </div>

          {separarPorTipo ? (
            <SiloTiposTabs
              tabs={grupos.map((g) => {
                const precios = g.props.map((p) => p.precio).filter((n) => n > 0);
                const desde = precios.length ? Math.min(...precios) : null;
                const n = g.props.length;
                return {
                  id: g.tipo,
                  label: g.titulo,
                  // Separados para que el precio nunca se parta de su "desde".
                  modelos: `${n} ${n === 1 ? "modelo" : "modelos"}`,
                  desde: desde !== null ? `desde $${desde.toLocaleString("es-MX")}` : null,
                  content: (
                    <>
                      {/* De 2 en 2: las 4 casas quedan 2x2 y no 3 arriba y 1 abajo. */}
                      <div className={`${styles.modelsGrid} ${styles.modelsGridDos}`}>
                        {g.props.map((property) => (
                          <PropertyCard key={property.id} property={property} />
                        ))}
                      </div>
                      {/* La subpagina /casas y /departamentos solo existe en Jardines 6.
                          Si otro desarrollo estrena los dos tipos, hay que crearla antes
                          de quitar esta condicion, o el enlace da 404. */}
                      {dev.slug === "jardines-del-sur-6" && (
                        <p className={styles.modelsGroupLinkWrap}>
                          <a className={styles.modelsGroupLink} href={`/${dev.slug}/${g.tipo}`}>
                            Ver solo {g.verSolo} de {dev.name} →
                          </a>
                        </p>
                      )}
                    </>
                  ),
                };
              })}
            />
          ) : (
            <div className={styles.modelsGrid}>
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {properties.length > 0 && (
            <div className={styles.modelLinks}>
              <span className={styles.modelLinksLabel}>
                Ver ficha completa de cada modelo:
              </span>
              <ul className={styles.modelLinksList}>
                {properties.map((property) => (
                  <li key={property.id}>
                    <a
                      href={`/${dev.slug}/${slugifyModel(property.nombre_modelo)}`}
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

      {/* Con mapa, el ancla "Ubicación" del menú va a la sección del mapa. */}
      <section
        id={mapa ? undefined : "ubicacion"}
        className={styles.aboutSection}
        style={{ scrollMarginTop: "110px" }}
      >
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

      {/* Ubicación con mapa, espejo de la de /jardines-del-sur-7. Va después de
          amenidades: el mismo orden que el menú de anclas. */}
      {mapa && mapaEmbed && (
        <section id="ubicacion" className={styles.ubicacion}>
          <div className="container">
            <span className={styles.ubicacionEyebrow}>Dónde está</span>
            <h2>Ubicación de {dev.name}</h2>

            <div className={styles.ubicacionGrid}>
              <MapEmbedCard embedSrc={mapaEmbed} title={`Mapa de ${dev.name}, Cancún`} />

              <div>
                <p className={styles.ubicacionLead}>
                  {mapa.lead.antes}
                  <strong>{mapa.lead.fuerte}</strong>
                  {mapa.lead.despues}
                </p>

                <ul className={styles.ubicacionList}>
                  {mapa.puntos.map((p) => (
                    <li key={p.titulo}>
                      <span aria-hidden="true">{p.icono}</span>
                      <div>
                        <strong>{p.titulo}</strong>
                        {p.detalle}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className={styles.ubicacionBtns}>
                  <a href={mapa.url} target="_blank" rel="noreferrer" className="btn btn-primary">
                    Cómo llegar
                  </a>
                  <a href={mapa.url} target="_blank" rel="noreferrer" className={styles.ubicacionLink}>
                    Ver el perfil en Google&nbsp;→
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Promociones AL FINAL, despues de amenidades. Arriba de los modelos
          distraian del inventario (decision de Florencio, 15 sept 2026). */}
      {dev.promos && (
        <div className="container" style={{ marginTop: "3rem", marginBottom: "3.5rem" }}>
          <a
            href={`/${dev.slug}/promociones`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              flexWrap: "wrap",
              background:
                "linear-gradient(135deg, #E8B43A 0%, #D19200 55%, #A37200 100%)",
              color: "#1a1204",
              textDecoration: "none",
              borderRadius: "1rem",
              padding: "1rem 1.4rem",
              fontWeight: 700,
              boxShadow: "0 16px 36px -14px rgba(214, 158, 46, 0.55)",
            }}
          >
            <span
              style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
            >
              <span style={{ fontSize: "1.3rem" }} aria-hidden="true">
                🏷️
              </span>
              Promociones del mes en {dev.name} — minisplits y descuentos
            </span>
            <span style={{ whiteSpace: "nowrap" }}>Ver promociones →</span>
          </a>
        </div>
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
          <p>
            &copy; 2026 Altta Homes by Grupo Sadasi. Todos los derechos reservados.
          </p>
          <FooterSocial />
        </div>
      </footer>

      <FloatingWhatsApp />
    </div>
  );
}
