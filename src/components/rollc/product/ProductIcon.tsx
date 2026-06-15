import type { ProductSpec } from "@/components/rollc/product/productPageData";

export function ProductIcon({ icon }: { icon: ProductSpec["icon"] }) {
  switch (icon) {
    case "fabric":
      return <svg viewBox="0 0 24 24"><path d="M4 7c4-3 12-3 16 0M4 7v10c4 3 12 3 16 0V7M4 12c4 3 12 3 16 0" /></svg>;
    case "wood":
      return <svg viewBox="0 0 24 24"><path d="M4 9h16M4 9 6 4h12l2 5M4 9v11h16V9M9 13v4M15 13v4" /></svg>;
    case "warranty":
      return <svg viewBox="0 0 24 24"><path d="M12 3 4 6v6c0 4 3.5 7.5 8 9 4.5-1.5 8-5 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>;
    case "install":
      return <svg viewBox="0 0 24 24"><path d="M12 2v6m0 0 3-3m-3 3L9 5M5 13h14l-1.5 8h-11L5 13Z" /></svg>;
    case "room":
      return <svg viewBox="0 0 24 24"><path d="M3 10h18M5 10V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3M4 10v8M20 10v8M4 16h16" /></svg>;
    case "crafted":
      return <svg viewBox="0 0 24 24"><path d="m12 2 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8L12 2Z" /></svg>;
    default:
      return null;
  }
}
