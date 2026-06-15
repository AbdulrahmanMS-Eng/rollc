"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries/types";
import { navItems } from "@/data/site";
import { useStore } from "@/components/ui/StoreProvider";
import { SearchIcon, CartIcon } from "@/components/ui/icons";

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export default function Header({ locale, dict }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cart, cartPulse, showToast, setSearchOpen } = useStore();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Build a same-path href for a given locale by swapping the leading segment.
  const otherLocale: Locale = locale === "ar" ? "en" : "ar";
  const hrefFor = (l: Locale) => pathname.replace(/^\/(ar|en)(?=\/|$)/, `/${l}`);
  const switchHref = hrefFor(otherLocale);

  const onCart = () =>
    showToast(
      cart
        ? dict.productsSection.cartHasItems.replace("{n}", String(cart))
        : dict.productsSection.cartEmpty
    );

  return (
    <>
      <header className={`header${scrolled ? " scrolled" : ""}`}>
        <div className="wrap">
          <nav className="nav">
            <Link href={`/${locale}`} className="brand" aria-label="Rollc رولك">
              <span className="mark">
                Roll<b>c</b>
              </span>
              <span className="ar">رولـك</span>
            </Link>

            <ul className="menu">
              {navItems.map((item, i) => (
                <li key={i}>
                  <Link href={item.href}>{dict.nav[item.key]}</Link>
                </li>
              ))}
            </ul>

            <div className="actions">
              <button className="icon-btn" onClick={() => setSearchOpen(true)} aria-label={dict.a11y.search}>
                <SearchIcon />
              </button>
              <button className="icon-btn" onClick={onCart} aria-label={dict.a11y.cart}>
                <CartIcon />
                <span key={cartPulse} className={`cart-count${cartPulse ? " pop" : ""}`}>
                  {cart}
                </span>
              </button>
              <div className="lang-switch" role="group" aria-label={dict.a11y.language}>
                <Link href={hrefFor("ar")} className={locale === "ar" ? "active" : ""}>
                  ع
                </Link>
                <Link href={hrefFor("en")} className={locale === "en" ? "active" : ""}>
                  EN
                </Link>
              </div>
              <Link href="#products" className="cta-shop">
                {dict.nav.shopNow}
              </Link>
              <button
                className={`burger${mobileOpen ? " open" : ""}`}
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={dict.a11y.menu}
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div className={`mobile-nav${mobileOpen ? " open" : ""}`}>
        <button className="mn-close" onClick={() => setMobileOpen(false)} aria-label={dict.a11y.close}>
          ✕
        </button>
        {navItems.map((item, i) => (
          <Link key={i} href={item.href} onClick={() => setMobileOpen(false)}>
            {dict.nav[item.key]}
          </Link>
        ))}
        <Link
          href={switchHref}
          className="mobile-lang-link"
          onClick={() => setMobileOpen(false)}
        >
          {otherLocale === "en" ? "English" : "العربية"}
        </Link>
        <Link href="#products" className="btn btn--solid mn-cta" onClick={() => setMobileOpen(false)}>
          {dict.nav.shopNow}
        </Link>
      </div>
    </>
  );
}
