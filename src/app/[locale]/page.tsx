import { notFound } from "next/navigation";
import { RollcHomePage } from "@/components/rollc/RollcHomePage";

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale === "en") {
    return <RollcHomePage locale="en" />;
  }

  notFound();
}
