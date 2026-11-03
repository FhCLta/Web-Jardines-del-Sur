import styles from "./FooterSocial.module.css";

// Línea discreta del asesor, consistente en el footer de TODAS las páginas.
// Desde el 3 nov 2026 dice "Altta Homes Cancún" en vez de "Florencio Hurtado"
// (decisión de Florencio). "Asesor autorizado" NO se quita: aclara que el sitio
// es de un asesor autorizado y no el sitio oficial de Altta Homes / Grupo
// Sadasi (regla de Google Ads contra suplantar marcas). Ni "Asesoría
// comercial": se lee como el área de ventas de la propia empresa.
// Sin íconos de Facebook/Instagram desde el 3 nov 2026: la web se desconectó
// del portafolio de Meta "Florencio Real Estate" (ver docs/meta-desconexion.md).
export default function FooterSocial() {
  return (
    <div className={styles.advisor}>
      <span className={styles.name}>
        Altta Homes Cancún <span className={styles.role}>· Asesor autorizado</span>
      </span>
    </div>
  );
}
