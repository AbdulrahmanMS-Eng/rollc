import { notFound } from "next/navigation";

const locales = ["ar", "en"] as const;
type Locale = (typeof locales)[number];

function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  const src = locale === "en" ? "/rollc-pixel-en.html" : "/rollc-pixel-ar.html?v=3";

  return (
    <main className="rollc-pixel-shell">
      <iframe
        className="rollc-pixel-frame"
        title="Rollc"
        src={src}
        loading="eager"
      />
    </main>
  );
}
