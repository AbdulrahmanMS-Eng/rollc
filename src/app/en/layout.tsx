import type { Metadata } from "next";
import "../globals.css";
import { rollcFontClassName } from "../fonts";

export const metadata: Metadata = {
  title: "Rollc | Luxury Furniture",
  description: "Rollc — a luxury furniture experience blending architectural design, warm Gulf elegance, and modern ecommerce.",
};

export default function EnglishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-component */}
      <head>
        <script dangerouslySetInnerHTML={{__html:"try{if(!sessionStorage.getItem('rollc_intro_seen')){document.documentElement.classList.add('intro-first')}}catch(e){}"}} />
      </head>
      <body className={`${rollcFontClassName} rollc-page-en lang-en`}>{children}</body>
    </html>
  );
}
