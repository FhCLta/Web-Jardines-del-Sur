export type DevSlug = "jardines-del-sur-6" | "la-rioja-2" | "lirios-residencial-2";

export type DevContent = {
  slug: DevSlug;
  name: string;
  shortName: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  heroImage: string;
  ogImage: string;
  location?: { label: string; value: string };
  whatsappMessage: string;
  hero: {
    slides: string[];
    mobileImage?: string;
    preloadImage?: string;
    gradientOnly?: boolean;
    eyebrow: { strong: string; rest: string[] };
    title: { lines: string[]; em: string };
    subtitle: { bold: string; detail: string };
  };
  intro: {
    eyebrow: string;
    paragraphs: string[];
  };
  highlights: string[];
  amenitiesSection?: {
    header: {
      eyebrow: string;
      titleLine1: string;
      titleEm: string;
      subtitle: string;
    };
    items: Array<{
      img: string;
      label: string;
      desc: string;
      size: "large" | "tall" | "normal" | "wide";
    }>;
    extraAmenities?: string[];
    equipment?: string[];
    trustItems?: Array<{ num: string; label: string }>;
  };
};

export const DEVS: Record<DevSlug, DevContent> = {
  "jardines-del-sur-6": {
    slug: "jardines-del-sur-6",
    name: "Jardines del Sur 6",
    shortName: "Jardines 6",
    metaTitle: "Jardines del Sur 6 Cancún · Casas y Departamentos desde $1.85M | Altta Homes",
    metaDescription:
      "Casas y departamentos en Jardines del Sur 6, Polígono Sur Cancún. 6 modelos con 3 recámaras desde $1,853,830 MXN. Alberca, gimnasio, casa club y respaldo de Grupo Sadasi. Recorridos virtuales e informes por WhatsApp.",
    h1: "Casas y Departamentos en Jardines del Sur 6, Cancún",
    heroSubtitle:
      "El sexto desarrollo de Jardines del Sur en Polígono Sur Cancún, con seis modelos de casas y departamentos de tres recámaras y el respaldo de 50 años de Grupo Sadasi.",
    heroImage: "/optimized/dev-tabs/jardines-6.webp",
    ogImage: "/jardines/Imagnes de amenidades y hero/alberca.webp",
    location: { label: "Ubicación", value: "Av. 127 SM 342 MZ 27, 77536 Cancún, Q.R." },
    whatsappMessage:
      "Hola, quiero más información sobre las casas y departamentos de Jardines del Sur 6 en Cancún.",
    hero: {
      slides: ["/optimized/hero/alberca-desktop.webp"],
      mobileImage: "/optimized/hero/alberca-mobile.webp",
      preloadImage: "/optimized/hero/alberca-desktop.webp",
      eyebrow: {
        strong: "POLÍGONO SUR",
        rest: ["GRUPO SADASI", "6 MODELOS"],
      },
      title: {
        lines: ["Casas y departamentos", "en Jardines del Sur 6"],
        em: "con el respaldo de Grupo Sadasi",
      },
      subtitle: {
        bold: "6 modelos desde $1,853,830 MXN",
        detail: "Modelos, precios e informes en minutos.",
      },
    },
    intro: {
      eyebrow: "Polígono Sur · Cancún",
      paragraphs: [
        "Jardines del Sur 6 es la sexta etapa del exitoso desarrollo Jardines del Sur en el Polígono Sur de Cancún, una de las zonas con mayor crecimiento y plusvalía de Quintana Roo. Aquí encontrarás casas y departamentos de tres recámaras diseñados por Altta Homes, la marca residencial de Grupo Sadasi con 50 años de trayectoria y más de 430,000 viviendas entregadas en 12 estados del país.",
        "El catálogo incluye seis modelos cuidadosamente diseñados: los departamentos Capua y Cedro Plus, ideales para parejas jóvenes y primer hogar, y las casas Flamboyán, Ceiba, Tabachín y Noni, pensadas para familias que buscan espacio, privacidad y áreas comunes. Todos los modelos cuentan con tecnología Smart Home Ready, acabados de calidad premium y opciones de financiamiento Infonavit, FOVISSSTE y crédito bancario.",
        "El residencial está rodeado de amenidades pensadas para el bienestar diario: alberca tipo resort, gimnasio equipado, área infantil, cancha deportiva multifuncional y casa club. La cercanía a vialidades principales, centros comerciales, escuelas y la zona hotelera de Cancún convierten a Jardines del Sur 6 en una de las inversiones residenciales más rentables y seguras del sureste mexicano.",
      ],
    },
    highlights: [
      "6 modelos: 2 departamentos y 4 casas",
      "3 recámaras desde 85.34 m²",
      "Precio desde $1,853,830 MXN",
      "Smart Home Ready · Infonavit · FOVISSSTE",
      "Alberca, gimnasio, casa club, cancha y área infantil",
      "Polígono Sur Cancún · Av. 127",
    ],
  },

  "la-rioja-2": {
    slug: "la-rioja-2",
    name: "La Rioja 2",
    shortName: "La Rioja 2",
    metaTitle: "La Rioja 2 Cancún · Casas Residenciales desde $4.04M | Altta Homes",
    metaDescription:
      "Casas residenciales premium en La Rioja 2 Cancún. 4 modelos con 3 recámaras, 3.5 baños y terraza desde $4,049,375 MXN. Recorridos virtuales 360°, exclusividad y respaldo de Grupo Sadasi.",
    h1: "Casas Residenciales en La Rioja 2, Cancún",
    heroSubtitle:
      "Cuatro modelos de casas premium con tres recámaras, baños completos y terraza al frente, en el desarrollo más exclusivo de Altta Homes en Cancún.",
    heroImage: "/optimized/dev-tabs/la-rioja-2.webp",
    ogImage: "/larioja2/Imagnes de amenidades y hero/Vista aerea.webp",
    whatsappMessage:
      "Hola, quiero más información sobre las casas residenciales de La Rioja 2 en Cancún.",
    hero: {
      slides: ["/optimized/hero/vista-aerea.webp"],
      mobileImage: "/optimized/hero/vista-aerea.webp",
      preloadImage: "/optimized/hero/vista-aerea.webp",
      eyebrow: {
        strong: "RESIDENCIAL PREMIUM",
        rest: ["CANCÚN", "4 MODELOS"],
      },
      title: {
        lines: ["Casas residenciales", "en La Rioja 2"],
        em: "con el respaldo de Grupo Sadasi",
      },
      subtitle: {
        bold: "4 modelos desde $4,049,375 MXN",
        detail: "Recorridos virtuales 360° e informes por WhatsApp.",
      },
    },
    intro: {
      eyebrow: "Residencial Premium · Cancún",
      paragraphs: [
        "La Rioja 2 es la segunda etapa del residencial más exclusivo de Altta Homes en Cancún. Pensado para familias que buscan privacidad, espacios amplios y acabados de alta gama, ofrece cuatro modelos de casas con tres recámaras, 2.5 a 3.5 baños y, en algunos casos, hasta tres niveles con terraza al frente y vista panorámica.",
        "Los modelos disponibles son la Casa Fresno Elite, la Casa Modelo Álamo, la Casa Noni Elite y la Casa Noni, cada una con distribución optimizada para distintos perfiles familiares. Todas incluyen sala, comedor, cocina integral, medio baño en planta baja, cuarto de lavado independiente y recámara principal con vestidor y baño completo. Los recorridos virtuales 360° permiten conocer cada espacio antes de visitar el modelo en sitio.",
        "El desarrollo cuenta con casa club, alberca, áreas verdes integradas y seguridad controlada. La Rioja 2 es una propuesta para quienes valoran la exclusividad, la calidad constructiva certificada por Grupo Sadasi y una ubicación estratégica con acceso rápido a las principales avenidas, centros comerciales y zonas escolares de Cancún.",
      ],
    },
    highlights: [
      "4 modelos premium de casas",
      "3 recámaras · hasta 3.5 baños",
      "Hasta 3 niveles con terraza",
      "Precio desde $4,049,375 MXN",
      "Casa club, alberca y áreas verdes",
      "Recorridos virtuales 360° disponibles",
    ],
  },

  "lirios-residencial-2": {
    slug: "lirios-residencial-2",
    name: "Lirios Residencial 2",
    shortName: "Lirios 2",
    metaTitle: "Lirios Residencial 2 Cancún · Departamento Cedro Plus desde $2.25M | Altta Homes",
    metaDescription:
      "Departamentos Cedro Plus en Lirios Residencial 2 Cancún. Desde 104.06 m² (hasta 121.13 m² con roof garden en N3), 3 recámaras, 2.5 baños y 2 cajones de estacionamiento desde $2,248,750 MXN. Respaldo de Grupo Sadasi.",
    h1: "Departamentos en Lirios Residencial 2, Cancún",
    heroSubtitle:
      "Departamentos Cedro Plus con tres recámaras, 2.5 baños y dos cajones de estacionamiento, en el nuevo desarrollo residencial de Altta Homes en Cancún.",
    heroImage: "/optimized/dev-tabs/lirios-2.webp",
    ogImage: "/jardines/Modelo Cedro Plus/1.webp",
    whatsappMessage:
      "Hola, quiero más información sobre los departamentos de Lirios Residencial 2 en Cancún.",
    hero: {
      slides: ["/optimized/hero/hero-lirios.webp"],
      mobileImage: "/optimized/hero/hero-lirios.webp",
      preloadImage: "/optimized/hero/hero-lirios.webp",
      eyebrow: {
        strong: "PRÓXIMA APERTURA",
        rest: ["GRUPO SADASI", "CANCÚN"],
      },
      title: {
        lines: ["Departamentos", "en Lirios Residencial 2"],
        em: "con el respaldo de Grupo Sadasi",
      },
      subtitle: {
        bold: "Departamento Cedro Plus desde $2,248,750 MXN",
        detail: "Smart Home Ready · 2 cajones de estacionamiento.",
      },
    },
    intro: {
      eyebrow: "Próxima Apertura · Cancún",
      paragraphs: [
        "El nuevo proyecto de Altta Homes en la zona sur de Cancún, que ofrece a sus habitantes una excelente ubicación con rápido acceso a importantes vialidades como la Av. 135, así como centros educativos, plazas comerciales, tiendas de autoservicios y al Santuario María Desatadora de Nudos.",
        "Residencial con control de acceso. Departamentos de tres recámaras y hasta dos lugares de estacionamiento, organizados en torres de cuatro niveles.",
        "Un moderno fraccionamiento. Cada uno de nuestros departamentos está diseñado para brindarte a ti y a tu familia la privacidad y comodidad que están buscando.",
        "Nuestro objetivo: brindar a cada familia un hogar, con arquitectura moderna y un espacio libre, seguro y hermoso.",
      ],
    },
    highlights: [
      "Departamento Cedro Plus · 104.06 m²",
      "N3 con roof garden · 121.13 m²",
      "3 recámaras · 2.5 baños",
      "2 cajones de estacionamiento",
      "Precio desde $2,248,750 MXN",
      "Torres de 4 niveles · Control de acceso",
    ],
    amenitiesSection: {
      header: {
        eyebrow: "Estilo de Vida · Lirios 2",
        titleLine1: "Amenidades que elevan",
        titleEm: "tu calidad de vida",
        subtitle:
          "Lirios 2 ofrece excelentes amenidades para relajarte, ejercitarte o simplemente pasar un buen momento en compañía de tus seres queridos.",
      },
      items: [
        {
          img: "/optimized/hero/hero-lirios.webp",
          label: "Pérgolas y Áreas de Reunión",
          desc: "Espacios cubiertos diseñados para convivir con familia y amigos.",
          size: "large",
        },
        {
          img: "/lirios/amenidades/padel.webp",
          label: "Cancha de Padel",
          desc: "Profesional, iluminada y abierta a residentes — uno de los deportes con mayor crecimiento.",
          size: "tall",
        },
        {
          img: "/lirios/amenidades/areas-verdes.webp",
          label: "Áreas Verdes",
          desc: "Senderos y jardines para caminar, hacer ejercicio o pasear a tu mascota.",
          size: "normal",
        },
        {
          img: "/lirios/amenidades/voleibol-playa.webp",
          label: "Voleibol de Playa",
          desc: "Cancha de arena para deporte casual y reuniones al aire libre.",
          size: "normal",
        },
      ],
      extraAmenities: [
        "Alberca",
        "Juegos infantiles",
        "Cancha de usos múltiples",
        "Asadores",
        "Pet Park",
      ],
      equipment: [
        "Caseta de acceso con reconocimiento facial",
        "Macrocisterna",
        "Contenedores de basura",
        "Estacionamiento de visitas con geomalla y gravilla",
        "Cerco eléctrico perimetral",
      ],
      trustItems: [
        { num: "50", label: "Años de trayectoria Sadasi" },
        { num: "430,000+", label: "Viviendas entregadas" },
        { num: "13", label: "Amenidades + Equipamiento" },
        { num: "4", label: "Niveles por torre" },
      ],
    },
  },
};
