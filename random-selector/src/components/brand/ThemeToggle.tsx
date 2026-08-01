"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * ThemeToggle — three quiet text options: Auto / Light / Dark. Caption-scale,
 * no icons, state shown by the accent colour plus aria-pressed.
 *
 * Auto follows the device live; Light and Dark persist to localStorage
 * (`tog-theme`) and override it. The inline head script in layout.tsx applies
 * the same resolution before first paint.
 *
 * DARK is this system's default: `auto` resolves to dark unless the device
 * explicitly asks for light. That is the inverse of the AZMX original, and it
 * is deliberate — every tool in this family is dark-first.
 *
 * The projection screen does not theme at all and carries no toggle.
 */

type Mode = "auto" | "light" | "dark";

const STORAGE_KEY = "tog-theme";
const MODES: Mode[] = ["auto", "light", "dark"];

function applyMode(mode: Mode) {
  const root = document.documentElement;
  const systemLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const resolved = mode === "auto" ? (systemLight ? "light" : "dark") : mode;
  root.setAttribute("data-theme", resolved);
  root.setAttribute("data-theme-mode", mode);
}

/* The <html data-theme-mode> attribute is the source of truth (set before
 * paint by the head script). Read it as an external store — this hydrates
 * cleanly from the SSR "auto" and keeps multiple toggles on a page in sync. */
function subscribeMode(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme-mode"],
  });
  return () => observer.disconnect();
}

function readMode(): Mode {
  const attr = document.documentElement.getAttribute("data-theme-mode");
  return attr === "light" || attr === "dark" ? attr : "auto";
}

const serverMode = (): Mode => "auto";

export interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const mode = useSyncExternalStore(subscribeMode, readMode, serverMode);

  // In auto, track live device changes.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      const current =
        document.documentElement.getAttribute("data-theme-mode") ?? "auto";
      if (current === "auto") applyMode("auto");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const select = (next: Mode) => {
    try {
      if (next === "auto") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable — the choice still applies for this page view.
    }
    applyMode(next);
  };

  return (
    <span
      role="group"
      aria-label="Colour theme"
      className={`flex items-center gap-3 ${className}`.trim()}
    >
      <span className="g-caption uppercase text-text-secondary" aria-hidden>
        Theme
      </span>
      {MODES.map((m) => (
        <button
          key={m}
          type="button"
          aria-pressed={mode === m}
          onClick={() => select(m)}
          className={`g-caption cursor-pointer uppercase transition-colors duration-150 py-2 ${
            mode === m
              ? "font-semibold text-accent"
              : "text-text-secondary hover:text-text"
          }`}
        >
          {m}
        </button>
      ))}
    </span>
  );
}

export default ThemeToggle;
