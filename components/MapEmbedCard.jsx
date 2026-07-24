'use client';

import React, { useState } from 'react';
import styles from './MapEmbedCard.module.css';

/**
 * Mapa de Google que NO se carga hasta que el visitante lo pide.
 * Hasta el clic no se descarga nada de terceros — cero costo en PageSpeed.
 */
export default function MapEmbedCard({ embedSrc, title }) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <div className={styles.frame}>
        <iframe
          src={embedSrc}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className={styles.iframe}
        />
      </div>
    );
  }

  return (
    <button type="button" className={styles.placeholder} onClick={() => setLoaded(true)}>
      <span className={styles.grid} aria-hidden="true" />
      <span className={styles.pin} aria-hidden="true">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
        </svg>
      </span>
      <span className={styles.cta}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
        Ver mapa interactivo
      </span>
      <span className={styles.note}>El mapa se carga solo si lo abres, para no hacer más lenta la página.</span>
    </button>
  );
}
