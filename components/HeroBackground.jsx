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

export default function HeroBackground() {
  const [idx, setIdx] = useState(0);
  const [loadedCount, setLoadedCount] = useState(1);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoadedCount(SLIDES.length), 4200);
    return () => clearTimeout(t);
  }, []);

  return (
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
          width="750"
          height="500"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
        />
      </picture>

      {SLIDES.map((src, i) =>
        i === 0 ? null : i < loadedCount ? (
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
  );
}
