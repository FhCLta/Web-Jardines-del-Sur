import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import FooterPhoneContact from "@/components/FooterPhoneContact";
import FooterSocial from "@/components/FooterSocial";
import ContactNavBtn from "@/components/ContactNavBtn";
import pageStyles from "@/app/page.module.css";
import styles from "../blog.module.css";
import { POSTS, getPost } from "../_lib/posts";
import { SITE_URL } from "@/lib/site";

const PHONE_E164 = "529982059044";
const OFFICE_ADDRESS = "Av. 127 SM 342 MZ 27, 77536 Cancún, Q.R.";
const OFFICE_MAP_URL = "https://maps.app.goo.gl/9sKBR1fUNSswv5d19";
const AUTHOR_NAME = "Florencio Hurtado";
const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(
  "Hola, quiero más información sobre casas y departamentos en Cancún."
)}`;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: { absolute: "Artículo no encontrado | Altta Homes" } };

  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: { absolute: post.metaTitle },
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      locale: "es_MX",
      url,
      siteName: "Altta Homes Cancún",
      title: post.metaTitle,
      description: post.description,
      publishedTime: post.date,
      authors: [AUTHOR_NAME],
      images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.coverAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.description,
      images: [post.coverImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.description,
        image: `${SITE_URL}${post.coverImage}`,
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: "es-MX",
        keywords: post.keywords.join(", "),
        author: { "@type": "Person", name: AUTHOR_NAME },
        publisher: {
          "@type": "Organization",
          name: "Altta Homes Cancún",
          logo: { "@type": "ImageObject", url: `${SITE_URL}/apple-icon.png` },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        isPartOf: { "@id": `${SITE_URL}/blog#blog` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <div className={styles.wrapper}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <SiteHeader />

      <header className={styles.articleHead}>
        <div className="container">
          <div className={styles.articleHeadInner}>
            <nav className={styles.crumbs} aria-label="Breadcrumb">
              <a href="/">Inicio</a> › <a href="/blog">Blog</a>
            </nav>
            <h1>{post.title}</h1>
            <div className={styles.articleMeta}>
              <span>{post.author}</span>
              <span>·</span>
              <span>{post.dateLabel}</span>
              <span>·</span>
              <span>{post.readingMinutes} min de lectura</span>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.cover}>
        <Image src={post.coverImage} alt={post.coverAlt} fill priority sizes="100vw" />
      </div>

      <article className={styles.articleBody}>
        {post.body.map((block, i) => {
          switch (block.type) {
            case "h2":
              return <h2 key={i}>{block.text}</h2>;
            case "h3":
              return <h3 key={i}>{block.text}</h3>;
            case "p":
              return <p key={i}>{block.text}</p>;
            case "ul":
              return (
                <ul key={i}>
                  {block.items.map((it, j) => (
                    <li key={j}>{it}</li>
                  ))}
                </ul>
              );
            case "ol":
              return (
                <ol key={i}>
                  {block.items.map((it, j) => (
                    <li key={j}>{it}</li>
                  ))}
                </ol>
              );
            case "cta":
              return (
                <div key={i}>
                  <a
                    className={styles.inlineCta}
                    href={block.href}
                    {...(block.href.startsWith("http")
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                  >
                    {block.label}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              );
            default:
              return null;
          }
        })}
      </article>

      <footer id="contacto" className={pageStyles.footer}>
        <div className={`container ${pageStyles.footerGrid}`}>
          <div className={pageStyles.footerBrand}>
            <h2>
              Altta<span>Homes</span>
            </h2>
            <span className={pageStyles.footerTagline}>by Grupo Sadasi · Cancún</span>
            <p>
              50 años de trayectoria ininterrumpida, 430,000 viviendas entregadas y el respaldo de la primera desarrolladora mexicana certificada{" "}
              <em style={{ whiteSpace: "nowrap" }}>Best Place to Live</em>.
            </p>
            <a href={waHref} target="_blank" rel="noreferrer" className={pageStyles.footerBrandCta}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Informes por WhatsApp
            </a>
          </div>
          <div className={pageStyles.footerLinks}>
            <h3>Navegación</h3>
            <ul>
              <li><a href="/">Inicio</a></li>
              <li><a href="/jardines-del-sur-6">Jardines del Sur 6</a></li>
              <li><a href="/jardines-del-sur-6/promociones">Promociones</a></li>
              <li><a href="/la-rioja-2">La Rioja 2</a></li>
              <li><a href="/lirios-residencial-2">Lirios Residencial 2</a></li>
              <li><a href="/jardines-del-sur-7">Jardines del Sur 7 · Próximamente</a></li>
              <li><a href="/preguntas-frecuentes">Preguntas Frecuentes</a></li>
              <li><a href="/calculadora-hipotecaria">Calculadora</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><ContactNavBtn /></li>
            </ul>
          </div>
          <div className={pageStyles.footerContact}>
            <h3>Contacto</h3>
            <div className={pageStyles.footerContactItem}>
              <span className={pageStyles.footerContactIcon}>📍</span>
              <a href={OFFICE_MAP_URL} target="_blank" rel="noreferrer">{OFFICE_ADDRESS}</a>
            </div>
            <div className={pageStyles.footerContactItem}>
              <span className={pageStyles.footerContactIcon}>📞</span>
              <FooterPhoneContact />
            </div>
          </div>
        </div>
        <div className={pageStyles.footerBottom}>
          <p>&copy; 2026 Altta Homes by Grupo Sadasi. Todos los derechos reservados.</p>
          <FooterSocial />
        </div>
      </footer>

      <FloatingWhatsApp />
    </div>
  );
}
