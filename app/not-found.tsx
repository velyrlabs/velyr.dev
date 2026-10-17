import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="container not-found">
      <p className="label" style={{ color: "var(--error)" }}>
        VELYR_NOT_FOUND
      </p>
      <h1>This page is not written yet.</h1>
      <p>It may be planned in the navigation but not published. Start from the guide instead.</p>
      <p style={{ marginTop: 24 }}>
        <Link href="/guide" className="button button-primary">
          Go to the guide
        </Link>
      </p>
    </main>
  );
}
