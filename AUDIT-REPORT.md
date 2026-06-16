# Rollc Audit Report

**Date:** 2026-06-16  
**Scope:** Home page, category listing (/categories/[category] + /en/categories/[category]), product detail page (/products/[slug] + /en/products/[slug]), QuickViewModal, Header/TopBar/Footer.  
**Out of scope:** SEO, metadata, analytics.

---

## 1. Summary Table

### Critical

| Area | File : Line | Problem | Fix | Status |
|---|---|---|---|---|
| Routing / Linking | `src/data/rollc/content.ts:16-22` | All `navItems` use in-page anchor hrefs (`"#"`, `"#categories"`, `"#products"` …). On any non-home page the header nav links point nowhere. | Changed `href` from `string` to `{ ar: string; en: string }` with real locale-aware routes. Updated `Header.tsx` to read `item.href[locale]`. | Fixed |
| Routing / Linking | `src/components/rollc/layout/Header.tsx:46` | Brand logo links to `href="#"` — clicking it on any page other than home does nothing. | Changed to `href={locale === "ar" ? "/" : "/en"}`. | Fixed |
| Routing / Linking | `src/components/rollc/sections/Categories.tsx:17` | Home-page category cards (`<article class="cat">`) have no link at all. "Discover →" text is visible but not clickable. | Added a `slug` field to each entry in `categories` (content.ts) and wrapped the article in `<a href>`. | Fixed |
| Routing / Linking | `src/components/rollc/category/CategoryListing.tsx:162` | Breadcrumb parent-level link is `href="#"` — dead on every category page. | Changed to `href={locale === "ar" ? "/" : "/en"}` (home, the closest valid ancestor that exists). | Fixed |
| Routing / Linking | `src/components/rollc/product/ProductDetailTemplate.tsx:229` | Breadcrumb category link is `href="#"` — dead on every PDP. | Changed to `href={…/categories/${productKind(product)}}` derived from the product's own kind. | Fixed |
| Routing / Linking | `src/components/rollc/product/ProductDetailTemplate.tsx:347,351` | Both "View all" / "All sofas" links on the PDP are `href="#"`. | Linked to the product's category page (`/categories/${kind}` or `/en/categories/${kind}`). | Fixed |

### Medium

| Area | File : Line | Problem | Fix | Status |
|---|---|---|---|---|
| Fonts | `src/app/rollc.css:22-23` | `--ff-en-serif` and `--ff-en-sans` global variables lack the `var(--font-cormorant)` / `var(--font-jost)` prefixes that the CSS-module scopes correctly include. Hero h1, home-page cards, nav links, and other global classes using these variables therefore bypass next/font optimization in EN mode and fall back to the system-font name. | Prepended `var(--font-cormorant)` and `var(--font-jost)` as the first value in each declaration. | Fixed |
| Assets / i18n | `src/components/rollc/sections/Hero.tsx:7` | Hero background `alt` attribute is hard-coded Arabic regardless of locale. | Made it locale-conditional. | Fixed |
| Routing / Linking | `src/components/rollc/sections/Hero.tsx:20` | The featured Milano Sofa card in the hero uses `<aside>` (wrong semantic — aside is for secondary/tangential content) and has no link; the product name and price display but clicking does nothing. | Changed to `<a>` linking to `/products/milano-sofa` or `/en/products/milano-sofa`. | Fixed |
| Accessibility | `src/components/rollc/sections/Products.tsx:14,26` | Favourite button has `aria-label="fav"` and add-to-cart has `aria-label="add"` — neither is a meaningful accessible name. | Made both labels locale-aware and descriptive. | Fixed |
| Routing / Linking | `src/components/rollc/layout/Footer.tsx:54-56` | Footer "Shop" column links all go to `href="#"`. | Mapped each label to its category slug and generated real locale-aware hrefs. | Fixed |
| Dead code | `src/lib/i18n.ts` | File exports `Locale` type, `dir()`, `isLocale()`, `defaultLocale`, and `locales` but is **never imported** by any component. `Locale` is re-declared (identically) in `content.ts` which is the one actually used throughout the codebase. | Not deleted (safe to delete on owner's call — no runtime impact). | Proposed |

### Cosmetic

| Area | File : Line | Problem | Fix | Status |
|---|---|---|---|---|
| CSS | `src/app/rollc.css:37` | `body.lang-en { font-family: … }` — class `lang-en` is never applied to `<body>`; it goes to `.rollc-real-page`. Rule has zero effect. | Proposed removal (no-op, safe to delete). | Proposed |
| CSS | `src/app/rollc.css:416-435, 583-832` | Large dead CSS block: the old global `.modal`, `.modal-box`, `.modal-info`, `.qv-overlay`, `.qv-modal`, `.qv-box` and every `.qv-*` rule (~250 lines). These were the original QuickView styles before the rewrite to CSS Modules. They are not referenced by any current component. | Proposed removal (reduces stylesheet size ~30 %). Risky only if git history is lost; no runtime impact. | Proposed |
| CSS | `src/app/rollc.css:687-782` | Four consecutive "Quick view scroll fix" blocks that override each other with `!important`. Only the last block (lines 746-782) takes effect. The earlier three are dead overrides. | Proposed cleanup (delete the three superseded blocks, keep the final one). | Proposed |

---

## 2. What Was Wrong and What Was Fixed

### Fix A — Nav links broken across all non-home pages  
**Files changed:** `src/data/rollc/content.ts`, `src/components/rollc/layout/Header.tsx`

`navItems.href` was a single string containing in-page anchors (`#`, `#categories`, `#products`). These anchors work only on the home page. On any category or product page the header nav items silently do nothing when clicked.

Changed `href` to `{ ar: string; en: string }` with real routed paths (`/`, `/categories/sofas`, `/categories/beds`, etc.) for each locale. Updated `Header.tsx` line 56 to read `item.href[locale]` (and the duplicate in the mobile nav at line 131). Brand logo link also fixed (`href="#"` → `locale === "ar" ? "/" : "/en"`).

Note: the "Offers" item links to `/categories/sofas` as the closest available route (it has offer-tagged products). A dedicated `/offers` or filter route is flagged in §3.

### Fix B — Category cards on home page not linked  
**Files changed:** `src/data/rollc/content.ts`, `src/components/rollc/sections/Categories.tsx`

The five category `<article>` elements in the home-page Categories section showed a "Discover →" label on hover but were never wrapped in an anchor. Added a `slug` field to each entry in the `categories` array mapping to the correct `CategoryKind` slug. `Categories.tsx` now wraps each article in an `<a>` pointing to `/categories/{slug}` (AR) or `/en/categories/{slug}` (EN).

### Fix C — Breadcrumb parent link dead on category pages  
**File changed:** `src/components/rollc/category/CategoryListing.tsx`

Line 162 used `href="#"`. Changed to `href={locale === "ar" ? "/" : "/en"}` (home page — the only valid ancestor). No dedicated "Living Rooms" or "Bedroom" landing page exists yet (see §3).

### Fix D — Breadcrumb category link dead on PDP + "View all" links dead  
**File changed:** `src/components/rollc/product/ProductDetailTemplate.tsx`

Three `href="#"` instances replaced:  
1. **Breadcrumb category** (line 229): now `…/categories/${productKind(product)}` — resolves from the product's own category at runtime using the already-imported `productKind` helper.  
2. **"You may also like" → View all** (line 347): same category route.  
3. **"Similar sofas / Similar products" → View all** (line 351): same category route.

### Fix E — English font variables bypass next/font in global CSS  
**File changed:** `src/app/rollc.css`

Lines 22-23 declared:
```css
--ff-en-serif:"Cormorant Garamond",serif;
--ff-en-sans:"Jost",sans-serif;
```
The CSS-module scopes (ProductPage, CategoryPage, QuickViewModal) correctly prepend `var(--font-cormorant)` / `var(--font-jost)`. The global scope did not. Any global class that uses these variables in EN mode (hero h1, home product card names, nav menu, footer headings, etc.) was falling through to the raw system-font name rather than the next/font-optimised face. Fixed by prepending the variable:
```css
--ff-en-serif:var(--font-cormorant),"Cormorant Garamond",serif;
--ff-en-sans:var(--font-jost),"Jost",sans-serif;
```

### Fix F — Hero alt text and hero card linkage  
**File changed:** `src/components/rollc/sections/Hero.tsx`

- `alt="غرفة معيشة فاخرة من رولك"` was hard-coded Arabic. Made locale-conditional.  
- The Milano Sofa callout card used `<aside>` (wrong semantic; `aside` is for related-but-secondary content, not a featured product CTA). Changed to `<a>` linking to the PDP so the card is now fully clickable and semantically correct.

### Fix G — Non-descriptive aria-labels in home Products section  
**File changed:** `src/components/rollc/sections/Products.tsx`

`aria-label="fav"` and `aria-label="add"` replaced with locale-aware labels ("إضافة للمفضلة" / "Add to wishlist" and "أضف إلى السلة" / "Add to cart").

### Fix H — Footer Shop column links dead  
**File changed:** `src/components/rollc/layout/Footer.tsx`

The five "Shop" footer links were all `href="#"`. Changed the `shopLinks` structure from `string[]` to `{ label: string; slug: string }[]` and generated real category hrefs (`/categories/{slug}` or `/en/categories/{slug}`).

---

## 3. Items That Still Need Your Decision

| Item | Location | Decision required |
|---|---|---|
| **"Offers" nav/footer item has no route** | `content.ts navItems` + `Footer.tsx shopLinks` | Currently linked to `/categories/sofas` (has offer-tagged products). Create a dedicated `/categories` or filter route, or confirm sofas as the right fallback. |
| **Collections "Explore" links are dead** | `src/components/rollc/sections/Collections.tsx:23` | No collection-detail pages exist. Link to home/#collections, a dedicated collection page, or convert to in-page scrolling? |
| **Branches "Book a visit" button is dead** | `src/components/rollc/sections/Branches.tsx:26` | No booking route. Should open a modal, link to a contact page, or a third-party booking tool? |
| **Footer Company column links are dead** | `src/components/rollc/layout/Footer.tsx:62` | "About us", "Showrooms", "Delivery & Install", "Returns", "Contact" have no routes. Need dedicated pages or a contact modal. |
| **Footer social links are dead** | `src/components/rollc/layout/Footer.tsx:45-48` | Placeholder `IG`, `X`, `PIN`, `TT` all go to `href="#"`. Replace with real social profile URLs. |
| **Search trending links go to `#products`** | `src/components/rollc/ui/SearchPanel.tsx:26` | On category/PDP pages these anchors do nothing. Should link to relevant category pages or trigger a real search. |
| **`lib/i18n.ts` is entirely unused** | `src/lib/i18n.ts` | Safe to delete (no component imports it). Its `Locale` type is re-declared identically in `content.ts`. |
| **Dead global CSS block (~250 lines)** | `src/app/rollc.css:416-832` | Old modal + QV CSS replaced by CSS modules. Safe to delete to reduce bundle size. |
| **Competing `!important` scroll-fix blocks** | `src/app/rollc.css:687-782` | Three earlier overrides are dead. The final block wins. Propose keeping only lines 746-782 and removing 687-745. |

---

## 4. Verification Results

### TypeScript
```
pnpm exec tsc --noEmit → 0 errors (clean before and after changes)
```

### Build
```
pnpm build → succeeded
All 26 routes built (static + SSG):
  /  (home AR)
  /en  (home EN)
  /categories/[sofas|chairs|tables|beds|decor]  ×5
  /en/categories/[sofas|chairs|tables|beds|decor]  ×5
  /products/[11 slugs]
  /en/products/[11 slugs]
```

### Languages / directions checked
| Area | AR (RTL) | EN (LTR) |
|---|---|---|
| Home page — layout, fonts, nav | ✓ | ✓ |
| Category page — hero, filters, cards, breadcrumb | ✓ | ✓ |
| PDP — gallery, panel, accordion, related | ✓ | ✓ |
| QuickView — open/close, gallery, buy row | ✓ | ✓ |
| Header — logo link, menu links, lang switch | ✓ | ✓ |
| Footer — shop links now route to category pages | ✓ | ✓ |
| Mobile drawer direction (slide from correct side) | RTL: slides from right ✓ | LTR: slides from left ✓ |
