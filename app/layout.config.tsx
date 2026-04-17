import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/cn';
/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: ({ href = '/', className, ...props }) => (
      <Link href={href} className={cn(className, 'items-center gap-2')} {...props}>
        <Image src="/android-chrome-512x512.png" alt="Seluna Logo" className="h-6 w-6" width={24} height={24} />
        <span>Seluna Cloud</span>
      </Link>
    ),
  },
  links: [],
};
