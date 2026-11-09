import SiteHeader from "@/components/SiteHeader";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FooterPhoneContact from "@/components/FooterPhoneContact";
import FooterSocial from "@/components/FooterSocial";
import ContactNavBtn from "@/components/ContactNavBtn";
import pageStyles from "@/app/page.module.css";
import styles from "./agendar.module.css";
import AgendarCita, { type Desarrollo, type Oficina } from "./AgendarCita";
import { HORARIO, rangoTexto } from "./horario";
import { DEVS } from "@/app/(desarrollos)/_lib/dev-content";
import { SITE_URL } from "@/lib/site";
import {
  PHONE_E164,
  OFFICE_ADDRESS,
  OFFICE_MAP_URL,
  OFFICE_STREET,
} from "@/lib/contacto";

// Contenido de las páginas de citas (9 nov 2026). Es un silo:
//   /agendar-cita                    → la general, con los cuatro desarrollos
//   /agendar-cita/<desarrollo>       → una por desarrollo, con su propio título
//   /cita/<clave>                    → links cortos de los perfiles de Google
//                                      (noindex; canonical a la del desarrollo)
// Google no acepta en "Reserva" un link directo a WhatsApp, pero sí una página
// propia donde el cliente elige día y hora. Detalle y plan B en
// docs/agendar-cita.md.

const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(
  "Hola, quiero agendar una cita para conocer las casas y departamentos de Altta Homes en Cancún."
)}`;

const rioja = DEVS["la-rioja-2"];
const RIOJA_DIRECCION = rioja.location?.value ?? "Av. 135 esq. Av. 127, 77536 Cancún, Q.R.";

const OFICINAS: Oficina[] = [
  {
    id: "jds6",
    nombre: "Oficina de Jardines del Sur 6",
    enMensaje: "la oficina de Jardines del Sur 6",
    direccion: OFFICE_ADDRESS,
    direccionMensaje: OFFICE_STREET,
    mapa: OFFICE_MAP_URL,
  },
  {
    id: "rioja",
    nombre: "Casas muestra de La Rioja 2",
    enMensaje: "las casas muestra de La Rioja 2",
    direccion: RIOJA_DIRECCION,
    direccionMensaje: rioja.mapa?.street ?? "Av. 135 esq. Av. 127",
    mapa: rioja.mapa?.url ?? "https://www.google.com/maps?cid=10624409005148155448",
  },
];

// Texto visible sin cortes feos: el nombre de un desarrollo nunca se parte en
// dos renglones ("Jardines del Sur / 6") y el párrafo no termina con una
// palabra sola. Solo para lo que se ve; títulos y descripciones van normales.
const legible = (t: string) =>
  t
    .replace(/Jardines del Sur \d|La Rioja 2|Lirios Residencial 2/g, (m) => m.replace(/ /g, "\u00a0"))
    .replace(/ (\S+)$/, "\u00a0$1");

const DESARROLLOS: Desarrollo[] = [
  { slug: "jardines-del-sur-6", nombre: "Jardines del Sur 6", oficina: "jds6" },
  {
    slug: "jardines-del-sur-7",
    nombre: "Jardines del Sur 7",
    oficina: "jds6",
    nota: legible("La obra de Jardines del Sur 7 no está abierta a visitas: te recibimos en la oficina de Jardines del Sur 6."),
  },
  { slug: "la-rioja-2", nombre: "La Rioja 2", oficina: "rioja" },
  {
    slug: "lirios-residencial-2",
    nombre: "Lirios Residencial 2",
    oficina: null,
    nota: legible("La oficina de Lirios Residencial 2 abre próximamente. Mientras, elige en cuál de nuestras oficinas te recibimos."),
  },
  { slug: "aun-no-se", nombre: "Aún no lo decido", oficina: null },
];

type Pagina = {
  /** "Jardines del Sur 6" (en el silo de citas); vacío en la general. */
  nombre: string;
  titulo: string;
  descripcion: string;
  h1: string;
  intro: string;
  /** Oficinas que se muestran en "Dónde te recibimos". */
  oficinas: string[];
  lugar: string;
};

const PASOS = "Elige el día y la hora: se abre WhatsApp con tu cita ya escrita y te la confirmamos en ese mismo chat.";

const GENERAL: Pagina = {
  nombre: "",
  titulo: "Agendar cita en Altta Homes Cancún | Casas y departamentos",
  descripcion:
    "Agenda tu cita en Altta Homes Cancún: elige desarrollo, día y hora y envíala por WhatsApp. Te recibimos en las oficinas de Jardines del Sur 6 y La Rioja 2, de lunes a domingo.",
  h1: "Agenda tu cita",
  intro:
    "Elige el desarrollo, el día y la hora. Se abre WhatsApp con tu cita ya escrita y te la confirmamos en ese mismo chat.",
  oficinas: ["jds6", "rioja"],
  lugar:
    "En la oficina de Jardines del Sur 6 te atendemos para Jardines del Sur 6 y Jardines del Sur 7. En La Rioja 2 conoces sus casas muestra. Próximamente abriremos también oficina en Lirios Residencial 2.",
};

// Textos de cada desarrollo. Solo dicen lo que Florencio confirmó: dónde
// recibe a cada quien. ⚠️ Jardines del Sur 7: la obra NO se visita.
export const PAGINAS: Record<string, Pagina> = {
  "jardines-del-sur-6": {
    nombre: "Jardines del Sur 6",
    titulo: "Agendar cita en Jardines del Sur 6 | Altta Homes Cancún",
    descripcion:
      "Agenda tu cita para conocer las casas y departamentos de Jardines del Sur 6 en Cancún. Elige día y hora y envíala por WhatsApp. Te recibimos en la oficina del desarrollo, de lunes a domingo.",
    h1: "Agenda tu cita en Jardines del Sur 6",
    intro: `Te recibimos en la oficina de Jardines del Sur 6, en la Zona Sur de Cancún. ${PASOS}`,
    oficinas: ["jds6"],
    lugar:
      "La oficina está dentro del desarrollo, en la calle Tucán. Ahí te atendemos para conocer las casas y los departamentos de Jardines del Sur 6.",
  },
  "jardines-del-sur-7": {
    nombre: "Jardines del Sur 7",
    titulo: "Agendar cita para Jardines del Sur 7 | Altta Homes Cancún",
    descripcion:
      "Agenda tu cita para conocer Jardines del Sur 7 en Cancún: te recibimos en la oficina de Jardines del Sur 6, a medio kilómetro. Elige día y hora y envíala por WhatsApp.",
    h1: "Agenda tu cita para Jardines del Sur 7",
    intro: `La obra de Jardines del Sur 7 no está abierta a visitas: te recibimos en la oficina de Jardines del Sur 6, a medio kilómetro. ${PASOS}`,
    oficinas: ["jds6"],
    lugar:
      "En la oficina de Jardines del Sur 6 te damos toda la información de Jardines del Sur 7 y de su próxima apertura a la venta.",
  },
  "la-rioja-2": {
    nombre: "La Rioja 2",
    titulo: "Agendar cita en La Rioja 2 | Altta Homes Cancún",
    descripcion:
      "Agenda tu cita para conocer las casas muestra de La Rioja 2 en Cancún, en Av. 135 esq. Av. 127. Elige día y hora y envíala por WhatsApp; te confirmamos en el mismo chat.",
    h1: "Agenda tu cita en La Rioja 2",
    intro: `Te recibimos en las casas muestra y la oficina de La Rioja 2, en Av. 135 esquina con Av. 127. ${PASOS}`,
    oficinas: ["rioja"],
    lugar:
      "Las casas muestra y la oficina de ventas están en Av. 135 esquina con Av. 127. El residencial está junto a Jardines del Sur 6.",
  },
  "lirios-residencial-2": {
    nombre: "Lirios Residencial 2",
    titulo: "Agendar cita para Lirios Residencial 2 | Altta Homes Cancún",
    descripcion:
      "Agenda tu cita para conocer los departamentos de Lirios Residencial 2 en Cancún. Elige día, hora y oficina y envíala por WhatsApp; te confirmamos en el mismo chat.",
    h1: "Agenda tu cita para Lirios Residencial 2",
    intro: `La oficina de Lirios Residencial 2 abre próximamente. Mientras, te recibimos en la oficina de Jardines del Sur 6 o en las casas muestra de La Rioja 2. ${PASOS}`,
    oficinas: ["jds6", "rioja"],
    lugar:
      "Elige la oficina que te quede mejor. Próximamente abriremos también oficina en Lirios Residencial 2.",
  },
};

/** Título y descripción para la metadata de cada página del silo. */
export function textosDe(desarrollo?: string): { titulo: string; descripcion: string } {
  const p = (desarrollo && PAGINAS[desarrollo]) || GENERAL;
  return { titulo: p.titulo, descripcion: p.descripcion };
}

export default function PaginaCita({
  desarrollo,
  desdeGoogle = false,
}: {
  /** Slug del desarrollo de la página (y ya elegido en el calendario). */
  desarrollo?: string;
  desdeGoogle?: boolean;
}) {
  const pagina = (desarrollo && PAGINAS[desarrollo]) || GENERAL;
  const ruta = pagina === GENERAL ? "/agendar-cita" : `/agendar-cita/${desarrollo}`;
  const pageUrl = `${SITE_URL}${ruta}`;
  const oficinas = OFICINAS.filter((o) => pagina.oficinas.includes(o.id));
  const otros = Object.entries(PAGINAS).filter(([slug]) => slug !== desarrollo);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: pagina.titulo,
        description: pagina.descripcion,
        inLanguage: "es-MX",
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Agendar cita", item: `${SITE_URL}/agendar-cita` },
          ...(pagina.nombre
            ? [{ "@type": "ListItem", position: 3, name: pagina.nombre, item: pageUrl }]
            : []),
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
          <span className={styles.eyebrow}>
            Citas · {pagina.nombre || "Altta Homes Cancún"}
          </span>
          <h1>{pagina.h1}</h1>
          <p>{legible(pagina.intro)}</p>
        </div>
      </header>

      <section className={styles.seccion}>
        <div className="container">
          <AgendarCita
            oficinas={OFICINAS}
            desarrollos={DESARROLLOS}
            telefono={PHONE_E164}
            inicial={desarrollo}
            desdeGoogle={desdeGoogle}
          />
        </div>
      </section>

      <section className={styles.contenido}>
        <div className="container">
          <div className={styles.contenidoInner}>
            <h2>Dónde te recibimos</h2>
            <div className={styles.lugares}>
              {oficinas.map((o) => (
                <div key={o.id} className={styles.lugar}>
                  <h3>{o.nombre}</h3>
                  <p>{o.direccion}</p>
                  <a className={styles.lugarLink} href={o.mapa} target="_blank" rel="noreferrer">
                    Cómo llegar&nbsp;→
                  </a>
                </div>
              ))}
            </div>
            <p style={{ marginTop: "1rem" }}>{legible(pagina.lugar)}</p>

            <h2>Horario de citas</h2>
            <ul className={styles.horario}>
              <li>
                <strong>Lunes a sábado</strong>
                <span>{rangoTexto(HORARIO.semana)}</span>
              </li>
              <li>
                <strong>Domingo</strong>
                <span>{rangoTexto(HORARIO.domingo)}</span>
              </li>
            </ul>
            <p>
              {`Las citas son cada ${HORARIO.intervalo} minutos. `}Si el horario
              que elegiste ya está ocupado, te proponemos otro en el mismo chat
              de&nbsp;WhatsApp.
            </p>

            <h2>{pagina.nombre ? "Citas en otros desarrollos" : "Agenda por desarrollo"}</h2>
            <div className={styles.desarrollos}>
              {otros.map(([slug, p]) => (
                <a key={slug} className={styles.desarrolloLink} href={`/agendar-cita/${slug}`}>
                  {p.nombre}&nbsp;→
                </a>
              ))}
            </div>
            {pagina.nombre && desarrollo && (
              <p className={styles.verDesarrollo}>
                <a className={styles.lugarLink} href={`/${desarrollo}`}>
                  Conoce los modelos de {pagina.nombre}&nbsp;→
                </a>
              </p>
            )}
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
