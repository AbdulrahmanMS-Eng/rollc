import type { Locale } from "@/lib/i18n";

export interface Pillar {
  title: string;
  body: string;
}

export interface Dictionary {
  topbar: string;
  topbarHighlight: string;
  nav: {
    home: string;
    living: string;
    bedroom: string;
    tables: string;
    decor: string;
    offers: string;
    showrooms: string;
    shopNow: string;
  };
  a11y: {
    search: string;
    cart: string;
    menu: string;
    close: string;
    addToWishlist: string;
    language: string;
    modeSwitch: string;
    email: string;
  };
  hero: {
    eyebrow: string;
    titleLead: string;
    titleEm: string;
    body: string;
    ctaPrimary: string;
    ctaSecondary: string;
    cardTag: string;
    cardName: string;
    cardPrice: string;
    scroll: string;
  };
  categoriesSection: {
    eyebrow: string;
    title: string;
    link: string;
    discover: string;
  };
  signature: {
    eyebrow: string;
    title: string;
    body: string;
    badgeNum: string;
    badgeLabel: string;
    pillars: Pillar[];
  };
  productsSection: {
    eyebrow: string;
    title: string;
    link: string;
    quickView: string;
    currency: string;
    addedToCart: string;
    addedToWishlist: string;
    cartHasItems: string;
    cartEmpty: string;
    chooseColour: string;
    addToCart: string;
  };
  showroom: {
    eyebrow: string;
    title: string;
    body: string;
    dayMode: string;
    nightMode: string;
    roomName: string;
    roomSub: string;
    lightsOff: string;
    lightsOn: string;
    note: string;
  };
  collectionsSection: {
    eyebrow: string;
    title: string;
    explore: string;
  };
  branches: {
    eyebrow: string;
    title: string;
    body: string;
    cta: string;
  };
  footer: {
    statement: string;
    shopTitle: string;
    shopLinks: string[];
    companyTitle: string;
    companyLinks: string[];
    joinTitle: string;
    joinBody: string;
    emailPlaceholder: string;
    subscribe: string;
    subscribeOk: string;
    subscribeErr: string;
    rights: string;
    payLabel: string;
  };
  search: {
    placeholder: string;
    trending: string;
    tags: string[];
  };
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ar: () => import("./ar").then((m) => m.default),
  en: () => import("./en").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
