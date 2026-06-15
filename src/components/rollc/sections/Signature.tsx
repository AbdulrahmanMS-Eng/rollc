import type { Locale } from "@/data/rollc/content";
import { Reveal } from "@/components/rollc/ui/Reveal";

export function Signature({ locale }: { locale: Locale }) {
  return (
    <section className="section signature">
      <div className="wrap">
        <div className="sig-grid">
          <Reveal className="sig-visual">
            <div className="main"><img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80" alt="حرفية رولك" /></div>
            <div className="badge">
              <div className="num">12</div>
              <div className="lbl">{locale === "ar" ? "عاماً من الحرفية في صناعة الأثاث الفاخر" : "Years of craftsmanship in fine furniture"}</div>
            </div>
          </Reveal>

          <Reveal className="sig-text">
            <span className="eyebrow">{locale === "ar" ? "لماذا رولك" : "Why Rollc"}</span>
            <h2 className="h-display">{locale === "ar" ? "فخامةٌ تُلمَس في كل تفصيلة" : "Luxury you can feel in every detail"}</h2>
            <p className="lead">{locale === "ar" ? "نختار الخامات الطبيعية ونعمل عليها بأيدي حِرفيين، لنقدّم قطعاً تجمع بين الجمال البصري والراحة الحقيقية، وتدوم معك لسنوات." : "We select natural materials and shape them by the hands of skilled artisans, delivering pieces that pair visual beauty with genuine comfort, built to last for years."}</p>
            <div className="pillars">
              {[
                ["خاماتٌ أصيلة", "Authentic materials", "خشبٌ طبيعي وجلودٌ وأقمشة منتقاة بعناية.", "Solid wood, fine leathers, and carefully chosen fabrics."],
                ["راحةٌ مدروسة", "Considered comfort", "هندسةٌ مريحة تدعم جسمك في كل جلسة.", "Ergonomic design that supports you in every seat."],
                ["تصميمٌ معاصر", "Modern design", "خطوطٌ نظيفة بروحٍ خليجية أنيقة.", "Clean lines with a refined Gulf spirit."],
                ["توصيل وتركيب", "Delivery & install", "فريقٌ متخصص يوصّل ويركّب في منزلك.", "A dedicated team delivers and installs at home."],
              ].map((p) => (
                <div className="pillar" key={p[1]}>
                  <span className="pi"><svg viewBox="0 0 24 24"><path d="M12 3 4 7v6c0 4 3.5 7 8 8 4.5-1 8-4 8-8V7l-8-4Z" /></svg></span>
                  <h3>{locale === "ar" ? p[0] : p[1]}</h3>
                  <p>{locale === "ar" ? p[2] : p[3]}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
