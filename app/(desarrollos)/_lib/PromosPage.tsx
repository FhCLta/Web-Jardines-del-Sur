import SiteHeader from "@/components/SiteHeader";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FooterPhoneContact from "@/components/FooterPhoneContact";
import ContactNavBtn from "@/components/ContactNavBtn";
import pageStyles from "@/app/page.module.css";
import styles from "../promos.module.css";
import { DEVS, type DevSlug } from "./dev-content";
import { SITE_URL } from "@/lib/site";

const PHONE_E164 = "529982059044";
const OFFICE_ADDRESS = "Av. 127 SM 342 MZ 27, 77536 Cancún, Q.R.";
const OFFICE_MAP_URL = "https://maps.app.goo.gl/9sKBR1fUNSswv5d19";

const EVERGREEN = [
  {
    t: "Mejor precio y equipamiento de zona",
    d: "En la Zona Sur de Cancún: a 10 min del aeropuerto y a 500 metros de Av. Huayacán, con alberca, casa club, gimnasio y seguridad 24/7.",
  },
  {
    t: "Crédito bancario e Infonavit",
    d: "Te ayudamos a elegir el mejor esquema de financiamiento para tu perfil.",
  },
  {
    t: "Recorrido 360° y asesoría sin costo",
    d: "Conoce cada modelo y resuelve tus dudas directo por WhatsApp.",
  },
];

export default function PromosPage({ slug }: { slug: DevSlug }) {
  const dev = DEVS[slug];
  const promos = dev.promos;
  const waMsg = `Hola, vi las promociones de ${dev.name} en Cancún y quiero más información y disponibilidad.`;
  const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(waMsg)}`;
  const pageUrl = `${SITE_URL}/${dev.slug}/promociones`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: dev.name,
        item: `${SITE_URL}/${dev.slug}`,
      },
      { "@type": "ListItem", position: 3, name: "Promociones", item: pageUrl },
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
          backgroundImage: `linear-gradient(180deg, rgba(10,26,43,0.78) 0%, rgba(10,26,43,0.93) 100%), url("${dev.hero.slides[0]}")`,
        }}
      >
        <div className="container">
          <nav className={styles.crumbs} aria-label="Ruta de navegación">
            <a href="/">Inicio</a>
            <span aria-hidden="true">/</span>
            <a href={`/${dev.slug}`}>{dev.name}</a>
            <span aria-hidden="true">/</span>
            <strong>Promociones</strong>
          </nav>
          <span className={styles.eyebrow}>Promociones</span>
          <h1>Promociones en {dev.name}</h1>
          {promos?.updatedLabel && (
            <p className={styles.updated}>{promos.updatedLabel}</p>
          )}
          <p className={styles.lead}>
            Aprovecha las promociones y descuentos vigentes en casas y
            departamentos de {dev.name}, en la Zona Sur de Cancún. Consulta
            disponibilidad y requisitos con tu asesor autorizado de Altta Homes.
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className={styles.heroCta}
          >
            Pregunta por las promociones vigentes
          </a>
        </div>
      </header>

      <main className={`container ${styles.main}`}>
        {promos && promos.items.length > 0 ? (
          <section
            className={styles.promosSection}
            aria-label={`Promociones vigentes de ${dev.name}`}
          >
            <div className={styles.promoGrid}>
              {promos.items.map((item, i) => (
                <article key={i} className={styles.promoCard}>
                  {item.titulo && (
                    <span className={styles.promoTag}>{item.titulo}</span>
                  )}
                  <h2 className={styles.promoModel}>{item.modelo}</h2>
                  {item.ubicaciones && (
                    <p className={styles.promoUbic}>{item.ubicaciones}</p>
                  )}
                  <ul className={styles.promoBenefits}>
                    {item.beneficios.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                  <div className={styles.promoVigencia}>
                    <span>Vigencia</span> {item.vigencia}
                  </div>
                  <p className={styles.promoRestric}>Aplican restricciones</p>
                </article>
              ))}
            </div>
            {promos.nota && <p className={styles.nota}>{promos.nota}</p>}
          </section>
        ) : (
          <section className={styles.promosSection}>
            <p className={styles.noPromos}>
              En este momento no hay una promoción especial publicada, pero{" "}
              <strong>siempre tenemos beneficios para ti</strong>. Escríbenos y
              te contamos las promociones y planes vigentes del mes.
            </p>
          </section>
        )}

        <section
          className={styles.evergreen}
          aria-label="Beneficios permanentes"
        >
          <h2 className={styles.evergreenTitle}>
            Beneficios de comprar en {dev.name}
          </h2>
          <div className={styles.evergreenGrid}>
            {EVERGREEN.map((e, i) => (
              <div key={i} className={styles.evergreenItem}>
                <h3>{e.t}</h3>
                <p>{e.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.ctaBox}>
          <h2>¿Te interesa alguna promoción de {dev.name}?</h2>
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
            <a href={`/${dev.slug}`} className={styles.ctaSecondary}>
              Ver modelos y precios de {dev.name}
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
              Promociones y planes de financiamiento en {dev.name}, Polígono Sur
              de Cancún, con el respaldo de 50 años de Grupo Sadasi.
            </p>
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
