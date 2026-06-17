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
    <img
      src="/logo/1.svg?v=20260617-202108"
      alt="Rollc رولك"
      className={className}
      draggable={false}
      decoding="async"
      loading="eager"
      fetchPriority="high"
      style={{
        display: "block",
        width: "clamp(112px, 12vw, 150px)",
        height: "auto",
        maxWidth: "none",
        objectFit: "contain",
        transform: "scale(1.45)",
        transformOrigin: "center",
      }}
    />
  );
}
