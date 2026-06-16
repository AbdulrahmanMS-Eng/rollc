"use client";

import { products, currency, type Locale, type Product } from "@/data/rollc/content";
import { Reveal } from "@/components/rollc/ui/Reveal";
import { useRollcStore } from "@/components/rollc/ui/RollcStore";

function ProductCard({ product }: { product: Product }) {
  const { locale, addToCart, openQuickView, showToast } = useRollcStore();

  return (
    <article className="card">
      <div className="card-media">
        {product.tag[locale] ? <span className="card-tag">{product.tag[locale]}</span> : null}
        <button className="card-fav" onClick={() => showToast(locale === "ar" ? "أُضيف إلى المفضلة" : "Added to wishlist")} aria-label={locale === "ar" ? "إضافة للمفضلة" : "Add to wishlist"}>
          <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.5-7-9.5A3.8 3.8 0 0 1 12 7a3.8 3.8 0 0 1 7 3.5C19 15.5 12 20 12 20Z" /></svg>
        </button>
        <img src={product.img} alt={product.name[locale]} loading="lazy" />
        <button className="quick" onClick={() => openQuickView(product)}>{locale === "ar" ? "عرض سريع" : "Quick view"}</button>
      </div>
      <div className="card-body">
        <span className="card-cat">{product.cat[locale]}</span>
        <h3 className="card-name">{product.name[locale]}</h3>
        <p className="card-desc">{product.desc[locale]}</p>
        <div className="card-foot">
          <span className="price"><b>{product.price}</b> <span className="cur">{currency(locale)}</span>{product.old ? <span className="old">{product.old}</span> : null}</span>
          <button className="add-cart" onClick={addToCart} aria-label={locale === "ar" ? "أضف إلى السلة" : "Add to cart"}>
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
