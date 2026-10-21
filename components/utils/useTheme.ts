"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_THEME, type Theme } from "./theme";

/**
 * Reads the live theme from the `data-theme` attribute the inline head script
 * owns, and re-renders when it changes.
 *
 * The attribute — not React state — is the source of truth for theming (see
 * components/utils/theme.ts), so anything that needs the theme as a *value*
 * rather than as a CSS variable (the WebGL scene, which has no CSS) observes
 * it here instead of keeping a parallel copy that could drift.
 */

const subscribe = (onStoreChange: () => void) => {
  const observer = new MutationObserver(onStoreChange);

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  return () => observer.disconnect();
};

const getSnapshot = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";

const getServerSnapshot = (): Theme => DEFAULT_THEME;

export const useTheme = (): Theme =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
