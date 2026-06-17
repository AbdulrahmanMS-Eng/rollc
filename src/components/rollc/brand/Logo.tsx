import type { Locale } from "@/data/rollc/content";

/**
 * Rollc brand mark — crisp inline SVG (no PNG, transparent background).
 *
 * Composition (all vector, sharp points, no blur):
 *  - a wide tapering "shooting-star" arc spanning the top
 *  - a radiant 8-point compass/north-star sitting on the arc, slightly
 *    right of centre, with long primary points + short secondary points
 *  - a small sparkle to the upper-right of the star
 *  - the bilingual wordmark below: "Rollc" (Cormorant) + "رولك" (El Messiri)
 *
 * `tone` swaps the two-colour pairing so the mark reads on light (header)
 * and dark (footer) surfaces. `locale` decides which script is prominent.
 */

type Tone = "duo" | "espresso" | "gold" | "paper";

const TONES: Record<Tone, { main: string; accent: string }> = {
  // brand espresso + gold pairing — the default used elsewhere
  duo: { main: "var(--espresso)", accent: "var(--gold)" },
  espresso: { main: "var(--espresso)", accent: "var(--espresso)" },
  gold: { main: "var(--gold)", accent: "var(--gold)" },
  // for dark surfaces (footer): warm paper + soft gold
  paper: { main: "var(--paper)", accent: "var(--gold-soft)" },
};

export function Logo({
  locale,
  tone = "duo",
  className,
}: {
  locale: Locale;
  tone?: Tone;
  className?: string;
}) {
  const { main, accent } = TONES[tone];
  const enProminent = locale === "en";

  return (
    <svg
      className={className}
      viewBox="0 0 322 132"
      role="img"
      aria-label="Rollc رولك"
      fill="none"
      shapeRendering="geometricPrecision"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* shooting-star arc — single tapered crescent, points at both ends */}
      <path
        d="M22 92 C70 42 130 30 185 31 C235 32 278 48 300 70 C278 56 232 45 182 46 C128 47 78 58 22 92 Z"
        fill={accent}
      />

      {/* radiant 8-point compass star (long N/E/W points, longest S point) */}
      <path
        d="M213 52 L191.0 49.5 L193.5 43.5 L187.5 46.0 L185 24 L182.5 46.0 L176.5 43.5 L179.0 49.5 L157 52 L179.0 54.5 L176.5 60.5 L182.5 58.0 L185 96 L187.5 58.0 L193.5 60.5 L191.0 54.5 Z"
        fill={accent}
      />

      {/* small sparkle, upper-right of the star */}
      <path
        d="M216 24 L217 29 L222 30 L217 31 L216 36 L215 31 L210 30 L215 29 Z"
        fill={accent}
      />

      {/* wordmark — Latin */}
      <text
        x="108"
        y="118"
        textAnchor="middle"
        fill={enProminent ? main : accent}
        style={{
          fontFamily: 'var(--ff-en-serif),"Cormorant Garamond",serif',
          fontWeight: 600,
          fontSize: enProminent ? 46 : 30,
          letterSpacing: "0.01em",
        }}
      >
        Rollc
      </text>

      {/* wordmark — Arabic */}
      <text
        x="250"
        y="118"
        textAnchor="middle"
        fill={enProminent ? accent : main}
        style={{
          fontFamily: 'var(--ff-ar-display),"El Messiri",serif',
          fontWeight: 600,
          fontSize: enProminent ? 30 : 46,
          letterSpacing: "0.04em",
        }}
      >
        رولك
      </text>
    </svg>
  );
}
