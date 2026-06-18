"use client";

import { useEffect, useState } from "react";
import { currency, type Product } from "@/data/rollc/content";
import { useRollcStore } from "@/components/rollc/ui/RollcStore";
import {
  type ProductSpec,
  productBadge,
  productColors,
  productDimensions,
  productGallery,
  productKind,
  productShortDescription,
  productSpecs,
  sizeOptions,
  thumb,
} from "@/components/rollc/product/productPageData";
import styles from "./QuickViewModal.module.css";

const toNumber = (value: string) => Number(String(value).replace(/[^\d.]/g, "")) || 0;
const formatNumber = (value: number) => value.toLocaleString("en-US");

const Star = () => (
  <svg viewBox="0 0 24 24"><path d="m12 2 2.9 6.3 6.9.6-5.2 4.6 1.6 6.7L12 17.3 5.8 20.8l1.6-6.7L2.2 8.9l6.9-.6L12 2Z" /></svg>
);

function SpecIcon({ kind }: { kind: ProductSpec["icon"] }) {
  switch (kind) {
    case "wood":
      return <svg viewBox="0 0 24 24"><path d="M4 9h16M4 9 6 4h12l2 5M4 9v11h16V9M9 13v4M15 13v4" /></svg>;
    case "warranty":
      return <svg viewBox="0 0 24 24"><path d="M12 3 4 6v6c0 4 3.5 7.5 8 9 4.5-1.5 8-5 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>;
    case "install":
      return <svg viewBox="0 0 24 24"><path d="M12 2v6m0 0 3-3m-3 3L9 5M5 13h14l-1.5 8h-11L5 13Z" /></svg>;
    case "room":
      return <svg viewBox="0 0 24 24"><path d="M3 21V8l9-5 9 5v13M9 21v-6h6v6" /></svg>;
    case "crafted":
      return <svg viewBox="0 0 24 24"><path d="m12 3 2.5 5 5.5.5-4 4 1 5.5L12 20l-5.5 2.5 1-5.5-4-4 5.5-.5L12 3Z" /></svg>;
    default:
      return <svg viewBox="0 0 24 24"><path d="M4 7c4-3 12-3 16 0M4 7v10c4 3 12 3 16 0V7M4 12c4 3 12 3 16 0" /></svg>;
  }
}

export function QuickViewModal() {
  const { locale, selectedProduct, closeQuickView, addToCart, showToast, openAssistant } = useRollcStore();

  // Keep the last product mounted through the close animation.
  const [data, setData] = useState<Product | null>(selectedProduct);
  const [activeImg, setActiveImg] = useState(0);
  const [fading, setFading] = useState(false);
  const [qty, setQty] = useState(1);
  const [colorIndex, setColorIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const open = Boolean(selectedProduct);

  useEffect(() => {
    if (selectedProduct) {
      setData(selectedProduct);
      return;
    }
    const t = setTimeout(() => setData(null), 450);
    return () => clearTimeout(t);
  }, [selectedProduct]);

  // Reset per-product UI whenever a different product opens.
  useEffect(() => {
    if (!selectedProduct) return;
    setActiveImg(0);
    setFading(false);
    setQty(1);
    setColorIndex(0);
    setSizeIndex(productKind(selectedProduct) === "sofas" ? 1 : 0);
    setLightboxOpen(false);
  }, [selectedProduct]);

  // Lightbox Esc — capture phase so it fires before the modal's Esc handler.
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopImmediatePropagation(); setLightboxOpen(false); }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [lightboxOpen]);

  // Lock the underlying scroll container + Esc to close.
  useEffect(() => {
    const shell = document.querySelector<HTMLElement>(".scroll-shell");
    if (shell) shell.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeQuickView();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (shell) shell.style.overflow = "";
    };
  }, [open, closeQuickView]);

  if (!data) {
    return <div className={`${styles.overlay}`} aria-hidden />;
  }

  const gallery = [...new Set(productGallery(data))];
  const colors = productColors;
  const sizes = sizeOptions(data);
  const badge = productBadge(data, locale);
  const desc = productShortDescription(data)[locale];
  const specs = productSpecs(data).slice(0, 4);
  const dims = productDimensions(data);
  const cur = currency(locale);

  const priceNumber = toNumber(data.price);
  const oldNumber = toNumber(data.old);
  const savings = oldNumber > priceNumber ? oldNumber - priceNumber : 0;

  const pdpHref = `${locale === "ar" ? "/products" : "/en/products"}/${data.id}`;

  const selectImg = (index: number) => {
    if (index === activeImg) return;
    setFading(true);
    setTimeout(() => {
      setActiveImg(index);
      setFading(false);
    }, 200);
  };

  const onAdd = () => {
    addToCart(data, { qty, color: colors[colorIndex][locale], size: sizes[sizeIndex]?.[locale] });
    showToast(locale === "ar" ? `تمت إضافة ${data.name.ar} إلى السلة` : `${data.name.en} added to cart`);
    closeQuickView();
  };

  const onConsult = () => showToast(locale === "ar" ? "سيتواصل معك مستشار التصميم قريباً ✦" : "Our consultant will contact you soon ✦");

  return (
    <>
      <div className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`} onClick={closeQuickView} aria-hidden />
      {lightboxOpen && (
        <div className={styles.lightbox} onClick={() => setLightboxOpen(false)} role="dialog" aria-modal="true" aria-label={locale === "ar" ? "عرض مكبّر" : "Enlarged view"}>
          <button className={styles.lbClose} onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }} aria-label={locale === "ar" ? "إغلاق" : "Close"}>
            <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
          <img src={gallery[activeImg]} alt={data.name[locale]} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
      <div
        className={`${styles.qvRoot} ${styles.modal} ${open ? styles.modalOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={locale === "ar" ? `عرض سريع — ${data.name.ar}` : `Quick view — ${data.name.en}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeQuickView();
        }}
      >
        <div className={styles.box}>
          <button className={styles.close} onClick={closeQuickView} aria-label={locale === "ar" ? "إغلاق" : "Close"}>
            <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>

          {/* Gallery */}
          <div className={styles.gallery}>
            <div className={styles.gMain}>
              {badge ? <span className={styles.gBadge}>{badge}</span> : null}
              <button className={styles.gChat} onClick={(event) => { event.stopPropagation(); event.preventDefault(); openAssistant(data); }} aria-label={locale === "ar" ? "اسأل مساعد رولك عن هذا المنتج" : "Ask Rollc assistant about this product"}>
                <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" /></svg>
              </button>
              <button type="button" className={styles.gZoom} onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }} aria-label={locale === "ar" ? "تكبير الصورة" : "Enlarge image"}>
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3M11 8v6M8 11h6" /></svg>
                {locale === "ar" ? "تكبير" : "Zoom"}
              </button>
              <a href={pdpHref} className={styles.gImgLink} aria-label={locale === "ar" ? `عرض صفحة — ${data.name.ar}` : `View product — ${data.name.en}`}>
                <img className={fading ? styles.fading : ""} src={gallery[activeImg]} alt={data.name[locale]} />
              </a>
            </div>
            <div className={styles.thumbs}>
              {gallery.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  className={`${styles.thumb} ${index === activeImg ? styles.thumbActive : ""}`}
                  onClick={() => selectImg(index)}
                  aria-label={`${locale === "ar" ? "زاوية" : "View"} ${index + 1}`}
                >
                  <img src={thumb(src)} alt={`${data.name[locale]} ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className={styles.details}>
            <span className={styles.dEyebrow}>{data.cat.ar} · {data.cat.en}</span>
            <h2 className={styles.dTitle}>{data.name[locale]}</h2>
            {locale === "ar" ? <span className={styles.dTitleEn}>{data.name.en}</span> : null}

            <div className={styles.dRating}>
              <span className={styles.stars}><Star /><Star /><Star /><Star /><Star /></span>
              <span>{locale === "ar" ? "4.9 · 128 تقييماً" : "4.9 · 128 reviews"}</span>
            </div>

            <div className={styles.dPrice}>
              <span className={styles.priceNow}>{data.price}<span className={styles.priceCur}>{cur}</span></span>
              {data.old ? <span className={styles.priceOld}>{data.old} {cur}</span> : null}
              {savings > 0 ? <span className={styles.priceSave}>{locale === "ar" ? `وفّر ${formatNumber(savings)} ${cur}` : `Save ${formatNumber(savings)} ${cur}`}</span> : null}
            </div>

            <p className={styles.dDesc}>{desc}</p>

            {/* Colours */}
            <div className={styles.opt}>
              <div className={styles.optHead}>
                <span className={styles.optLabel}>{locale === "ar" ? "اللون" : "Colour"}</span>
                <span className={styles.optValue}>{colors[colorIndex][locale]}</span>
              </div>
              <div className={styles.colors}>
                {colors.map((color, index) => (
                  <button key={color.value} className={`${styles.color} ${index === colorIndex ? styles.colorActive : ""}`} onClick={() => setColorIndex(index)}>
                    <span className={styles.dot} style={{ background: color.value }} />
                    <span className={styles.colorNm}>{color[locale]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className={styles.opt}>
              <div className={styles.optHead}>
                <span className={styles.optLabel}>{locale === "ar" ? "المقاس / التكوين" : "Size / configuration"}</span>
                <span className={styles.optValue}>{sizes[sizeIndex][locale]}</span>
              </div>
              <div className={styles.sizes}>
                {sizes.map((size, index) => (
                  <button key={size.en} className={`${styles.size} ${index === sizeIndex ? styles.sizeActive : ""}`} onClick={() => setSizeIndex(index)}>
                    {size[locale]}
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            {dims.length ? (
              <div className={styles.dims}>
                <div className={styles.optHead}>
                  <span className={styles.optLabel}>{locale === "ar" ? "الأبعاد" : "Dimensions"}</span>
                  <span className={styles.optValue}>{locale === "ar" ? "سم" : "cm"}</span>
                </div>
                <div className={styles.dimsRow}>
                  {dims.map((dim) => (
                    <span className={styles.dimChip} key={dim.key.en}>
                      <span className={styles.dimKey}>{dim.key[locale]}</span>
                      <span className={styles.dimVal}>{dim.value[locale]}{dim.unit ? ` ${dim.unit[locale]}` : ""}</span>
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Buy row */}
            <div className={styles.buyRow}>
              <div className={styles.qty}>
                <button onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label={locale === "ar" ? "إنقاص" : "Decrease"}>−</button>
                <span className={styles.qVal}>{qty}</span>
                <button onClick={() => setQty((value) => Math.min(99, value + 1))} aria-label={locale === "ar" ? "زيادة" : "Increase"}>+</button>
              </div>
              <button className={styles.addCart} onClick={onAdd}>
                <svg viewBox="0 0 24 24"><path d="M6 7h12l-1 13H7L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
                <span>{locale === "ar" ? "أضف إلى السلة" : "Add to cart"}</span>
              </button>
            </div>

            <button className={styles.consult} onClick={onConsult}>
              <svg viewBox="0 0 24 24"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" /></svg>
              {locale === "ar" ? "احجز استشارة تصميم" : "Book a design consultation"}
            </button>

            {/* Full product page */}
            <a className={styles.viewFull} href={pdpHref}>
              <span>{locale === "ar" ? "عرض كل التفاصيل" : "View full details"}</span>
              <span className={styles.vfArrow}>→</span>
            </a>

            {/* Delivery + stock */}
            <div className={styles.metaLine}>
              <span className={styles.metaIc}><svg viewBox="0 0 24 24"><path d="M3 13h12V6H3v7Z" /><path d="M15 9h4l2 3v1h-6" /><circle cx="6.5" cy="16.5" r="1.6" /><circle cx="17.5" cy="16.5" r="1.6" /></svg></span>
              <span>{locale === "ar" ? "توصيل وتركيب احترافي داخل المملكة" : "Professional delivery & installation in the Kingdom"}</span>
            </div>
            <div className={styles.metaLine}>
              <span className={styles.stockDot} />
              <span><b className={styles.stock}>{locale === "ar" ? "متوفر للطلب" : "In stock"}</b> — {locale === "ar" ? "يصل خلال 5 إلى 10 أيام" : "arrives in 5–10 days"}</span>
            </div>

            {/* Spec cards */}
            <div className={styles.specs}>
              {specs.map((spec) => (
                <div className={styles.spec} key={spec.icon}>
                  <div className={styles.specIc}><SpecIcon kind={spec.icon} /></div>
                  <div className={styles.specTxt}>{spec.label[locale]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
