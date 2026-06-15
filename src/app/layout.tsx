import type { Metadata } from "next";
import { El_Messiri, Tajawal, Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const elMessiri = El_Messiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-el-messiri",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "رولك Rollc — أثاث فاخر يصنع حضور المكان",
  description:
    "رولك Rollc — أثاث فاخر، غرف معيشة، غرف نوم، طاولات، ديكور، وتوصيل وتركيب احترافي داخل المملكة.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = `${elMessiri.variable} ${tajawal.variable} ${cormorant.variable} ${jost.variable}`;

  return (
    <html lang="ar" dir="ltr" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
