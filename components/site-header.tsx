import Link from "next/link";
import { REPO_URL, VERSION } from "@/lib/site";
import { sectionKeys, sections } from "@/lib/navigation";
import { GitHubIcon } from "./icons";
import { Mark, Wordmark } from "./mark";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";
import { ResourcesMenu, type ResourceLink } from "./resources-menu";
import { SearchButton } from "./search";
import { ThemeToggle } from "./theme-toggle";

export const resourceLinks: ResourceLink[] = [
  { title: "Brand", href: "/brand" },
  { title: "Architecture decisions", href: `${REPO_URL}/tree/main/docs/adr`, external: true },
  { title: "Roadmap", href: "/guide/roadmap" },
  { title: "Releases", href: `${REPO_URL}/releases`, external: true },
];

const topLinks = [
  { title: "Guide", href: "/guide" },
  { title: "Config", href: "/config" },
  { title: "Plugins", href: "/plugins" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand-link" aria-label="Velyr home">
          <Mark size={26} />
          <Wordmark />
        </Link>
        <nav className="top-nav desktop-only" aria-label="Main">
          <NavLinks links={topLinks} />
          <ResourcesMenu links={resourceLinks} />
        </nav>
        <div className="header-tools">
          <SearchButton />
          <span className="version-pill label desktop-only" title="Current version">
            {VERSION}
          </span>
          <a className="icon-button desktop-only" href={REPO_URL} target="_blank" rel="noreferrer" aria-label="Velyr on GitHub">
            <GitHubIcon />
          </a>
          <ThemeToggle />
          <MobileNav
            sections={sectionKeys.map((key) => ({ key, title: sections[key].title, groups: sections[key].groups }))}
            extra={[...resourceLinks, { title: "GitHub", href: REPO_URL, external: true }]}
          />
        </div>
      </div>
    </header>
  );
}
