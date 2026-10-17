import type { Metadata } from "next";
import { Mark } from "@/components/mark";

export const metadata: Metadata = {
  title: "Brand",
  description: "The Velyr mark, colors, type, voice and naming, with downloads.",
};

const downloads = [
  { file: "velyr-mark.svg", title: "Mark", note: "Bone bars, Signal token, for dark grounds", ground: "#0E0F0C" },
  { file: "velyr-mark-mono.svg", title: "Mark, mono", note: "One color, for print and single-ink use", ground: "#F2F0E9" },
  { file: "velyr-lockup-dark.svg", title: "Lockup, dark", note: "Mark and wordmark on Ink", ground: "#0E0F0C" },
  { file: "velyr-lockup-light.svg", title: "Lockup, light", note: "Mark and wordmark on Bone", ground: "#F2F0E9" },
];

const colors = [
  { name: "Ink", hex: "#0E0F0C", role: "Default dark ground" },
  { name: "Ink Raised", hex: "#1C1E19", role: "Cards and code on dark" },
  { name: "Bone", hex: "#F2F0E9", role: "Light ground; bars on dark" },
  { name: "Signal", hex: "#C6F432", role: "The only accent, on dark. At most about 4% of a surface" },
  { name: "Signal Deep", hex: "#5E7A00", role: "Accent on light grounds" },
  { name: "Graphite", hex: "#5B5E55", role: "Secondary text on light" },
  { name: "Ash", hex: "#A6A99E", role: "Secondary text on dark" },
  { name: "Deny", hex: "#E5482D", role: "Errors on dark" },
  { name: "Deny Deep", hex: "#B8321A", role: "Errors on light" },
  { name: "Amber", hex: "#F2B636", role: "Warnings" },
];

const contrast = [
  { pair: "Bone on Ink", ratio: "16.9:1", use: "All text" },
  { pair: "Signal on Ink", ratio: "15.0:1", use: "Accent text, focus, the token" },
  { pair: "Ash on Ink", ratio: "8.0:1", use: "Secondary text" },
  { pair: "Graphite on Bone", ratio: "5.8:1", use: "Secondary text on light" },
  { pair: "Signal Deep on Bone", ratio: "4.3:1", use: "Large text and icons only" },
  { pair: "Signal on Bone", ratio: "1.1:1", use: "Never" },
];

const donts = [
  { label: "Do not rotate", transform: "rotate(18 32 32)" },
  { label: "Do not stretch", transform: "translate(-16 0) scale(1.5 1)" },
  { label: "Do not recolor", fill: "#3A7BD5" },
  { label: "Do not close the slot", closed: true },
];

export default function BrandPage() {
  return (
    <main id="main" className="container brand-page">
      <p className="label section-kicker">Brand</p>
      <h1>The gate.</h1>
      <p className="brand-lead">
        Two bars almost meet. Between them, a 4-unit slot, and a token that has not been let through. The mark is the permission model
        drawn once.
      </p>

      <section className="brand-section" aria-labelledby="downloads">
        <h2 id="downloads">Downloads</h2>
        <ul className="brand-grid" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {downloads.map((item) => (
            <li key={item.file} className="brand-tile">
              <div className="brand-tile-art" style={{ background: item.ground }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/brand/${item.file}`} alt="" width={160} height={60} />
              </div>
              <a href={`/brand/${item.file}`} download>
                {item.title} <span className="label">SVG</span>
              </a>
              <p style={{ color: "var(--fg-muted)", fontSize: 15 }}>{item.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="brand-section prose" aria-labelledby="usage" style={{ maxWidth: "none" }}>
        <h2 id="usage">Usage</h2>
        <ul>
          <li>Clear space on every side equals one token (8 units of the 64-unit mark).</li>
          <li>Minimum size: 16px for the mark without the token, 24px for the full mark.</li>
          <li>Bars are Bone on dark and Ink on light. The token is Signal on dark and Signal Deep on light.</li>
          <li>The wordmark is lowercase velyr in Archivo 800, width 125%, tracking -0.045em.</li>
        </ul>
        <h3>Do not</h3>
        <div className="dont-grid" style={{ marginTop: 16 }}>
          {donts.map((dont) => (
            <figure key={dont.label}>
              <svg viewBox="0 0 64 64" width="100%" aria-hidden="true" style={{ background: "var(--bg-raised)", aspectRatio: "1" }}>
                <g transform={dont.transform}>
                  <g fill={dont.fill ?? "var(--mark-bar)"}>
                    <path d="M4 8h13l13 48H17z" />
                    <path d="M60 8H47L34 56h13z" />
                    {dont.closed ? <rect x="29" y="52" width="6" height="4" /> : null}
                  </g>
                  <rect x="28" y="30" width="8" height="8" fill={dont.fill ?? "var(--mark-token)"} />
                </g>
                <path d="M6 58L58 6" stroke="var(--error)" strokeWidth="1.5" />
              </svg>
              <figcaption>{dont.label}</figcaption>
            </figure>
          ))}
          <figure>
            <svg viewBox="0 0 64 64" width="100%" aria-hidden="true" style={{ background: "var(--bg-raised)", aspectRatio: "1" }}>
              <g style={{ filter: "drop-shadow(0 0 6px var(--mark-token))" }}>
                <Mark size={64} />
              </g>
              <path d="M6 58L58 6" stroke="var(--error)" strokeWidth="1.5" />
            </svg>
            <figcaption>Do not add effects</figcaption>
          </figure>
        </div>
      </section>

      <section className="brand-section" aria-labelledby="color">
        <h2 id="color">Color</h2>
        <div className="brand-grid">
          {colors.map((color) => (
            <div key={color.name} className="brand-tile">
              <div className="swatch" style={{ background: color.hex }} />
              <p>
                <strong>{color.name}</strong> <code className="label">{color.hex}</code>
              </p>
              <p style={{ color: "var(--fg-muted)", fontSize: 15 }}>{color.role}</p>
            </div>
          ))}
        </div>
        <div className="table-wrap" style={{ marginTop: 32 }}>
          <table>
            <thead>
              <tr>
                <th>Pair</th>
                <th>Contrast</th>
                <th>Use</th>
              </tr>
            </thead>
            <tbody>
              {contrast.map((row) => (
                <tr key={row.pair}>
                  <td>{row.pair}</td>
                  <td>
                    <code>{row.ratio}</code>
                  </td>
                  <td>{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="brand-section prose" aria-labelledby="type" style={{ maxWidth: "none" }}>
        <h2 id="type">Type</h2>
        <p style={{ fontWeight: 800, fontStretch: "125%", letterSpacing: "-0.03em", fontSize: 40, lineHeight: 1.1 }}>
          Archivo 800, width 125%
        </p>
        <p>Headings: Archivo 800, width 125%, tracking about -0.03em. Body: Archivo 400, 17px over 1.6, at most about 72 characters a line.</p>
        <p className="label">JetBrains Mono for code and labels: uppercase, +4% tracking, 13px</p>
      </section>

      <section className="brand-section" aria-labelledby="voice">
        <h2 id="voice">Voice</h2>
        <p className="brand-lead" style={{ marginTop: 0, marginBottom: 24 }}>
          Measured, not claimed. Plain words, no invented numbers, no benchmarks we have not published.
        </p>
        <div className="say-avoid">
          <div>
            <p className="label" style={{ color: "var(--accent-text)" }}>Say</p>
            <ul>
              <li>Denied by default. Grant read access to ./data.</li>
              <li>Benchmarks will be published with the harness and raw results.</li>
              <li>Experimental: the API may change.</li>
            </ul>
          </div>
          <div>
            <p className="label" style={{ color: "var(--error)" }}>Avoid</p>
            <ul>
              <li>Blazingly fast.</li>
              <li>10x faster than anything.</li>
              <li>Military-grade security.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="brand-section prose" aria-labelledby="naming" style={{ maxWidth: "none" }}>
        <h2 id="naming">Naming</h2>
        <ul>
          <li>
            In prose: <strong>Velyr</strong>.
          </li>
          <li>
            The CLI and crates: <code>velyr</code>, <code>velyr-cli</code>.
          </li>
          <li>
            Error codes: the <code>VELYR_</code> prefix, as in <code>VELYR_PERMISSION_DENIED</code>.
          </li>
          <li>Never VELYR as a name, Velyr.js or VelyrJS.</li>
        </ul>
      </section>
    </main>
  );
}
