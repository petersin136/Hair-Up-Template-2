import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const notoKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kr",
  display: "swap",
  // CJK fonts ship as 100+ unicode-range files — preload must be off.
  preload: false,
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Hair up",
  description: "Hair up — premium hair salon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${notoKr.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
