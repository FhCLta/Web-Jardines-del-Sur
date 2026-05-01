"use client";

import React from 'react';
import styles from './MobileStickyWhatsApp.module.css';

export default function MobileStickyWhatsApp() {
  return (
    <div className={styles.wrapper}>
      <a
        href="https://wa.me/529982059044?text=Hola,%20quiero%20informes%20de%20modelos%20y%20precios%20en%20Cancun."
        target="_blank"
        rel="noreferrer"
        className={styles.ctaBtn}
        aria-label="Informes por WhatsApp"
      >
        Informes por WhatsApp
      </a>
    </div>
  );
}