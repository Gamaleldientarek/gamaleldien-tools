import { Series } from "remotion";
import { Scene1_Hook } from "./scenes/Scene1_Hook";
import { Scene2_Speed } from "./scenes/Scene2_Speed";
import { Scene3_Depth } from "./scenes/Scene3_Depth";
import { Scene4_Power } from "./scenes/Scene4_Power";
import { Scene5_Workflow } from "./scenes/Scene5_Workflow";
import { Scene6_Differentiator } from "./scenes/Scene6_Differentiator";
import { Scene7_CTA } from "./scenes/Scene7_CTA";
import "./utils/fonts"; // Load fonts

export type PromoVideoProps = {
  format: "vertical" | "horizontal";
};

export const PromoVideo: React.FC<PromoVideoProps> = ({ format }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0a0a",
      }}
    >
      <Series>
        {/* Scene 1: Hook - Hex code → 11 swatches explosion (0-2s, 60 frames) */}
        <Series.Sequence durationInFrames={60}>
          <Scene1_Hook />
        </Series.Sequence>

        {/* Scene 2: Speed - 3x spacebar random generation (2-5s, 90 frames) */}
        <Series.Sequence durationInFrames={90}>
          <Scene2_Speed />
        </Series.Sequence>

        {/* Scene 3: Depth - Preview carousel + Components (5-9s, 120 frames) */}
        <Series.Sequence durationInFrames={120}>
          <Scene3_Depth />
        </Series.Sequence>

        {/* Scene 4: Power - Theme toggle + Charts (9-12s, 90 frames) */}
        <Series.Sequence durationInFrames={90}>
          <Scene4_Power />
        </Series.Sequence>

        {/* Scene 5: Workflow - Export tabs + copy + download (12-16s, 120 frames) */}
        <Series.Sequence durationInFrames={120}>
          <Scene5_Workflow />
        </Series.Sequence>

        {/* Scene 6: Differentiator - Feature lines + "FREE." reveal (16-18s, 60 frames) */}
        <Series.Sequence durationInFrames={60}>
          <Scene6_Differentiator />
        </Series.Sequence>

        {/* Scene 7: CTA - Title + URL + attribution (18-20s, 60 frames) */}
        <Series.Sequence durationInFrames={60}>
          <Scene7_CTA />
        </Series.Sequence>
      </Series>
    </div>
  );
};
