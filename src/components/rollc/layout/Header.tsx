"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { navItems, type Locale } from "@/data/rollc/content";
import { useRollcStore } from "@/components/rollc/ui/RollcStore";

export function Header({ locale }: { locale: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cart, cartPop, openSearch, showCartStatus } = useRollcStore();

  useEffect(() => {
    const shell = document.querySelector(".scroll-shell");

    const onScroll = () => {
      setScrolled(shell ? shell.scrollTop > 30 : window.scrollY > 30);
    };

    onScroll();

    if (shell) {
      shell.addEventListener("scroll", onScroll, { passive: true });
      return () => shell.removeEventListener("scroll", onScroll);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const pathname = usePathname();

  const goLang = (nextLocale: Locale) => {
    const isEn = pathname.startsWith("/en");
    const arPath = isEn ? pathname.slice(3) || "/" : pathname;
    window.location.href = nextLocale === "ar" ? arPath : `/en${arPath === "/" ? "" : arPath}`;
  };

  return (
    <>
      <header className={`header${scrolled ? " scrolled" : ""}`} id="header">
        <div className="wrap">
          <nav className="nav">
            <a href={locale === "ar" ? "/" : "/en"} className="brand" aria-label="Rollc رولك">
              <span className="mark">
                Roll<b>c</b>
              </span>
              <span className="ar">رولـك</span>
            </a>

            <ul className="menu">
              {navItems.map((item) => (
                <li key={`${item.href.en}-${item.label.en}`}>
                  <a href={item.href[locale]}>{item.label[locale]}</a>
                </li>
              ))}
            </ul>

            <div className="actions">
              <button
                className="icon-btn"
                onClick={openSearch}
                aria-label={locale === "ar" ? "بحث" : "Search"}
              >
                <svg viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </button>

              <button
                className="icon-btn"
                onClick={showCartStatus}
                aria-label={locale === "ar" ? "السلة" : "Cart"}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M6 7h12l-1 13H7L6 7Z" />
                  <path d="M9 7a3 3 0 0 1 6 0" />
                </svg>
                <span className={`cart-count${cartPop ? " pop" : ""}`}>{cart}</span>
              </button>

              <div className="lang-switch" role="group" aria-label="Language">
                <button
                  type="button"
                  className={locale === "ar" ? "active" : ""}
                  onClick={() => goLang("ar")}
                >
                  ع
                </button>
                <button
                  type="button"
                  className={locale === "en" ? "active" : ""}
                  onClick={() => goLang("en")}
                >
                  EN
                </button>
              </div>

              <a href="#products" className="cta-shop">
                {locale === "ar" ? "تسوّق الآن" : "Shop now"}
              </a>

              <button
                className={`burger${mobileOpen ? " open" : ""}`}
                onClick={() => setMobileOpen(true)}
                aria-label={locale === "ar" ? "القائمة" : "Menu"}
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div className={`mobile-nav${mobileOpen ? " open" : ""}`} id="mobileNav">
        <button
          className="mn-close"
          onClick={() => setMobileOpen(false)}
          aria-label={locale === "ar" ? "إغلاق" : "Close"}
        >
          ✕
        </button>

        {navItems.map((item) => (
          <a
            key={`mobile-${item.href.en}-${item.label.en}`}
            href={item.href[locale]}
            onClick={() => setMobileOpen(false)}
          >
            {item.label[locale]}
          </a>
        ))}

        <a
          href="#products"
          className="btn btn--solid mn-cta"
          onClick={() => setMobileOpen(false)}
        >
          {locale === "ar" ? "تسوّق الآن" : "Shop now"}
        </a>
      </div>
    </>
  );
}
