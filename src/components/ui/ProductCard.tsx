"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries/types";
import type { Product } from "@/data/products";
import { useStore } from "@/components/ui/StoreProvider";
import { HeartIcon, PlusIcon } from "@/components/ui/icons";

interface Props {
  product: Product;
  locale: Locale;
  dict: Dictionary;
}

export default function ProductCard({ product, locale, dict }: Props) {
  const { addToCart, showToast, openQuickView } = useStore();
  const [faved, setFaved] = useState(false);
  const ps = dict.productsSection;

  const onAdd = () => {
    addToCart();
    showToast(ps.addedToCart);
  };

  const onFav = () => {
    setFaved(true);
    showToast(ps.addedToWishlist);
  };

  return (
    <article className="card">
      <div className="card-media">
        {product.tag?.[locale] ? <span className="card-tag">{product.tag[locale]}</span> : null}
        <button
          className="card-fav"
          onClick={onFav}
          aria-label={dict.a11y.addToWishlist}
          style={faved ? { color: "var(--gold)" } : undefined}
        >
          <HeartIcon />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.img} alt={product.name[locale]} loading="lazy" />
        <button className="quick" onClick={() => openQuickView(product)}>
          {ps.quickView}
        </button>
      </div>
      <div className="card-body">
        <span className="card-cat">{product.cat[locale]}</span>
        <h3 className="card-name">{product.name[locale]}</h3>
        <p className="card-desc">{product.desc[locale]}</p>
        <div className="card-foot">
          <span className="price">
            <b>{product.price}</b> <span className="cur">{ps.currency}</span>
            {product.old ? <span className="old">{product.old}</span> : null}
          </span>
          <button className="add-cart" onClick={onAdd} aria-label={ps.addToCart}>
            <PlusIcon />
          </button>
        </div>
      </div>
    </article>
  );
}
