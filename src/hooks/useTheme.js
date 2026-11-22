import { useSyncExternalStore } from "react";

const storageKey = "myeco-theme";
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
const root = document.documentElement;
const themeEvent = "myeco-theme-change";

function getTheme() {
  return root.dataset.theme || (systemTheme.matches ? "dark" : "light");
}

function subscribe(onChange) {
  function syncStorage(event) {
    if (event.key !== storageKey && event.key !== null) return;
    if (event.newValue === "light" || event.newValue === "dark") {
      root.dataset.theme = event.newValue;
    } else {
      delete root.dataset.theme;
    }
    onChange();
  }

  systemTheme.addEventListener("change", onChange);
  window.addEventListener(themeEvent, onChange);
  window.addEventListener("storage", syncStorage);
  return () => {
    systemTheme.removeEventListener("change", onChange);
    window.removeEventListener(themeEvent, onChange);
    window.removeEventListener("storage", syncStorage);
  };
}

export function setTheme(theme) {
  root.dataset.theme = theme;
  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    // The current tab can still change theme if browser storage is unavailable.
  }
  window.dispatchEvent(new Event(themeEvent));
}

export const useTheme = () => useSyncExternalStore(subscribe, getTheme);
