import { categories, type Locale } from "@/data/rollc/content";
import { Reveal } from "@/components/rollc/ui/Reveal";

export function Categories({ locale }: { locale: Locale }) {
  return (
    <section className="section cats" id="categories">
      <div className="wrap">
        <Reveal className="sec-head">
          <div>
            <span className="eyebrow">{locale === "ar" ? "تسوّق حسب المساحة" : "Shop by space"}</span>
            <h2 className="h-display">{locale === "ar" ? "غرفٌ مصممة لتُحاكي أسلوبك" : "Rooms designed to echo your style"}</h2>
          </div>
          <a href="#products" className="sec-link"><span>{locale === "ar" ? "كل الفئات" : "All categories"}</span><span className="arrow">→</span></a>
        </Reveal>
        <Reveal className="cat-grid">
          {categories.map((cat) => (
            <a
              href={`${locale === "ar" ? "" : "/en"}/categories/${cat.slug}`}
              className="cat"
              key={cat.num}
              aria-label={cat.title[locale]}
            >
              <img src={cat.img} alt={cat.alt} />
              <div className="cat-body">
                <span className="cat-num">{cat.num}</span>
                <h3 className="cat-title">{cat.title[locale]}</h3>
                <p className="cat-sub">{cat.sub[locale]}</p>
                <span className="cat-go">{locale === "ar" ? "اكتشف ←" : "Discover →"}</span>
              </div>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
