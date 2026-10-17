"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SearchIcon } from "./icons";

type Entry = {
  title: string;
  href: string;
  section: string;
  description: string;
  headings: { id: string; text: string }[];
};

type Result = { href: string; title: string; context: string; score: number };

let indexPromise: Promise<Entry[]> | undefined;

function loadIndex(): Promise<Entry[]> {
  indexPromise ??= fetch("/search-index.json")
    .then((response) => (response.ok ? (response.json() as Promise<Entry[]>) : []))
    .catch(() => {
      indexPromise = undefined;
      return [];
    });
  return indexPromise;
}

/** Every query word must appear; title hits rank above heading hits, which rank above descriptions. */
function search(entries: Entry[], query: string): Result[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const matches = (text: string) => words.every((word) => text.toLowerCase().includes(word));
  const results: Result[] = [];
  for (const entry of entries) {
    if (matches(entry.title)) results.push({ href: entry.href, title: entry.title, context: entry.section, score: 3 });
    else if (matches(`${entry.title} ${entry.description}`))
      results.push({ href: entry.href, title: entry.title, context: entry.description, score: 1 });
    for (const heading of entry.headings) {
      const inHeading = words.some((word) => heading.text.toLowerCase().includes(word));
      if (inHeading && matches(`${heading.text} ${entry.title}`)) {
        results.push({ href: `${entry.href}#${heading.id}`, title: heading.text, context: entry.title, score: 2 });
      }
    }
  }
  return results.sort((a, b) => b.score - a.score).slice(0, 20);
}

export function SearchButton() {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const results = useMemo(() => search(entries, query), [entries, query]);

  const open = useCallback(() => {
    void loadIndex().then(setEntries);
    returnFocus.current = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    input.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function go(href: string) {
    dialog.current?.close();
    setQuery("");
    router.push(href);
  }

  function onInputKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && results[active]) {
      event.preventDefault();
      go(results[active].href);
    } else if (event.key === "Escape") {
      // A search input would otherwise spend the first Esc clearing itself instead of closing.
      event.preventDefault();
      dialog.current?.close();
    }
  }

  return (
    <>
      <button type="button" className="search-button" onClick={open} aria-keyshortcuts="Meta+K Control+K">
        <SearchIcon />
        <span className="search-button-text">Search</span>
        <span className="sr-only"> documentation</span>
        <kbd className="search-kbd" aria-hidden="true">
          Ctrl K
        </kbd>
      </button>
      <dialog
        ref={dialog}
        className="search-dialog"
        aria-label="Search documentation"
        aria-modal="true"
        onClose={() => returnFocus.current?.focus()}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="search-panel">
          <div className="search-field">
            <SearchIcon />
            <input
              ref={input}
              type="search"
              placeholder="Search the docs"
              aria-label="Search the docs"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={onInputKey}
              role="combobox"
              aria-expanded={results.length > 0}
              aria-controls="search-results"
              aria-activedescendant={results[active] ? `search-result-${active}` : undefined}
              aria-autocomplete="list"
            />
            <button
              type="button"
              className="search-close label"
              aria-label="Esc, close search"
              onClick={() => dialog.current?.close()}
            >
              Esc
            </button>
          </div>
          <ul id="search-results" role="listbox" className="search-results" aria-label="Results">
            {results.map((result, index) => (
              <li
                key={result.href}
                id={`search-result-${index}`}
                role="option"
                aria-selected={index === active}
                onMouseEnter={() => setActive(index)}
                onClick={() => go(result.href)}
              >
                <span className="search-result-title">{result.title}</span>
                <span className="search-result-context">{result.context}</span>
              </li>
            ))}
          </ul>
          <p className="sr-only" aria-live="polite">
            {query ? `${results.length} ${results.length === 1 ? "result" : "results"}` : ""}
          </p>
          {query && !results.length ? <p className="search-empty">No results for &ldquo;{query}&rdquo;.</p> : null}
        </div>
      </dialog>
    </>
  );
}
