import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const BRAND_ORANGE = "#e16105";
const DARK_BG = "#0a0a0a";

const EXPORT_TABS = [
  "Tailwind v3",
  "Tailwind v4",
  "CSS Variables",
  "Figma Variables",
  "JSON Tokens",
  "CSS",
];

const CODE_SAMPLES = {
  "Figma Variables": `{
  "primary-50": {
    "$type": "color",
    "$value": "#EFF6FF"
  }
}`,
  "Tailwind v4": `@theme {
  --color-primary-500: oklch(59% 0.21 265);
}`,
  "CSS Variables": `:root {
  --primary-500: #3B82F6;
}`,
};

export const Scene5_Workflow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene lasts 4 seconds (120 frames)
  // Tab cycling: frames 0-80 (cycle through tabs)
  // Copy action: frame 80-95
  // Download action: frame 95-120

  const tabCycleDuration = 20; // Each tab shows for ~0.67s
  const activeTabIndex = Math.min(Math.floor(frame / tabCycleDuration), EXPORT_TABS.length - 1);
  const activeTab = EXPORT_TABS[activeTabIndex];

  // Copy button flash (at frame 80)
  const copyFrame = 80;
  const copyActive = frame >= copyFrame && frame < copyFrame + 15;
  const copyFlash = spring({
    frame: frame - copyFrame,
    fps,
    config: { damping: 15 },
    durationInFrames: 10,
  });

  // Toast notification
  const toastOpacity = interpolate(frame, [copyFrame + 5, copyFrame + 10, copyFrame + 30, copyFrame + 35], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const toastY = interpolate(frame, [copyFrame + 5, copyFrame + 15], [20, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Download button click (at frame 95)
  const downloadFrame = 95;
  const downloadActive = frame >= downloadFrame;

  // Text overlays
  const text1Opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const text1Fade = interpolate(frame, [60, 75], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const text2Delay = 60;
  const text2Opacity = interpolate(frame, [text2Delay, text2Delay + 15], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Word stagger for "FIGMA. TAILWIND. CSS."
  const word1Opacity = interpolate(frame, [text2Delay, text2Delay + 10], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const word2Opacity = interpolate(frame, [text2Delay + 5, text2Delay + 15], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const word3Opacity = interpolate(frame, [text2Delay + 10, text2Delay + 20], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: DARK_BG,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        position: "relative",
        backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      }}
    >
      {/* Export Section */}
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(48px)",
          borderRadius: 16,
          padding: 32,
          width: "80%",
          maxWidth: 700,
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Header */}
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#9ca3af",
            marginBottom: 20,
          }}
        >
          EXPORT FORMATS
        </h3>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          {EXPORT_TABS.map((tab, index) => (
            <div
              key={tab}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                backgroundColor: index === activeTabIndex ? BRAND_ORANGE : "rgba(255, 255, 255, 0.05)",
                color: index === activeTabIndex ? "white" : "#9ca3af",
                border: index === activeTabIndex ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
                transition: "all 0.3s",
              }}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Code Preview */}
        <div
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: 12,
            padding: 20,
            fontFamily: "monospace",
            fontSize: 13,
            color: "#d1d5db",
            lineHeight: 1.6,
            maxHeight: 200,
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {CODE_SAMPLES[activeTab as keyof typeof CODE_SAMPLES] || CODE_SAMPLES["CSS Variables"]}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          {/* Copy Button */}
          <button
            style={{
              flex: 1,
              backgroundColor: copyActive ? "#10B981" : BRAND_ORANGE,
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              padding: "14px 24px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              transform: copyActive ? `scale(${1 - copyFlash * 0.05})` : "scale(1)",
              transition: "background-color 0.3s",
              boxShadow: copyActive
                ? "0 0 24px rgba(16, 185, 129, 0.5)"
                : "0 2px 8px rgba(225, 97, 5, 0.3)",
            }}
          >
            {copyActive ? "✓ COPIED" : "COPY TO CLIPBOARD"}
          </button>

          {/* Download Button */}
          <button
            style={{
              backgroundColor: "transparent",
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              padding: "14px 24px",
              borderRadius: 8,
              border: "2px solid rgba(255, 255, 255, 0.2)",
              cursor: "pointer",
              opacity: downloadActive ? 0.5 : 1,
              transition: "opacity 0.3s",
            }}
          >
            DOWNLOAD FILE
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: `translate(-50%, ${toastY}px)`,
            backgroundColor: "rgba(16, 185, 129, 0.95)",
            color: "white",
            padding: "12px 24px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            opacity: toastOpacity,
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
          }}
        >
          COPIED
        </div>
      )}

      {/* Text overlay: "6 EXPORT FORMATS." */}
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: "10%",
          fontSize: 48,
          fontWeight: 700,
          color: "white",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          opacity: text1Opacity * text1Fade,
          textShadow: "0 2px 16px rgba(0, 0, 0, 0.5)",
        }}
      >
        6 EXPORT FORMATS.
      </div>

      {/* Text overlay: "FIGMA. TAILWIND. CSS." (staggered) */}
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: "10%",
          fontSize: 48,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          textShadow: "0 2px 16px rgba(0, 0, 0, 0.5)",
          display: "flex",
          gap: 16,
        }}
      >
        <span style={{ color: BRAND_ORANGE, opacity: word1Opacity }}>FIGMA.</span>
        <span style={{ color: "white", opacity: word2Opacity }}>TAILWIND.</span>
        <span style={{ color: "white", opacity: word3Opacity }}>CSS.</span>
      </div>
    </div>
  );
};
