import React, { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Taskbar from "@/app/intellirdb/components/taskbar";
import Dialog from "@/app/intellirdb/components/dialog";
import { getInitialMessages } from "@/lib/firebase/get-initial-messages";
import { RadioProvider } from "@/app/contexts/radio";
import { WindowProvider } from "@/app/contexts/window";
import { PreviewProvider } from "@/app/contexts/preview";
import { ChatProvider } from "@/app/contexts/chat";
import { cn } from "@/lib/cn";
import { BASE_URL } from "@/lib/constants";
import "@/app/styles/globals.css";
import "@/app/styles/docs.css";

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
const OG_IMAGE_URL =
  "https://assets.cfmpulse.com/intellirdb/assets/intellirdb-opengraph.webp";
const APPLICATION_NAME = "intelliRDB";
const CREATOR = "Gelthem M.";

const ga_id = "G-RLHVV5YR9Y";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const { messages, users } = await getInitialMessages();

  return (
    <html lang="en" className="intelli-canvas" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.cfmpulse.com" />
        <link rel="dns-prefetch" href="https://www.cfmpulse.com" />
        <link rel="preconnect" href="https://cfmpulse.com" />
        <link rel="dns-prefetch" href="https://cfmpulse.com" />
        <link rel="preconnect" href="https://assets.cfmpulse.com" />
        <link rel="dns-prefetch" href="https://assets.cfmpulse.com" />
        <link
          rel="preload"
          href="https://assets.cfmpulse.com/intellirdb/fonts/cfmpulse.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        ></link>
        <meta property="og:locale" content="en_US" />
        <GoogleAnalytics gaId={ga_id} />
        <meta name="app-version" content={process.env.SITE_VERSION} />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta property="og:site_name" content={APPLICATION_NAME} />
        <meta property="og:locale" content="en_US" />
        <meta
          name="google-site-verification"
          content="OfHaVPKM9Wu-vYzI9izprYBxt9AaQM7LmbovFBXMTDk"
        />
        <meta name="msvalidate.01" content="781D56DEEBBD64612B4741E403DBABE7" />
      </head>
      <body
        className={cn(
          "relative antialiased select-none",
          "h-dvh flex flex-col p-2",
          "bg-dark text-light  bg-blend-multiply",
        )}
      >
        <RadioProvider>
          <PreviewProvider>
            <WindowProvider>
              <ChatProvider initialMessages={messages} initialUsers={users}>
                <main className="relative w-full h-full flex-1 flex flex-col intelli-canvas">
                  <div className="w-full h-full overflow-hidden">
                    {children}
                  </div>
                  <Suspense>
                    <Dialog />
                  </Suspense>
                  <Image
                    src="https://assets.cfmpulse.com/intellirdb/assets/img-radio-pixelart.gif"
                    alt=""
                    width={0}
                    height={0}
                    className="hidden intelli-none"
                  />
                  <Image
                    src="https://assets.cfmpulse.com/intellirdb/assets/intellirdb-canvas.jpg"
                    alt=""
                    width={0}
                    height={0}
                    className="hidden intelli-none"
                  />
                  <audio
                    id="radio-medium"
                    className="w-10 opacity-0 intelli-none"
                  />
                  <audio
                    id="preview-medium"
                    className="w-10 opacity-0 intelli-none"
                  />
                </main>
                <Suspense>
                  <Taskbar />
                </Suspense>
                <Analytics />
                <SpeedInsights />
              </ChatProvider>
            </WindowProvider>
          </PreviewProvider>
        </RadioProvider>
      </body>
    </html>
  );
}
