"use client";

import { useEffect, useState } from "react";

const GLYPHS = "VELYR01/_-=:";

/**
 * Server renders the final lines (LCP-safe, readable without JS). On mount each character
 * briefly decodes from noise, left to right; reduced motion skips it.
 */
export function DecodeHeadline({ lines }: { lines: string[] }) {
  const [shown, setShown] = useState(lines);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const total = lines.join("").length;
    const start = performance.now();
    const duration = 900;
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      let offset = 0;
      setShown(
        lines.map((line) => {
          const out = [...line]
            .map((char, index) => {
              const position = (offset + index) / total;
              if (char === " " || position < progress) return char;
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            })
            .join("");
          offset += line.length;
          return out;
        }),
      );
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [lines]);

  return (
    <h1 className="hero-title" aria-label={lines.join(" ")}>
      {shown.map((line, index) => (
        <span key={index} className="hero-title-line" aria-hidden="true">
          {line}
        </span>
      ))}
    </h1>
  );
}
