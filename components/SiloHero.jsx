import React from "react";
import styles from "./Hero.module.css";
import siloStyles from "@/app/(desarrollos)/silo.module.css";
import HeroBackground from "./HeroBackground";

// Resalta en dorado la frase detailAccent dentro del texto del subtítulo
function renderDetail(text, accent) {
  if (!accent || !text.includes(accent)) return text;
  const [before, after] = text.split(accent);
  return (
    <>
      {before}
      <strong className={styles.subtitleFast}>{accent}</strong>
      {after}
    </>
  );
}

export default function SiloHero({ dev, waHref, subtitleBold, subtitleBreakdown, subtitleDetail }) {
  const { hero, name } = dev;

  return (
    <section id="top" className={styles.hero}>
      <HeroBackground
        slides={hero.slides}
        mobileImage={hero.mobileImage}
        gradientOnly={hero.gradientOnly}
        animationDuration="28s"
      />

      <div className={`container ${styles.content}`}>
        <nav className={siloStyles.breadcrumb} aria-label="Breadcrumb">
          <a href="/">Inicio</a>
          <span className={siloStyles.breadcrumbSep}>›</span>
          <a href="/#desarrollos">Desarrollos</a>
          <span className={siloStyles.breadcrumbSep}>›</span>
          <span className={siloStyles.breadcrumbCurrent}>{name}</span>
        </nav>

        <span className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          <strong>{hero.eyebrow.strong}</strong>
          {hero.eyebrow.rest.map((part, i) => (
            <React.Fragment key={i}>
              <span className={styles.eyebrowSep}>·</span>
              {part}
            </React.Fragment>
          ))}
        </span>

        <h1 className={styles.title}>
          {hero.title.lines.map((line, i) => (
            <span key={i} className={styles.titleLine}>
              {line}
            </span>
          ))}
          <em className={styles.trustTitle}>{hero.title.em}</em>
        </h1>

        <p className={styles.subtitle}>
          <span className={styles.subtitleDevelopments}>{subtitleBold ?? hero.subtitle.bold}</span>
          {subtitleBreakdown && (
            <span className={styles.subtitleBreakdown}>{subtitleBreakdown}</span>
          )}
          <span className={styles.subtitleDetail}>
            {renderDetail(subtitleDetail ?? hero.subtitle.detail, hero.subtitle.detailAccent)}
          </span>
        </p>

        <div className={styles.ctas}>
          <a href="#modelos" className={`btn btn-primary ${styles.ctaPrimary}`}>
            Ver Modelos y Precios
          </a>
          <a
            href={waHref}
            className={`btn ${styles.ctaSecondary}`}
            target="_blank"
            rel="noreferrer"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.5 3.5A11.4 11.4 0 0012 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.7.9 3.7 1.4 5.8 1.4 6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.5-8.3zM12 21.8c-1.8 0-3.6-.5-5.2-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.7 9.7 0 01-1.5-5.2C2 6.5 6.5 2 12 2s10 4.5 10 10-4.5 9.8-10 9.8zm5.5-7.4c-.3-.2-1.8-.9-2-1s-.5-.2-.7.1-.8 1-1 1.2-.4.2-.7 0c-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5l.3-.4c0-.2.1-.3 0-.5l-.9-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4z" />
            </svg>
            Hablar con un asesor
          </a>
        </div>
      </div>

      <a
        href="#modelos"
        className={styles.scrollHint}
        aria-label="SCROLL a modelos"
      >
        <span>SCROLL</span>
        <span className={styles.scrollArrow} aria-hidden="true" />
      </a>
    </section>
  );
}
