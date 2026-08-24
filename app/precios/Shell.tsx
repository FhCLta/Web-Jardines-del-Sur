import SiteHeader from "@/components/SiteHeader";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FooterPhoneContact from "@/components/FooterPhoneContact";
import FooterSocial from "@/components/FooterSocial";
import ContactNavBtn from "@/components/ContactNavBtn";
import pageStyles from "@/app/page.module.css";

const OFFICE_ADDRESS = "Av. 127 SM 342 MZ 27, 77536 Cancún, Q.R.";
const OFFICE_MAP_URL = "https://maps.app.goo.gl/9sKBR1fUNSswv5d19";

/**
 * Armazon (encabezado + pie) del silo de precios.
 *
 * El pie del sitio esta copiado en 10 archivos — deuda tecnica ya anotada en
 * context.md. Estas dos paginas nuevas comparten uno solo en vez de sumar dos
 * copias mas. Cuando algun dia se extraiga un <SiteFooter /> unico, este es el
 * primer candidato a absorberse.
 */
export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}

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
              Precios actualizados de casas y departamentos en la Zona Sur de
              Cancún, con el respaldo de 50 años de Grupo Sadasi.
            </p>
          </div>
          <div className={pageStyles.footerLinks}>
            <h3>Navegación</h3>
            <ul>
              <li>
                <a href="/">Inicio</a>
              </li>
              <li>
                <a href="/precios">Precios</a>
              </li>
              <li>
                <a href="/promociones">Promociones</a>
              </li>
              <li>
                <a href="/calculadora-hipotecaria">Calculadora</a>
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
    </>
  );
}
