"use client";

import { useStore } from "@/components/ui/StoreProvider";

export default function Toast() {
  const { toast } = useStore();
  return (
    <div className={`toast${toast ? " show" : ""}`}>
      <span className="tdot">✦</span>
      <span>{toast}</span>
    </div>
  );
}
