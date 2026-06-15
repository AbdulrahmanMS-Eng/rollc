import type { Locale } from "@/data/rollc/content";

export function TopBar({ locale }: { locale: Locale }) {
  return (
    <div className="topbar">
      {locale === "ar" ? (
        <span className="topbar-line">
          <span className="topbar-main">توصيل وتركيب احترافي لكل أنحاء المملكة</span>
          <span className="topbar-sep"> — </span>
          <span className="topbar-highlight">استشارة تصميم مجانية</span>
        </span>
      ) : (
        <span className="topbar-line">
          <span className="topbar-main">Professional delivery and installation across Saudi Arabia</span>
          <span className="topbar-sep"> — </span>
          <span className="topbar-highlight">Free design consultation</span>
        </span>
      )}
    </div>
  );
}
