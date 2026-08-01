/**
 * Scene 4: Power - Theme Toggle + Charts
 * Duration: 3 seconds (90 frames)
 * Shows dark mode transition and chart animations
 */

import { useCurrentFrame, useVideoConfig, interpolate, Img, staticFile } from "remotion";
import { BRAND_ORANGE, FONT_DISPLAY } from "../brand";

export const Scene4_Power: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline:
  // 0-1s: screenshot 07 (just switched to dark theme)
  // 1-3s: screenshot 08 (charts tab in dark theme)

  const chartsStart = fps * 1.0;
  const crossfadeStart = chartsStart - 5;
  const crossfadeEnd = chartsStart + 5;

  const darkThemeOpacity = interpolate(
    frame,
    [crossfadeStart, crossfadeEnd],
    [1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  const chartsOpacity = interpolate(
    frame,
    [crossfadeStart, crossfadeEnd],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // "DARK MODE." text flashes at 0.5s for 1 second
  const textDelay = fps * 0.2;
  const textDuration = fps * 1.0;
  const textOpacity = interpolate(
    frame,
    [textDelay, textDelay + 10, textDelay + textDuration - 10, textDelay + textDuration],
    [0, 1, 1, 0],
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
      {/* Screenshot 07: Dark theme (just toggled) */}
      <Img
        src={staticFile("screenshots/07-dark-theme.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          opacity: darkThemeOpacity,
        }}
      />

      {/* Screenshot 08: Charts tab */}
      <Img
        src={staticFile("screenshots/08-charts-dark.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          opacity: chartsOpacity,
        }}
      />

      {/* Text overlay: "DARK MODE." with orange glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: FONT_DISPLAY,
          fontSize: 80,
          fontWeight: 700,
          color: "white",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          opacity: textOpacity,
          textShadow: `0 0 24px rgba(225, 97, 5, 0.4), 0 2px 16px rgba(0, 0, 0, 0.5)`,
        }}
      >
        DARK MODE.
      </div>
    </div>
  );
};
