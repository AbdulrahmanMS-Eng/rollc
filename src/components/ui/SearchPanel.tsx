"use client";

import { useEffect, useRef } from "react";
import type { Dictionary } from "@/dictionaries/types";
import { useStore } from "@/components/ui/StoreProvider";
import { SearchIcon } from "@/components/ui/icons";

export default function SearchPanel({ dict }: { dict: Dictionary }) {
  const { searchOpen, setSearchOpen } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  return (
    <>
      <div className={`search-panel${searchOpen ? " open" : ""}`}>
        <div className="sp-row">
          <button className="icon-btn" aria-hidden="true" tabIndex={-1}>
            <SearchIcon style={{ width: 22, height: 22, stroke: "var(--brown)", strokeWidth: 1.5, fill: "none" }} />
          </button>
          <input ref={inputRef} type="text" placeholder={dict.search.placeholder} aria-label={dict.a11y.search} />
          <button className="sp-close" onClick={() => setSearchOpen(false)} aria-label={dict.a11y.close}>
            ✕
          </button>
        </div>
        <div className="sp-tags">
          <span>{dict.search.trending}</span>
          {dict.search.tags.map((tag, i) => (
            <a key={i} href="#products" onClick={() => setSearchOpen(false)}>
              {tag}
            </a>
          ))}
        </div>
      </div>
      <div className={`overlay${searchOpen ? " open" : ""}`} onClick={() => setSearchOpen(false)} />
    </>
  );
}
