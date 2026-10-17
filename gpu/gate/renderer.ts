import type { Effect, Gpu, Surface, Target } from "vgpu";
import type { GateState } from "@/components/hero/timeline";
import blurShader from "./blur.wgsl";
import compositeShader from "./composite.wgsl";
import sceneShader from "./scene.wgsl";

type Point = readonly [number, number];
type Rgb = readonly [number, number, number];

const MAX_DPR = 1.5;
const MAX_BACKING = 1400;
const MARK_FRACTION = 0.58;
const rgb = (hex: number): Rgb => [((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255];
const INK = rgb(0x0e0f0c);
const BONE = rgb(0xf2f0e9);
const SIGNAL = rgb(0xc6f432);
// Gaussian taps from the vgpu nextjs-flare example (sigma ~5 texels).
const BLUR_CENTER_WEIGHT = 0.0799404796215474;
const BLUR_TAPS = [
  [1.48500449838059, 0.15215191554518462, 0, 0],
  [3.4650570548417856, 0.12482060361420404, 0, 0],
  [5.445220764892785, 0.08739756064091182, 0, 0],
  [7.42555748318834, 0.052228984400379486, 0, 0],
  [9.406126897065857, 0.026638884372877224, 0, 0],
  [11.386985823860664, 0.011595876612829572, 0, 0],
  [13.368187582263898, 0.004307876491458321, 0, 0],
  [15, 0.0008880585113811997, 0, 0],
] as const;

export type GateRenderer = {
  render(state: GateState, dt: number): void;
  setPointer(point: Point | undefined): void;
  dispose(): void;
};

/** Autonomous light: a slow ellipse around the mark, in uv. */
function orbit(time: number): Point {
  const phase = time * 0.35;
  return [0.5 + Math.cos(phase) * 0.36, 0.42 - Math.sin(phase) * 0.3];
}

/** Throws when WebGPU is missing or the adapter fails; the caller falls back to SVG. */
export async function createGateRenderer(canvas: HTMLCanvasElement): Promise<GateRenderer> {
  if (typeof navigator === "undefined" || !("gpu" in navigator) || !navigator.gpu) {
    throw new Error("WebGPU is not available");
  }
  const { init, surface, effect, target, sampler, frame } = await import("vgpu");
  const gpu: Gpu = await init({ label: "velyr-gate" });
  let disposed = false;

  try {
    const output: Surface = surface(gpu, canvas, { autoResize: false, alphaMode: "opaque", format: "bgra8unorm" });
    const linear = sampler(gpu, {
      minFilter: "linear",
      magFilter: "linear",
      addressModeU: "clamp-to-edge",
      addressModeV: "clamp-to-edge",
    });
    const scene: Effect = effect(gpu, sceneShader, { label: "velyr-gate-scene" });
    const blurH: Effect = effect(gpu, blurShader, { label: "velyr-gate-blur-h" });
    const blurV: Effect = effect(gpu, blurShader, { label: "velyr-gate-blur-v" });
    const composite: Effect = effect(gpu, compositeShader, { label: "velyr-gate-composite" });

    let size: Point = [1, 1];
    let half: Point = [1, 1];
    const sceneTarget: Target = target(gpu, { size: [1, 1], format: "rgba8unorm" });
    const blurA: Target = target(gpu, { size: [1, 1], format: "rgba8unorm" });
    const blurB: Target = target(gpu, { size: [1, 1], format: "rgba8unorm" });

    let pending = true;
    const observer = new ResizeObserver(() => {
      pending = true;
    });
    observer.observe(canvas);

    const applySize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR, MAX_BACKING / Math.max(rect.width, rect.height, 1));
      const next: Point = [Math.max(1, Math.floor(rect.width * dpr)), Math.max(1, Math.floor(rect.height * dpr))];
      pending = false;
      if (next[0] === size[0] && next[1] === size[1]) return;
      size = next;
      half = [Math.max(1, size[0] >> 1), Math.max(1, size[1] >> 1)];
      output.resize(size);
      sceneTarget.resize(size);
      blurA.resize(half);
      blurB.resize(half);
      // Resizing replaces the attachments; rebind every sampled target.
      const blurParams = (direction: Point) => ({
        direction,
        texelSize: [1 / half[0], 1 / half[1]] as Point,
        taps: BLUR_TAPS,
        centerWeight: BLUR_CENTER_WEIGHT,
        tapCount: BLUR_TAPS.length,
      });
      blurH.set({ linearSampler: linear, sourceTexture: sceneTarget, params: blurParams([1 / half[0], 0]) });
      blurV.set({ linearSampler: linear, sourceTexture: blurA, params: blurParams([0, 1 / half[1]]) });
      composite.set({ linearSampler: linear, sceneTexture: sceneTarget, blurTexture: blurB });
    };

    let time = 0;
    let frameIndex = 0;
    let pointer: Point | undefined;
    let light: Point = orbit(0);

    return {
      setPointer(point) {
        pointer = point;
      },
      render(state, dt) {
        if (disposed) return;
        if (pending) applySize();
        time += dt;
        const goal = pointer ?? orbit(time);
        const follow = 1 - Math.exp(-dt / (pointer ? 0.12 : 0.4));
        light = [light[0] + (goal[0] - light[0]) * follow, light[1] + (goal[1] - light[1]) * follow];

        const unit = (Math.min(size[0], size[1]) * MARK_FRACTION) / 64;
        const center: Point = [size[0] / 2, size[1] / 2];
        const breathe = 0.82 + 0.18 * Math.sin(time * 0.9);
        scene.set({
          params: {
            resolution: size,
            center,
            light: [light[0] * size[0], light[1] * size[1]],
            tokenHalf: [state.halfW, state.halfH],
            unit,
            tokenY: state.tokenY,
            tokenAlpha: state.alpha,
            reach: 1.4,
          },
        });
        const tokenUv: Point = [0.5, (center[1] + (state.tokenY - 32) * unit) / size[1]];
        const short = Math.min(size[0], size[1]);
        composite.set({
          params: {
            resolution: size,
            light,
            token: tokenUv,
            aspect: [size[0] / short, size[1] / short],
            ink: INK,
            rimIntensity: pointer ? 1.1 : breathe,
            bone: BONE,
            tokenIntensity: state.alpha * 0.75,
            signal: SIGNAL,
            frameIndex: frameIndex++,
          },
        });
        frame(gpu, (current) => {
          current.pass(sceneTarget, scene);
          current.pass(blurA, blurH);
          current.pass(blurB, blurV);
          current.pass(output, composite);
        });
      },
      dispose() {
        if (disposed) return;
        disposed = true;
        observer.disconnect();
        gpu.dispose();
      },
    };
  } catch (error) {
    disposed = true;
    gpu.dispose();
    throw error;
  }
}
