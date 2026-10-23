import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, Orbitron } from "next/font/google";
import "./globals.css";

const schibsted = Schibsted_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "800"], variable: "--font-schibsted", display: "swap" });
const orbitron = Orbitron({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-orbitron", display: "swap" });

export const metadata: Metadata = {
  title: "Anudeep Reddy Veerati | Full-Stack & AI Engineer",
  description: "Portfolio of Anudeep Reddy Veerati: full-stack and AI software engineer building web, mobile and algorithmic products. 4× hackathon winner.",
};
export const viewport: Viewport = { themeColor: "#0a050a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${schibsted.variable} ${orbitron.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
