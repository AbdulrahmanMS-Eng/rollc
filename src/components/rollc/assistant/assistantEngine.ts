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

export const PRODUCT_CHIPS: QuickQuestion[] = [
  { id: "q:colors",        label: { ar: "ما الألوان المتاحة؟",          en: "What colours are available?" } },
  { id: "q:sizes",         label: { ar: "ما المقاسات المتاحة؟",         en: "What sizes are available?" } },
  { id: "q:material",      label: { ar: "ما الخامة المتاحة؟",           en: "What materials are available?" } },
  { id: "q:care",          label: { ar: "كيف أعتني بها؟",              en: "How do I care for it?" } },
  { id: "q:custom-size",   label: { ar: "هل يمكن تفصيله بمقاس خاص؟",   en: "Can it be custom-sized?" } },
  { id: "q:matching-set",  label: { ar: "هل تتوفّر قطع مطابقة؟",       en: "Any matching pieces?" } },
  { id: "q:warranty",      label: { ar: "ما مدة الضمان؟",               en: "What's the warranty?" } },
  { id: "q:delivery-city", label: { ar: "هل يصل التوصيل لمدينتي؟",     en: "Do you deliver to my city?" } },
];

export const CATEGORY_CHIPS: QuickQuestion[] = [
  { id: "q:colors",      label: { ar: "ما اللون الذي تبحث عنه؟", en: "Which colour are you after?" } },
  { id: "q:custom-size", label: { ar: "ما المقاس المناسب؟",       en: "What size suits you?" } },
  { id: "q:bestseller",  label: { ar: "الأكثر مبيعاً",           en: "Best sellers" } },
  { id: "q:budget",      label: { ar: "حسب الميزانية",           en: "By budget" } },
];

export const HOME_CHIPS: QuickQuestion[] = [
  { id: "q:categories", label: { ar: "تصفّح الأقسام",    en: "Browse categories" } },
  { id: "q:bestseller", label: { ar: "الأكثر مبيعاً",    en: "Best sellers" } },
  { id: "q:offers",     label: { ar: "العروض والخصومات", en: "Deals & discounts" } },
  { id: "q:budget",     label: { ar: "حسب الميزانية",    en: "By budget" } },
];

export function getCategoryChips(category?: CategoryKind): QuickQuestion[] {
  const catName = category
    ? getCategoryMeta(category).title
    : { ar: "الأثاث", en: "furniture" };
  return [
    { id: "q:colors",     label: { ar: "ما اللون الذي تبحث عنه؟",          en: "Which colour are you after?" } },
    { id: "q:custom-size",label: { ar: "ما المقاس المناسب؟",                en: "What size suits you?" } },
    { id: "q:cat-type",   label: { ar: `ما نوع ${catName.ar} المطلوب؟`,    en: `Which type of ${catName.en}?` } },
    { id: "q:bestseller", label: { ar: "الأكثر مبيعاً",                    en: "Best sellers" } },
    { id: "q:budget",     label: { ar: "حسب الميزانية",                    en: "By budget" } },
  ];
}

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

// ── Color extractor ───────────────────────────────────────────

function extractColor(msg: string): { ar: string; en: string } | null {
  const s = msg.toLowerCase();
  const map: Array<{ p: RegExp; ar: string; en: string }> = [
    { p: /رملي|بيج|beige|sand/,     ar: "الرملي",  en: "Sand" },
    { p: /بني|brown/,               ar: "البني",   en: "Brown" },
    { p: /رمادي|grey|gray/,         ar: "الرمادي", en: "Grey" },
    { p: /أخضر|زيتون|green|olive/,  ar: "الأخضر",  en: "Green" },
    { p: /أبيض|white/,              ar: "الأبيض",  en: "White" },
    { p: /أسود|black/,              ar: "الأسود",  en: "Black" },
    { p: /أزرق|blue/,               ar: "الأزرق",  en: "Blue" },
    { p: /أحمر|red/,                ar: "الأحمر",  en: "Red" },
    { p: /ذهبي|golden|gold/,        ar: "الذهبي",  en: "Golden" },
  ];
  for (const c of map) {
    if (c.p.test(s)) return { ar: c.ar, en: c.en };
  }
  return null;
}

// ── Greeting builders ────────────────────────────────────────

function greetHome(): { ar: string; en: string } {
  return {
    ar: "مرحباً 👋 أنا مساعد رولك، كيف أساعدك؟",
    en: "Hi 👋 I'm the Rollc assistant. How can I help you?",
  };
}

function greetCategory(category: CategoryKind): { ar: string; en: string } {
  const title = getCategoryMeta(category).title;
  return {
    ar: `مرحباً 👋 تتصفّح الآن مجموعة ${title.ar}. عن ماذا تبحث تحديداً؟`,
    en: `Hi 👋 You're browsing our ${title.en} collection. What are you looking for?`,
  };
}

function greetProduct(product: Product, locale: Locale): AssistantReply {
  return {
    text: {
      ar: `اختيار رائع ✦ ${product.name.ar}`,
      en: `Great choice ✦ ${product.name.en}`,
    },
    productLinks: [link(product, locale)],
    suggestions: PRODUCT_CHIPS,
  };
}

// ── Canned answer handlers ────────────────────────────────────

function replyDeliveryInstall(): AssistantReply {
  return {
    text: {
      ar: "نعم، نوصّل ونركّب في جميع مناطق المملكة خلال ٥–١٠ أيام ✦ يتولى فريقنا المتخصص التركيب مجاناً ونتواصل معك لتأكيد الموعد.",
      en: "Yes, we deliver and install across all regions of Saudi Arabia in 5–10 days ✦ our specialist team handles installation for free and will coordinate a time with you.",
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
        ar: `نعم ✦ نُفصّل ${product.name.ar} بمقاسات خاصة حسب مساحتك. أبعاد النموذج الأصلي: ${arDims}.`,
        en: `Yes ✦ The ${product.name.en} can be custom-tailored to your space. Standard dimensions: ${enDims}.`,
      },
      suggestions: [
        { id: "q:colors",     label: { ar: "ما الألوان المتاحة؟",   en: "What colours are available?" } },
        { id: "q:consultant", label: { ar: "تواصل مع المستشار",     en: "Talk to a consultant" } },
      ],
      askEmail: true,
    };
  }
  return {
    text: {
      ar: "نعم ✦ نُفصّل بمقاسات خاصة حسب مساحتك. يسعدنا التواصل معك لمناقشة ما يناسب مساحتك.",
      en: "Yes ✦ We custom-tailor to your space. We'd love to discuss what works best for you.",
    },
    suggestions: [
      { id: "q:delivery-city", label: { ar: "هل يصل التوصيل لمدينتي؟", en: "Do you deliver to my city?" } },
      { id: "q:consultant",    label: { ar: "تواصل مع المستشار",        en: "Talk to a consultant" } },
    ],
    askEmail: true,
  };
}

function replyColors(
  product: Product | undefined,
  locale: Locale,
  specificColor?: { ar: string; en: string } | null,
): AssistantReply {
  if (specificColor) {
    const pName = product ? product.name : { ar: "هذه القطعة", en: "this piece" };
    return {
      text: {
        ar: `نعم، ${specificColor.ar} متوفّر لـ ${pName.ar} ✦ وبإمكاننا توفير درجات أخرى عند الطلب.`,
        en: `Yes, ${specificColor.en} is available for the ${pName.en} ✦ and other shades can be arranged on request.`,
      },
      suggestions: [
        { id: "q:matching-set", label: { ar: "هل تتوفّر قطع مطابقة؟",     en: "Any matching pieces?" } },
        { id: "q:custom-size",  label: { ar: "هل يمكن تفصيله بمقاس خاص؟", en: "Can it be custom-sized?" } },
      ],
    };
  }
  const colors = productColors;
  const arNames = colors.map((c) => c.ar).join("، ");
  const enNames = colors.map((c) => c.en).join(", ");

  return {
    text: {
      ar: product
        ? `${product.name.ar} متوفّر بعدة ألوان: ${arNames} ✦ تواصل معنا لاختيار درجتك المفضّلة.`
        : `قطعنا متوفرة بألوان متعددة: ${arNames} ✦ تواصل معنا لاختيار درجتك.`,
      en: product
        ? `The ${product.name.en} comes in: ${enNames} ✦ Contact us to choose your preferred shade.`
        : `Our pieces come in: ${enNames} ✦ Contact us to pick your shade.`,
    },
    suggestions: [
      { id: "q:matching-set", label: { ar: "هل تتوفّر قطع مطابقة؟",  en: "Any matching pieces?" } },
      { id: "q:consultant",   label: { ar: "استفسر عن لون بعينه",     en: "Ask about a specific colour" } },
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
        ? `نعم، تتوفّر قطع مطابقة من نفس مجموعة ${product.name.ar}:`
        : "نعم، تتوفّر قطع مطابقة من نفس المجموعة. إليك بعض القطع التي تتكامل معاً:",
      en: product
        ? `Yes, there are matching pieces from the same ${product.name.en} family:`
        : "Yes, we have matching sets. Here are some pieces that work together:",
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

function replyMaterial(): AssistantReply {
  return {
    text: {
      ar: "قطعنا متوفرة بخامات مختلفة: جلد طبيعي، قماش كتاني، مخمل، وخشب مصمت. الجلد الطبيعي أكثر متانة للاستخدام اليومي، المخمل يضفي فخامة لكنه يحتاج عناية أكثر، والكتان خيار عملي لكل يوم ✦ الاختيار يعتمد على أسلوب حياتك.",
      en: "Our pieces come in natural leather, linen fabric, velvet, and solid wood. Leather is most durable for daily use; velvet adds luxury but needs more care; linen is a practical everyday choice ✦ the right material depends on your lifestyle.",
    },
    suggestions: [
      { id: "q:care",       label: { ar: "كيف أعتني بها؟",         en: "How do I care for it?" } },
      { id: "q:colors",     label: { ar: "ما الألوان المتاحة؟",     en: "What colours are available?" } },
      { id: "q:consultant", label: { ar: "تواصل مع المستشار",       en: "Talk to a consultant" } },
    ],
  };
}

function replyCare(): AssistantReply {
  return {
    text: {
      ar: "للحفاظ على قطعتك:\n• الجلد: امسحه بقطعة ناعمة مبللة وجففه فوراً — تجنّب الشمس المباشرة.\n• القماش والمخمل: مكنسة أسبوعية، وأزل البقع بمنديل مبلل فوراً.\n• الخشب: مسح بقطعة جافة وملمّع خشب مرة كل ٣ أشهر.",
      en: "To keep your piece looking great:\n• Leather: wipe with a damp soft cloth and dry immediately — avoid direct sunlight.\n• Fabric/velvet: vacuum weekly; blot spills immediately.\n• Wood: dust dry and apply wood polish every 3 months.",
    },
    suggestions: [
      { id: "q:warranty",   label: { ar: "ما مدة الضمان؟",         en: "What's the warranty?" } },
      { id: "q:material",   label: { ar: "ما الخامات المتاحة؟",     en: "What materials are available?" } },
    ],
  };
}

function replyReturns(): AssistantReply {
  return {
    text: {
      ar: "يمكنك إرجاع أي قطعة خلال ١٤ يوماً من الاستلام بشرط أن تكون بحالتها الأصلية وبدون استخدام. الاستبدال متاح خلال نفس الفترة ✦ تواصل مع فريقنا وسنرتّب الاستلام.",
      en: "Returns are accepted within 14 days of delivery, provided the piece is in its original unused condition. Exchanges are available within the same window ✦ contact our team and we'll arrange collection.",
    },
    suggestions: [
      { id: "q:warranty",   label: { ar: "ما مدة الضمان؟",         en: "What's the warranty?" } },
      { id: "q:consultant", label: { ar: "تواصل مع الفريق",         en: "Contact the team" } },
    ],
  };
}

function replyPayment(): AssistantReply {
  return {
    text: {
      ar: "نقبل: مدى، فيزا، ماستركارد، Apple Pay، وتمارا (تقسيط ٣–٤ دفعات بدون فوائد) ✦ اختر الطريقة الأنسب لك عند إتمام طلبك.",
      en: "We accept: Mada, Visa, Mastercard, Apple Pay, and Tamara (3–4 interest-free instalments) ✦ Choose your preferred method at checkout.",
    },
    suggestions: [
      { id: "q:delivery-install", label: { ar: "التوصيل والتركيب؟", en: "Delivery & installation?" } },
      { id: "q:consultant",       label: { ar: "تواصل لإتمام الطلب", en: "Contact to complete order" } },
    ],
  };
}

function replyStock(product?: Product): AssistantReply {
  return {
    text: product
      ? {
          ar: `${product.name.ar} متوفّر حالياً ✦ الكميات محدودة، ننصحك بإتمام الطلب بأسرع وقت.`,
          en: `The ${product.name.en} is currently in stock ✦ Quantities are limited — we recommend ordering soon.`,
        }
      : {
          ar: "معظم قطعنا متوفرة الآن. الطلبات المفصّلة (مقاسات خاصة) تحتاج ٢–٤ أسابيع للتجهيز.",
          en: "Most pieces are available now. Custom orders (tailored sizing) typically take 2–4 weeks to prepare.",
        },
    suggestions: [
      { id: "q:delivery-install", label: { ar: "التوصيل والتركيب؟", en: "Delivery & installation?" } },
      { id: "q:consultant",       label: { ar: "تأكيد التوفّر",       en: "Confirm availability" } },
    ],
  };
}

function replyShowrooms(): AssistantReply {
  return {
    text: {
      ar: "لدينا صالتا عرض في الرياض والدمام. ساعات العمل: السبت–الخميس ١٠ص–١٠م، الجمعة ٢م–١٠م ✦ يسعدنا استقبالك لتجربة القطع بنفسك.",
      en: "We have showrooms in Riyadh and Dammam. Open Sat–Thu 10am–10pm, Fri 2pm–10pm ✦ We'd love to welcome you in person to experience the pieces.",
    },
    suggestions: [
      { id: "q:consultant",       label: { ar: "تواصل مع الفرع",      en: "Contact a showroom" } },
      { id: "q:delivery-install", label: { ar: "هل يصل التوصيل لمدينتي؟", en: "Delivery to my city" } },
    ],
  };
}

function replyOffers(locale: Locale): AssistantReply {
  return {
    text: {
      ar: "لدينا عروض موسمية دورية — تابع حساباتنا لآخر الخصومات. بعض القطع المحددة حالياً بخصم يصل إلى ٢٠٪ ✦ إليك أبرز القطع ذات العروض:",
      en: "We run seasonal promotions — follow our accounts for the latest deals. Selected pieces are currently discounted up to 20% ✦ Here are the top offers:",
    },
    productLinks: bestSellersLinks(locale),
    suggestions: [
      { id: "q:bestseller", label: { ar: "الأكثر مبيعاً",  en: "Best sellers" } },
      { id: "q:budget",     label: { ar: "حسب الميزانية",  en: "By budget" } },
    ],
  };
}

function replyComparison(product: Product | undefined, locale: Locale): AssistantReply {
  return {
    text: {
      ar: "يسعدنا مساعدتك في المقارنة ✦ كل قطعة لها طابعها من حيث الخامة والحجم والأسلوب. أخبرني بالقطعتين اللتين تودّ المقارنة بينهما وسأرشدك.",
      en: "Happy to help you compare ✦ Each piece has its own character in material, size, and style. Tell me which two pieces you'd like to compare and I'll guide you.",
    },
    productLinks: product ? sameCategoryLinks(product, locale).slice(0, 2) : undefined,
    suggestions: [
      { id: "q:material",   label: { ar: "ما الخامات المتاحة؟",  en: "What materials?" } },
      { id: "q:consultant", label: { ar: "مقارنة مع مستشار",     en: "Compare with a consultant" } },
    ],
  };
}

function replySizes(product?: Product): AssistantReply {
  if (product) {
    const dims = productDimensions(product);
    const arDims = dims.map((d) => `${d.key.ar}: ${d.value.ar}${d.unit ? " " + d.unit.ar : ""}`).join(" · ");
    const enDims = dims.map((d) => `${d.key.en}: ${d.value.en}${d.unit ? " " + d.unit.en : ""}`).join(" · ");
    return {
      text: {
        ar: `أبعاد ${product.name.ar}: ${arDims} ✦ كذلك يمكن التفصيل بمقاسات خاصة.`,
        en: `${product.name.en} dimensions: ${enDims} ✦ Custom sizing is also available.`,
      },
      suggestions: [
        { id: "q:custom-size", label: { ar: "هل يمكن تفصيله بمقاس خاص؟", en: "Can it be custom-sized?" } },
        { id: "q:consultant",  label: { ar: "تواصل مع المستشار",           en: "Talk to a consultant" } },
      ],
    };
  }
  return {
    text: {
      ar: "قطعنا متوفرة بمقاسات متعددة ✦ وجميعها قابلة للتفصيل حسب مساحتك.",
      en: "Our pieces come in multiple sizes ✦ and all can be custom-tailored to your space.",
    },
    suggestions: [
      { id: "q:custom-size", label: { ar: "هل يمكن تفصيله بمقاس خاص؟", en: "Can it be custom-sized?" } },
      { id: "q:consultant",  label: { ar: "تواصل مع المستشار",           en: "Talk to a consultant" } },
    ],
  };
}

function replyCategories(_locale: Locale): AssistantReply {
  return {
    text: {
      ar: "تجد في رولك: أرائك، كراسي، طاولات، أسرة، وإكسسوارات ديكور. أيّ قسم يستأثر باهتمامك؟",
      en: "Rollc offers: sofas, chairs, tables, beds, and décor accents. Which section interests you?",
    },
    suggestions: CATEGORY_CHIPS,
  };
}

function replyCatBrowse(category: CategoryKind | undefined, _locale: Locale): AssistantReply {
  const catName = category
    ? getCategoryMeta(category).title
    : { ar: "الأثاث", en: "furniture" };
  return {
    text: {
      ar: `في قسم ${catName.ar} لدينا خيارات متنوعة من الأشكال والتصاميم. ما الذي تبحث عنه تحديداً؟`,
      en: `Our ${catName.en} section has a wide variety of styles and designs. What specifically are you looking for?`,
    },
    suggestions: [
      { id: "q:colors", label: { ar: "ما اللون الذي تبحث عنه؟", en: "Which colour are you after?" } },
      { id: "q:budget", label: { ar: "حسب الميزانية",            en: "By budget" } },
    ],
  };
}

// ── Intent detection (mock NLU) ───────────────────────────────

function detectIntent(msg: string): string {
  const s = msg.toLowerCase();
  if (/مرحب|أهل|السلام|هلا|hello|hi\b|hey\b/.test(s)) return "greeting";
  if (/ضمان|warranty/.test(s)) return "warranty";
  if (/إرجاع|استرداد|استبدال|return|exchange|refund/.test(s)) return "returns";
  if (/دفع|تقسيط|تابي|تمارا|مدى|فيزا|payment|instalm|tamara|tabby|mada|visa/.test(s)) return "payment";
  if (/الفرق بين|أيهما أفضل|مقارن|compare|comparison|versus|\bvs\b/.test(s)) return "comparison";
  if (/خامة|قماش|جلد|مخمل|كتان|خشب|material|fabric|leather|velvet|linen|wood/.test(s)) return "material";
  if (/عناية|تنظيف|صيانة|care|clean|maintain/.test(s)) return "care";
  if (/توفر|مخزون|متوفر|موجود|stock|availabl/.test(s)) return "stock";
  if (/فروع|صالة عرض|معرض|showroom|branch/.test(s)) return "showrooms";
  if (/عروض|خصم|تخفيض|offer|discount|sale|promo/.test(s)) return "offers";
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
  const { locale, product, category } = ctx;
  switch (qid) {
    case "delivery":
    case "delivery-install":
    case "delivery-city":    return replyDeliveryInstall();
    case "delivery-time":    return replyDeliveryTime();
    case "sizes":            return replySizes(product);
    case "size":
    case "custom-size":      return replyCustomSize(product);
    case "color":
    case "colors":           return replyColors(product, locale);
    case "set":
    case "full-set":
    case "matching-set":     return replyMatchingSet(product, locale);
    case "budget":           return replyBudget(locale);
    case "bestseller":       return replyBestSellers(locale);
    case "categories":       return replyCategories(locale);
    case "cat-type":         return replyCatBrowse(category, locale);
    case "material":         return replyMaterial();
    case "care":             return replyCare();
    case "returns":          return replyReturns();
    case "payment":          return replyPayment();
    case "stock":            return replyStock(product);
    case "showrooms":        return replyShowrooms();
    case "offers":           return replyOffers(locale);
    case "comparison":       return replyComparison(product, locale);
    case "contact":
    case "consultant":       return replyContact();
    default:                 return replyGeneral(product, locale);
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
    case "colors":           return replyColors(product, locale, extractColor(msg));
    case "matching-set":     return replyMatchingSet(product, locale);
    case "budget":           return replyBudget(locale);
    case "bestseller":       return replyBestSellers(locale);
    case "warranty":         return replyWarranty();
    case "returns":          return replyReturns();
    case "payment":          return replyPayment();
    case "material":         return replyMaterial();
    case "care":             return replyCare();
    case "stock":            return replyStock(product);
    case "showrooms":        return replyShowrooms();
    case "offers":           return replyOffers(locale);
    case "comparison":       return replyComparison(product, locale);
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
          suggestions: getCategoryChips(category),
        };
      case "product":
        return product
          ? greetProduct(product, locale)
          : { text: greetHome(), suggestions: PRODUCT_CHIPS };
    }
  }

  // Quick-question chips are prefixed "q:"
  if (userMessage.startsWith("q:")) {
    return handleQuickQuestion(userMessage.slice(2), ctx);
  }

  // Free-text NLU
  return handleFreeText(userMessage, ctx);
}
