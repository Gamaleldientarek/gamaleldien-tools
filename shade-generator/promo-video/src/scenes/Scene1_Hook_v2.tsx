/**
 * Scene 1: Hook - Real Tool Screenshot + Overlay
 * Duration: 2 seconds (60 frames)
 * Uses real screenshot from the tool
 */

import { useCurrentFrame, useVideoConfig, interpolate, Img, staticFile } from "remotion";
import { BRAND_ORANGE, DARK_BG, FONT_DISPLAY } from "../brand";

export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Transition from screenshot 01 (initial) to 02 (hex typed)
  // First 1 second: show 01 with typing animation overlay
  // Second 1 second: crossfade to 02 and show "ANY COLOR." text

  const showTyping = frame < fps * 1.0; // First 1 second
  const crossfadeStart = fps * 0.8;
  const crossfadeEnd = fps * 1.2;

  const screenshot01Opacity = interpolate(
    frame,
    [crossfadeStart, crossfadeEnd],
    [1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const screenshot02Opacity = interpolate(
    frame,
    [crossfadeStart, crossfadeEnd],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // Typewriter effect overlay
  const hexCode = "#3B82F6";
  const charsPerSecond = 5; // 200ms per char
  const charsToShow = Math.min(Math.floor((frame / fps) * charsPerSecond), hexCode.length);
  const displayedHex = hexCode.slice(0, charsToShow);

  // "ANY COLOR." text appears at 1.5s
  const textDelay = fps * 1.5;
  const textOpacity = interpolate(
    frame,
    [textDelay, textDelay + 10],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const textY = interpolate(
    frame,
    [textDelay, textDelay + 15],
    [20, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: DARK_BG,
      }}
    >
      {/* Screenshot 01: Initial state */}
      <Img
        src={staticFile("screenshots/01-initial.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          opacity: screenshot01Opacity,
        }}
      />

      {/* Screenshot 02: After hex input */}
      <Img
        src={staticFile("screenshots/02-hex-blue.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          opacity: screenshot02Opacity,
        }}
      />

      {/* Typewriter overlay (only during first second) */}
      {showTyping && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily: "monospace",
            fontSize: 72,
            fontWeight: 700,
            color: "white",
            letterSpacing: "0.1em",
            textShadow: "0 4px 24px rgba(0, 0, 0, 0.6)",
            opacity: interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {displayedHex}
          <span
            style={{
              opacity: Math.floor(frame / 15) % 2, // Blinking cursor
              marginLeft: 8,
            }}
          >
            |
          </span>
        </div>
      )}

      {/* Text overlay: "ANY COLOR." */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: `translate(-50%, ${textY}px)`,
          fontFamily: FONT_DISPLAY,
          fontSize: 80,
          fontWeight: 700,
          color: "white",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          opacity: textOpacity,
          textAlign: "center",
          textShadow: "0 2px 16px rgba(0, 0, 0, 0.5)",
        }}
      >
        ANY COLOR.
      </div>
    </div>
  );
};
