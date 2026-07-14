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

// Carrusel LIGERO para móvil (home): variantes de ~600px (~35-40 KB c/u)
// que se montan tarde (post-load) para no competir con el LCP.
// Los silos no pasan mobileSlides → en móvil quedan con hero estático.
const DEFAULT_MOBILE_SLIDES = [
  DEFAULT_MOBILE_IMAGE,
  "/optimized/hero/vista-aerea-mobile.webp",
  "/optimized/hero/terraza-mobile.webp",
];

export default function HeroBackground({
  slides = DEFAULT_SLIDES,
  mobileImage = DEFAULT_MOBILE_IMAGE,
  mobileSlides = null,
  gradientOnly = false,
  animationDuration,
}) {
  const [idx, setIdx] = useState(0);
  const [loadedCount, setLoadedCount] = useState(1);
  const [isMobile, setIsMobile] = useState(true);

  const usingDefaults = slides === DEFAULT_SLIDES;
  const mobileList = mobileSlides || (usingDefaults ? DEFAULT_MOBILE_SLIDES : null);
  const activeSlides = isMobile ? mobileList || [mobileImage] : slides;
  const rotateSlides = !gradientOnly && activeSlides.length > 1;

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  useEffect(() => {
    if (!rotateSlides) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(t);
  }, [rotateSlides, activeSlides.length]);

  useEffect(() => {
    if (!rotateSlides) return;
    const t = setTimeout(() => setLoadedCount(activeSlides.length), 4200);
    return () => clearTimeout(t);
  }, [rotateSlides, activeSlides.length]);

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

      {activeSlides.map((src, i) =>
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
