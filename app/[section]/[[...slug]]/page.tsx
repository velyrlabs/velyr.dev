import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Toc } from "@/components/docs/toc";
import { Status } from "@/components/mdx/status";
import { docHref, existingHrefs, getDoc, listSlugs } from "@/lib/content";
import { flatItems, isSection, sectionKeys, sections, type SectionKey } from "@/lib/navigation";
import { SITE_REPO_URL } from "@/lib/site";
import { useMDXComponents } from "@/mdx-components";

type Params = { section: string; slug?: string[] };
type Props = { params: Promise<Params> };

// Nav entries without an MDX file are not generated; visiting them renders the 404 page.
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  const params: Params[] = [];
  for (const section of sectionKeys) {
    for (const slug of await listSlugs(section)) params.push({ section, slug });
  }
  return params;
}

async function load(params: Promise<Params>) {
  const { section, slug = [] } = await params;
  if (!isSection(section)) notFound();
  const doc = await getDoc(section, slug);
  if (!doc) notFound();
  return { section, slug, doc };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section, slug, doc } = await load(params);
  const { title, description } = doc.frontmatter;
  return {
    title,
    description,
    alternates: { canonical: docHref(section, slug) },
    openGraph: { title: `${title} | Velyr`, description, url: docHref(section, slug) },
  };
}

async function pager(section: SectionKey, href: string) {
  const existing = await existingHrefs(section);
  const items = flatItems(section).filter((item) => existing.has(item.href));
  const index = items.findIndex((item) => item.href === href);
  return { prev: index > 0 ? items[index - 1] : undefined, next: index >= 0 ? items[index + 1] : undefined };
}

export default async function DocPage({ params }: Props) {
  const { section, slug, doc } = await load(params);
  const href = docHref(section, slug);
  const { prev, next } = await pager(section, href);
  const current = flatItems(section).find((item) => item.href === href);
  const group = sections[section].groups.find((g) => g.items.some((item) => item.href === href))?.title;
  const { Content } = doc;

  return (
    <>
      <main id="main" className="docs-main">
        <nav aria-label="Breadcrumb" className="breadcrumbs">
          <ol>
            <li>
              <Link href={`/${section}`}>{sections[section].title}</Link>
            </li>
            {group ? <li>{group}</li> : null}
            {current && href !== `/${section}` ? (
              <li aria-current="page">{current.title}</li>
            ) : null}
          </ol>
        </nav>
        <article className="prose">
          <header className="doc-header">
            <h1>
              {doc.frontmatter.title}
              {doc.frontmatter.status ? (
                <>
                  {" "}
                  <Status value={doc.frontmatter.status} />
                </>
              ) : null}
            </h1>
            <p className="doc-lead">{doc.frontmatter.description}</p>
          </header>
          <Content components={useMDXComponents()} />
        </article>
        <footer className="doc-footer">
          <a className="edit-link" href={`${SITE_REPO_URL}/edit/main/content/${doc.file}`} target="_blank" rel="noreferrer">
            Edit this page
          </a>
          <nav className="pager" aria-label="Previous and next page">
            {prev ? (
              <Link href={prev.href} className="pager-link" rel="prev">
                <span className="label">Previous</span>
                <span>{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={next.href} className="pager-link pager-next" rel="next">
                <span className="label">Next</span>
                <span>{next.title}</span>
              </Link>
            ) : null}
          </nav>
        </footer>
      </main>
      <aside className="docs-toc" aria-label="On this page">
        <Toc headings={doc.headings} />
      </aside>
    </>
  );
}
