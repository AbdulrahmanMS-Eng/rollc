# Rollc Audit – Round 2

Date: 2026-06-16

---

## Task 1 — Language toggle context preservation

**Status: Fixed**

`goLang` in `src/components/rollc/layout/Header.tsx` previously hard-navigated to `/` or `/en`
regardless of where the user was. Now it uses `usePathname()` from `next/navigation` to
transform the current path in place:

```ts
import { usePathname } from "next/navigation";

const pathname = usePathname();

const goLang = (nextLocale: Locale) => {
  const isEn = pathname.startsWith("/en");
  const arPath = isEn ? pathname.slice(3) || "/" : pathname;
  window.location.href = nextLocale === "ar" ? arPath : `/en${arPath === "/" ? "" : arPath}`;
};
```

Mapping verified for all route shapes:

| From                        | Switch to | Result                     |
|-----------------------------|-----------|----------------------------|
| `/` (AR home)               | EN        | `/en`                      |
| `/en` (EN home)             | AR        | `/`                        |
| `/categories/sofas`         | EN        | `/en/categories/sofas`     |
| `/en/categories/beds`       | AR        | `/categories/beds`         |
| `/products/milano-sofa`     | EN        | `/en/products/milano-sofa` |
| `/en/products/oslo-chair`   | AR        | `/products/oslo-chair`     |

---

## Task 2 — Global font variable prefix verification

**Status: Already correct — no changes made**

All four variables in `src/app/rollc.css` already included the `var(--font-*)` next/font
prefix as first value (fixed in Round 1):

```css
--ff-ar-display: var(--font-el-messiri), "El Messiri", serif;
--ff-ar-body:    var(--font-tajawal), "Tajawal", sans-serif;
--ff-en-serif:   var(--font-cormorant), "Cormorant Garamond", serif;
--ff-en-sans:    var(--font-jost), "Jost", sans-serif;
```

---

## Task 3 — Dead-code cleanup

### 3a — Grep verification before deletion

Grepped the entire `src/` tree before touching any CSS:

| Selector / file     | TSX/JSX references | Decision           |
|---------------------|--------------------|--------------------|
| `.overlay`          | `SearchPanel.tsx:29` (global class `overlay open`) | **Preserved**      |
| `.toast`            | `Toast.tsx:7` (global classes `toast`, `show`, `tdot`) | **Preserved**      |
| `.modal` / `.modal-box` / `.modal-img` / `.modal-info` / `.modal-close` / `.m-opts` / `.swatches` / `.swatch` | 0 | **Removed**        |
| `.qv-*` all classes | 0 (QuickViewModal uses `styles.*` CSS modules exclusively) | **Removed**        |

### 3b — Dead CSS removed from `src/app/rollc.css`

**Old modal block (former lines 416–434)** — 19 rules:
`.modal`, `.modal.open`, `.modal-box`, `.modal.open .modal-box`, `.modal-img`,
`.modal-img img`, `.modal-info`, `.modal-close`, `.modal-close:hover`,
`.modal-info .m-cat`, `.modal-info h3`, `.lang-en .modal-info h3`,
`.modal-info .m-price`, `.modal-info .m-desc`, `.m-opts`, `.m-opts .lbl`,
`.swatches`, `.swatch`, `.swatch.sel`

**Dead responsive rules** inside `@media(max-width:920px)`:
`.modal-box` and `.modal-img` overrides — removed.

**All global qv-\* CSS (~250 lines)** — the entire "Real luxury quick view modal"
section plus three scroll-fix patch blocks plus two qv-dimensions blocks:
`.qv-overlay`, `.qv-modal`, `.qv-box`, `.qv-close`, `.qv-gallery`, `.qv-main`,
`.qv-badge`, `.qv-heart`, `.qv-zoom`, `.qv-thumbs`, `.qv-thumb`, `.qv-info`,
`.qv-cat`, `.qv-title`, `.qv-alt`, `.qv-rating`, `.qv-stars`, `.qv-price`,
`.qv-now`, `.qv-old`, `.qv-offer`, `.qv-desc`, `.qv-opt`, `.qv-opt-head`,
`.qv-colors`, `.qv-color`, `.qv-dot`, `.qv-sizes`, `.qv-size`, `.qv-buy`,
`.qv-qty`, `.qv-cart`, `.qv-consult`, `.qv-meta`, `.qv-ico`, `.qv-stock`,
`.qv-specs`, `.qv-spec`, `.qv-payline`, `.qv-dimensions` — and all their
responsive variants and `!important` overrides.

`QuickViewModal.tsx` was verified to import `./QuickViewModal.module.css` and
reference only `styles.*` properties — zero reliance on the removed globals.

### 3c — `src/lib/i18n.ts` deleted

Confirmed zero `import … from "@/lib/i18n"` or `from "…/lib/i18n"` references
across the entire `src/` tree before deletion. The `Locale` type and helpers this
file re-exported are unused; the canonical `Locale` type lives in
`src/data/rollc/content.ts` and is imported directly by all components.

### 3d — Unused imports

No unused imports were introduced. `Header.tsx` gained `usePathname` which is
actively consumed.

---

## Post-change verification

```
pnpm exec tsc --noEmit  →  0 errors
pnpm build              →  succeeded, all routes pre-rendered
```

All AR and EN routes (`/`, `/en`, `/categories/*`, `/en/categories/*`,
`/products/*`, `/en/products/*`) present in the build output.
