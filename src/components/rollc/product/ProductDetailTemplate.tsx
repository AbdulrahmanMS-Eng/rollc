"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { branches, currency, products, type Locale, type Product } from "@/data/rollc/content";
import { ProductIcon } from "@/components/rollc/product/ProductIcon";
import { useRollcStore } from "@/components/rollc/ui/RollcStore";
import {
  accordionItems,
  categoryCrumb,
  discountLabel,
  highRes,
  productBadge,
  productColors,
  productDimensions,
  productGallery,
  productKind,
  productReviews,
  productShortDescription,
  productSpecs,
  roomSuggestions,
  sizeOptions,
  storyFor,
  thumb,
} from "@/components/rollc/product/productPageData";
import styles from "./ProductPage.module.css";

function Stars({ large = false }: { large?: boolean }) {
  return (
    <span className={`${styles.stars} ${large ? styles.starsLarge : ""}`} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg key={index} viewBox="0 0 24 24">
          <path d="m12 2 2.9 6.3 6.9.6-5.2 4.6 1.6 6.7L12 17.3 5.8 20.8l1.6-6.7L2.2 8.9l6.9-.6L12 2Z" />
        </svg>
      ))}
    </span>
  );
}

function ProductDiagram({ locale, product }: { locale: Locale; product: Product }) {
  const dims = productDimensions(product);
  const width = dims[0]?.value[locale] ?? "240";
  const depth = dims[1]?.value[locale] ?? "95";
  const height = dims[2]?.value[locale] ?? "82";
  const seat = dims[3]?.value[locale] ?? "44";

  return (
    <div className={`${styles.diagram} ${styles.reveal}`}>
      <svg className={styles.sofaSvg} viewBox="0 0 420 300" role="img" aria-label={locale === "ar" ? "مخطط أبعاد المنتج" : "Product dimensions diagram"}>
        <line className={styles.dimline} x1="60" y1="40" x2="360" y2="40" />
        <line className={styles.tick} x1="60" y1="32" x2="60" y2="48" />
        <line className={styles.tick} x1="360" y1="32" x2="360" y2="48" />
        <text x="210" y="30" textAnchor="middle">{width} {locale === "ar" ? "سم" : "cm"}</text>
        <rect className={styles.sofaBody} x="60" y="120" width="300" height="70" rx="10" />
        <rect className={styles.sofaBody} x="60" y="80" width="34" height="120" rx="10" />
        <rect className={styles.sofaBody} x="326" y="80" width="34" height="120" rx="10" />
        <rect className={styles.sofaCushion} x="100" y="98" width="74" height="34" rx="6" />
        <rect className={styles.sofaCushion} x="184" y="98" width="74" height="34" rx="6" />
        <rect className={styles.sofaCushion} x="268" y="98" width="50" height="34" rx="6" />
        <rect className={styles.sofaCushion} x="100" y="140" width="218" height="36" rx="7" />
        <rect className={styles.sofaLeg} x="80" y="190" width="10" height="20" />
        <rect className={styles.sofaLeg} x="330" y="190" width="10" height="20" />
        <line className={styles.dimline} x1="384" y1="80" x2="384" y2="210" />
        <line className={styles.tick} x1="376" y1="80" x2="392" y2="80" />
        <line className={styles.tick} x1="376" y1="210" x2="392" y2="210" />
        <text x="398" y="148" textAnchor="middle" transform="rotate(90 398 148)">{height} {locale === "ar" ? "سم" : "cm"}</text>
        <line className={styles.dimline} x1="40" y1="176" x2="40" y2="210" />
        <line className={styles.tick} x1="32" y1="176" x2="48" y2="176" />
        <line className={styles.tick} x1="32" y1="210" x2="48" y2="210" />
        <text x="26" y="196" textAnchor="middle" transform="rotate(-90 26 196)">{seat}</text>
        <line className={styles.dimline} x1="60" y1="252" x2="360" y2="252" opacity=".5" />
        <text x="210" y="272" textAnchor="middle">{locale === "ar" ? `العمق: ${depth} سم` : `Depth: ${depth} cm`}</text>
      </svg>
      <p className={styles.diagramNote}>{locale === "ar" ? "رسم توضيحي تقريبي للأبعاد" : "Approximate dimensional illustration"}</p>
    </div>
  );
}

function ProductCard({ item, locale, quickAdd }: { item: Product; locale: Locale; quickAdd: (item: Product) => void }) {
  const cur = currency(locale);
  const href = `${locale === "ar" ? "/products" : "/en/products"}/${item.id}`;

  return (
    <article className={styles.card}>
      <div className={styles.cardMedia}>
        {item.tag[locale] ? <span className={styles.cardTag}>{item.tag[locale]}</span> : null}
        <a href={href} aria-label={item.name[locale]}>
          <img src={item.img} alt={item.name[locale]} loading="lazy" />
        </a>
        <button type="button" className={styles.cardAdd} onClick={() => quickAdd(item)}>{locale === "ar" ? "إضافة سريعة" : "Quick add"}</button>
      </div>
      <div className={styles.cardBody}>
        <span className={styles.cardCat}>{item.cat[locale]}</span>
        <a href={href}><h3 className={styles.cardName}>{item.name[locale]}</h3></a>
        <div className={styles.cardFoot}>
          <span className={styles.cardPrice}><b>{item.price}</b> <span className={styles.cardCurrency}>{cur}</span></span>
        </div>
      </div>
    </article>
  );
}

export function ProductDetailTemplate({ locale, product }: { locale: Locale; product: Product }) {
  const { addToCart, showToast } = useRollcStore();
  const rootRef = useRef<HTMLDivElement>(null);

  const [activeImage, setActiveImage] = useState(highRes(product.img));
  const [imageVisible, setImageVisible] = useState(true);
  const [saved, setSaved] = useState(false);
  const [activeColor, setActiveColor] = useState(0);
  const [activeSize, setActiveSize] = useState(1);
  const [qty, setQty] = useState(1);
  const [openAcc, setOpenAcc] = useState(0);
  const [sticky, setSticky] = useState(false);

  const cur = currency(locale);
  const isSofa = productKind(product) === "sofas";
  const shortName = locale === "ar" ? product.name.ar.replace("أريكة ", "") : product.name.en.replace(" Sofa", "");

  const gallery = useMemo(() => productGallery(product), [product]);
  const sizes = useMemo(() => sizeOptions(product), [product]);
  const specs = useMemo(() => productSpecs(product), [product]);
  const dimensions = useMemo(() => productDimensions(product), [product]);
  const story = useMemo(() => storyFor(product), [product]);
  const suggestions = useMemo(() => roomSuggestions(product), [product]);
  const discount = discountLabel(product, locale);
  const category = categoryCrumb(product);
  const description = productShortDescription(product);
  const badge = productBadge(product, locale);
  const accordions = accordionItems();

  const related = useMemo(
    () => products.filter((item) => item.id !== product.id).slice(0, 4),
    [product.id]
  );

  const similar = useMemo(() => {
    const sameKind = products.filter((item) => item.id !== product.id && productKind(item) === productKind(product));
    const pool = sameKind.length ? sameKind : products.filter((item) => item.id !== product.id);
    return pool.slice(0, 4);
  }, [product]);

  // Switch the hero image with a soft cross-fade (matches the reference design).
  const selectImage = (image: string) => {
    if (image === activeImage) return;
    setImageVisible(false);
    window.setTimeout(() => {
      setActiveImage(image);
      setImageVisible(true);
    }, 180);
  };

  // Reset all interactive state when navigating between products.
  useEffect(() => {
    setActiveImage(highRes(product.img));
    setImageVisible(true);
    setSaved(false);
    setActiveColor(0);
    setActiveSize(Math.min(1, Math.max(0, sizeOptions(product).length - 1)));
    setQty(1);
    setOpenAcc(0);
  }, [product]);

  // Sticky mobile add-to-cart bar.
  useEffect(() => {
    const scrollRoot = document.querySelector(".scroll-shell");
    const onScroll = () => {
      const scrollTop = scrollRoot instanceof HTMLElement ? scrollRoot.scrollTop : window.scrollY;
      setSticky(window.innerWidth <= 760 && scrollTop > 700);
    };

    onScroll();
    scrollRoot?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      scrollRoot?.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Single scroll-reveal observer, scoped to this component's subtree.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.reveal}`));
    if (!items.length) return;

    // Same config as the site-wide Reveal component (viewport root) so the
    // PDP fade-up motion behaves identically to the rest of the site.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(styles.revealIn);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [product]);

  const addProduct = () => {
    addToCart();
    showToast(locale === "ar" ? `تمت إضافة ${product.name.ar} إلى السلة` : `${product.name.en} added to cart`);
  };

  const quickAdd = (item: Product) => {
    addToCart();
    showToast(locale === "ar" ? `تمت إضافة ${item.name.ar} إلى السلة` : `${item.name.en} added to cart`);
  };

  const addSuggestion = (name: string) => {
    addToCart();
    showToast(locale === "ar" ? `تمت إضافة ${name} إلى السلة` : "Item added to cart");
  };

  return (
    <div ref={rootRef} className={styles.productTemplate}>
      <div className="wrap">
        <nav className={styles.crumb} aria-label={locale === "ar" ? "مسار التنقل" : "Breadcrumb"}>
          <a href={locale === "ar" ? "/" : "/en"}>{locale === "ar" ? "الرئيسية" : "Home"}</a>
          <span className={styles.sep}>/</span>
          <a href={`${locale === "ar" ? "" : "/en"}/categories/${productKind(product)}`}>{category[locale]}</a>
          <span className={styles.sep}>/</span>
          <span className={styles.nowCrumb}>{product.name[locale]}</span>
        </nav>
      </div>

      <main className="wrap">
        <section className={styles.pdp}>
          <div className={styles.gallery}>
            <div className={styles.gMain}>
              {badge ? <span className={styles.gBadge}>{badge}</span> : null}
              <button
                type="button"
                className={`${styles.gSave} ${saved ? styles.gSaveActive : ""}`}
                onClick={() => {
                  const next = !saved;
                  setSaved(next);
                  showToast(next ? (locale === "ar" ? "أُضيفت إلى المفضلة" : "Added to wishlist") : (locale === "ar" ? "أُزيلت من المفضلة" : "Removed from wishlist"));
                }}
                aria-label={locale === "ar" ? "إضافة للمفضلة" : "Add to wishlist"}
              >
                <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.5-7-9.5A3.8 3.8 0 0 1 12 7a3.8 3.8 0 0 1 7 3.5C19 15.5 12 20 12 20Z" /></svg>
              </button>
              <button type="button" className={styles.gZoom} onClick={() => window.open(activeImage, "_blank")}>
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3M11 8v6M8 11h6" /></svg>
                <span>{locale === "ar" ? "تكبير" : "Zoom"}</span>
              </button>
              <img src={activeImage} alt={product.name[locale]} style={{ opacity: imageVisible ? 1 : 0 }} />
            </div>

            <div className={styles.thumbs}>
              {gallery.map((image, index) => (
                <button
                  type="button"
                  key={`${image}-${index}`}
                  className={`${styles.thumb} ${activeImage === image ? styles.thumbActive : ""}`}
                  onClick={() => selectImage(image)}
                  aria-label={locale === "ar" ? `صورة المنتج ${index + 1}` : `Product image ${index + 1}`}
                >
                  <img src={thumb(image)} alt="" />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.panel}>
            <span className={styles.pEyebrow}>{locale === "ar" ? `${product.cat.ar} · ${product.cat.en}` : product.cat.en}</span>
            <h1 className={styles.pTitle}>{product.name[locale]}</h1>
            <p className={styles.pSub}>{product.name.en}</p>
            <div className={styles.pRating}><Stars /><span>{locale === "ar" ? "4.9 · 128 تقييماً" : "4.9 · 128 reviews"}</span></div>
            <div className={styles.pPrice}>
              <span className={styles.priceNow}>{product.price}<span className={styles.currency}>{cur}</span></span>
              {product.old ? <span className={styles.priceOld}>{product.old} {cur}</span> : null}
              {discount ? <span className={styles.priceSave}>{discount}</span> : null}
            </div>
            <p className={styles.pDesc}>{description[locale]}</p>

            <div className={styles.opt}>
              <div className={styles.optHead}><span className={styles.optLabel}>{locale === "ar" ? "اللون" : "Colour"}</span><span className={styles.optValue}>{productColors[activeColor][locale]}</span></div>
              <div className={styles.colors}>
                {productColors.map((color, index) => (
                  <button type="button" key={color.value} className={`${styles.color} ${activeColor === index ? styles.colorActive : ""}`} onClick={() => setActiveColor(index)}>
                    <span className={styles.colorDot} style={{ background: color.value }} />
                    <span className={styles.colorName}>{color[locale]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.opt}>
              <div className={styles.optHead}><span className={styles.optLabel}>{locale === "ar" ? "المقاس / التكوين" : "Size / Configuration"}</span><span className={styles.optValue}>{sizes[activeSize]?.[locale] ?? sizes[0]?.[locale]}</span></div>
              <div className={styles.sizes}>
                {sizes.map((size, index) => <button type="button" key={size.en} className={`${styles.size} ${activeSize === index ? styles.sizeActive : ""}`} onClick={() => setActiveSize(index)}>{size[locale]}</button>)}
              </div>
            </div>

            <div className={styles.buyRow}>
              <div className={styles.qty}>
                <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label={locale === "ar" ? "إنقاص" : "Decrease"}>−</button>
                <span className={styles.qtyValue}>{qty}</span>
                <button type="button" onClick={() => setQty((value) => Math.min(99, value + 1))} aria-label={locale === "ar" ? "زيادة" : "Increase"}>+</button>
              </div>
              <button type="button" className={styles.addCart} onClick={addProduct}><svg viewBox="0 0 24 24"><path d="M6 7h12l-1 13H7L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg><span>{locale === "ar" ? "أضف إلى السلة" : "Add to cart"}</span></button>
            </div>

            <button type="button" className={styles.consult} onClick={() => showToast(locale === "ar" ? "سيتواصل معك مستشار التصميم قريباً ✦" : "Our design consultant will contact you soon ✦")}><svg viewBox="0 0 24 24"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" /></svg><span>{locale === "ar" ? "احجز استشارة تصميم" : "Book a design consultation"}</span></button>
            <div className={`${styles.metaLine} ${styles.stock}`}><span className={styles.stockDot} /><span><b>{locale === "ar" ? "متوفر للطلب" : "Available to order"}</b>{locale === "ar" ? " — يصل خلال 5 إلى 10 أيام" : " — arrives in 5 to 10 days"}</span></div>
            <div className={styles.metaLine}><span className={styles.metaIcon}><svg viewBox="0 0 24 24"><path d="M3 13h12V6H3v7Z" /><path d="M15 9h4l2 3v1h-6" /><circle cx="6.5" cy="16.5" r="1.6" /><circle cx="17.5" cy="16.5" r="1.6" /></svg></span><span>{locale === "ar" ? "توصيل وتركيب احترافي داخل المملكة" : "Professional delivery & installation in the Kingdom"}</span></div>
            <div className={styles.trust}><span className={styles.trustLabel}>{locale === "ar" ? "دفع آمن موثوق" : "Secure checkout"}</span><div className={styles.payMethods}><span>Mada</span><span>Visa</span><span>Apple&nbsp;Pay</span><span>Tamara</span></div></div>
          </div>
        </section>
      </main>

      <section className={`${styles.section} ${styles.specs}`}>
        <div className="wrap"><div className={`${styles.specGrid} ${styles.reveal}`}>{specs.map((spec) => <div className={styles.spec} key={spec.label.en}><div className={styles.specIcon}><ProductIcon icon={spec.icon} /></div><div className={styles.specText}>{spec.label[locale]}</div></div>)}</div></div>
      </section>

      <section className={styles.section}>
        <div className="wrap"><div className={styles.storyGrid}><div className={`${styles.storyVisual} ${styles.reveal}`}><img src={story.image} alt="" /></div><div className={`${styles.storyText} ${styles.reveal}`}><span className={styles.eyebrow}>{locale === "ar" ? "قصة القطعة" : "The story"}</span><h2 className={styles.sectionTitle}>{story.title[locale]}</h2><p>{story.paragraphs[0][locale]}</p><blockquote className={styles.storyPull}>{story.quote[locale]}</blockquote><p>{story.paragraphs[1][locale]}</p></div></div></div>
      </section>

      <section className={`${styles.section} ${styles.dims}`}>
        <div className="wrap"><div className={styles.dimsGrid}><div className={styles.reveal}><span className={styles.eyebrow}>{locale === "ar" ? "المقاسات" : "Dimensions"}</span><h2 className={styles.sectionTitle}>{locale === "ar" ? "مقاساتٌ تناسب مساحتك" : "Measurements that fit your space"}</h2><div className={styles.dimsList}>{dimensions.map((dim) => <div className={styles.dim} key={dim.key.en}><span className={styles.dimKey}>{dim.key[locale]}</span><span className={styles.dimValue}>{dim.value[locale]}{dim.unit ? <small>{dim.unit[locale]}</small> : null}</span></div>)}</div></div><ProductDiagram locale={locale} product={product} /></div></div>
      </section>

      <section className={styles.section}>
        <div className="wrap"><div className={`${styles.centerHead} ${styles.reveal}`}><span className={styles.eyebrow}>{locale === "ar" ? "التفاصيل الكاملة" : "Full details"}</span><h2 className={styles.sectionTitle}>{locale === "ar" ? "كل ما تودّ معرفته" : "Everything you would want to know"}</h2></div><div className={`${styles.acc} ${styles.reveal}`}>{accordions.map((item, index) => <div className={`${styles.accItem} ${openAcc === index ? styles.accOpen : ""}`} key={item.title.en}><button type="button" className={styles.accHead} onClick={() => setOpenAcc((value) => value === index ? -1 : index)}><span className={styles.accTitle}>{item.title[locale]}</span><span className={styles.accIcon} /></button><div className={styles.accBody}><div className={styles.accBodyInner}><p>{item.body[locale]}</p></div></div></div>)}</div></div>
      </section>

      <section className={`${styles.section} ${styles.roomInsp}`}>
        <div className="wrap"><div className={`${styles.secHead} ${styles.reveal}`}><div><span className={styles.eyebrow}>{locale === "ar" ? "جلسة منسّقة" : "Styled set"}</span><h2 className={styles.sectionTitle}>{locale === "ar" ? `أكمل المشهد حول ${shortName}` : `Complete the scene around ${shortName}`}</h2></div></div><div className={styles.roomGrid}><div className={`${styles.roomScene} ${styles.reveal}`}><img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80" alt="" /><span className={`${styles.roomTag} ${styles.roomTagOne}`}><span className={styles.roomPin} />{product.name[locale]}</span><span className={`${styles.roomTag} ${styles.roomTagTwo}`}><span className={styles.roomPin} />{locale === "ar" ? "طاولة جانبية" : "Side table"}</span></div><div className={`${styles.roomSuggest} ${styles.reveal}`}><h3 className={styles.suggestTitle}>{locale === "ar" ? "قطعٌ تكمّل الجلسة" : "Pieces that complete it"}</h3><p>{locale === "ar" ? `اخترناها بعناية لتنسجم مع ${product.name.ar}.` : `Hand-picked to pair beautifully with ${product.name.en}.`}</p>{suggestions.map((item) => <button type="button" className={styles.sug} key={item.name.en} onClick={() => addSuggestion(item.name.ar)}><span className={styles.sugImage}><img src={item.img} alt="" /></span><span className={styles.sugText}><b>{item.name[locale]}</b><span>{item.meta[locale]}</span></span><span className={styles.sugPrice}>{item.price} {cur}</span></button>)}</div></div></div>
      </section>

      <section className={styles.section}>
        <div className="wrap"><div className={`${styles.revHead} ${styles.reveal}`}><div><span className={styles.eyebrow}>{locale === "ar" ? "آراء العملاء" : "Customer reviews"}</span><h2 className={styles.sectionTitle}>{locale === "ar" ? "تجاربٌ تروي الجودة" : "Experiences that speak quality"}</h2></div><div className={styles.revScore}><span className={styles.revBig}>4.9</span><div className={styles.revMeta}><Stars large /><span>{locale === "ar" ? "من 128 تقييماً موثّقاً" : "from 128 verified reviews"}</span></div></div></div><div className={styles.revGrid}>{productReviews.map((review) => <article className={`${styles.revCard} ${styles.reveal}`} key={review.name.en}><Stars /><p className={styles.revQuote}>{review.quote[locale]}</p><div className={styles.revWho}><span className={styles.revAvatar}>{review.initials[locale]}</span><div><b className={styles.revName}>{review.name[locale]}</b><span className={styles.revVerified}>✓ {locale === "ar" ? "عملية شراء موثّقة" : "Verified purchase"}</span></div></div></article>)}</div></div>
      </section>

      <section className={`${styles.section} ${styles.related}`}>
        <div className="wrap"><div className={`${styles.secHead} ${styles.reveal}`}><div><span className={styles.eyebrow}>{locale === "ar" ? "قد يعجبك أيضاً" : "You may also like"}</span><h2 className={styles.sectionTitle}>{locale === "ar" ? `قطعٌ تنسجم مع ${shortName}` : `Pieces that pair with ${shortName}`}</h2></div><a href={`${locale === "ar" ? "" : "/en"}/categories/${productKind(product)}`} className={styles.secLink}>{locale === "ar" ? "عرض الكل" : "View all"} <span>→</span></a></div><div className={`${styles.prodGrid} ${styles.reveal}`}>{related.map((item) => <ProductCard item={item} locale={locale} quickAdd={quickAdd} key={item.id} />)}</div></div>
      </section>

      <section className={`${styles.section} ${isSofa ? styles.similarSofas : styles.similarSection}`}>
        <div className="wrap"><div className={`${styles.secHead} ${styles.reveal}`}><div><span className={styles.eyebrow}>{isSofa ? (locale === "ar" ? "أرائك أخرى من رولك" : "Similar Sofas") : (locale === "ar" ? "منتجات مشابهة" : "Similar products")}</span><h2 className={styles.sectionTitle}>{isSofa ? (locale === "ar" ? "اكتشف المزيد من الأرائك الفاخرة" : "Discover more luxury sofas") : (locale === "ar" ? "اكتشف المزيد من نفس الفئة" : "Discover more from this category")}</h2></div><a href={`${locale === "ar" ? "" : "/en"}/categories/${productKind(product)}`} className={styles.secLink}>{isSofa ? (locale === "ar" ? "كل الأرائك" : "All sofas") : (locale === "ar" ? "عرض الكل" : "View all")} <span>→</span></a></div><div className={`${styles.prodGrid} ${styles.reveal}`}>{similar.map((item) => <ProductCard item={item} locale={locale} quickAdd={quickAdd} key={`similar-${item.id}`} />)}</div></div>
      </section>

      <section className={`${styles.section} ${styles.branches}`} id="branches">
        <div className={`wrap ${styles.brInner}`}><div className={`${styles.brTop} ${styles.reveal}`}><span className={styles.eyebrow}>{locale === "ar" ? "جرّبها بنفسك" : "Try it yourself"}</span><h2 className={styles.sectionTitle}>{locale === "ar" ? `جرّب ${product.name.ar} في أقرب معرض` : `Try the ${product.name.en} at your nearest showroom`}</h2><p>{locale === "ar" ? "اجلس، والمس الخامة، واختر لونك مع مستشاري التصميم لدينا." : "Sit, feel the material, and choose your finish with our design consultants."}</p></div><div className={`${styles.brGrid} ${styles.reveal}`}>{branches.map((branch) => <article className={styles.brCard} key={branch.city.en}><h3 className={styles.brCity}><span className={styles.pinIcon}><svg viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.4" /></svg></span><span>{branch.city[locale]}</span></h3><p className={styles.brAddr}>{branch.addr[locale]}</p><p className={styles.brHours}>10:00 — 23:00</p></article>)}</div><div className={`${styles.brCta} ${styles.reveal}`}><button type="button" className={styles.btnGold} onClick={() => showToast(locale === "ar" ? "سنؤكد موعد زيارتك قريباً ✦" : "We will confirm your visit soon ✦")}>{locale === "ar" ? "احجز موعد زيارة" : "Book a visit"} <span className={styles.arrow}>→</span></button></div></div>
      </section>

      <div className={`${styles.stickyBar} ${sticky ? styles.stickyBarShow : ""}`}>
        <div className={styles.stickyInfo}><div className={styles.stickyName}>{product.name[locale]}</div><div className={styles.stickyPrice}>{product.price} {cur}</div></div>
        <button type="button" className={styles.stickyButton} onClick={addProduct}>{locale === "ar" ? "أضف إلى السلة" : "Add to cart"}</button>
      </div>
    </div>
  );
}
