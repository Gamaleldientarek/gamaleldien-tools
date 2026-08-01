import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const BRAND_ORANGE = "#e16105";
const DARK_BG = "#0a0a0a";
const PRIMARY_200 = "#BFDBFE";
const PRIMARY_300 = "#93C5FD";
const PRIMARY_400 = "#60A5FA";
const PRIMARY_500 = "#3B82F6";
const PRIMARY_600 = "#2563EB";
const PRIMARY_700 = "#1D4ED8";
const PRIMARY_800 = "#1E40AF";

export const Scene4_Power: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene lasts 3 seconds (90 frames)
  // Theme toggle happens at 0.3s
  const toggleFrame = 0.3 * fps;
  const isDark = frame >= toggleFrame;

  // Theme transition
  const bgOpacity = spring({
    frame: frame - toggleFrame,
    fps,
    config: { damping: 200 },
  });

  // Charts appear after theme toggle (0.5s after toggle)
  const chartsDelay = toggleFrame + 0.5 * fps;
  const showCharts = frame >= chartsDelay;

  // Bar chart bars grow (staggered)
  const barData = [
    { height: 60, color: PRIMARY_200 },
    { height: 80, color: PRIMARY_300 },
    { height: 100, color: PRIMARY_400 },
    { height: 120, color: PRIMARY_500 },
    { height: 90, color: PRIMARY_600 },
    { height: 70, color: PRIMARY_700 },
    { height: 50, color: PRIMARY_800 },
  ];

  // "DARK MODE." text flash
  const textOpacity = interpolate(frame, [toggleFrame, toggleFrame + 10, toggleFrame + 30], [0, 1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Pie chart rotation
  const pieRotation = interpolate(frame, [chartsDelay, chartsDelay + 90], [0, 360], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: isDark ? DARK_BG : "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 40,
        position: "relative",
        transition: "background-color 0.3s",
        // Dot grid pattern (only visible in dark mode)
        backgroundImage: isDark
          ? `radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`
          : "none",
        backgroundSize: "32px 32px",
      }}
    >
      {/* Navbar with theme toggle */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 60,
            height: 32,
            backgroundColor: isDark ? PRIMARY_600 : "#e5e7eb",
            borderRadius: 16,
            position: "relative",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              backgroundColor: "white",
              borderRadius: "50%",
              position: "absolute",
              top: 2,
              left: isDark ? 30 : 2,
              transition: "left 0.3s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            {isDark ? "🌙" : "☀️"}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {showCharts && (
        <div
          style={{
            display: "flex",
            gap: 48,
            alignItems: "flex-end",
            marginTop: 100,
          }}
        >
          {/* Bar Chart */}
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 200 }}>
            {barData.map((bar, index) => {
              const barSpring = spring({
                frame: frame - chartsDelay,
                fps,
                config: { damping: 15 },
                delay: index * 5,
              });

              const barHeight = interpolate(barSpring, [0, 1], [0, bar.height], {
                extrapolateRight: "clamp",
                extrapolateLeft: "clamp",
              });

              return (
                <div
                  key={index}
                  style={{
                    width: 40,
                    height: barHeight,
                    backgroundColor: bar.color,
                    borderRadius: "8px 8px 0 0",
                    transition: "height 0.3s",
                  }}
                />
              );
            })}
          </div>

          {/* Pie Chart */}
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: `conic-gradient(
                ${PRIMARY_300} 0deg 90deg,
                ${PRIMARY_400} 90deg 180deg,
                ${PRIMARY_500} 180deg 270deg,
                ${PRIMARY_600} 270deg 360deg
              )`,
              transform: `rotate(${pieRotation}deg)`,
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
            }}
          />

          {/* Line Chart */}
          <svg width="200" height="120" style={{ overflow: "visible" }}>
            <polyline
              points="0,100 40,80 80,60 120,40 160,20 200,0"
              fill="none"
              stroke={PRIMARY_500}
              strokeWidth="3"
              strokeDasharray="240"
              strokeDashoffset={interpolate(frame, [chartsDelay, chartsDelay + 40], [240, 0], {
                extrapolateRight: "clamp",
                extrapolateLeft: "clamp",
              })}
            />
          </svg>
        </div>
      )}

      {/* Charts Label */}
      {showCharts && (
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: isDark ? "#9ca3af" : "#6b7280",
            marginTop: 40,
          }}
        >
          CHARTS PREVIEW
        </h3>
      )}

      {/* Text overlay: "DARK MODE." */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 72,
          fontWeight: 700,
          color: "white",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          opacity: textOpacity,
          textShadow: `0 0 24px ${BRAND_ORANGE}`,
        }}
      >
        DARK MODE.
      </div>
    </div>
  );
};
