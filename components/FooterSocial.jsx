import styles from "./FooterSocial.module.css";

const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61564048801892";
const INSTAGRAM_URL = "https://www.instagram.com/florenciorealestate";

// Línea discreta de asesor + redes, consistente en el footer de TODAS las páginas.
// Refuerza la consistencia NAP con los perfiles de Google Business ("Florencio Hurtado").
export default function FooterSocial() {
  return (
    <div className={styles.advisor}>
      <span className={styles.name}>
        Florencio Hurtado <span className={styles.role}>· Asesor inmobiliario</span>
      </span>
      <span className={styles.socials}>
        <a
          href={FACEBOOK_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook de Florencio Hurtado — Altta Homes"
          className={styles.icon}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
          </svg>
        </a>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram de Florencio Hurtado — Altta Homes"
          className={styles.icon}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
          </svg>
        </a>
      </span>
    </div>
  );
}
