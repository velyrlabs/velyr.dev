import Link from "next/link";
import { REPO_URL } from "@/lib/site";
import { Mark, Wordmark } from "./mark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <Mark size={22} />
          <Wordmark />
        </div>
        <nav aria-label="Footer" className="footer-links">
          <Link href="/guide">Guide</Link>
          <Link href="/config">Config</Link>
          <Link href="/plugins">Plugins</Link>
          <Link href="/brand">Brand</Link>
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
        <p className="footer-license">Released under the MIT or Apache-2.0 License.</p>
      </div>
    </footer>
  );
}
