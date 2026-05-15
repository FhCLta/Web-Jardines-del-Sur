"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./SiteHeader.module.css";

const WA_HREF =
  "https://wa.me/529982059044?text=Hola,%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20las%20casas%20y%20departamentos%20de%20Altta%20Homes%20en%20Canc%C3%BAn.";

const SILO_LINKS = [
  { slug: "jardines-del-sur-6", name: "Jardines del Sur 6" },
  { slug: "la-rioja-2", name: "La Rioja 2" },
  { slug: "lirios-residencial-2", name: "Lirios Residencial 2" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() ?? "";
  const isSilo = pathname.startsWith("/desarrollos-cancun/");
  const currentSlug = isSilo
    ? pathname.slice("/desarrollos-cancun/".length).replace(/\/$/, "")
    : null;
  const currentDev = isSilo
    ? SILO_LINKS.find((s) => s.slug === currentSlug)
    : null;
  const otherSilos = isSilo
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
          <a href="/#top" className={styles.logo} aria-label="AlttaHomes">
            <span className={styles.logoMain}>Altta</span>
            <span className={styles.logoAccent}>Homes</span>
          </a>

          {!isSilo && (
            <nav className={styles.navDesktop} aria-label="Navegación principal">
              <a href="/#top">Inicio</a>
              <a href="/#desarrollos">Modelos y Precios</a>
              <a href="/#contacto">Contacto</a>
            </nav>
          )}

          {isSilo && currentDev && (
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
              <span className={styles.headerBreadcrumbCurrent}>
                {currentDev.name}
              </span>
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
        {isSilo ? (
          <nav className={styles.drawerNav}>
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
                href={`/desarrollos-cancun/${silo.slug}`}
                onClick={closeAndGo}
              >
                <span className={styles.drawerNum}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {silo.name}
              </a>
            ))}
            <a href="/#contacto" onClick={closeAndGo}>
              <span className={styles.drawerNum}>
                {String(otherSilos.length + 1).padStart(2, "0")}
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
            <a href="/#contacto" onClick={closeAndGo}>
              <span className={styles.drawerNum}>03</span>Contacto
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
