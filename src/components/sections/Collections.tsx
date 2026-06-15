import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries/types";
import { collections } from "@/data/products";
import Reveal from "@/components/ui/Reveal";

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export default function Collections({ locale, dict }: Props) {
  return (
    <section className="section collections" id="collections">
      <div className="wrap">
        <Reveal className="sec-head">
          <div>
            <span className="eyebrow">{dict.collectionsSection.eyebrow}</span>
            <h2 className="h-display">{dict.collectionsSection.title}</h2>
          </div>
        </Reveal>

        <Reveal className="coll-grid">
          {collections.map((coll, i) => (
            <article className="coll" key={i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coll.img} alt={coll.title[locale]} />
              <div className="coll-body">
                <span className="coll-idx">{coll.idx}</span>
                <h3 className="coll-title">{coll.title[locale]}</h3>
                <p className="coll-sub">{coll.sub[locale]}</p>
                <a href="#" className="coll-link">
                  <span>{dict.collectionsSection.explore}</span> →
                </a>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
