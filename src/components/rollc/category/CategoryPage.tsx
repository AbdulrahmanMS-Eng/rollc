import { Footer } from "@/components/rollc/layout/Footer";
import { Header } from "@/components/rollc/layout/Header";
import { TopBar } from "@/components/rollc/layout/TopBar";
import { CategoryListing } from "@/components/rollc/category/CategoryListing";
import { QuickViewModal } from "@/components/rollc/ui/QuickViewModal";
import { RollcProvider } from "@/components/rollc/ui/RollcStore";
import { SearchPanel } from "@/components/rollc/ui/SearchPanel";
import { Toast } from "@/components/rollc/ui/Toast";
import { ShoppingAssistant } from "@/components/rollc/assistant/Assistant";
import { CartDrawer } from "@/components/rollc/ui/CartDrawer";
import type { CategoryKind } from "@/components/rollc/category/categoryPageData";
import type { Locale } from "@/data/rollc/content";

export function CategoryPage({ locale, kind }: { locale: Locale; kind: CategoryKind }) {
  return (
    <div className="scroll-shell">
      <div className={locale === "en" ? "rollc-page rollc-page-en" : "rollc-page rollc-page-ar"}>
        <RollcProvider locale={locale}>
          <main
            className={locale === "en" ? "rollc-real-page category-page lang-en" : "rollc-real-page category-page"}
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            <TopBar locale={locale} />
            <Header locale={locale} />
            <CategoryListing locale={locale} kind={kind} />
            <Footer locale={locale} />
            <SearchPanel />
            <QuickViewModal />
            <Toast />
            <ShoppingAssistant page="category" category={kind} />
            <CartDrawer />
          </main>
        </RollcProvider>
      </div>
    </div>
  );
}
