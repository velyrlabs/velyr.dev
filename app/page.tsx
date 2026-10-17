import Link from "next/link";
import { GateHero } from "@/components/hero/gate-hero";
import { GitHubIcon } from "@/components/icons";
import { CoresViz } from "@/components/home/cores-viz";
import { FeaturesGrid } from "@/components/home/features-grid";
import { InstallSnippet } from "@/components/home/install-snippet";
import { Principles } from "@/components/home/principles";
import { TerminalDemo } from "@/components/home/terminal-demo";
import { DESCRIPTION, REPO_URL } from "@/lib/site";

const HEADLINE = ["Secure by default.", "Every core, measured."];

export default function HomePage() {
  return (
    <main id="main" className="home">
      <section className="hero container" aria-label="Introduction">
        <div className="hero-copy">
          <p className="label section-kicker">JavaScript & TypeScript runtime</p>
          <h1 className="hero-title">
            {HEADLINE.map((line) => (
              <span key={line} className="hero-title-line">
                {line}
              </span>
            ))}
          </h1>
          <p className="hero-sub">{DESCRIPTION}</p>
          <div className="hero-ctas">
            <Link href="/guide" className="button button-primary">
              Get Started
            </Link>
            <Link href="/guide/why" className="button">
              Why Velyr
            </Link>
            <a href={REPO_URL} className="button" target="_blank" rel="noreferrer">
              <GitHubIcon size={16} /> GitHub
            </a>
          </div>
          <InstallSnippet />
        </div>
        <GateHero />
      </section>

      <section className="demo container" aria-labelledby="demo-title">
        <div className="demo-copy">
          <p className="label section-kicker">Default deny</p>
          <h2 id="demo-title" className="section-title">
            Nothing is reachable until you say so.
          </h2>
          <p>
            A script starts with no filesystem, network, environment or process access. Each grant is a flag scoped to paths, hosts or
            names, and a denial names the kind of access, never the value that was asked for.
          </p>
          <Link href="/guide/permissions" className="text-link">
            Read about permissions
          </Link>
        </div>
        <TerminalDemo />
      </section>

      <Principles />

      <FeaturesGrid />

      <section className="measured container" aria-labelledby="measured-title">
        <div className="measured-copy">
          <p className="label section-kicker">Measured, not claimed</p>
          <h2 id="measured-title" className="section-title">
            Numbers when there are numbers.
          </h2>
          <p>
            Velyr is built to schedule isolates across every core of one machine. Benchmarks will be published with the harness, the
            hardware and the raw results, so anyone can rerun them. Until then, this page shows none.
          </p>
          <Link href="/guide/performance" className="text-link">
            How performance is measured
          </Link>
        </div>
        <figure className="measured-figure">
          <CoresViz />
          <figcaption className="label">Illustration — no benchmark numbers yet</figcaption>
        </figure>
      </section>

      <section className="closing container" aria-labelledby="closing-title">
        <h2 id="closing-title" className="closing-title">
          Start with nothing granted.
        </h2>
        <div className="hero-ctas">
          <Link href="/guide" className="button button-primary">
            Get Started
          </Link>
          <Link href="/config" className="button">
            Configure Velyr
          </Link>
        </div>
      </section>
    </main>
  );
}
