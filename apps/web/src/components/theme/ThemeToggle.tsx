"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "portfolio-theme";

export type PortfolioTheme = "vscode-dark" | "vscode-light";

export function getStoredTheme(): PortfolioTheme {
  if (typeof window === "undefined") return "vscode-dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "vscode-light" ? "vscode-light" : "vscode-dark";
}

export function applyTheme(theme: PortfolioTheme) {
  document.documentElement.setAttribute("data-theme", theme);
  window.localStorage.setItem(STORAGE_KEY, theme);
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<PortfolioTheme>("vscode-dark");

  useEffect(() => {
    const current = getStoredTheme();
    setTheme(current);
    applyTheme(current);
  }, []);

  function toggle() {
    const next: PortfolioTheme =
      theme === "vscode-dark" ? "vscode-light" : "vscode-dark";
    setTheme(next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      className={compact ? "btn btn-ghost btn-square btn-sm" : "btn btn-ghost btn-sm gap-2"}
      onClick={toggle}
      aria-label="Toggle VS Code light and dark theme"
      title="Toggle theme"
    >
      {theme === "vscode-dark" ? (
        <span aria-hidden>☀</span>
      ) : (
        <span aria-hidden>☾</span>
      )}
      {!compact && (
        <span className="font-mono text-xs">
          {theme === "vscode-dark" ? "Dark+" : "Light+"}
        </span>
      )}
    </button>
  );
}
