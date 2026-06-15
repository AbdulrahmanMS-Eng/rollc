import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage } from "@/components/rollc/product/ProductPage";
import { products } from "@/data/rollc/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.id === slug);

  if (!product) {
    return {
      title: "Product not found | Rollc",
    };
  }

  return {
    title: `${product.name.en} | Rollc`,
    description: product.desc.en,
    openGraph: {
      title: `${product.name.en} | Rollc`,
      description: product.desc.en,
      images: [{ url: product.img }],
      type: "website",
    },
  };
}

export default async function EnglishProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.id === slug);

  if (!product) notFound();

  return <ProductPage locale="en" product={product} />;
}
