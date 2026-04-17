import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
    title: {
        template: '%s | Seluna Cloud Blog',
        default: 'Blog',
    },
    description: 'บทความและข่าวสารการอัปเดตเกี่ยวกับ Seluna Cloud',
    openGraph: {
        images: {
            type: 'image/png',
            url: './banner.png',
        },
    },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
