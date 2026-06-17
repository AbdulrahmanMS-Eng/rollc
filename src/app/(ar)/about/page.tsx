import type { Metadata } from "next";
import { AboutPage } from "@/components/rollc/about/AboutPage";

export function generateMetadata(): Metadata {
  const title = "من نحن | رولك للأثاث الفاخر";
  const description =
    "رولك — علامة سعودية للأثاث الفاخر والتجهيز المتكامل منذ عام ٢٠٠٠. ستةٌ وعشرون عاماً من الإتقان الحرفي والخامات الأصيلة والتصميم الخليجي المعاصر.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80" }],
      type: "website",
      locale: "ar_SA",
    },
  };
}

export default function ArabicAboutPage() {
  return <AboutPage locale="ar" />;
}
