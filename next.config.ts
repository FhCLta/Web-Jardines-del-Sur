import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Preferir avif sobre webp cuando el browser lo soporte (mejor compresión)
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        // Archivos estáticos del build de Next.js — nunca cambian (tienen hash en el nombre)
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Imágenes optimizadas por next/image — pueden revalidarse
        source: "/_next/image(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=31536000" },
        ],
      },
      {
        // Fotos y assets del /public (webp, jpg, etc.)
        source: "/(.*\\.webp|.*\\.jpg|.*\\.jpeg|.*\\.png|.*\\.svg|.*\\.ico|.*\\.woff2|.*\\.woff)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=604800" },
        ],
      },
    ];
  },
};

export default nextConfig;
