/**
 * Scene 2: Speed - 3x Spacebar Random Generation
 * Duration: 3 seconds (90 frames)
 * Shows rapid color generation using real screenshots
 */

import { useCurrentFrame, useVideoConfig, interpolate, Img, staticFile } from "remotion";
import { BRAND_ORANGE, FONT_DISPLAY } from "../brand";

export const Scene2_Speed: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline:
  // 0-1s: screenshot 02
  // 1-2s: screenshot 03 (first random)
  // 2-3s: screenshot 04 (second random)
  
  const scene2Start = fps * 1.0;
  const scene3Start = fps * 2.0;

  // Which screenshot to show
  let currentScreenshot = "02-hex-blue.png";
  if (frame >= scene3Start) {
    currentScreenshot = "04-random-2.png";
  } else if (frame >= scene2Start) {
    currentScreenshot = "03-random-1.png";
  }

  // Flash effect on each transition
  const flashDuration = 3; // 3 frames = 100ms
  const isFlashing =
    (frame >= scene2Start && frame < scene2Start + flashDuration) ||
    (frame >= scene3Start && frame < scene3Start + flashDuration);

  const flashOpacity = isFlashing ? 0.05 : 0;

  // Text overlay "11 SHADES. INSTANT." appears at 1.5s
  const textDelay = fps * 1.5;
  const textOpacity = interpolate(
    frame,
    [textDelay, textDelay + 10],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const textX = interpolate(
    frame,
    [textDelay, textDelay + 15],
    [-50, 0],
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
        }}
      />

      {/* Flash overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "white",
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Text overlay: "11 SHADES. INSTANT." */}
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: "10%",
          transform: `translateX(${textX}px)`,
          fontFamily: FONT_DISPLAY,
          fontSize: 64,
          fontWeight: 700,
          color: BRAND_ORANGE,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          opacity: textOpacity,
          textShadow: "0 2px 16px rgba(0, 0, 0, 0.5)",
        }}
      >
        11 SHADES. INSTANT.
      </div>
    </div>
  );
};
