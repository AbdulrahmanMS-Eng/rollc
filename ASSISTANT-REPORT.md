# Rollc — Shopping Assistant Report

Date: 2026-06-16

---

## Files added

| File | Role |
|---|---|
| `src/components/rollc/assistant/assistantEngine.ts` | Single async boundary — all AI/answer logic lives here |
| `src/components/rollc/assistant/Assistant.tsx` | Presentation-only React component |
| `src/components/rollc/assistant/Assistant.module.css` | Scoped styles — no global leakage |

### Files modified

| File | Change |
|---|---|
| `src/components/rollc/RollcHomePage.tsx` | Import + mount `<ShoppingAssistant page="home" />` |
| `src/components/rollc/category/CategoryPage.tsx` | Import + mount `<ShoppingAssistant page="category" category={kind} />` |
| `src/components/rollc/product/ProductPage.tsx` | Import + mount `<ShoppingAssistant page="product" product={product} />` |
| `src/components/rollc/ui/QuickViewModal.module.css` | Fixed scroll: `max-height: calc(100dvh - 80px)` on `.box` and `.details` |

---

## getAssistantReply contract

```ts
export async function getAssistantReply(ctx: AssistantContext): Promise<AssistantReply>
```

### Input type

```ts
type AssistantContext = {
  locale:      Locale;                          // "ar" | "en"
  page:        "home" | "category" | "product";
  category?:   CategoryKind;                    // active category slug
  product?:    Product;                         // active product (PDP or QuickView)
  userMessage?: string;                         // undefined = initial greeting
                                                // "q:delivery-install" etc = chip tap
                                                // any other string = free text
};
```

### Output type

```ts
type AssistantReply = {
  text:          { ar: string; en: string } | string;  // localized body
  suggestions?:  QuickQuestion[];     // tappable chips for next message
  productLinks?: ProductLink[];       // small product cards
  askEmail?:     boolean;             // show inline email capture below this message
  showContact?:  boolean;             // show phone + email block
};
```

### How to plug in Gemini (one-function change)

Replace **only the body** of `getAssistantReply()` in `assistantEngine.ts`:

```ts
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY! });

export async function getAssistantReply(ctx: AssistantContext): Promise<AssistantReply> {
  const systemInstruction = `
    You are a polite bilingual (Arabic / English) showroom assistant for Rollc,
    a luxury furniture brand. Answer ONLY furniture and store questions.
    If the user goes off-topic, redirect them politely.
    Always respond in the same language as the user's message.
    Return JSON matching AssistantReply. Include suggestions as QuickQuestion[].
  `;

  const userPrompt = buildGeminiPrompt(ctx); // serialize ctx fields as needed

  const res = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: userPrompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
    },
  });

  // Parse the JSON response into AssistantReply
  return JSON.parse(res.text ?? "{}") as AssistantReply;
}
```

Nothing else in the codebase changes — the React component calls
`getAssistantReply()` only and is agnostic to whether the body is mock or Gemini.

---

## Context-detection logic

### Home page

An `IntersectionObserver` watches the `.hero` section.
When the hero is **no longer intersecting** the viewport (user has scrolled past it),
`triggerGreeting(autoOpen: true)` fires exactly once per session.

**Section-aware prompts (Round 4 addition):**
Three additional `IntersectionObserver` instances watch `#categories`, `#products`,
and `#branches`. When each enters the viewport at ≥25% visibility, a context message
is added to the chat (once per section per session). These messages appear as badge
notifications if the panel is closed. Guards: `rollc-ast-dismissed` prevents any
section message once the user has closed the panel.

### Category page

A `setTimeout` of 1200 ms fires on mount, then calls `triggerGreeting(autoOpen: true)`.
Category name is now pulled from `getCategoryMeta(category).title` — which returns
the correct localized title for all categories including chairs.

### Product detail page (PDP)

Same 1200 ms mount delay. Greeting: *"اختيار رائع ✦ هل تود معرفة تفاصيل أكثر عن {product}؟"* /
*"Beautiful choice ✦ Would you like to know more about {product.name.en}?"*.

### Quick View modal

A `useEffect` watches `selectedProduct` from `useRollcStore`.

**Round 4 (second pass) behavior — CORRECT:**
1. When QV opens: the **launcher stays fully visible** with the product's thumbnail image
   (`.launcherQvActive` CSS class — gold ring border, circular crop). Only the panel closes.
2. A product greeting is fetched in the background (once per product per session, guarded
   by `rollc-ast-qv-{product.id}` in sessionStorage). `pendingAutoOpenRef.current = true`
   is set immediately so the launcher click is responsive even before the fetch resolves.
3. **Clicking the launcher while QV is open** calls `closeQuickView()` from the store,
   which sets `selectedProduct = null` → the QV close effect fires → panel auto-opens.
4. When QV closes: `pendingAutoOpenRef.current` triggers panel open + chime
   (unless `rollc-ast-dismissed`). The product greeting is already in the message list.
5. **After QV closes**, chip answers still use the last QV product as context
   (`activeProduct = selectedProduct ?? product ?? lastQvProductRef.current`).
6. Panel header shows the product thumbnail and name even after QV closes
   (`displayProduct = selectedProduct ?? lastQvProductRef.current ?? product`).

### Session guards (sessionStorage keys)

| Key | Meaning |
|---|---|
| `rollc-ast-qv-{id}` | QV greeting sent for this product (guards duplicate fetch) |
| `rollc-ast-section-categories` | Categories section prompt sent |
| `rollc-ast-section-products` | Products section prompt sent |
| `rollc-ast-section-branches` | Branches section prompt sent |
| `rollc-ast-dismissed` | User closed the panel — don't auto-open or add section prompts |
| `rollc-ast-muted` | Mute preference (0/1) — persisted across page navigations |

**Note (Round 4 second pass):** The greeting keys `rollc-ast-greeted-*` were removed.
`triggerGreeting` now uses only a component-lifetime ref (`greetedRef.current`) as the guard,
so the greeting fires fresh on every page mount (including after browser refresh).
This fixes the bug where stale sessionStorage blocked the greeting permanently after the first visit.

---

## Canned-answer map (Round 4 — 6 premium product chips)

| Intent / chip ID | Label (AR · EN) | Reply includes |
|---|---|---|
| `q:delivery-install` | التوصيل والتركيب · Delivery & installation | Text: 5–10 day delivery + free install. Chips: delivery-time / consultant. |
| `q:custom-size` | تفصيل بمقاس خاص · Custom size | Text: custom sizing available. If product in context: lists exact dimensions. `askEmail: true`. |
| `q:colors` | الألوان المتوفرة · Available colors | Text: lists all colors from `productColors`. Product cards (3 picks). Chips: matching-set / consultant. |
| `q:matching-set` | طقم مناسب معه · Matching set | Text: same-family pieces. Product cards from same category via `productKind()`. |
| `q:delivery-time` | مدة وصول الطلب · Delivery time | Text: 5–10 days, city-specific detail (Riyadh/Jeddah/Dammam = ~5 days). |
| `q:consultant` | تواصل مع المستشار · Talk to a consultant | `showContact: true`, `askEmail: true`. Phone + email links. |
| `q:budget` | ما الميزانية المناسبة؟ · What's my budget? | Text: price range 890–7,200 SAR. Best-seller product cards. |
| `q:bestseller` | الأكثر مبيعاً · Best sellers | Best-seller product cards (tag includes "best" or has old price). |
| greeting | مرحبا · hello · hi · hey | Context-aware welcome, page-appropriate chips. |
| warranty | ضمان · إرجاع · warranty · return | 2-year warranty text, 14-day return policy. |
| buy | شراء · اطلب · buy · order | `showContact: true`, `askEmail: true`. Phone + email links. |
| general | أريكة · sofa · furniture etc. | Soft redirect to chip bank. |
| off-topic | anything else | *"أنا هنا لمساعدتك في أثاث رولك فقط ✦"* — never answers off-topic. |

Old chip IDs (`q:delivery`, `q:size`, `q:color`, `q:set`, `q:contact`) remain mapped
as aliases to the same handlers for backwards compatibility.

---

## How to extend questions and answers

1. **Add a chip** — append to `PRODUCT_CHIPS`, `CATEGORY_CHIPS`, or `HOME_CHIPS` in `assistantEngine.ts`. Chip IDs must start with `"q:"`.
2. **Add a handler** — write a `reply*()` function returning `AssistantReply`, then add a `case` in `handleQuickQuestion()` and `handleFreeText()`.
3. **Add an intent** — add regex patterns to `detectIntent()` and a case in `handleFreeText()`.
4. **Add product data** — all product cards come from `content.ts`; add products there and they appear automatically in search results, `sameCategoryLinks()`, and `bestSellersLinks()`.

---

## Data sources reused (no duplication)

| Helper / data | Import from |
|---|---|
| `products`, `Product`, `Locale`, `currency` | `@/data/rollc/content` |
| `productKind`, `productColors`, `productDimensions`, `thumb` | `@/components/rollc/product/productPageData` |
| `getCategoryMeta`, `CategoryKind` | `@/components/rollc/category/categoryPageData` |
| `useRollcStore` (locale, selectedProduct) | `@/components/rollc/ui/RollcStore` |

Product links in chat always use `thumb()` for the 300 px image and point to real
`/products/{id}` (AR) or `/en/products/{id}` (EN) routes.

Category labels in greetings come from `getCategoryMeta(kind).title` — no hardcoded map.

---

## Email capture

- Shown below the last assistant message when `reply.askEmail === true`.
- Validates `/^[^@\s]+@[^@\s]+\.[^@\s]+$/` before accepting.
- On success: logs to `console.log("[Rollc Assistant] email captured:", val)` and
  sends a confirmation message in the chat.
- `emailSubmitted` is a boolean in component state; resets on mount (one per session).
- **No backend call** — wire up by replacing the `console.log` line with a `fetch`
  to your CRM / email service.

---

## Contact block

Rendered when `reply.showContact === true`:

- Phone: [+966 55 205 5514](tel:+966552055514)
- Email: [customerservice@rollcksa.com](mailto:customerservice@rollcksa.com)

---

## Web Audio notification

`playNotif(muted)` plays an ascending three-note chime (C5 → E5 → G5, ~0.7 s, max gain 0.06).

**Browser autoplay handling (Round 4 second pass):**
- Module-level `_audioUnlocked` flag, initialized to `false`.
- Three `addEventListener` listeners registered on mount: `pointerdown`, `keydown`,
  **`touchstart`** (added in second pass for iOS Safari). Each is `{ once: true, passive: true }`.
- `playNotif()` short-circuits if `_audioUnlocked` is false — no sound until first interaction.
- Mute preference persisted to `sessionStorage` (`rollc-ast-muted`) so it survives
  page navigation within a session.
- `window.matchMedia("(prefers-reduced-motion: reduce)")` check still applies.

---

## z-index hierarchy

| Layer | z-index |
|---|---|
| Header | 60 |
| Search / QV overlay | 90 |
| Quick View modal | 100 |
| Toast | 120 |
| **Assistant panel** | **159** (hidden via CSS while QV is open — not aria-hidden) |
| **Assistant launcher** | **160** (always visible, sits above QV modal) |

When `selectedProduct !== null`:
- The launcher shows the product thumbnail with a gold ring (`.launcherQvActive`)
- The panel is closed (`open = false`) and doesn't render `.panelOpen`
- `panel aria-hidden` is set to `true` when `!open || qvOpen`
- No `aria-hidden` on the launcher — it remains interactive and focusable

---

## Accessibility

| Feature | Implementation |
|---|---|
| Launcher `aria-label` | Changes between "افتح" / "إغلاق" with `aria-expanded` |
| Launcher `aria-hidden` / `tabIndex={-1}` | Applied when QV is open (Round 4) |
| Chat panel `role="dialog"` | `aria-label`, `aria-hidden={!open || qvOpen}` |
| Chips `role="list"` / `role="listitem"` | Screen reader enumerable |
| Close / mute `aria-label` | Locale-aware labels |
| Email error `role="alert"` | Announced on validation failure |
| Esc key | Closes panel, sets dismissed flag |
| `focus-visible` | Gold outline on launcher, chips, icon buttons, input |
| Typing indicator `aria-label` | "يكتب…" / "Typing…" |

---

## Responsiveness

| Breakpoint | Behaviour |
|---|---|
| > 640 px (desktop) | Fixed 368 px panel, bottom-right corner. Slides up/scales in. |
| ≤ 640 px (mobile) | Full-width bottom sheet. `border-radius: 20px 20px 0 0`. `max-height: 72vh`. |
| RTL (Arabic) | `inset-inline-end` positions launcher at the left edge. Bubbles, chips, cards, arrows all use logical CSS properties and flip correctly. |
| LTR (English) | Launcher at the right edge. Arrow on product cards translates `+2 px`. |
| Reduced motion | Transitions removed, badge static, typing dots static. |

---

## Quick View modal scroll fix (Round 4 second pass)

**Root cause:** `.gMain { aspect-ratio: 4/4.4 }` forced the gallery column taller than the
viewport on any screen shorter than ~900 px. The gallery had no `overflow: hidden`, so the
grid row grew to match, pushing thumbnails below the viewport clip even though `.box` had
`max-height: calc(100dvh - 80px)`.

**Fix:**
- Removed `aspect-ratio: 4/4.4` from desktop `.gMain` — `flex: 1` fills available height dynamically.
- Added `overflow: hidden; max-height: calc(100dvh - 80px)` to `.gallery` — prevents the gallery
  from forcing the grid row taller than the box clip boundary. Thumbnails always remain visible
  at the bottom of the gallery column.
- `.details { max-height: calc(100dvh - 80px) }` — right column scrolls independently.
- Mobile (`≤860px`): gallery resets to `max-height: none; overflow: visible` and `.box` scrolls
  natively. `.gMain` restores `aspect-ratio: 4/3.6` for the stacked single-column layout.

---

## Verification results (Round 4 second pass)

```
pnpm exec tsc --noEmit  →  0 errors
pnpm build              →  succeeded
                           37 routes pre-rendered (all AR + EN pages)
```

### What was wrong in Round 4 first pass (now fixed)

| Bug | Root cause | Fix |
|---|---|---|
| PDP/category greeting never fired after refresh | `ssGet(contextKey)` persisted across refreshes | Removed ssGet/ssSet guard; use only component-lifetime `greetedRef` |
| Assistant disappeared while QV was open | `setOpen(false)` + `.launcherQvHidden` (opacity:0) hid launcher entirely | Launcher stays visible with product thumbnail (`.launcherQvActive`); only panel closes |
| QV gallery thumbnails clipped off screen | `aspect-ratio: 4/4.4` on `.gMain` forced row taller than viewport | Removed aspect-ratio; added `overflow:hidden + max-height` on `.gallery` |
| Category/nav labels wrong ("Living Rooms", "Office") | `content.ts`, `Footer.tsx`, `categoryPageData.ts` never updated | Fixed sofas → "الأرائك/Sofas", chairs → "الكراسي/Chairs" across all three files |
| Mute preference reset on page navigation | `muted` state initialized to `false` | Now initialized from `sessionStorage` and synced back on change |
| Audio never played on touch devices | Only `pointerdown/keydown` unlock listeners | Added `touchstart` listener to `initAudioUnlock()` |

### Category routing corrections (Round 4 second pass)

| File | Old | New |
|---|---|---|
| `content.ts` navItems[1] | "غرف المعيشة" / "Living" | "الأرائك" / "Sofas" |
| `content.ts` navItems[5] | href sofas, label "العروض" / "Offers" | href chairs, label "الكراسي" / "Chairs" |
| `content.ts` categories[0] | title "غرف المعيشة" / "Living Rooms" | title "الأرائك" / "Sofas" |
| `content.ts` categories[3] | title "أثاث المكاتب" / "Office" | title "الكراسي" / "Chairs" |
| `Footer.tsx` shopLinks ar[0] | "غرف المعيشة" | "الأرائك" |
| `Footer.tsx` shopLinks en[0] | "Living Rooms" | "Sofas" |
| `categoryPageData.ts` sofas.parentCrumb | "غرف المعيشة" / "Living" | "الرئيسية" / "Home" |
| `categoryPageData.ts` chairs.parentCrumb | "غرف المعيشة" / "Living" | "الرئيسية" / "Home" |

---

## Decisions / items needing owner input

1. **Backend email storage** — currently `console.log` only. Replace the one line in `handleEmailSend()` with a `fetch` to your CRM, Mailchimp, or a Next.js Route Handler.
2. **Gemini API key** — set `NEXT_PUBLIC_GEMINI_KEY` in `.env.local` when swapping in the real LLM.
3. **Proactive auto-open aggressiveness** — currently the panel auto-opens once per context per session. If the brand prefers a softer approach (launcher pulse only, no auto-open), change `triggerGreeting(true)` to `triggerGreeting(false)` in the trigger effects.
4. **Sound default** — currently unmuted. Change `useState(false)` to `useState(true)` in the `muted` state initializer to default to muted.
5. **Category product filtering** — `replyBestSellers()` returns global best-sellers regardless of category. For a stricter UX, filter by `productKind(p) === category` inside `bestSellersLinks()` when `category` is in context.
