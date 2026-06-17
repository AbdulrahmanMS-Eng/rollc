import type { Metadata } from "next";
import { AboutPage } from "@/components/rollc/about/AboutPage";

export function generateMetadata(): Metadata {
  const title = "About | Rollc Luxury Furniture";
  const description =
    "Rollc — a Saudi house of luxury furniture and turnkey fit-out since 2000. Twenty-six years of craftsmanship, authentic materials, and contemporary Gulf design.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80" }],
      type: "website",
      locale: "en_US",
    },
  };
}

export default function EnglishAboutPage() {
  return <AboutPage locale="en" />;
}
