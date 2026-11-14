import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Nothing_You_Could_Do } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SketchDefs } from "@/components/doodles/SketchDefs";
import { site } from "@/data/site";
import "./globals.css";
import { siteUrl } from "@/data/site-url";

const sans = Instrument_Sans({ variable: "--font-sans", subsets: ["latin"], display: "swap" });
const hand = Nothing_You_Could_Do({ variable: "--font-hand", subsets: ["latin"], weight: "400", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name}, data science and LLM engineering`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: { type: "website", siteName: site.name, title: site.name, description: site.description },
  twitter: { card: "summary", title: site.name, description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#fbfaf7",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${hand.variable}`}>
      <body>
        <SketchDefs />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
