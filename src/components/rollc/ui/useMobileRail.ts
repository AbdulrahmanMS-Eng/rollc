"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "marquee" | "advance";

type Options = {
  /** "marquee": continuous slow loop. "advance": gentle card-by-card auto-step. */
  mode?: Mode;
  /** marquee speed in px per ~60fps frame */
  speed?: number;
  /** advance interval in ms */
  intervalMs?: number;
  /** ms the auto motion stays paused after a user interaction */
  resumeDelay?: number;
};

/**
 * Drives a horizontal mobile-only rail.
 *
 * Activation is gated on `(max-width: 620px)` AND motion being allowed, so the
 * element renders as its original desktop grid untouched at >=621px. The hook
 * never mutates layout — it only reads/writes scrollLeft on the ref element,
 * which is inert while the element is a grid (no horizontal overflow there).
 *
 * RTL aware: scroll direction sign is derived from computed `direction`, and
 * `prefers-reduced-motion` disables auto motion while keeping manual swipe.
 */
export function useMobileRail({
  mode = "marquee",
  speed = 0.32,
  intervalMs = 4200,
  resumeDelay = 2600,
}: Options = {}) {
  const ref = useRef<HTMLDivElement | null>(null);
  // `active` => mobile viewport AND motion allowed (auto-scroll on).
  // `mobile` => mobile viewport (rail layout on, regardless of motion).
  const [mobile, setMobile] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 620px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setMobile(mqMobile.matches);
      setActive(mqMobile.matches && !mqReduce.matches);
    };
    sync();
    mqMobile.addEventListener("change", sync);
    mqReduce.addEventListener("change", sync);
    return () => {
      mqMobile.removeEventListener("change", sync);
      mqReduce.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!active) {
      // Leaving mobile/auto: park the rail at the start so a resize to desktop
      // never shows a scrolled grid.
      el.scrollLeft = 0;
      return;
    }

    const sign = getComputedStyle(el).direction === "rtl" ? -1 : 1;
    let pausedUntil = 0;
    let resync = false;
    const pause = () => {
      pausedUntil = performance.now() + resumeDelay;
      // After a manual swipe the DOM scrollLeft is the source of truth; pick it
      // back up when auto motion resumes so we continue from where the user left.
      resync = true;
    };

    el.addEventListener("pointerdown", pause);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("wheel", pause, { passive: true });

    let raf = 0;
    let timer: ReturnType<typeof setInterval> | undefined;

    if (mode === "marquee") {
      let last = performance.now();
      // scrollLeft's getter rounds to an integer, so sub-pixel increments would
      // be lost. We accumulate the position in a float and only ever write it.
      let pos = el.scrollLeft;
      const tick = (now: number) => {
        const dt = Math.min(now - last, 50);
        last = now;
        if (now >= pausedUntil) {
          if (resync) {
            pos = el.scrollLeft;
            resync = false;
          }
          // One duplicated set lives after the originals, so half the
          // scrollWidth is one set. Wrapping by exactly one set width is a
          // pixel-identical jump → seamless loop.
          const setWidth = el.scrollWidth / 2;
          pos += sign * speed * (dt / 16.67);
          if (sign === 1 && pos >= setWidth) pos -= setWidth;
          if (sign === -1 && pos <= -setWidth) pos += setWidth;
          el.scrollLeft = pos;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    } else {
      timer = setInterval(() => {
        if (performance.now() < pausedUntil) return;
        const card = el.firstElementChild as HTMLElement | null;
        if (!card) return;
        const styles = getComputedStyle(el);
        const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
        const stepW = card.getBoundingClientRect().width + gap;
        const maxScroll = el.scrollWidth - el.clientWidth;
        const atEnd = Math.abs(el.scrollLeft) + stepW > maxScroll - 4;
        if (atEnd) {
          el.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          el.scrollBy({ left: sign * stepW, behavior: "smooth" });
        }
      }, intervalMs);
    }

    return () => {
      cancelAnimationFrame(raf);
      if (timer) clearInterval(timer);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("wheel", pause);
    };
  }, [active, mode, speed, intervalMs, resumeDelay]);

  return { ref, mobile, active };
}
