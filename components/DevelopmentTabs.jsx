"use client";

import React, { useState, useEffect, useRef } from 'react';
import PropertyCard from './PropertyCard';
import styles from './DevelopmentTabs.module.css';

const SLUG_BY_DEV = {
  "Jardines del Sur 6": "jardines-del-sur-6",
  "La Rioja 2": "la-rioja-2",
  "Lirios Residencial 2": "lirios-residencial-2",
};
const DEV_BY_SLUG = Object.fromEntries(
  Object.entries(SLUG_BY_DEV).map(([dev, slug]) => [slug, dev])
);

const parseHashSlug = () => {
  if (typeof window === "undefined") return null;
  const match = window.location.hash.match(/^#desarrollos(?:\/(.+))?$/);
  if (!match) return null;
  return match[1] ? decodeURIComponent(match[1]) : "";
};

export default function DevelopmentTabs({ inventoryData }) {
  const developments = ["Jardines del Sur 6", "La Rioja 2", "Lirios Residencial 2"];
  const [activeTab, setActiveTab] = useState(developments[0]);
  const activeTabRef = useRef(activeTab);
  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    const applyHash = () => {
      const slug = parseHashSlug();
      if (slug && DEV_BY_SLUG[slug]) {
        setActiveTab(DEV_BY_SLUG[slug]);
      } else if (slug === "") {
        const target = SLUG_BY_DEV[activeTabRef.current];
        if (target) {
          window.history.replaceState(null, "", `#desarrollos/${target}`);
        }
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const handleTabSelect = (dev) => {
    setActiveTab(dev);
    const slug = SLUG_BY_DEV[dev];
    if (slug) {
      window.history.replaceState(null, "", `#desarrollos/${slug}`);
    }
  };

  const DEV_META = {
    "Jardines del Sur 6": {
      image: "/optimized/dev-tabs/jardines-6.webp",
      tagline: "Familias y plusvalía",
      short: "Jardines 6",
    },
    "La Rioja 2": {
      image: "/optimized/dev-tabs/la-rioja-2.webp",
      tagline: "Exclusividad y confort",
      short: "La Rioja 2",
    },
    "Lirios Residencial 2": {
      image: "/optimized/dev-tabs/lirios-2.webp",
      tagline: "Próximamente",
      short: "Lirios 2",
    },
  };

  const activeProperties = inventoryData.filter(prop => prop.development === activeTab);
  const activePrices = activeProperties
    .map((property) => property.precio)
    .filter((price) => typeof price === 'number' && price > 0);
  const minPrice = activePrices.length > 0 ? Math.min(...activePrices) : null;

  const totalAvailable = activeProperties.filter((property) => property.status !== 'Próximamente').length;

  const formatPrice = (price) => {
    if (!price) return 'Precio por definir';
    return `$${price.toLocaleString('es-MX')} MXN`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.devSelector} role="tablist" aria-label="Selecciona desarrollo">
        {developments.map((dev) => {
          const meta = DEV_META[dev] || {};
          const isActive = activeTab === dev;
          return (
            <button
              key={dev}
              role="tab"
              aria-selected={isActive}
              className={`${styles.devCard} ${isActive ? styles.devCardActive : ''}`}
              onClick={() => handleTabSelect(dev)}
            >
              <div
                className={styles.devCardImage}
                style={{ backgroundImage: `url('${meta.image || ''}')` }}
                aria-hidden="true"
              />
              <span className={styles.devCardName}>{dev}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.tabPanel} role="tabpanel">
        <div className={styles.quickSummary}>
          <div className={styles.summaryCard}>
            <p>Desarrollo</p>
            <strong>{activeTab}</strong>
          </div>
          <div className={styles.summaryCard}>
            <p>Precio desde</p>
            <strong>{formatPrice(minPrice)}</strong>
          </div>
          <div className={styles.summaryCard}>
            <p>Modelos activos</p>
            <strong>{totalAvailable}</strong>
          </div>
        </div>

        <div className={styles.grid}>
          {activeProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        {activeProperties.length === 0 && (
          <div className={styles.emptyState}>
            <p>Próximamente más modelos disponibles.</p>
          </div>
        )}

        {SLUG_BY_DEV[activeTab] && (
          <div className={styles.siloLinkWrap}>
            <a
              className={styles.siloLink}
              href={`/${SLUG_BY_DEV[activeTab]}`}
            >
              <span>Ver página completa de {activeTab}</span>
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
