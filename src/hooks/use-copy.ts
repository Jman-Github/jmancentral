import { useCallback, useEffect, useState } from "react";

export type CopyState = "idle" | "copied" | "failed";

// Fallback for browsers or contexts where the async Clipboard API is missing or rejects.
// execCommand("copy") copies the active selection, so the textarea must be focused and fully
// selected (setSelectionRange is what iOS Safari honours); focus then returns to where it was.
function legacyCopy(text: string) {
  const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  try {
    textarea.focus({ preventScroll: true });
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
    previouslyFocused?.focus({ preventScroll: true });
  }
}

/**
 * Copies text to the clipboard. `state` reports the latest attempt ("copied" or "failed") for
 * `resetMs`, then returns to "idle"; `attempt` increases with every try so callers can
 * re-announce repeated results.
 */
export function useCopy(resetMs = 1600) {
  const [result, setResult] = useState<{ state: CopyState; attempt: number }>({ state: "idle", attempt: 0 });

  // Each attempt creates a new result object, so the timer restarts instead of inheriting the last one.
  useEffect(() => {
    if (result.state === "idle") return;
    const id = window.setTimeout(() => setResult((current) => ({ ...current, state: "idle" })), resetMs);
    return () => window.clearTimeout(id);
  }, [result, resetMs]);

  const copy = useCallback(async (text: string) => {
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch {
      // Clipboard API can reject (permissions, insecure context); fall through to the legacy path.
    }
    if (!ok) {
      // Note: after a rejected writeText this runs outside the click's user activation, which
      // Firefox and Safari require for execCommand, so it can fail there; the caller shows that.
      try {
        ok = legacyCopy(text);
      } catch {
        ok = false;
      }
    }
    setResult((current) => ({ state: ok ? "copied" : "failed", attempt: current.attempt + 1 }));
    return ok;
  }, []);

  return { state: result.state, attempt: result.attempt, copy };
}
