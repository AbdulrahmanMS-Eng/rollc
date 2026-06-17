import { Footer } from "@/components/rollc/layout/Footer";
import { Header } from "@/components/rollc/layout/Header";
import { TopBar } from "@/components/rollc/layout/TopBar";
import { ProductDetailTemplate } from "@/components/rollc/product/ProductDetailTemplate";
import { QuickViewModal } from "@/components/rollc/ui/QuickViewModal";
import { RollcProvider } from "@/components/rollc/ui/RollcStore";
import { SearchPanel } from "@/components/rollc/ui/SearchPanel";
import { Toast } from "@/components/rollc/ui/Toast";
import { ShoppingAssistant } from "@/components/rollc/assistant/Assistant";
import { CartDrawer } from "@/components/rollc/ui/CartDrawer";
import type { Locale, Product } from "@/data/rollc/content";

export function ProductPage({ locale, product }: { locale: Locale; product: Product }) {
  return (
    <div className="scroll-shell">
      <div className={locale === "en" ? "rollc-page rollc-page-en" : "rollc-page rollc-page-ar"}>
        <RollcProvider locale={locale}>
          <main
            className={locale === "en" ? "rollc-real-page product-page lang-en" : "rollc-real-page product-page"}
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            <TopBar locale={locale} />
            <Header locale={locale} />
            <ProductDetailTemplate locale={locale} product={product} />
            <Footer locale={locale} />
            <SearchPanel />
            <QuickViewModal />
            <Toast />
            <ShoppingAssistant page="product" product={product} />
            <CartDrawer />
          </main>
        </RollcProvider>
      </div>
    </div>
  );
}
