"use client";

import { useEffect } from "react";

const storageKey = "stormbridge:settings";
const defaultTheme = "dark";

type StoredSettings = {
  appearance?: {
    theme?: "light" | "dark" | "system";
  };
};

function applyTheme(theme: "light" | "dark" | "system") {
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.classList.toggle("dark", theme === "dark" || (theme === "system" && prefersDark));
  root.style.colorScheme = theme === "system" ? (prefersDark ? "dark" : "light") : theme;
}

export function ThemeController() {
  useEffect(() => {
    function readTheme() {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return defaultTheme;
      try {
        return ((JSON.parse(raw) as StoredSettings).appearance?.theme ?? defaultTheme) as "light" | "dark" | "system";
      } catch {
        return defaultTheme;
      }
    }

    applyTheme(readTheme());
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onMediaChange = () => {
      if (readTheme() === "system") applyTheme("system");
    };
    const onStorage = () => applyTheme(readTheme());
    const onCustom = () => applyTheme(readTheme());

    media.addEventListener("change", onMediaChange);
    window.addEventListener("storage", onStorage);
    window.addEventListener("stormbridge-settings-updated", onCustom);

    return () => {
      media.removeEventListener("change", onMediaChange);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("stormbridge-settings-updated", onCustom);
    };
  }, []);

  return null;
}
