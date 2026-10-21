"use client";

import { useCallback, useRef, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import clsx from "clsx";
import {
  useHasFinePointer,
  usePrefersReducedMotion,
} from "@/components/utils/useMediaQuery";

type GlassPanelProps = {
  children: ReactNode;
  className?: string;
};

/**
 * A pane of glass laid over the 3D scene.
 *
 * What sells it is the specular pool that tracks the cursor across the
 * surface: real glass picks up a moving highlight, and without it a blurred
 * translucent box just reads as a dimmed rectangle. The pool is driven by
 * motion values and springs, so tracking the pointer never re-renders React.
 */
const GlassPanel = ({ children, className }: GlassPanelProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // Both hooks run unconditionally; `&&` would short-circuit the second.
  const finePointer = useHasFinePointer();
  const reduceMotion = usePrefersReducedMotion();
  const interactive = finePointer && !reduceMotion;

  const spring = { stiffness: 140, damping: 20, mass: 0.5 };
  const x = useSpring(useMotionValue(50), spring);
  const y = useSpring(useMotionValue(50), spring);
  const strength = useSpring(useMotionValue(0), spring);

  const glow = useMotionTemplate`radial-gradient(28rem circle at ${x}% ${y}%, var(--glass-glow), transparent 72%)`;

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!interactive) return;

      const bounds = ref.current?.getBoundingClientRect();
      if (!bounds) return;

      x.set(((event.clientX - bounds.left) / bounds.width) * 100);
      y.set(((event.clientY - bounds.top) / bounds.height) * 100);
      strength.set(1);
    },
    [interactive, strength, x, y],
  );

  const onPointerLeave = useCallback(() => strength.set(0), [strength]);

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={clsx("glass relative overflow-hidden", className)}>
      {interactive && (
        <motion.span
          aria-hidden
          style={{ backgroundImage: glow, opacity: strength }}
          className="pointer-events-none absolute inset-0"
        />
      )}
      <div className="relative">{children}</div>
    </motion.div>
  );
};

export default GlassPanel;
