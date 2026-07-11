export type DevSlug = "jardines-del-sur-6" | "la-rioja-2" | "lirios-residencial-2";

export type DevContent = {
  slug: DevSlug;
  name: string;
  shortName: string;
  metaTitle: string;
  // Parte fija del título SEO (sin precio). El precio "desde $X.XXM" se agrega
  // dinámico desde el inventario en buildSiloMetadata. Ver dev-meta.ts.
  seoTitleLead: string;
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
    subtitle: { bold: string; detail: string; detailAccent?: string };
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
  // Promociones del mes (editable). Se muestran en /[silo]/promociones.
  // Para actualizar: cambia el texto, agrega/borra items y actualiza `updatedLabel`.
  promos?: {
    updatedLabel: string; // ej. "Promociones vigentes · julio 2026"
    nota?: string;
    items: Array<{
      titulo?: string; // nombre de la promo, ej. "La Portería de JDS"
      modelo: string; // "Todos los modelos", "Modelo Capua", etc.
      modeloSlug?: string; // si es promo de un modelo, su slug de ficha (ej. "departamento-capua") → activa botones "Cotizar / Ver el modelo"
      ubicaciones?: string;
      beneficios: string[];
      vigencia: string; // "31 de julio de 2026"
    }>;
  };
};

export const DEVS: Record<DevSlug, DevContent> = {
  "jardines-del-sur-6": {
    slug: "jardines-del-sur-6",
    name: "Jardines del Sur 6",
    shortName: "Jardines 6",
    metaTitle: "Jardines del Sur 6 Cancún · Casas y Departamentos desde $1.85M | Altta Homes",
    seoTitleLead: "Jardines del Sur 6 | Casas y Departamentos en Cancún",
    metaDescription:
      "Casas y departamentos en Jardines del Sur 6, Zona Sur de Cancún. 6 modelos de 3 recámaras con alberca, gimnasio y casa club, a 10 min del aeropuerto y 500 m de Av. Huayacán. Chatea con un asesor autorizado de Altta Homes. Crédito bancario e Infonavit.",
    h1: "Casas y Departamentos en Jardines del Sur 6, Cancún",
    heroSubtitle:
      "El sexto desarrollo de Jardines del Sur en la Zona Sur de Cancún, con seis modelos de casas y departamentos de tres recámaras y el respaldo de 50 años de Grupo Sadasi.",
    heroImage: "/optimized/dev-tabs/jardines-6.webp",
    ogImage: "/jardines/Imagnes de amenidades y hero/alberca.webp",
    location: { label: "Ubicación", value: "Av. 127 SM 342 MZ 27, 77536 Cancún, Q.R." },
    whatsappMessage:
      "Hola, quiero más información sobre las casas y departamentos de Jardines del Sur 6 en Cancún.",
    promos: {
      updatedLabel: "Promociones vigentes · julio 2026",
      nota: "Los minisplits no incluyen instalación. Promociones sujetas a disponibilidad y vigencia; consulta requisitos con tu asesor.",
      items: [
        {
          titulo: "La Portería de JDS",
          modelo: "Jardines del Sur 6",
          ubicaciones: "⚽ Todos los modelos · elige tu zona y anota tu descuento",
          beneficios: [
            "Zona 1: 1 minisplit de 12,000 BTU",
            "Zona 2: $5,000 de descuento",
            "Zona 3: $8,000 de descuento",
            "Zona 4: $10,000 de descuento",
          ],
          vigencia: "15 de julio de 2026",
        },
        {
          modelo: "Modelo Capua",
          modeloSlug: "departamento-capua",
          ubicaciones: "Jardines del Sur 6 · Ocelote y Antílope",
          beneficios: ["2 minisplits de 12,000 BTU"],
          vigencia: "31 de julio de 2026",
        },
        {
          modelo: "Modelo Noni",
          modeloSlug: "casa-noni",
          ubicaciones: "Jardines del Sur 6 · Jabalí Mz 30 L14",
          beneficios: ["2 minisplits de 12,000 BTU"],
          vigencia: "31 de julio de 2026",
        },
      ],
    },
    hero: {
      slides: ["/optimized/hero/alberca-desktop.webp"],
      mobileImage: "/optimized/hero/alberca-mobile.webp",
      preloadImage: "/optimized/hero/alberca-desktop.webp",
      eyebrow: {
        strong: "ZONA SUR",
        rest: ["GRUPO SADASI", "6 MODELOS"],
      },
      title: {
        lines: ["Casas y departamentos", "en Jardines del Sur 6"],
        em: "con el respaldo de Grupo Sadasi",
      },
      subtitle: {
        bold: "6 modelos desde $1,853,830 MXN",
        detail: "Modelos, precios e informes en minutos.",
        detailAccent: "en minutos",
      },
    },
    intro: {
      eyebrow: "Zona Sur · Cancún",
      paragraphs: [
        "Jardines del Sur 6 es la sexta etapa del residencial más exitoso de la Zona Sur de Cancún. Un oasis de estilo y serenidad construido con la calidad y garantía que solo una marca con más de 50 años de experiencia como Grupo Sadasi puede ofrecer — más de 430,000 viviendas entregadas en 12 estados del país.",
        "Cada detalle ha sido meticulosamente diseñado para ofrecer el máximo confort. Espaciosas áreas, acabados elegantes y tecnología Smart Home Ready convierten tu hogar en un santuario de sofisticación. Las amenidades de clase mundial — alberca tipo resort, casa club, gimnasio cerrado, áreas verdes, juegos infantiles y skate park — crean un entorno donde la seguridad y la belleza se entrelazan.",
        "El residencial ofrece seis modelos para distintos perfiles familiares: los departamentos Capua y Cedro Plus, ideales para parejas jóvenes y primer hogar, y las casas Flamboyán, Ceiba, Tabachín y Noni, pensadas para familias que buscan espacio y privacidad. Todos con esquemas flexibles de financiamiento — Infonavit y crédito bancario, y FOVISSSTE en unidades seleccionadas.",
        "La ubicación privilegiada cerca de la Av. 127 te conecta con escuelas de prestigio, plazas comerciales, restaurantes y las playas más hermosas del Caribe Mexicano. Vivir con estilo es… vivir en Jardines del Sur.",
      ],
    },
    highlights: [
      "6 modelos: 2 departamentos y 4 casas",
      "3 recámaras desde 85.34 m²",
      "Precio desde $1,853,830 MXN",
      "Smart Home Ready · Infonavit · FOVISSSTE (unidades selec.)",
      "Alberca, gimnasio, casa club, cancha y área infantil",
      "Zona Sur Cancún · Av. 127",
    ],
    amenitiesSection: {
      header: {
        eyebrow: "Estilo de Vida · Jardines del Sur 6",
        titleLine1: "Amenidades que elevan",
        titleEm: "tu calidad de vida",
        subtitle:
          "Jardines del Sur 6 ofrece las mejores amenidades para disfrutar en familia, ejercitarte y vivir conectado con tu comunidad.",
      },
      items: [
        {
          img: "/jardines/amenidades/alberca.webp",
          label: "Alberca y Casa Club",
          desc: "Alberca tipo resort rodeada de jardines tropicales y casa club para convivir.",
          size: "large",
        },
        {
          img: "/jardines/amenidades/gimnasio.webp",
          label: "Gimnasio Cerrado",
          desc: "Equipado y climatizado, abierto a residentes para entrenar todo el año.",
          size: "tall",
        },
        {
          img: "/jardines/amenidades/juegos-infantiles.webp",
          label: "Juegos Infantiles",
          desc: "Área lúdica al aire libre para los más pequeños del residencial.",
          size: "normal",
        },
        {
          img: "/jardines/amenidades/skate-park.webp",
          label: "Skate Park",
          desc: "Pista profesional — una amenidad única que diferencia a Jardines del Sur 6.",
          size: "normal",
        },
        {
          img: "/jardines/amenidades/areas-verdes.webp",
          label: "Áreas Verdes",
          desc: "Senderos y jardines integrados con vegetación nativa para caminar y convivir.",
          size: "wide",
        },
      ],
      extraAmenities: [
        "Caseta de seguridad",
        "Área de usos múltiples",
        "Canchas deportivas",
        "Área para mascotas",
        "Ejercitadores al aire libre",
        "Estacionamiento de visitas",
      ],
      trustItems: [
        { num: "50", label: "Años de trayectoria Sadasi" },
        { num: "430,000+", label: "Viviendas entregadas" },
        { num: "6", label: "Modelos disponibles" },
        { num: "11", label: "Amenidades del desarrollo" },
      ],
    },
  },

  "la-rioja-2": {
    slug: "la-rioja-2",
    name: "La Rioja 2",
    shortName: "La Rioja 2",
    metaTitle: "La Rioja 2 Cancún · Casas Residenciales desde $4.04M | Altta Homes",
    seoTitleLead: "La Rioja 2 | Casas de Lujo en Cancún",
    metaDescription:
      "Casas residenciales premium en La Rioja 2, Zona Sur de Cancún. 3 recámaras, hasta 3.5 baños y terraza, con casa club, alberca y vigilancia 24/7. A 10 min del aeropuerto y 15 min de las playas. Chatea con un asesor autorizado de Altta Homes. Crédito bancario e Infonavit.",
    h1: "Casas Residenciales en La Rioja 2, Cancún",
    heroSubtitle:
      "Cuatro modelos de casas premium con tres recámaras, baños completos y terraza al frente, en el desarrollo más exclusivo de Altta Homes en Cancún.",
    heroImage: "/optimized/dev-tabs/la-rioja-2.webp",
    ogImage: "/larioja2/Imagnes de amenidades y hero/Vista aerea.webp",
    location: { label: "Ubicación", value: "Av. 135 esq. Av. 127, Cancún, Q.R." },
    whatsappMessage:
      "Hola, quiero más información sobre las casas residenciales de La Rioja 2 en Cancún.",
    hero: {
      slides: [
        "/optimized/hero/vista-aerea.webp",
        "/larioja2/amenidades/acceso.webp",
      ],
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
        detailAccent: "por WhatsApp",
      },
    },
    intro: {
      eyebrow: "Residencial Premium · Cancún",
      paragraphs: [
        "Sé parte de la historia de La Rioja 2 Residencial en Cancún. Vivir aquí será una nueva aventura cada día — la tranquilidad de un ambiente seguro y armonioso que complementará tu estilo de vida, en una de las zonas de mayor plusvalía de la ciudad.",
        "Cada hogar ha sido cuidadosamente diseñado para ofrecerte espacios únicos, materiales de alta calidad y atención al detalle que transforman tu vida en un sinnúmero de experiencias inolvidables. Espacios amplios, acabados de alta gama y, en algunos modelos, hasta tres niveles con terraza al frente.",
        "Escoge entre cuatro modelos pensados para distintos perfiles familiares: Casa Fresno Elite, Modelo Álamo, Casa Noni Elite y Casa Noni. Cada uno con distribución optimizada — sala, comedor, cocina integral, medio baño en planta baja, cuarto de lavado independiente y recámara principal con vestidor y baño completo. Los recorridos virtuales 360° permiten conocer cada espacio antes de visitar el modelo en sitio.",
        "El desarrollo cuenta con casa club, alberca, gimnasio, dog park, cancha de pádel, áreas verdes integradas y vigilancia 24/7. La Rioja 2 es la propuesta para quienes valoran la exclusividad, la calidad constructiva certificada por Grupo Sadasi y una ubicación estratégica en Cancún.",
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
    amenitiesSection: {
      header: {
        eyebrow: "Estilo de Vida · La Rioja 2",
        titleLine1: "Amenidades únicas para",
        titleEm: "una vida exclusiva",
        subtitle:
          "Conscientes de la importancia de conectar con el entorno que te rodea, en La Rioja 2 podrás encontrar y disfrutar de amenidades ideales para relajarte, convivir y crear recuerdos inolvidables con tu familia y amigos.",
      },
      items: [
        {
          img: "/larioja2/amenidades/alberca.webp",
          label: "Alberca",
          desc: "Espejo de agua rodeado de áreas verdes y jardines tropicales para disfrutar en familia.",
          size: "large",
        },
        {
          img: "/larioja2/amenidades/gimnasio.webp",
          label: "Gimnasio",
          desc: "Equipado para entrenamiento funcional, abierto a residentes del desarrollo.",
          size: "tall",
        },
        {
          img: "/larioja2/amenidades/areas-verdes.webp",
          label: "Parque Principal",
          desc: "Senderos y áreas verdes integradas para caminar, ejercitarte o convivir.",
          size: "normal",
        },
        {
          img: "/larioja2/amenidades/dog-park.webp",
          label: "Área para Mascotas",
          desc: "Dog park privado diseñado especialmente para que tu mascota juegue y socialice.",
          size: "normal",
        },
        {
          img: "/larioja2/amenidades/acceso.webp",
          label: "Acceso con Vigilancia 24/7",
          desc: "Caseta de control de acceso con seguridad permanente para tu tranquilidad.",
          size: "wide",
        },
      ],
      extraAmenities: [
        "Cancha de Pádel",
        "Área de calistenia",
        "Área de usos múltiples",
        "Estacionamiento para visitas",
      ],
      trustItems: [
        { num: "50", label: "Años de trayectoria Sadasi" },
        { num: "430,000+", label: "Viviendas entregadas" },
        { num: "4", label: "Modelos premium" },
        { num: "24/7", label: "Vigilancia y seguridad" },
      ],
    },
  },

  "lirios-residencial-2": {
    slug: "lirios-residencial-2",
    name: "Lirios Residencial 2",
    shortName: "Lirios 2",
    metaTitle: "Lirios Residencial 2 Cancún · Departamento Cedro Plus desde $2.25M | Altta Homes",
    seoTitleLead: "Lirios Residencial 2 | Departamentos en Cancún",
    metaDescription:
      "Departamentos en Lirios Residencial 2, Zona Sur de Cancún. 3 recámaras, 2.5 baños y 2 estacionamientos, con amenidades y control de acceso. A 10 min del aeropuerto y 500 m de Av. Huayacán. Chatea con un asesor autorizado de Altta Homes. Crédito bancario e Infonavit.",
    h1: "Departamentos en Lirios Residencial 2, Cancún",
    heroSubtitle:
      "Departamentos Cedro Plus con tres recámaras, 2.5 baños y dos cajones de estacionamiento, en el nuevo desarrollo residencial de Altta Homes en Cancún.",
    heroImage: "/optimized/dev-tabs/lirios-2.webp",
    ogImage: "/jardines/Modelo Cedro Plus/1.webp",
    location: { label: "Ubicación", value: "Av. Robles, 77536 Cancún, Q.R." },
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
        detailAccent: "Smart Home Ready",
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
          img: "/lirios/amenidades/pergolas.webp",
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
