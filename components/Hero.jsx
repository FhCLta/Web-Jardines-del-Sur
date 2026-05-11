"use client";

import React, { useEffect, useState } from "react";
import styles from "./Hero.module.css";

const SLIDES = [
  "/optimized/hero/alberca-desktop.webp",
  "/optimized/hero/vista-aerea.webp",
  "/optimized/hero/area-infantil.webp",
  "/optimized/hero/terraza.webp",
];

const HERO_MOBILE_IMAGE = "/optimized/hero/alberca-mobile.webp";

const WA_HREF =
  "https://wa.me/529982059044?text=Hola,%20quiero%20informacion%20de%20modelos%20y%20precios%20en%20Cancun.";

export default function Hero() {
  const [idx, setIdx] = useState(0);
  // Opción B: sólo carga la primera imagen al inicio; las demás se añaden cuando el browser está idle
  const [loadedCount, setLoadedCount] = useState(1);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const load = () => setLoadedCount(SLIDES.length);
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = window.requestIdleCallback(load, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    } else {
      const t = setTimeout(load, 300);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <section id="top" className={styles.hero}>
      <div className={styles.bgLayer}>
        <picture
          className={`${styles.slide} ${styles.heroPicture} ${
            idx === 0 ? styles.slideActive : ""
          }`}
        >
          <source media="(max-width: 767px)" srcSet={HERO_MOBILE_IMAGE} />
          <img
            className={styles.heroImage}
            src={SLIDES[0]}
            alt=""
            width="984"
            height="656"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>

        {SLIDES.map((src, i) =>
          i === 0 ? null :
          i < loadedCount ? (
            <div
              key={src}
              className={`${styles.slide} ${i === idx ? styles.slideActive : ""}`}
              style={{ backgroundImage: `url('${src}')` }}
              aria-hidden="true"
            />
          ) : null
        )}
        <div className={styles.overlay} />
        <div className={styles.vignette} />
      </div>

      <div className={`container ${styles.content}`}>
        <span className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          <strong>50 AÑOS</strong>
          <span className={styles.eyebrowSep}>·</span>
          GRUPO SADASI
          <span className={styles.eyebrowSep}>·</span>
          CANCÚN
        </span>

        <h1 className={styles.title}>
          <span className={styles.titleLine}>Casas y departamentos</span>
          <span className={styles.titleLine}>en Cancún</span>
          <em className={styles.trustTitle}>con el respaldo de Grupo Sadasi</em>
        </h1>

        <p className={styles.subtitle}>
          Casas y departamentos en <strong>Jardines del Sur 6</strong>,{" "}
          <strong>La Rioja 2</strong> y <strong>Lirios Residencial 2</strong>.
          Inventario actualizado, precios reales, informes en minutos.
        </p>

        <div className={styles.ctas}>
          <a href="#desarrollos" className={`btn btn-primary ${styles.ctaPrimary}`}>
            Ver Modelos y Precios
          </a>
          <a
            href={WA_HREF}
            className={`btn ${styles.ctaSecondary}`}
            target="_blank"
            rel="noreferrer"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.5 3.5A11.4 11.4 0 0012 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.7.9 3.7 1.4 5.8 1.4 6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.5-8.3zM12 21.8c-1.8 0-3.6-.5-5.2-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.7 9.7 0 01-1.5-5.2C2 6.5 6.5 2 12 2s10 4.5 10 10-4.5 9.8-10 9.8zm5.5-7.4c-.3-.2-1.8-.9-2-1s-.5-.2-.7.1-.8 1-1 1.2-.4.2-.7 0c-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5l.3-.4c0-.2.1-.3 0-.5l-.9-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4z" />
            </svg>
            Hablar con un asesor
          </a>
        </div>

        <div className={styles.trust}>
          <div className={styles.trustItem}>
            <strong>430,000+</strong>
            <span>Viviendas entregadas</span>
          </div>
          <div className={styles.trustDivider} aria-hidden="true" />
          <div className={styles.trustItem}>
            <strong>12</strong>
            <span>Estados</span>
          </div>
          <div className={styles.trustDivider} aria-hidden="true" />
          <div className={styles.trustItem}>
            <strong>15%</strong>
            <span>Plusvalía anual</span>
          </div>
        </div>
      </div>

      <a href="#modelos" className={styles.scrollHint} aria-label="Ver modelos">
        <span>SCROLL</span>
        <span className={styles.scrollArrow} aria-hidden="true" />
      </a>
    </section>
  );
}
