"use client";

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import styles from './AmenitiesSection.module.css';

const DEFAULT_ITEMS = [
  {
    img: "/optimized/amenidades/alberca.webp",
    label: "Alberca y Casa Club · Jardines del Sur 6",
    desc: "Alberca tipo resort rodeada de jardines tropicales y casa club para convivir.",
    size: "large",
  },
  {
    img: "/larioja2/amenidades/alberca.webp",
    label: "Alberca · La Rioja 2",
    desc: "Espejo de agua exclusivo en el residencial más premium de la Zona Sur.",
    size: "tall",
  },
  {
    img: "/jardines/amenidades/skate-park.webp",
    label: "Skate Park · Jardines del Sur 6",
    desc: "Pista profesional — amenidad única que diferencia a Jardines del Sur 6.",
    size: "normal",
  },
  {
    img: "/larioja2/amenidades/dog-park.webp",
    label: "Dog Park · La Rioja 2",
    desc: "Área privada para que tu mascota juegue y socialice con tranquilidad.",
    size: "normal",
  },
  {
    img: "/lirios/amenidades/pergolas.webp",
    label: "Pérgolas y Áreas de Reunión · Lirios 2",
    desc: "Espacios cubiertos diseñados para convivir con familia y amigos.",
    size: "normal",
  },
  {
    img: "/larioja2/amenidades/acceso.webp",
    label: "Acceso con Vigilancia 24/7 · La Rioja 2",
    desc: "Caseta de control de acceso con seguridad permanente para tu tranquilidad.",
    size: "wide",
  },
];

const DEFAULT_HEADER = {
  eyebrow: "Estilo de Vida · Grupo Sadasi",
  titleLine1: "Amenidades que elevan",
  titleEm: "tu calidad de vida",
  subtitle:
    "Cada desarrollo incluye espacios diseñados para el bienestar, la convivencia y el descanso de toda tu familia.",
};

const DEFAULT_TRUST = [
  { num: "430,000+", label: "Viviendas entregadas" },
  { num: "50", label: "Años de trayectoria" },
  { num: "12", label: "Estados y 16 ciudades" },
  { num: "2M+", label: "Personas en comunidades Sadasi" },
];

/**
 * @param {object} [props]
 * @param {Array<{img:string,label:string,desc:string,size:string}>} [props.items]
 * @param {{eyebrow:string,titleLine1:string,titleEm:string,subtitle:string}} [props.header]
 * @param {Array<{num:string,label:string}>} [props.trustItems]
 * @param {string[]} [props.extraAmenities]
 * @param {string[]} [props.equipment]
 */
export default function AmenitiesSection({
  items = DEFAULT_ITEMS,
  header = DEFAULT_HEADER,
  trustItems = DEFAULT_TRUST,
  extraAmenities,
  equipment,
} = {}) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const open = (i) => setLightboxIndex(i);
  const close = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? 0 : i === 0 ? items.length - 1 : i - 1
    );
  }, [items.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? 0 : i === items.length - 1 ? 0 : i + 1
    );
  }, [items.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("lightbox-open");
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove("lightbox-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIndex, prev, next]);

  return (
    <section id="amenidades" className={styles.section} style={{ scrollMarginTop: "110px" }}>
      <div className={styles.bgGlow} aria-hidden="true" />
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>{header.eyebrow}</span>
          <h2 className={styles.title}>
            {header.titleLine1}<br />
            <em>{header.titleEm}</em>
          </h2>
          <p className={styles.subtitle}>{header.subtitle}</p>
        </div>

        <div className={styles.grid}>
          {items.map((a, i) => (
            <button
              type="button"
              key={i}
              className={`${styles.tile} ${styles[`tile_${a.size}`]}`}
              onClick={() => open(i)}
              aria-label={`Ver ${a.label || 'imagen ' + (i + 1)} en grande`}
            >
              <div
                className={styles.tileImg}
                style={{ backgroundImage: `url('${a.img}')` }}
                aria-hidden="true"
              />
              <div className={styles.tileOverlay} aria-hidden="true" />
              <div className={styles.tileContent}>
                <strong className={styles.tileLabel}>{a.label}</strong>
                <span className={styles.tileDesc}>{a.desc}</span>
              </div>
            </button>
          ))}
        </div>

        {extraAmenities && extraAmenities.length > 0 && (
          <div className={styles.extraBlock}>
            <span className={styles.extraEyebrow}>Más amenidades incluidas</span>
            <ul className={styles.extraList}>
              {extraAmenities.map((item, i) => (
                <li key={i} className={styles.extraItem}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {equipment && equipment.length > 0 && (
          <div className={styles.equipmentBlock}>
            <span className={styles.equipmentEyebrow}>Equipamiento del desarrollo</span>
            <ul className={styles.equipmentList}>
              {equipment.map((item, i) => (
                <li key={i} className={styles.equipmentItem}>
                  <span className={styles.equipmentDot} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {trustItems && trustItems.length > 0 && (
          <div className={styles.trustRow}>
            {trustItems.map((t, i) => (
              <div key={i} className={styles.trustItem}>
                <span className={styles.trustNum}>{t.num}</span>
                <span className={styles.trustLabel}>{t.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {mounted && lightboxIndex !== null &&
        createPortal(
          <div className={styles.lbOverlay} onClick={close}>
            <button
              type="button"
              className={styles.lbClose}
              onClick={(e) => { e.stopPropagation(); close(); }}
              aria-label="Cerrar"
            >
              ×
            </button>

            <span className={styles.lbCounter}>
              {lightboxIndex + 1} / {items.length}
            </span>

            <div className={styles.lbContent} onClick={(e) => e.stopPropagation()}>
              <Image
                src={items[lightboxIndex].img}
                alt={items[lightboxIndex].label || `Amenidad ${lightboxIndex + 1}`}
                fill
                sizes="100vw"
                className={styles.lbImage}
                priority
              />
              {items[lightboxIndex].label && (
                <div className={styles.lbCaption}>
                  <strong>{items[lightboxIndex].label}</strong>
                  {items[lightboxIndex].desc && <span>{items[lightboxIndex].desc}</span>}
                </div>
              )}
            </div>

            {items.length > 1 && (
              <>
                <button
                  type="button"
                  className={`${styles.lbNav} ${styles.lbNavLeft}`}
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  aria-label="Anterior"
                >
                  ‹
                </button>
                <button
                  type="button"
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
    </section>
  );
}
