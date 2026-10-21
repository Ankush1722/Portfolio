"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query.
 *
 * `useSyncExternalStore` is the right shape for this: matchMedia *is* an
 * external store, and it hands React a server snapshot explicitly instead of
 * going through a state-in-effect round trip. During hydration React uses the
 * server snapshot and then re-reads on the client, so there is no mismatch.
 */
export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onStoreChange);
      return () => media.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  // On the server nothing matches. Every caller treats `false` as the cheap,
  // safe variant, which is also the correct answer while we cannot know.
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
};

/**
 * True only for devices with a precise pointer (mouse/trackpad). Touch screens
 * report `coarse`, so pointer-tracking effects are skipped there rather than
 * firing on every tap.
 */
export const useHasFinePointer = () =>
  useMediaQuery("(pointer: fine) and (hover: hover)");

export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");
