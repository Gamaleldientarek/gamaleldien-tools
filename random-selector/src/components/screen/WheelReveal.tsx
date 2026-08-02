"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  SETTLE_PAUSE_MS,
  STARTER_HOLD_MS,
  TICK_COUNT,
  G_DUR_SLOW,
  G_EASE_OUT,
  prefersReducedMotion,
  tickSchedule,
} from "@/components/motion/timing";

/**
 * WheelReveal — the projection at the moment a name is drawn. This is the
 * emotional peak of the product and the one screen a room of people watches
 * together, so it gets more care than anything else here.
 *
 * THREE BEATS
 *
 *  1. SPIN (0 → ~3.8s). Near-black. One line dead centre, cycling names, with
 *     a quiet "DRAWING" label above it. Nothing else on screen — no numeral,
 *     no marker, no list. The bloom rises with the deceleration, so the room
 *     sees the light come up under the name as the spin slows.
 *
 *  2. THE LANDING (~3.8 → ~5.3s). The name locks (scale only — never opacity,
 *     so it cannot blink out of existence at the instant it is revealed). The
 *     label swaps to "GOES FIRST" and a rule draws itself beneath the name.
 *     Nothing else on screen for a full held beat.
 *
 *  3. THE ORDER (~5.3s on). The name FLIPs up to title size and stays
 *     resident — a facilitator needs to see who goes first for the next ten
 *     minutes, not for 1.5 seconds. The rest cascade in beneath it.
 *
 * CONTRAST
 *
 * The bloom is anchored BELOW the frame (50% 118%), so its hot #FFE9C5 centre
 * — the ~2.98:1 hazard documented in the design system — sits off-canvas.
 * Only the deep falloff reaches the screen, where white type measures well
 * above 7:1. The hazard is solved by geometry, not by a scrim over the top.
 *
 * And the standing rule for this screen: NO ORANGE ON ANY WORD THE ROOM MUST
 * READ. White carries every name; orange carries only the label and the rule.
 *
 * Props are the already-computed server-side Fisher-Yates result. This
 * component performs NO shuffling and NO data fetching. Parents re-run the
 * reveal for a redraw by remounting with `key={draw.id}`.
 */
export interface RevealParticipant {
  id: string;
  displayName: string;
  joinNumber: number;
}

export interface WheelRevealProps {
  /** Final running order; `order[0]` is the starter. */
  order: RevealParticipant[];
  /** Skip the animation and show the settled layout (already-revealed load). */
  resolved?: boolean;
}

type Phase = "wheel" | "starter" | "resolved";

/** True when the reveal should skip the animation entirely. */
function skipAnimation(resolved: boolean, orderLength: number): boolean {
  return resolved || orderLength < 2 || prefersReducedMotion();
}

/**
 * A long name must not wrap on a projector — a wrapped name breaks the moment.
 *
 * This was first written as character-count size steps, and that was wrong:
 * "Mighty Cedar" (12 chars) still wrapped at the 12vw step, because a step
 * table can only ever approximate the real width of a specific string.
 *
 * Instead, derive the size from the width the text will actually occupy.
 * With `nowrap`, a line of N characters is about `N * ADVANCE * fontSize`
 * wide, so the size that fills a target width W is `W / (N * ADVANCE)`.
 * Capped at 14vw so short names don't become absurd.
 *
 * ADVANCE is deliberately an UPPER bound on Clash Display Bold's average
 * uppercase advance, not the mean — overestimating costs a few pixels of
 * headroom, underestimating costs a wrapped line, and only one of those is
 * visible from the back of a room.
 */
const ADVANCE = 0.72;
const FILL_VW = 86;

function peakSizeFor(name: string): string {
  const n = Math.max(name.trim().length, 1);
  return `min(14vw, ${(FILL_VW / (n * ADVANCE)).toFixed(2)}vw)`;
}

export function WheelReveal({ order, resolved = false }: WheelRevealProps) {
  // Decided once, lazily: animated reveals only ever mount client-side (a
  // live draw arriving over Realtime), so matchMedia is available here.
  const [phase, setPhase] = useState<Phase>(() =>
    skipAnimation(resolved, order.length) ? "resolved" : "wheel"
  );
  const [cycleIndex, setCycleIndex] = useState(0);

  const headRef = useRef<HTMLDivElement | null>(null);
  const lastRect = useRef<DOMRect | null>(null);

  useEffect(() => {
    if (skipAnimation(resolved, order.length)) return;

    const timeouts: number[] = [];
    // Interval grows on a power curve — the spinner visibly slows down.
    const schedule = tickSchedule();
    schedule.forEach((at, i) => {
      const idx = (i + 1) % order.length;
      timeouts.push(window.setTimeout(() => setCycleIndex(idx), at));
    });
    const at = schedule[TICK_COUNT - 1];
    timeouts.push(
      window.setTimeout(() => setPhase("starter"), at + SETTLE_PAUSE_MS)
    );
    timeouts.push(
      window.setTimeout(
        () => setPhase("resolved"),
        at + SETTLE_PAUSE_MS + STARTER_HOLD_MS
      )
    );
    return () => timeouts.forEach((t) => window.clearTimeout(t));
  }, [resolved, order]);

  /**
   * FLIP the name from the centre of the stage to its resting place at the
   * top. Measured rather than computed, because the peak size is content
   * dependent — a 6-character name and a 22-character name start from
   * genuinely different boxes.
   *
   * Transform and opacity only; the layout itself is never animated.
   */
  useLayoutEffect(() => {
    const el = headRef.current;
    if (!el) return;

    const next = el.getBoundingClientRect();
    const prev = lastRect.current;
    lastRect.current = next;

    if (!prev || prefersReducedMotion()) return;
    if (prev.width === 0 || next.width === 0) return;

    const dx = prev.left + prev.width / 2 - (next.left + next.width / 2);
    const dy = prev.top + prev.height / 2 - (next.top + next.height / 2);
    const scale = prev.height / next.height;

    // Nothing meaningful moved — don't animate a jitter.
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(scale - 1) < 0.01) {
      return;
    }

    // Invert, then play.
    el.style.transformOrigin = "center center";
    el.style.transition = "none";
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;

    const raf = requestAnimationFrame(() => {
      el.style.transition = `transform ${G_DUR_SLOW}ms ${G_EASE_OUT}`;
      el.style.transform = "";
    });
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const starter = order[0];
  const rest = order.slice(1);
  const spinning = phase === "wheel";
  const settled = phase === "resolved";
  const shownName = spinning
    ? order[cycleIndex % order.length].displayName
    : starter.displayName;

  // The bloom rises under the name as the spin decelerates, holds through the
  // landing, then drops back so the order list sits on clean dark ground.
  const bloomOpacity = spinning ? 0.35 : settled ? 0.45 : 1;
  const bloomY = spinning ? "128%" : "118%";

  return (
    <div
      className="g-bloom flex h-full w-full flex-col items-center px-[5vw] py-[4vh] text-center"
      data-slot="wheel-stage"
      style={
        {
          "--bloom-opacity": bloomOpacity,
          "--bloom-y": bloomY,
          justifyContent: settled ? "flex-start" : "center",
        } as React.CSSProperties
      }
    >
      {/* The name block. Centre stage for beats 1–2, then FLIPs to the top
          third and stays there — it is the answer to the question the room
          just asked, and it should still be readable ten minutes later. */}
      <div ref={headRef} className="flex flex-col items-center">
        <span
          className={`g-proj-label ${
            spinning ? "text-text-secondary" : "text-accent-hover"
          }`}
        >
          {spinning ? "Drawing" : "Goes first"}
        </span>

        <h2
          key={settled ? "settled" : "peak"}
          className={`mt-[1.6vh] font-display font-bold uppercase leading-[0.92] tracking-[-0.03em] text-white ${
            spinning ? "opacity-90" : "g-lock"
          } ${settled ? "" : "whitespace-nowrap"}`}
          style={{
            fontSize: settled
              ? "clamp(1.85rem, 4.5vw, 3.25rem)"
              : peakSizeFor(shownName),
          }}
        >
          {shownName}
        </h2>

        {/* The earned rule. Draws itself left-to-right once the name lands,
            then travels with it. Orange is allowed here — it is not a word. */}
        {!spinning && (
          <span
            aria-hidden
            className="g-rule-draw mt-[1.6vh] block h-1 w-full bg-accent"
          />
        )}
      </div>

      {/* Announce only the settled result to assistive tech (no spam). */}
      <p className="sr-only" aria-live="polite">
        {spinning ? "Drawing the order" : `${starter.displayName} goes first`}
      </p>

      {/* The full order — cascades in under the starter after the held beat. */}
      {settled && (
        <ol className="mt-[5vh] grid w-full max-w-[76vw] grid-cols-2 gap-x-[3vw] gap-y-[1.4vh] text-start sm:grid-cols-3">
          {rest.map((p, i) => (
            <li
              key={p.id}
              className="g-rise flex items-baseline gap-[1.2vw] border-t border-border-light pt-[1vh]"
              style={{ animationDelay: `${120 + i * 60}ms` }}
            >
              <span
                className="g-numeral shrink-0 text-accent/60"
                style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.6rem)" }}
              >
                {String(i + 2).padStart(2, "0")}
              </span>
              <span className="font-display text-[clamp(1.1rem,1.9vw,2.1rem)] font-semibold leading-tight text-white">
                {p.displayName}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default WheelReveal;
