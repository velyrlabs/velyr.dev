import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { cache, type ComponentType } from "react";
import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeShiki from "@shikijs/rehype";
import { transformerMetaHighlight } from "@shikijs/transformers";
import type { ShikiTransformer } from "shiki";
import type { Root, Element, ElementContent } from "hast";
import { visit } from "unist-util-visit";
import { velyrDark, velyrLight } from "./shiki-themes";
import type { SectionKey } from "./navigation";

export const CONTENT_DIR = path.join(process.cwd(), "content");

export type Status = "available" | "experimental" | "planned";
export type Heading = { depth: 2 | 3; id: string; text: string };
export type Frontmatter = { title: string; description: string; status?: Status };
export type Doc = {
  file: string;
  frontmatter: Frontmatter;
  headings: Heading[];
  Content: ComponentType<{ components?: Record<string, unknown> }>;
};

const STATUSES: Status[] = ["available", "experimental", "planned"];

/** Relative path inside content/ for a section + slug; `index.mdx` is the section root. */
export function docFile(section: string, slug: string[] = []): string {
  return path.join(section, slug.length ? `${slug.join("/")}.mdx` : "index.mdx");
}

export function docHref(section: string, slug: string[] = []): string {
  return `/${[section, ...slug].join("/")}`;
}

async function exists(file: string): Promise<boolean> {
  try {
    await fs.access(path.join(CONTENT_DIR, file));
    return true;
  } catch {
    return false;
  }
}

/** Every slug with an MDX file in the section; names starting with `_` or `.` are skipped. */
export const listSlugs = cache(async (section: SectionKey): Promise<string[][]> => {
  const root = path.join(CONTENT_DIR, section);
  let entries: string[];
  try {
    entries = await fs.readdir(root, { recursive: true });
  } catch {
    return [];
  }
  return entries
    .filter((entry) => entry.endsWith(".mdx"))
    .filter((entry) => !entry.split(path.sep).some((part) => part.startsWith("_") || part.startsWith(".")))
    .map((entry) => entry.slice(0, -".mdx".length).split(path.sep))
    .map((parts) => (parts.at(-1) === "index" ? parts.slice(0, -1) : parts));
});

export const existingHrefs = cache(async (section: SectionKey): Promise<Set<string>> => {
  const slugs = await listSlugs(section);
  return new Set(slugs.map((slug) => docHref(section, slug)));
});

function parseFrontmatter(file: string, data: Record<string, unknown>): Frontmatter {
  const fail = (message: string): never => {
    throw new Error(`content/${file}: ${message}`);
  };
  if (typeof data.title !== "string" || !data.title.trim()) fail("frontmatter `title` is required");
  if (typeof data.description !== "string" || !data.description.trim()) fail("frontmatter `description` is required");
  if (data.status !== undefined && !STATUSES.includes(data.status as Status)) {
    fail(`frontmatter \`status\` must be one of ${STATUSES.join(", ")}`);
  }
  return {
    title: data.title as string,
    description: data.description as string,
    status: data.status as Status | undefined,
  };
}

function textOf(node: ElementContent | Element): string {
  if (node.type === "text") return node.value;
  if (node.type === "element") return node.children.map(textOf).join("");
  return "";
}

/** Collects h2/h3 ids that rehype-slug assigned, for the TOC and the search index. */
function rehypeCollectHeadings(headings: Heading[]) {
  return () => (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if ((node.tagName === "h2" || node.tagName === "h3") && typeof node.properties.id === "string") {
        headings.push({ depth: node.tagName === "h2" ? 2 : 3, id: node.properties.id, text: textOf(node).trim() });
      }
    });
  };
}

/** Copies `title="..."` from the fence meta onto <pre data-title> and records the language. */
const transformerTitle: ShikiTransformer = {
  name: "velyr:title",
  pre(node) {
    const raw = (this.options.meta as { __raw?: string } | undefined)?.__raw ?? "";
    const title = raw.match(/title="([^"]*)"/)?.[1];
    if (title) node.properties["data-title"] = title;
    node.properties["data-language"] = this.options.lang;
  },
};

async function compile(file: string, source: string) {
  const headings: Heading[] = [];
  const { default: Content } = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      rehypeCollectHeadings(headings),
      [
        rehypeShiki,
        {
          themes: { dark: velyrDark, light: velyrLight },
          defaultColor: false,
          defaultLanguage: "text",
          fallbackLanguage: "text",
          transformers: [transformerMetaHighlight(), transformerTitle],
        },
      ],
    ],
  }).catch((error: unknown) => {
    throw new Error(`content/${file}: MDX compile failed: ${error instanceof Error ? error.message : String(error)}`);
  });
  return { Content: Content as Doc["Content"], headings };
}

/** Loads and compiles one MDX file relative to content/; `null` when it does not exist. */
export const loadMdx = cache(async (file: string): Promise<Doc | null> => {
  if (!(await exists(file))) return null;
  const raw = await fs.readFile(path.join(CONTENT_DIR, file), "utf8");
  const { content, data } = matter(raw);
  const frontmatter = parseFrontmatter(file, data);
  const { Content, headings } = await compile(file, content);
  return { file, frontmatter, headings, Content };
});

export function getDoc(section: SectionKey, slug: string[] = []) {
  return loadMdx(docFile(section, slug));
}
