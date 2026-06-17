"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { currency, type Locale, type Product } from "@/data/rollc/content";
import { useRollcStore } from "@/components/rollc/ui/RollcStore";
import {
  type ActiveFilters,
  type CategoryKind,
  type FilterGroup,
  type FilterKey,
  type SortMode,
  badgeOf,
  badgeText,
  getCategoryMeta,
  getFilterGroups,
  listCategoryProducts,
  matchesFilters,
  sortLabels,
  sortProducts,
} from "@/components/rollc/category/categoryPageData";
import styles from "./CategoryPage.module.css";

type ActiveState = Record<FilterKey, string[]>;

function emptyState(): ActiveState {
  return { price: [], color: [], size: [], material: [], availability: [] };
}

const CheckIcon = () => (
  <svg viewBox="0 0 24 24"><path d="m5 12 5 5L20 7" /></svg>
);

function FilterPanel({
  groups,
  active,
  onToggle,
  locale,
}: {
  groups: FilterGroup[];
  active: ActiveState;
  onToggle: (key: FilterKey, id: string) => void;
  locale: Locale;
}) {
  return (
    <>
      {groups.map((group) => (
        <div className={styles.fGroup} key={group.key}>
          <div className={styles.fTitle}>{group.title[locale]}</div>
          {group.options.map((option) => {
            const on = active[group.key].includes(option.id);
            return (
              <button
                type="button"
                key={option.id}
                className={`${styles.fOpt} ${on ? styles.fOptOn : ""}`}
                onClick={() => onToggle(group.key, option.id)}
                aria-pressed={on}
              >
                <span className={styles.cbx}><CheckIcon /></span>
                {option.swatch ? <span className={styles.swatchDot} style={{ background: option.swatch }} /> : null}
                <span className={styles.fLabel}>{option.label[locale]}</span>
              </button>
            );
          })}
        </div>
      ))}
    </>
  );
}

export function CategoryListing({ locale, kind }: { locale: Locale; kind: CategoryKind }) {
  const { addToCart, showToast, openQuickView, openAssistant } = useRollcStore();
  const rootRef = useRef<HTMLDivElement>(null);

  const meta = getCategoryMeta(kind);
  const cur = currency(locale);
  const allProducts = useMemo(() => listCategoryProducts(kind), [kind]);
  const groups = useMemo(() => getFilterGroups(kind), [kind]);

  const [active, setActive] = useState<ActiveState>(emptyState);
  const [sortMode, setSortMode] = useState<SortMode>("pop");
  const [cols, setCols] = useState<3 | 4>(4);
  const [shown, setShown] = useState(8);
  const [sortOpen, setSortOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeSets = useMemo<ActiveFilters>(
    () => ({
      price: new Set(active.price),
      color: new Set(active.color),
      size: new Set(active.size),
      material: new Set(active.material),
      availability: new Set(active.availability),
    }),
    [active]
  );

  const filtered = useMemo(
    () => sortProducts(allProducts.filter((product) => matchesFilters(product, activeSets)), sortMode),
    [allProducts, activeSets, sortMode]
  );

  // Reset visible count whenever the result set changes.
  useEffect(() => setShown(8), [active, sortMode, kind]);

  // Close the sort dropdown on any outside click.
  useEffect(() => {
    if (!sortOpen) return;
    const close = () => setSortOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [sortOpen]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const toggleFilter = (key: FilterKey, id: string) => {
    setActive((prev) => {
      const list = prev[key];
      const next = list.includes(id) ? list.filter((value) => value !== id) : [...list, id];
      return { ...prev, [key]: next };
    });
  };

  const clearAll = () => setActive(emptyState());

  const visible = filtered.slice(0, shown);
  const href = (id: string) => `${locale === "ar" ? "/products" : "/en/products"}/${id}`;

  const handleAdd = (product: Product) => {
    addToCart(product);
    showToast(locale === "ar" ? `تمت إضافة ${product.name.ar} إلى السلة` : `${product.name.en} added to cart`);
  };

  return (
    <div ref={rootRef} className={styles.categoryTemplate}>
      <div className="wrap">
        <nav className={styles.crumb} aria-label={locale === "ar" ? "مسار التنقل" : "Breadcrumb"}>
          <a href={locale === "ar" ? "/" : "/en"}>{locale === "ar" ? "الرئيسية" : "Home"}</a>
          <span className={styles.sep}>/</span>
          <a href={locale === "ar" ? "/" : "/en"}>{meta.parentCrumb[locale]}</a>
          <span className={styles.sep}>/</span>
          <span className={styles.nowCrumb}>{meta.title[locale]}</span>
        </nav>
      </div>

      {/* Category hero */}
      <div className="wrap">
        <section className={styles.catHero}>
          <img src={meta.hero} alt={meta.title[locale]} />
          <div className={styles.catHeroBody}>
            <span className={styles.eyebrow}>{locale === "ar" ? `مجموعة ${meta.title[locale]}` : `${meta.title.en} Collection`}</span>
            <h1 className={styles.catHeroTitle}>{meta.title[locale]}</h1>
            <div className={styles.catHeroEn}>{meta.subtitle}</div>
            <p className={styles.catHeroP}>{meta.description[locale]}</p>
            <div className={styles.catStats}>
              <span className={styles.catStat}>
                <span className={styles.statIcon}><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg></span>
                <span>{locale === "ar" ? `${allProducts.length} قطعة` : `${allProducts.length} pieces`}</span>
              </span>
              <span className={styles.catStat}>
                <span className={styles.statIcon}><svg viewBox="0 0 24 24"><path d="M3 13h12V6H3v7Z" /><path d="M15 9h4l2 3v1h-6" /><circle cx="6.5" cy="16.5" r="1.4" /><circle cx="17.5" cy="16.5" r="1.4" /></svg></span>
                <span>{locale === "ar" ? "توصيل وتركيب" : "Delivery & install"}</span>
              </span>
              <span className={styles.catStat}>
                <span className={styles.statIcon}><svg viewBox="0 0 24 24"><path d="M12 3 4 6v6c0 4 3.5 7.5 8 9 4.5-1.5 8-5 8-9V6l-8-3Z" /></svg></span>
                <span>{locale === "ar" ? "ضمان سنتين" : "2-year warranty"}</span>
              </span>
              <span className={styles.catStat}>
                <span className={styles.statIcon}><svg viewBox="0 0 24 24"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" /></svg></span>
                <span>{locale === "ar" ? "استشارة تصميم" : "Design advice"}</span>
              </span>
            </div>
          </div>
        </section>
      </div>

      <main className="wrap">
        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.resultsCount}>
            {locale === "ar" ? "عرض" : "Showing"} <b>{filtered.length}</b> {locale === "ar" ? "منتجاً" : "products"}
          </div>
          <div className={styles.controlsRight}>
            <button type="button" className={styles.filterBtn} onClick={() => setDrawerOpen(true)}>
              <svg viewBox="0 0 24 24"><path d="M3 5h18M6 12h12M10 19h4" /></svg>
              <span>{locale === "ar" ? "تصفية" : "Filter"}</span>
            </button>

            <div className={`${styles.sort} ${sortOpen ? styles.sortOpen : ""}`}>
              <button
                type="button"
                className={styles.sortBtn}
                onClick={(event) => {
                  event.stopPropagation();
                  setSortOpen((value) => !value);
                }}
              >
                <span>
                  <span className={styles.sortLbl}>{locale === "ar" ? "ترتيب:" : "Sort:"}</span>{" "}
                  <span className={styles.sortValue}>{sortLabels[sortMode][locale]}</span>
                </span>
                <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
              </button>
              <div className={styles.sortMenu}>
                {(Object.keys(sortLabels) as SortMode[]).map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    className={sortMode === mode ? styles.sortActive : ""}
                    onClick={() => {
                      setSortMode(mode);
                      setSortOpen(false);
                    }}
                  >
                    {sortLabels[mode][locale]}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.viewToggle}>
              <button type="button" className={cols === 4 ? styles.viewActive : ""} onClick={() => setCols(4)} aria-label={locale === "ar" ? "4 أعمدة" : "4 columns"}>
                <svg viewBox="0 0 24 24"><rect x="3" y="3" width="3.5" height="18" /><rect x="9.25" y="3" width="3.5" height="18" /><rect x="15.5" y="3" width="3.5" height="18" /><rect x="20" y="3" width="1" height="18" /></svg>
              </button>
              <button type="button" className={cols === 3 ? styles.viewActive : ""} onClick={() => setCols(3)} aria-label={locale === "ar" ? "3 أعمدة" : "3 columns"}>
                <svg viewBox="0 0 24 24"><rect x="3" y="3" width="5" height="18" /><rect x="9.5" y="3" width="5" height="18" /><rect x="16" y="3" width="5" height="18" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Shop layout */}
        <div className={styles.shop}>
          <aside className={styles.sidebar}>
            <FilterPanel groups={groups} active={active} onToggle={toggleFilter} locale={locale} />
            <button type="button" className={styles.fClear} onClick={clearAll}>
              {locale === "ar" ? "مسح كل الفلاتر" : "Clear all filters"}
            </button>
          </aside>

          <div>
            <div className={`${styles.grid} ${cols === 3 ? styles.gridCols3 : ""}`}>
              {visible.length === 0 ? (
                <div className={styles.noRes}>
                  {locale === "ar" ? "لا توجد منتجات مطابقة. جرّب تعديل الفلاتر." : "No matching products. Try adjusting the filters."}
                </div>
              ) : (
                visible.map((product) => {
                  const badge = badgeOf(product);
                  return (
                    <article
                      className={styles.card}
                      key={product.id}
                      data-qv-card="category-product"
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
                      <div className={styles.cardMedia}>
                        {badge ? <span className={`${styles.cardTag} ${badge === "offer" ? styles.cardTagOffer : ""}`}>{badgeText[badge][locale]}</span> : null}
                        <button type="button" className={styles.cardChat} onClick={(event) => { event.stopPropagation(); event.preventDefault(); openAssistant(product); }} aria-label={locale === "ar" ? "اسأل مساعد رولك عن هذا المنتج" : "Ask Rollc assistant about this product"}>
                          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" /></svg>
                        </button>
                        <img src={product.img} alt={product.name[locale]} loading="lazy" />
                      </div>
                      <div className={styles.cardBody}>
                        <span className={styles.cardCat}>{product.cat[locale]}</span>
                        <h3 className={styles.cardName}>{product.name[locale]}</h3>
                        <p className={styles.cardDesc}>{product.desc[locale]}</p>
                        <div className={styles.cardFoot}>
                          <span className={styles.price}>
                            <b>{product.price}</b> <span className={styles.priceCur}>{cur}</span>
                            {product.old ? <span className={styles.priceOld}>{product.old}</span> : null}
                          </span>
                          <button type="button" className={styles.addCart} onClick={(event) => { event.stopPropagation(); handleAdd(product); }} aria-label={locale === "ar" ? "أضف" : "Add"}>
                            <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            <div className={styles.moreWrap}>
              {shown < filtered.length ? (
                <button type="button" className={styles.moreBtn} onClick={() => setShown((value) => value + 4)}>
                  <span>{locale === "ar" ? "عرض المزيد" : "Load more"}</span>
                  <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Editorial CTA */}
        <section className={styles.help}>
          <div className={styles.helpImg}>
            <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80" alt={locale === "ar" ? "استشارة تصميم رولك" : "Rollc design consultation"} />
          </div>
          <div className={styles.helpText}>
            <span className={styles.eyebrow}>{locale === "ar" ? "نحن هنا لمساعدتك" : "We're here to help"}</span>
            <h2 className={styles.helpTitle}>
              {locale === "ar" ? `تحتاج مساعدة في اختيار ${meta.title.ar === "الأرائك" ? "الأريكة" : "القطعة"} المناسبة؟` : "Need help choosing the right piece?"}
            </h2>
            <p>
              {locale === "ar"
                ? "يساعدك مستشارو التصميم لدينا في اختيار المقاس واللون والخامة التي تناسب مساحتك وذوقك — مجاناً وبكل اهتمام."
                : "Our design consultants help you pick the size, colour, and material that suit your space and taste — free and with full attention."}
            </p>
            <button type="button" className={styles.helpBtn} onClick={() => showToast(locale === "ar" ? "سيتواصل معك مستشار التصميم قريباً ✦" : "Our consultant will contact you soon ✦")}>
              <span>{locale === "ar" ? "احجز استشارة تصميم" : "Book a design consultation"}</span>
              <span className={styles.arrow}>→</span>
            </button>
          </div>
        </section>
      </main>

      {/* Mobile filter drawer */}
      <div className={`${styles.drawerOverlay} ${drawerOpen ? styles.drawerOverlayOpen : ""}`} onClick={() => setDrawerOpen(false)} />
      <aside className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ""}`} aria-hidden={!drawerOpen}>
        <div className={styles.drawerHead}>
          <h3>{locale === "ar" ? "تصفية" : "Filters"}</h3>
          <button type="button" onClick={() => setDrawerOpen(false)} aria-label={locale === "ar" ? "إغلاق" : "Close"}>✕</button>
        </div>
        <div className={styles.drawerBody}>
          <FilterPanel groups={groups} active={active} onToggle={toggleFilter} locale={locale} />
        </div>
        <div className={styles.drawerFoot}>
          <button type="button" className={styles.drawerReset} onClick={clearAll}>{locale === "ar" ? "إعادة ضبط" : "Reset"}</button>
          <button type="button" className={styles.drawerApply} onClick={() => setDrawerOpen(false)}>{locale === "ar" ? "عرض النتائج" : "Show results"}</button>
        </div>
      </aside>
    </div>
  );
}
