import type { Locale } from "@/data/rollc/content";

/**
 * Rollc logo — V5
 * Closer to the original identity:
 * - elegant upper sweep
 * - slightly lighter left body
 * - centered refined star
 * - ultra-thin right tail
 * - Rollc / رولك only
 * - no subtitle, no right spiral
 */

type Tone = "duo" | "espresso" | "gold" | "paper";

const TONES: Record<Tone, { main: string; accent: string; soft: string }> = {
  duo: {
    main: "var(--espresso)",
    accent: "var(--gold)",
    soft: "rgba(191, 143, 75, 0.34)",
  },
  espresso: {
    main: "var(--espresso)",
    accent: "var(--espresso)",
    soft: "rgba(42, 33, 26, 0.26)",
  },
  gold: {
    main: "var(--gold)",
    accent: "var(--gold)",
    soft: "rgba(191, 143, 75, 0.26)",
  },
  paper: {
    main: "var(--paper)",
    accent: "var(--gold-soft)",
    soft: "rgba(246, 241, 232, 0.42)",
  },
};

function starPath(cx: number, cy: number, outer: number[], inner: number, rotDeg = -90) {
  const n = outer.length;
  const step = Math.PI / n;
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

const STAR = starPath(146, 27, [16, 5, 11, 5, 16, 5, 11, 5], 2.1);

export function Logo({
  locale,
  tone = "duo",
  className,
}: {
  locale: Locale;
  tone?: Tone;
  className?: string;
}) {
  const { main, accent, soft } = TONES[tone];

  return (
    <svg
      className={className}
      viewBox="0 0 320 118"
      role="img"
      aria-label="Rollc رولك"
      fill="none"
      shapeRendering="geometricPrecision"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Upper symbol: smoother, lighter, closer to the original */}
      <path
        d="
          M24 58
          C50 41 78 31 106 27
          C124 25 138 24 146 25
          C170 24 203 24 294 35
          C217 30 179 30 146 31
          C126 32 111 34 96 38
          C71 43 48 51 24 66
          Z
        "
        fill={accent}
      />

      {/* Top highlight */}
      <path
        d="M30 58 C56 40 84 31 111 28 C128 27 140 26 146 27 C169 26 201 26 286 35"
        stroke={soft}
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      {/* Lower contour for crispness */}
      <path
        d="M34 61 C59 49 82 42 102 39 C118 36 132 35 146 35 C165 35 186 35 208 36"
        stroke={soft}
        strokeWidth="0.95"
        strokeLinecap="round"
        opacity="0.48"
      />

      {/* Refined center star */}
      <path d={STAR} fill={accent} />
      <circle cx="146" cy="27" r="2.1" fill="var(--paper)" opacity="0.82" />

      {/* Compact bilingual wordmark */}
      <text
        x="160"
        y="100"
        textAnchor="middle"
        dominantBaseline="alphabetic"
        style={{ direction: "ltr" }}
      >
        <tspan
          fill={main}
          style={{
            fontFamily:
              'var(--ff-en-serif), "Cormorant Garamond", Georgia, "Times New Roman", serif',
            fontWeight: 700,
            fontSize: 41,
            letterSpacing: "-0.018em",
          }}
        >
          Roll
        </tspan>
        <tspan
          fill={accent}
          style={{
            fontFamily:
              'var(--ff-en-serif), "Cormorant Garamond", Georgia, "Times New Roman", serif',
            fontWeight: 700,
            fontSize: 41,
            letterSpacing: "-0.018em",
          }}
        >
          c
        </tspan>
        <tspan
          dx="7"
          fill={main}
          style={{
            fontFamily: 'var(--ff-ar-display), "El Messiri", "Amiri", serif',
            fontWeight: 700,
            fontSize: locale === "ar" ? 35 : 34,
            letterSpacing: "-0.01em",
            unicodeBidi: "isolate",
          }}
        >
          رولك
        </tspan>
      </text>
    </svg>
  );
}
