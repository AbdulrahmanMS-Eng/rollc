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
                                                // "q:delivery" etc = chip tap
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

### Category page

A `setTimeout` of 1200 ms fires on mount to give the page time to render,
then calls `triggerGreeting(autoOpen: true)`.

### Product detail page (PDP)

Same 1200 ms mount delay, but `product` prop is passed to the engine so the
greeting is product-aware: *"اختيار جميل ✦ هل تود معرفة المزيد عن {product}؟"*

### Quick View modal

A `useEffect` watches `selectedProduct` from `useRollcStore`. Whenever a **different**
product opens in the modal (tracked by `prevQvRef`), a new product greeting is
added to the chat. If the panel is already open the greeting appears immediately;
if closed, the launcher pulsing badge (`hasPending`) lights up.

### Session guards (sessionStorage keys)

| Key | Meaning |
|---|---|
| `rollc-ast-greeted-home` | Home greeting was already sent this session |
| `rollc-ast-greeted-category-{slug}` | Category greeting sent for this slug |
| `rollc-ast-greeted-product-{id}` | PDP greeting sent for this product |
| `rollc-ast-dismissed` | User closed the panel — don't auto-open again |

The panel can always be **manually re-opened** via the launcher button; the dismissed
flag only prevents further *auto-opens*.

---

## Canned-answer map

| Intent / chip | Trigger keywords (AR + EN) | Reply includes |
|---|---|---|
| `q:delivery` | توصيل · تسليم · تركيب · delivery · shipping · install | Text: 5–10 day delivery + free install. Chips: set / contact. |
| `q:size` | مقاس · أبعاد · تفصيل · size · dimension · custom | Text: custom sizing available. If product in context: lists exact dimensions via `productDimensions()`. `askEmail: true`. |
| `q:color` | لون · ألوان · color + named colors | Text: lists all 4 colors from `productColors`. Product cards (3 picks). Chips: set / contact. |
| `q:set` | طقم · مجموعة · set · matching | Text: same-family pieces. Product cards from same category via `productKind()`. Chips: delivery / contact. |
| `q:budget` | سعر · ميزانية · price · budget · how much | Text: price range 890–7,200 SAR. Best-seller product cards. |
| `q:bestseller` | مبيعاً · popular · bestsell | Best-seller product cards (tag includes "best" or has old price). |
| `q:contact` | تواصل · contact | `showContact: true`, `askEmail: true`. Phone + email links. |
| greeting | مرحبا · hello · hi · hey | Context-aware welcome, page-appropriate chips. |
| warranty | ضمان · إرجاع · warranty · return | 2-year warranty text, 14-day return policy. |
| buy | شراء · اطلب · buy · order | `showContact: true`, `askEmail: true`. |
| general | أريكة · sofa · furniture etc. | Soft redirect to chip bank. |
| off-topic | anything else | *"أنا هنا لمساعدتك في أثاث رولك فقط ✦"* — never answers off-topic. |

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
| `CategoryKind` | `@/components/rollc/category/categoryPageData` |
| `useRollcStore` (locale, selectedProduct) | `@/components/rollc/ui/RollcStore` |

Product links in chat always use `thumb()` for the 300 px image and point to real
`/products/{id}` (AR) or `/en/products/{id}` (EN) routes.

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

`playNotif(muted)` is called when the assistant auto-opens with a proactive greeting.

- Uses Web Audio API — no external dependency.
- Plays a short, gentle two-tone chime (~0.6 s, max gain 0.065 — quiet by design).
- Checks `window.matchMedia("(prefers-reduced-motion: reduce)")` — if true, skips.
- Mute toggle in the chat header persists for the component lifetime.
- Default: **unmuted**. Change by setting `const [muted, setMuted] = useState(true)`.

---

## Accessibility

| Feature | Implementation |
|---|---|
| Launcher `aria-label` | Changes between "افتح" / "إغلاق" with `aria-expanded` |
| Chat panel `role="dialog"` | `aria-label`, `aria-hidden={!open}` |
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
| ≤ 640 px (mobile) | Full-width bottom sheet. `border-radius: 20px 20px 0 0`. `max-height: 72 vh`. |
| RTL (Arabic) | `inset-inline-end` positions launcher at the left edge. Bubbles, chips, cards, arrows all use logical CSS properties and flip correctly. |
| LTR (English) | Launcher at the right edge. Arrow on product cards translates `+2 px`. |
| Reduced motion | Transitions removed, badge static, typing dots static. |

---

## Verification results

```
pnpm exec tsc --noEmit  →  0 errors
pnpm build              →  succeeded
                           37 routes pre-rendered (all AR + EN pages)
```

Manual checks performed:
- AR home: launcher appears, hero scroll triggers greeting, chips work, color answer shows product cards.
- EN home: English greeting, EN chips, EN product card names/prices.
- AR category `/categories/sofas`: category-aware greeting on mount, budget/bestseller chips return correct data.
- EN PDP `/en/products/milano-sofa`: product thumbnail in header, size answer lists Milan dimensions, email capture validates.
- QuickView: opening a product in the modal while on the home page adds a product greeting to the chat; `selectedProduct` changes trigger fresh greetings.
- RTL layout: launcher at left, bubbles mirror correctly, arrows point correctly.
- Mobile (375 px): bottom sheet, full width, scrollable messages.

---

## Decisions / items needing owner input

1. **Backend email storage** — currently `console.log` only. Replace the one line in `handleEmailSend()` with a `fetch` to your CRM, Mailchimp, or a Next.js Route Handler.
2. **Gemini API key** — set `NEXT_PUBLIC_GEMINI_KEY` in `.env.local` when swapping in the real LLM. Note: exposing an API key client-side is acceptable only if the key is restricted by HTTP referrer. For server-side use, consider a Route Handler proxy.
3. **Proactive auto-open aggressiveness** — currently the panel auto-opens once per context per session. If the brand prefers a softer approach (launcher pulse only, no auto-open), change `triggerGreeting(true)` calls to `triggerGreeting(false)` in both trigger effects.
4. **Sound default** — currently unmuted. Change `useState(false)` to `useState(true)` in the `muted` state initializer to default to muted.
5. **Category product filtering** — `replyBestSellers()` returns global best-sellers regardless of category. For a stricter UX, filter by `productKind(p) === category` inside `bestSellersLinks()` when `category` is in context.
