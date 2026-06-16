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
    return { title: "Category not found | Rollc" };
  }

  const meta = getCategoryMeta(category);
  return {
    title: `${meta.title.en} | Rollc`,
    description: meta.description.en,
    openGraph: {
      title: `${meta.title.en} | Rollc`,
      description: meta.description.en,
      images: [{ url: meta.hero }],
      type: "website",
    },
  };
}

export default async function EnglishCategoryPage({ params }: PageProps) {
  const { category } = await params;

  if (!isCategoryKind(category)) notFound();

  return <CategoryPage locale="en" kind={category} />;
}
