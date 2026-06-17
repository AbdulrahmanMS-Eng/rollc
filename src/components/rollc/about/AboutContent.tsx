"use client";

import { Reveal } from "@/components/rollc/ui/Reveal";
import type { Locale } from "@/data/rollc/content";
import styles from "./About.module.css";

/* ----------------------------------------------------------------
   Bilingual flagship "About / من نحن" page content.
   Fixed true facts: founded 2000 · 26 years (2000–2026) ·
   tel +966 55 205 5514 · email customerservice@rollcksa.com.
   Everything bracketed [ … ] is a PLACEHOLDER for the owner to swap.
   ---------------------------------------------------------------- */

type L = Record<Locale, string>;
const t = (locale: Locale, v: L) => v[locale];

export function AboutContent({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const base = ar ? "" : "/en";
  const collectionsHref = `${base}/categories/sofas`;

  return (
    <div className={styles.aboutTemplate}>
      {/* ============ HERO ============ */}
      <header className={styles.hero}>
        <img
          className={styles.heroImg}
          src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=2000&q=80"
          alt={ar ? "صالة معيشة فاخرة من تصميم رولك" : "A luxurious living space crafted by Rollc"}
        />
        <div className="wrap">
          <div className={styles.heroInner}>
            <div className={styles.heroEyebrowRow}>
              <span className={`${styles.eyebrow} ${styles.eyebrowLight}`}>
                {t(locale, { ar: "من نحن", en: "Who we are" })}
              </span>
              <span className={styles.heroSince}>
                {t(locale, { ar: "منذ عام 2000", en: "Since 2000" })}
              </span>
            </div>
            <h1 className={styles.heroTitle}>
              {ar ? (
                <>
                  نصنع المساحات الفاخرة <em>التي تليق بالمملكة</em>
                </>
              ) : (
                <>
                  Crafting the spaces <em>the Kingdom deserves</em>
                </>
              )}
            </h1>
            <p className={styles.heroLead}>
              {t(locale, {
                ar: "رولك علامة سعودية للأثاث الفاخر والتجهيز المتكامل، تأسست عام 2000. على مدى 26 عاماً، حوّلنا الرؤى إلى مساحاتٍ تجمع بين الإتقان الحرفي والخامات الأصيلة والتصميم الخليجي المعاصر.",
                en: "Rollc is a Saudi house of luxury furniture and turnkey fit-out, founded in 2000. For 26 years we have turned visions into spaces that unite master craftsmanship, authentic materials, and contemporary Gulf design.",
              })}
            </p>
            <div className={styles.heroCtas}>
              <a href="#contact" className={styles.btnSolid}>
                {t(locale, { ar: "اطلب استشارة", en: "Request a consultation" })}
                <span className={styles.arrow}>→</span>
              </a>
              <a href={collectionsHref} className={styles.btnGhost}>
                {t(locale, { ar: "استكشف المجموعات", en: "Explore collections" })}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ============ STATS BAND ============ */}
      <section className={`${styles.section} ${styles.stats}`}>
        <div className="wrap">
          <Reveal>
            <div className={styles.statsGrid}>
              {[
                { numEn: "[ 26+ ]", lbl: { ar: "عاماً من الإتقان (2000–2026)", en: "Years of mastery (2000–2026)" } },
                { numEn: "[ 500+ ]", lbl: { ar: "مشروع منجز", en: "Projects delivered" } },
                { numEn: "[ 20+ ]", lbl: { ar: "مدينة في المملكة", en: "Cities across the Kingdom" } },
                { numEn: "[ 100+ ]", lbl: { ar: "شريك وعلامة فاخرة", en: "Partners & luxury brands" } },
              ].map((s, i) => (
                <div key={i} className={styles.stat}>
                  <div className={styles.statNum}>{s.numEn}</div>
                  <div className={styles.statLbl}>{t(locale, s.lbl)}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ STORY ============ */}
      <section className={`${styles.section} ${styles.story}`}>
        <div className="wrap">
          <div className={styles.storyGrid}>
            <Reveal>
              <div className={styles.storyHead}>
                <span className={styles.eyebrow}>{t(locale, { ar: "قصتنا", en: "Our story" })}</span>
                <h2 className={styles.display}>
                  {t(locale, { ar: "من ورشةٍ واحدة إلى علامةٍ تُسلَّم بها المشاريع", en: "From a single workshop to a name tenders trust" })}
                </h2>
                <p className={styles.storyOpen}>
                  {t(locale, {
                    ar: "بدأت رولك عام 2000 بقناعةٍ واحدة: أن الأثاث الفاخر ليس قطعةً تُشترى، بل مساحةٌ تُعاش.",
                    en: "Rollc began in 2000 with a single conviction: that luxury furniture is not a piece you buy, but a space you live.",
                  })}
                </p>
                <div className={styles.storyBody}>
                  <p>
                    {t(locale, {
                      ar: "على مدى أكثر من ربع قرن، نمت ورشتنا الأولى لتصبح بيتاً متكاملاً للتصميم والتصنيع والتجهيز، يخدم المنازل الخاصة والمشاريع التجارية والمؤسسية في مختلف أنحاء المملكة.",
                      en: "Over more than a quarter-century, that first workshop grew into a complete house of design, manufacturing, and fit-out — serving private homes, commercial projects, and institutions across the Kingdom.",
                    })}
                  </p>
                  <p>
                    {t(locale, {
                      ar: "اليوم، ومع حلول عام 2026، تجمع رولك بين أصالة الصنعة وروح التصميم المعاصر، لتقدّم أعمالاً ترقى إلى أكبر المناقصات وأرفع المعايير.",
                      en: "Today, as we reach 2026, Rollc unites time-honoured craft with a contemporary design spirit — delivering work that meets the most demanding tenders and the highest standards.",
                    })}
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal>
              <div className={styles.storyVisual}>
                <div className={styles.storyFrame}>
                  <img
                    loading="lazy"
                    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1100&q=80"
                    alt={ar ? "تفاصيل أثاث فاخر بصناعة رولك" : "Detail of fine furniture crafted by Rollc"}
                  />
                </div>
                <div className={styles.storyYears}>
                  <div className={styles.storyYr}>2000 — 2026</div>
                  <div className={styles.storyYl}>{t(locale, { ar: "ستةٌ وعشرون عاماً", en: "Twenty-six years" })}</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ MISSION / VISION ============ */}
      <section className={`${styles.section} ${styles.mv}`}>
        <div className="wrap">
          <div className={styles.mvGrid}>
            <Reveal>
              <div className={styles.mvCard}>
                <div className={styles.mvIcon}>
                  {/* compass / direction */}
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></svg>
                </div>
                <h3>{t(locale, { ar: "رسالتنا", en: "Our mission" })}</h3>
                <p>
                  {t(locale, {
                    ar: "أن نصمّم ونصنّع ونجهّز مساحاتٍ فاخرة تُجسّد ذوق عملائنا، بخاماتٍ أصيلة وتنفيذٍ دقيق وخدمةٍ تمتد إلى ما بعد التسليم.",
                    en: "To design, craft, and fit out luxurious spaces that embody our clients' taste — through authentic materials, precise execution, and service that extends well beyond delivery.",
                  })}
                </p>
              </div>
            </Reveal>
            <Reveal>
              <div className={styles.mvCard}>
                <div className={styles.mvIcon}>
                  {/* eye / vision */}
                  <svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>
                </div>
                <h3>{t(locale, { ar: "رؤيتنا", en: "Our vision" })}</h3>
                <p>
                  {t(locale, {
                    ar: "أن نكون العلامة الأولى التي يُحتكَم إليها في الأثاث الفاخر والتجهيز المتكامل في المملكة، ومرجعاً للتصميم الخليجي المعاصر في المنطقة.",
                    en: "To be the first name trusted for luxury furniture and turnkey fit-out in the Kingdom, and a regional reference for contemporary Gulf design.",
                  })}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ VALUES ============ */}
      <section className={`${styles.section} ${styles.values}`}>
        <div className="wrap">
          <Reveal>
            <div className={`${styles.secHead} ${styles.center}`}>
              <span className={styles.eyebrow}>{t(locale, { ar: "قيمنا", en: "Our values" })}</span>
              <h2 className={styles.display}>{t(locale, { ar: "ما الذي يقف خلف كل قطعة", en: "What stands behind every piece" })}</h2>
              <p>{t(locale, { ar: "مبادئ ثابتة توجّه كل قرارٍ نتخذه، من أول رسمةٍ إلى آخر لمسة تركيب.", en: "Enduring principles that guide every decision — from the first sketch to the final installed detail." })}</p>
            </div>
          </Reveal>
          <Reveal>
            <div className={styles.valGrid}>
              {[
                {
                  icon: <svg viewBox="0 0 24 24"><path d="m12 3 2.5 5 5.5.8-4 3.9.9 5.5L12 16.5 7.1 18.2l.9-5.5-4-3.9L9.5 8 12 3Z" /></svg>,
                  h: { ar: "الإتقان الحرفي", en: "Craftsmanship" },
                  p: { ar: "كل قطعةٍ تمرّ بأيدٍ خبيرة وعينٍ لا تتهاون مع التفاصيل.", en: "Every piece passes through expert hands and an eye that never compromises on detail." },
                },
                {
                  icon: <svg viewBox="0 0 24 24"><path d="M12 3 4 7v6c0 4.5 3.4 7.3 8 8 4.6-.7 8-3.5 8-8V7l-8-4Z" /><path d="m9 12 2 2 4-4" /></svg>,
                  h: { ar: "الأصالة والثقة", en: "Integrity & trust" },
                  p: { ar: "خاماتٌ أصيلة ووعودٌ تُنفَّذ كما اتُّفق عليها، دون استثناء.", en: "Authentic materials and promises delivered exactly as agreed — without exception." },
                },
                {
                  icon: <svg viewBox="0 0 24 24"><path d="M3 21V8l9-5 9 5v13" /><path d="M9 21v-6h6v6" /></svg>,
                  h: { ar: "تصميمٌ خليجي معاصر", en: "Gulf-rooted design" },
                  p: { ar: "هويةٌ تنبع من ثقافة المكان وتنفتح على لغة التصميم العالمية.", en: "An identity rooted in local culture, fluent in the global design language." },
                },
                {
                  icon: <svg viewBox="0 0 24 24"><path d="M20 7 9 18l-5-5" /></svg>,
                  h: { ar: "خدمةٌ تدوم", en: "Service that lasts" },
                  p: { ar: "علاقتنا مع العميل تبدأ عند التسليم ولا تنتهي بعده.", en: "Our relationship with the client begins at handover — it does not end there." },
                },
              ].map((v, i) => (
                <div key={i} className={styles.valCard}>
                  <span className={styles.valNum}>{`0${i + 1}`}</span>
                  <div className={styles.valIcon}>{v.icon}</div>
                  <h3>{t(locale, v.h)}</h3>
                  <p>{t(locale, v.p)}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className={`${styles.section} ${styles.services}`}>
        <div className="wrap">
          <Reveal>
            <div className={styles.secHead}>
              <span className={styles.eyebrow}>{t(locale, { ar: "خدماتنا", en: "Our services" })}</span>
              <h2 className={styles.display}>{t(locale, { ar: "من القطعة الواحدة إلى المشروع المتكامل", en: "From a single piece to a complete project" })}</h2>
              <p>{t(locale, { ar: "نرافق المشروع في كل مراحله، ونسلّمه جاهزاً في مختلف مدن المملكة.", en: "We accompany the project through every stage and hand it over, turnkey, across the Kingdom." })}</p>
            </div>
          </Reveal>
          <Reveal>
            <div className={styles.svcGrid}>
              {[
                {
                  icon: <svg viewBox="0 0 24 24"><path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" /><path d="M3 11h18v6" /><path d="M5 17v3M19 17v3" /></svg>,
                  h: { ar: "الأثاث الفاخر", en: "Luxury furniture" },
                  p: { ar: "تشكيلاتٌ راقية وقطعٌ مُفصّلة حسب الطلب بأرقى الخامات.", en: "Refined collections and bespoke pieces made to order in the finest materials." },
                },
                {
                  icon: <svg viewBox="0 0 24 24"><path d="M3 21h18" /><path d="M5 21V7l8-4 8 4v14" /><path d="M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" /></svg>,
                  h: { ar: "التجهيز المتكامل", en: "Turnkey fit-out" },
                  p: { ar: "تجهيز المساحات السكنية والتجارية والمؤسسية من الألف إلى الياء.", en: "End-to-end fit-out for residential, commercial, and institutional spaces." },
                },
                {
                  icon: <svg viewBox="0 0 24 24"><path d="M12 19 7 22l1-5.5L4 13l5.5-.8L12 7l2.5 5.2 5.5.8-4 3.5 1 5.5-5-3Z" /><path d="M12 7V2" /></svg>,
                  h: { ar: "الاستشارة والتصميم", en: "Design consultation" },
                  p: { ar: "استشاراتٌ تصميمية ومخططاتٌ ثلاثية الأبعاد قبل أي تنفيذ.", en: "Design consultation and 3D visualisation before any execution begins." },
                },
                {
                  icon: <svg viewBox="0 0 24 24"><path d="M3 7h11v8H3z" /><path d="M14 9h4l3 3v3h-7" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>,
                  h: { ar: "التوصيل والتركيب", en: "Delivery & installation" },
                  p: { ar: "توصيلٌ وتركيبٌ احترافي يغطي مختلف مدن المملكة.", en: "Professional delivery and installation covering cities across the Kingdom." },
                },
              ].map((s, i) => (
                <div key={i} className={styles.svcCard}>
                  <div className={styles.svcIcon}>{s.icon}</div>
                  <div>
                    <h3>{t(locale, s.h)}</h3>
                    <p>{t(locale, s.p)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ TIMELINE ============ */}
      <section className={`${styles.section} ${styles.timeline}`}>
        <div className="wrap">
          <Reveal>
            <div className={styles.secHead}>
              <span className={`${styles.eyebrow} ${styles.eyebrowLight}`}>{t(locale, { ar: "المسيرة", en: "The journey" })}</span>
              <h2 className={styles.display}>{t(locale, { ar: "ستةٌ وعشرون عاماً من النمو", en: "Twenty-six years of growth" })}</h2>
              <p>{t(locale, { ar: "محطّاتٌ مختارة من مسيرة رولك — تُحدَّث المعالم بالتواريخ والإنجازات الرسمية.", en: "Selected milestones from the Rollc journey — labels to be updated with official dates and achievements." })}</p>
            </div>
          </Reveal>
          <Reveal>
            <div className={styles.tlTrack}>
              {[
                { yr: "2000", lbl: { ar: "تأسيس رولك وانطلاق أول ورشة", en: "Rollc is founded; the first workshop opens" } },
                { yr: "2008", lbl: { ar: "افتتاح أول صالة عرض رئيسية", en: "First flagship showroom opens" } },
                { yr: "2014", lbl: { ar: "التوسّع في التجهيز المؤسسي", en: "Expansion into institutional fit-out" } },
                { yr: "2019", lbl: { ar: "تسليم مشروعٍ بارز عبر المملكة", en: "A landmark project delivered across the Kingdom" } },
                { yr: "2022", lbl: { ar: "اعتماد معايير الجودة والتصنيع", en: "Quality and manufacturing standards adopted" } },
                { yr: "2026", lbl: { ar: "أكثر من 500 مشروع عبر أكثر من 20 مدينة", en: "500+ projects across 20+ cities" } },
              ].map((m, i) => (
                <div key={i} className={styles.tlItem}>
                  <div className={styles.tlYear}>{m.yr}</div>
                  <div className={styles.tlLabel}>{t(locale, m.lbl)}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section className={`${styles.section} ${styles.process}`}>
        <div className="wrap">
          <Reveal>
            <div className={styles.secHead}>
              <span className={styles.eyebrow}>{t(locale, { ar: "كيف نعمل", en: "How we work" })}</span>
              <h2 className={styles.display}>{t(locale, { ar: "أربع مراحل، تجربةٌ واحدة متقنة", en: "Four stages, one seamless experience" })}</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className={styles.procGrid}>
              {[
                { h: { ar: "الاستشارة", en: "Consultation" }, p: { ar: "نستمع لاحتياجك ونزور الموقع ونضع نطاق العمل.", en: "We listen, survey the site, and define the scope." } },
                { h: { ar: "التصميم", en: "Design" }, p: { ar: "مخططاتٌ وتصوّراتٌ ثلاثية الأبعاد حتى الاعتماد.", en: "Plans and 3D visuals refined until approval." } },
                { h: { ar: "التصنيع", en: "Crafting" }, p: { ar: "تصنيعٌ دقيق بخاماتٍ أصيلة ومراقبة جودة.", en: "Precise crafting in authentic materials, quality-checked." } },
                { h: { ar: "التوصيل والتركيب", en: "Delivery & install" }, p: { ar: "تسليمٌ وتركيبٌ احترافي ومتابعةٌ بعد البيع.", en: "Professional delivery, installation, and after-sales care." } },
              ].map((s, i) => (
                <div key={i} className={styles.procStep}>
                  <div className={styles.procNum}>{`0${i + 1}`}</div>
                  <h3>{t(locale, s.h)}</h3>
                  <p>{t(locale, s.p)}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ WHY ROLLC ============ */}
      <section className={`${styles.section} ${styles.why}`}>
        <div className="wrap">
          <div className={styles.whyGrid}>
            <Reveal>
              <div className={styles.whyAside}>
                <span className={styles.eyebrow}>{t(locale, { ar: "لماذا رولك", en: "Why Rollc" })}</span>
                <h3>{t(locale, { ar: "علامةٌ تُطمئن أصحاب القرار", en: "A name decision-makers rely on" })}</h3>
                <p>
                  {t(locale, {
                    ar: "حين تُسلَّم رولك مشروعاً، تُسلَّم معه 26 عاماً من الخبرة وسجلٌّ من المشاريع المنجزة وفريقٌ يلتزم بالموعد والميزانية والجودة.",
                    en: "When Rollc takes on a project, it brings 26 years of experience, a record of delivered work, and a team committed to schedule, budget, and quality.",
                  })}
                </p>
                <a href="#contact" className={styles.btnSolid}>
                  {t(locale, { ar: "تحدّث إلينا", en: "Talk to us" })}
                  <span className={styles.arrow}>→</span>
                </a>
              </div>
            </Reveal>
            <Reveal>
              <div className={styles.whyList}>
                {[
                  { h: { ar: "إتقانٌ حرفي", en: "True craftsmanship" }, p: { ar: "تنفيذٌ يدوي دقيق يرفع كل قطعةٍ فوق المعتاد.", en: "Precise handwork that lifts every piece above the ordinary." } },
                  { h: { ar: "خاماتٌ أصيلة", en: "Authentic materials" }, p: { ar: "أخشابٌ وأقمشةٌ وتشطيباتٌ مختارةٌ تدوم.", en: "Carefully sourced woods, fabrics, and finishes built to last." } },
                  { h: { ar: "تصميمٌ خليجي معاصر", en: "Contemporary Gulf design" }, p: { ar: "هويةٌ محلية بروحٍ عالمية حديثة.", en: "A local identity with a modern, global sensibility." } },
                  { h: { ar: "ضمانٌ موثّق", en: "Documented warranty" }, p: { ar: "[ ضمان ____ سنة ] على التصنيع والتركيب.", en: "[ ____-year warranty ] on manufacturing and installation." } },
                  { h: { ar: "خدمةٌ بعد البيع", en: "After-sales support" }, p: { ar: "صيانةٌ ومتابعةٌ تحفظ قيمة استثمارك.", en: "Maintenance and follow-up that protect your investment." } },
                ].map((w, i) => (
                  <div key={i} className={styles.whyItem}>
                    <span className={styles.whyTick}>
                      <svg viewBox="0 0 24 24"><path d="M20 7 9 18l-5-5" /></svg>
                    </span>
                    <div>
                      <h3>{t(locale, w.h)}</h3>
                      <p>{t(locale, w.p)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ PARTNERS / CLIENTS / ACCREDITATIONS ============ */}
      <section className={`${styles.section} ${styles.trust}`}>
        <div className="wrap">
          <Reveal>
            <div className={`${styles.secHead} ${styles.center}`}>
              <h2 className={styles.display}>{t(locale, { ar: "شركاؤنا", en: "Our partners" })}</h2>
            </div>
          </Reveal>
          <Reveal>
            <LogoMarquee locale={locale} />
          </Reveal>
          <Reveal>
            <h2 className={`${styles.display} ${styles.certTitle}`}>{t(locale, { ar: "الاعتمادات", en: "Accreditations" })}</h2>
            <div className={styles.trustCert}>
              {[
                {
                  title: t(locale, { ar: "شهادة ISO 9001:2008", en: "ISO 9001:2008 Certification" }),
                  meta: t(locale, { ar: "إدارة الجودة", en: "Quality Management" }),
                },
                {
                  title: t(locale, { ar: "اعتماد UL", en: "UL Certification" }),
                  meta: t(locale, { ar: "للأبواب المقاومة للحريق", en: "Fire-Rated Rolling Shutter Doors" }),
                },
                {
                  title: t(locale, { ar: "تصنيف STC 31", en: "STC 31 Rating" }),
                  meta: t(locale, { ar: "للأبواب العازلة للصوت", en: "Acoustic Door Certification" }),
                },
                {
                  title: t(locale, { ar: "تصنيف K-12 وفق ASTM 2656", en: "K-12 / ASTM 2656 Rating" }),
                  meta: t(locale, { ar: "للحواجز الهيدروليكية", en: "Hydraulic Road Blockers" }),
                },
              ].map((item) => (
                <div key={item.title} className={styles.certBadge}>
                  <span className={styles.certBadgeLabel}>{item.title}</span>
                  <span className={styles.certBadgeMeta}>{item.meta}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ CLOSING CTA ============ */}
      <section className={`${styles.section} ${styles.cta}`} id="contact">
        <div className="wrap">
          <div className={styles.ctaInner}>
            <Reveal>
              <div className={styles.ctaText}>
                <span className={styles.eyebrow}>{t(locale, { ar: "لنبدأ", en: "Let's begin" })}</span>
                <h2>{t(locale, { ar: "هل لديك مشروعٌ أو مناقصة؟", en: "Have a project or a tender?" })}</h2>
                <p>
                  {t(locale, {
                    ar: "تواصل مع فريق رولك لمناقشة متطلباتك والحصول على عرضٍ يليق بمشروعك. نرافقك من أول استشارةٍ إلى آخر لمسة تركيب.",
                    en: "Reach the Rollc team to discuss your requirements and receive a proposal worthy of your project. We walk with you from the first consultation to the final installed detail.",
                  })}
                </p>
                <div className={styles.ctaBtns}>
                  <a href="tel:+966552055514" className={styles.btnSolid}>
                    {t(locale, { ar: "اتصل بنا", en: "Call us" })}
                    <span className={styles.arrow}>→</span>
                  </a>
                  <a href={collectionsHref} className={styles.btnGhost}>
                    {t(locale, { ar: "تصفّح المجموعات", en: "Browse collections" })}
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal>
              <div className={styles.ctaCard}>
                <div className={styles.ctaRow}>
                  <span className={styles.ctaRowIcon}>
                    <svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" /></svg>
                  </span>
                  <div>
                    <div className={styles.lbl}>{t(locale, { ar: "الهاتف", en: "Phone" })}</div>
                    <a className={styles.val} href="tel:+966552055514">+966 55 205 5514</a>
                  </div>
                </div>
                <div className={styles.ctaRow}>
                  <span className={styles.ctaRowIcon}>
                    <svg viewBox="0 0 24 24"><path d="M3 6h18v12H3z" /><path d="m3 7 9 6 9-6" /></svg>
                  </span>
                  <div>
                    <div className={styles.lbl}>{t(locale, { ar: "البريد الإلكتروني", en: "Email" })}</div>
                    <a className={styles.val} href="mailto:customerservice@rollcksa.com">customerservice@rollcksa.com</a>
                  </div>
                </div>
                <div className={styles.ctaRow}>
                  <span className={styles.ctaRowIcon}>
                    <svg viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                  </span>
                  <div>
                    <div className={styles.lbl}>{t(locale, { ar: "النطاق", en: "Coverage" })}</div>
                    <span className={styles.val} style={{ direction: ar ? "rtl" : "ltr" }}>
                      {t(locale, { ar: "[ خدمة تغطي مختلف مدن المملكة ]", en: "[ Serving cities across the Kingdom ]" })}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ----------------------------------------------------------------
   Partner / client logo wall — seamless auto-scroll marquee.
   Continuous medium-speed scroll on mobile + desktop, seamless loop,
   pause on hover/touch, arrow controls (desktop) + native swipe
   (mobile), and manual-only when prefers-reduced-motion is set.
   The scroller is forced LTR so scroll math is identical in both
   locales (the logo wall itself is direction-neutral).
   ---------------------------------------------------------------- */
function LogoMarquee({ locale }: { locale: Locale }) {
  const logos = Array.from({ length: 8 }, (_, i) => ({
    src: `/rollc/about/partners/partner-${String(i + 1).padStart(2, "0")}.png`,
    alt: `Partner ${i + 1}`,
  }));

  const loop = [...logos, ...logos];

  return (
    <div className={styles.logoWall} aria-label={locale === "ar" ? "شعارات الشركاء" : "Partner logos"}>
      <div className={styles.logoScroller} dir="ltr">
        <div className={styles.logoTrack}>
          {loop.map((logo, i) => (
            <div key={`${logo.src}-${i}`} className={styles.logoCell} aria-hidden={i >= logos.length ? true : undefined}>
              <img className={styles.logoImg} src={logo.src} alt={logo.alt} loading="lazy" draggable={false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

