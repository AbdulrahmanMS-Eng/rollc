import type { Metadata } from "next";
import "../globals.css";
import { rollcFontClassName } from "../fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://rollc.vercel.app"),
  title: "Rollc | Luxury Furniture Experience",
  description: "Rollc — a luxury furniture website for product discovery, quote requests, tenders, and modern retail expansion.",
  icons: {
    icon: "/logo/1.svg",
    shortcut: "/logo/1.svg",
    apple: "/logo/1.svg",
  },
  openGraph: {
    title: "Rollc | Luxury Furniture Experience",
    description: "A bilingual luxury furniture experience with smart assistance, quote requests, and a professional company profile for tenders.",
    url: "https://rollc.vercel.app/en",
    siteName: "Rollc",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-rollc.png",
        width: 1200,
        height: 630,
        alt: "Rollc Luxury Furniture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rollc | Luxury Furniture Experience",
    description: "A bilingual luxury furniture experience with smart assistance and quote requests.",
    images: ["/og-rollc.png"],
  },
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
