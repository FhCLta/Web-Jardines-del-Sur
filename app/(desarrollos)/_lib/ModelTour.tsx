"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import styles from "../model.module.css";

const VirtualTourModal = dynamic(() => import("@/components/VirtualTourModal"), {
  ssr: false,
});

export default function ModelTour({
  tourUrl,
  previewImage,
  modelName,
  development,
}: {
  tourUrl: string;
  previewImage: string;
  modelName: string;
  development: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop: iframe embebido directo */}
      <div className={styles.tourFrame}>
        <iframe
          src={tourUrl}
          title={`Recorrido virtual de ${modelName}`}
          allowFullScreen
          loading="lazy"
        />
      </div>

      {/* Mobile: preview con botón que abre el modal full-screen */}
      <button
        type="button"
        className={styles.tourMobilePreview}
        onClick={() => setIsOpen(true)}
        aria-label={`Abrir recorrido virtual de ${modelName}`}
      >
        <Image
          src={previewImage}
          alt={`Recorrido virtual de ${modelName}`}
          fill
          sizes="100vw"
        />
        <span className={styles.tourPlayBadge} aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        <span className={styles.tourPreviewLabel}>
          Ver recorrido virtual 360°
        </span>
      </button>

      {isOpen && (
        <VirtualTourModal
          property={{
            nombre_modelo: modelName,
            url_recorrido_virtual: tourUrl,
            development,
          }}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
