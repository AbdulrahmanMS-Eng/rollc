"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/data/rollc/content";
import { Reveal } from "@/components/rollc/ui/Reveal";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => void;
};

const DAY_IMAGE =
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1800&q=80";

const NIGHT_IMAGE = "/showroom/bedroom-night.png";
const NIGHT_NO_LIGHT_IMAGE = "/showroom/nolight.png";
const SHOWROOM_IMAGES = [DAY_IMAGE, NIGHT_NO_LIGHT_IMAGE, NIGHT_IMAGE];

export function Showroom({ locale }: { locale: Locale }) {
  const [night, setNight] = useState(false);
  const [lightsOn, setLightsOn] = useState(false);

  const isAr = locale === "ar";
  const roomImage = night ? (lightsOn ? NIGHT_IMAGE : NIGHT_NO_LIGHT_IMAGE) : DAY_IMAGE;

  useEffect(() => {
    SHOWROOM_IMAGES.forEach((src) => {
      const img = new window.Image();
      img.decoding = "async";
      img.src = src;
    });
  }, []);

  function withTransition(update: () => void) {
    const doc = document as ViewTransitionDocument;

    if (doc.startViewTransition) {
      doc.startViewTransition(update);
      return;
    }

    update();
  }

  function toggleNight() {
    withTransition(() => {
      setNight((prev) => {
        const next = !prev;
        setLightsOn(next);
        return next;
      });
    });
  }

  function toggleLights() {
    withTransition(() => setLightsOn((value) => !value));
  }

  return (
    <section
      className={`section showroom${night ? " night" : " day"}${lightsOn ? " lights-on" : " lights-off"}`}
      id="showroom"
    >
      <div className="wrap">
        <Reveal className="show-head">
          <div className="show-copy">
            <span className="eyebrow">{isAr ? "تجربة المعرض" : "Showroom experience"}</span>
            <h2 className="h-display">
              {isAr ? "شاهد غرفتك تتحوّل من النهار إلى الليل" : "Watch your room shift from day to night"}
            </h2>
            <p>
              {isAr
                ? "بدّل المشهد كما لو كنت داخل المعرض: ضوء نهاري هادئ، ثم مساء دافئ تُبرز فيه الإضاءة تفاصيل الأثاث."
                : "Switch the scene like you are inside the showroom: calm daylight, then a warm evening glow that reveals the furniture details."}
            </p>
          </div>

          <div className="show-controls" aria-label={isAr ? "أدوات تجربة المعرض" : "Showroom controls"}>
            <button
              type="button"
              className="show-mode"
              aria-pressed={night}
              onClick={toggleNight}
            >
              <span className={!night ? "active" : ""}>{isAr ? "نهار" : "Day"}</span>
              <i aria-hidden="true" />
              <span className={night ? "active" : ""}>{isAr ? "ليل" : "Night"}</span>
            </button>

            <button
              type="button"
              className="show-lamp"
              aria-pressed={lightsOn}
              onClick={toggleLights}
            >
              <span className="lamp-icon" aria-hidden="true">
                ✦
              </span>
              <span>{lightsOn ? (isAr ? "الإضاءة مضاءة" : "Lights on") : isAr ? "الإضاءة مطفأة" : "Lights off"}</span>
            </button>
          </div>
        </Reveal>

        <Reveal className="room">
          <div className="room-image-stack" aria-hidden="true">
            <img
              className={`room-photo room-photo-layer${roomImage === DAY_IMAGE ? " active" : ""}`}
              src={DAY_IMAGE}
              alt=""
              draggable={false}
              decoding="async"
              loading="eager"
            />
            <img
              className={`room-photo room-photo-layer${roomImage === NIGHT_NO_LIGHT_IMAGE ? " active" : ""}`}
              src={NIGHT_NO_LIGHT_IMAGE}
              alt=""
              draggable={false}
              decoding="async"
              loading="eager"
            />
            <img
              className={`room-photo room-photo-layer${roomImage === NIGHT_IMAGE ? " active" : ""}`}
              src={NIGHT_IMAGE}
              alt=""
              draggable={false}
              decoding="async"
              loading="eager"
            />
          </div>

          <div className="sun-wash" />
          <div className="night-wash" />
          <div className="window-shade" />
          <div className="cinema-vignette" />

          <span className="real-light lamp-left-light" aria-hidden="true" />
          <span className="real-light lamp-right-light" aria-hidden="true" />

          <span className="light-cone lamp-left-cone" aria-hidden="true" />
          <span className="light-cone lamp-right-cone" aria-hidden="true" />
          <span className="floor-glow" aria-hidden="true" />

          <div className="room-caption">
            <div>
              <p className="rc-name">
                {isAr ? "جلسة المساء — دفء يغيّر المكان" : "Evening scene — warmth that changes the room"}
              </p>
              <p className="rc-sub">
                {isAr
                  ? "اضغط على الأزرار وشاهد كيف تصنع الإضاءة مزاجاً مختلفاً لنفس القطع."
                  : "Use the controls and see how lighting creates a different mood for the same pieces."}
              </p>
            </div>

            <span className="rc-tag">
              {night
                ? lightsOn
                  ? isAr
                    ? "ليل + إضاءة"
                    : "Night + lights"
                  : isAr
                    ? "ليل هادئ"
                    : "Soft night"
                : isAr
                  ? "نهار طبيعي"
                  : "Natural day"}
            </span>
          </div>
        </Reveal>

        <p className="show-note">
          {isAr
            ? "جرّب تبديل النهار والليل، ثم شغّل الإضاءة لترى تأثير رولك داخل المساحة ✦"
            : "Switch between day and night, then turn on the lights to see the Rollc effect ✦"}
        </p>
      </div>
    </section>
  );
}
