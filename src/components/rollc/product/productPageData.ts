import type { Locale, Product } from "@/data/rollc/content";

export type LocalizedText = Record<Locale, string>;

export type ProductOption = LocalizedText;

export type ProductColor = ProductOption & {
  value: string;
};

export type ProductSpec = {
  label: LocalizedText;
  icon: "fabric" | "wood" | "warranty" | "install" | "room" | "crafted";
};

export type ProductDimension = {
  key: LocalizedText;
  value: LocalizedText;
  unit?: LocalizedText;
};

export type Review = {
  name: LocalizedText;
  initials: LocalizedText;
  quote: LocalizedText;
};

export type StoryContent = {
  title: LocalizedText;
  paragraphs: LocalizedText[];
  quote: LocalizedText;
  image: string;
};

export type Suggestion = {
  name: LocalizedText;
  meta: LocalizedText;
  price: string;
  img: string;
};

export const productColors: ProductColor[] = [
  { ar: "رملي فاخر", en: "Sand", value: "#cdb593" },
  { ar: "بني عميق", en: "Deep Brown", value: "#5a4330" },
  { ar: "رمادي حجري", en: "Stone Grey", value: "#8c8a84" },
  { ar: "أخضر زيتي", en: "Olive", value: "#5c6044" },
];

const galleryFallbacksByCategory: Record<string, string[]> = {
  sofas: [
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1200&q=80",
  ],
  chairs: [
    "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=1200&q=80",
  ],
  tables: [
    "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1602872030490-4a484a7b3ba6?auto=format&fit=crop&w=1200&q=80",
  ],
  beds: [
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
  ],
  decor: [
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?auto=format&fit=crop&w=1200&q=80",
  ],
};

export function productKind(product: Product) {
  const category = product.cat.en.toLowerCase();
  const id = product.id.toLowerCase();

  if (category.includes("sofa") || id.includes("sofa")) return "sofas";
  if (category.includes("chair") || id.includes("chair")) return "chairs";
  if (category.includes("table") || id.includes("table") || category.includes("dining")) return "tables";
  if (category.includes("bed") || id.includes("bed")) return "beds";
  return "decor";
}

export function highRes(src: string) {
  return src.replace("w=300", "w=1200").replace("w=700", "w=1200");
}

export function thumb(src: string) {
  return src.replace("w=1200", "w=300").replace("w=700", "w=300");
}

export function productGallery(product: Product) {
  const primary = highRes(product.img);
  const fallbacks = galleryFallbacksByCategory[productKind(product)] ?? galleryFallbacksByCategory.decor;
  return [primary, ...fallbacks].slice(0, 4);
}

export function categoryCrumb(product: Product): LocalizedText {
  switch (productKind(product)) {
    case "sofas":
      return { ar: "الأرائك", en: "Sofas" };
    case "chairs":
      return { ar: "الكراسي", en: "Chairs" };
    case "tables":
      return { ar: "الطاولات", en: "Tables" };
    case "beds":
      return { ar: "الأسرّة", en: "Beds" };
    default:
      return { ar: "الديكور", en: "Decor" };
  }
}

export function productBadge(product: Product, locale: Locale) {
  if (!product.tag[locale]) return "";
  if (locale === "ar") return `${product.tag.ar} · ${product.tag.en}`;
  return product.tag.en;
}

export function productShortDescription(product: Product): LocalizedText {
  if (product.id === "milano-sofa") {
    return {
      ar: "أريكة ثلاثية فاخرة بقماش مخملي ناعم، مصممة لتمنح غرفة المعيشة حضوراً دافئاً وراقياً.",
      en: "A luxurious three-seater in soft velvet, designed to give your living room a warm, refined presence.",
    };
  }

  return product.desc;
}

export function sizeOptions(product: Product): ProductOption[] {
  switch (productKind(product)) {
    case "sofas":
      return [
        { ar: "2 مقعد", en: "2 Seater" },
        { ar: "3 مقاعد", en: "3 Seater" },
        { ar: "زاوية L", en: "L-Corner" },
      ];
    case "chairs":
      return [
        { ar: "قطعة واحدة", en: "Single" },
        { ar: "زوج", en: "Pair" },
        { ar: "نسخة لاونج", en: "Lounge" },
      ];
    case "tables":
      return [
        { ar: "قهوة", en: "Coffee" },
        { ar: "جانبية", en: "Side" },
        { ar: "طعام", en: "Dining" },
      ];
    case "beds":
      return [
        { ar: "كوين", en: "Queen" },
        { ar: "كنج", en: "King" },
        { ar: "كنج مع تخزين", en: "King Storage" },
      ];
    default:
      return [
        { ar: "قياسي", en: "Standard" },
        { ar: "فاخر", en: "Premium" },
        { ar: "مخصص", en: "Custom" },
      ];
  }
}

export function productSpecs(product: Product): ProductSpec[] {
  const kind = productKind(product);
  const material = kind === "tables"
    ? { ar: "سطح رخامي فاخر", en: "Premium marble top" }
    : kind === "beds"
      ? { ar: "تنجيد فاخر ناعم", en: "Premium soft upholstery" }
      : kind === "decor"
        ? { ar: "تشطيب فاخر", en: "Premium finish" }
        : { ar: "قماش مخملي فاخر", en: "Premium velvet" };

  const room = kind === "sofas"
    ? { ar: "مناسب لغرف المعيشة", en: "Ideal for living rooms" }
    : { ar: "مناسب للمساحات الراقية", en: "Ideal for refined spaces" };

  return [
    { icon: "fabric", label: material },
    { icon: "wood", label: { ar: "هيكل خشب طبيعي", en: "Natural wood frame" } },
    { icon: "warranty", label: { ar: "ضمان سنتين", en: "2-year warranty" } },
    { icon: "install", label: { ar: "تركيب مجاني", en: "Free installation" } },
    { icon: "room", label: room },
    { icon: "crafted", label: { ar: "صُنع بجودة عالية", en: "Crafted to last" } },
  ];
}

const textValue = (ar: string, en = ar): LocalizedText => ({ ar, en });
const cm = { ar: "سم", en: "cm" };

export function productDimensions(product: Product): ProductDimension[] {
  switch (productKind(product)) {
    case "sofas":
      return [
        { key: { ar: "العرض", en: "Width" }, value: textValue("240", "240"), unit: cm },
        { key: { ar: "العمق", en: "Depth" }, value: textValue("95", "95"), unit: cm },
        { key: { ar: "الارتفاع", en: "Height" }, value: textValue("82", "82"), unit: cm },
        { key: { ar: "ارتفاع المقعد", en: "Seat height" }, value: textValue("44", "44"), unit: cm },
        { key: { ar: "عدد المقاعد", en: "Seats" }, value: textValue("3", "3") },
      ];
    case "chairs":
      return [
        { key: { ar: "العرض", en: "Width" }, value: textValue("82", "82"), unit: cm },
        { key: { ar: "العمق", en: "Depth" }, value: textValue("86", "86"), unit: cm },
        { key: { ar: "الارتفاع", en: "Height" }, value: textValue("92", "92"), unit: cm },
        { key: { ar: "ارتفاع المقعد", en: "Seat height" }, value: textValue("43", "43"), unit: cm },
        { key: { ar: "عدد القطع", en: "Pieces" }, value: textValue("1", "1") },
      ];
    case "tables":
      return [
        { key: { ar: "العرض", en: "Width" }, value: textValue("120", "120"), unit: cm },
        { key: { ar: "العمق", en: "Depth" }, value: textValue("70", "70"), unit: cm },
        { key: { ar: "الارتفاع", en: "Height" }, value: textValue("42", "42"), unit: cm },
        { key: { ar: "الخامة", en: "Material" }, value: { ar: "رخام", en: "Marble" } },
        { key: { ar: "الاستخدام", en: "Use" }, value: { ar: "داخلي", en: "Indoor" } },
      ];
    case "beds":
      return [
        { key: { ar: "العرض", en: "Width" }, value: textValue("200", "200"), unit: cm },
        { key: { ar: "الطول", en: "Length" }, value: textValue("220", "220"), unit: cm },
        { key: { ar: "ارتفاع الرأسية", en: "Headboard" }, value: textValue("115", "115"), unit: cm },
        { key: { ar: "المقاس", en: "Size" }, value: { ar: "كنج", en: "King" } },
        { key: { ar: "الاستخدام", en: "Use" }, value: { ar: "غرف النوم", en: "Bedrooms" } },
      ];
    default:
      return [
        { key: { ar: "العرض", en: "Width" }, value: textValue("60", "60"), unit: cm },
        { key: { ar: "العمق", en: "Depth" }, value: textValue("60", "60"), unit: cm },
        { key: { ar: "الارتفاع", en: "Height" }, value: textValue("150", "150"), unit: cm },
        { key: { ar: "الخامة", en: "Material" }, value: { ar: "معدن", en: "Metal" } },
        { key: { ar: "الاستخدام", en: "Use" }, value: { ar: "ديكور", en: "Decor" } },
      ];
  }
}

export function storyFor(product: Product): StoryContent {
  if (product.id === "milano-sofa") {
    return {
      title: {
        ar: "فخامة مصممة لحضور يومي",
        en: "Luxury designed for everyday presence",
      },
      paragraphs: [
        {
          ar: "صُممت أريكة ميلانو لتكون قلب غرفة المعيشة؛ خطوطها الانسيابية ووسائدها العميقة تمنحك راحةً تدعو للاسترخاء، بينما يضفي القماش المخملي لمسةً دافئة تعكس الذوق الرفيع.",
          en: "Milano was designed to be the heart of the living room — flowing lines and deep cushions invite you to unwind, while soft velvet adds a warm touch that reflects refined taste.",
        },
        {
          ar: "يرتكز الهيكل على خشبٍ طبيعي متين يضمن ثباتاً يدوم لأجيال، وتأتي القاعدة الإسفنجية عالية الكثافة لتحافظ على شكلها وراحتها مع مرور السنين. كل تفصيلة فيها مدروسة لتجمع بين الجمال والمتانة.",
          en: "The frame is built on solid natural wood for stability that lasts for generations, while high-density foam keeps its shape and comfort over the years. Every detail balances beauty with durability.",
        },
      ],
      quote: {
        ar: "«ليست مجرد أريكة، بل دعوةٌ للجلوس والتأمل والاجتماع.»",
        en: "“Not just a sofa — an invitation to sit, reflect, and gather.”",
      },
      image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1100&q=80",
    };
  }

  return {
    title: {
      ar: "فخامة مصممة لحضور يومي",
      en: "Luxury designed for everyday presence",
    },
    paragraphs: [
      {
        ar: `صُممت ${product.name.ar} لتكون قطعة محورية في مساحتك؛ تجمع بين الحضور الهادئ والتفاصيل العملية التي تعيش معك كل يوم.`,
        en: `${product.name.en} is designed to become a central piece in your space, balancing calm presence with practical details for everyday living.`,
      },
      {
        ar: "كل تفصيلة فيها مدروسة لتجمع بين الجمال والمتانة، من الخامات المختارة بعناية إلى التشطيب الهادئ الذي ينسجم مع أسلوب رولك.",
        en: "Every detail balances beauty with durability, from carefully selected materials to a calm finish that fits the Rollc aesthetic.",
      },
    ],
    quote: {
      ar: "«ليست مجرد قطعة أثاث، بل حضورٌ يصنع دفء المكان.»",
      en: "“Not just a furniture piece — a presence that brings warmth to the room.”",
    },
    image: galleryFallbacksByCategory[productKind(product)]?.[0] ?? galleryFallbacksByCategory.decor[0],
  };
}

export function roomSuggestions(product: Product): Suggestion[] {
  if (product.id === "milano-sofa") {
    return [
      {
        name: { ar: "طاولة جانبية مناسبة", en: "Matching side table" },
        meta: { ar: "خشب ورخام", en: "Wood & marble" },
        price: "1,150",
        img: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: { ar: "سجادة دافئة", en: "Warm rug" },
        meta: { ar: "صوف بلمسة ترابية", en: "Wool, earthy tone" },
        price: "980",
        img: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: { ar: "مصباح أرضي", en: "Floor lamp" },
        meta: { ar: "إضاءة دافئة", en: "Warm light" },
        price: "890",
        img: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: { ar: "وسائد زخرفية", en: "Decorative cushions" },
        meta: { ar: "مخمل بألوان منسّقة", en: "Coordinated velvet" },
        price: "240",
        img: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&w=200&q=80",
      },
    ];
  }

  return [
    {
      name: { ar: "قطعة جانبية مناسبة", en: "Matching accent piece" },
      meta: { ar: "اختيار منسّق", en: "Styled selection" },
      price: "1,150",
      img: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=200&q=80",
    },
    {
      name: { ar: "سجادة دافئة", en: "Warm rug" },
      meta: { ar: "صوف بلمسة ترابية", en: "Wool, earthy tone" },
      price: "980",
      img: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=200&q=80",
    },
    {
      name: { ar: "مصباح أرضي", en: "Floor lamp" },
      meta: { ar: "إضاءة دافئة", en: "Warm light" },
      price: "890",
      img: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=200&q=80",
    },
    {
      name: { ar: "وسائد زخرفية", en: "Decorative cushions" },
      meta: { ar: "مخمل بألوان منسّقة", en: "Coordinated velvet" },
      price: "240",
      img: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&w=200&q=80",
    },
  ];
}

export const productReviews: Review[] = [
  {
    initials: { ar: "ن", en: "N" },
    name: { ar: "نورة العتيبي", en: "Noura Al-Otaibi" },
    quote: {
      ar: "«جودة الأريكة فاقت توقعاتي، القماش ناعم جداً والجلسة مريحة. التركيب كان احترافياً وفي الوقت المحدد.»",
      en: "“The quality exceeded my expectations — the fabric is so soft and the seat is comfortable. Installation was professional and on time.”",
    },
  },
  {
    initials: { ar: "خ", en: "K" },
    name: { ar: "خالد الدوسري", en: "Khaled Al-Dosari" },
    quote: {
      ar: "«غيّرت شكل مجلسنا بالكامل، اللون الرملي راقٍ ويناسب أي ديكور. أنصح بها بشدة لمن يبحث عن الفخامة.»",
      en: "“It completely transformed our living room. The sand colour is elegant and suits any decor. Highly recommended for anyone seeking luxury.”",
    },
  },
  {
    initials: { ar: "ر", en: "R" },
    name: { ar: "ريم الشهري", en: "Reem Al-Shehri" },
    quote: {
      ar: "«خدمة العملاء ممتازة، وساعدوني في اختيار المقاس المناسب لمساحتي. الأريكة متينة وتبدو أغلى من سعرها.»",
      en: "“Excellent customer service — they helped me pick the right size for my space. The sofa is sturdy and looks more expensive than its price.”",
    },
  },
];

export function accordionItems(): { title: LocalizedText; body: LocalizedText }[] {
  return [
    {
      title: { ar: "الخامات", en: "Materials" },
      body: {
        ar: "قماش مخملي فاخر مقاوم للبهتان، منسوج بكثافة عالية لملمسٍ ناعم ومتانة تدوم. الهيكل من خشب طبيعي متين، والحشوة إسفنج عالي الكثافة يحافظ على شكله.",
        en: "Premium fade-resistant velvet, densely woven for a soft feel and lasting durability. A solid natural-wood frame with high-density foam that holds its shape.",
      },
    },
    {
      title: { ar: "العناية والتنظيف", en: "Care & cleaning" },
      body: {
        ar: "يُنظّف بفرشاة ناعمة بانتظام للحفاظ على ملمس المخمل. عند الانسكاب، جفّف فوراً بقطعة قماش نظيفة دون فرك. تجنّب أشعة الشمس المباشرة المطوّلة، ويُفضّل التنظيف الجاف المتخصص عند الحاجة.",
        en: "Brush regularly with a soft brush to keep the velvet pile. Blot spills immediately with a clean cloth without rubbing. Avoid prolonged direct sunlight; professional dry cleaning is recommended when needed.",
      },
    },
    {
      title: { ar: "التوصيل والتركيب", en: "Delivery & installation" },
      body: {
        ar: "توصيل احترافي داخل المملكة خلال 5 إلى 10 أيام عمل، مع تركيب مجاني بواسطة فريقنا المتخصص في الموعد الذي يناسبك. نتولّى إزالة مواد التغليف بعد التركيب.",
        en: "Professional delivery across the Kingdom within 5–10 business days, with free installation by our specialised team at a time that suits you. We remove all packaging after installation.",
      },
    },
    {
      title: { ar: "الضمان والإرجاع", en: "Warranty & returns" },
      body: {
        ar: "ضمان لمدة سنتين يغطي عيوب التصنيع في الهيكل والخياطة. يمكنك الإرجاع أو الاستبدال خلال 14 يوماً من الاستلام شريطة أن تكون القطعة بحالتها الأصلية.",
        en: "A two-year warranty covering manufacturing defects in the frame and stitching. Returns or exchanges within 14 days of delivery, provided the piece is in its original condition.",
      },
    },
  ];
}

export function discountLabel(product: Product, locale: Locale) {
  if (!product.old) return "";

  const oldPrice = Number(product.old.replace(/,/g, ""));
  const price = Number(product.price.replace(/,/g, ""));

  if (!Number.isFinite(oldPrice) || !Number.isFinite(price) || oldPrice <= price) {
    return locale === "ar" ? "عرض محدود" : "Limited offer";
  }

  return locale === "ar"
    ? `وفّر ${(oldPrice - price).toLocaleString("en-US")} ر.س`
    : `Save ${(oldPrice - price).toLocaleString("en-US")} SAR`;
}
