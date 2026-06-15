import type { Locale } from "@/data/rollc/content";

export function TopBar({ locale }: { locale: Locale }) {
  return (
    <div className="topbar">
      <span>
        {locale === "ar"
          ? "توصيل وتركيب احترافي لكل أنحاء المملكة — "
          : "Professional delivery & installation across the Kingdom — "}
        <b>{locale === "ar" ? "استشارة تصميم مجانية" : "Free design consultation"}</b>
      </span>
    </div>
  );
}
