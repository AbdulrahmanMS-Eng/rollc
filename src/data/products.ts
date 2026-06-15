import type { Locale } from "@/lib/i18n";

type Localized = Record<Locale, string>;

export interface Product {
  id: string;
  cat: Localized;
  name: Localized;
  desc: Localized;
  price: string;
  old?: string;
  tag?: Localized;
  img: string;
}

export const products: Product[] = [
  {
    id: "milano-sofa",
    cat: { ar: "أرائك", en: "Sofas" },
    name: { ar: "أريكة ميلانو", en: "Milano Sofa" },
    desc: { ar: "أريكة ثلاثية بقماش مخملي ناعم.", en: "Three-seater in soft velvet upholstery." },
    price: "4,250",
    old: "4,990",
    tag: { ar: "الأكثر مبيعاً", en: "Best seller" },
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "oslo-chair",
    cat: { ar: "كراسي", en: "Chairs" },
    name: { ar: "كرسي أوسلو", en: "Oslo Chair" },
    desc: { ar: "كرسي مريح بهيكل خشب الجوز.", en: "Lounge chair on a walnut frame." },
    price: "1,750",
    tag: { ar: "جديد", en: "New" },
    img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "nordic-table",
    cat: { ar: "طاولات", en: "Tables" },
    name: { ar: "طاولة نورديك", en: "Nordic Table" },
    desc: { ar: "طاولة قهوة بسطح رخامي أنيق.", en: "Coffee table with a marble top." },
    price: "2,900",
    img: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "serene-bed",
    cat: { ar: "أسرّة", en: "Beds" },
    name: { ar: "سرير سرين", en: "Serene Bed" },
    desc: { ar: "سرير كنج منجّد بلون رملي دافئ.", en: "Upholstered king bed in warm sand." },
    price: "5,600",
    old: "6,400",
    tag: { ar: "عرض", en: "Offer" },
    img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "roma-sofa",
    cat: { ar: "أرائك", en: "Sofas" },
    name: { ar: "أريكة روما", en: "Roma Sofa" },
    desc: { ar: "أريكة زاوية جلدية بلمسة فاخرة.", en: "Leather corner sofa, luxe finish." },
    price: "6,800",
    tag: { ar: "فاخر", en: "Premium" },
    img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "copenhagen-chair",
    cat: { ar: "كراسي", en: "Chairs" },
    name: { ar: "كرسي كوبنهاغن", en: "Copenhagen Chair" },
    desc: { ar: "كرسي مكتب بتصميم اسكندنافي.", en: "Scandinavian-style accent chair." },
    price: "1,450",
    img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "arabesque-dining",
    cat: { ar: "طاولات", en: "Tables" },
    name: { ar: "طاولة طعام أرابيسك", en: "Arabesque Dining" },
    desc: { ar: "طاولة طعام لثمانية أشخاص.", en: "Dining table seating eight." },
    price: "7,200",
    tag: { ar: "جديد", en: "New" },
    img: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "amber-lamp",
    cat: { ar: "ديكور", en: "Decor" },
    name: { ar: "مصباح أمبر", en: "Amber Lamp" },
    desc: { ar: "مصباح أرضي بإضاءة دافئة.", en: "Floor lamp with warm glow." },
    price: "890",
    old: "1,150",
    tag: { ar: "عرض", en: "Offer" },
    img: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=700&q=80",
  },
];

export interface Category {
  num: string;
  title: Localized;
  sub: Localized;
  img: string;
}

export const categories: Category[] = [
  {
    num: "/ 01",
    title: { ar: "غرف المعيشة", en: "Living Rooms" },
    sub: { ar: "مساحاتٌ للقاء والدفء", en: "Spaces for gathering and warmth" },
    img: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    num: "/ 02",
    title: { ar: "غرف النوم", en: "Bedrooms" },
    sub: { ar: "هدوءٌ يبدأ من التفاصيل", en: "Calm that begins in the details" },
    img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  },
  {
    num: "/ 03",
    title: { ar: "غرف الطعام", en: "Dining" },
    sub: { ar: "موائد تجمع الأحبة", en: "Tables that bring people together" },
    img: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=80",
  },
  {
    num: "/ 04",
    title: { ar: "أثاث المكاتب", en: "Office" },
    sub: { ar: "إنتاجيةٌ بأناقة", en: "Productivity, elegantly" },
    img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
  },
  {
    num: "/ 05",
    title: { ar: "الديكور والإكسسوارات", en: "Decor & Accents" },
    sub: { ar: "لمساتٌ تُكمل المشهد", en: "Finishing touches that complete the scene" },
    img: "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?auto=format&fit=crop&w=900&q=80",
  },
];

export interface Collection {
  idx: string;
  title: Localized;
  sub: Localized;
  img: string;
}

export const collections: Collection[] = [
  {
    idx: "I",
    title: { ar: "مجموعة الهدوء", en: "The Serenity" },
    sub: { ar: "بألوانٍ ترابية ومساحاتٍ تتنفّس بسكينة.", en: "Earthy tones and spaces that breathe with calm." },
    img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1000&q=80",
  },
  {
    idx: "II",
    title: { ar: "مجموعة الفخامة", en: "The Opulence" },
    sub: { ar: "خاماتٌ راقية وتفاصيل ذهبية تعكس الذوق الرفيع.", en: "Refined materials and golden details for a discerning taste." },
    img: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=1000&q=80",
  },
  {
    idx: "III",
    title: { ar: "المساحات العصرية", en: "Modern Spaces" },
    sub: { ar: "خطوطٌ نظيفة لروحٍ معاصرة وحياةٍ مرنة.", en: "Clean lines for a contemporary, flexible way of living." },
    img: "https://images.unsplash.com/photo-1618219740975-d40978bb7378?auto=format&fit=crop&w=1000&q=80",
  },
];
