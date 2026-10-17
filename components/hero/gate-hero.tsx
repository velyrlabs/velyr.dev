"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GateRenderer } from "@/gpu/gate/renderer";
import { createLoop, FINAL_STATE, gateState, GRANT, type GateState, type Phase } from "./timeline";

const GateCanvas = dynamic(() => import("./gate-canvas"), { ssr: false });

type Mode = "static" | "svg" | "gpu";

/** "The Gate": WebGPU when available, an SVG of the same beat otherwise, the static final frame for reduced motion. */
export function GateHero() {
  const [mode, setMode] = useState<Mode>("static");
  const [tryGpu, setTryGpu] = useState(false);
  const [phase, setPhase] = useState<Phase>(FINAL_STATE.phase);
  const [typed, setTyped] = useState(FINAL_STATE.typed);
  const stage = useRef<HTMLDivElement>(null);
  const token = useRef<SVGRectElement>(null);
  const renderer = useRef<GateRenderer | undefined>(undefined);
  const modeRef = useRef<Mode>("static");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => {
      if (reduced.matches) {
        modeRef.current = "static";
        setMode("static");
        setPhase(FINAL_STATE.phase);
        setTyped(FINAL_STATE.typed);
        applySvg(FINAL_STATE);
        return;
      }
      modeRef.current = renderer.current ? "gpu" : "svg";
      setMode(modeRef.current);
      if ("gpu" in navigator && navigator.gpu) setTryGpu(true);
    };
    decide();
    reduced.addEventListener("change", decide);
    return () => reduced.removeEventListener("change", decide);
  }, []);

  function applySvg(state: GateState) {
    const element = token.current;
    if (!element) return;
    // Transform/opacity only: scale around the rest center, then translate.
    element.style.transform = `translate(32px, ${state.tokenY}px) scale(${state.halfW / 4}, ${state.halfH / 4}) translate(-32px, -34px)`;
    element.style.opacity = String(state.alpha);
  }

  useEffect(() => {
    if (mode === "static") return;
    let lastPhase: Phase | undefined;
    let lastTyped = -1;
    const loop = createLoop((time, dt) => {
      const state = gateState(time);
      if (state.phase !== lastPhase) setPhase((lastPhase = state.phase));
      if (state.typed !== lastTyped) setTyped((lastTyped = state.typed));
      if (modeRef.current === "gpu" && renderer.current) {
        try {
          renderer.current.render(state, dt);
        } catch {
          renderer.current.dispose();
          renderer.current = undefined;
          modeRef.current = "svg";
          setMode("svg");
          setTryGpu(false);
        }
      } else {
        applySvg(state);
      }
    });

    let visible = false;
    const sync = () => (visible && !document.hidden ? loop.start() : loop.stop());
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    if (stage.current) observer.observe(stage.current);
    document.addEventListener("visibilitychange", sync);
    return () => {
      loop.stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [mode]);

  const onReady = useCallback((created: GateRenderer) => {
    renderer.current = created;
    if (modeRef.current !== "static") {
      modeRef.current = "gpu";
      setMode("gpu");
    }
  }, []);
  const onFail = useCallback(() => setTryGpu(false), []);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    renderer.current?.setPointer([(event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height]);
  }

  return (
    <div
      className="gate-stage"
      data-mode={mode}
      ref={stage}
      onPointerMove={onPointerMove}
      onPointerLeave={() => renderer.current?.setPointer(undefined)}
    >
      <svg className="gate-svg" viewBox="0 0 64 64" aria-hidden="true">
        <g fill="#F2F0E9">
          <path d="M4 8h13l13 48H17z" />
          <path d="M60 8H47L34 56h13z" />
        </g>
        <rect ref={token} className="gate-token" x="28" y="30" width="8" height="8" fill="#C6F432" />
      </svg>
      {tryGpu ? <GateCanvas onReady={onReady} onFail={onFail} /> : null}
      <div className="gate-readout" aria-hidden="true">
        <span className="label gate-prompt">$ velyr run main.js</span>
        <span className="label gate-status" data-phase={phase}>
          {phase === "denied" ? "VELYR_PERMISSION_DENIED" : null}
          {phase === "grant" || phase === "pass" ? (
            <>
              {GRANT.slice(0, typed)}
              {phase === "grant" && typed < GRANT.length ? <span className="caret" /> : null}
            </>
          ) : null}
          {phase === "idle" ? "waiting" : null}
        </span>
      </div>
      <p className="sr-only">
        Illustration: a token drops into the Velyr gate and is stopped with VELYR_PERMISSION_DENIED. After the grant {GRANT}, the token
        passes through the slot.
      </p>
    </div>
  );
}
