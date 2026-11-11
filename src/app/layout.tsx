import type { Metadata, Viewport } from "next";
import { Geist, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import { ExperienceProvider } from "@/context/Experience";
import { IntroLoader } from "@/components/experience/IntroLoader";
import { SceneCanvas } from "@/components/experience/SceneCanvas";
import { Cursor } from "@/components/experience/Cursor";
import { ScrollExperience } from "@/components/experience/ScrollExperience";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MenuOverlay } from "@/components/layout/MenuOverlay";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AskAnu } from "@/components/assistant/AskAnu";
import { PerfNotice } from "@/components/experience/PerfNotice";
import { themeScript } from "@/lib/theme-script";
import { site } from "@/data/site";
import "./globals.css";

const sans = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const mono = IBM_Plex_Mono({ variable: "--font-plex", subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });
const display = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}, data science and LLM engineering`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: { type: "website", siteName: site.name, title: site.name, description: site.description },
  twitter: { card: "summary", title: site.name, description: site.description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3edff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0919" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${sans.variable} ${mono.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ExperienceProvider>
          <SceneCanvas />
          <ScrollExperience />
          <IntroLoader />
          <SiteHeader />
          <MenuOverlay />
          <main id="main">{children}</main>
          <SiteFooter />
          <AskAnu />
          <PerfNotice />
          <Cursor />
        </ExperienceProvider>
      </body>
    </html>
  );
}
