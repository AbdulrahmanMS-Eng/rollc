import type { Metadata } from "next";
import "../globals.css";
import { rollcFontClassName } from "../fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://rollc.vercel.app"),
  title: "رولك | أثاث فاخر بتجربة رقمية ذكية",
  description: "رولك — موقع أثاث فاخر يعرض المنتجات، يستقبل طلبات عروض الأسعار، ويقدم تجربة ذكية مناسبة للمناقصات والتجزئة.",
  icons: {
    icon: "/logo/1.svg",
    shortcut: "/logo/1.svg",
    apple: "/logo/1.svg",
  },
  openGraph: {
    title: "رولك | أثاث فاخر بتجربة رقمية ذكية",
    description: "تجربة أثاث فاخرة باللغتين العربية والإنجليزية، مع مساعد ذكي، طلبات عروض أسعار، وصفحة تعريفية مخصصة للمناقصات.",
    url: "https://rollc.vercel.app/",
    siteName: "Rollc | رولك",
    locale: "ar_SA",
    type: "website",
    images: [
      {
        url: "/rollc-og-final.png",
        width: 1200,
        height: 630,
        alt: "Rollc | رولك للأثاث الفاخر",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "رولك | أثاث فاخر بتجربة رقمية ذكية",
    description: "تجربة أثاث فاخرة باللغتين العربية والإنجليزية، مع مساعد ذكي وطلبات عروض أسعار.",
    images: ["/rollc-og-final.png"],
  },
};

export default function ArabicRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-component */}
      <head>
        <script dangerouslySetInnerHTML={{__html:"try{if(!sessionStorage.getItem('rollc_intro_seen')){document.documentElement.classList.add('intro-first')}}catch(e){}"}} />
      </head>
      <body className={`${rollcFontClassName} rollc-page-ar`}>{children}</body>
    </html>
  );
}
