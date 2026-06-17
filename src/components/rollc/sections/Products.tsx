"use client";

import { products, currency, type Locale, type Product } from "@/data/rollc/content";
import { Reveal } from "@/components/rollc/ui/Reveal";
import { useRollcStore } from "@/components/rollc/ui/RollcStore";

function ProductCard({ product }: { product: Product }) {
  const { locale, addToCart, openQuickView } = useRollcStore();

  return (
    <article
      className="card"
      data-qv-card="home-product"
      role="button"
      tabIndex={0}
      aria-label={locale === "ar" ? `افتح معاينة ${product.name.ar}` : `Open preview for ${product.name.en}`}
      onClick={(event) => {
        if ((event.target as Element).closest("button,a,input,textarea,select,label")) return;
        openQuickView(product);
      }}
      onKeyDown={(event) => {
        if ((event.target as Element).closest("button,a,input,textarea,select,label")) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openQuickView(product);
        }
      }}
    >
      <div className="card-media">
        {product.tag[locale] ? <span className="card-tag">{product.tag[locale]}</span> : null}
<img src={product.img} alt={product.name[locale]} loading="lazy" />
      </div>
      <div className="card-body">
        <span className="card-cat">{product.cat[locale]}</span>
        <h3 className="card-name">{product.name[locale]}</h3>
        <p className="card-desc">{product.desc[locale]}</p>
        <div className="card-foot">
          <span className="price"><b>{product.price}</b> <span className="cur">{currency(locale)}</span>{product.old ? <span className="old">{product.old}</span> : null}</span>
          <button type="button" className="add-cart" onClick={(event) => { event.stopPropagation(); addToCart(product); }} aria-label={locale === "ar" ? "أضف إلى السلة" : "Add to cart"}>
            <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
          </button>
        </div>
      </div>
    </article>
  );
}

export function Products({ locale }: { locale: Locale }) {
  return (
    <section className="section products" id="products">
      <div className="wrap">
        <Reveal className="sec-head">
          <div>
            <span className="eyebrow">{locale === "ar" ? "قِطعٌ مختارة" : "Curated pieces"}</span>
            <h2 className="h-display">{locale === "ar" ? "الأكثر طلباً هذا الموسم" : "Most wanted this season"}</h2>
          </div>
          <a href="#" className="sec-link"><span>{locale === "ar" ? "عرض المتجر كاملاً" : "View full store"}</span><span className="arrow">→</span></a>
        </Reveal>
        <Reveal className="prod-grid">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </Reveal>
      </div>
    </section>
  );
}
