import type { Locale } from "@/data/rollc/content";

type Tone = "duo" | "espresso" | "gold" | "paper";

export function Logo({
  className,
}: {
  locale: Locale;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={className}
      aria-label="Rollc رولك"
      role="img"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
      }}
    >
      <img
        src="/logo/1.svg"
        alt="Rollc رولك"
        draggable={false}
        decoding="async"
        loading="eager"
        fetchPriority="high"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transform: "scale(2.8)",
          transformOrigin: "center",
        }}
      />
    </span>
  );
}
