"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SiloTiposTabs.module.css";

/**
 * Selector Departamentos / Casas del silo de un desarrollo que vende los dos
 * (hoy solo Jardines del Sur 6). Mismo lenguaje visual que el selector de
 * desarrollos del inicio (DevelopmentTabs): barra clara, opcion activa en
 * blanco con aro dorado y flechita.
 *
 * ⚠️ Los DOS paneles vienen completos en el HTML y el inactivo solo se oculta
 * con `hidden`. No se cargan al hacer clic: asi Google sigue viendo los modelos
 * de la pestana cerrada. El contenido lo arma SiloPage en el servidor y llega
 * como prop (patron "interleaving" de Server y Client Components de Next).
 *
 * #modelos-casas o #modelos-departamentos en la URL abren esa pestana, para
 * poder compartir el enlace directo.
 */
export default function SiloTiposTabs({ tabs }) {
  const [activo, setActivo] = useState(tabs[0]?.id);
  const botones = useRef({});

  useEffect(() => {
    const desdeHash = () => {
      const m = window.location.hash.match(/^#modelos-([a-z]+)$/);
      if (m && tabs.some((t) => t.id === m[1])) {
        setActivo(m[1]);
        document.getElementById("modelos")?.scrollIntoView({ block: "start" });
      }
    };
    desdeHash();
    window.addEventListener("hashchange", desdeHash);
    return () => window.removeEventListener("hashchange", desdeHash);
  }, [tabs]);

  const elegir = (id, enfocar) => {
    setActivo(id);
    window.history.replaceState(null, "", `#modelos-${id}`);
    if (enfocar) botones.current[id]?.focus();
  };

  // Flechas izquierda/derecha entre pestanas: el patron de teclado de ARIA.
  const alTeclear = (e, i) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const paso = e.key === "ArrowRight" ? 1 : -1;
    elegir(tabs[(i + paso + tabs.length) % tabs.length].id, true);
  };

  return (
    <div className={styles.contenedor}>
      <div className={styles.selector} role="tablist" aria-label="Tipo de vivienda">
        {tabs.map((t, i) => {
          const esActivo = t.id === activo;
          return (
            <button
              key={t.id}
              ref={(el) => {
                botones.current[t.id] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={esActivo}
              aria-controls={`panel-${t.id}`}
              tabIndex={esActivo ? 0 : -1}
              className={`${styles.opcion} ${esActivo ? styles.opcionActiva : ""}`}
              onClick={() => elegir(t.id)}
              onKeyDown={(e) => alTeclear(e, i)}
            >
              <span className={styles.etiqueta}>{t.label}</span>
              {/* "4 modelos" y "desde $X" van en trozos que no se parten: en celular
                  se apilan en dos lineas en vez de dejar el precio solo abajo. */}
              <span className={styles.detalle}>
                <span className={styles.trozo}>{t.modelos}</span>
                {t.desde && (
                  <>
                    <span className={styles.separador} aria-hidden="true">
                      {" · "}
                    </span>
                    <span className={styles.trozo}>{t.desde}</span>
                  </>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={t.id !== activo}
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
