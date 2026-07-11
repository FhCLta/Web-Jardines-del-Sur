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
      "¿Quieres usar tu crédito Infonavit para comprar casa en Cancún? Te explicamos los requisitos, los puntos, el paso a paso y qué desarrollos de la Zona Sur aceptan Infonavit en 2026.",
    excerpt:
      "Requisitos, puntos, paso a paso y qué desarrollos de la Zona Sur de Cancún aceptan crédito Infonavit en 2026.",
    date: "2026-06-09",
    dateLabel: "9 de junio de 2026",
    author: "Florencio Hurtado · Asesor inmobiliario",
    readingMinutes: 6,
    coverImage: "/hero-alberca-jardines.webp",
    coverAlt:
      "Casas residenciales con alberca en la Zona Sur de Cancún, opción con crédito Infonavit",
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
        text: "El Infonavit (Instituto del Fondo Nacional de la Vivienda para los Trabajadores) otorga créditos hipotecarios a quienes cotizan ante el IMSS. Cada mes tu patrón aporta un porcentaje de tu salario a tu Subcuenta de Vivienda, y con el tiempo alcanzas la precalificación que determina si ya puedes ejercer tu crédito.",
      },
      {
        type: "p",
        text: "En términos generales, para usar tu crédito Infonavit necesitas:",
      },
      {
        type: "ul",
        items: [
          "Estar trabajando formalmente y cotizando ante el IMSS.",
          "Precalificar ante Infonavit. Desde 2026, con el nuevo Modelo T100, la precalificación es directa —“precalificas” o “no precalificas”— y ya no muestra un puntaje (antes se hablaba de reunir 1,080 puntos).",
          "No tener un crédito Infonavit vigente.",
        ],
      },
      {
        type: "p",
        text: "Puedes consultar tu precalificación en cualquier momento desde “Mi Cuenta Infonavit”, en el portal oficial o la app.",
      },
      {
        type: "p",
        text: "Ojo: en 2026 Infonavit cambió su precalificación (nuevo Modelo T100, el Buró ya no se consulta al inicio y tus datos en Mi Cuenta Infonavit deben estar validados). Si vas a iniciar tu trámite, revisa primero qué cambió.",
      },
      {
        type: "cta",
        href: "/blog/cambios-infonavit-precalificacion-mci-2026",
        label: "Leer: cambios de Infonavit 2026 (Modelo T100)",
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
        text: "No todos los desarrollos manejan el mismo esquema. Entre las opciones con crédito Infonavit en la Zona Sur de Cancún están:",
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
  {
    slug: "cambios-infonavit-precalificacion-mci-2026",
    metaTitle:
      "Cambios Infonavit 2026: Nueva Precalificación (MCI) y Modelo T100 | Altta Homes",
    title:
      "Cambios de Infonavit 2026: nueva precalificación en Mi Cuenta Infonavit (Modelo T100)",
    description:
      "Infonavit actualizó su precalificación en Mi Cuenta Infonavit (MCI): el Buró ya no se consulta al inicio, el resultado es “precalificas o no” con el Modelo T100, y desde el 15 de junio tus datos deben estar validados. Te explicamos qué cambió y qué hacer.",
    excerpt:
      "El Buró ya no se consulta al inicio, la precalificación es “precalificas o no” (Modelo T100) y desde el 15 de junio tus datos en MCI deben estar validados. Qué cambió y qué hacer.",
    date: "2026-06-21",
    dateLabel: "21 de junio de 2026",
    author: "Florencio Hurtado · Asesor inmobiliario",
    readingMinutes: 5,
    coverImage: "/hero-alberca-jardines.webp",
    coverAlt:
      "Pareja revisando su crédito Infonavit en Mi Cuenta Infonavit para comprar casa en Cancún",
    keywords: [
      "cambios infonavit 2026",
      "precalificación infonavit",
      "modelo t100 infonavit",
      "mi cuenta infonavit",
      "infonavit buró de crédito",
      "infonavit cancún 2026",
    ],
    body: [
      {
        type: "p",
        text: "Infonavit actualizó la forma en que funciona la precalificación dentro de Mi Cuenta Infonavit (MCI). Si piensas usar tu crédito para comprar casa en Cancún en 2026, estos cambios te afectan directamente. Aquí te los explicamos en lenguaje sencillo y, sobre todo, qué debes hacer para no atorarte en el trámite.",
      },
      {
        type: "p",
        text: "Nota importante: algunos de estos cambios son muy recientes y el propio Instituto puede emitir comunicados adicionales. Verifica siempre los detalles vigentes directamente en Mi Cuenta Infonavit o con un asesor antes de tomar decisiones.",
      },
      {
        type: "h2",
        text: "1. El Buró de Crédito ya no se consulta en la precalificación",
      },
      {
        type: "p",
        text: "Antes, tu Buró de Crédito influía desde el primer momento. Con el cambio, en la precalificación dentro de MCI ya NO se consulta tu Buró: esa revisión se realiza hasta el momento de la inscripción (en OCI). En la práctica, un mal historial ya no te bloquea de entrada para saber si precalificas.",
      },
      {
        type: "h2",
        text: "2. La precalificación ya no muestra un puntaje: solo “precalificas” o “no”",
      },
      {
        type: "p",
        text: "Con el nuevo Modelo T100, la precalificación dejó de mostrar una puntuación numérica. Ahora el resultado es directo: precalificas o no precalificas. El T100 simplificó el modelo —pasó del esquema anterior de 1,080 puntos a un esquema de 100 puntos con menos requisitos— para que el proceso sea más claro.",
      },
      {
        type: "h2",
        text: "3. Desde el 15 de junio: tus datos en Mi Cuenta Infonavit deben estar validados",
      },
      {
        type: "p",
        text: "Este es el punto que más detiene a la gente. A partir del 15 de junio de 2026:",
      },
      {
        type: "ul",
        items: [
          "Si tus datos personales no están registrados y validados en MCI, no podrás avanzar con la inscripción.",
          "Es indispensable que tu información esté actualizada y correcta en Mi Cuenta Infonavit.",
          "Debes tener tu cuenta registrada y activa en Mi Cuenta Infonavit.",
        ],
      },
      {
        type: "p",
        text: "En resumen: llega con tus datos en orden para evitar retrasos o rechazos en la inscripción.",
      },
      {
        type: "h2",
        text: "4. Restricciones por historial crediticio",
      },
      {
        type: "p",
        text: "Aunque el Buró ya no bloquea la precalificación, sí existe un límite al momento de la inscripción: si tienes más del 70% de tus ingresos comprometidos en Buró de Crédito y además alguna cuenta con falta de pago por más de 12 meses, no serás sujeto de crédito Infonavit. Por eso conviene conocer tus condiciones crediticias ANTES de iniciar tu trámite.",
      },
      {
        type: "h2",
        text: "¿Qué debes hacer antes de iniciar tu trámite?",
      },
      {
        type: "ol",
        items: [
          "Entra a Mi Cuenta Infonavit y confirma que tu cuenta esté registrada y activa.",
          "Revisa y valida tus datos personales: deben estar correctos y actualizados.",
          "Consulta tu precalificación (precalificas o no) según el Modelo T100.",
          "Revisa tu situación en Buró antes de inscribirte: ingresos comprometidos y cuentas con atraso.",
          "Si aplica, completa el curso obligatorio “Saber + para decidir mejor”.",
        ],
      },
      {
        type: "cta",
        href: "/whatsapp",
        label: "Revisa tu caso Infonavit con un asesor por WhatsApp",
      },
      {
        type: "h2",
        text: "¿Qué significa esto si quieres comprar casa en Cancún?",
      },
      {
        type: "p",
        text: "Los cambios buscan simplificar el proceso, pero también exigen que llegues con tu información en orden. La buena noticia: si precalificas, en la Zona Sur de Cancún hay desarrollos que aceptan crédito Infonavit.",
      },
      {
        type: "ul",
        items: [
          "Jardines del Sur 6 — casas y departamentos de 3 recámaras con respaldo de Grupo Sadasi. (Algunas unidades también aceptan FOVISSSTE.)",
          "Lirios Residencial 2 — departamentos con amenidades en la Zona Sur de Cancún.",
        ],
      },
      {
        type: "p",
        text: "Para vivienda residencial premium, como La Rioja 2, el esquema suele ser crédito bancario o cofinanciamiento (Infonavit + banco). Un asesor autorizado de Altta Homes puede orientarte sobre la mejor opción según tu perfil y tu capacidad de crédito.",
      },
      {
        type: "cta",
        href: "/jardines",
        label: "Ver casas con Infonavit en Jardines del Sur 6",
      },
      {
        type: "h2",
        text: "Conclusión",
      },
      {
        type: "p",
        text: "Mantén tu Mi Cuenta Infonavit al día y conoce tu situación crediticia antes de inscribirte: así evitas retrasos o rechazos. Si quieres, revisamos juntos a qué modelo alcanza tu crédito hoy, sin costo ni compromiso.",
      },
      {
        type: "cta",
        href: "/whatsapp",
        label: "Cotiza tu casa con Infonavit por WhatsApp",
      },
      {
        type: "p",
        text: "Esta información es de carácter general y puede cambiar; el Instituto puede emitir comunicados oficiales. Verifica siempre los detalles vigentes en Mi Cuenta Infonavit o con un asesor.",
      },
    ],
  },
  {
    slug: "comprar-casa-con-credito-bancario-en-cancun-2026",
    metaTitle:
      "Crédito Bancario para Casa en Cancún 2026: Requisitos y Guía | Altta Homes",
    title:
      "Comprar casa en Cancún con crédito bancario en 2026: guía práctica",
    description:
      "¿Vas a comprar casa en Cancún con crédito hipotecario bancario? Te explicamos requisitos, enganche, tasas de 2026, cómo se calcula tu mensualidad y qué desarrollos de la Zona Sur puedes financiar con banco.",
    excerpt:
      "Requisitos, enganche, tasas 2026, mensualidad y cofinanciamiento: cómo comprar casa en Cancún con crédito hipotecario bancario, paso a paso.",
    date: "2026-07-11",
    dateLabel: "11 de julio de 2026",
    author: "Florencio Hurtado · Asesor inmobiliario",
    readingMinutes: 6,
    coverImage: "/larioja2-alberca.webp",
    coverAlt:
      "Casa residencial premium con alberca en La Rioja 2, Zona Sur de Cancún, opción con crédito bancario",
    keywords: [
      "crédito bancario casa cancún",
      "crédito hipotecario cancún 2026",
      "comprar casa con banco en cancún",
      "hipoteca cancún requisitos",
      "enganche casa cancún",
    ],
    body: [
      {
        type: "p",
        text: "No todos compran casa con Infonavit. Si eres profesionista independiente, tienes ingresos mixtos o buscas una vivienda residencial que supera tu crédito Infonavit, el crédito hipotecario bancario suele ser la mejor vía —y muchas veces la única— para comprar en Cancún. En esta guía te explicamos, sin tecnicismos, cómo funciona un crédito bancario en 2026: requisitos, enganche, tasas y cómo se arma tu mensualidad.",
      },
      {
        type: "p",
        text: "Nota: las cifras de tasas, plazos y requisitos que verás aquí son referencias generales del mercado en 2026 y cambian según el banco y tu perfil. Confirma siempre las condiciones vigentes directamente con la institución o con un asesor antes de decidir.",
      },
      {
        type: "h2",
        text: "¿Qué es un crédito hipotecario bancario?",
      },
      {
        type: "p",
        text: "Es un préstamo que un banco te otorga para comprar una vivienda, usando la propia casa como garantía. Tú aportas un enganche (una parte del valor) y el banco financia el resto, que pagas en mensualidades durante un plazo de entre 5 y 20 años. A diferencia del Infonavit, no necesitas cotizar ante el IMSS: lo que evalúa el banco es tu capacidad de pago y tu historial crediticio.",
      },
      {
        type: "h2",
        text: "Requisitos generales para un crédito bancario en 2026",
      },
      {
        type: "ul",
        items: [
          "Ingresos comprobables: como referencia, muchos bancos piden desde ~$7,500 mensuales para asalariados; para independientes suele pedirse comprobar ingresos de forma anual.",
          "Antigüedad: por lo general, mínimo 6 meses en tu empleo actual si eres asalariado, o alrededor de 2 años de actividad si eres independiente.",
          "Buen historial en Buró de Crédito (sin atrasos importantes).",
          "Enganche disponible: comúnmente a partir del 10% al 20% del valor de la vivienda.",
          "Edad e identificación vigentes, además de la documentación que pida cada banco.",
        ],
      },
      {
        type: "h2",
        text: "¿Cuánto es el enganche y cómo afecta tu tasa?",
      },
      {
        type: "p",
        text: "El enganche es el dinero que aportas de tu bolsillo al inicio. Como referencia general, ronda del 10% al 20% del valor de la casa. Una regla útil: entre mayor sea tu enganche, menor suele ser tu tasa y tu mensualidad, porque el banco te presta menos y con menos riesgo. Si puedes aportar un poco más de enganche, casi siempre conviene.",
      },
      {
        type: "cta",
        href: "/la-rioja-2",
        label: "Ver casas premium en La Rioja 2 (crédito bancario)",
      },
      {
        type: "h2",
        text: "Tasas de interés en 2026: qué esperar",
      },
      {
        type: "p",
        text: "En 2026 las tasas hipotecarias fijas de la banca en México se han movido, como referencia, en un rango aproximado del 9.5% al 12% anual, e incluso por debajo del 9.5% según tu perfil, tu enganche y el banco. Son valores aproximados que cambian de una institución a otra. Lo más recomendable es contratar tasa fija: tu mensualidad no cambia durante toda la vida del crédito, aunque suban las tasas del mercado. Compara el CAT (Costo Anual Total) entre bancos, no solo la tasa: el CAT incluye comisiones y seguros y te da la comparación real.",
      },
      {
        type: "h2",
        text: "¿De cuánto sería tu mensualidad?",
      },
      {
        type: "p",
        text: "La mensualidad depende del monto financiado, la tasa y el plazo. Una recomendación financiera muy usada: que tu pago mensual no supere el 30% de tus ingresos, para no comprometer el resto de tus gastos. Antes de enamorarte de una casa, calcula tu mensualidad estimada con esa regla; así sabes en qué rango de precio moverte con tranquilidad.",
      },
      {
        type: "h2",
        text: "Cofinanciamiento: Infonavit + banco",
      },
      {
        type: "p",
        text: "Si cotizas ante el IMSS pero tu crédito Infonavit no alcanza para la casa que quieres, existe el cofinanciamiento: combinas tu crédito Infonavit con un crédito bancario para ampliar tu poder de compra. Es una de las mejores herramientas para dar el salto a una vivienda de mayor valor sin renunciar a lo que ya tienes acumulado en tu Subcuenta de Vivienda.",
      },
      {
        type: "cta",
        href: "/blog/comprar-casa-con-infonavit-en-cancun-2026",
        label: "Leer también: cómo comprar con Infonavit en Cancún",
      },
      {
        type: "h2",
        text: "Paso a paso para comprar con crédito bancario en Cancún",
      },
      {
        type: "ol",
        items: [
          "Revisa tu Buró de Crédito y ordena tu situación (sin atrasos, con capacidad de pago).",
          "Calcula cuánto puedes destinar a la mensualidad (idealmente hasta el 30% de tu ingreso) y cuánto tienes para el enganche.",
          "Precalifica con dos o tres bancos y compara el CAT, no solo la tasa.",
          "Elige el desarrollo y el modelo. En la Zona Sur de Cancún puedes usar crédito bancario en La Rioja 2, en Jardines del Sur 6 y en Lirios Residencial 2 (estos dos también aceptan Infonavit y cofinanciamiento).",
          "Reúne tu documentación, tramita el avalúo y firma ante notario. Considera los gastos de escrituración, que no están incluidos en el precio de lista.",
        ],
      },
      {
        type: "h2",
        text: "¿Qué desarrollos en Cancún puedes comprar con crédito bancario?",
      },
      {
        type: "p",
        text: "En la Zona Sur de Cancún, el crédito bancario abre la puerta a vivienda residencial de mayor plusvalía:",
      },
      {
        type: "ul",
        items: [
          "La Rioja 2 — casas premium con respaldo de Grupo Sadasi; su esquema habitual es crédito bancario o cofinanciamiento.",
          "Jardines del Sur 6 y Lirios Residencial 2 — además de Infonavit, pueden financiarse con banco o cofinanciamiento, según tu perfil.",
        ],
      },
      {
        type: "h2",
        text: "Conclusión",
      },
      {
        type: "p",
        text: "El crédito bancario te da acceso a casas de mayor valor y no depende de que cotices ante el IMSS: depende de tu capacidad de pago y tu historial. Si quieres, revisamos juntos a qué modelo alcanza tu crédito hoy y comparamos esquemas —banco, Infonavit o cofinanciamiento— sin costo ni compromiso.",
      },
      {
        type: "cta",
        href: "/whatsapp",
        label: "Cotiza tu crédito bancario por WhatsApp",
      },
      {
        type: "cta",
        href: "/preguntas-frecuentes",
        label: "Ver preguntas frecuentes",
      },
    ],
  },
  {
    slug: "plusvalia-zona-sur-cancun-poligono-sur-2026",
    metaTitle:
      "Plusvalía en la Zona Sur de Cancún 2026: Tren Maya y Crecimiento | Altta Homes",
    title:
      "Plusvalía en la Zona Sur de Cancún: por qué es la zona que más crece en 2026",
    description:
      "La Zona Sur es el área de mayor proyección de Cancún: cercanía al aeropuerto y al Tren Maya, la Av. Huayacán y nuevos desarrollos. Te explicamos por qué invertir aquí en 2026 y qué opciones hay.",
    excerpt:
      "Por qué la Zona Sur de Cancún es la zona de mayor plusvalía en 2026: Tren Maya, aeropuerto, Av. Huayacán y desarrollos con respaldo de Grupo Sadasi.",
    date: "2026-07-11",
    dateLabel: "11 de julio de 2026",
    author: "Florencio Hurtado · Asesor inmobiliario",
    readingMinutes: 6,
    coverImage: "/larioja2/vista-aerea.webp",
    coverAlt:
      "Vista aérea de un desarrollo residencial en la Zona Sur de Cancún, zona de mayor plusvalía",
    keywords: [
      "plusvalía cancún",
      "invertir zona sur cancún",
      "zona sur cancún plusvalía",
      "invertir en cancún 2026",
      "tren maya plusvalía cancún",
    ],
    body: [
      {
        type: "p",
        text: "Cuando compras casa no solo compras un lugar para vivir: compras cómo va a valer ese patrimonio en unos años. En Cancún, la Zona Sur se ha convertido en el corredor de mayor proyección de la ciudad. Aquí te explicamos por qué, con datos del sector, y qué significa para ti si piensas comprar o invertir en 2026.",
      },
      {
        type: "p",
        text: "Nota: las cifras de plusvalía y rendimiento que se mencionan son estimaciones de reportes del sector inmobiliario y no constituyen una garantía. La plusvalía depende de muchos factores y puede variar. Tómalas como referencia para orientar tu decisión, no como una promesa de rendimiento.",
      },
      {
        type: "h2",
        text: "¿Qué es la Zona Sur y por qué importa?",
      },
      {
        type: "p",
        text: "La Zona Sur es el área de crecimiento planificado al sur de Cancún, alrededor de la Av. Huayacán y con acceso rápido al aeropuerto. Es donde hoy se concentra buena parte de la nueva vivienda de la ciudad: desarrollos residenciales, servicios, escuelas y comercio creciendo al mismo tiempo. Distintos reportes del sector la señalan como el área con mayor desarrollo inmobiliario proyectado para los próximos 10 a 15 años.",
      },
      {
        type: "h2",
        text: "Los tres motores de plusvalía de la Zona Sur",
      },
      {
        type: "h3",
        text: "1. El Tren Maya",
      },
      {
        type: "p",
        text: "La operación del Tren Maya cambió la movilidad del sureste. En los corredores con estaciones y conectividad real, el efecto sobre el valor del suelo dejó de ser especulativo: se refleja en la demanda. Cancún es uno de los puntos de mayor afluencia de la ruta, lo que refuerza el atractivo de las zonas bien conectadas como la Sur.",
      },
      {
        type: "h3",
        text: "2. El aeropuerto y la Av. Huayacán",
      },
      {
        type: "p",
        text: "La cercanía al Aeropuerto Internacional de Cancún (a unos 10 minutos desde la Zona Sur) y la consolidación de la Av. Huayacán como eje de la zona hacen que llegar y salir sea rápido, tanto para quien vive ahí como para quien renta. La conectividad es uno de los factores que más sostiene la plusvalía a largo plazo.",
      },
      {
        type: "h3",
        text: "3. Desarrollo urbano y nueva inversión",
      },
      {
        type: "p",
        text: "La Zona Sur suma constantemente servicios, comercio y proyectos de infraestructura. Según reportes del sector, corredores como la Av. Huayacán y el sur de la ciudad han registrado incrementos de plusvalía relevantes en 2026, con estimaciones que ubican a la zona entre las de mayor crecimiento anual de la ciudad. Más servicios y más demanda tienden a empujar el valor de la vivienda hacia arriba.",
      },
      {
        type: "cta",
        href: "/jardines-del-sur-6",
        label: "Ver casas en Jardines del Sur 6 (Zona Sur)",
      },
      {
        type: "h2",
        text: "¿Comprar para vivir o para invertir?",
      },
      {
        type: "p",
        text: "En la Zona Sur ambas cosas se cruzan. Si compras para vivir, ganas conectividad, servicios y un patrimonio en una zona en ascenso. Si compras para invertir, el crecimiento de la zona y la demanda de renta —impulsada por turismo, trabajo y el propio Tren Maya— hacen atractivo el potencial de plusvalía y de renta. En ambos casos, comprar en preventa suele dar mejor precio de entrada.",
      },
      {
        type: "h2",
        text: "Dónde comprar en la Zona Sur",
      },
      {
        type: "p",
        text: "En la Zona Sur, Altta Homes (Grupo Sadasi) desarrolla varias opciones según tu presupuesto:",
      },
      {
        type: "ul",
        items: [
          "Jardines del Sur 6 — casas y departamentos con crédito Infonavit o bancario; excelente relación precio-plusvalía.",
          "La Rioja 2 — residencial premium con crédito bancario, para quien busca mayor exclusividad.",
          "Lirios Residencial 2 — departamentos con amenidades y opción de roof garden.",
        ],
      },
      {
        type: "cta",
        href: "/la-rioja-2",
        label: "Ver residencial premium en La Rioja 2",
      },
      {
        type: "h2",
        text: "Conclusión",
      },
      {
        type: "p",
        text: "La Zona Sur de Cancún reúne lo que más sostiene la plusvalía: conectividad (Tren Maya y aeropuerto), desarrollo urbano constante y respaldo de desarrolladores sólidos. Si quieres, revisamos juntos qué desarrollo se ajusta a tu presupuesto y a tu objetivo —vivir o invertir—, sin costo ni compromiso.",
      },
      {
        type: "cta",
        href: "/whatsapp",
        label: "Habla con un asesor por WhatsApp",
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
