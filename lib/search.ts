import "server-only";
import { docHref, getDoc, listSlugs } from "./content";
import { sectionKeys, sections } from "./navigation";

export type SearchEntry = {
  title: string;
  href: string;
  section: string;
  description: string;
  headings: { id: string; text: string }[];
};

export async function buildSearchIndex(): Promise<SearchEntry[]> {
  const entries: SearchEntry[] = [];
  for (const section of sectionKeys) {
    for (const slug of await listSlugs(section)) {
      const doc = await getDoc(section, slug);
      if (!doc) continue;
      entries.push({
        title: doc.frontmatter.title,
        href: docHref(section, slug),
        section: sections[section].title,
        description: doc.frontmatter.description,
        headings: doc.headings.map(({ id, text }) => ({ id, text })),
      });
    }
  }
  return entries;
}
