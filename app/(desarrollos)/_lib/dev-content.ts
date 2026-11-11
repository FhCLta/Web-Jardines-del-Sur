import {
  OFFICE_ADDRESS,
  OFFICE_CALLE,
  OFFICE_CID,
  OFFICE_GEO,
  OFFICE_MAP_URL,
  OFFICE_PLACE_URL,
  OFFICE_POSTAL,
  OFFICE_STREET,
} from "@/lib/contacto";

export type DevSlug =
  | "jardines-del-sur-6"
  | "jardines-del-sur-7"
  | "la-rioja-2"
  | "lirios-residencial-2";

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
  /**
   * Logo del desarrollo (los tres miden 128px de alto). Lo usan las pestañas
   * del home y el silo de precios, que lo pone al frente de cada tabla para
   * que la lista se reconozca de un vistazo al compartirla por WhatsApp.
   */
  logo: string;
  /** Ancho del archivo del logo en px. Todos miden 128 de alto y vienen recortados. */
  logoWidth: number;
  /**
   * Como va el logo sobre la foto oscura del encabezado del silo:
   *  - "blanco": sin fondo, recoloreado en blanco con CSS. Se ve mejor
   *    (decision de Florencio), pero SOLO sirve si el dibujo son formas sobre
   *    transparencia.
   *  - "placa" (por omision): sobre placa blanca. Para logos cuyo icono trae un
   *    cuadro opaco, como Jardines del Sur 6: en blanco el cuadro se vuelve un
   *    bloque solido. Con sus colores originales y sin placa, los cuatro logos
   *    se pierden contra la foto (medido).
   */
  logoSobreFoto?: "blanco" | "placa";
  /**
   * Logo YA PREPARADO para la foto del encabezado: blanco con contorno de 1 px
   * del color original. Si existe, se usa tal cual y el CSS no lo recolorea (el
   * filtro de blanco borraria el contorno). Lo genera
   * scripts/gen-logos-contorno.mjs. SOLO va sobre foto: en las pestañas del
   * inicio y en las listas de precios se usa `logo`, a color.
   */
  logoFoto?: { src: string; width: number; height: number };
  location?: { label: string; value: string };
  /**
   * Perfil de Google Business del desarrollo. Si existe, el silo pinta la
   * sección "Ubicación de X" con mapa —igual que /jardines-del-sur-7, que va
   * #1— y pone coordenadas y enlace al perfil en los datos para Google.
   * Nombre, coordenadas y links se leen del propio perfil: no se inventan.
   * Si el perfil cambia, actualizar aquí.
   */
  mapa?: {
    placeName: string; // nombre exacto del perfil en Google
    cid: string; // id del perfil: el mapa muestra SOLO ese pin, con su ficha
    url: string; // abre el perfil (botones)
    placeUrl: string; // link largo /maps/place/ (hasMap y sameAs)
    geo: { lat: number; lng: number };
    street: string;
    postalCode: string;
    lead: { antes: string; fuerte: string; despues: string };
    puntos: Array<{ icono: string; titulo: string; detalle: string }>;
    // Cuando el perfil de Google es la OFICINA con casas muestra y no el
    // residencial (La Rioja 2): el mapa y "Cómo llegar" llevan a la oficina,
    // que es donde se cita a los clientes, y los datos para Google ponen el
    // residencial en su ubicación real y la oficina como un lugar aparte.
    residencial?: { geo: { lat: number; lng: number } };
    boton?: string; // texto del botón principal (por omisión "Cómo llegar")
  };
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
  // Promociones del mes. ESTE ES EL UNICO LUGAR QUE SE EDITA: de aqui se
  // alimentan a la vez /promociones (el hub), /[silo]/promociones, el sitemap y
  // el enlace "Ver promociones" del silo. Un desarrollo entra o sale de todos
  // lados con solo agregar o quitar este bloque.
  //
  // 📄 Instructivo completo: docs/actualizar-promociones.md
  //    (incluye que hacer cuando la promocion cambia el PRECIO: eso ademas va
  //     en data/precios.json, que es lo que come el cotizador)
  promos?: {
    updatedLabel: string; // ej. "Promociones vigentes · julio 2026"
    // Último día de la promoción (AAAA-MM-DD, hora de Cancún). El aviso
    // "Promoción" de las tarjetas de modelo cuenta hacia esta fecha y se
    // apaga SOLO al pasar: no vuelve hasta que se carguen las del mes nuevo.
    vence: string;
    nota?: string;
    items: Array<{
      titulo?: string; // nombre de la promo, ej. "La Portería de JDS"
      modelo: string; // "Todos los modelos", "Modelo Capua", etc.
      modeloSlug?: string; // si es promo de un modelo, su slug de ficha (ej. "departamento-capua") → activa botones "Cotizar / Ver el modelo"
      ubicaciones?: string;
      // Condición que el cliente tiene que saber antes de escribir, en corto
      // (ej. "Con vista al estacionamiento"). La tarjeta del modelo la pone
      // como etiqueta bajo el título del aviso, no en la letra chica.
      condicion?: string;
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
    // PRUEBA desde el 10 nov 2026 (decisión de Florencio): título idéntico al
    // nombre de su perfil de Google, "Jardines del Sur 6 | Altta Homes Cancun"
    // (sin acento, como el perfil). Para ver si posiciona mejor; las búsquedas
    // de "casas"/"departamentos" las trabajan los catálogos. Medir antes de
    // volver a moverlo (docs/seo-local-ubicaciones.md §1).
    // Títulos anteriores: "Jardines del Sur 6 Cancún | Casas y departamentos en
    // venta" (5–10 nov 2026) y "Jardines del Sur 6 | Casas y Departamentos en
    // Cancún". metaTitle es el nombre en los datos para Google y debe decir lo
    // mismo que el <title>.
    metaTitle: "Jardines del Sur 6 | Altta Homes Cancun",
    seoTitleLead: "Jardines del Sur 6 | Altta Homes Cancun",
    metaDescription:
      "Casas y departamentos en Jardines del Sur 6, Zona Sur de Cancún. 6 modelos de 3 recámaras con alberca, gimnasio y casa club, a 10 min del aeropuerto y 500 m de Av. Huayacán. Chatea con un asesor autorizado de Altta Homes. Crédito bancario e Infonavit.",
    h1: "Casas y Departamentos en Jardines del Sur 6, Cancún",
    heroSubtitle:
      "El sexto desarrollo de Jardines del Sur en la Zona Sur de Cancún, con seis modelos de casas y departamentos de tres recámaras y el respaldo de 50 años de Grupo Sadasi.",
    heroImage: "/optimized/dev-tabs/jardines-6.webp",
    ogImage: "/jardines/Imagnes de amenidades y hero/alberca.webp",
    logo: "/logos/jardines-6.webp",
    logoWidth: 400,
    location: { label: "Ubicación", value: OFFICE_ADDRESS },
    // Perfil de Google de Florencio, el mismo del pie de página: todos los
    // datos (cid, coordenadas, links) viven en lib/contacto.ts.
    mapa: {
      placeName: "Jardines del Sur 6 | Altta Homes Cancun",
      cid: OFFICE_CID,
      url: OFFICE_MAP_URL,
      placeUrl: OFFICE_PLACE_URL,
      geo: OFFICE_GEO,
      street: OFFICE_STREET,
      postalCode: OFFICE_POSTAL,
      lead: {
        antes: "Jardines del Sur 6 está en la ",
        fuerte: "Zona Sur de Cancún",
        despues:
          ", la de mayor proyección de la ciudad, con escuelas, plazas comerciales y restaurantes a unos minutos.",
      },
      puntos: [
        {
          icono: "📍",
          titulo: OFFICE_CALLE,
          detalle: `Jardines\u00a0del\u00a0Sur\u00a06, ${OFFICE_POSTAL} Cancún, Q.R.`,
        },
        { icono: "✈️", titulo: "A 10 minutos del aeropuerto", detalle: "Conexión directa por la Zona Sur" },
        { icono: "🛣️", titulo: "A 500 m de Av. Huayacán", detalle: "Escuelas, comercio y servicios consolidados" },
        { icono: "🏢", titulo: "Oficina de ventas en el desarrollo", detalle: "Ven a conocerlo en persona" },
      ],
    },
    whatsappMessage:
      "Hola, quiero más información sobre las casas y departamentos de Jardines del Sur 6 en Cancún.",
    promos: {
      updatedLabel: "Promociones vigentes · noviembre 2026",
      vence: "2026-11-30",
      nota: "Aplica con apartado del 1 al 30 de noviembre de 2026 y solo en las ubicaciones indicadas: si cambias de ubicación, la promoción no se respeta. Los minisplits no incluyen instalación. Aplican restricciones; consulta requisitos con tu asesor.",
      items: [
        {
          // "MÁS": los dos juntos. El cotizador aún no aplica descuentos a
          // departamentos (bono_extra es solo de casas): el asesor lo captura.
          modelo: "Modelo Capua",
          modeloSlug: "departamento-capua",
          ubicaciones: "Jardines del Sur 6 · Antílope N, O, P y Q · Vista al estacionamiento",
          condicion: "Con vista al estacionamiento",
          beneficios: ["3 minisplits de 12,000 BTU", "más descuento de $40,000"],
          vigencia: "30 de noviembre de 2026",
        },
        {
          // "O": el cliente elige UNO de los tres. El descuento tambien esta en
          // data/precios.json (variante NONI con bono_extra) para el cotizador.
          modelo: "Modelo Noni",
          modeloSlug: "casa-noni",
          ubicaciones: "Jardines del Sur 6 · Jabalí Mz 30 L14",
          beneficios: [
            "Paquete de paneles solares",
            "o descuento de $50,000",
            "o 4 minisplits: 1 de 18,000 BTU y 3 de 12,000 BTU",
          ],
          vigencia: "30 de noviembre de 2026",
        },
        {
          // "O": el cliente elige UNO de los dos. El descuento tambien esta en
          // data/precios.json (variante CEIBA con bono_extra) para el cotizador.
          modelo: "Casa Ceiba",
          modeloSlug: "casa-ceiba",
          ubicaciones: "Jardines del Sur 6 · Todos los lotes disponibles",
          beneficios: ["4 minisplits de 12,000 BTU", "o descuento de $40,000"],
          vigencia: "30 de noviembre de 2026",
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

  // ⚠️ Jardines del Sur 7 entra a DEVS SOLO para que sus fichas de modelo
  // existan (ModelPage lee DEVS[slug] para el nombre, el slug y la imagen al
  // compartir). Su portada NO usa SiloPage: tiene pagina propia en
  // jardines-del-sur-7/page.tsx, hecha para un desarrollo sin inventario.
  // Por eso hero, intro y highlights van con lo minimo cierto: si algun dia se
  // renderizara el silo generico, no diria nada falso.
  "jardines-del-sur-7": {
    slug: "jardines-del-sur-7",
    name: "Jardines del Sur 7",
    shortName: "Jardines 7",
    metaTitle: "Jardines del Sur 7 Cancún · Preventa por Abrir | Altta Homes",
    seoTitleLead: "Jardines del Sur 7 | Nueva Etapa en Cancún",
    metaDescription:
      "Jardines del Sur 7, la nueva etapa del residencial más exitoso de la Zona Sur de Cancún. Obra iniciada y preventa por abrir, con los modelos Tabachín y Noni. Chatea con un asesor autorizado de Altta Homes.",
    h1: "Jardines del Sur 7, Cancún",
    heroSubtitle:
      "La nueva etapa de Jardines del Sur en la Zona Sur de Cancún, con obra ya iniciada y preventa por abrir.",
    heroImage: "/optimized/dev-tabs/jardines-6.webp",
    ogImage: "/hero-alberca-jardines.webp",
    // Logo oficial (oct 2026): texto gris oscuro sobre fondo transparente, asi
    // que sobre foto va en placa blanca (logoSobreFoto sin definir = "placa").
    logo: "/logos/jardines-7-v3.webp",
    logoWidth: 360,
    whatsappMessage:
      "Hola, quiero más información sobre Jardines del Sur 7 en Cancún. Avísenme cuando abra a la venta.",
    hero: {
      slides: ["/hero-alberca-jardines.webp"],
      eyebrow: { strong: "PRÓXIMAMENTE", rest: ["GRUPO SADASI", "CANCÚN"] },
      title: {
        lines: ["Nueva etapa", "en Jardines del Sur 7"],
        em: "con el respaldo de Grupo Sadasi",
      },
      subtitle: {
        bold: "Preventa por abrir",
        detail: "Obra ya iniciada · Modelos Tabachín y Noni.",
      },
    },
    intro: {
      eyebrow: "Nueva etapa · Cancún",
      paragraphs: [
        "Jardines del Sur 7 es la nueva etapa del residencial más exitoso de la Zona Sur de Cancún, con el respaldo de Grupo Sadasi: más de 50 años y 430,000 viviendas entregadas en 12 estados del país.",
        "La obra ya está en proceso y la preventa abre próximamente, arrancando con los modelos Tabachín y Noni. Precios, metros y planos se anuncian al abrir.",
      ],
    },
    highlights: [
      "Nueva etapa de Jardines del Sur",
      "Obra ya iniciada",
      "Arranca con Tabachín y Noni",
      "Precios por anunciar",
      "Respaldo de Grupo Sadasi",
      "Zona Sur Cancún",
    ],
  },

  "la-rioja-2": {
    // ⚠️ La Casa Noni (larioja2-noni) esta OCULTA del sitio desde el 15 sept 2026
    // (`oculto_web` en inventory.json). Por eso estos textos dicen 3 modelos desde
    // la Fresno Elite. Si se vuelve a mostrar, regresan a 4 modelos desde
    // $4,049,375 y la Noni vuelve a la lista de la introduccion.
    slug: "la-rioja-2",
    name: "La Rioja 2",
    shortName: "La Rioja 2",
    // 6 nov 2026, decisión de Florencio: "La Rioja Residencial 2", igual que
    // "Lirios Residencial 2" y que el nombre oficial (así se llaman la oficina de
    // ventas y el residencial en Google Maps), en el formato de los demás
    // ("X Cancún | … en venta"). Se conserva "casas de lujo".
    // Antes decía "La Rioja 2 Residencial": en Google Ads la gente teclea "la
    // rioja 2 residencial". Google entiende el orden distinto, pero si la
    // posición de "la rioja 2" cae, este es el primer sospechoso.
    // Títulos anteriores: "La Rioja 2 Residencial | Casas de Lujo en Cancún" y,
    // unas horas, "La Rioja 2 Residencial Cancún | Casas de lujo en venta".
    // PRUEBA desde el 10 nov 2026 (decisión de Florencio): título idéntico al
    // nombre de su perfil de Google, que ese día renombró a "La Rioja
    // Residencial 2 | Altta Homes Cancun". Antes de la prueba (6–10 nov): "La
    // Rioja Residencial 2 Cancún | Casas de lujo en venta".
    metaTitle: "La Rioja Residencial 2 | Altta Homes Cancun",
    seoTitleLead: "La Rioja Residencial 2 | Altta Homes Cancun",
    metaDescription:
      "Casas residenciales premium en La Rioja 2, Zona Sur de Cancún. 3 recámaras, hasta 3.5 baños y terraza, con casa club, alberca y vigilancia 24/7. A 10 min del aeropuerto y 15 min de las playas. Chatea con un asesor autorizado de Altta Homes. Crédito bancario e Infonavit.",
    h1: "Casas Residenciales en La Rioja 2, Cancún",
    heroSubtitle:
      "Tres modelos de casas premium con tres recámaras, baños completos y terraza al frente, en el desarrollo más exclusivo de Altta Homes en Cancún.",
    heroImage: "/optimized/dev-tabs/la-rioja-2.webp",
    ogImage: "/larioja2/Imagnes de amenidades y hero/Vista aerea.webp",
    logo: "/logos/la-rioja-2.webp",
    logoWidth: 190,
    logoSobreFoto: "blanco",
    logoFoto: { src: "/logos/la-rioja-2-contorno-v2.webp", width: 408, height: 277 },
    // En Av. 135 esq. Av. 127 están la oficina y las casas muestra, NO el
    // residencial (ese está junto a Jardines del Sur 6, a 2.9 km).
    location: { label: "Casas muestra", value: "Av. 135 esq. Av. 127, 77536 Cancún, Q.R." },
    // Perfil de Google de Florencio "La Rioja Residencial 2 | Altta Homes
    // Cancun" (hasta el 10 nov 2026 se llamaba "La Rioja 2 | …") = la
    // oficina con casas muestra, donde cita a los clientes. El residencial es
    // otro punto: "LA RIOJA RESIDENCIAL 2" en Maps es de otras personas, así que
    // de ese solo se usan las coordenadas, sin enlazarlo. Medido en
    // OpenStreetMap el 6 nov 2026 desde el residencial: Av. 127 a 90 m,
    // Huayacán a ~540 m, aeropuerto 4.8 km en línea recta, JdS6 a 600 m.
    // OJO: "Oficina de ventas de La Rioja Residencial" es la oficial, no suya.
    mapa: {
      placeName: "La Rioja Residencial 2 | Altta Homes Cancun",
      cid: "10624409005148155448",
      url: "https://www.google.com/maps?cid=10624409005148155448",
      placeUrl:
        "https://www.google.com/maps/place/La+Rioja+2+%7C+Altta+Homes+Cancun/@21.1028811,-86.8795074,17z/data=!3m1!4b1!4m6!3m5!1s0x8f4c2be922ce401f:0x93717bb31c512e38!8m2!3d21.1028811!4d-86.8795074!16s%2Fg%2F11npy_dkg2",
      geo: { lat: 21.1028811, lng: -86.8795074 },
      street: "Av. 135 esq. Av. 127",
      postalCode: "77536",
      residencial: { geo: { lat: 21.0782863, lng: -86.8897497 } },
      boton: "Cómo llegar a las casas muestra",
      lead: {
        antes: "La Rioja 2 está en la ",
        fuerte: "Zona Sur de Cancún",
        despues:
          ", junto a Jardines\u00a0del\u00a0Sur\u00a06. Las casas muestra y la oficina de ventas, donde te recibimos para tu cita, están a 2.9\u00a0km, en Av. 135 esquina con Av. 127.",
      },
      puntos: [
        { icono: "🏠", titulo: "Casas muestra y oficina de ventas", detalle: "Av. 135 esq. Av. 127 · aquí te recibimos para tu cita" },
        { icono: "🏘️", titulo: "El residencial, junto a Jardines\u00a0del\u00a0Sur\u00a06", detalle: "A 2.9\u00a0km de las casas muestra" },
        { icono: "🛣️", titulo: "A medio kilómetro de la Av. Huayacán", detalle: "Desde el residencial" },
        { icono: "✈️", titulo: "A 10 minutos del aeropuerto", detalle: "Desde el residencial" },
      ],
    },
    whatsappMessage:
      "Hola, quiero más información sobre las casas residenciales de La Rioja 2 en Cancún.",
    promos: {
      updatedLabel: "Promociones vigentes · noviembre 2026",
      vence: "2026-11-30",
      nota: "Aplica con apartado del 1 al 30 de noviembre de 2026 y solo en las ubicaciones indicadas: si cambias de ubicación, la promoción no se respeta. Los minisplits no incluyen instalación. Aplican restricciones; consulta requisitos con tu asesor.",
      items: [
        {
          // "O": el cliente elige UNO de los dos paquetes. El descuento de
          // $50,000 sigue en data/precios.json (NONI ELITE, bono_extra).
          modelo: "Casa Noni Elite",
          modeloSlug: "casa-noni-elite",
          ubicaciones: "La Rioja 2 · Casas 69 a 74",
          beneficios: [
            "Paquete de paneles solares",
            "o descuento de $50,000 + 1 minisplit de 18,000 BTU y 2 de 12,000 BTU",
          ],
          vigencia: "30 de noviembre de 2026",
        },
      ],
    },
    hero: {
      slides: [
        "/optimized/hero/vista-aerea.webp",
        "/larioja2/amenidades/acceso.webp",
      ],
      mobileImage: "/optimized/hero/vista-aerea.webp",
      preloadImage: "/optimized/hero/vista-aerea.webp",
      eyebrow: {
        strong: "RESIDENCIAL PREMIUM",
        rest: ["CANCÚN", "3 MODELOS"],
      },
      title: {
        lines: ["Casas residenciales", "en La Rioja 2"],
        em: "con el respaldo de Grupo Sadasi",
      },
      subtitle: {
        bold: "3 modelos desde $4,294,950 MXN",
        detail: "Recorridos virtuales 360° e informes por WhatsApp.",
        detailAccent: "por WhatsApp",
      },
    },
    intro: {
      eyebrow: "Residencial Premium · Cancún",
      paragraphs: [
        "Sé parte de la historia de La Rioja 2 Residencial en Cancún. Vivir aquí será una nueva aventura cada día — la tranquilidad de un ambiente seguro y armonioso que complementará tu estilo de vida, en una de las zonas de mayor plusvalía de la ciudad.",
        "Cada hogar ha sido cuidadosamente diseñado para ofrecerte espacios únicos, materiales de alta calidad y atención al detalle que transforman tu vida en un sinnúmero de experiencias inolvidables. Espacios amplios, acabados de alta gama y, en algunos modelos, hasta tres niveles con terraza al frente.",
        "Escoge entre tres modelos pensados para distintos perfiles familiares: Casa Fresno Elite, Modelo Álamo y Casa Noni Elite. Cada uno con distribución optimizada — sala, comedor, cocina integral, medio baño en planta baja, cuarto de lavado independiente y recámara principal con vestidor y baño completo. Los recorridos virtuales 360° permiten conocer cada espacio antes de visitar el modelo en sitio.",
        "El desarrollo cuenta con casa club, alberca, gimnasio, dog park, cancha de pádel, áreas verdes integradas y vigilancia 24/7. La Rioja 2 es la propuesta para quienes valoran la exclusividad, la calidad constructiva certificada por Grupo Sadasi y una ubicación estratégica en Cancún.",
      ],
    },
    highlights: [
      "3 modelos premium de casas",
      "3 recámaras · hasta 3.5 baños",
      "Hasta 3 niveles con terraza",
      "Precio desde $4,294,950 MXN",
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
    // Título espejo de /jardines-del-sur-7 y /jardines-del-sur-6. Pedido por
    // Florencio el 6 nov 2026. Antes: "Lirios Residencial 2 | Departamentos en
    // Cancún". metaTitle (nombre en los datos para Google) dice lo mismo.
    metaTitle: "Lirios Residencial 2 Cancún | Departamentos en venta",
    seoTitleLead: "Lirios Residencial 2 Cancún | Departamentos en venta",
    metaDescription:
      "Departamentos en Lirios Residencial 2, Zona Sur de Cancún. Dos modelos —Capua y Cedro Plus— de 3 recámaras, hasta 2.5 baños y 2 estacionamientos, con amenidades y control de acceso. Junto a la Av. Las Torres, a 600 m del Chedraui Santuario. Chatea con un asesor autorizado de Altta Homes. Crédito bancario e Infonavit.",
    h1: "Departamentos en Lirios Residencial 2, Cancún",
    heroSubtitle:
      "Departamentos Capua y Cedro Plus, de tres recámaras y dos cajones de estacionamiento, en el nuevo desarrollo residencial de Altta Homes en Cancún.",
    heroImage: "/optimized/dev-tabs/lirios-2.webp",
    ogImage: "/jardines/Modelo Cedro Plus/1.webp",
    logo: "/logos/lirios-2.webp",
    logoWidth: 260,
    logoSobreFoto: "blanco",
    logoFoto: { src: "/logos/lirios-2-contorno-v2.webp", width: 556, height: 277 },
    location: { label: "Ubicación", value: "Av. Robles, 77536 Cancún, Q.R." },
    // Perfil de Google de Florencio "Lirios Residencial 2 | Altta Homes Cancun"
    // (agentes inmobiliarios). Datos leídos del perfil el 6 nov 2026.
    mapa: {
      placeName: "Lirios Residencial 2 | Altta Homes Cancun",
      cid: "4371211098013598685",
      url: "https://www.google.com/maps?cid=4371211098013598685",
      placeUrl:
        "https://www.google.com/maps/place/Lirios+Residencial+2+%7C+Altta+Homes+Cancun/@21.1283273,-86.8877574,17z/data=!3m1!4b1!4m6!3m5!1s0x8f4c2b365d8005fd:0x3ca9a9557f5883dd!8m2!3d21.1283273!4d-86.8877574!16s%2Fg%2F11nvtpk1xl",
      geo: { lat: 21.1283273, lng: -86.8877574 },
      street: "Av. Robles",
      postalCode: "77536",
      lead: {
        antes: "Lirios Residencial 2 está en la ",
        fuerte: "Zona Sur de Cancún",
        despues:
          ", junto a la Av. Las Torres, con supermercados, escuelas y el Santuario María Desatadora de Nudos a unos minutos.",
      },
      // Su zona es OTRA que la de Jardines del Sur 6 y 7 (Florencio, 6 nov
      // 2026). Distancias en línea recta desde el pin del perfil (OpenStreetMap
      // y Google Maps). "Av. Las Torres" es la Av. Cancún. La Av. Huayacán queda
      // a ~4 km: el "500 m de Av. Huayacán" es de Jardines del Sur 6, no de aquí.
      puntos: [
        { icono: "📍", titulo: "Av. Robles", detalle: "77536 Cancún, Q.R." },
        // \u00a0: el número nunca se separa de su unidad ("2 km" salía solo).
        { icono: "🛣️", titulo: "A 450\u00a0m de la Av. Las Torres", detalle: "Y a 1\u00a0km de la Av. 135" },
        { icono: "🛒", titulo: "A 600\u00a0m del Chedraui Santuario", detalle: "Walmart, Soriana y Bodega Aurrera a menos de\u00a02\u00a0km" },
        { icono: "⛪", titulo: "A 800\u00a0m del Santuario María Desatadora de Nudos", detalle: "Escuelas a 1\u00a0km" },
      ],
    },
    // Primeras promociones de Lirios (octubre 2026). Con este bloque se
    // publica /lirios-residencial-2/promociones y entra al hub y al sitemap.
    promos: {
      updatedLabel: "Promociones vigentes · noviembre 2026",
      vence: "2026-11-30",
      nota: "Aplica con apartado del 1 al 30 de noviembre de 2026 y solo en las ubicaciones indicadas: si cambias de ubicación, la promoción no se respeta. Los minisplits no incluyen instalación. Aplican restricciones; consulta requisitos con tu asesor.",
      items: [
        {
          modelo: "Departamento Capua",
          modeloSlug: "departamento-capua",
          ubicaciones: "Lirios Residencial 2 · P4 y L1",
          beneficios: ["3 minisplits de 12,000 BTU"],
          vigencia: "30 de noviembre de 2026",
        },
        {
          modelo: "Departamento Cedro Plus",
          modeloSlug: "departamento-cedro-plus",
          ubicaciones: "Lirios Residencial 2 · P1, P2 y P3",
          beneficios: ["3 minisplits de 12,000 BTU"],
          vigencia: "30 de noviembre de 2026",
        },
      ],
    },
    whatsappMessage:
      "Hola, quiero más información sobre los departamentos de Lirios Residencial 2 en Cancún.",
    hero: {
      slides: ["/optimized/hero/hero-lirios.webp"],
      mobileImage: "/optimized/hero/hero-lirios.webp",
      preloadImage: "/optimized/hero/hero-lirios.webp",
      eyebrow: {
        strong: "PRÓXIMA APERTURA",
        rest: ["GRUPO SADASI", "2 MODELOS"],
      },
      title: {
        lines: ["Departamentos", "en Lirios Residencial 2"],
        em: "con el respaldo de Grupo Sadasi",
      },
      subtitle: {
        bold: "2 modelos desde $1,990,000 MXN",
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
    // ⚠️ Al entrar el Capua (30 ago 2026) estos puntos dejaron de poder hablar
    // de un solo modelo. Se quito "N3 con roof garden · 121.13 m²": es del
    // Cedro Plus, y como punto del DESARROLLO se leia como si lo tuvieran los
    // dos. Sigue dicho en la ficha del Cedro Plus, que es donde es cierto.
    highlights: [
      "2 modelos: Capua y Cedro Plus",
      "3 recámaras · hasta 2.5 baños",
      "Desde 85.34 m² de construcción",
      "2 cajones de estacionamiento",
      "Precio desde $1,990,000 MXN",
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
        { num: "2", label: "Modelos disponibles" },
      ],
    },
  },
};

/**
 * Que logo va sobre la foto oscura de un encabezado, y en que forma. Lo usan el
 * hero de los silos y el de las paginas-catalogo, para no repetir la decision.
 *  - "propio": archivo ya preparado (blanco con contorno de color).
 *  - "blanco": el logo original, recoloreado en blanco con CSS.
 *  - "placa":  el logo original sobre una placa blanca translucida.
 */
export function logoSobreFotoDe(dev: DevContent): {
  modo: "propio" | "blanco" | "placa";
  src: string;
  width: number;
  height: number;
} {
  if (dev.logoSobreFoto === "blanco" && dev.logoFoto) {
    return { modo: "propio", ...dev.logoFoto };
  }
  return {
    modo: dev.logoSobreFoto === "blanco" ? "blanco" : "placa",
    src: dev.logo,
    width: dev.logoWidth,
    height: 128,
  };
}
