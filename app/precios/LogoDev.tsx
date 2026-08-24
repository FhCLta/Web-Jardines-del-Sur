import Image from "next/image";
import { DEVS, type DevSlug } from "@/app/(desarrollos)/_lib/dev-content";
import styles from "./precios.module.css";

/**
 * Logo del desarrollo, encima del titulo del bloque.
 *
 * Va ARRIBA del "<desarrollo> — desde $X" a peticion de Florencio: la lista se
 * comparte por WhatsApp y asi lo primero que se ve es de quien es la lista, no
 * una cifra suelta.
 *
 * Alto fijo y ancho automatico: los tres logos miden 128px de alto pero
 * distinto ancho (400, 260 y 190), asi que fijar el ancho los deformaria.
 */
export default function LogoDev({ slug }: { slug: DevSlug }) {
  const dev = DEVS[slug];
  return (
    <div className={styles.logoWrap}>
      <Image
        src={dev.logo}
        alt={dev.name}
        width={400}
        height={128}
        className={styles.logo}
      />
    </div>
  );
}
