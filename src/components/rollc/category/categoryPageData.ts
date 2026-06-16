import { products, type Locale, type Product } from "@/data/rollc/content";
import { productKind } from "@/components/rollc/product/productPageData";

export type LocalizedText = Record<Locale, string>;
export type CategoryKind = "sofas" | "chairs" | "tables" | "beds" | "decor";

export const categoryKinds: CategoryKind[] = ["sofas", "chairs", "tables", "beds", "decor"];

export function isCategoryKind(value: string): value is CategoryKind {
  return (categoryKinds as string[]).includes(value);
}

/* ---------- Per-category page metadata ---------- */
type CategoryMeta = {
  title: LocalizedText;
  subtitle: string;
  description: LocalizedText;
  parentCrumb: LocalizedText;
  hero: string;
};

const categoryMeta: Record<CategoryKind, CategoryMeta> = {
  sofas: {
    title: { ar: "الأرائك", en: "Sofas" },
    subtitle: "Sofas Collection",
    description: {
      ar: "اختر من مجموعة أرائك رولك الفاخرة المصممة لتمنح غرفة المعيشة حضوراً دافئاً وراحة تدوم.",
      en: "Choose from Rollc's collection of luxury sofas, designed to give your living room a warm presence and lasting comfort.",
    },
    parentCrumb: { ar: "الرئيسية", en: "Home" },
    hero: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1800&q=80",
  },
  chairs: {
    title: { ar: "الكراسي", en: "Chairs" },
    subtitle: "Chairs Collection",
    description: {
      ar: "كراسي تجمع بين الراحة والتصميم، تكمّل أي مساحة بلمسة من الأناقة الهادئة.",
      en: "Chairs that balance comfort and design, completing any space with quiet elegance.",
    },
    parentCrumb: { ar: "الرئيسية", en: "Home" },
    hero: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1800&q=80",
  },
  tables: {
    title: { ar: "الطاولات", en: "Tables" },
    subtitle: "Tables Collection",
    description: {
      ar: "طاولات بخامات أصيلة وخطوط معاصرة، تجمع الأحبة وتزيّن المكان.",
      en: "Tables in authentic materials and contemporary lines, made to gather and to adorn.",
    },
    parentCrumb: { ar: "غرف الطعام", en: "Dining" },
    hero: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1800&q=80",
  },
  beds: {
    title: { ar: "الأسرّة", en: "Beds" },
    subtitle: "Beds Collection",
    description: {
      ar: "أسرّة منجّدة بهدوء وفخامة، لتبدأ راحتك من أول تفصيلة.",
      en: "Upholstered beds with calm and luxury, where your rest begins in the details.",
    },
    parentCrumb: { ar: "غرف النوم", en: "Bedroom" },
    hero: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=80",
  },
  decor: {
    title: { ar: "الديكور", en: "Decor" },
    subtitle: "Decor & Accents",
    description: {
      ar: "لمساتٌ تُكمل المشهد؛ إضاءة وإكسسوارات تضيف دفئاً وشخصية لكل ركن.",
      en: "Finishing touches that complete the scene — lighting and accents that add warmth and character.",
    },
    parentCrumb: { ar: "الديكور", en: "Decor" },
    hero: "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?auto=format&fit=crop&w=1800&q=80",
  },
};

export function getCategoryMeta(kind: CategoryKind): CategoryMeta {
  return categoryMeta[kind];
}

export function listCategoryProducts(kind: CategoryKind): Product[] {
  return products.filter((product) => productKind(product) === kind);
}

/* ---------- Facets ---------- */
type Facets = { color: string; material: string; sizes: string[] };

// Light per-product overrides; everything else falls back to kind defaults.
const facetOverrides: Record<string, Facets> = {
  "milano-sofa": { color: "رملي", material: "مخمل", sizes: ["3 مقاعد"] },
  "roma-sofa": { color: "بني", material: "جلد", sizes: ["زاوية L"] },
  "oslo-sofa": { color: "رمادي", material: "كتان", sizes: ["3 مقاعد"] },
  "serene-sofa": { color: "رملي", material: "مخمل", sizes: ["3 مقاعد"] },
  "copenhagen-sofa": { color: "أخضر زيتي", material: "مخمل", sizes: ["2 مقعد"] },
  "oslo-chair": { color: "رمادي", material: "خشب طبيعي", sizes: ["قطعة واحدة"] },
  "copenhagen-chair": { color: "رملي", material: "كتان", sizes: ["قطعة واحدة"] },
  "nordic-table": { color: "رملي", material: "رخام", sizes: ["قهوة"] },
  "arabesque-dining": { color: "بني", material: "خشب طبيعي", sizes: ["طعام"] },
  "serene-bed": { color: "رملي", material: "مخمل", sizes: ["كنج"] },
  "amber-lamp": { color: "أخضر زيتي", material: "معدن", sizes: ["قياسي"] },
};

const materialByKind: Record<CategoryKind, string> = {
  sofas: "مخمل",
  chairs: "خشب طبيعي",
  tables: "رخام",
  beds: "مخمل",
  decor: "معدن",
};

const defaultSizeByKind: Record<CategoryKind, string> = {
  sofas: "3 مقاعد",
  chairs: "قطعة واحدة",
  tables: "قهوة",
  beds: "كنج",
  decor: "قياسي",
};

export function priceValue(product: Product): number {
  return Number(product.price.replace(/,/g, "")) || 0;
}

export function priceBucket(value: number): string {
  if (value < 2000) return "p1";
  if (value <= 4000) return "p2";
  if (value <= 7000) return "p3";
  return "p4";
}

export type BadgeKind = "best" | "offer" | "new" | "premium" | "";

export function badgeOf(product: Product): BadgeKind {
  const tag = product.tag.en.toLowerCase();
  if (tag.includes("best")) return "best";
  if (tag.includes("premium") || tag.includes("luxe")) return "premium";
  if (tag.includes("offer")) return "offer";
  if (tag.includes("new")) return "new";
  if (product.old) return "offer";
  return "";
}

export const badgeText: Record<Exclude<BadgeKind, "">, LocalizedText> = {
  best: { ar: "الأكثر مبيعاً", en: "Best seller" },
  offer: { ar: "عرض", en: "Offer" },
  new: { ar: "جديد", en: "New" },
  premium: { ar: "فاخر", en: "Premium" },
};

export function facetsOf(product: Product): Facets {
  const override = facetOverrides[product.id];
  if (override) return override;
  const kind = productKind(product) as CategoryKind;
  return { color: "رملي", material: materialByKind[kind], sizes: [defaultSizeByKind[kind]] };
}

export function availabilityOf(product: Product): string[] {
  const list = ["متوفر"];
  const badge = badgeOf(product);
  if (badge === "offer") list.push("عروض");
  if (badge === "new") list.push("جديد");
  return list;
}

/* ---------- Filter groups (localized) ---------- */
export type FilterOption = { id: string; label: LocalizedText; swatch?: string };
export type FilterGroup = { key: FilterKey; title: LocalizedText; options: FilterOption[] };
export type FilterKey = "price" | "color" | "size" | "material" | "availability";

const priceGroup: FilterGroup = {
  key: "price",
  title: { ar: "السعر", en: "Price" },
  options: [
    { id: "p1", label: { ar: "أقل من 2000 ر.س", en: "Under 2000 SAR" } },
    { id: "p2", label: { ar: "2000 - 4000 ر.س", en: "2000 - 4000 SAR" } },
    { id: "p3", label: { ar: "4000 - 7000 ر.س", en: "4000 - 7000 SAR" } },
    { id: "p4", label: { ar: "أكثر من 7000 ر.س", en: "Over 7000 SAR" } },
  ],
};

const colorGroup: FilterGroup = {
  key: "color",
  title: { ar: "اللون", en: "Colour" },
  options: [
    { id: "رملي", label: { ar: "رملي", en: "Sand" }, swatch: "#cdb593" },
    { id: "بني", label: { ar: "بني", en: "Brown" }, swatch: "#5a4330" },
    { id: "رمادي", label: { ar: "رمادي", en: "Grey" }, swatch: "#8c8a84" },
    { id: "أخضر زيتي", label: { ar: "أخضر زيتي", en: "Olive" }, swatch: "#5c6044" },
    { id: "أسود", label: { ar: "أسود", en: "Black" }, swatch: "#211c17" },
  ],
};

const availabilityGroup: FilterGroup = {
  key: "availability",
  title: { ar: "التوفر", en: "Availability" },
  options: [
    { id: "متوفر", label: { ar: "متوفر", en: "Available" } },
    { id: "عروض", label: { ar: "عروض", en: "On offer" } },
    { id: "جديد", label: { ar: "جديد", en: "New" } },
  ],
};

const sizeOptionsByKind: Record<CategoryKind, FilterOption[]> = {
  sofas: [
    { id: "2 مقعد", label: { ar: "2 مقعد", en: "2 Seater" } },
    { id: "3 مقاعد", label: { ar: "3 مقاعد", en: "3 Seater" } },
    { id: "زاوية L", label: { ar: "زاوية L", en: "L-Corner" } },
    { id: "سرير أريكة", label: { ar: "سرير أريكة", en: "Sofa Bed" } },
  ],
  chairs: [
    { id: "قطعة واحدة", label: { ar: "قطعة واحدة", en: "Single" } },
    { id: "زوج", label: { ar: "زوج", en: "Pair" } },
    { id: "لاونج", label: { ar: "لاونج", en: "Lounge" } },
  ],
  tables: [
    { id: "قهوة", label: { ar: "قهوة", en: "Coffee" } },
    { id: "جانبية", label: { ar: "جانبية", en: "Side" } },
    { id: "طعام", label: { ar: "طعام", en: "Dining" } },
  ],
  beds: [
    { id: "كوين", label: { ar: "كوين", en: "Queen" } },
    { id: "كنج", label: { ar: "كنج", en: "King" } },
    { id: "كنج مع تخزين", label: { ar: "كنج مع تخزين", en: "King Storage" } },
  ],
  decor: [
    { id: "قياسي", label: { ar: "قياسي", en: "Standard" } },
    { id: "فاخر", label: { ar: "فاخر", en: "Premium" } },
    { id: "مخصص", label: { ar: "مخصص", en: "Custom" } },
  ],
};

const materialOptionsByKind: Record<CategoryKind, FilterOption[]> = {
  sofas: [
    { id: "مخمل", label: { ar: "مخمل", en: "Velvet" } },
    { id: "جلد", label: { ar: "جلد", en: "Leather" } },
    { id: "كتان", label: { ar: "كتان", en: "Linen" } },
    { id: "خشب طبيعي", label: { ar: "خشب طبيعي", en: "Natural wood" } },
  ],
  chairs: [
    { id: "خشب طبيعي", label: { ar: "خشب طبيعي", en: "Natural wood" } },
    { id: "كتان", label: { ar: "كتان", en: "Linen" } },
    { id: "جلد", label: { ar: "جلد", en: "Leather" } },
  ],
  tables: [
    { id: "رخام", label: { ar: "رخام", en: "Marble" } },
    { id: "خشب طبيعي", label: { ar: "خشب طبيعي", en: "Natural wood" } },
    { id: "زجاج", label: { ar: "زجاج", en: "Glass" } },
  ],
  beds: [
    { id: "مخمل", label: { ar: "مخمل", en: "Velvet" } },
    { id: "كتان", label: { ar: "كتان", en: "Linen" } },
    { id: "خشب طبيعي", label: { ar: "خشب طبيعي", en: "Natural wood" } },
  ],
  decor: [
    { id: "معدن", label: { ar: "معدن", en: "Metal" } },
    { id: "خشب طبيعي", label: { ar: "خشب طبيعي", en: "Natural wood" } },
    { id: "زجاج", label: { ar: "زجاج", en: "Glass" } },
  ],
};

export function getFilterGroups(kind: CategoryKind): FilterGroup[] {
  return [
    priceGroup,
    colorGroup,
    { key: "size", title: { ar: "المقاس", en: "Size" }, options: sizeOptionsByKind[kind] },
    { key: "material", title: { ar: "الخامة", en: "Material" }, options: materialOptionsByKind[kind] },
    availabilityGroup,
  ];
}

/* ---------- Matching + sorting ---------- */
export type ActiveFilters = Record<FilterKey, Set<string>>;

export function emptyFilters(): ActiveFilters {
  return { price: new Set(), color: new Set(), size: new Set(), material: new Set(), availability: new Set() };
}

export function matchesFilters(product: Product, active: ActiveFilters): boolean {
  const facets = facetsOf(product);
  const value = priceValue(product);

  if (active.price.size && !active.price.has(priceBucket(value))) return false;
  if (active.color.size && !active.color.has(facets.color)) return false;
  if (active.size.size && !facets.sizes.some((size) => active.size.has(size))) return false;
  if (active.material.size && !active.material.has(facets.material)) return false;
  if (active.availability.size && !availabilityOf(product).some((a) => active.availability.has(a))) return false;
  return true;
}

export type SortMode = "pop" | "high" | "low" | "new";

export const sortLabels: Record<SortMode, LocalizedText> = {
  pop: { ar: "الأكثر شيوعاً", en: "Most popular" },
  high: { ar: "الأعلى سعراً", en: "Price: high to low" },
  low: { ar: "الأقل سعراً", en: "Price: low to high" },
  new: { ar: "الأحدث", en: "Newest" },
};

export function sortProducts(list: Product[], mode: SortMode): Product[] {
  const copy = [...list];
  if (mode === "high") copy.sort((a, b) => priceValue(b) - priceValue(a));
  else if (mode === "low") copy.sort((a, b) => priceValue(a) - priceValue(b));
  else if (mode === "new") copy.sort((a, b) => (badgeOf(b) === "new" ? 1 : 0) - (badgeOf(a) === "new" ? 1 : 0));
  return copy;
}
