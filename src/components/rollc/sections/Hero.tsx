import type { Locale } from "@/data/rollc/content";

export function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="hero">
      <div className="hero-bg">
        <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=80" alt={locale === "ar" ? "غرفة معيشة فاخرة من رولك" : "Rollc luxury living room"} />
      </div>
      <div className="wrap">
        <div className="hero-inner">
          <span className="eyebrow">{locale === "ar" ? "رولك — أثاث فاخر" : "Rollc — Fine Furniture"}</span>
          <h1>{locale === "ar" ? "أثاث يصنع" : "Furniture that"}<br /><em>{locale === "ar" ? "حضور المكان" : "commands the room"}</em></h1>
          <p>{locale === "ar" ? "قطعٌ مختارة بعناية، وغرفٌ منسّقة بلمسة فنية، مع خدمة توصيل وتركيب احترافية تصل إلى باب منزلك في جميع أنحاء المملكة." : "Carefully curated pieces and artfully styled rooms, with professional delivery and installation brought right to your door across the Kingdom."}</p>
          <div className="hero-cta">
            <a href="#categories" className="btn btn--solid"><span>{locale === "ar" ? "استكشف المجموعات" : "Explore collections"}</span><span className="arrow">→</span></a>
            <a href="#showroom" className="btn btn--ghost"><span>{locale === "ar" ? "صمّم منزلك" : "Design your room"}</span></a>
          </div>
        </div>
      </div>
      <a href={locale === "ar" ? "/products/milano-sofa" : "/en/products/milano-sofa"} className="hero-card" aria-label={locale === "ar" ? "عرض أريكة ميلانو" : "View Milano Sofa"}>
        <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80" alt={locale === "ar" ? "أريكة ميلانو" : "Milano Sofa"} />
        <div>
          <span className="hc-tag">Best seller</span>
          <p className="hc-name">{locale === "ar" ? "أريكة ميلانو" : "Milano Sofa"}</p>
          <p className="hc-price">4,250 <span style={{ fontSize: ".74rem" }}>{locale === "ar" ? "ر.س" : "SAR"}</span></p>
        </div>
      </a>
      <div className="hero-scroll"><span>{locale === "ar" ? "مرّر" : "Scroll"}</span><span className="line" /></div>
    </section>
  );
}
