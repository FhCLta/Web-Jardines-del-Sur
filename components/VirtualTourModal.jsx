"use client";

import React, { useEffect } from 'react';
import styles from './VirtualTourModal.module.css';

export default function VirtualTourModal({ onClose, property }) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    };
  }, []);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Recorrido Virtual - {property.nombre_modelo}</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        <div className={styles.content}>
          {property.url_recorrido_virtual && property.url_recorrido_virtual !== '#' ? (
            <iframe 
              src={property.url_recorrido_virtual}
              className={styles.iframe}
              allowFullScreen
              frameBorder="0"
            />
          ) : (
            <div className={styles.placeholder}>
              <span className={styles.icon}>360°</span>
              <p>El recorrido virtual para {property.nombre_modelo} estará disponible próximamente.</p>
            </div>
          )}
        </div>
        <div className={styles.footer}>
          <p>¿Te interesa este modelo?</p>
          <a href={`https://wa.me/529982059044?text=${encodeURIComponent(`Hola, quiero cotizar el modelo ${property.nombre_modelo}.`)}`} target="_blank" rel="noreferrer" className="btn btn-primary">
            Solicitar Cotización
          </a>
        </div>
      </div>
    </div>
  );
}
