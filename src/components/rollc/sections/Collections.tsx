import { collections, type Locale } from "@/data/rollc/content";
import { Reveal } from "@/components/rollc/ui/Reveal";

export function Collections({ locale }: { locale: Locale }) {
  return (
    <section className="section collections" id="collections">
      <div className="wrap">
        <Reveal className="sec-head">
          <div>
            <span className="eyebrow">{locale === "ar" ? "مجموعاتنا المميزة" : "Signature collections"}</span>
            <h2 className="h-display">{locale === "ar" ? "ثلاث حكاياتٍ من التصميم" : "Three stories in design"}</h2>
          </div>
        </Reveal>

        <Reveal className="coll-grid">
          {collections.map((collection) => (
            <article className="coll" key={collection.idx}>
              <img src={collection.img} alt={collection.alt} />
              <div className="coll-body">
                <span className="coll-idx">{collection.idx}</span>
                <h3 className="coll-title">{collection.title[locale]}</h3>
                <p className="coll-sub">{collection.sub[locale]}</p>
                <a href="#" className="coll-link">
                  <span>{locale === "ar" ? "استكشف" : "Explore"}</span> →
                </a>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
