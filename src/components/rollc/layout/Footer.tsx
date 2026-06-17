"use client";

import { useState } from "react";
import type { Locale } from "@/data/rollc/content";
import { Logo } from "@/components/rollc/brand/Logo";

const shopLinks: Record<Locale, { label: string; slug: string }[]> = {
  ar: [
    { label: "الأرائك", slug: "sofas" },
    { label: "غرف النوم", slug: "beds" },
    { label: "طاولات الطعام", slug: "tables" },
    { label: "الديكور", slug: "decor" },
    { label: "كراسي", slug: "chairs" },
  ],
  en: [
    { label: "Sofas", slug: "sofas" },
    { label: "Bedrooms", slug: "beds" },
    { label: "Dining Tables", slug: "tables" },
    { label: "Decor", slug: "decor" },
    { label: "Chairs", slug: "chairs" },
  ],
};

const companyLinks: Record<Locale, { label: string; href: string }[]> = {
  ar: [
    { label: "من نحن", href: "/about" },
    { label: "الفروع", href: "/#branches" },
    { label: "التوصيل والتركيب", href: "#" },
    { label: "سياسة الإرجاع", href: "#" },
    { label: "تواصل معنا", href: "/about#contact" },
  ],
  en: [
    { label: "About us", href: "/en/about" },
    { label: "Showrooms", href: "/en#branches" },
    { label: "Delivery & Install", href: "#" },
    { label: "Returns", href: "#" },
    { label: "Contact", href: "/en/about#contact" },
  ],
};

export function Footer({ locale }: { locale: Locale }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const subscribe = () => {
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setMessage(locale === "ar" ? "تم الاشتراك بنجاح ✦ مرحباً بك في رولك" : "Subscribed ✦ Welcome to Rollc");
      setEmail("");
      return;
    }

    setMessage(locale === "ar" ? "فضلاً أدخل بريداً إلكترونياً صحيحاً" : "Please enter a valid email");
  };

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <Logo locale={locale} tone="paper" className="rollc-logo" />
            <p className="foot-statement">
              {locale === "ar"
                ? "رولك — حيث يلتقي التصميم بالدفء. نصنع مساحاتٍ تُحاكي ذوقك وتروي حكايتك."
                : "Rollc — where design meets warmth. We craft spaces that echo your taste and tell your story."}
            </p>
            <div className="socials">
              <a href="#" aria-label="Instagram">IG</a>
              <a href="#" aria-label="X">X</a>
              <a href="#" aria-label="Pinterest">PIN</a>
              <a href="#" aria-label="TikTok">TT</a>
            </div>
          </div>

          <div className="foot-col">
            <h4>{locale === "ar" ? "تسوّق" : "Shop"}</h4>
            {shopLinks[locale].map(({ label, slug }) => (
              <a href={`${locale === "ar" ? "" : "/en"}/categories/${slug}`} key={label}>{label}</a>
            ))}
          </div>

          <div className="foot-col">
            <h4>{locale === "ar" ? "الشركة" : "Company"}</h4>
            {companyLinks[locale].map((link) => (
              <a href={link.href} key={link.label}>{link.label}</a>
            ))}
          </div>

          <div className="foot-col news">
            <h4>{locale === "ar" ? "انضم إلى رولك" : "Join Rollc"}</h4>
            <p>
              {locale === "ar"
                ? "اشترك لتصلك المجموعات الجديدة والعروض الحصرية قبل الجميع."
                : "Subscribe for new collections and exclusive offers before anyone else."}
            </p>

            <div className="news-form">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={locale === "ar" ? "بريدك الإلكتروني" : "Your email"}
                aria-label={locale === "ar" ? "البريد الإلكتروني" : "Email"}
              />
              <button onClick={subscribe}>{locale === "ar" ? "اشترك" : "Subscribe"}</button>
            </div>

            <div className="news-ok">{message}</div>
          </div>
        </div>

        <div className="foot-bottom">
          <span>
            © 2026 Rollc رولك. <span>{locale === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}</span>
          </span>
          <span className="pay">
            <span>{locale === "ar" ? "طرق الدفع:" : "We accept:"}</span> Mada · Visa · Apple Pay · Tamara
          </span>
        </div>
      </div>
    </footer>
  );
}
