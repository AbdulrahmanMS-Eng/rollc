// ============================================================
// Rollc — Shopping Assistant Engine
// Single async boundary for ALL AI / answer logic.
//
// TO SWAP IN GEMINI (one-function change):
//   1. npm i @google/genai
//   2. import { GoogleGenAI } from "@google/genai";
//      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY! });
//   3. Replace the body of getAssistantReply() with:
//        const prompt = buildGeminiPrompt(ctx);
//        const res = await ai.models.generateContent({
//          model: "gemini-2.0-flash",
//          contents: prompt,
//          config: { systemInstruction: GEMINI_SYSTEM_PROMPT },
//        });
//        return parseGeminiResponse(res.text ?? "", ctx);
//   4. Nothing else in the codebase changes.
//
// The React components call ONLY this exported function.
// All canned answers, NLU, and business rules live here.
// ============================================================

import { products, type Locale, type Product } from "@/data/rollc/content";
import {
  productKind,
  productColors,
  productDimensions,
  thumb,
} from "@/components/rollc/product/productPageData";
import { getCategoryMeta, type CategoryKind } from "@/components/rollc/category/categoryPageData";

// ── Public types ──────────────────────────────────────────────

export type QuickQuestion = {
  id: string;
  label: { ar: string; en: string };
};

export type ProductLink = {
  id: string;
  name: { ar: string; en: string };
  img: string;
  href: string;
  price: string;
};

export type AssistantContext = {
  locale: Locale;
  page: "home" | "category" | "product";
  category?: CategoryKind;
  product?: Product;
  userMessage?: string;
};

export type AssistantReply = {
  text: { ar: string; en: string } | string;
  suggestions?: QuickQuestion[];
  productLinks?: ProductLink[];
  askEmail?: boolean;
  showContact?: boolean;
};

// ── Chip banks ────────────────────────────────────────────────

/** 6 premium chips shown on product pages and in the QV greeting */
export const PRODUCT_CHIPS: QuickQuestion[] = [
  { id: "q:delivery-install", label: { ar: "التوصيل والتركيب",    en: "Delivery & installation" } },
  { id: "q:custom-size",      label: { ar: "تفصيل بمقاس خاص",     en: "Custom size" } },
  { id: "q:colors",           label: { ar: "الألوان المتوفرة",     en: "Available colors" } },
  { id: "q:matching-set",     label: { ar: "طقم مناسب معه",        en: "Matching set" } },
  { id: "q:delivery-time",    label: { ar: "مدة وصول الطلب",       en: "Delivery time" } },
  { id: "q:consultant",       label: { ar: "تواصل مع المستشار",    en: "Talk to a consultant" } },
];

export const CATEGORY_CHIPS: QuickQuestion[] = [
  { id: "q:budget",     label: { ar: "ما الميزانية المناسبة؟", en: "What's my budget?" } },
  { id: "q:colors",     label: { ar: "الألوان المتاحة",         en: "Available colors" } },
  { id: "q:custom-size",label: { ar: "المقاسات المتاحة",        en: "Available sizes" } },
  { id: "q:bestseller", label: { ar: "الأكثر مبيعاً",           en: "Best sellers" } },
];

export const HOME_CHIPS: QuickQuestion[] = [
  { id: "q:delivery-install", label: { ar: "التوصيل والتركيب",     en: "Delivery & installation" } },
  { id: "q:budget",           label: { ar: "ما الميزانية المناسبة؟", en: "What's my budget?" } },
  { id: "q:bestseller",       label: { ar: "الأكثر مبيعاً",         en: "Best sellers" } },
  { id: "q:consultant",       label: { ar: "تواصل مع المستشار",     en: "Talk to a consultant" } },
];

// ── Private helpers ───────────────────────────────────────────

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function link(p: Product, locale: Locale): ProductLink {
  return {
    id: p.id,
    name: p.name,
    img: thumb(p.img),
    href: locale === "ar" ? `/products/${p.id}` : `/en/products/${p.id}`,
    price: p.price,
  };
}

function sameCategoryLinks(current: Product, locale: Locale): ProductLink[] {
  const kind = productKind(current);
  return products
    .filter((p) => p.id !== current.id && productKind(p) === kind)
    .slice(0, 3)
    .map((p) => link(p, locale));
}

function pickLinks(exclude: string, locale: Locale, n = 3): ProductLink[] {
  return products
    .filter((p) => p.id !== exclude)
    .sort((a, b) => (a.id < b.id ? -1 : 1))
    .slice(0, n)
    .map((p) => link(p, locale));
}

function bestSellersLinks(locale: Locale): ProductLink[] {
  return products
    .filter((p) => p.tag.en.toLowerCase().includes("best") || Boolean(p.old))
    .slice(0, 3)
    .map((p) => link(p, locale));
}

// ── Greeting builders ────────────────────────────────────────

function greetHome(): { ar: string; en: string } {
  return {
    ar: "مرحباً 👋 أنا مساعد رولك. هل تبحث عن قطعة معينة لمنزلك؟",
    en: "Hello 👋 I'm the Rollc assistant. Are you looking for a specific piece for your home?",
  };
}

function greetCategory(category: CategoryKind): { ar: string; en: string } {
  const title = getCategoryMeta(category).title;
  return {
    ar: `مرحباً 👋 تتصفح الآن مجموعة ${title.ar}. عن ماذا تبحث تحديداً؟`,
    en: `Hello 👋 You're browsing our ${title.en} collection. What are you looking for exactly?`,
  };
}

function greetProduct(product: Product): { ar: string; en: string } {
  return {
    ar: `اختيار رائع ✦ هل تود معرفة تفاصيل أكثر عن ${product.name.ar}؟`,
    en: `Beautiful choice ✦ Would you like to know more about ${product.name.en}?`,
  };
}

// ── Canned answer handlers ────────────────────────────────────

function replyDeliveryInstall(): AssistantReply {
  return {
    text: {
      ar: "نعم ✦ نوفر توصيلاً احترافياً داخل المملكة العربية السعودية مع تركيب مجاني بواسطة فريقنا المتخصص. تصل قطعتك في 5–10 أيام عمل ونتواصل معك لتأكيد الموعد.",
      en: "Yes ✦ We offer professional delivery across the Kingdom with free installation by our specialist team. Your piece arrives in 5–10 business days — we'll coordinate a convenient time with you.",
    },
    suggestions: [
      { id: "q:delivery-time", label: { ar: "مدة وصول الطلب",    en: "Delivery time" } },
      { id: "q:consultant",    label: { ar: "تواصل مع المستشار", en: "Talk to a consultant" } },
    ],
  };
}

function replyDeliveryTime(): AssistantReply {
  return {
    text: {
      ar: "توصيل قطع رولك يستغرق 5–10 أيام عمل داخل المملكة. للمدن الرئيسية (الرياض · جدة · الدمام) في الغالب خلال 5 أيام. للمناطق البعيدة قد يصل إلى 10 أيام. التركيب يُجدوَل مع فريقنا بعد وصول القطعة.",
      en: "Rollc deliveries take 5–10 business days across KSA. Major cities (Riyadh · Jeddah · Dammam) are typically 5 days; remote areas may take up to 10. Installation is scheduled with our team after delivery.",
    },
    suggestions: [
      { id: "q:delivery-install", label: { ar: "تفاصيل التركيب",    en: "Installation details" } },
      { id: "q:consultant",       label: { ar: "تواصل مع المستشار", en: "Talk to a consultant" } },
    ],
  };
}

function replyCustomSize(product?: Product): AssistantReply {
  if (product) {
    const dims = productDimensions(product);
    const arDims = dims.map((d) => `${d.key.ar}: ${d.value.ar}${d.unit ? " " + d.unit.ar : ""}`).join(" · ");
    const enDims = dims.map((d) => `${d.key.en}: ${d.value.en}${d.unit ? " " + d.unit.en : ""}`).join(" · ");
    return {
      text: {
        ar: `نعم ✦ يمكن تفصيل ${product.name.ar} بمقاسات مخصصة حسب طلبك. أبعاد النموذج الأصلي: ${arDims}. للتفاصيل يسعدنا التواصل معك مباشرة.`,
        en: `Yes ✦ The ${product.name.en} can be tailored to custom sizes on request. Standard dimensions: ${enDims}. For full details, we'd be happy to connect with you.`,
      },
      suggestions: [
        { id: "q:colors",     label: { ar: "الألوان المتوفرة؟", en: "Available colors?" } },
        { id: "q:consultant", label: { ar: "تواصل مع المستشار", en: "Talk to a consultant" } },
      ],
      askEmail: true,
    };
  }
  return {
    text: {
      ar: "نعم ✦ جميع قطعنا متاحة بمقاسات مخصصة. يسعدنا التواصل معك لمناقشة ما يناسب مساحتك.",
      en: "Yes ✦ All our pieces are available in custom sizes. We'd love to discuss what suits your space.",
    },
    suggestions: [
      { id: "q:delivery-install", label: { ar: "التوصيل والتركيب؟", en: "Delivery & installation?" } },
      { id: "q:consultant",       label: { ar: "تواصل مع المستشار", en: "Talk to a consultant" } },
    ],
    askEmail: true,
  };
}

function replyColors(product: Product | undefined, locale: Locale): AssistantReply {
  const colors = productColors;
  const arNames = colors.map((c) => c.ar).join("، ");
  const enNames = colors.map((c) => c.en).join(", ");
  const productLinks = product
    ? pickLinks(product.id, locale, 3)
    : products.slice(0, 3).map((p) => link(p, locale));

  return {
    text: {
      ar: `نعم ✦ هذه القطعة متاحة بألوان متعددة: ${arNames}. إليك بعض القطع التي توضح خيارات الألوان:`,
      en: `Yes ✦ This piece is available in: ${enNames}. Here are some pieces showing the full color range:`,
    },
    productLinks,
    suggestions: [
      { id: "q:matching-set", label: { ar: "طقم مناسب معه؟",          en: "Matching set?" } },
      { id: "q:consultant",   label: { ar: "استفسر عن لون بعينه",      en: "Ask about a specific color" } },
    ],
  };
}

function replyMatchingSet(product: Product | undefined, locale: Locale): AssistantReply {
  const productLinks = product
    ? sameCategoryLinks(product, locale)
    : products.slice(0, 3).map((p) => link(p, locale));

  return {
    text: {
      ar: product
        ? `نعم ✦ لدينا قطع من نفس العائلة تتناسق مع ${product.name.ar} تماماً:`
        : "نعم ✦ لدينا مجموعات متناسقة. إليك بعض القطع التي تتكامل معاً:",
      en: product
        ? `Yes ✦ We have pieces from the same family that pair beautifully with the ${product.name.en}:`
        : "Yes ✦ We have coordinated sets. Here are some pieces that work together:",
    },
    productLinks,
    suggestions: [
      { id: "q:delivery-install", label: { ar: "التوصيل والتركيب؟", en: "Delivery & installation?" } },
      { id: "q:consultant",       label: { ar: "استفسر عن الطقم",    en: "Ask about a set" } },
    ],
  };
}

function replyBudget(locale: Locale): AssistantReply {
  return {
    text: {
      ar: "تتراوح أسعار قطعنا من 890 ر.س للإكسسوارات وصولاً إلى 7,200 ر.س للطاولات الكبيرة. إليك أبرز القطع الأكثر طلباً:",
      en: "Our pieces range from 890 SAR for accents up to 7,200 SAR for large dining tables. Here are our most popular picks:",
    },
    productLinks: bestSellersLinks(locale),
    suggestions: [
      { id: "q:bestseller", label: { ar: "الأكثر مبيعاً",  en: "Best sellers" } },
      { id: "q:consultant", label: { ar: "استشارة مجانية", en: "Free consultation" } },
    ],
  };
}

function replyBestSellers(locale: Locale): AssistantReply {
  return {
    text: {
      ar: "إليك أبرز القطع الأكثر طلباً هذا الموسم في رولك:",
      en: "Here are Rollc's most popular pieces this season:",
    },
    productLinks: bestSellersLinks(locale),
    suggestions: [
      { id: "q:delivery-install", label: { ar: "التوصيل والتركيب؟", en: "Delivery & installation?" } },
      { id: "q:consultant",       label: { ar: "تواصل مع المستشار", en: "Talk to a consultant" } },
    ],
  };
}

function replyWarranty(): AssistantReply {
  return {
    text: {
      ar: "جميع قطع رولك مضمونة لمدة سنتين ✦ الضمان يشمل عيوب التصنيع في الهيكل والخياطة. الإرجاع أو الاستبدال متاح خلال 14 يوماً من الاستلام.",
      en: "All Rollc pieces come with a 2-year warranty ✦ covering manufacturing defects in the frame and stitching. Returns or exchanges are available within 14 days of delivery.",
    },
    suggestions: [
      { id: "q:delivery-install", label: { ar: "التوصيل والتركيب؟", en: "Delivery & installation?" } },
      { id: "q:consultant",       label: { ar: "تواصل مع المستشار", en: "Talk to a consultant" } },
    ],
  };
}

function replyBuy(product?: Product): AssistantReply {
  return {
    text: product
      ? {
          ar: `يسعدنا مساعدتك في الحصول على ${product.name.ar}. تواصل معنا وسيرد عليك أحد مستشاري رولك:`,
          en: `We'd love to help you get the ${product.name.en}. Contact us and a Rollc advisor will reach out:`,
        }
      : {
          ar: "يسعدنا مساعدتك في الطلب. تواصل مع فريق رولك عبر:",
          en: "We'd love to help you order. Contact the Rollc team via:",
        },
    showContact: true,
    askEmail: true,
  };
}

function replyContact(): AssistantReply {
  return {
    text: {
      ar: "يسعدنا التواصل معك مباشرة ✦ فريقنا جاهز للمساعدة:",
      en: "We'd love to connect with you ✦ Our team is ready to help:",
    },
    showContact: true,
    askEmail: true,
  };
}

function replyGeneral(product?: Product, locale: Locale = "ar"): AssistantReply {
  return {
    text: {
      ar: "بكل سرور ✦ هل تبحث عن معلومات تفصيلية حول منتج بعينه، أو تريد استعراض المجموعة؟",
      en: "Of course ✦ Are you looking for details on a specific piece, or would you like to browse the collection?",
    },
    suggestions: product ? PRODUCT_CHIPS : HOME_CHIPS,
    productLinks: product ? undefined : bestSellersLinks(locale),
  };
}

function replyGreeting(product?: Product, page: "home" | "category" | "product" = "home"): AssistantReply {
  return {
    text: {
      ar: "أهلاً وسهلاً ✦ أنا مساعدك في رولك، كيف أقدر أساعدك اليوم؟",
      en: "Welcome ✦ I'm your Rollc assistant. How can I help you today?",
    },
    suggestions: product ? PRODUCT_CHIPS : page === "home" ? HOME_CHIPS : CATEGORY_CHIPS,
  };
}

function replyOffTopic(): AssistantReply {
  return {
    text: {
      ar: "أنا هنا لمساعدتك في أثاث رولك فقط ✦ كيف أقدر أساعدك في اختيار قطعتك؟",
      en: "I'm here to help with Rollc furniture only ✦ How can I help you choose your next piece?",
    },
    suggestions: HOME_CHIPS,
  };
}

// ── Intent detection (mock NLU) ───────────────────────────────

function detectIntent(msg: string): string {
  const s = msg.toLowerCase();
  if (/مرحب|أهل|السلام|هلا|hello|hi\b|hey\b/.test(s)) return "greeting";
  if (/ضمان|إرجاع|استبدال|warranty|return|exchange|refund/.test(s)) return "warranty";
  if (/شراء|اشتر|اطلب|أطلب|buy|order|purchase|checkout/.test(s)) return "buy";
  if (/توصيل|تسليم|شحن|تركيب|delivery|shipping|install/.test(s)) return "delivery-install";
  if (/وقت|مدة|متى|يوم|أسبوع|time|when|days|week|how long/.test(s)) return "delivery-time";
  if (/مقاس|أبعاد|حجم|تفصيل|قياس|size|dimension|width|height|depth|custom/.test(s)) return "custom-size";
  if (/لون|ألوان|color|colour|رملي|بني|رمادي|أخضر|أبيض|أسود|sand|brown|grey|green|white|black/.test(s)) return "colors";
  if (/طقم|مجموعة|يناسب|مطابق|set|collection|matching|complement/.test(s)) return "matching-set";
  if (/سعر|ثمن|تكلفة|ميزانية|price|cost|budget|how much|كم|غالي|رخيص|cheap|expensive/.test(s)) return "budget";
  if (/مبيعاً|شعبي|popular|bestsell|trending|أكثر/.test(s)) return "bestseller";
  if (/تواصل|اتصل|استشار|مستشار|contact|phone|email|whatsapp|رقم|هاتف|consult/.test(s)) return "consultant";
  if (/أريكة|كرسي|طاولة|سرير|ديكور|أثاث|غرفة|نوم|معيشة|sofa|chair|table|bed|decor|furniture|room|living|bedroom|dining/.test(s)) return "general";
  if (/رولك|rollc|المتجر|store|shop/.test(s)) return "general";
  return "offtopic";
}

// ── Quick-question dispatcher ─────────────────────────────────

function handleQuickQuestion(qid: string, ctx: AssistantContext): AssistantReply {
  const { locale, product } = ctx;
  switch (qid) {
    case "delivery":
    case "delivery-install":  return replyDeliveryInstall();
    case "delivery-time":     return replyDeliveryTime();
    case "size":
    case "custom-size":       return replyCustomSize(product);
    case "color":
    case "colors":            return replyColors(product, locale);
    case "set":
    case "matching-set":      return replyMatchingSet(product, locale);
    case "budget":            return replyBudget(locale);
    case "bestseller":        return replyBestSellers(locale);
    case "contact":
    case "consultant":        return replyContact();
    default:                  return replyGeneral(product, locale);
  }
}

// ── Free-text dispatcher ──────────────────────────────────────

function handleFreeText(msg: string, ctx: AssistantContext): AssistantReply {
  const { locale, product, page } = ctx;
  switch (detectIntent(msg)) {
    case "greeting":         return replyGreeting(product, page);
    case "delivery-install": return replyDeliveryInstall();
    case "delivery-time":    return replyDeliveryTime();
    case "custom-size":      return replyCustomSize(product);
    case "colors":           return replyColors(product, locale);
    case "matching-set":     return replyMatchingSet(product, locale);
    case "budget":           return replyBudget(locale);
    case "bestseller":       return replyBestSellers(locale);
    case "warranty":         return replyWarranty();
    case "buy":              return replyBuy(product);
    case "consultant":       return replyContact();
    case "general":          return replyGeneral(product, locale);
    default:                 return replyOffTopic();
  }
}

// ── Public API ────────────────────────────────────────────────

/**
 * The single async boundary between UI and AI logic.
 * Swap in Gemini (or any LLM) by replacing this function body only.
 * Input/output contract is stable.
 */
export async function getAssistantReply(ctx: AssistantContext): Promise<AssistantReply> {
  // Simulate natural latency — remove when using a real LLM
  await delay(540 + Math.random() * 360);

  const { locale, page, category, product, userMessage } = ctx;

  // No message = initial context greeting
  if (!userMessage) {
    switch (page) {
      case "home":
        return { text: greetHome(), suggestions: HOME_CHIPS };
      case "category":
        return {
          text: category ? greetCategory(category) : greetHome(),
          suggestions: CATEGORY_CHIPS,
        };
      case "product":
        return {
          text: product ? greetProduct(product) : greetHome(),
          suggestions: PRODUCT_CHIPS,
        };
    }
  }

  // Quick-question chips are prefixed "q:"
  if (userMessage.startsWith("q:")) {
    return handleQuickQuestion(userMessage.slice(2), ctx);
  }

  // Free-text NLU
  return handleFreeText(userMessage, ctx);
}
