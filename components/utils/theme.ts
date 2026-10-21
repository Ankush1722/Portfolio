export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

/** Rendered into the server HTML; the inline script corrects it before paint. */
export const DEFAULT_THEME: Theme = "dark";

/**
 * Runs synchronously in <head>, while the HTML is still being parsed, so the
 * resolved theme is on <html> before the browser paints anything. Keep it in
 * plain ES5 and self-contained — it is inlined as a string, not bundled.
 *
 * It mirrors exactly what `applyTheme` does, so React's view of the DOM and the
 * script's view never disagree.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var k=${JSON.stringify(
  THEME_STORAGE_KEY,
)};var t=localStorage.getItem(k);if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

/** The theme currently painted, read from the DOM rather than React state. */
export const getActiveTheme = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";

export const applyTheme = (theme: Theme, persist = true) => {
  document.documentElement.setAttribute("data-theme", theme);

  if (!persist) return;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* Storage can be unavailable (private mode, blocked cookies) — ignore. */
  }
};

export const hasStoredPreference = () => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark";
  } catch {
    return false;
  }
};
