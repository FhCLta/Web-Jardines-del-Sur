'use client';

import { useState, useEffect } from 'react';

/**
 * Muestra su contenido SOLO si la URL trae el parámetro indicado
 * (p. ej. `?folleto`). Sirve para dejar algo desplegado pero oculto al
 * público — Florencio lo ve agregando el parámetro; nadie más lo ve.
 * Client-only: en el HTML estático no se renderiza (no lo ve Google).
 */
export default function PreviewGate({ param = 'folleto', children }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (new URLSearchParams(window.location.search).has(param)) setShow(true);
    } catch {
      /* noop */
    }
  }, [param]);

  if (!show) return null;
  return <>{children}</>;
}
