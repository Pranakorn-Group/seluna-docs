import { IBM_Plex_Sans_Thai } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Metadata } from "next";
import type { ReactNode } from "react";
import CustomSearchDialog from "@/components/ui/search-dialog";
import { AiChatProvider } from "@/components/ui/ai-chat-provider";
import AiChatFab from "@/components/ui/ai-chat";
import "./global.css";

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-thai",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://docs.seluna.cloud'),
  title: "Seluna | Documentation for Seluna Cloud",
  description: 'เอกสารการใช้งานระบบ e-commerce ของ Seluna Cloud',
  openGraph: {
    images: {
        type: 'image/png',
        url: './banner.png'
    },
    type: 'website'
}
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning style={{ fontFamily: 'var(--font-ibm-plex-sans-thai), sans-serif' }}>
      <body className={`${ibmPlexSansThai.variable} flex flex-col min-h-screen`}>
        <RootProvider theme={{ defaultTheme: "dark" }} search={{ SearchDialog: CustomSearchDialog }}>
          <AiChatProvider>
            {children}
          </AiChatProvider>
        </RootProvider>
      </body>
    </html>
  );
}
