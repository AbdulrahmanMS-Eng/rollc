"use client";

import { useRollcStore } from "@/components/rollc/ui/RollcStore";

export function Toast() {
  const { toast } = useRollcStore();
  return <div className={`toast${toast ? " show" : ""}`}><span className="tdot">✦</span><span>{toast}</span></div>;
}
