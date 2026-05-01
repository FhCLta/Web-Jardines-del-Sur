"use client";

import styles from './AmenitiesSection.module.css';

const AMENITIES = [
  {
    img: "/amenidades/alberca.webp",
    label: "Alberca y Casa Club · Jardines del Sur",
    desc: "Alberca olímpica rodeada de jardines tropicales y casa club con área de convivencia",
    size: "large",
  },
  {
    img: "/amenidades/gimnasio1.webp",
    label: "Gimnasio Equipado",
    desc: "Maquinaria Technogym de última generación con ventanales al jardín",
    size: "tall",
  },
  {
    img: "/amenidades/area de juego infantil.webp",
    label: "Área Infantil",
    desc: "Juegos, columpios y resbaladillas bajo palmeras y cielo abierto",
    size: "normal",
  },
  {
    img: "/amenidades/cancha.webp",
    label: "Cancha Deportiva",
    desc: "Pasto sintético profesional para fútbol y actividades al aire libre",
    size: "normal",
  },
  {
    img: "/amenidades/gimnasio.webp",
    label: "Gimnasio · Exterior",
    desc: "Acceso directo desde los jardines con estacionamiento exclusivo para residentes",
    size: "normal",
  },
  {
    img: "/amenidades/Vista aerea1.webp",
    label: "Alberca y Casa Club · La Rioja 2",
    desc: "Vista aérea del complejo: alberca, casa club, jardines y áreas verdes integradas",
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
            { num: "430,000+", label: "Viviendas entregadas" },
            { num: "50", label: "Años de trayectoria" },
            { num: "12", label: "Estados y 16 ciudades" },
            { num: "2M+", label: "Personas en comunidades Sadasi" },
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
