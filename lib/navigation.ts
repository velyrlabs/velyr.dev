export type NavItem = { title: string; href: string };
export type NavGroup = { title?: string; items: NavItem[] };
export type SectionKey = "guide" | "config" | "plugins";

export const sections: Record<SectionKey, { title: string; groups: NavGroup[] }> = {
  guide: {
    title: "Guide",
    groups: [
      {
        title: "Introduction",
        items: [
          { title: "Getting Started", href: "/guide" },
          { title: "Why Velyr", href: "/guide/why" },
          { title: "Features", href: "/guide/features" },
          { title: "Roadmap & Status", href: "/guide/roadmap" },
        ],
      },
      {
        title: "Using Velyr",
        items: [
          { title: "Command Line Interface", href: "/guide/cli" },
          { title: "Permissions", href: "/guide/permissions" },
          { title: "Modules", href: "/guide/modules" },
          { title: "Web APIs", href: "/guide/web-apis" },
          { title: "Server & Multicore", href: "/guide/server" },
          { title: "Workers", href: "/guide/workers" },
          { title: "Node & npm Compatibility", href: "/guide/node-compat" },
        ],
      },
      {
        title: "Reference",
        items: [
          { title: "Error Codes", href: "/guide/errors" },
          { title: "Security Model", href: "/guide/security" },
          { title: "Performance & Benchmarks", href: "/guide/performance" },
        ],
      },
    ],
  },
  config: {
    title: "Config",
    groups: [
      {
        items: [
          { title: "Configuring Velyr", href: "/config" },
          { title: "Permission Options", href: "/config/permissions" },
          { title: "Server & Worker Options", href: "/config/server" },
          { title: "Dependency Options", href: "/config/dependencies" },
          { title: "Profiles", href: "/config/profiles" },
        ],
      },
    ],
  },
  plugins: {
    title: "Plugins",
    groups: [
      {
        items: [
          { title: "Plugins", href: "/plugins" },
          { title: "Plugin API", href: "/plugins/api" },
        ],
      },
    ],
  },
};

export const sectionKeys = Object.keys(sections) as SectionKey[];

export function isSection(value: string): value is SectionKey {
  return value in sections;
}

export function flatItems(section: SectionKey): NavItem[] {
  return sections[section].groups.flatMap((group) => group.items);
}
