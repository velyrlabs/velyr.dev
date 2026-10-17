"use client";

import { useEffect, useRef } from "react";

const CORES = 8;
const SLOTS = 24;

/**
 * Illustration only: isolates (cells) being scheduled across cores (rows). Canvas 2D,
 * transform-free; pauses off-screen and on hidden tabs; reduced motion draws one still frame.
 * Deliberately carries no numbers.
 */
export function CoresViz() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const heat = new Float32Array(CORES * SLOTS);
    let seed = 7;
    const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    let cursor = 0;

    const resize = () => {
      const rect = element.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      element.width = Math.max(1, Math.floor(rect.width * dpr));
      element.height = Math.max(1, Math.floor(rect.height * dpr));
    };

    const colors = () => {
      const style = getComputedStyle(element);
      return {
        line: style.getPropertyValue("--viz-line").trim() || "#2a2c26",
        cell: style.getPropertyValue("--viz-cell").trim() || "#f2f0e9",
        accent: style.getPropertyValue("--viz-accent").trim() || "#c6f432",
        idle: style.getPropertyValue("--viz-idle").trim() || "#1c1e19",
      };
    };

    const draw = () => {
      const { line, cell, idle, accent } = colors();
      const { width, height } = element;
      context.clearRect(0, 0, width, height);
      const gap = Math.max(2, Math.round(width / 260));
      const cw = (width - gap * (SLOTS + 1)) / SLOTS;
      const ch = (height - gap * (CORES + 1)) / CORES;
      for (let core = 0; core < CORES; core++) {
        for (let slot = 0; slot < SLOTS; slot++) {
          const x = gap + slot * (cw + gap);
          const y = gap + core * (ch + gap);
          const value = heat[core * SLOTS + slot];
          context.fillStyle = idle;
          context.fillRect(x, y, cw, ch);
          if (value > 0.01) {
            context.globalAlpha = Math.min(1, value);
            context.fillStyle = cell;
            context.fillRect(x, y, cw, ch);
            context.globalAlpha = 1;
          }
          context.strokeStyle = line;
          context.strokeRect(x + 0.5, y + 0.5, cw - 1, ch - 1);
        }
      }
      // The scheduler's current column: the only accent on this surface.
      const column = (cursor + SLOTS - 1) % SLOTS;
      context.fillStyle = accent;
      context.fillRect(gap + column * (cw + gap), 0, cw, gap);
    };

    const step = () => {
      for (let i = 0; i < heat.length; i++) heat[i] *= 0.92;
      // Each tick schedules a few isolates onto the least recently used cores in the current column.
      const column = cursor % SLOTS;
      const isolates = 2 + Math.floor(random() * 5);
      for (let i = 0; i < isolates; i++) heat[Math.floor(random() * CORES) * SLOTS + column] = 1;
      cursor++;
    };

    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });
    resizeObserver.observe(element);
    // Colors come from theme tokens, so a theme toggle must repaint even when not animating.
    const themeObserver = new MutationObserver(draw);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    if (reduced) {
      for (let i = 0; i < SLOTS * 2; i++) step();
      draw();
      return () => {
        resizeObserver.disconnect();
        themeObserver.disconnect();
      };
    }

    let timer = 0;
    let visible = false;
    const run = () => {
      step();
      draw();
    };
    const sync = () => {
      window.clearInterval(timer);
      if (visible && !document.hidden) timer = window.setInterval(run, 90);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return <canvas ref={canvas} className="cores-canvas" aria-hidden="true" />;
}
