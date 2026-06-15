# Rollc — Professional Next.js Architecture

تحويل احترافي كامل لتصميم رولك إلى Next.js 16 App Router، تم التحقق منه ببناء فعلي ناجح (`/ar` و `/en` كصفحات SSG).

## الهيكلة

```
src/
  app/
    layout.tsx            # جذري: يمرر children فقط (html في تخطيط اللغة)
    page.tsx              # تحويل إلى /ar
    globals.css           # يستورد tailwind + tokens + components
    [locale]/
      layout.tsx          # الخطوط + lang/dir + StoreProvider + Header/Footer/Overlays
      page.tsx            # Server Component يجمّع الأقسام
  components/
    layout/  → TopBar, Header(client), Footer, NewsletterForm(client)
    sections/→ Hero, Categories, Signature, Products, Showroom(client), Collections, Branches
    ui/      → ProductCard(client), QuickViewModal(client), SearchPanel(client),
               Toast(client), Reveal(client), StoreProvider(client), icons
  data/      → products.ts (منتجات/فئات/مجموعات), site.ts (فروع/صور/روابط)
  dictionaries/ → ar.ts, en.ts, types.ts (getDictionary)
  lib/       → i18n.ts (locales, dir, helpers)
  styles/    → tokens.css (@theme + متغيرات + reset), components.css (@layer)
  middleware.ts          # تحويل المسارات بدون locale إلى /ar
next.config.ts           # remotePatterns لـ images.unsplash.com
```

## ماذا تغيّر عن الـ HTML الأصلي

- **اللغة**: لا `data-ar/data-en`. كل لغة لها URL مستقل (`/ar` RTL، `/en` LTR) من السيرفر — SEO حقيقي.
- **التفاعلات**: React state بدل `getElementById`. السلة/المودال/البحث/التوست في `StoreProvider` واحد.
- **البيانات**: المنتجات في `data/` بدل حقن JS في DOM.
- **Server افتراضياً**: `'use client'` فقط على المكوّنات التفاعلية.
- **CSS**: `tokens.css` للمتغيرات والـ reset، `components.css` داخل `@layer components`.

## التثبيت

داخل `~/rollc` بعد نسخ `src/` و `next.config.ts`:

```bash
# الحزم المطلوبة (موجودة افتراضياً في مشروع Next 16):
# next react react-dom — لا تحتاج أي مكتبة i18n خارجية

pnpm dev      # تطوير
pnpm build    # بناء إنتاجي
```

افتح `http://localhost:3000` → يحوّل تلقائياً إلى `/ar`. بدّل إلى `/en` من مفتاح اللغة.

## ملاحظات

- **الخطوط**: عبر `next/font/google` (El Messiri, Tajawal, Cormorant, Jost) — self-hosted بدون layout shift.
- **الصور**: حالياً `<img>` (متفق عليه). للترقية لـ `next/image`: `remotePatterns` جاهز في `next.config.ts`.
- **middleware**: Next 16 يفضّل اسم `proxy.ts` (تحذير فقط، `middleware.ts` يشتغل). لإسكات التحذير: أعد تسمية الملف إلى `src/proxy.ts` بنفس المحتوى.
- **مبدّل اللغة**: يبدّل أول مقطع في المسار فقط ويحافظ على الباقي.
