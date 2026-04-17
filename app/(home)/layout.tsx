import { baseOptions } from "@/app/layout.config";
import Navbar from "@/components/ui/navbar/nav";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
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
    <HomeLayout
      {...baseOptions}
      nav={{
        enabled: true,
        component: <Navbar />,
      }}
      className="py-0"
    >
      {children}
    </HomeLayout>
  );
}
