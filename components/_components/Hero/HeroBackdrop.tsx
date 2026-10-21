"use client";

import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";

/**
 * The WebGL scene is a sizeable chunk (three.js) and is purely visual, so it
 * is split out and fetched on the client only. `ssr: false` is required: the
 * scene reads `data-theme` and matchMedia on mount, neither of which exists on
 * the server.
 */
const StackScene = dynamic(() => import("./StackScene"), {
  ssr: false,
  loading: () => <CssStack />,
});

/**
 * CSS-only layered stack.
 *
 * Does double duty: it fills the frame while three.js downloads, and it is the
 * permanent composition when WebGL is unavailable. It occupies the same box as
 * the canvas, so swapping one for the other never shifts layout.
 */
const CssStack = () => (
  <div
    data-fallback-stack
    className="stage absolute inset-0 grid place-items-center lg:justify-items-end lg:pr-[8vw]"
    aria-hidden>
    <div
      className="preserve-3d relative aspect-5/4 w-[62%] max-w-104 lg:w-[32vw]"
      /* Steep enough that each plate foreshortens to a thin band. At a
         gentler angle the four simply overlap into a single diamond. */
      style={{ transform: "rotateX(70deg) rotateZ(-34deg)" }}>
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          className="absolute inset-0 rounded-xl border border-line-strong bg-surface-raised shadow-elev-2"
          style={{
            transform: `translateZ(${(3 - index) * 84}px) scale(${1 - index * 0.06})`,
            animation: `depth-float ${5 + index * 0.6}s ease-in-out ${index * 0.35}s infinite`,
          }}
        />
      ))}
      <div
        className="absolute top-1/2 left-1/2 h-1.5 w-20 rounded-full bg-accent"
        style={{ transform: "translate(-50%, -50%) translateZ(296px)" }}
      />
    </div>
  </div>
);

/**
 * Probes for a usable WebGL context once per page load, then throws the test
 * context away — browsers cap the number of live contexts, so leaking the
 * probe would cost the real canvas one.
 */
let webglSupport: boolean | null = null;

const detectWebGL = (): boolean => {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");

    (gl as WebGLRenderingContext | null)
      ?.getExtension("WEBGL_lose_context")
      ?.loseContext();

    return Boolean(gl);
  } catch {
    return false;
  }
};

const subscribeNever = () => () => {};

const getWebGLSnapshot = (): boolean => {
  webglSupport ??= detectWebGL();
  return webglSupport;
};

/**
 * `null` on the server and during hydration, so the frame is held rather than
 * flashing the fallback at visitors who do have WebGL.
 */
const useWebGLSupport = () =>
  useSyncExternalStore(subscribeNever, getWebGLSnapshot, () => null);

type HeroBackdropProps = {
  /** The hero section, used as the scene's pointer-event source. */
  eventSource: React.RefObject<HTMLElement | null>;
};

/**
 * Full-bleed 3D layer behind the hero's glass panel. Being a true backdrop is
 * what makes the glass read as glass — the blur has real geometry to refract
 * rather than a flat background colour.
 */
const HeroBackdrop = ({ eventSource }: HeroBackdropProps) => {
  const webgl = useWebGLSupport();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Pool of warm light the stack appears to sit in. */}
      <div
        className="absolute inset-0 opacity-90 blur-3xl"
        style={{
          background:
            "radial-gradient(45% 45% at 72% 48%, var(--glow-accent) 0%, transparent 72%)",
        }}
      />

      {webgl === false ? (
        <CssStack />
      ) : webgl === true ? (
        <StackScene eventSource={eventSource} />
      ) : null}
    </div>
  );
};

export default HeroBackdrop;
