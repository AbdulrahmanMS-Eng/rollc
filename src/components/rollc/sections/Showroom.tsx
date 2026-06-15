"use client";

import { useState } from "react";
import type { Locale } from "@/data/rollc/content";
import { Reveal } from "@/components/rollc/ui/Reveal";

export function Showroom({ locale }: { locale: Locale }) {
  const [night, setNight] = useState(false);

  return (
    <section className={`section showroom${night ? " night" : ""}`} id="showroom">
      <div className="wrap">
        <Reveal className="show-head">
          <div>
            <span className="eyebrow">{locale === "ar" ? "تجربة المعرض" : "Showroom experience"}</span>
            <h2 className="h-display">
              {locale === "ar" ? "شاهد غرفتك تتحوّل من النهار إلى الليل" : "Watch your room shift from day to night"}
            </h2>
            <p>
              {locale === "ar"
                ? "بدّل بين الوضع النهاري والليلي لترى كيف تُضيء قطع رولك المكان وتمنحه دفئاً سينمائياً."
                : "Toggle between day and night to see how Rollc pieces light up a space with cinematic warmth."}
            </p>
          </div>

          <div className="mode-toggle">
            <span className={`ml${!night ? " on" : ""}`}>{locale === "ar" ? "الوضع النهاري" : "Day mode"}</span>
            <button
              className="switch"
              onClick={() => setNight((value) => !value)}
              aria-label={locale === "ar" ? "تبديل الوضع النهاري والليلي" : "Toggle day and night mode"}
            >
              <span className="knob" />
            </button>
            <span className={`ml${night ? " on" : ""}`}>{locale === "ar" ? "الوضع الليلي" : "Night mode"}</span>
          </div>
        </Reveal>

        <Reveal className="room">
          <img
            className="room-photo"
            src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1800&q=80"
            alt={locale === "ar" ? "معرض رولك" : "Rollc showroom"}
          />
          <div className="grade-day" />
          <div className="grade-night" />
          <div className="glow center" />
          <div className="glow lamp-l" />
          <div className="glow lamp-r" />
          <div className="glow floor" />
          <span className="bulb b1" />
          <span className="bulb b2" />

          <div className="room-caption">
            <div>
              <p className="rc-name">
                {locale === "ar" ? "جلسة المساء — مجموعة الفخامة" : "Evening lounge — The Opulence Collection"}
              </p>
              <p className="rc-sub">
                {locale === "ar"
                  ? "أريكة، طاولة جانبية، وإضاءة دافئة تُكمل المشهد."
                  : "A sofa, a side table, and warm light that completes the scene."}
              </p>
            </div>
            <span className="rc-tag">
              {night
                ? locale === "ar"
                  ? "الإضاءة مُشعّة"
                  : "Lights on"
                : locale === "ar"
                  ? "الإضاءة مطفأة"
                  : "Lights off"}
            </span>
          </div>
        </Reveal>

        <p className="show-note">
          {locale === "ar"
            ? "اضغط على المفتاح لإطفاء النهار وإشعال مصابيح الغرفة ✦"
            : "Flip the switch to dim the day and light the room ✦"}
        </p>
      </div>
    </section>
  );
}
