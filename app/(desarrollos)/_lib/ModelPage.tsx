import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FooterPhoneContact from "@/components/FooterPhoneContact";
import FooterSocial from "@/components/FooterSocial";
import ContactNavBtn from "@/components/ContactNavBtn";
import ModelGallery from "./ModelGallery";
import ModelTour from "./ModelTour";
import pageStyles from "@/app/page.module.css";
import styles from "../model.module.css";
import { DEVS, type DevSlug } from "./dev-content";
import {
  slugifyModel,
  getInventory,
  parseStat,
  getModelType,
  formatPriceMxn,
  getWhatsAppMessageForModel,
} from "./model-utils";
import { SITE_URL } from "@/lib/site";
import NivelesTable from "./NivelesTable";
import { getVariantesDepartamentos, getModeloPrecios } from "@/lib/precios";

const PHONE_E164 = "529982059044";
const OFFICE_ADDRESS = "Av. 127 SM 342 MZ 27, 77536 Cancún, Q.R.";
const OFFICE_MAP_URL = "https://maps.app.goo.gl/9sKBR1fUNSswv5d19";

function getTourUrl(rawUrl: string): string | null {
  if (!rawUrl || rawUrl === "#") return null;
  try {
    const url = new URL(rawUrl);
    if (url.hostname.includes("matterport.com")) {
      url.searchParams.set("play", "1");
      url.searchParams.set("qs", "1");
      url.searchParams.set("wh", "0");
      url.searchParams.set("nt", "0");
    }
    return url.toString();
  } catch {
    return rawUrl;
  }
}

export default async function ModelPage({
  devSlug,
  modeloSlug,
}: {
  devSlug: DevSlug;
  modeloSlug: string;
}) {
  const dev = DEVS[devSlug];
  const inventory = getInventory();
  const property = inventory.find(
    (p) =>
      p.development === dev.name &&
      slugifyModel(p.nombre_modelo) === modeloSlug
  );

  if (!property) {
    notFound();
  }

  const otherProperties = inventory.filter(
    (p) =>
      p.development === dev.name &&
      slugifyModel(p.nombre_modelo) !== modeloSlug
  );

  const recamaras = parseStat(property.amenidades_key, /^([\d.]+)\s*Rec/i);
  const banos = parseStat(property.amenidades_key, /^([\d.]+)\s*Ba/i);
  const modelType = getModelType(property.nombre_modelo);
  const tourUrl = getTourUrl(property.url_recorrido_virtual);

  const pageUrl = `${SITE_URL}/${dev.slug}/${modeloSlug}`;
  const waMessage = getWhatsAppMessageForModel(property);
  const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(waMessage)}`;

  // Tabla de precios por nivel: solo los modelos de precio variable (hoy, los
  // departamentos) tienen algo que mostrar. `getModeloPrecios` traduce el id
  // del inventario al nombre que usa la lista de precios.
  const modeloPrecios = property.precio_variable ? getModeloPrecios(property.id) : null;
  const variantes = modeloPrecios ? getVariantesDepartamentos(dev.slug) : [];
  const tieneTablaNiveles =
    modeloPrecios !== null && variantes.some((v) => v.modelo === modeloPrecios);

  // JSON-LD: WebPage + BreadcrumbList + Residence + Offer
  const residenceType =
    modelType === "Departamento" ? "Apartment" : "SingleFamilyResidence";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${property.nombre_modelo} en ${dev.name}, Cancún`,
        description: `${property.nombre_modelo} en ${dev.name}, Cancún. ${property.metros_construccion} m² de construcción${recamaras ? `, ${recamaras} recámaras` : ""}${banos ? `, ${banos} baños` : ""}. Desde ${formatPriceMxn(property.precio)}.`,
        inLanguage: "es-MX",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#business` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE_URL}${property.images[0] || ""}`,
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
          {
            "@type": "ListItem",
            position: 2,
            name: dev.name,
            item: `${SITE_URL}/${dev.slug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: property.nombre_modelo,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": residenceType,
        "@id": `${pageUrl}#residence`,
        name: `${property.nombre_modelo} en ${dev.name}`,
        description: `${property.nombre_modelo} de Altta Homes en ${dev.name}, Cancún. ${property.metros_construccion} m² de construcción.`,
        floorSize: {
          "@type": "QuantitativeValue",
          value: property.metros_construccion,
          unitCode: "MTK",
        },
        ...(recamaras
          ? { numberOfBedrooms: parseFloat(recamaras) }
          : {}),
        ...(banos
          ? { numberOfBathroomsTotal: parseFloat(banos) }
          : {}),
        ...(property.metros_terreno
          ? {
              lotSize: {
                "@type": "QuantitativeValue",
                value: property.metros_terreno,
                unitCode: "MTK",
              },
            }
          : {}),
        address: {
          "@type": "PostalAddress",
          addressLocality: "Cancún",
          addressRegion: "Quintana Roo",
          addressCountry: "MX",
        },
        image: property.images.map((img) => `${SITE_URL}${img}`),
      },
      {
        "@type": "Offer",
        "@id": `${pageUrl}#offer`,
        name: property.nombre_modelo,
        price: property.precio,
        priceCurrency: "MXN",
        availability: "https://schema.org/InStock",
        url: pageUrl,
        itemOffered: { "@id": `${pageUrl}#residence` },
        seller: { "@id": `${SITE_URL}/#business` },
      },
    ],
  };

  const eyebrowMain =
    modelType === "Casa"
      ? `CASA RESIDENCIAL · ${dev.name.toUpperCase()}`
      : modelType === "Departamento"
      ? `DEPARTAMENTO · ${dev.name.toUpperCase()}`
      : `MODELO · ${dev.name.toUpperCase()}`;
  const eyebrowSub = "ZONA SUR CANCÚN";

  const strippedName = property.nombre_modelo.replace(/^(Casa|Departamento)\s+/i, "");
  const heroTitle = strippedName.toLowerCase().startsWith("modelo ")
    ? strippedName
    : `Modelo ${strippedName}`;

  return (
    <div className={styles.wrapper}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader />

      {/* HERO */}
      <section id="top" className={styles.modelHero}>
        <div className="container">
          <div className={styles.modelHeroInner}>
            <span className={`${styles.eyebrow} ${modelType === "Departamento" ? styles.eyebrowDepto : ""}`}>
              <span className={styles.eyebrowDot} aria-hidden="true" />
              <span className={styles.eyebrowMain}>{eyebrowMain}</span>
              <span className={styles.eyebrowSep} aria-hidden="true"> · </span>
              <span className={styles.eyebrowSub}>{eyebrowSub}</span>
            </span>

            <h1 className={styles.h1}>
              {heroTitle}
            </h1>


            {property.valor_avaluo ? (
              <div className={styles.heroPriceBlock}>
                <span className={styles.heroAvaluoLine}>
                  <span className={styles.heroAvaluoLabel}>Valor avalúo</span>
                  <span className={styles.heroAvaluoAmount}>
                    ${property.valor_avaluo.toLocaleString("es-MX")} MXN
                  </span>
                </span>
                <span className={styles.heroPriceLabel}>
                  {property.precio_variable
                    ? "Precio con descuento desde"
                    : "Precio con descuento"}
                </span>
                <span className={styles.heroPriceAmount}>
                  ${property.precio.toLocaleString("es-MX")}{" "}
                  <span className={styles.heroPriceCurrency}>MXN</span>
                </span>
                {property.precio_variable && (
                  <span className={styles.heroPriceNote}>
                    {/* Con la tabla en la página, la nota deja de abrir una
                        pregunta sin contestarla y baja a la respuesta. */}
                    {tieneTablaNiveles ? (
                      <a href="#precios-por-nivel">
                        ** El precio cambia según el nivel — ver todos los precios
                      </a>
                    ) : (
                      "** El precio puede variar según nivel y ubicación"
                    )}
                  </span>
                )}
              </div>
            ) : (
              <div className={styles.heroPriceBlock}>
                <span className={styles.heroPriceLabel}>Precio desde</span>
                <span className={styles.heroPriceAmount}>
                  ${property.precio.toLocaleString("es-MX")}{" "}
                  <span className={styles.heroPriceCurrency}>MXN</span>
                </span>
              </div>
            )}

            <div className={styles.heroCtas}>
              <a
                href={waHref}
                className="btn btn-primary"
                target="_blank"
                rel="noreferrer"
              >
                Cotizar este modelo
              </a>
              {tourUrl && (
                <a
                  href="#recorrido"
                  className={`btn ${styles.heroCtaSecondary}`}
                >
                  Ver recorrido virtual 360°
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      {property.images.length > 0 && (
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Fotos del modelo</h2>
              <p>
                Galería completa de {property.nombre_modelo}. Las imágenes
                muestran acabados de referencia.
              </p>
            </div>
            <ModelGallery images={property.images} modelName={property.nombre_modelo} />
          </div>
        </section>
      )}

      {/* DISTRIBUCIÓN */}
      {property.levels.length > 0 && (
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Distribución</h2>
              <p>
                Distribución completa del modelo {strippedName}.
              </p>
            </div>

            {/* Stats overview */}
            <div className={styles.distStats}>
              {recamaras && (
                <div className={styles.distStat}>
                  <svg className={styles.distStatIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 18v-5a3 3 0 013-3h12a3 3 0 013 3v5M3 18h18M6 10V7a2 2 0 012-2h8a2 2 0 012 2v3" />
                  </svg>
                  <span className={styles.distStatValue}>{recamaras}</span>
                  <span className={styles.distStatLabel}>recámaras</span>
                </div>
              )}
              {banos && (
                <div className={styles.distStat}>
                  <svg className={styles.distStatIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 12h16v3a4 4 0 01-4 4H8a4 4 0 01-4-4v-3zM6 12V6a2 2 0 012-2h1a2 2 0 012 2M16 19v2M8 19v2" />
                  </svg>
                  <span className={styles.distStatValue}>{banos}</span>
                  <span className={styles.distStatLabel}>baños</span>
                </div>
              )}
              <div className={styles.distStat}>
                <svg className={styles.distStatIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 11l9-8 9 8M5 9.5V21h14V9.5" />
                </svg>
                <span className={styles.distStatValue}>{property.metros_construccion}</span>
                <span className={styles.distStatLabel}>
                  {property.metros_construccion_variable ? "m² constr. (desde)" : "m² construcción"}
                </span>
              </div>
              {property.metros_terreno && (
                <div className={styles.distStat}>
                  <svg className={styles.distStatIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 21V7l9-4 9 4v14H3z M9 21V13h6v8" />
                  </svg>
                  <span className={styles.distStatValue}>{property.metros_terreno}</span>
                  <span className={styles.distStatLabel}>m² terreno</span>
                </div>
              )}
              {property.levels.length > 1 && (
                <div className={styles.distStat}>
                  <svg className={styles.distStatIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 21h18M5 21V11l3-3M19 21V11l-3-3M9 8h6" />
                  </svg>
                  <span className={styles.distStatValue}>{property.levels.length}</span>
                  <span className={styles.distStatLabel}>niveles</span>
                </div>
              )}
            </div>

            <div className={styles.levels}>
              {property.levels.map((level) => {
                const levelNames = ["Planta Baja", "Planta Alta", "Tercer Nivel"];
                const levelName =
                  property.levels.length === 1
                    ? "Espacios"
                    : levelNames[level.nivel - 1] || `Nivel ${level.nivel}`;
                return (
                  <div key={level.nivel} className={styles.levelBlock}>
                    <h3>{levelName}</h3>
                    <ul className={styles.levelList}>
                      {level.desc.split(",").map((item) => (
                        <li key={item.trim()}>{item.trim()}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* PRECIOS POR NIVEL — el abanico completo del modelo, no solo el gancho */}
      {tieneTablaNiveles && (
        <NivelesTable
          variantes={variantes}
          modelo={modeloPrecios!}
          waHref={waHref}
          showModelName={false}
        />
      )}

      {/* TOUR VIRTUAL */}
      {tourUrl && (
        <section
          id="recorrido"
          className={`${styles.section} ${styles.sectionAlt}`}
        >
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Recorrido virtual 360°</h2>
              <p>
                Camina virtualmente por {property.nombre_modelo} antes de
                visitarlo en sitio.
              </p>
            </div>
            <ModelTour
              tourUrl={tourUrl}
              previewImage={property.images[0]}
              modelName={property.nombre_modelo}
              development={property.development}
            />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.ctaBlock}>
            <div className={styles.ctaBlockText}>
              <h3>¿Te interesa {property.nombre_modelo}?</h3>
              <p>
                Recibe disponibilidad actual, formas de pago y agenda de visita
                directamente con un asesor de Altta Homes Cancún.
              </p>
            </div>
            <a
              href={waHref}
              className="btn btn-primary"
              target="_blank"
              rel="noreferrer"
            >
              Cotizar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* RELATED MODELS */}
      {otherProperties.length > 0 && (
        <section className={styles.related}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Otros modelos en {dev.name}</h2>
              <p>Compara con los demás modelos disponibles en el desarrollo.</p>
            </div>
            <div className={styles.relatedGrid}>
              {otherProperties.map((other) => (
                <a
                  key={other.id}
                  href={`/${dev.slug}/${slugifyModel(other.nombre_modelo)}`}
                  className={styles.relatedCard}
                >
                  <span className={styles.relatedCardLabel}>
                    {getModelType(other.nombre_modelo) || "Modelo"}
                  </span>
                  <span className={styles.relatedCardName}>
                    {"Modelo " + other.nombre_modelo.replace(/^(Casa|Departamento)\s+/i, "")}
                  </span>
                  <span className={styles.relatedCardPrice}>
                    Desde{" "}
                    <span className={styles.priceDisplay}>
                      <span className={styles.priceAmount}>
                        ${other.precio.toLocaleString("es-MX")}
                      </span>
                      <span className={styles.priceCurrency}>MXN</span>
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
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
              certificada <em style={{ whiteSpace: "nowrap" }}>Best Place to Live</em>.
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
                <a href={`/${dev.slug}`}>{dev.name}</a>
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
