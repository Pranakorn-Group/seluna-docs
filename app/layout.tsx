import { IBM_Plex_Sans_Thai } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Metadata } from "next";
import type { ReactNode } from "react";
import "./global.css";

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-thai",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://seyfert.dev'),
  title: "Seyfert | The Black Magic Framework",
  description: 'Powerful Discord Bots Made Simple with Seyfert',
  openGraph: {
    images: {
        type: 'image/png',
        url: './opengraph-image.png'
    },
    type: 'website'
}
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning style={{ fontFamily: 'var(--font-ibm-plex-sans-thai), sans-serif' }}>
      <body className={`${ibmPlexSansThai.variable} flex flex-col min-h-screen`}>
        <RootProvider theme={{ defaultTheme: "dark", disableTransitionOnChange: false }}>{children}</RootProvider>
      </body>
    </html>
  );
}
