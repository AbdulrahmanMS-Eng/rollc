import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPage } from "@/components/rollc/category/CategoryPage";
import { categoryKinds, getCategoryMeta, isCategoryKind } from "@/components/rollc/category/categoryPageData";

type PageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return categoryKinds.map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;

  if (!isCategoryKind(category)) {
    return { title: "صنف غير موجود | رولك" };
  }

  const meta = getCategoryMeta(category);
  return {
    title: `${meta.title.ar} | رولك`,
    description: meta.description.ar,
    openGraph: {
      title: `${meta.title.ar} | رولك`,
      description: meta.description.ar,
      images: [{ url: meta.hero }],
      type: "website",
    },
  };
}

export default async function ArabicCategoryPage({ params }: PageProps) {
  const { category } = await params;

  if (!isCategoryKind(category)) notFound();

  return <CategoryPage locale="ar" kind={category} />;
}
