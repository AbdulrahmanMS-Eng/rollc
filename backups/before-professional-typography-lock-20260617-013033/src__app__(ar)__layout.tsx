import type { Metadata } from "next";
import "../globals.css";
import { rollcFontClassName } from "../fonts";

export const metadata: Metadata = {
  title: "Rollc | رولك للأثاث الفاخر",
  description: "رولك — تجربة أثاث فاخرة تجمع بين التصميم المعماري والدفء الخليجي والشراء الإلكتروني العصري.",
};

export default function ArabicRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${rollcFontClassName} rollc-page-ar`}>{children}</body>
    </html>
  );
}
