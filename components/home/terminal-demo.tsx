"use client";

import { useEffect, useRef, useState } from "react";

type Line = { kind: "cmd" | "out" | "err" | "ok" | "src"; text: string };

// Real CLI surface only: `velyr run`, --allow-read (require_equals), VELYR_PERMISSION_DENIED from io-fs.
export const SCRIPT: Line[] = [
  { kind: "cmd", text: "cat main.js" },
  { kind: "src", text: "try {" },
  { kind: "src", text: '  console.log(await Velyr.readTextFile("./data/hello.txt"));' },
  { kind: "src", text: "} catch (error) {" },
  { kind: "src", text: "  console.log(`${error.code}: ${error.message}`);" },
  { kind: "src", text: "}" },
  { kind: "cmd", text: "velyr run main.js" },
  { kind: "err", text: "VELYR_PERMISSION_DENIED: fs-read access denied" },
  { kind: "cmd", text: "velyr run --allow-read=./data main.js" },
  { kind: "ok", text: "hello from ./data" },
];

const TYPE_MS = 34;
const PAUSE_MS = 520;

export function TerminalDemo() {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(SCRIPT.length);
  const [chars, setChars] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setCount(0);
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || count >= SCRIPT.length) return;
    const line = SCRIPT[count];
    if (line.kind === "cmd" && chars < line.text.length) {
      const id = window.setTimeout(() => setChars(chars + 1), TYPE_MS);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(
      () => {
        setCount(count + 1);
        setChars(0);
      },
      line.kind === "cmd" ? PAUSE_MS : line.kind === "src" ? 60 : PAUSE_MS,
    );
    return () => window.clearTimeout(id);
  }, [started, count, chars]);

  return (
    <div className="terminal" ref={root}>
      <div className="terminal-bar">
        <span className="label">Terminal</span>
      </div>
      <pre className="terminal-body" aria-hidden="true">
        {SCRIPT.slice(0, Math.min(count + 1, SCRIPT.length)).map((line, index) => {
          const typing = index === count && count < SCRIPT.length;
          if (typing && line.kind !== "cmd") return null;
          const text = typing ? line.text.slice(0, chars) : line.text;
          return (
            <span key={index} className={`terminal-line terminal-${line.kind}`}>
              {line.kind === "cmd" ? <span className="terminal-prompt">$ </span> : null}
              {line.kind === "err" ? <span className="terminal-glyph">x </span> : null}
              {line.kind === "ok" ? <span className="terminal-glyph">&gt; </span> : null}
              {text}
              {typing ? <span className="caret" /> : null}
              {"\n"}
            </span>
          );
        })}
      </pre>
      <div className="sr-only">
        <p>Terminal session:</p>
        <ol>
          {SCRIPT.map((line, index) => (
            <li key={index}>{line.kind === "cmd" ? `Command: ${line.text}` : `Output: ${line.text}`}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
