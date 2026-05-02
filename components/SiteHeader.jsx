"use client";

import React, { useEffect, useState } from "react";
import styles from "./SiteHeader.module.css";

const WA_HREF =
  "https://wa.me/529982059044?text=Hola,%20quiero%20informacion%20de%20modelos%20y%20precios%20en%20Cancun.";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
          <a href="#top" className={styles.logo} aria-label="AlttaHomes">
            <span className={styles.logoMain}>Altta</span>
            <span className={styles.logoAccent}>Homes</span>
          </a>

          <nav className={styles.navDesktop} aria-label="Navegación principal">
            <a href="#top">Inicio</a>
            <a href="#desarrollos">Modelos y Precios</a>
            <a href="#contacto">Contacto</a>
          </nav>

          <a href={WA_HREF} className={`btn btn-primary ${styles.ctaBtn}`}>
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
        <nav className={styles.drawerNav}>
          <a href="#top" onClick={closeAndGo}>
            <span className={styles.drawerNum}>01</span>Inicio
          </a>
          <a href="#desarrollos" onClick={closeAndGo}>
            <span className={styles.drawerNum}>02</span>Modelos y Precios
          </a>
          <a href="#contacto" onClick={closeAndGo}>
            <span className={styles.drawerNum}>03</span>Contacto
          </a>
        </nav>
        <a
          href={WA_HREF}
          className={`btn btn-primary ${styles.drawerCta}`}
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
