"use client";

import styles from './AmenitiesSection.module.css';

const DEFAULT_ITEMS = [
  {
    img: "/optimized/amenidades/alberca.webp",
    label: "Alberca y Casa Club · Jardines del Sur",
    desc: "Alberca olímpica rodeada de jardines tropicales y casa club con área de convivencia",
    size: "large",
  },
  {
    img: "/optimized/amenidades/gimnasio1.webp",
    label: "Gimnasio Equipado",
    desc: "Maquinaria Technogym de última generación con ventanales al jardín",
    size: "tall",
  },
  {
    img: "/optimized/amenidades/area-infantil.webp",
    label: "Área Infantil",
    desc: "Juegos, columpios y resbaladillas bajo palmeras y cielo abierto",
    size: "normal",
  },
  {
    img: "/optimized/amenidades/cancha.webp",
    label: "Cancha Deportiva",
    desc: "Pasto sintético profesional para fútbol y actividades al aire libre",
    size: "normal",
  },
  {
    img: "/optimized/amenidades/gimnasio.webp",
    label: "Gimnasio · Exterior",
    desc: "Acceso directo desde los jardines con estacionamiento exclusivo para residentes",
    size: "normal",
  },
  {
    img: "/optimized/amenidades/vista-aerea.webp",
    label: "",
    desc: "",
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
  return (
    <section className={styles.section}>
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
            <div
              key={i}
              className={`${styles.tile} ${styles[`tile_${a.size}`]}`}
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
            </div>
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
    </section>
  );
}
