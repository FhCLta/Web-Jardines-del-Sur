import styles from "./FooterSocial.module.css";

// Línea discreta del asesor, consistente en el footer de TODAS las páginas.
// Desde el 3 nov 2026 dice "Altta Homes Cancún" en vez de "Florencio Hurtado"
// (decisión de Florencio). "Asesor inmobiliario" se queda: aclara que el sitio
// es de un asesor y no el sitio oficial del desarrollador.
// Sin íconos de Facebook/Instagram desde el 3 nov 2026: la web se desconectó
// del portafolio de Meta "Florencio Real Estate" (ver docs/meta-desconexion.md).
export default function FooterSocial() {
  return (
    <div className={styles.advisor}>
      <span className={styles.name}>
        Altta Homes Cancún <span className={styles.role}>· Asesor inmobiliario</span>
      </span>
    </div>
  );
}
