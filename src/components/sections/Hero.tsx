import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries/types";
import { heroImage, heroCardImage } from "@/data/site";

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export default function Hero({ dict }: Props) {
  return (
    <section className="hero">
      <div className="hero-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroImage} alt={dict.hero.eyebrow} />
      </div>
      <div className="wrap">
        <div className="hero-inner">
          <span className="eyebrow">{dict.hero.eyebrow}</span>
          <h1>
            {dict.hero.titleLead}
            <br />
            <em>{dict.hero.titleEm}</em>
          </h1>
          <p>{dict.hero.body}</p>
          <div className="hero-cta">
            <a href="#categories" className="btn btn--solid">
              <span>{dict.hero.ctaPrimary}</span>
              <span className="arrow">→</span>
            </a>
            <a href="#showroom" className="btn btn--ghost">
              <span>{dict.hero.ctaSecondary}</span>
            </a>
          </div>
        </div>
      </div>

      <aside className="hero-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroCardImage} alt={dict.hero.cardName} />
        <div>
          <span className="hc-tag">{dict.hero.cardTag}</span>
          <p className="hc-name">{dict.hero.cardName}</p>
          <p className="hc-price">
            {dict.hero.cardPrice} <span style={{ fontSize: ".74rem" }}>{dict.productsSection.currency}</span>
          </p>
        </div>
      </aside>

      <div className="hero-scroll">
        <span>{dict.hero.scroll}</span>
        <span className="line" />
      </div>
    </section>
  );
}
