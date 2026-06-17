"use client";

import { useRef } from "react";
import { categories, type Locale } from "@/data/rollc/content";
import { useMobileRail } from "@/components/rollc/ui/useMobileRail";

export function CategoryRail({ locale }: { locale: Locale }) {
  const { ref } = useMobileRail({ mode: "advance", intervalMs: 4600 });
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const didDrag = useRef(false);

  return (
    <div
      ref={ref}
      className="cat-grid m-rail m-rail--advance"
      onPointerDown={(e) => {
        pointerStart.current = { x: e.clientX, y: e.clientY };
        didDrag.current = false;
      }}
      onPointerMove={(e) => {
        if (!pointerStart.current) return;
        const dx = Math.abs(e.clientX - pointerStart.current.x);
        const dy = Math.abs(e.clientY - pointerStart.current.y);
        if (dx > 10 || dy > 10) didDrag.current = true;
      }}
    >
      {categories.map((cat) => (
        <a
          href={`${locale === "ar" ? "" : "/en"}/categories/${cat.slug}`}
          className="cat"
          key={cat.num}
          aria-label={cat.title[locale]}
          onClick={(e) => {
            if (didDrag.current) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
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
