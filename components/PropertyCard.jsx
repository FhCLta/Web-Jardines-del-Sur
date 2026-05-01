"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import VirtualTourModal from './VirtualTourModal';
import styles from './PropertyCard.module.css';

export default function PropertyCard({ property }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setIsLightboxOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isLightboxOpen]);

  const images = property.images && property.images.length > 0 
    ? property.images 
    : ['/placeholder-jds.jpg'];

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const getWhatsAppText = () => {
    let nameLower = property.nombre_modelo.toLowerCase();
    let text = property.nombre_modelo;
    let prefix = "la propiedad";
    
    if (nameLower.startsWith("casa modelo ")) {
      prefix = "la casa modelo";
      text = property.nombre_modelo.substring(12);
    } else if (nameLower.startsWith("casa ")) {
      prefix = "la casa modelo";
      text = property.nombre_modelo.substring(5);
    } else if (nameLower.startsWith("departamento modelo ")) {
      prefix = "el departamento modelo";
      text = property.nombre_modelo.substring(20);
    } else if (nameLower.startsWith("departamento ")) {
      prefix = "el departamento modelo";
      text = property.nombre_modelo.substring(13);
    }

    return `Hola, quiero cotizar ${prefix} ${text} en ${property.development}.`;
  };

  // Parsea amenidades clave para extraer recámaras y baños
  const parseStat = (regex) => {
    const found = (property.amenidades_key || []).find((a) => regex.test(a));
    if (!found) return null;
    const match = found.match(regex);
    return match ? match[1] : null;
  };
  const recamaras = parseStat(/^([\d.]+)\s*Rec/i);
  const banos = parseStat(/^([\d.]+)\s*Ba/i);
  const isJardinesCard = property.development === "Jardines del Sur 6";
  const headerMatch = property.nombre_modelo.match(/^(Departamento|Casa)\s+(.+)$/i);
  const hasSplitHeader = Boolean(headerMatch);
  const modelType = headerMatch ? headerMatch[1] : "";
  const modelName = headerMatch ? headerMatch[2].trim() : "";

  return (
    <>
      <div className={`${styles.card} glass`}>
        <div className={styles.imageContainer} onClick={() => setIsLightboxOpen(true)}>
          <div 
            className={styles.imageBackground} 
            style={{ 
              backgroundImage: `url('${images[currentImgIndex]}')`
            }}
          />
          <div className={styles.imageForeground}>
            <Image
              src={images[currentImgIndex]}
              alt={`${property.nombre_modelo} - imagen ${currentImgIndex + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              style={{ objectFit: 'contain' }}
              priority={currentImgIndex === 0}
            />
          </div>
          {property.status && (
            <span className={styles.statusBadge}>{property.status}</span>
          )}
          {images.length > 1 && (
            <>
              <button className={styles.carouselBtnLeft} onClick={handlePrev}>‹</button>
              <button className={styles.carouselBtnRight} onClick={handleNext}>›</button>
              <div className={styles.dots}>
                {images.map((_, idx) => (
                  <span key={idx} className={`${styles.dot} ${idx === currentImgIndex ? styles.activeDot : ''}`} />
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className={styles.content}>
          {hasSplitHeader ? (
            <div className={`${styles.header} ${styles.headerSplit}`}>
              <span className={styles.modelType}>{modelType}</span>
              <span className={styles.priceLabelTop}>Desde</span>
              <h3 className={styles.modelNameTitle}>{modelName}</h3>
              <span className={styles.priceBottom}>
                ${property.precio.toLocaleString('es-MX')}
              </span>
            </div>
          ) : (
            <div className={styles.header}>
              <h3>{property.nombre_modelo}</h3>
              <span className={styles.priceBlock}>
                <span className={styles.priceLabel}>Desde</span>
                <span className={styles.price}>
                  ${property.precio.toLocaleString('es-MX')}
                </span>
              </span>
            </div>
          )}

          <div className={styles.statsRow}>
            {property.metros_terreno && (
              <div className={styles.stat}>
                <svg className={styles.statIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 3v18" />
                </svg>
                <span className={styles.statValue}>{property.metros_terreno}</span>
                <span className={styles.statUnit}>m² terreno</span>
              </div>
            )}
            <div className={styles.stat}>
              <svg className={styles.statIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 11l9-8 9 8M5 9.5V21h14V9.5" />
              </svg>
              <span className={styles.statValue}>{property.metros_construccion}</span>
              <span className={styles.statUnit}>m² construcción</span>
            </div>
            {recamaras && (
              <div className={styles.stat}>
                <svg className={styles.statIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 18v-5a3 3 0 013-3h12a3 3 0 013 3v5M3 18h18M6 10V7a2 2 0 012-2h8a2 2 0 012 2v3" />
                </svg>
                <span className={styles.statValue}>{recamaras}</span>
                <span className={styles.statUnit}>recámaras</span>
              </div>
            )}
            {banos && (
              <div className={styles.stat}>
                <svg className={styles.statIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 12h16v3a4 4 0 01-4 4H8a4 4 0 01-4-4v-3zM6 12V6a2 2 0 012-2h1a2 2 0 012 2M16 19v2M8 19v2" />
                </svg>
                <span className={styles.statValue}>{banos}</span>
                <span className={styles.statUnit}>baños</span>
              </div>
            )}
          </div>

          <div className={styles.levels}>
            <h4>Distribución:</h4>
            <ul>
              {property.levels && property.levels.map((level, i) => (
                <li key={i}><strong>Nivel {level.nivel}:</strong> {level.desc}</li>
              ))}
            </ul>
          </div>

          <div className={styles.cardActions}>
            <button 
              className={`btn btn-secondary ${styles.actionBtn}`}
              onClick={() => setIsModalOpen(true)}
            >
              Visita Virtual
            </button>
            <a 
              className={`btn btn-primary ${styles.actionBtn}`}
              href={`https://wa.me/529982059044?text=${encodeURIComponent(getWhatsAppText())}`}
              target="_blank"
              rel="noreferrer"
            >
              Cotizar
            </a>
          </div>

          {isJardinesCard && (
            <div className={styles.legalLegend}>
              <p><strong>*</strong> No incluye gastos de escrituracion.</p>
              <p><strong>**</strong> Actualizacion a febrero del 2026.</p>
              <p><strong>***</strong> Lote tipo. Esquina o con terreno excedente varia el costo.</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <VirtualTourModal 
          onClose={() => setIsModalOpen(false)} 
          property={property} 
        />
      )}

      {isLightboxOpen && mounted && createPortal(
        <div className={styles.lightboxOverlay} onClick={() => setIsLightboxOpen(false)}>
          <button
            className={styles.lightboxClose}
            onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); }}
            aria-label="Cerrar"
          >
            ×
          </button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img 
              src={images[currentImgIndex]} 
              alt={`Imagen ${currentImgIndex + 1} de ${property.nombre_modelo}`} 
              className={styles.lightboxImage} 
            />
            {images.length > 1 && (
              <>
                <button className={styles.lightboxBtnLeft} onClick={handlePrev}>‹</button>
                <button className={styles.lightboxBtnRight} onClick={handleNext}>›</button>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
