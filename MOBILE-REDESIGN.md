# Rollc — Mobile Redesign Pass

Mobile-only redesign of the Rollc / رولك home page. **Desktop (≥1024px) is out of scope and verified pixel-identical.** All changes are scoped to mobile media queries (`max-width: 620px` / `390px`) or to behavior that is inert above 620px.

---

## 0. ROLLBACK — restore point (created BEFORE any edit)

The working tree was clean at the start, so the snapshot is the existing commit `096e23a`, captured under a tag and a physical file backup.

- **Git tag:** `pre-mobile-redesign` → commit `096e23a`
- **Restore everything from the tag:**
  ```bash
  git checkout pre-mobile-redesign -- .
  ```
- **Or hard-reset the branch to the snapshot:**
  ```bash
  git reset --hard pre-mobile-redesign
  ```
- **Physical file backup of every modified file** (paths preserved):
  ```
  .rollback/pre-mobile-redesign/src/app/rollc.css
  .rollback/pre-mobile-redesign/src/components/rollc/sections/Signature.tsx
  .rollback/pre-mobile-redesign/src/components/rollc/sections/Categories.tsx
  ```
  Restore a single file by copying it back, e.g.:
  ```bash
  cp .rollback/pre-mobile-redesign/src/app/rollc.css src/app/rollc.css
  ```
  The new files added in this pass (`PillarsRail.tsx`, `CategoryRail.tsx`, `useMobileRail.ts`) are untracked; deleting them + restoring the three files above fully reverts the pass.

> `.rollback/` also contains the Playwright verification scripts used below (`verify-mobile.mjs`).

---

## 1. Files changed

### New files
| File | Lines | Purpose |
|---|---|---|
| `src/components/rollc/ui/useMobileRail.ts` | 138 | Client hook driving the mobile rails: matchMedia gating, RTL-aware auto-scroll, swipe-pause, reduced-motion. |
| `src/components/rollc/sections/PillarsRail.tsx` | 101 | Client component for the "Why Rollc" feature strip (marquee + clones). |
| `src/components/rollc/sections/CategoryRail.tsx` | 31 | Client component for the "Shop by space" category cards (snap rail + gentle auto-advance). |

### Edited files
| File:line | Change |
|---|---|
| `src/components/rollc/sections/Signature.tsx:3,38` | Pillars data/markup moved into `PillarsRail`; `<div className="pillars">…</div>` replaced by `<PillarsRail locale={locale} />`. Markup emitted is byte-identical on desktop. |
| `src/components/rollc/sections/Categories.tsx:3,16-18` | `.cat-grid` rendering moved into `CategoryRail`, wrapped in a transparent `<Reveal>` to preserve the existing scroll-in fade. |
| `src/app/rollc.css:708` | `.sig-text { min-width: 0 }` (mobile only) — fixes a CSS-grid blowout so the pillars rail scrolls internally instead of stretching the track. |
| `src/app/rollc.css:677-773` | New mobile-only block: `.m-rail` mechanics, `.pillars.m-rail` marquee, `.cat-grid.m-rail` snap cards, and general polish. All inside `@media (max-width: 620px)` / `@media (max-width: 390px)`. |

No desktop CSS rule was modified; only new selectors gated to ≤620px were added.

---

## 2. How the carousels work

Shared engine: `useMobileRail.ts`. It returns a `ref` for the rail element and only activates when `matchMedia("(max-width: 620px)")` matches. Above 620px the element keeps its original CSS grid (`.pillars` / `.cat-grid`) untouched — the hook writes nothing because there is no horizontal overflow on a grid.

### Mobile change 1 — "Why Rollc" feature strip → auto-scrolling marquee
File: `PillarsRail.tsx` + `.pillars.m-rail` (rollc.css:709).
- **Layout:** the four pillars become a single horizontal `flex` row (`overflow-x: auto`), each `min(60vw, 230px)` wide, so ~1.5 cards show with a peek. Their original gold hairline top is kept for brand continuity.
- **Auto-scroll:** a `requestAnimationFrame` loop advances the rail ~0.42px/frame (~25px/s — a slow, premium drift). A **duplicate set of pillars is rendered only on mobile while motion is allowed**, so half the `scrollWidth` is exactly one set; wrapping by one set width is a pixel-identical jump → **seamless infinite loop**.
- **Sub-pixel fix:** `scrollLeft`'s getter rounds to an integer, which would swallow fractional steps. The hook keeps the position in a JS float and only ever *writes* `scrollLeft`, so slow motion is smooth.
- **Swipe:** it is a native scroller, so finger-drag works directly. `pointerdown`/`touchstart`/`wheel` pause the auto-scroll for 2.6s, then it resumes and re-syncs from where the user left it.
- **Reduced motion:** when `prefers-reduced-motion: reduce`, the hook stays inactive → **no auto-scroll and no clones**, just a manual swipeable row (verified, see §4).

### Mobile change 2 — "Shop by space" categories → swipeable snap cards
File: `CategoryRail.tsx` + `.cat-grid.m-rail` (rollc.css:729).
- **Layout:** the five category cards become a horizontal `scroll-snap` row, each `flex: 0 0 82%` (84% < 390px) and 340px tall, so the next card **peeks** to signal scrollability. Index (01/02…), title, subtitle and "اكتشف ← / Discover ←" are preserved; the CTA is shown by default since there is no hover on touch. Each card keeps its real route (`/categories/{slug}` or `/en/categories/{slug}`).
- **Manual first:** `scroll-snap-type: x mandatory` with `scroll-padding-inline: 20px` gives crisp, swipe-driven snapping as the primary interaction.
- **Secondary auto-advance:** a gentle `setInterval` (4.6s) steps one card via `scrollBy({behavior:'smooth'})`, looping back to the start at the end. It pauses on touch (2.6s) and is fully disabled under reduced motion. No clones are used here (manual is primary).

### RTL correctness
The scroll direction sign is derived from `getComputedStyle(el).direction`. In AR/RTL the rails advance the natural right-to-left direction (`scrollLeft` goes negative); in EN/LTR they advance left-to-right (positive). Verified in §4.

### No page overflow
The page scroller `.scroll-shell` has `overflow-x: hidden`; each rail keeps its own `overflow-x: auto` with `overscroll-behavior-x: contain`. Document and shell `scrollWidth` equal the viewport at 360px and 390px (verified §4).

---

## 3. Before / after (mobile)

| Section | Before | After |
|---|---|---|
| Why Rollc pillars | 4 blocks stacked vertically (1 column) → tall, lots of scrolling. | Single horizontal row, gentle auto-marquee + swipe; far less vertical height, feels alive and premium. |
| Shop by space | 5 category cards stacked in a tall vertical column (240px each). | Horizontal snap rail, 82%-width cards with a peek of the next; swipe + subtle auto-advance. |
| Language switch tap target | 34px (≤390px: 30px) — below 44px. | 42px (≤390px: 38px) — comfortable thumb target. |
| Section "كل الفئات / All categories" link | inline, small hit area. | `min-height: 44px`, vertically centered. |
| Category CTA on touch | hidden until hover (never shown on mobile). | revealed by default in the rail. |

General mobile audit (360 / 390 / 768, AR-RTL + EN-LTR): headings use `clamp()` and already scale down well; the existing mobile eyebrow + section-order fixes hold. The clear low-risk wins above were applied; no cramped overflow or broken line-breaks were found beyond them.

---

## 4. Verification

**Type + build**
- `pnpm exec tsc --noEmit` → **0 errors**.
- `pnpm build` → **succeeds**, 37 routes generated.

**Desktop unchanged — pixel diff (the important one)**
Built the `pre-mobile-redesign` snapshot and the new tree, screenshotted the two touched sections at **1280px** with animations frozen and the (non-deterministic) shopping-assistant overlay hidden, then compared with ImageMagick `compare -metric AE` (count of differing pixels):

| Section | AR | EN |
|---|---|---|
| `.signature` | **0** | **0** |
| `.cats` | **0** | **0** |

→ Desktop renders **pixel-identical** to before. (An initial diff on `.cats` AR was traced entirely to the fixed-position assistant greeting bubble overlapping the capture box — not the categories — and disappears once the assistant is hidden.)

**Mobile behavior — Playwright (`.rollback/verify-mobile.mjs`), 16/16 checks pass:**
- AR @360 & EN @390: pillars is a horizontal flex rail; marquee auto-scrolls (AR → negative/RTL, EN → positive/LTR).
- Pillars render 8 children on mobile (4 + 4 clones) for the seamless loop; categories render exactly 5 (no clones).
- No page-level horizontal overflow at 360px or 390px (`docScrollW == innerW`, `shellScrollW == shellClientW`).
- `prefers-reduced-motion: reduce`: still a flex rail, **no clones, auto-scroll disabled**.
- Desktop @1280: both rails are `display: grid` with exactly the original item counts and **no auto-scroll**.

---

## 5. Desktop — IDEAS ONLY (NOT implemented)

1. **Pillars: animated hairline-on-scroll reveal.** Stagger the four gold top-rules drawing left-to-right as the section enters view (CSS `@property` width animation). Adds a refined editorial beat without touching layout.
2. **Category hero card parallax.** A subtle (~6px) image parallax / slower `object-position` shift on the large first card during scroll would add depth to the grid while staying calm and luxurious.
3. **Sticky section index.** A faint vertical "01 — Spaces / 02 — Craft" index in the wrap gutter that updates as sections pass, reinforcing the magazine feel on wide screens.

These are proposals for a separate, approved pass — no desktop rendering was changed here.

---

## 6. Needs your decision

- **Category auto-advance on/off.** I enabled a *gentle* 4.6s auto-advance (pauses on touch, off under reduced-motion) as the spec allowed it as "secondary." If you'd prefer **manual-swipe only** for the categories, remove the `mode/intervalMs` in `CategoryRail.tsx` (or set `mode: "advance"` → a no-op). Tell me which you prefer.
- **Marquee speed / card width** for the pillars (currently ~25px/s, `min(60vw,230px)`) — easy to tune if you want it slower/faster or larger cards.
