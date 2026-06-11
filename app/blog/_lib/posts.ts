// Contenido del blog. Cada post es data pura (sin MDX) que se renderiza con
// un renderer genérico de bloques en app/blog/[slug]/page.tsx.
// Para agregar un artículo nuevo: añade un objeto a POSTS con su slug único.

export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "cta"; href: string; label: string };

export type Post = {
  slug: string;
  metaTitle: string;
  title: string; // H1 visible
  description: string; // meta description / excerpt para SEO
  excerpt: string; // resumen para la tarjeta del índice
  date: string; // ISO (datePublished)
  dateLabel: string; // legible
  author: string;
  readingMinutes: number;
  coverImage: string;
  coverAlt: string;
  keywords: string[];
  body: PostBlock[];
};

export const POSTS: Post[] = [
  {
    slug: "comprar-casa-con-infonavit-en-cancun-2026",
    metaTitle:
      "Comprar Casa con Infonavit en Cancún 2026: Guía Paso a Paso | Altta Homes",
    title: "Comprar casa con Infonavit en Cancún en 2026: guía paso a paso",
    description:
      "¿Quieres usar tu crédito Infonavit para comprar casa en Cancún? Te explicamos los requisitos, los puntos, el paso a paso y qué desarrollos del Polígono Sur aceptan Infonavit en 2026.",
    excerpt:
      "Requisitos, puntos, paso a paso y qué desarrollos del Polígono Sur de Cancún aceptan crédito Infonavit en 2026.",
    date: "2026-06-09",
    dateLabel: "9 de junio de 2026",
    author: "Florencio Hurtado · Asesor inmobiliario",
    readingMinutes: 6,
    coverImage: "/hero-alberca-jardines.webp",
    coverAlt:
      "Casas residenciales con alberca en el Polígono Sur de Cancún, opción con crédito Infonavit",
    keywords: [
      "comprar casa con infonavit en cancún",
      "crédito infonavit cancún",
      "casas infonavit cancún 2026",
      "casas en cancún con infonavit",
      "puntos infonavit",
    ],
    body: [
      {
        type: "p",
        text: "Comprar casa en Cancún con crédito Infonavit es más accesible de lo que muchos creen. Si cotizas como trabajador formal, tu crédito puede ser la vía para estrenar casa propia en una de las ciudades de mayor plusvalía de México. En esta guía te explicamos, en lenguaje sencillo y paso a paso, cómo usar tu Infonavit para comprar casa en Cancún en 2026.",
      },
      {
        type: "h2",
        text: "¿Qué es el crédito Infonavit y quién puede solicitarlo?",
      },
      {
        type: "p",
        text: "El Infonavit (Instituto del Fondo Nacional de la Vivienda para los Trabajadores) otorga créditos hipotecarios a quienes cotizan ante el IMSS. Cada mes tu patrón aporta un porcentaje de tu salario a tu Subcuenta de Vivienda, y con el tiempo acumulas “puntos” que determinan si ya puedes ejercer tu crédito.",
      },
      {
        type: "p",
        text: "En términos generales, para usar tu crédito Infonavit necesitas:",
      },
      {
        type: "ul",
        items: [
          "Estar trabajando formalmente y cotizando ante el IMSS.",
          "Reunir al menos 1080 puntos Infonavit (el sistema los calcula según tu edad, salario, ahorro y bimestres cotizados).",
          "No tener un crédito Infonavit vigente.",
        ],
      },
      {
        type: "p",
        text: "Puedes consultar tus puntos y tu precalificación en cualquier momento desde “Mi Cuenta Infonavit”, en el portal oficial o la app.",
      },
      {
        type: "h2",
        text: "Paso a paso: cómo comprar casa con Infonavit en Cancún",
      },
      {
        type: "ol",
        items: [
          "Revisa tus puntos y tu precalificación en Mi Cuenta Infonavit. Ahí ves el monto aproximado de crédito al que puedes acceder.",
          "Define tu presupuesto real: monto del crédito + tu ahorro en la Subcuenta de Vivienda + (si hace falta) un complemento con crédito bancario o cofinanciamiento.",
          "Elige el desarrollo y el modelo. En Cancún, desarrollos como Jardines del Sur 6 y Lirios Residencial 2 aceptan Infonavit.",
          "Tramita el avalúo de la vivienda y reúne tu documentación (identificación, comprobantes, etc.).",
          "Formaliza ante notario y firma tu crédito. ¡Listo, a estrenar tu casa!",
        ],
      },
      {
        type: "cta",
        href: "/jardines",
        label: "Ver casas con Infonavit en Jardines del Sur 6",
      },
      {
        type: "h2",
        text: "¿Qué desarrollos en Cancún aceptan Infonavit?",
      },
      {
        type: "p",
        text: "No todos los desarrollos manejan el mismo esquema. Entre las opciones con crédito Infonavit en el Polígono Sur de Cancún están:",
      },
      {
        type: "ul",
        items: [
          "Jardines del Sur 6 — casas y departamentos de 3 recámaras con respaldo de Grupo Sadasi. (Algunas unidades también aceptan FOVISSSTE.)",
          "Lirios Residencial 2 — departamentos con opción de roof garden y amenidades.",
        ],
      },
      {
        type: "p",
        text: "Para vivienda residencial premium (como La Rioja 2) el esquema suele ser crédito bancario, no Infonavit. Un asesor puede orientarte sobre la mejor opción según tu perfil y tu capacidad de crédito.",
      },
      {
        type: "cta",
        href: "/lirios",
        label: "Ver departamentos en Lirios Residencial 2",
      },
      {
        type: "h2",
        text: "¿Cuánto te presta Infonavit?",
      },
      {
        type: "p",
        text: "El monto depende de tu salario, tu edad, tu ahorro acumulado y tus puntos. La forma más exacta de saber tu cifra real es tu precalificación en Mi Cuenta Infonavit. Si el crédito no cubre el total de la vivienda que te gusta, existen esquemas de cofinanciamiento (Infonavit + banco) que amplían tu poder de compra.",
      },
      {
        type: "p",
        text: "Importante: las reglas, montos y productos de Infonavit se actualizan periódicamente. Verifica siempre los detalles vigentes en fuentes oficiales o con un asesor antes de tomar una decisión.",
      },
      {
        type: "h2",
        text: "Errores comunes al comprar con Infonavit (y cómo evitarlos)",
      },
      {
        type: "ul",
        items: [
          "Enamorarte de una casa antes de revisar tus puntos y tu precalificación.",
          "Olvidar los gastos de escrituración: no están incluidos en el precio de lista.",
          "No comparar el esquema solo Infonavit contra un cofinanciamiento Infonavit + banco.",
          "Dejar pasar la preventa: los precios suelen subir conforme avanza la obra.",
        ],
      },
      {
        type: "h2",
        text: "Conclusión",
      },
      {
        type: "p",
        text: "Usar tu Infonavit para comprar casa en Cancún es totalmente posible y, bien asesorado, puede ser el mejor momento para invertir en tu patrimonio. Si quieres saber a qué modelo alcanza tu crédito hoy, con gusto revisamos tu caso sin costo ni compromiso.",
      },
      {
        type: "cta",
        href: "/whatsapp",
        label: "Cotiza tu casa con Infonavit por WhatsApp",
      },
      {
        type: "p",
        text: "¿Tienes más dudas sobre precios, apartado o créditos? Revisa nuestras preguntas frecuentes.",
      },
      {
        type: "cta",
        href: "/preguntas-frecuentes",
        label: "Ver preguntas frecuentes",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function getAllPosts(): Post[] {
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}
