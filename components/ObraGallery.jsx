'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import styles from './ObraGallery.module.css';

/**
 * Galería de avance de obra. Recibe `photos` = [{ src, full, alt, caption }].
 * `src` es la miniatura (640px) y `full` la versión de lightbox (1600px):
 * solo se descarga la grande cuando el visitante abre la foto.
 */
export default function ObraGallery({ photos, label }) {
  const [openIndex, setOpenIndex] = useState(null);
  const isOpen = openIndex !== null;

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      setOpenIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
    },
    [photos.length]
  );
  const next = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      setOpenIndex((i) => (i === photos.length - 1 ? 0 : i + 1));
    },
    [photos.length]
  );

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('lightbox-open');
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove('lightbox-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, close, prev, next]);

  return (
    <>
      <ul className={styles.grid}>
        {photos.map((photo, i) => (
          <li key={photo.src} className={i === 0 ? styles.tileFeatured : styles.tile}>
            <button
              type="button"
              className={styles.tileBtn}
              onClick={() => setOpenIndex(i)}
              aria-label={`Ampliar foto ${i + 1} de ${photos.length}: ${photo.caption}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={640}
                height={482}
                sizes={i === 0 ? '(max-width: 720px) 100vw, 50vw' : '(max-width: 720px) 50vw, 25vw'}
                className={styles.tileImg}
              />
              <span className={styles.tileCaption}>{photo.caption}</span>
              <span className={styles.tileZoom} aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5M11 8v6M8 11h6" />
                </svg>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {isOpen &&
        createPortal(
          <div className={styles.overlay} onClick={close} role="dialog" aria-modal="true" aria-label={label}>
            <button
              type="button"
              className={styles.close}
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              aria-label="Cerrar"
            >
              ×
            </button>

            <figure className={styles.stage} onClick={(e) => e.stopPropagation()}>
              <Image
                key={photos[openIndex].full}
                src={photos[openIndex].full}
                alt={photos[openIndex].alt}
                width={1600}
                height={1205}
                sizes="100vw"
                priority
                className={styles.stageImg}
              />
              {/* Contador a la izquierda: el botón flotante de WhatsApp vive
                  sobre el lightbox (regla de FloatingWhatsApp.module.css) y
                  taparía cualquier cosa alineada a la derecha. */}
              <figcaption className={styles.stageCaption}>
                <span>
                  {openIndex + 1} / {photos.length}
                </span>
                <strong>{photos[openIndex].caption}</strong>
              </figcaption>

              {photos.length > 1 && (
                <>
                  <button type="button" className={styles.navPrev} onClick={prev} aria-label="Foto anterior">
                    ‹
                  </button>
                  <button type="button" className={styles.navNext} onClick={next} aria-label="Foto siguiente">
                    ›
                  </button>
                </>
              )}
            </figure>
          </div>,
          document.body
        )}
    </>
  );
}
