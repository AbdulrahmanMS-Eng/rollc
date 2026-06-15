"use client";

import { useEffect, useRef } from "react";
import { useRollcStore } from "@/components/rollc/ui/RollcStore";

export function SearchPanel() {
  const { locale, searchOpen, closeSearch } = useRollcStore();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!searchOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, [searchOpen]);

  return (
    <>
      <div className={`search-panel${searchOpen ? " open" : ""}`}>
        <div className="sp-row">
          <button className="icon-btn" aria-hidden="true"><svg viewBox="0 0 24 24" style={{ width: 22, height: 22, stroke: "var(--brown)", strokeWidth: 1.5, fill: "none" }}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg></button>
          <input ref={inputRef} type="text" placeholder={locale === "ar" ? "ابحث عن أريكة، طاولة، سرير…" : "Search sofas, tables, beds…"} aria-label="search" />
          <button className="sp-close" onClick={closeSearch} aria-label="close">✕</button>
        </div>
        <div className="sp-tags">
          <span>{locale === "ar" ? "الأكثر بحثاً:" : "Trending:"}</span>
          {(locale === "ar" ? ["أريكة جلد", "طاولة رخام", "سرير كنج", "كرسي مخمل", "مجموعة الفخامة"] : ["Leather sofa", "Marble table", "King bed", "Velvet chair", "The Opulence"]).map((x) => <a key={x} href="#products" onClick={closeSearch}>{x}</a>)}
        </div>
      </div>
      <div className={`overlay${searchOpen ? " open" : ""}`} onClick={closeSearch} />
    </>
  );
}
