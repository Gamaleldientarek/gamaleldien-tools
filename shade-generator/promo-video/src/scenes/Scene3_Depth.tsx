import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const BRAND_ORANGE = "#e16105";
const LIGHT_BG = "#f5f5f5";
const PRIMARY_500 = "#3B82F6";
const PRIMARY_600 = "#2563EB";
const PRIMARY_900 = "#1E3A8A";

export const Scene3_Depth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene lasts 4 seconds (120 frames)
  // Carousel scroll animation (infinite loop feeling)
  const scrollX = interpolate(frame, [0, 120], [0, -600], {
    extrapolateRight: "clamp",
  });

  // "LIVE PREVIEW." text appears at start
  const text1Opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const text1Fade = interpolate(frame, [60, 75], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "EVERY ELEMENT. INTERACTIVE." text appears at 2s
  const text2Delay = 2 * fps;
  const text2Opacity = interpolate(frame, [text2Delay, text2Delay + 15], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Tooltip appears at 2s
  const tooltipOpacity = interpolate(frame, [text2Delay + 10, text2Delay + 20], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const tooltipY = interpolate(frame, [text2Delay + 10, text2Delay + 25], [10, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Tab switch to Components at 2.5s
  const tabSwitchFrame = 2.5 * fps;
  const componentsActive = frame >= tabSwitchFrame;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: LIGHT_BG,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 40,
        position: "relative",
      }}
    >
      {/* Header */}
      <h2
        style={{
          fontSize: 14,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#6b7280",
          marginBottom: 24,
        }}
      >
        PREVIEW YOUR COLORS
      </h2>

      {/* Cards Carousel */}
      {!componentsActive && (
        <div
          style={{
            width: "100%",
            overflow: "hidden",
            position: "relative",
            height: 400,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 16,
              transform: `translateX(${scrollX}px)`,
            }}
          >
            {/* Card 1: Hero Card */}
            <div
              style={{
                width: 300,
                height: 380,
                backgroundColor: PRIMARY_500,
                borderRadius: 16,
                padding: 32,
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  backgroundColor: BRAND_ORANGE,
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: 6,
                  alignSelf: "flex-start",
                }}
              >
                FEATURED
              </span>
              <h3 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>Amazing Product</h3>
              <p style={{ fontSize: 14, opacity: 0.9 }}>
                Discover the future of design with our revolutionary color tools.
              </p>
            </div>

            {/* Card 2: Product Card */}
            <div
              style={{
                width: 300,
                height: 380,
                backgroundColor: "white",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 200,
                  background: `linear-gradient(135deg, ${PRIMARY_500}, ${PRIMARY_600})`,
                }}
              />
              <div style={{ padding: 24 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: BRAND_ORANGE,
                    textTransform: "uppercase",
                  }}
                >
                  SALE
                </span>
                <h4 style={{ fontSize: 20, fontWeight: 700, margin: "8px 0" }}>Design Tool</h4>
                <p style={{ fontSize: 14, color: "#6b7280" }}>Premium color generator</p>
              </div>
            </div>

            {/* Card 3: Testimonial Card */}
            <div
              style={{
                width: 300,
                height: 380,
                backgroundColor: PRIMARY_900,
                borderRadius: 16,
                padding: 32,
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <p style={{ fontSize: 18, fontStyle: "italic", marginBottom: 24 }}>
                "The best color tool I've ever used. Simple, powerful, and free!"
              </p>
              <div style={{ fontSize: 12, opacity: 0.7 }}>— Sarah J., Designer</div>
            </div>
          </div>
        </div>
      )}

      {/* Components Preview (after tab switch) */}
      {componentsActive && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            width: "100%",
            maxWidth: 800,
          }}
        >
          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              style={{
                backgroundColor: PRIMARY_500,
                color: "white",
                padding: "12px 24px",
                borderRadius: 8,
                border: "none",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Primary
            </button>
            <button
              style={{
                backgroundColor: "transparent",
                color: PRIMARY_500,
                padding: "12px 24px",
                borderRadius: 8,
                border: `2px solid ${PRIMARY_500}`,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Outline
            </button>
            <button
              style={{
                backgroundColor: "#DBEAFE",
                color: PRIMARY_600,
                padding: "12px 24px",
                borderRadius: 8,
                border: "none",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Subtle
            </button>
          </div>

          {/* Badges */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <span
              style={{
                backgroundColor: PRIMARY_500,
                color: "white",
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              INFO
            </span>
            <span
              style={{
                backgroundColor: BRAND_ORANGE,
                color: "white",
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              PRIMARY
            </span>
            <span
              style={{
                backgroundColor: "transparent",
                color: PRIMARY_500,
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                border: `2px solid ${PRIMARY_500}`,
              }}
            >
              OUTLINE
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          display: "flex",
          gap: 8,
          backgroundColor: "white",
          padding: 8,
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            backgroundColor: !componentsActive ? PRIMARY_500 : "transparent",
            color: !componentsActive ? "white" : "#6b7280",
          }}
        >
          Cards
        </div>
        <div
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            backgroundColor: componentsActive ? PRIMARY_500 : "transparent",
            color: componentsActive ? "white" : "#6b7280",
          }}
        >
          Components
        </div>
      </div>

      {/* Tooltip */}
      {tooltipOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            top: "45%",
            left: "50%",
            transform: `translate(-50%, ${tooltipY}px)`,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            color: "white",
            padding: "8px 16px",
            borderRadius: 8,
            fontSize: 12,
            fontFamily: "monospace",
            opacity: tooltipOpacity,
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>primary . Core 500 . #3B82F6</span>
          <div style={{ width: 16, height: 16, backgroundColor: PRIMARY_500, borderRadius: 4 }} />
        </div>
      )}

      {/* Text overlay: "LIVE PREVIEW." */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "10%",
          fontSize: 48,
          fontWeight: 700,
          color: "white",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          opacity: text1Opacity * text1Fade,
          textShadow: "0 2px 16px rgba(0, 0, 0, 0.5)",
        }}
      >
        LIVE PREVIEW.
      </div>

      {/* Text overlay: "EVERY ELEMENT. INTERACTIVE." */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "10%",
          fontSize: 40,
          fontWeight: 700,
          color: "white",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          opacity: text2Opacity,
          textShadow: "0 2px 16px rgba(0, 0, 0, 0.5)",
          textAlign: "right",
          lineHeight: 1.3,
        }}
      >
        EVERY ELEMENT.
        <br />
        INTERACTIVE.
      </div>
    </div>
  );
};
