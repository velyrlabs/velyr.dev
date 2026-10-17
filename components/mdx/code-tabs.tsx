"use client";

import { useId, useRef, useState, type ReactNode, type KeyboardEvent } from "react";

export function CodeTabs({ labels, panels }: { labels: string[]; panels: ReactNode[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = labels.length - 1;
    const keys: Record<string, number> = { ArrowRight: (active + 1) % labels.length, ArrowLeft: (active + last) % labels.length, Home: 0, End: last };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = keys[event.key];
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className="code-group">
      <div className="code-group-tabs" role="tablist" aria-label="Code examples" onKeyDown={onKeyDown}>
        {labels.map((label, index) => (
          <button
            key={`${label}-${index}`}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${index}`}
            aria-selected={index === active}
            aria-controls={`${baseId}-panel-${index}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
          >
            {label}
          </button>
        ))}
      </div>
      {panels.map((panel, index) => (
        <div
          key={index}
          role="tabpanel"
          id={`${baseId}-panel-${index}`}
          aria-labelledby={`${baseId}-tab-${index}`}
          hidden={index !== active}
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
