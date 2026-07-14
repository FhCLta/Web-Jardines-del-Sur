"use client";

import React, { useEffect, useState } from "react";
import styles from "./Hero.module.css";

const DEFAULT_SLIDES = [
  "/optimized/hero/alberca-desktop.webp",
  "/optimized/hero/vista-aerea.webp",
  "/optimized/hero/area-infantil.webp",
  "/optimized/hero/terraza.webp",
];

const DEFAULT_MOBILE_IMAGE = "/optimized/hero/alberca-mobile.webp";

export default function HeroBackground({
  slides = DEFAULT_SLIDES,
  mobileImage = DEFAULT_MOBILE_IMAGE,
  gradientOnly = false,
  animationDuration,
}) {
  const [idx, setIdx] = useState(0);
  const [loadedCount, setLoadedCount] = useState(1);
  // En MÓVIL el hero es estático: no rotamos ni descargamos los slides
  // extra (~300 KB de imágenes desktop) — ahorra datos y limpia el LCP.
  const [isMobile, setIsMobile] = useState(true);
  const rotateSlides = !gradientOnly && slides.length > 1 && !isMobile;

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  useEffect(() => {
    if (!rotateSlides) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(t);
  }, [rotateSlides, slides.length]);

  useEffect(() => {
    if (!rotateSlides) return;
    const t = setTimeout(() => setLoadedCount(slides.length), 4200);
    return () => clearTimeout(t);
  }, [rotateSlides, slides.length]);

  if (gradientOnly || slides.length === 0) {
    return (
      <div className={styles.bgLayer}>
        <div className={styles.bgGradientFallback} aria-hidden="true" />
        <div className={styles.overlay} />
        <div className={styles.vignette} />
      </div>
    );
  }

  const slideStyle = animationDuration ? { animationDuration } : undefined;

  return (
    <div className={styles.bgLayer}>
      <picture
        className={`${styles.slide} ${styles.heroPicture} ${
          idx === 0 ? styles.slideActive : ""
        }`}
        style={slideStyle}
      >
        <source media="(max-width: 767px)" srcSet={mobileImage} />
        <img
          className={styles.heroImage}
          src={slides[0]}
          alt=""
          width="750"
          height="500"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
        />
      </picture>

      {slides.map((src, i) =>
        i === 0 ? null : i < loadedCount ? (
          <div
            key={src}
            className={`${styles.slide} ${i === idx ? styles.slideActive : ""}`}
            style={{
              backgroundImage: `url('${src}')`,
              ...(slideStyle || {}),
            }}
            aria-hidden="true"
          />
        ) : null
      )}
      <div className={styles.overlay} />
      <div className={styles.vignette} />
    </div>
  );
}
