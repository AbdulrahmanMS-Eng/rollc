"use client";

import { useState } from "react";
import { currency } from "@/data/rollc/content";
import { useRollcStore } from "@/components/rollc/ui/RollcStore";
import styles from "./CartDrawer.module.css";

export function CartDrawer() {
  const { locale, cartItems, cartCount, cartOpen, closeCart, removeFromCart, setQty } = useRollcStore();
  const cur = currency(locale);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [orderSent, setOrderSent] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(String(item.product.price).replace(/[^\d.]/g, "")) || 0;
    return sum + price * item.qty;
  }, 0);

  const handleSendOrder = () => {
    const val = email.trim();
    const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val);
    if (!valid) {
      setEmailError(locale === "ar" ? "أدخل بريداً إلكترونياً صحيحاً" : "Enter a valid email");
      return;
    }
    console.log("[Rollc Cart] order:", { email: val, cartItems });
    setOrderSent(true);
    setEmailError("");
    setEmail("");
  };

  return (
    <>
      <div
        className={`${styles.overlay} ${cartOpen ? styles.overlayOpen : ""}`}
        onClick={closeCart}
        aria-hidden
      />
      <aside
        className={`${styles.drawer} ${cartOpen ? styles.drawerOpen : ""}`}
        aria-label={locale === "ar" ? "سلة التسوق" : "Shopping cart"}
        aria-hidden={!cartOpen}
      >
        <div className={styles.head}>
          <h2 className={styles.title}>
            {locale === "ar" ? "سلة التسوق" : "Your cart"}
            {cartCount > 0 && <span className={styles.count}>{cartCount}</span>}
          </h2>
          <button
            className={styles.closeBtn}
            onClick={closeCart}
            aria-label={locale === "ar" ? "إغلاق" : "Close"}
          >
            <svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className={styles.body}>
          {cartItems.length === 0 ? (
            <div className={styles.empty}>
              <svg viewBox="0 0 24 24"><path d="M6 7h12l-1 13H7L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
              <p>{locale === "ar" ? "سلتك فارغة" : "Your cart is empty"}</p>
            </div>
          ) : (
            <>
              <ul className={styles.items}>
                {cartItems.map((item) => (
                  <li key={item.id} className={styles.item}>
                    <img
                      src={item.product.img}
                      alt={item.product.name[locale]}
                      className={styles.thumb}
                    />
                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>{item.product.name[locale]}</div>
                      {(item.color || item.size) && (
                        <div className={styles.itemMeta}>
                          {[item.color, item.size].filter(Boolean).join(" · ")}
                        </div>
                      )}
                      <div className={styles.itemPrice}>{item.product.price} {cur}</div>
                    </div>
                    <div className={styles.itemControls}>
                      <div className={styles.qty}>
                        <button
                          onClick={() => setQty(item.id, item.qty - 1)}
                          aria-label={locale === "ar" ? "إنقاص" : "Decrease"}
                        >−</button>
                        <span>{item.qty}</span>
                        <button
                          onClick={() => setQty(item.id, item.qty + 1)}
                          aria-label={locale === "ar" ? "زيادة" : "Increase"}
                        >+</button>
                      </div>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeFromCart(item.id)}
                        aria-label={locale === "ar" ? "إزالة" : "Remove"}
                      >
                        <svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className={styles.subtotalRow}>
                <span className={styles.subtotalLabel}>{locale === "ar" ? "المجموع" : "Subtotal"}</span>
                <span className={styles.subtotalAmount}>{subtotal.toLocaleString("en-US")} {cur}</span>
              </div>
            </>
          )}
        </div>

        <div className={styles.foot}>
          {orderSent ? (
            <div className={styles.confirm}>
              <span>
                {locale === "ar"
                  ? "تم استلام طلبك ✦ سيتواصل معك فريق رولك عبر بريدك لتأكيد المقاسات والألوان والسعر"
                  : "Order received ✦ the Rollc team will contact you by email to confirm sizes, colours & price"}
              </span>
            </div>
          ) : (
            <>
              <p className={styles.footNote}>
                {locale === "ar"
                  ? "أرسل طلبك وسيتواصل معك فريق رولك لتأكيد التفاصيل"
                  : "Send your order and we'll get in touch to confirm details"}
              </p>
              <div className={styles.emailRow}>
                <input
                  className={styles.emailInput}
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSendOrder(); }}
                  placeholder={locale === "ar" ? "بريدك الإلكتروني" : "Your email"}
                  aria-label={locale === "ar" ? "البريد الإلكتروني" : "Email"}
                />
                <button className={styles.sendBtn} onClick={handleSendOrder}>
                  {locale === "ar" ? "أرسل الطلب" : "Send order"}
                </button>
              </div>
              {emailError && (
                <p className={styles.emailError} role="alert">{emailError}</p>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}
