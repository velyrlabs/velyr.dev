"use client";

import { useState } from "react";

/** Copies `text`, or the text content of the closest `[data-copy-root]` when `text` is omitted. */
export function CopyButton({ text, label = "Copy code" }: { text?: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy(event: React.MouseEvent<HTMLButtonElement>) {
    const root = event.currentTarget.closest("[data-copy-root]");
    const value = text ?? root?.querySelector("pre")?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" className="copy-button" onClick={copy} aria-label={copied ? "Copied" : label}>
      <span aria-hidden="true">{copied ? "Copied" : "Copy"}</span>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
