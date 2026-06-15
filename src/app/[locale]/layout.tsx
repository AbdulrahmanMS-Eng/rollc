import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isLocale } from "@/lib/i18n";
import { StoreProvider } from "@/components/ui/StoreProvider";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr
      ? "رولك Rollc — أثاث فاخر يصنع حضور المكان"
      : "Rollc — Fine furniture that commands the room",
    description: isAr
      ? "قطعٌ مختارة بعناية وغرفٌ منسّقة، مع توصيل وتركيب احترافي في جميع أنحاء المملكة."
      : "Carefully curated furniture and styled rooms, with professional delivery and installation across the Kingdom.",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  return <StoreProvider><div className="scroll-shell"><div className="rollc-page">{children}</div></div></StoreProvider>;
}
