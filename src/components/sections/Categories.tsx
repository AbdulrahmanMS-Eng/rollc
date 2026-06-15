import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries/types";
import { categories } from "@/data/products";
import Reveal from "@/components/ui/Reveal";

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export default function Categories({ locale, dict }: Props) {
  return (
    <section className="section cats" id="categories">
      <div className="wrap">
        <Reveal className="sec-head">
          <div>
            <span className="eyebrow">{dict.categoriesSection.eyebrow}</span>
            <h2 className="h-display">{dict.categoriesSection.title}</h2>
          </div>
          <a href="#products" className="sec-link">
            <span>{dict.categoriesSection.link}</span>
            <span className="arrow">→</span>
          </a>
        </Reveal>

        <Reveal className="cat-grid">
          {categories.map((cat, i) => (
            <article className="cat" key={i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cat.img} alt={cat.title[locale]} />
              <div className="cat-body">
                <span className="cat-num">{cat.num}</span>
                <h3 className="cat-title">{cat.title[locale]}</h3>
                <p className="cat-sub">{cat.sub[locale]}</p>
                <span className="cat-go">{dict.categoriesSection.discover}</span>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
