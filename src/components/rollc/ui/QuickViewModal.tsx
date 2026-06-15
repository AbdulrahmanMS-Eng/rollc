"use client";

import { currency } from "@/data/rollc/content";
import { useRollcStore } from "@/components/rollc/ui/RollcStore";

export function QuickViewModal() {
  const { locale, selectedProduct, closeQuickView, addToCart } = useRollcStore();

  return (
    <div className={`modal${selectedProduct ? " open" : ""}`} onClick={(e) => { if (e.target === e.currentTarget) closeQuickView(); }}>
      {selectedProduct ? (
        <div className="modal-box">
          <div className="modal-img"><img src={selectedProduct.img} alt={selectedProduct.name[locale]} /></div>
          <div className="modal-info">
            <button className="modal-close" onClick={closeQuickView} aria-label="close">✕</button>
            <span className="m-cat">{selectedProduct.cat[locale]}</span>
            <h3>{selectedProduct.name[locale]}</h3>
            <div className="m-desc">{selectedProduct.desc[locale]}</div>
            <div className="m-price">{selectedProduct.price} <span style={{ fontSize: ".9rem", color: "var(--muted)" }}>{currency(locale)}</span></div>
            <div className="m-opts">
              <p className="lbl">{locale === "ar" ? "اختر اللون:" : "Choose colour:"}</p>
              <div className="swatches">
                {["#c9b49a", "#4a3b2d", "#2a3338", "#7a6a58"].map((c, i) => <span key={c} className={`swatch${i === 0 ? " sel" : ""}`} style={{ background: c }} />)}
              </div>
            </div>
            <button className="btn btn--outline" style={{ width: "100%" }} onClick={() => { addToCart(); closeQuickView(); }}>
              <span>{locale === "ar" ? "أضف إلى السلة" : "Add to cart"}</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
