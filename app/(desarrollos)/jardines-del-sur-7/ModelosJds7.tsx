import PropertyCard from "@/components/PropertyCard";
import { getPropertiesByDev, getModelType, slugifyModel } from "../_lib/model-utils";
import styles from "./proximamente.module.css";

/* ===== Modelos de Jardines del Sur 7 =====
   Los usan la pagina principal (dentro del selector Casas | Departamentos) y
   las paginas /casas y /departamentos del 7, para que digan LO MISMO.

   Promesas aprobadas por Florencio (27 sept 2026) — no ir mas alla:
     - Tabachin y Noni: abren la preventa.
     - Flamboyan y Ceiba: CONFIRMADOS para el 7, llegan mas adelante. Tienen
       ficha propia en el 7 (`llega_despues` en inventory.json).
     - Departamentos (Capua y Cedro Plus): CONFIRMADOS para el 7 desde el
       3 nov 2026, igual que Flamboyan y Ceiba: llegan cuando se acaben los
       del 6. Ficha propia en el 7 (`llega_despues`).
   Las tarjetas del 6 se buscan por ID de inventario, nunca por nombre: Noni y
   Tabachin existen en varias etapas y no son el mismo producto. */
const jds7 = getPropertiesByDev("Jardines del Sur 7");
const jds6 = getPropertiesByDev("Jardines del Sur 6");
const porId = (ids: string[]) =>
  ids.map((id) => jds6.find((p) => p.id === id)).filter((p) => p !== undefined);

// Separados por TIPO: los departamentos del 7 tambien llevan `llega_despues`
// y no deben colarse en la lista de casas.
const casas7 = jds7.filter((p) => getModelType(p.nombre_modelo) === "Casa");
export const casasAbren = casas7.filter((p) => !p.llega_despues);
export const casasLlegan = casas7.filter((p) => p.llega_despues);
export const deptosLlegan = jds7.filter(
  (p) => p.llega_despues && getModelType(p.nombre_modelo) === "Departamento"
);
// Confirmados para el 7, llegan despues. Hoy se venden en el 6.
export const casasPuente = porId(["jds6-flamboyan", "jds6-ceiba"]);
// Confirmados para el 7, llegan despues. Hoy se venden en el 6.
export const deptosPuente = porId(["jds6-capua", "jds6-cedro-plus"]);

export function CasasJds7() {
  return (
    <>
      <h3 className={styles.grupoTitulo}>Con los que abre la preventa</h3>
      <div className={styles.modelosGrid}>
        {casasAbren.map((p) => (
          <div key={p.id} className={styles.modeloItem}>
            <PropertyCard property={p} />
            {/* Enlace a la ficha: es como Google llega a ella y como el
                visitante ve que ese modelo ya existe en Jardines del Sur 6. */}
            <a
              className={styles.modeloLink}
              href={`/jardines-del-sur-7/${slugifyModel(p.nombre_modelo)}`}
            >
              Ver el {p.nombre_modelo.replace(/^Casa\s+/i, "")} y dónde
              existe hoy →
            </a>
          </div>
        ))}
      </div>

      <div className={styles.grupoPuente}>
        <h3 className={styles.grupoTitulo}>
          Llegarán más adelante: Flamboyán y Ceiba
        </h3>
        <p className={styles.grupoNota}>
          También estarán en Jardines del Sur 7.{" "}
          <strong>Mientras tanto, disponibles hoy en Jardines del Sur 6.</strong>
        </p>
      </div>
      <div className={styles.modelosGrid}>
        {casasPuente.map((p) => (
          <div key={p.id} className={styles.modeloItem}>
            <span className={styles.etiquetaEtapa}>En Jardines del Sur 6</span>
            <PropertyCard property={p} origen="Jardines del Sur 7" />
            <a
              className={styles.modeloLink}
              href={`/jardines-del-sur-6/${slugifyModel(p.nombre_modelo)}`}
            >
              Ver la {p.nombre_modelo.replace(/^Casa\s+/i, "")} en Jardines
              del Sur 6 →
            </a>
          </div>
        ))}
      </div>
    </>
  );
}

export function DepartamentosJds7() {
  return (
    <>
      <div className={styles.grupoPuente}>
        <h3 className={styles.grupoTitulo}>
          Llegarán más adelante: Capua y Cedro Plus
        </h3>
        <p className={styles.grupoNota}>
          También estarán en Jardines del Sur 7.{" "}
          <strong>Mientras tanto, disponibles hoy en Jardines del Sur 6.</strong>
        </p>
      </div>
      <div className={styles.modelosGrid}>
        {deptosPuente.map((p) => (
          <div key={p.id} className={styles.modeloItem}>
            <span className={styles.etiquetaEtapa}>En Jardines del Sur 6</span>
            <PropertyCard property={p} origen="Jardines del Sur 7" />
            <a
              className={styles.modeloLink}
              href={`/jardines-del-sur-6/${slugifyModel(p.nombre_modelo)}`}
            >
              Ver el {p.nombre_modelo.replace(/^Departamento\s+/i, "")} en
              Jardines del Sur 6 →
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
