"use client";

import { useCallback, useRef } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { useHasFinePointer, usePrefersReducedMotion } from "./useMediaQuery";

type TiltOptions = {
  /** Maximum rotation at the edges of the element, in degrees. */
  maxTilt?: number;
  /** How far the card lifts towards the viewer while pointed at, in px. */
  lift?: number;
};

/**
 * Pointer-driven tilt for a CSS 3D card.
 *
 * Pointer position is held in motion values rather than React state, so moving
 * the mouse animates the transform off the main render path instead of
 * re-rendering the card sixty times a second. Springs give the card weight —
 * it settles rather than snapping, which is what makes it feel like an object.
 *
 * Disabled entirely for coarse pointers and for reduced-motion users; in both
 * cases the returned values stay at rest and the card renders flat.
 */
export const usePointerTilt = ({ maxTilt = 7, lift = 14 }: TiltOptions = {}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Both hooks must run on every render — `&&` would short-circuit the second.
  const finePointer = useHasFinePointer();
  const reduceMotion = usePrefersReducedMotion();
  const enabled = finePointer && !reduceMotion;

  // Normalised pointer offset from the element's centre, in the range -0.5..0.5.
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);

  const spring = { stiffness: 180, damping: 22, mass: 0.6 };
  const springX = useSpring(offsetX, spring);
  const springY = useSpring(offsetY, spring);

  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const translateZ = useSpring(0, spring);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!enabled) return;

      const bounds = ref.current?.getBoundingClientRect();
      if (!bounds) return;

      offsetX.set((event.clientX - bounds.left) / bounds.width - 0.5);
      offsetY.set((event.clientY - bounds.top) / bounds.height - 0.5);
      translateZ.set(lift);
    },
    [enabled, lift, offsetX, offsetY, translateZ],
  );

  const onPointerLeave = useCallback(() => {
    offsetX.set(0);
    offsetY.set(0);
    translateZ.set(0);
  }, [offsetX, offsetY, translateZ]);

  return {
    ref,
    enabled,
    /** Spread onto the element that should tilt. */
    tiltProps: {
      ref,
      onPointerMove,
      onPointerLeave,
      style: enabled
        ? { rotateX, rotateY, translateZ, transformStyle: "preserve-3d" as const }
        : undefined,
    },
    /** Drive parallax of inner layers from the same pointer position. */
    springX,
    springY,
  };
};
