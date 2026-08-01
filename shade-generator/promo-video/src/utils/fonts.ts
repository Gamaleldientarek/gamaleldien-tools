/**
 * Font Loading for Remotion
 * Using Clash Display from system fonts
 */

import { staticFile } from "remotion";

// Font face declarations
const CLASH_DISPLAY_REGULAR = new FontFace(
  "Clash Display",
  `url(/usr/local/share/fonts/clash-display/ClashDisplay-Regular.otf)`,
  { weight: "400", style: "normal" }
);

const CLASH_DISPLAY_MEDIUM = new FontFace(
  "Clash Display",
  `url(/usr/local/share/fonts/clash-display/ClashDisplay-Medium.otf)`,
  { weight: "500", style: "normal" }
);

const CLASH_DISPLAY_SEMIBOLD = new FontFace(
  "Clash Display",
  `url(/usr/local/share/fonts/clash-display/ClashDisplay-Semibold.otf)`,
  { weight: "600", style: "normal" }
);

const CLASH_DISPLAY_BOLD = new FontFace(
  "Clash Display",
  `url(/usr/local/share/fonts/clash-display/ClashDisplay-Bold.otf)`,
  { weight: "700", style: "normal" }
);

// Load fonts
Promise.all([
  CLASH_DISPLAY_REGULAR.load(),
  CLASH_DISPLAY_MEDIUM.load(),
  CLASH_DISPLAY_SEMIBOLD.load(),
  CLASH_DISPLAY_BOLD.load(),
])
  .then((fonts) => {
    fonts.forEach((font) => {
      document.fonts.add(font);
    });
    console.log("✅ Clash Display fonts loaded");
  })
  .catch((error) => {
    console.error("❌ Failed to load Clash Display fonts:", error);
  });

export const CLASH_DISPLAY = "'Clash Display', -apple-system, sans-serif";
