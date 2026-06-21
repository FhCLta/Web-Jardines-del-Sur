import fs from 'fs';
import path from 'path';
import DevelopmentTabs from '@/components/DevelopmentTabs';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import SiteHeader from '@/components/SiteHeader';
import Hero from '@/components/Hero';
import AmenitiesSection from '@/components/AmenitiesSection';
import FooterPhoneContact from '@/components/FooterPhoneContact';
import ContactNavBtn from '@/components/ContactNavBtn';
import { SITE_URL } from '@/lib/site';
import styles from './page.module.css';

type InventoryProperty = {
  development: string;
  nombre_modelo: string;
  precio: number;
  metros_construccion: number;
};

// Server component to read the inventory data
async function getInventory(): Promise<InventoryProperty[]> {
  const filePath = path.join(process.cwd(), 'data', 'inventory.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  return data.inventory_stitch_2026;
}

export default async function Home() {
  const inventoryData = await getInventory();
  const siteUrl = SITE_URL;
  const googleBusinessUrl =
    'https://www.google.com/maps/place/Jardines+del+Sur+6+%7C+Altta+Homes/@21.082209,-86.8865266,17z/data=!3m1!4b1!4m6!3m5!1s0x8f4c2b2036689c1f:0xa44142d0c992c304!8m2!3d21.082209!4d-86.8865266!16s%2Fg%2F11njlpp4sw';
  const googleBusinessShortUrl = 'https://maps.app.goo.gl/9sKBR1fUNSswv5d19';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'RealEstateAgent',
        '@id': `${siteUrl}/#business`,
        name: 'Altta Homes Cancún',
        alternateName: [
          'Altta Homes Cancun',
          'Jardines del Sur Cancun',
          'Altta Homes by Grupo Sadasi',
        ],
        url: siteUrl,
        telephone: '+529982059044',
        priceRange: '$$-$$$$',
        image: `${siteUrl}/jardines/Imagnes%20de%20amenidades%20y%20hero/alberca.webp`,
        foundingDate: '1975',
        parentOrganization: {
          '@type': 'Organization',
          name: 'Grupo Sadasi',
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Av. 127 SM 342 MZ 27',
          addressLocality: 'Cancún',
          addressRegion: 'Quintana Roo',
          postalCode: '77536',
          addressCountry: 'MX',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 21.082209,
          longitude: -86.8865266,
        },
        hasMap: googleBusinessUrl,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+529982059044',
          contactType: 'sales',
          availableLanguage: ['es-MX'],
        },
        areaServed: [
          {
            '@type': 'City',
            name: 'Cancún',
          },
          {
            '@type': 'Place',
            name: 'Polígono Sur Cancún',
          },
        ],
        sameAs: [
          googleBusinessUrl,
          googleBusinessShortUrl,
          'https://jardinesdelsur-cancun.web.app',
        ],
        makesOffer: {
          '@type': 'OfferCatalog',
          name: 'Casas y departamentos en Cancun',
          itemListElement: inventoryData.map((property) => ({
            '@type': 'Offer',
            name: property.nombre_modelo,
            price: property.precio,
            priceCurrency: 'MXN',
            availability: 'https://schema.org/InStock',
            itemOffered: {
              '@type': 'Residence',
              name: `${property.nombre_modelo} - ${property.development}`,
              floorSize: {
                '@type': 'QuantitativeValue',
                value: property.metros_construccion,
                unitCode: 'MTK',
              },
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Cancun',
                addressRegion: 'Quintana Roo',
                addressCountry: 'MX',
              },
            },
          })),
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Altta Homes Cancún',
        inLanguage: 'es-MX',
        publisher: {
          '@id': `${siteUrl}/#business`,
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${siteUrl}/#developments`,
        name: 'Desarrollos en Polígono Sur Cancún',
        itemListElement: [
          { name: 'Jardines del Sur 6', slug: 'jardines-del-sur-6' },
          { name: 'La Rioja 2', slug: 'la-rioja-2' },
          { name: 'Lirios Residencial 2', slug: 'lirios-residencial-2' },
          { name: 'Jardines del Sur 7', slug: 'jardines-del-sur-7' },
        ].map(({ name, slug }, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name,
          url: `${siteUrl}/desarrollos-cancun/${slug}`,
        })),
      },
    ],
  };

  return (
    <div className={styles.page}>
      {/* Preload del hero solo en el home (LCP). React 19 hoistea estos <link>
          al <head>. NO va en layout.tsx porque ahí aplica a todas las páginas. */}
      <link
        rel="preload"
        as="image"
        href="/optimized/hero/alberca-mobile.webp"
        type="image/webp"
        media="(max-width: 767px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href="/optimized/hero/alberca-desktop.webp"
        type="image/webp"
        media="(min-width: 768px)"
        fetchPriority="high"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <SiteHeader />

      <Hero />

      {/* MODELS / TABS SECTION */}
      <section id="modelos" className={`section-padding ${styles.inventory}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="text-accent">Inventario y Precios</span>
            <h2>Modelos Disponibles en Cancún</h2>
            <p>Explora los modelos disponibles en Jardines del Sur 6, La Rioja 2 y Lirios 2.</p>
          </div>

          <div id="desarrollos" style={{scrollMarginTop: '72px'}} />
          <DevelopmentTabs inventoryData={inventoryData} />
        </div>
      </section>

      {/* AMENITIES SECTION */}
      <AmenitiesSection />

      {/* FOOTER */}
      <footer id="contacto" className={styles.footer}>
        <div className={`container ${styles.footerGrid}`}>
          <div className={styles.footerBrand}>
            <h2>Altta<span>Homes</span></h2>
            <span className={styles.footerTagline}>by Grupo Sadasi · Cancún</span>
            <p>50 años de trayectoria ininterrumpida, 430,000 viviendas entregadas y el respaldo de la primera desarrolladora mexicana certificada <em style={{ whiteSpace: "nowrap" }}>Best Place to Live</em>.</p>
            <a
              href="https://wa.me/529982059044?text=Hola,%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20las%20casas%20y%20departamentos%20de%20Altta%20Homes%20en%20Canc%C3%BAn."
              target="_blank"
              rel="noreferrer"
              className={styles.footerBrandCta}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Informes por WhatsApp
            </a>
          </div>
          <div className={styles.footerLinks}>
            <h3>Navegación</h3>
            <ul>
              <li><a href="#top">Inicio</a></li>
              <li><a href="/desarrollos-cancun/jardines-del-sur-6">Jardines del Sur 6</a></li>
              <li><a href="/desarrollos-cancun/la-rioja-2">La Rioja 2</a></li>
              <li><a href="/desarrollos-cancun/lirios-residencial-2">Lirios Residencial 2</a></li>
              <li><a href="/desarrollos-cancun/jardines-del-sur-7">Jardines del Sur 7 · Próximamente</a></li>
              <li><a href="/preguntas-frecuentes">Preguntas Frecuentes</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="#modelos">Modelos y Precios</a></li>
              <li><ContactNavBtn /></li>
            </ul>
          </div>
          <div className={styles.footerContact}>
            <h3>Contacto</h3>
            <div className={styles.footerContactItem}>
              <span className={styles.footerContactIcon}>📍</span>
              <a
                href="https://maps.app.goo.gl/9sKBR1fUNSswv5d19"
                target="_blank"
                rel="noreferrer"
              >
                Av. 127 SM 342 MZ 27, 77536 Cancún, Q.R.
              </a>
            </div>
            <div className={styles.footerContactItem}>
              <span className={styles.footerContactIcon}>📞</span>
              <FooterPhoneContact />
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2026 Altta Homes by Grupo Sadasi. Todos los derechos reservados.</p>
        </div>
      </footer>

      <FloatingWhatsApp />
    </div>
  );
}
