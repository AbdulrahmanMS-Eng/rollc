"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries/types";
import { useStore } from "@/components/ui/StoreProvider";

const swatchColors = ["#c9b49a", "#4a3b2d", "#2a3338", "#7a6a58"];

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export default function QuickViewModal({ locale, dict }: Props) {
  const { quickProduct, closeQuickView, addToCart, showToast } = useStore();
  const [swatch, setSwatch] = useState(0);
  const open = quickProduct !== null;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeQuickView();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeQuickView]);

  const onAdd = () => {
    addToCart();
    showToast(dict.productsSection.addedToCart);
    closeQuickView();
  };

  return (
    <div className={`modal${open ? " open" : ""}`} onClick={(e) => e.target === e.currentTarget && closeQuickView()}>
      <div className="modal-box">
        <div className="modal-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {quickProduct && <img src={quickProduct.img} alt={quickProduct.name[locale]} />}
        </div>
        <div className="modal-info">
          <button className="modal-close" onClick={closeQuickView} aria-label={dict.a11y.close}>
            ✕
          </button>
          {quickProduct && (
            <>
              <span className="m-cat">{quickProduct.cat[locale]}</span>
              <h3>{quickProduct.name[locale]}</h3>
              <div className="m-desc">{quickProduct.desc[locale]}</div>
              <div className="m-price">
                {quickProduct.price}{" "}
                <span style={{ fontSize: ".9rem", color: "var(--muted)" }}>{dict.productsSection.currency}</span>
              </div>
              <div className="m-opts">
                <p className="lbl">{dict.productsSection.chooseColour}</p>
                <div className="swatches">
                  {swatchColors.map((color, i) => (
                    <span
                      key={i}
                      className={`swatch${swatch === i ? " sel" : ""}`}
                      style={{ background: color }}
                      onClick={() => setSwatch(i)}
                    />
                  ))}
                </div>
              </div>
              <button className="btn btn--outline" onClick={onAdd} style={{ width: "100%" }}>
                <span>{dict.productsSection.addToCart}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
