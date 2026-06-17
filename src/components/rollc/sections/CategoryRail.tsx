"use client";

import { categories, type Locale } from "@/data/rollc/content";
import { useMobileRail } from "@/components/rollc/ui/useMobileRail";

export function CategoryRail({ locale }: { locale: Locale }) {
  // Manual swipe is primary on mobile; a gentle card-by-card auto-advance is
  // secondary and pauses on touch. On desktop the element stays a CSS grid.
  const { ref } = useMobileRail({ mode: "advance", intervalMs: 4600 });

  return (
    <div ref={ref} className="cat-grid m-rail m-rail--advance">
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
    </div>
  );
}
