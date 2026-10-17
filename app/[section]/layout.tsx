import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/docs/sidebar";
import { isSection, sections } from "@/lib/navigation";

export default async function SectionLayout({ children, params }: { children: ReactNode; params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isSection(section)) notFound();
  const { title, groups } = sections[section];
  return (
    <div className="docs-shell">
      <aside className="docs-sidebar desktop-only" aria-label="Section pages">
        <Sidebar title={title} groups={groups} />
      </aside>
      {children}
    </div>
  );
}
