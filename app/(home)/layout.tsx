import { baseOptions } from "@/app/layout.config";
import Navbar from "@/components/ui/navbar/nav";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
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
