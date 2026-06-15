import { TopBar } from "@/components/rollc/layout/TopBar";
import { Header } from "@/components/rollc/layout/Header";
import { Footer } from "@/components/rollc/layout/Footer";
import { Hero } from "@/components/rollc/sections/Hero";
import { Categories } from "@/components/rollc/sections/Categories";
import { Signature } from "@/components/rollc/sections/Signature";
import { Products } from "@/components/rollc/sections/Products";
import { Showroom } from "@/components/rollc/sections/Showroom";
import { Collections } from "@/components/rollc/sections/Collections";
import { Branches } from "@/components/rollc/sections/Branches";
import { RollcProvider } from "@/components/rollc/ui/RollcStore";
import { SearchPanel } from "@/components/rollc/ui/SearchPanel";
import { QuickViewModal } from "@/components/rollc/ui/QuickViewModal";
import { Toast } from "@/components/rollc/ui/Toast";
import type { Locale } from "@/data/rollc/content";

export function RollcHomePage({ locale }: { locale: Locale }) {
  return (
    <RollcProvider locale={locale}>
      <main
        className={locale === "en" ? "rollc-real-page lang-en" : "rollc-real-page"}
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <TopBar locale={locale} />
        <Header locale={locale} />
        <Hero locale={locale} />
        <Categories locale={locale} />
        <Signature locale={locale} />
        <Products locale={locale} />
        <Showroom locale={locale} />
        <Collections locale={locale} />
        <Branches locale={locale} />
        <Footer locale={locale} />
        <SearchPanel />
        <QuickViewModal />
        <Toast />
      </main>
    </RollcProvider>
  );
}
