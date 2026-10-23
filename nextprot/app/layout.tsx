import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { motionBootScript } from "@/lib/motion";
import "./globals.css";

/** The free GC Methane demo lacks D, digits and most punctuation, so Outfit supplies those characters. */
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-outfit", display: "swap" });


export const metadata: Metadata = {
  title: "Anudeep Reddy Veerati | Full-Stack & AI Engineer",
  description: "Portfolio of Anudeep Reddy Veerati: full-stack and AI software engineer building web, mobile and algorithmic products. 4× hackathon winner.",
};
export const viewport: Viewport = { themeColor: "#0a050a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
        <link rel="preload" href="/fonts/GCMethane-ExtraBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/GCMethane-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
