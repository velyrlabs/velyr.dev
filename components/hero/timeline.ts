/** The Gate narrative, shared by the WebGPU renderer and the SVG fallback. Units are mark units (64u viewBox). */

export type Phase = "idle" | "denied" | "grant" | "pass";

export type GateState = {
  /** Token center y; 34 is the brand rest position (rect y=30, h=8). */
  tokenY: number;
  halfW: number;
  halfH: number;
  alpha: number;
  phase: Phase;
  /** Characters of GRANT typed so far. */
  typed: number;
};

export const GRANT = "--allow-read=./data";
export const LOOP_SECONDS = 10;
export const REST_Y = 34;

/** Static final frame (reduced motion): the mark as drawn, with the grant shown. */
export const FINAL_STATE: GateState = {
  tokenY: REST_Y,
  halfW: 4,
  halfH: 4,
  alpha: 1,
  phase: "grant",
  typed: GRANT.length,
};

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => x * x * (3 - 2 * x);
const span = (t: number, from: number, to: number) => clamp01((t - from) / (to - from));

export function gateState(time: number): GateState {
  const t = ((time % LOOP_SECONDS) + LOOP_SECONDS) % LOOP_SECONDS;
  const base: GateState = { tokenY: REST_Y, halfW: 4, halfH: 4, alpha: 1, phase: "idle", typed: 0 };

  if (t < 2.0) return base;
  if (t < 2.8) return { ...base, tokenY: REST_Y - 40 * smooth(span(t, 2.0, 2.8)) };
  if (t < 3.3) {
    const fall = span(t, 2.8, 3.3);
    return { ...base, tokenY: REST_Y - 40 * (1 - fall * fall) };
  }
  if (t < 5.0) {
    const k = span(t, 3.3, 3.6);
    const bounce = Math.sin(k * Math.PI) * 2.2 * (1 - k);
    return { ...base, tokenY: REST_Y - bounce, phase: "denied" };
  }
  if (t < 6.6) {
    return { ...base, phase: "grant", typed: Math.round(GRANT.length * span(t, 5.1, 6.3)) };
  }
  if (t < 7.6) {
    // Squeeze to the 4u slot width, keep the area, then pass through and leave below the gate.
    const squeeze = smooth(span(t, 6.6, 6.85));
    const halfW = 4 - 2 * squeeze;
    const travel = span(t, 6.85, 7.6);
    const tokenY = REST_Y + 40 * travel * travel;
    return {
      ...base,
      halfW,
      halfH: 16 / halfW,
      tokenY,
      alpha: 1 - span(tokenY, 58, 74),
      phase: "pass",
      typed: GRANT.length,
    };
  }
  if (t < 8.4) {
    const grow = smooth(span(t, 7.8, 8.4));
    return { ...base, alpha: grow, halfW: 4 * (0.6 + 0.4 * grow), halfH: 4 * (0.6 + 0.4 * grow) };
  }
  return base;
}

/** rAF loop whose clock only advances while running, so pausing freezes the narrative. */
export function createLoop(step: (time: number, dt: number) => void) {
  let running = false;
  let frame = 0;
  let last = 0;
  let time = 0;
  const tick = (now: number) => {
    if (!running) return;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    time += dt;
    step(time, dt);
    frame = requestAnimationFrame(tick);
  };
  return {
    start() {
      if (running) return;
      running = true;
      last = 0;
      frame = requestAnimationFrame(tick);
    },
    stop() {
      running = false;
      cancelAnimationFrame(frame);
    },
  };
}
