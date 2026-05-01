"use client";

import styles from './AmenitiesSection.module.css';

const AMENITIES = [
  {
    img: "/jardines/Imagnes de amenidades y hero/alberca.webp",
    label: "Alberca",
    desc: "Área de natación y descanso para toda la familia",
    size: "large",
  },
  {
    img: "/larioja2/Imagnes de amenidades y hero/Terraza.webp",
    label: "Terraza Premium",
    desc: "Espacios al aire libre con vista panorámica",
    size: "tall",
  },
  {
    img: "/jardines/Imagnes de amenidades y hero/gimnasio.webp",
    label: "Gimnasio",
    desc: "Equipado para tu rutina diaria",
    size: "normal",
  },
  {
    img: "/jardines/Imagnes de amenidades y hero/cancha.webp",
    label: "Cancha Deportiva",
    desc: "Para los más activos del hogar",
    size: "normal",
  },
  {
    img: "/jardines/Imagnes de amenidades y hero/area de juego infantil.webp",
    label: "Área Infantil",
    desc: "Diversión segura para los pequeños",
    size: "normal",
  },
  {
    img: "/larioja2/Imagnes de amenidades y hero/Vista aerea.webp",
    label: "Vista Panorámica",
    desc: "Ubicación privilegiada en el corazón de Cancún",
    size: "wide",
  },
];

export default function AmenitiesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.bgGlow} aria-hidden="true" />
      <div className="container">
        <div className={styles.header}>
          <span className={styles.eyebrow}>Estilo de Vida · Grupo Sadasi</span>
          <h2 className={styles.title}>
            Amenidades que elevan<br />
            <em>tu calidad de vida</em>
          </h2>
          <p className={styles.subtitle}>
            Cada desarrollo incluye espacios diseñados para el bienestar, la convivencia y el descanso de toda tu familia.
          </p>
        </div>

        <div className={styles.grid}>
          {AMENITIES.map((a, i) => (
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

        <div className={styles.trustRow}>
          {[
            { num: "5,000+", label: "Familias con Sadasi" },
            { num: "30+", label: "Años de experiencia" },
            { num: "3", label: "Desarrollos activos" },
            { num: "4.9★", label: "Satisfacción de clientes" },
          ].map((t, i) => (
            <div key={i} className={styles.trustItem}>
              <span className={styles.trustNum}>{t.num}</span>
              <span className={styles.trustLabel}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
