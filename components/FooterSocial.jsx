import styles from "./FooterSocial.module.css";

// Línea discreta del asesor, consistente en el footer de TODAS las páginas.
// Refuerza la consistencia NAP con los perfiles de Google Business ("Florencio Hurtado").
// Sin íconos de Facebook/Instagram desde el 3 nov 2026: la web se desconectó
// del portafolio de Meta "Florencio Real Estate" (ver docs/meta-desconexion.md).
export default function FooterSocial() {
  return (
    <div className={styles.advisor}>
      <span className={styles.name}>
        Florencio Hurtado <span className={styles.role}>· Asesor inmobiliario</span>
      </span>
    </div>
  );
}
