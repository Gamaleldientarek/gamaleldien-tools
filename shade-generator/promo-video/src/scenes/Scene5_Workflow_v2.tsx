/**
 * Scene 5: Workflow - Export System
 * Duration: 4 seconds (120 frames)
 * Shows export tab cycling and actions
 */

import { useCurrentFrame, useVideoConfig, interpolate, Img, staticFile } from "remotion";
import { BRAND_ORANGE, FONT_DISPLAY } from "../brand";

export const Scene5_Workflow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline:
  // 0-1.5s: screenshot 09 (Figma Variables)
  // 1.5-2.5s: screenshot 10 (Tailwind v4)
  // 2.5-4s: screenshot 11 (CSS Variables)

  const tailwindStart = fps * 1.5;
  const cssStart = fps * 2.5;

  let currentScreenshot = "09-export-figma.png";
  if (frame >= cssStart) {
    currentScreenshot = "11-export-css.png";
  } else if (frame >= tailwindStart) {
    currentScreenshot = "10-export-tailwind.png";
  }

  // Subtle crossfade between tabs
  const fadeTransition = (startFrame: number) => {
    const fadeStart = startFrame - 3;
    const fadeEnd = startFrame + 3;
    return interpolate(
      frame,
      [fadeStart, fadeEnd],
      [0, 1],
      { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
    );
  };

  let opacity = 1;
  if (frame < fps * 0.3) {
    opacity = interpolate(frame, [0, fps * 0.3], [0, 1], { extrapolateRight: "clamp" });
  }

  // First text: "6 EXPORT FORMATS." appears at 0.5s
  const text1Delay = fps * 0.5;
  const text1Opacity = interpolate(
    frame,
    [text1Delay, text1Delay + 10],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // Text fades out at 2s
  const text1FadeOut = interpolate(
    frame,
    [fps * 1.8, fps * 2.0],
    [1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const finalText1Opacity = Math.min(text1Opacity, text1FadeOut);

  // Second text: "FIGMA. TAILWIND. CSS." appears at 2s
  const text2Delay = fps * 2.0;
  
  // Staggered word appearance
  const figmaOpacity = interpolate(
    frame,
    [text2Delay, text2Delay + 8],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const tailwindOpacity = interpolate(
    frame,
    [text2Delay + 5, text2Delay + 13],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const cssOpacity = interpolate(
    frame,
    [text2Delay + 10, text2Delay + 18],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {/* Current screenshot */}
      <Img
        src={staticFile(`screenshots/${currentScreenshot}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity,
        }}
      />

      {/* Text overlay 1: "6 EXPORT FORMATS." */}
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "10%",
          fontFamily: FONT_DISPLAY,
          fontSize: 56,
          fontWeight: 700,
          color: "white",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          opacity: finalText1Opacity,
          textShadow: "0 2px 16px rgba(0, 0, 0, 0.5)",
        }}
      >
        6 EXPORT FORMATS.
      </div>

      {/* Text overlay 2: Staggered format names */}
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "10%",
          fontFamily: FONT_DISPLAY,
          fontSize: 56,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          textShadow: "0 2px 16px rgba(0, 0, 0, 0.5)",
          display: "flex",
          gap: "0.3em",
        }}
      >
        <span
          style={{
            color: BRAND_ORANGE,
            opacity: figmaOpacity,
          }}
        >
          FIGMA
        </span>
        <span style={{ color: "white", opacity: figmaOpacity }}>.</span>
        <span
          style={{
            color: "white",
            opacity: tailwindOpacity,
          }}
        >
          TAILWIND
        </span>
        <span style={{ color: "white", opacity: tailwindOpacity }}>.</span>
        <span
          style={{
            color: "white",
            opacity: cssOpacity,
          }}
        >
          CSS
        </span>
        <span style={{ color: "white", opacity: cssOpacity }}>.</span>
      </div>
    </div>
  );
};
