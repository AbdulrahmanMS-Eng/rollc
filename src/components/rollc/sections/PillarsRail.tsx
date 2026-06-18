"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/data/rollc/content";
import { useMobileRail } from "@/components/rollc/ui/useMobileRail";

type Pillar = {
  arTitle: string;
  enTitle: string;
  arText: string;
  enText: string;
  icon: ReactNode;
};

const pillars: Pillar[] = [
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

function PillarCard({ pillar, locale }: { pillar: Pillar; locale: Locale }) {
  return (
    <div className="pillar">
      <span className="pi" aria-hidden="true">
        {pillar.icon}
      </span>
      <h3>{locale === "ar" ? pillar.arTitle : pillar.enTitle}</h3>
      <p>{locale === "ar" ? pillar.arText : pillar.enText}</p>
    </div>
  );
}

export function PillarsRail({ locale }: { locale: Locale }) {
  // Continuous marquee on mobile; on desktop the element stays a CSS grid.
  const { ref, active } = useMobileRail({ mode: "marquee", speed: 0.85 });

  return (
    <div ref={ref} className="pillars m-rail m-rail--marquee">
      {pillars.map((pillar) => (
        <PillarCard key={pillar.enTitle} pillar={pillar} locale={locale} />
      ))}
      {/* Duplicate set only exists while the marquee is running on mobile, so
          the desktop / reduced-motion DOM is identical to the original. */}
      {active &&
        pillars.map((pillar) => (
          <div className="pillar" key={`clone-${pillar.enTitle}`} aria-hidden="true" inert>
            <span className="pi" aria-hidden="true">
              {pillar.icon}
            </span>
            <h3>{locale === "ar" ? pillar.arTitle : pillar.enTitle}</h3>
            <p>{locale === "ar" ? pillar.arText : pillar.enText}</p>
          </div>
        ))}
    </div>
  );
}
