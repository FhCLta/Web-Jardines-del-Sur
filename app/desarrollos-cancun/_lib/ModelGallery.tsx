"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import styles from "../model.module.css";

export default function ModelGallery({
  images,
  modelName,
}: {
  images: string[];
  modelName: string;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const open = (i: number) => setLightboxIndex(i);
  const close = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? 0 : i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? 0 : i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const prev2 = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("lightbox-open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev2;
      document.body.classList.remove("lightbox-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIndex, prev, next]);

  return (
    <>
      <div className={styles.gallery}>
        {images.map((src, i) => (
          <div
            key={src}
            className={`${styles.galleryItem} ${i === 0 ? styles.galleryFeatured : ""}`}
            onClick={() => open(i)}
            role="button"
            tabIndex={0}
            aria-label={`Ver imagen ${i + 1} de ${modelName}`}
            onKeyDown={(e) => e.key === "Enter" && open(i)}
          >
            <Image
              src={src}
              alt={`${modelName} - imagen ${i + 1}`}
              fill
              sizes={i === 0 ? "(max-width: 640px) 100vw, 720px" : "(max-width: 640px) 100vw, 360px"}
              loading={i < 2 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {mounted && lightboxIndex !== null &&
        createPortal(
          <div className={styles.lbOverlay} onClick={close}>
            <button
              className={styles.lbClose}
              onClick={(e) => { e.stopPropagation(); close(); }}
              aria-label="Cerrar"
            >
              ×
            </button>

            <span className={styles.lbCounter}>
              {lightboxIndex + 1} / {images.length}
            </span>

            <div className={styles.lbContent} onClick={(e) => e.stopPropagation()}>
              <Image
                src={images[lightboxIndex]}
                alt={`${modelName} - imagen ${lightboxIndex + 1}`}
                fill
                sizes="100vw"
                className={styles.lbImage}
                priority
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  className={`${styles.lbNav} ${styles.lbNavLeft}`}
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  aria-label="Anterior"
                >
                  ‹
                </button>
                <button
                  className={`${styles.lbNav} ${styles.lbNavRight}`}
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  aria-label="Siguiente"
                >
                  ›
                </button>
              </>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
