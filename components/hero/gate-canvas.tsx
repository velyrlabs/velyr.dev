"use client";

import { useEffect, useRef } from "react";
import { createGateRenderer, type GateRenderer } from "@/gpu/gate/renderer";

/** Client-only (loaded with ssr: false). Reports a ready renderer, or a failure so the SVG stays. */
export default function GateCanvas({ onReady, onFail }: { onReady: (renderer: GateRenderer) => void; onFail: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    let renderer: GateRenderer | undefined;
    let cancelled = false;
    createGateRenderer(element)
      .then((created) => {
        if (cancelled) return created.dispose();
        renderer = created;
        onReady(created);
      })
      .catch(() => {
        if (!cancelled) onFail();
      });
    return () => {
      cancelled = true;
      renderer?.dispose();
    };
  }, [onReady, onFail]);

  return <canvas ref={canvas} className="gate-canvas" aria-hidden="true" />;
}
