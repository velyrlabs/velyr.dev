import Link from "next/link";
import { Status } from "@/components/mdx/status";
import { features } from "@/lib/features";

export function FeaturesGrid() {
  return (
    <section className="features container" aria-labelledby="features-title">
      <p className="label section-kicker">Status</p>
      <h2 id="features-title" className="section-title">
        What exists today, and what does not yet.
      </h2>
      <ul className="features-grid">
        {features.map((feature) => (
          <li key={feature.title}>
            <Link href={feature.href} className="feature-card">
              <Status value={feature.status} />
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
