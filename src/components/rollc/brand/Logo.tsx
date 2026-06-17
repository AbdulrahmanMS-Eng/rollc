import type { Locale } from "@/data/rollc/content";

/**
 * Rollc brand mark — crisp inline SVG (no PNG, transparent background).
 *
 * SYMBOL (pure vector, sharp tips, no blur):
 *  - a symmetrical tapering arc (shooting-star trail) peaking dead-centre and
 *    converging to fine points at both ends
 *  - a radiant 8-point north-star sitting on the apex: 4 long primary points
 *    (N/E/S/W) + 4 short diagonal points, with a small sparkle up-right
 *
 * WORDMARK = real text (always crisp): "Rollc" (Cormorant) + "رولك"
 *  (El Messiri) on one shared baseline, centred beneath the star.
 *
 * `tone` swaps the colour pairing so the mark reads on light (header) and dark
 * (footer) surfaces. `locale` decides which script is the larger / main one.
 */

type Tone = "duo" | "espresso" | "gold" | "paper";

const TONES: Record<Tone, { main: string; accent: string }> = {
  // brand espresso + gold pairing — the default used in the ivory header
  duo: { main: "var(--espresso)", accent: "var(--gold)" },
  espresso: { main: "var(--espresso)", accent: "var(--espresso)" },
  gold: { main: "var(--gold)", accent: "var(--gold)" },
  // for dark surfaces (footer): warm paper + soft gold
  paper: { main: "var(--paper)", accent: "var(--gold-soft)" },
};

// Geometry centre + the single value to tweak if the star needs resizing.
const CX = 120;
const STAR_CY = 36;
const STAR_SIZE = 30; // ⬅ length of the long primary points — the one tweak

/** Build a closed star path: alternating outer tips and inner waist vertices. */
function starPath(cx: number, cy: number, outer: number[], inner: number, rotDeg = -90) {
  const n = outer.length;
  const step = Math.PI / n; // half the angle between adjacent tips
  const rot = (rotDeg * Math.PI) / 180;
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const aTip = rot + i * 2 * step;
    pts.push(`${(cx + outer[i] * Math.cos(aTip)).toFixed(2)} ${(cy + outer[i] * Math.sin(aTip)).toFixed(2)}`);
    const aWaist = aTip + step;
    pts.push(`${(cx + inner * Math.cos(aWaist)).toFixed(2)} ${(cy + inner * Math.sin(aWaist)).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
}

const rP = STAR_SIZE; // primary (N/E/S/W) reach
const rD = STAR_SIZE * 0.3; // diagonal points
const rW = STAR_SIZE * 0.18; // inner waist
const STAR = starPath(CX, STAR_CY, [rP, rD, rP, rD, rP, rD, rP, rD], rW);
const SPARKLE = starPath(CX + 28, STAR_CY - 19, Array(4).fill(STAR_SIZE * 0.2), STAR_SIZE * 0.06);

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
      viewBox="0 0 240 132"
      role="img"
      aria-label="Rollc رولك"
      fill="none"
      shapeRendering="geometricPrecision"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* symmetrical tapering arc — fine points at both ends */}
      <path
        d="M24 78 C62 45 92 39 120 39 C148 39 178 45 216 78 C184 51 152 47 120 47 C88 47 56 51 24 78 Z"
        fill={accent}
      />

      {/* radiant 8-point north-star on the apex */}
      <path d={STAR} fill={accent} />

      {/* small sparkle, upper-right of the star */}
      <path d={SPARKLE} fill={accent} />

      {/* bilingual wordmark — real text, one baseline, optically centred */}
      <text
        x={CX}
        y="119"
        textAnchor="middle"
        style={{ direction: "ltr", letterSpacing: 0 }}
      >
        <tspan
          fill={enProminent ? main : accent}
          style={{
            fontFamily: 'var(--ff-en-serif),"Cormorant Garamond",serif',
            fontWeight: 600,
            fontSize: enProminent ? 47 : 31,
            letterSpacing: "0.01em",
          }}
        >
          Rollc
        </tspan>
        <tspan
          dx="13"
          fill={enProminent ? accent : main}
          style={{
            fontFamily: 'var(--ff-ar-display),"El Messiri",serif',
            fontWeight: 600,
            fontSize: enProminent ? 31 : 46,
            unicodeBidi: "isolate",
          }}
        >
          رولك
        </tspan>
      </text>
    </svg>
  );
}
