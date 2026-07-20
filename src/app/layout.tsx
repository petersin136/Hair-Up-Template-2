import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="antialiased">
      <body>{children}</body>
    </html>
  );
}
