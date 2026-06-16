import type { Locale } from "@/data/rollc/content";
import { Reveal } from "@/components/rollc/ui/Reveal";

const pillars = [
  {
    arTitle: "خاماتٌ أصيلة",
    enTitle: "Authentic materials",
    arText: "خشبٌ طبيعي وجلودٌ وأقمشة منتقاة بعناية.",
    enText: "Solid wood, fine leathers, and carefully chosen fabrics.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 3 4 7v6c0 4 3.5 7 8 8 4.5-1 8-4 8-8V7l-8-4Z" />
      </svg>
    ),
  },
  {
    arTitle: "راحةٌ مدروسة",
    enTitle: "Considered comfort",
    arText: "هندسةٌ مريحة تدعم جسمك في كل جلسة.",
    enText: "Ergonomic design that supports you in every seat.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M3 18v-6a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v6" />
        <path d="M3 18h18M6 18v2M18 18v2M5 12h14" />
      </svg>
    ),
  },
  {
    arTitle: "تصميمٌ معاصر",
    enTitle: "Modern design",
    arText: "خطوطٌ نظيفة بروحٍ خليجية أنيقة.",
    enText: "Clean lines with a refined Gulf spirit.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="m12 2 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8L12 2Z" />
      </svg>
    ),
  },
  {
    arTitle: "توصيل وتركيب",
    enTitle: "Delivery & install",
    arText: "فريقٌ متخصص يوصّل ويركّب في منزلك.",
    enText: "A dedicated team delivers and installs at home.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M3 13h12V6H3v7Z" />
        <path d="M15 9h4l2 3v1h-6" />
        <circle cx="6.5" cy="16.5" r="1.6" />
        <circle cx="17.5" cy="16.5" r="1.6" />
      </svg>
    ),
  },
];

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
              <div className="num">12</div>
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
              {locale === "ar" ? "فخامةٌ تُلمَس في كل تفصيلة" : "Luxury you can feel in every detail"}
            </h2>
            <p className="lead">
              {locale === "ar"
                ? "نختار الخامات الطبيعية ونعمل عليها بأيدي حِرفيين، لنقدّم قطعاً تجمع بين الجمال البصري والراحة الحقيقية، وتدوم معك لسنوات."
                : "We select natural materials and shape them by the hands of skilled artisans, delivering pieces that pair visual beauty with genuine comfort, built to last for years."}
            </p>

            <div className="pillars">
              {pillars.map((pillar) => (
                <div className="pillar" key={pillar.enTitle}>
                  <span className="pi" aria-hidden="true">{pillar.icon}</span>
                  <h3>{locale === "ar" ? pillar.arTitle : pillar.enTitle}</h3>
                  <p>{locale === "ar" ? pillar.arText : pillar.enText}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
