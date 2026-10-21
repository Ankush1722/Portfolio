"use client";

import { useEffect } from "react";
import { LuMoon, LuSun } from "react-icons/lu";
import { applyTheme, getActiveTheme, hasStoredPreference } from "@/components/utils/theme";

/**
 * The button holds no React state: which icon shows is decided purely by the
 * `data-theme` attribute via the `dark:` variant, so the server and client
 * render identical markup and there is nothing to hydrate incorrectly.
 */
const ThemeToggle = ({ className }: { className?: string }) => {
  // Follow the OS as long as the visitor has not made an explicit choice.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const onChange = (event: MediaQueryListEvent) => {
      if (hasStoredPreference()) return;
      applyTheme(event.matches ? "dark" : "light", false);
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <button
      type="button"
      onClick={() => applyTheme(getActiveTheme() === "dark" ? "light" : "dark")}
      aria-label="Switch between light and dark theme"
      title="Switch between light and dark theme"
      className={`group inline-flex size-9 cursor-pointer items-center justify-center border border-line-strong bg-surface/70 text-content-muted backdrop-blur-[2px] transition-colors duration-300 hover:border-accent hover:text-content ${className ?? ""}`}>
      <LuMoon
        aria-hidden
        className="size-4 transition-transform duration-500 group-hover:-rotate-12 dark:hidden motion-reduce:transform-none"
      />
      <LuSun
        aria-hidden
        className="hidden size-4 transition-transform duration-500 group-hover:rotate-45 dark:block motion-reduce:transform-none"
      />
    </button>
  );
};

export default ThemeToggle;
