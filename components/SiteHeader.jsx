"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./SiteHeader.module.css";

const WA_HREF =
  "https://wa.me/529982059044?text=Hola,%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20las%20casas%20y%20departamentos%20de%20Altta%20Homes%20en%20Canc%C3%BAn.";

const SILO_LINKS = [
  { slug: "jardines-del-sur-6", name: "Jardines del Sur 6", shortName: "Jardines 6" },
  { slug: "la-rioja-2", name: "La Rioja 2", shortName: "La Rioja 2" },
  { slug: "lirios-residencial-2", name: "Lirios Residencial 2", shortName: "Lirios 2" },
  { slug: "jardines-del-sur-7", name: "Jardines del Sur 7", shortName: "Jardines 7" },
];

// Conservar acentos en los nombres de modelos para el breadcrumb del navbar.
// Los slugs no contienen acentos (slugify los remueve), por eso es necesario este mapa.
const MODEL_NAMES_BY_SLUG = {
  "casa-tabachin": "Casa Tabachín",
  "casa-ceiba": "Casa Ceiba",
  "casa-flamboyan": "Casa Flamboyán",
  "casa-noni": "Casa Noni",
  "casa-fresno-elite": "Casa Fresno Elite",
  "casa-modelo-alamo": "Casa Modelo Alamo",
  "casa-noni-elite": "Casa Noni Elite",
  "departamento-capua": "Departamento Capua",
  "departamento-cedro-plus": "Departamento Cedro Plus",
};

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() ?? "";
  // Slugs que viven en la raíz tras acortar las rutas (route group). Se detecta
  // el contexto de silo por slug, NO por prefijo de ruta.
  const SILO_PATH_SLUGS = [
    "jardines-del-sur-6",
    "la-rioja-2",
    "lirios-residencial-2",
    "jardines-del-sur-7",
  ];
  const pathSegments = pathname
    .slice(1)
    .replace(/\/$/, "")
    .split("/")
    .filter(Boolean);
  const currentSlug = pathSegments[0] || null;
  const currentModelSlug = pathSegments[1] || null;
  const isSiloPath = currentSlug != null && SILO_PATH_SLUGS.includes(currentSlug);
  const isModelPage = isSiloPath && Boolean(currentModelSlug);
  const isInSiloContext = isSiloPath; // Silo o página de modelo
  const currentDev = isInSiloContext
    ? SILO_LINKS.find((s) => s.slug === currentSlug)
    : null;
  const currentModelName = currentModelSlug
    ? MODEL_NAMES_BY_SLUG[currentModelSlug] || currentModelSlug
    : null;
  const otherSilos = isInSiloContext
    ? SILO_LINKS.filter((s) => s.slug !== currentSlug)
    : [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.body.classList.toggle("drawer-open", open);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("drawer-open");
    };
  }, [open]);

  const closeAndGo = () => setOpen(false);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <div className={`container ${styles.inner}`}>
          <a href="/#top" className={styles.logo} aria-label="Altta Homes Cancún">
            <span className={styles.logoWordmark}>
              <span className={styles.logoMain}>Altta</span>
              <span className={styles.logoAccent}>Homes</span>
            </span>
            <span className={styles.logoCity}>Cancún</span>
          </a>

          {!isInSiloContext && (
            <nav className={styles.navDesktop} aria-label="Navegación principal">
              <a href="/#top">Inicio</a>
              <a href="/#desarrollos">Modelos y Precios</a>
              <a href="/#amenidades">Amenidades</a>
              <a href="/calculadora-hipotecaria">Calculadora</a>
              <a href="/#contacto">Contacto</a>
            </nav>
          )}

          {isInSiloContext && currentDev && (
            <nav
              className={styles.headerBreadcrumb}
              aria-label="Breadcrumb"
            >
              <a href="/">Inicio</a>
              <span className={styles.headerBreadcrumbSep} aria-hidden="true">
                ›
              </span>
              <a href="/#desarrollos">Desarrollos</a>
              <span className={styles.headerBreadcrumbSep} aria-hidden="true">
                ›
              </span>
              {isModelPage ? (
                <>
                  <a href={`/${currentDev.slug}`}>
                    {currentDev.name}
                  </a>
                  <span
                    className={styles.headerBreadcrumbSep}
                    aria-hidden="true"
                  >
                    ›
                  </span>
                  <span className={styles.headerBreadcrumbCurrent}>
                    {currentModelName}
                  </span>
                </>
              ) : (
                <span className={styles.headerBreadcrumbCurrent}>
                  {currentDev.name}
                </span>
              )}
            </nav>
          )}

          <a
            href={WA_HREF}
            className={`btn btn-primary ${styles.ctaBtn}`}
            target="_blank"
            rel="noreferrer"
          >
            Informes WhatsApp
          </a>

          <button
            type="button"
            className={`${styles.burger} ${open ? styles.burgerOpen : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <div
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        {isInSiloContext ? (
          <nav className={styles.drawerNav}>
            {isModelPage && currentDev && (
              <a
                href={`/${currentDev.slug}`}
                onClick={closeAndGo}
                className={styles.drawerBack}
              >
                <span className={styles.drawerNum} aria-hidden="true">
                  ←
                </span>
                Volver a {currentDev.shortName || currentDev.name}
              </a>
            )}
            <a href="/" onClick={closeAndGo} className={styles.drawerBack}>
              <span className={styles.drawerNum} aria-hidden="true">
                ←
              </span>
              Volver al inicio
            </a>
            <div className={styles.drawerLabel}>Otros desarrollos</div>
            {otherSilos.map((silo, i) => (
              <a
                key={silo.slug}
                href={`/${silo.slug}`}
                onClick={closeAndGo}
              >
                <span className={styles.drawerNum}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {silo.name}
              </a>
            ))}
            <a
              href={
                currentDev
                  ? `/${currentDev.slug}#amenidades`
                  : "#amenidades"
              }
              onClick={closeAndGo}
            >
              <span className={styles.drawerNum}>
                {String(otherSilos.length + 1).padStart(2, "0")}
              </span>
              Amenidades
            </a>
            <a href="/calculadora-hipotecaria" onClick={closeAndGo}>
              <span className={styles.drawerNum}>
                {String(otherSilos.length + 2).padStart(2, "0")}
              </span>
              Calculadora
            </a>
            <a href="#contacto" onClick={closeAndGo}>
              <span className={styles.drawerNum}>
                {String(otherSilos.length + 3).padStart(2, "0")}
              </span>
              Contacto
            </a>
          </nav>
        ) : (
          <nav className={styles.drawerNav}>
            <a href="/#top" onClick={closeAndGo}>
              <span className={styles.drawerNum}>01</span>Inicio
            </a>
            <a href="/#desarrollos" onClick={closeAndGo}>
              <span className={styles.drawerNum}>02</span>Modelos y Precios
            </a>
            <a href="/#amenidades" onClick={closeAndGo}>
              <span className={styles.drawerNum}>03</span>Amenidades
            </a>
            <a href="/calculadora-hipotecaria" onClick={closeAndGo}>
              <span className={styles.drawerNum}>04</span>Calculadora
            </a>
            <a href="/#contacto" onClick={closeAndGo}>
              <span className={styles.drawerNum}>05</span>Contacto
            </a>
          </nav>
        )}
        <a
          href={WA_HREF}
          className={`btn btn-primary ${styles.drawerCta}`}
          target="_blank"
          rel="noreferrer"
          onClick={closeAndGo}
        >
          Informes por WhatsApp
        </a>
        <p className={styles.drawerFoot}>
          AlttaHomes · Grupo Sadasi
          <br />
          <span>Cancún, Quintana Roo</span>
        </p>
      </div>
    </>
  );
}
