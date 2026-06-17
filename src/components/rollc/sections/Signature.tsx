import type { Locale } from "@/data/rollc/content";
import { Reveal } from "@/components/rollc/ui/Reveal";
import { PillarsRail } from "@/components/rollc/sections/PillarsRail";

export function Signature({ locale }: { locale: Locale }) {
  return (
    <section className="section signature">
      <div className="wrap">
        <div className="sig-grid">
          <Reveal className="sig-visual">
            <div className="main">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80"
                alt={locale === "ar" ? "حرفية رولك" : "Rollc craftsmanship"}
              />
            </div>
            <div className="badge">
              <div className="num">26</div>
              <div className="lbl">
                {locale === "ar"
                  ? "عاماً من الحرفية في صناعة الأثاث الفاخر"
                  : "Years of craftsmanship in fine furniture"}
              </div>
            </div>
          </Reveal>

          <Reveal className="sig-text">
            <span className="eyebrow">{locale === "ar" ? "لماذا رولك" : "Why Rollc"}</span>
            <h2 className="h-display">
              {locale === "ar" ? "فخامةٌ تُلمَس في كل التفاصيل" : "Luxury you can feel in every detail"}
            </h2>
            <p className="lead">
              {locale === "ar"
                ? "نختار الخامات الطبيعية ونعمل عليها بأيدي حِرفيين، لنقدّم قطعاً تجمع بين الجمال البصري والراحة الحقيقية، وتدوم معك لسنوات."
                : "We select natural materials and shape them by the hands of skilled artisans, delivering pieces that pair visual beauty with genuine comfort, built to last for years."}
            </p>

            <PillarsRail locale={locale} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
