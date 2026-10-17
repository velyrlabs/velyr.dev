import { RevealObserver } from "./reveal-observer";

const PRINCIPLES = [
  { title: "Secure by default", body: "No filesystem, network, environment, process or FFI access without authority you grant." },
  { title: "Web standards first", body: "Portable server APIs come before runtime-specific extensions." },
  { title: "Node compatibility is optional", body: "Node compatibility is a product layer you add, not a property of the kernel." },
  { title: "Everything measurable", body: "Performance, conformance, compatibility and security regressions have explicit gates." },
  { title: "Everything modular", body: "Nothing is linked into a minimal build unless its profile or dependency graph needs it." },
];

/** Rows reveal on scroll only when JS runs and motion is allowed; otherwise they are plainly visible. */
export function Principles() {
  return (
    <section className="principles container" aria-labelledby="principles-title">
      <p className="label section-kicker">Principles</p>
      <h2 id="principles-title" className="section-title">
        Five rules that do not move.
      </h2>
      <ol className="principles-list">
        {PRINCIPLES.map((principle, index) => (
          <li key={principle.title} className="principle reveal">
            <span className="principle-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <RevealObserver />
    </section>
  );
}
