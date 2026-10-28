"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';
import styles from './PropertyCard.module.css';
import { conArticulo, agotadoDe } from "@/lib/texto-modelo";

const VirtualTourModal = dynamic(() => import('./VirtualTourModal'), {
  ssr: false,
  loading: () => null,
});

const FIRST_IMAGE_THUMBS = {
  '/jardines/Modelo Capua/1.webp': '/optimized/model-thumbs/jardines-Modelo-Capua-1.webp',
  '/jardines/Modelo Cedro Plus/1.webp': '/optimized/model-thumbs/jardines-Modelo-Cedro-Plus-1.webp',
  '/jardines/Modelo Flamboyan/1.webp': '/optimized/model-thumbs/jardines-Modelo-Flamboyan-1.webp',
  '/jardines/Modelo Ceiba/1.webp': '/optimized/model-thumbs/jardines-Modelo-Ceiba-1.webp',
  '/jardines/Modelo Tabachin/1.webp': '/optimized/model-thumbs/jardines-Modelo-Tabachin-1.webp',
  '/jardines/Modelo Noni/1.webp': '/optimized/model-thumbs/jardines-Modelo-Noni-1.webp',
  '/larioja2/Casa Fresno Elite/fachada.webp': '/optimized/model-thumbs/larioja2-Casa-Fresno-Elite-fachada.webp',
  '/larioja2/Casa Modelo Alamo/fachada.webp': '/optimized/model-thumbs/larioja2-Casa-Modelo-Alamo-fachada.webp',
  '/larioja2/Casa Noni Elite/fachada.webp': '/optimized/model-thumbs/larioja2-Casa-Noni-Elite-fachada.webp',
  '/larioja2/Casa noni/1.webp': '/optimized/model-thumbs/larioja2-Casa-noni-1.webp',
};

/**
 * `origen` (opcional): la pagina donde se muestra la tarjeta cuando NO es la de
 * su propio desarrollo. Se agrega al mensaje de WhatsApp para que Florencio sepa
 * de donde llego el cliente — p. ej. un Flamboyan de Jardines 6 mostrado en la
 * pagina de Jardines 7: el lead es del 6, pero llego buscando el 7.
 */
export default function PropertyCard({ property, origen = "" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('lightbox-open');
    const onKey = (e) => { if (e.key === 'Escape') setIsLightboxOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.body.classList.remove('lightbox-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [isLightboxOpen]);

  const images = property.images && property.images.length > 0 
    ? property.images 
    : ['/placeholder-jds.jpg'];
  const displayImage = currentImgIndex === 0
    ? FIRST_IMAGE_THUMBS[images[0]] || images[0]
    : images[currentImgIndex];

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

    return `Hola, quiero cotizar ${prefix} ${text} en ${property.development}.${origen ? ` Lo vi en la página de ${origen}.` : ""}`;
  };

  const formatPriceRaw = (price) => {
    if (!price) return 'Precio por definir';
    // Centavos solo si los hay, y entonces los dos: el neto del Noni Elite es
    // $4,446,997.50 y sin esto salia "4,446,997.5".
    const conCentavos = !Number.isInteger(price);
    return `$${price.toLocaleString('es-MX', {
      minimumFractionDigits: conCentavos ? 2 : 0,
      maximumFractionDigits: 2,
    })}`;
  };

  // Parsea amenidades clave para extraer recámaras y baños
  // Un solo punto por donde pasa TODO precio de la tarjeta: si no hay, se dice.
  const formatPrice = (price) =>
    price === null || price === undefined ? "Por anunciar" : formatPriceRaw(price);

  const parseStat = (regex) => {
    const found = (property.amenidades_key || []).find((a) => regex.test(a));
    if (!found) return null;
    const match = found.match(regex);
    return match ? match[1] : null;
  };
  const recamaras = parseStat(/^([\d.]+)\s*Rec/i);
  const banos = parseStat(/^([\d.]+)\s*Ba/i);
  const headerMatch = property.nombre_modelo.match(/^(Departamento|Casa)\s+(.+)$/i);
  const hasSplitHeader = Boolean(headerMatch);
  const modelType = headerMatch ? headerMatch[1] : "";
  const modelName = headerMatch ? headerMatch[2].trim() : "";

  // Lógica del label del precio:
  // - Si tiene valor_avaluo (descuento aplicado) → "Precio con descuento"
  // - Si es Departamento → "Desde" (precio variable por unidad)
  // - Si es Casa sin avalúo → sin label (solo el precio)
  // Un modelo agotado sigue publicado a proposito: su ficha conserva el valor
  // SEO que ya gano y su precio es la referencia para la etapa siguiente. Lo
  // que cambia es que NO se puede cotizar — igual que un descuento vencido.
  const agotado = property.status === "Agotado";

  // Modelo anunciado sin precio ni fotos todavia (Jardines del Sur 7). La
  // tarjeta se pinta igual que las demas, pero sin inventar lo que no hay:
  // banda diagonal donde ira la foto y "Por anunciar" donde ira el precio.
  const porAnunciar = property.precio === null;

  const hasDiscount = Boolean(property.valor_avaluo);
  const isDepartamento = modelType === "Departamento";
  const priceLabel = hasDiscount
    ? "Precio con descuento"
    : isDepartamento
    ? "Desde"
    : "";

  return (
    <>
      <div className={`${styles.card} glass`}>
        <div
          className={styles.imageContainer}
          onClick={porAnunciar ? undefined : () => setIsLightboxOpen(true)}
          style={porAnunciar ? { cursor: "default" } : undefined}
        >
          {porAnunciar && (
            <div className={styles.pendingArt} aria-hidden="true">
              <span className={styles.pendingRibbon}>Por anunciar</span>
            </div>
          )}
          {agotado && (
            <span className={`${styles.statusBadge} ${styles.statusBadgeAgotado}`}>
              Agotado
            </span>
          )}
          {!porAnunciar && <div className={styles.imageBackground} />}
          {!porAnunciar && (
          <div className={styles.imageForeground}>
            <Image
              src={displayImage}
              alt={`${property.nombre_modelo} - imagen ${currentImgIndex + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              style={{ objectFit: 'contain' }}
              loading="lazy"
            />
          </div>
          )}
          {!porAnunciar && images.length > 1 && (
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
          {hasDiscount ? (
            <div className={`${styles.header} ${styles.headerCentered}`}>
              <h3 className={styles.modelNameFull}>{property.nombre_modelo}</h3>
              <div className={styles.priceAvaluoCentered}>
                <span className={styles.priceAvaluoLabel}>Valor avalúo</span>
                <span className={styles.priceAvaluoAmount}>{formatPrice(property.valor_avaluo)} MXN</span>
              </div>
              <div className={styles.priceFinalRow}>
                <span className={styles.priceFinalLabel}>
                  {property.precio_variable ? "Precio con descuento desde" : "Precio con descuento"}
                </span>
                <span className={styles.priceFinalAmount}>{formatPrice(property.precio)}</span>
              </div>
            </div>
          ) : hasSplitHeader ? (
            <div className={`${styles.header} ${styles.headerSplit} ${porAnunciar ? styles.headerPorAnunciar : ""}`}>
              <div className={styles.titleCol}>
                <span className={styles.modelType}>{modelType}</span>
                <h3 className={styles.modelNameTitle}>{modelName}</h3>
              </div>
              <div className={styles.priceCol}>
                {priceLabel && (
                  <span className={styles.priceLabelTop}>{priceLabel}</span>
                )}
                <span className={styles.priceBottom}>
                  {formatPrice(property.precio)}
                </span>
              </div>
            </div>
          ) : (
            <div className={`${styles.header} ${hasDiscount ? styles.headerDiscount : ""}`}>
              <h3>{property.nombre_modelo}</h3>
              <span className={styles.priceBlock}>
                {hasDiscount && (
                  <span className={styles.priceAvaluo}>
                    <span className={styles.priceAvaluoLabel}>Valor avalúo</span>
                    <span className={styles.priceAvaluoAmount}>{formatPrice(property.valor_avaluo)}</span>
                  </span>
                )}
                {priceLabel && (
                  <span className={styles.priceLabel}>{priceLabel}</span>
                )}
                <span className={styles.price}>
                  {formatPrice(property.precio)}
                </span>
              </span>
            </div>
          )}

          {/* Sin ningun dato (modelo por anunciar) la caja salia vacia. */}
          {(property.metros_terreno || property.metros_construccion != null || recamaras || banos) && (
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
            {property.metros_construccion != null && (
              <div className={styles.stat}>
                <svg className={styles.statIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 11l9-8 9 8M5 9.5V21h14V9.5" />
                </svg>
                <span className={styles.statValue}>
                  {property.metros_construccion_variable && (
                    <span className={styles.statFrom}>desde </span>
                  )}
                  {property.metros_construccion}
                </span>
                <span className={styles.statUnit}>m² construcción</span>
              </div>
            )}
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
          )}

          {property.levels?.length > 0 && (
          <div className={styles.levels}>
            <h4>Distribución:</h4>
            <ul>
              {property.levels && property.levels.map((level, i) => (
                <li key={i}>{property.levels.length > 1 && <strong>Nivel {level.nivel}: </strong>}{level.desc}</li>
              ))}
            </ul>
          </div>
          )}

          <div className={styles.cardActions}>
            {!porAnunciar && (
              <button 
                className={`btn btn-secondary ${styles.actionBtn}`}
                onClick={() => setIsModalOpen(true)}
              >
                Visita Virtual
              </button>
            )}
            <a 
              className={`btn btn-primary ${styles.actionBtn}`}
              href={`https://wa.me/529981098443?text=${encodeURIComponent(
                porAnunciar
                  ? `Hola, me interesa ${conArticulo(property.nombre_modelo)} en ${property.development}. ¿Me avisas cuando salgan precios y fechas de la preventa?`
                  : agotado
                  ? `Hola, vi que ${conArticulo(property.nombre_modelo)} está ${agotadoDe(property.nombre_modelo)} en ${property.development}. ¿Qué opciones similares tienes disponibles?`
                  : getWhatsAppText()
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              {porAnunciar
                ? "Avísame cuando abra"
                : agotado
                ? "Ver opciones similares"
                : "Cotizar ahora"}
            </a>
          </div>

          <div className={styles.legalLegend}>
            {porAnunciar ? (
              <p>Precios, metros y planos se anuncian al abrir la preventa.</p>
            ) : (
              <p><strong>*</strong> Precio no incluye gastos de escrituración</p>
            )}
            {property.metros_terreno && (
              <p><strong>**</strong> Lote tipo. Esquina o excedente varía el costo.</p>
            )}
            {property.precio_variable && (
              <p><strong>**</strong> El precio puede variar según nivel y ubicación</p>
            )}
            {!porAnunciar && <p><strong>***</strong> Aplican restricciones</p>}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <VirtualTourModal 
          onClose={() => setIsModalOpen(false)} 
          property={property} 
        />
      )}

      {isLightboxOpen && createPortal(
        <div className={styles.lightboxOverlay} onClick={() => setIsLightboxOpen(false)}>
          <button
            className={styles.lightboxClose}
            onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); }}
            aria-label="Cerrar"
          >
            ×
          </button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[currentImgIndex]} 
              alt={`Imagen ${currentImgIndex + 1} de ${property.nombre_modelo}`} 
              fill
              sizes="100vw"
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
