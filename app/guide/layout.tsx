import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";
import { guideSource } from "@/lib/source";
import { config } from "@/app.config";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
        tree={guideSource.pageTree}
        {...baseOptions}
        sidebar={{
          className: "font-medium !w-[var(--fd-sidebar-width)] !items-start",
        }}
        // githubUrl={`https://github.com/${config.repository}`}
      >
        {children}
      </DocsLayout>
  );
}
