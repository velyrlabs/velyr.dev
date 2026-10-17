import fs from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Toc } from "@/components/docs/toc";
import { Status } from "@/components/mdx/status";
import { CONTENT_DIR, loadMdx } from "@/lib/content";
import { useMDXComponents } from "@/mdx-components";

// Renderer fixtures: only built with VELYR_FIXTURES=1 (`pnpm build:fixtures`) or in `next dev`; never indexed, linked or searched.
const ENABLED = process.env.VELYR_FIXTURES === "1" || process.env.NODE_ENV === "development";

type Props = { params: Promise<{ name: string }> };

export const dynamicParams = false;
export const metadata: Metadata = { robots: { index: false, follow: false } };

export async function generateStaticParams() {
  // output: "export" rejects an empty list; this placeholder renders the 404 page.
  if (!ENABLED) return [{ name: "disabled" }];
  const files = await fs.readdir(path.join(CONTENT_DIR, "_fixtures")).catch(() => [] as string[]);
  return files.filter((file) => file.endsWith(".mdx")).map((file) => ({ name: file.slice(0, -4) }));
}

export default async function FixturePage({ params }: Props) {
  if (!ENABLED) notFound();
  const { name } = await params;
  const doc = await loadMdx(path.join("_fixtures", `${name}.mdx`));
  if (!doc) notFound();
  const { Content } = doc;
  return (
    <div className="docs-shell">
      <div className="docs-sidebar desktop-only" />
      <main id="main" className="docs-main">
        <article className="prose">
          <header className="doc-header">
            <h1>
              {doc.frontmatter.title} {doc.frontmatter.status ? <Status value={doc.frontmatter.status} /> : null}
            </h1>
            <p className="doc-lead">{doc.frontmatter.description}</p>
          </header>
          <Content components={useMDXComponents()} />
        </article>
      </main>
      <aside className="docs-toc">
        <Toc headings={doc.headings} />
      </aside>
    </div>
  );
}
