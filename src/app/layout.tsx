import React, { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Header from "@/app/components/header";
import Dialog from "@/app/components/dialog";
import { RadioProvider } from "@/app/contexts/radio-context";
import { cn } from "@/lib/cn";
import { BASE_URL } from "@/lib/constants";
import "@/app/styles/globals.css";

const TITLE = "intelliRDB - Just Radio!";
const DESCRIPTION =
  "Discover and stream some of the best radio stations from around the world.";
const KEYWORDS = [
  "radio",
  "stations",
  "world",
  "international",
  "music",
  "streaming",
  "listen",
  "discover",
];
const OG_IMAGE_URL = `${BASE_URL}/intellirdb-opengraph.webp`;
const APPLICATION_NAME = "intelliRDB";
const CREATOR = "Gelthem M.";

export const viewport: Viewport = {
  themeColor: "#000",
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  viewportFit: "cover",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: APPLICATION_NAME,
  creator: CREATOR,
  publisher: CREATOR,

  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: BASE_URL,
    siteName: APPLICATION_NAME,
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: DESCRIPTION,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: DESCRIPTION,
      },
    ],
    site: "@intelliurl",
    creator: "@geltaverse",
  },
  icons: {
    icon: `${BASE_URL}/favicon.ico`,
    apple: `${BASE_URL}/io/apple-touch-icon.png`,
    shortcut: `${BASE_URL}/io/favicon-16x16.png`,
  },
  manifest: `${BASE_URL}/io/site.webmanifest`,
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-US": `${BASE_URL}/en`,
      "fr-FR": `${BASE_URL}/fr`,
    },
  },
  category: "entertainment",
  authors: [{ name: CREATOR, url: "https://x.com/geltaverse" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://intelliurl.vercel.app" />
        <link rel="dns-prefetch" href="https://intelliurl.vercel.app" />
        <link rel="preconnect" href="https://transaudio.vercel.app" />
        <link rel="dns-prefetch" href="https://transaudio.vercel.app" />
        <meta property="og:locale" content="en_US" />
      </head>
      <body
        className={cn(
          "relative font-pixel antialiased select-none",
          "h-dvh flex flex-col",
          "bg-dark/20 text-light intelli-canvas bg-blend-multiply"
        )}
      >
        <RadioProvider>
          <Suspense>
            <Header />
          </Suspense>
          <main className="relative h-full flex-1 flex flex-col">
            <div className="w-full h-full overflow-hidden">{children}</div>
            <Suspense>
              <Dialog />
            </Suspense>
            <Image
              src="https://intellirdb.vercel.app/img-radio-pixelart.gif"
              alt=""
              fill
              className="hidden intelli-none"
            />
          </main>
          <Analytics />
          <SpeedInsights />
        </RadioProvider>
      </body>
    </html>
  );
}
