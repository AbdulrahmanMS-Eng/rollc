"use client";

import { useState } from "react";
import type { Locale } from "@/data/rollc/content";

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
            <img
              src="/logo/2.svg"
              alt="Rollc رولك"
              className="footer-logo"
              draggable={false}
              loading="lazy"
              decoding="async"
            />
            <p className="foot-statement">
              {locale === "ar"
                ? "رولك — حيث يلتقي التصميم بالدفء. نصنع مساحاتٍ تُحاكي ذوقك وتروي حكايتك."
                : "Rollc — where design meets warmth. We craft spaces that echo your taste and tell your story."}
            </p>
            <div className="socials">
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="4.5"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="#" aria-label="X">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="3"/>
                  <polygon points="10,9 17,12 10,15" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="#" aria-label="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34v-6.9a8.18 8.18 0 0 0 4.77 1.52V6.48a4.85 4.85 0 0 1-1-.21z"/>
                </svg>
              </a>
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
