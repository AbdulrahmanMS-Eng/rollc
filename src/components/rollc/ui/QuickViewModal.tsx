"use client";

import { useEffect, useMemo, useState } from "react";
import { currency, type Locale, type Product } from "@/data/rollc/content";
import { useRollcStore } from "@/components/rollc/ui/RollcStore";

const galleryFallback = (product: Product) => [
  product.img.replace("w=700", "w=1100"),
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1100&q=80",
  "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1100&q=80",
  "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1100&q=80",
];

const colors = [
  { ar: "رملي فاخر", en: "Luxury sand", value: "#cdb593" },
  { ar: "بني عميق", en: "Deep brown", value: "#5a4330" },
  { ar: "رمادي حجري", en: "Stone grey", value: "#8c8a84" },
  { ar: "أخضر زيتي", en: "Olive green", value: "#5c6044" },
];

const sizes = [
  { ar: "2 مقعد", en: "2 seats" },
  { ar: "3 مقاعد", en: "3 seats" },
  { ar: "زاوية L", en: "L sectional" },
];

const specs = [
  { ar: "قماش مخملي", en: "Velvet fabric" },
  { ar: "هيكل خشب طبيعي", en: "Natural wood frame" },
  { ar: "ضمان سنتين", en: "2-year warranty" },
  { ar: "تركيب مجاني", en: "Free installation" },
];

function byLocale(locale: Locale, item: { ar: string; en: string }) {
  return locale === "ar" ? item.ar : item.en;
}

function productDimensions(product: Product, locale: Locale) {
  const dimensions: Record<string, { ar: string; en: string }> = {
    "milano-sofa": {
      ar: "العرض 240 سم × العمق 95 سم × الارتفاع 82 سم",
      en: "W 240 cm × D 95 cm × H 82 cm",
    },
    "oslo-chair": {
      ar: "العرض 78 سم × العمق 82 سم × الارتفاع 86 سم",
      en: "W 78 cm × D 82 cm × H 86 cm",
    },
    "nordic-table": {
      ar: "العرض 120 سم × العمق 65 سم × الارتفاع 42 سم",
      en: "W 120 cm × D 65 cm × H 42 cm",
    },
    "serene-bed": {
      ar: "العرض 200 سم × الطول 220 سم × الارتفاع 110 سم",
      en: "W 200 cm × L 220 cm × H 110 cm",
    },
    "roma-sofa": {
      ar: "العرض 285 سم × العمق 165 سم × الارتفاع 84 سم",
      en: "W 285 cm × D 165 cm × H 84 cm",
    },
    "copenhagen-chair": {
      ar: "العرض 72 سم × العمق 78 سم × الارتفاع 80 سم",
      en: "W 72 cm × D 78 cm × H 80 cm",
    },
    "arabesque-dining": {
      ar: "العرض 220 سم × العمق 100 سم × الارتفاع 76 سم",
      en: "W 220 cm × D 100 cm × H 76 cm",
    },
    "amber-lamp": {
      ar: "العرض 38 سم × العمق 38 سم × الارتفاع 158 سم",
      en: "W 38 cm × D 38 cm × H 158 cm",
    },
  };

  return dimensions[product.id]?.[locale] ?? (
    locale === "ar"
      ? "الأبعاد تختلف حسب التكوين المختار"
      : "Dimensions vary by selected configuration"
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 2 2.9 6.3 6.9.6-5.2 4.6 1.6 6.7L12 17.3 5.8 20.8l1.6-6.7L2.2 8.9l6.9-.6L12 2Z" />
    </svg>
  );
}

function SpecIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 4 6v6c0 4 3.5 7.5 8 9 4.5-1.5 8-5 8-9V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function QuickViewModal() {
  const { locale, selectedProduct, closeQuickView, addToCart, showToast } = useRollcStore();
  const [activeImage, setActiveImage] = useState("");
  const [activeColor, setActiveColor] = useState(0);
  const [activeSize, setActiveSize] = useState(1);
  const [qty, setQty] = useState(1);
  const [saved, setSaved] = useState(false);

  const gallery = useMemo(() => {
    if (!selectedProduct) return [];
    return galleryFallback(selectedProduct);
  }, [selectedProduct]);

  useEffect(() => {
    if (!selectedProduct) return;
    setActiveImage(galleryFallback(selectedProduct)[0]);
    setActiveColor(0);
    setActiveSize(1);
    setQty(1);
    setSaved(false);
  }, [selectedProduct]);

  useEffect(() => {
    if (!selectedProduct) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeQuickView();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [selectedProduct, closeQuickView]);

  if (!selectedProduct) return null;

  const productName = selectedProduct.name[locale];
  const otherName = locale === "ar" ? selectedProduct.name.en : selectedProduct.name.ar;
  const deliveryText = locale === "ar" ? "توصيل وتركيب احترافي داخل المملكة" : "Professional delivery and installation across Saudi Arabia";
  const stockText = locale === "ar" ? "متوفر للطلب — يصل خلال 5 إلى 10 أيام" : "Available to order — arrives in 5 to 10 days";

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i += 1) addToCart();
    showToast(locale === "ar" ? `تمت إضافة ${selectedProduct.name.ar} إلى السلة` : `${selectedProduct.name.en} added to cart`);
  };

  return (
    <>
      <div className="qv-overlay open" onClick={closeQuickView} />

      <div
        className="qv-modal open"
        role="dialog"
        aria-modal="true"
        aria-label={locale === "ar" ? `عرض سريع — ${selectedProduct.name.ar}` : `Quick view — ${selectedProduct.name.en}`}
      >
        <div className="qv-box">
          <button className="qv-close" onClick={closeQuickView} aria-label={locale === "ar" ? "إغلاق" : "Close"}>
            <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>

          <div className="qv-gallery">
            <div className="qv-main">
              {selectedProduct.tag[locale] ? <span className="qv-badge">{selectedProduct.tag[locale]}</span> : null}

              <button
                className={`qv-heart${saved ? " active" : ""}`}
                onClick={() => {
                  setSaved((v) => !v);
                  showToast(saved ? (locale === "ar" ? "أُزيلت من المفضلة" : "Removed from wishlist") : (locale === "ar" ? "أُضيفت إلى المفضلة" : "Added to wishlist"));
                }}
                aria-label={locale === "ar" ? "المفضلة" : "Wishlist"}
              >
                <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.5-7-9.5A3.8 3.8 0 0 1 12 7a3.8 3.8 0 0 1 7 3.5C19 15.5 12 20 12 20Z" /></svg>
              </button>

              <span className="qv-zoom">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3M11 8v6M8 11h6" /></svg>
                {locale === "ar" ? "تكبير" : "Zoom"}
              </span>

              <img src={activeImage || selectedProduct.img} alt={productName} />
            </div>

            <div className="qv-thumbs">
              {gallery.map((src, index) => (
                <button
                  key={`${selectedProduct.id}-${index}`}
                  className={`qv-thumb${src === activeImage ? " active" : ""}`}
                  onClick={() => setActiveImage(src)}
                  aria-label={locale === "ar" ? `صورة ${index + 1}` : `Image ${index + 1}`}
                >
                  <img src={src.replace("w=1100", "w=300").replace("w=700", "w=300")} alt="" />
                </button>
              ))}
            </div>
          </div>

          <div className="qv-info">
            <span className="qv-cat">{selectedProduct.cat[locale]}</span>
            <h2 className="qv-title">{productName}</h2>
            <span className="qv-alt">{otherName}</span>

            <div className="qv-rating">
              <span className="qv-stars">{Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} />)}</span>
              <span>{locale === "ar" ? "4.9 · 128 تقييماً" : "4.9 · 128 reviews"}</span>
            </div>

            <div className="qv-price">
              <span className="qv-now">{selectedProduct.price}<span>{currency(locale)}</span></span>
              {selectedProduct.old ? <span className="qv-old">{selectedProduct.old} {currency(locale)}</span> : null}
              {selectedProduct.old ? <span className="qv-offer">{locale === "ar" ? "عرض خاص" : "Special offer"}</span> : null}
            </div>

            <p className="qv-desc">{selectedProduct.desc[locale]}</p>

            <div className="qv-opt">
              <div className="qv-opt-head">
                <span>{locale === "ar" ? "اللون" : "Colour"}</span>
                <b>{byLocale(locale, colors[activeColor])}</b>
              </div>
              <div className="qv-colors">
                {colors.map((color, index) => (
                  <button key={color.value} className={`qv-color${activeColor === index ? " active" : ""}`} onClick={() => setActiveColor(index)}>
                    <span className="qv-dot" style={{ background: color.value }} />
                    <small>{byLocale(locale, color)}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="qv-opt">
              <div className="qv-opt-head">
                <span>{locale === "ar" ? "المقاس / التكوين" : "Size / configuration"}</span>
                <b>{byLocale(locale, sizes[activeSize])}</b>
              </div>
              <div className="qv-sizes">
                {sizes.map((size, index) => (
                  <button key={size.en} className={`qv-size${activeSize === index ? " active" : ""}`} onClick={() => setActiveSize(index)}>
                    {byLocale(locale, size)}
                  </button>
                ))}
              </div>

              <div className="qv-dimensions">
                <span>{locale === "ar" ? "الأبعاد:" : "Dimensions:"}</span>
                <b>{productDimensions(selectedProduct, locale)}</b>
              </div>
            </div>

            <div className="qv-buy">
              <div className="qv-qty">
                <button onClick={() => setQty((v) => Math.max(1, v - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty((v) => Math.min(99, v + 1))}>+</button>
              </div>

              <button className="qv-cart" onClick={handleAddToCart}>
                <svg viewBox="0 0 24 24"><path d="M6 7h12l-1 13H7L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
                <span>{locale === "ar" ? "أضف إلى السلة" : "Add to cart"}</span>
              </button>
            </div>

            <button className="qv-consult" onClick={() => showToast(locale === "ar" ? "سيتواصل معك مستشار التصميم قريباً ✦" : "A design consultant will contact you soon ✦")}>
              <svg viewBox="0 0 24 24"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" /></svg>
              {locale === "ar" ? "احجز استشارة تصميم" : "Book a design consultation"}
            </button>

            <div className="qv-meta">
              <span className="qv-ico"><svg viewBox="0 0 24 24"><path d="M3 13h12V6H3v7Z" /><path d="M15 9h4l2 3v1h-6" /><circle cx="6.5" cy="16.5" r="1.6" /><circle cx="17.5" cy="16.5" r="1.6" /></svg></span>
              <span>{deliveryText}</span>
            </div>

            <div className="qv-meta qv-stock">
              <i />
              <span>{stockText}</span>
            </div>

            <div className="qv-specs">
              {specs.map((spec) => (
                <div className="qv-spec" key={spec.en}>
                  <span><SpecIcon /></span>
                  <b>{byLocale(locale, spec)}</b>
                </div>
              ))}
            </div>

            <div className="qv-payline">
              <span>{locale === "ar" ? "دفع آمن موثوق" : "Secure payments"}</span>
              <div><b>Mada</b><b>Visa</b><b>Apple Pay</b><b>Mastercard</b></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
