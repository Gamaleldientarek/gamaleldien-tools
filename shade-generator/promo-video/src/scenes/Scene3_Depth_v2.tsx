/**
 * Scene 3: Depth - Preview Carousel + Components
 * Duration: 4 seconds (120 frames)
 * Shows live preview system
 */

import { useCurrentFrame, useVideoConfig, interpolate, Img, staticFile } from "remotion";
import { FONT_DISPLAY } from "../brand";

export const Scene3_Depth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline:
  // 0-2s: screenshot 05 (cards carousel in light theme)
  // 2-4s: screenshot 06 (components tab)

  const componentsStart = fps * 2.0;
  const crossfadeStart = componentsStart - 5;
  const crossfadeEnd = componentsStart + 5;

  const cardsOpacity = interpolate(
    frame,
    [crossfadeStart, crossfadeEnd],
    [1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const componentsOpacity = interpolate(
    frame,
    [crossfadeStart, crossfadeEnd],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // First text: "LIVE PREVIEW." appears at 0.5s
  const text1Delay = fps * 0.5;
  const text1Opacity = interpolate(
    frame,
    [text1Delay, text1Delay + 10],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // Text fades out at 2s (when switching to components)
  const text1FadeOut = interpolate(
    frame,
    [fps * 1.8, fps * 2.0],
    [1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const finalText1Opacity = Math.min(text1Opacity, text1FadeOut);

  // Second text: "EVERY ELEMENT. INTERACTIVE." appears at 2.2s
  const text2Delay = fps * 2.2;
  const text2Opacity = interpolate(
    frame,
    [text2Delay, text2Delay + 10],
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
      {/* Screenshot 05: Cards carousel */}
      <Img
        src={staticFile("screenshots/05-preview-cards-light.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          opacity: cardsOpacity,
        }}
      />

      {/* Screenshot 06: Components tab */}
      <Img
        src={staticFile("screenshots/06-components-light.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          opacity: componentsOpacity,
        }}
      />

      {/* Text overlay 1: "LIVE PREVIEW." */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          right: "10%",
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
        LIVE PREVIEW.
      </div>

      {/* Text overlay 2: "EVERY ELEMENT. INTERACTIVE." */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          right: "10%",
          fontFamily: FONT_DISPLAY,
          fontSize: 48,
          fontWeight: 700,
          color: "white",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          opacity: text2Opacity,
          textShadow: "0 2px 16px rgba(0, 0, 0, 0.5)",
          lineHeight: 1.3,
          textAlign: "right",
        }}
      >
        EVERY ELEMENT.
        <br />
        INTERACTIVE.
      </div>
    </div>
  );
};
