import styles from "./FooterSocial.module.css";

// Línea discreta del asesor, consistente en el footer de TODAS las páginas.
// Desde el 3 nov 2026 dice solo "Altta Homes Cancún" (decisión de Florencio:
// así se presenta también en su WhatsApp Business). Que el sitio es de un
// asesor autorizado lo siguen diciendo las descripciones y textos del sitio.
// Sin íconos de Facebook/Instagram desde el 3 nov 2026: la web se desconectó
// del portafolio de Meta "Florencio Real Estate" (ver docs/meta-desconexion.md).
export default function FooterSocial() {
  return (
    <div className={styles.advisor}>
      <span className={styles.name}>Altta Homes Cancún</span>
    </div>
  );
}
