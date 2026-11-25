import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const THEME_COLORS: Record<Theme, string> = { dark: "#0e0e0d", light: "#f7f6f2" };

// Set once the visitor picks a theme (here or in another tab). Kept in memory as well as in
// localStorage so the choice still beats OS changes when storage is unavailable.
let explicitChoiceThisSession = false;

// The inline script in index.html applies the initial class before first paint.
function readTheme(): Theme {
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme]);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readTheme);

  const setTheme = useCallback((next: Theme) => {
    explicitChoiceThisSession = true;
    applyTheme(next);
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode, blocked cookies); the theme still applies for this visit.
    }
  }, []);

  // Keep other open tabs in sync.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      if (event.newValue === "light" || event.newValue === "dark") {
        explicitChoiceThisSession = true;
        applyTheme(event.newValue);
        setThemeState(event.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Until the visitor picks a theme, follow the OS scheme live (e.g. automatic dark mode at sunset).
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      if (explicitChoiceThisSession || readStoredTheme() !== null) return;
      const next: Theme = media.matches ? "light" : "dark";
      applyTheme(next);
      setThemeState(next);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return { theme, setTheme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") };
}
