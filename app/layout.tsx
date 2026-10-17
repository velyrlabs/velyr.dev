import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { DESCRIPTION, SITE_URL, TAGLINE } from "@/lib/site";
import "@/styles/base.css";
import "@/styles/chrome.css";
import "@/styles/docs.css";
import "@/styles/mdx.css";
import "@/styles/home.css";
import "@/styles/brand.css";

// Must live in a server module: a constant exported from a "use client" file arrives here as a client reference, not a string.
// Runs before paint so the stored theme (key shared with ThemeToggle) never flashes. Dark is the default.
const THEME_SCRIPT = `try{var t=localStorage.getItem("velyr-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
// Opt in to scroll reveals before paint; without JS, IntersectionObserver or with reduced motion, content stays visible.
const REVEAL_SCRIPT = `;try{if("IntersectionObserver"in window&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.js=""}catch(e){}`;

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `Velyr | ${TAGLINE}`, template: "%s | Velyr" },
  description: DESCRIPTION,
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] },
  openGraph: { type: "website", siteName: "Velyr", url: SITE_URL, title: "Velyr", description: DESCRIPTION },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0E0F0C",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${archivo.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT + REVEAL_SCRIPT }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
