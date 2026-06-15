import type { Locale } from "@/lib/i18n";

type Localized = Record<Locale, string>;

export interface Branch {
  city: Localized;
  addr: Localized;
  hours: string;
}

export const branches: Branch[] = [
  {
    city: { ar: "الرياض", en: "Riyadh" },
    addr: { ar: "طريق الملك فهد، حي العليا", en: "King Fahd Rd, Al Olaya District" },
    hours: "10:00 — 23:00",
  },
  {
    city: { ar: "جدة", en: "Jeddah" },
    addr: { ar: "طريق الأمير سلطان، الزهراء", en: "Prince Sultan Rd, Al Zahraa" },
    hours: "10:00 — 23:00",
  },
  {
    city: { ar: "الدمام", en: "Dammam" },
    addr: { ar: "طريق الملك سعود، الشاطئ", en: "King Saud Rd, Al Shati" },
    hours: "10:00 — 23:00",
  },
  {
    city: { ar: "الخبر", en: "Khobar" },
    addr: { ar: "كورنيش الخبر، العقربية", en: "Khobar Corniche, Al Aqrabiyah" },
    hours: "10:00 — 23:00",
  },
];

export const heroImage =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=80";

export const heroCardImage =
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80";

export const signatureImage =
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80";

export const roomImage =
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1800&q=80";

export const socials = ["IG", "X", "PIN", "TT"];
export const payments = "Mada · Visa · Apple Pay · Tamara";

export type NavKey = "home" | "living" | "bedroom" | "tables" | "decor" | "offers" | "showrooms";

export const navItems: { key: NavKey; href: string }[] = [
  { key: "home", href: "#" },
  { key: "living", href: "#categories" },
  { key: "bedroom", href: "#categories" },
  { key: "tables", href: "#products" },
  { key: "decor", href: "#collections" },
  { key: "offers", href: "#products" },
  { key: "showrooms", href: "#branches" },
];
