import type { ReactNode } from "react";

type CalloutType = "note" | "tip" | "warning" | "danger";

const DEFAULT_TITLES: Record<CalloutType, string> = {
  note: "Note",
  tip: "Tip",
  warning: "Warning",
  danger: "Danger",
};

/** Top hairline + mono uppercase label; the label names the type, so color is never the only signal. */
export function Callout({ type = "note", title, children }: { type?: CalloutType; title?: string; children: ReactNode }) {
  const kind = type in DEFAULT_TITLES ? type : "note";
  return (
    <aside className="callout" data-type={kind} role={kind === "danger" || kind === "warning" ? "note" : undefined}>
      <p className="callout-label">
        <span className="label">{DEFAULT_TITLES[kind]}</span>
        {title ? <span className="callout-title">{title}</span> : null}
      </p>
      <div className="callout-body">{children}</div>
    </aside>
  );
}
