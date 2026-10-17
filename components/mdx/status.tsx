import type { Status as StatusValue } from "@/lib/content";

const LABELS: Record<StatusValue, { glyph: string; word: string }> = {
  available: { glyph: "■", word: "Available" },
  experimental: { glyph: "▲", word: "Experimental" },
  planned: { glyph: "□", word: "Planned" },
};

/** Inline badge: glyph + word, so status never relies on color alone. */
export function Status({ value }: { value: StatusValue }) {
  const label = LABELS[value] ?? LABELS.planned;
  return (
    <span className="status" data-status={value}>
      <span aria-hidden="true" className="status-glyph">
        {label.glyph}
      </span>
      {label.word}
    </span>
  );
}
