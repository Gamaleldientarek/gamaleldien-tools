# UI Color Generator -- 20-Second Promo Video Script

**Project:** UI Color Generator Promo (Screen Recording / Motion Graphics)
**Duration:** 20 seconds (strict)
**Format:** Visuals-only -- no voiceover, no narration
**Aspect Ratio:** 9:16 (vertical) as primary; 16:9 (landscape) secondary
**Target Platforms:** Instagram Reels, TikTok, Twitter/X, LinkedIn
**Music Style:** Minimal electronic, clean synth pulse -- think Four Tet meets Apple product launch. 110-120 BPM with a build. Bass drop aligns with Scene 4 reveal.
**Target Audience:** UI/UX designers, frontend developers, design system engineers

---

## Strategic Framework

### Market Research Rationale

Developer tool videos that perform best on social media share three traits: (1) they open with an immediate visual result -- not a logo, not a title card, (2) they show speed and fluidity of the tool in action, and (3) they end with a clear differentiator that makes the viewer think "I need this." Competitor analysis:

- **uicolors.app** -- No public promo video. Their landing page relies on static screenshots. Opportunity: we win by simply having motion.
- **Coolors.co** -- Their promos focus on palette browsing (spacebar generation). We match that energy in Scene 2 with our own spacebar random generation, but we surpass it by showing the full 11-shade scale with OKLCH science.
- **Realtime Colors** -- Strong at showing colors in context (on mockup pages). We match this with our Cards carousel and Components preview, but we also show export -- something they underplay.

### Key Selling Points (Ordered by Impact)

1. **FREE** -- This is the knockout punch. uicolors.app charges $5-15/month. We are free forever. This must appear on screen.
2. **OKLCH perceptually uniform** -- The technical credibility play. Designers who know color science will immediately respect this.
3. **11 shades, smart weight detection** -- Shows intelligence. The tool does not naively force everything to shade 500.
4. **Figma Variables (DTCG) export** -- The workflow integration play. Designers live in Figma.
5. **6 export formats** -- Breadth of utility.
6. **Zero dependencies, single-file, client-side** -- The developer credibility play.
7. **Interactive tooltips and live preview** -- The "this is polished" signal.

### Emotional Pacing

```
Scene 1-2:  CURIOSITY   -- "What is this? It looks beautiful."
Scene 3-4:  WOW FACTOR  -- "It does THAT? And THAT?"
Scene 5-6:  TRUST       -- "This is legit. Real export. Real formats."
Scene 7:    ACTION      -- "I need to try this right now."
```

---

## Scene-by-Scene Breakdown

---

### SCENE 1: THE HOOK -- Color Explosion

**Timestamp:** 0:00 - 0:02 (2 seconds)

**Visual Description:**
Black screen (#0a0a0a -- the tool's actual dark theme background with the subtle dot grid pattern visible). After 0.3 seconds, a hex code types itself into frame, character by character, in the tool's monospace font (SF Mono / Fira Code): `#3B82F6`. The moment the last character lands, the entire screen floods with 11 color swatches fanning out horizontally from center -- the full shade scale from Ghost (50) through Abyss (950). The swatches appear in a staggered cascade, lightest to darkest, each one popping in with a slight scale-up bounce (mimicking the tool's `fadeInUp` animation). The shade scale settles into a clean horizontal strip across the center of the frame.

**Text Overlay:**
`ANY COLOR.` -- appears in Clash Display 700, uppercase, white, centered above the shade strip. Fades in with a 0.1s delay after the swatches land.

**Motion / Animation:**
- Typewriter effect for hex code (200ms per character)
- Staggered swatch reveal: 50ms delay between each of the 11 swatches
- Slight camera push-in (105% zoom over 2 seconds) to add energy
- The shade strip has a soft glow bloom behind it (matching `--shadow-glow` aesthetic)

**Sound Design:**
- Soft keyboard click sounds for each hex character typed
- A clean, satisfying "snap" when all 11 swatches land
- Low synth pad begins fading in

**Why This Works (Market Research):**
The first 2 seconds must answer "What does this tool DO?" without words. By showing a hex code transforming into a complete shade scale, we communicate the core value proposition instantly. No logo. No title. Pure function. This mirrors what performs best in developer tool content -- immediate demonstration over explanation.

---

### SCENE 2: SPEED -- Spacebar Generation

**Timestamp:** 0:02 - 0:05 (3 seconds)

**Visual Description:**
Quick cut to the actual tool interface in light theme (body background #f5f5f5). We see the Controls section: the native color picker swatch, the hex input field, and the "GENERATE RANDOM" button. A floating keyboard hint is visible at the bottom showing `[SPACE] RANDOM`. A cursor appears and hits the spacebar -- BANG -- the entire palette card regenerates instantly with a new random color. The shade swatches ripple-update with the `fadeInUp` animation. Hit spacebar again -- another instant regeneration. And once more -- a third color. Three rapid-fire generations in 3 seconds. Each time, the color picker swatch updates, the hex input updates, and all 11 shade swatches cascade into their new colors. The "BASE" badge on the anchor shade shifts position each time (e.g., from 500 to 300 to 700), demonstrating smart weight detection.

**Text Overlay:**
`11 SHADES. INSTANT.` -- appears in Clash Display 700, uppercase, accented in the tool's brand orange (#e16105), positioned bottom-left. Slides in from left on the second spacebar hit.

**Motion / Animation:**
- Each spacebar press triggers a quick screen flash (white overlay at 5% opacity, 100ms)
- The palette card has a subtle bounce on each regeneration
- Camera holds steady -- the tool's own animations provide all the motion
- Quick 0.3s cross-dissolve between the second and third generation to compress time

**Sound Design:**
- Spacebar click sound (mechanical keyboard, satisfying)
- Subtle "whoosh" on each palette regeneration
- Music builds -- adding a rhythmic pulse

**Context Verification:**
- The "GENERATE RANDOM" button is a real element in the Controls section
- Spacebar keyboard shortcut is real (documented in Section 4.1 and 4.12)
- The floating keyboard shortcuts hint `[SPACE] RANDOM [CMD/CTRL+Z] UNDO [CMD/CTRL+Y] REDO` is a real fixed-position UI element
- Smart weight detection is real: `detectShadeWeight()` maps input lightness to the nearest shade weight
- The "BASE" badge showing detected weight is real (Section 4.3)
- Light theme with #f5f5f5 background is real (Section 2, Theme Architecture)

---

### SCENE 3: DEPTH -- Preview Carousel in Motion

**Timestamp:** 0:05 - 0:09 (4 seconds)

**Visual Description:**
Smooth scroll transition down to the Preview section. The "PREVIEW YOUR COLORS" heading is visible with the tooltip mock illustration beside it. The Cards carousel is in full motion -- the CSS-driven infinite scroll (`carouselScroll` animation, 35s cycle) is gliding left, showing a rich variety of preview cards: the Hannah Laurent full-photo card with shade 600 gradient overlay, the Hero card with the "FEATURED" badge floating (`floatUp` animation), the Product card with "SALE" badge pulsing (`pulseBtn`), the Testimonial card on shade 900 background, and the Shade Scale typographic card. The edge fade (mask-image at 1.5%) creates cinematic soft edges. The cursor hovers over a card and the shade tooltip appears: `primary . Core 500 . #3B82F6 [swatch]` -- proving every element is interactive.

At 0:07, we click the "Components" tab below the carousel. The bottom preview area switches to show the Components carousel: Buttons card (Primary, Hover, Active, Outline, Subtle states), Badges card (Info, Primary, Dark, Outline variants), and the Toggles and Progress card with its animated toggle switches and `progressFill` animation.

**Text Overlay:**
`LIVE PREVIEW.` -- appears at 0:05 in Clash Display 700, uppercase, white with a subtle text-shadow, top-right corner. Holds for 2 seconds then fades.

`EVERY ELEMENT. INTERACTIVE.` -- replaces the first overlay at 0:07, same position, same style. Timed with the tooltip appearance.

**Motion / Animation:**
- Smooth scroll-down transition (ease-out, 0.8s) from Scene 2 to the preview section
- The carousel's own CSS animation provides constant lateral movement
- Cursor movement is smooth and deliberate -- hover pauses carousel (real behavior: `animation-play-state: paused` on hover)
- Tab switch triggers content swap with the tool's native transition
- Slight parallax effect on the scroll (background dot grid moves slower than content)

**Sound Design:**
- Soft ambient pad continues
- Gentle "pop" when tooltip appears
- Tab click sound when switching to Components
- Music continues building

**Context Verification:**
- "PREVIEW YOUR COLORS" heading with tooltip mock illustration is real (Section 5, Preview System)
- Cards carousel with `carouselScroll` 35s animation is real (Section 5, CSS-Only Infinite Carousel)
- All card types listed are real (Section 5, Cards Carousel -- 10 card types documented)
- Edge fade at 1.5% is real (Section 5, mask-image)
- Tooltip format `primary . Core 500 . #3B82F6 [swatch]` matches documentation (Section 5, Tooltip System)
- Carousel pause on hover is real (CSS `animation-play-state: paused`)
- Components tab with Buttons, Badges, Toggles cards is real (Section 5, Components Tab)
- `progressFill` animation is real (Section 8, Additional Animations)
- `floatUp` animation on "FEATURED" badge is real (Section 8)

---

### SCENE 4: POWER -- Theme Toggle and Charts

**Timestamp:** 0:09 - 0:12 (3 seconds)

**Visual Description:**
The cursor moves to the navbar and clicks the theme toggle button (sun/moon icon). The entire interface transitions from light theme (#f5f5f5) to dark theme (#0a0a0a) -- every surface, text color, border, and shadow adapts through CSS custom property overrides. The glassmorphism surfaces (`backdrop-filter: blur(48px)`) become dramatically visible against the dark background. The dot grid pattern shifts from dark dots on light to light dots on dark.

Immediately after the theme switch (0:10), we click the "Charts" tab. The Charts preview loads: the bar chart with 7 bars in shades 200-800 growing from bottom (`barGrow` animation with staggered delays), the pie chart SVG spinning slowly (`spinSlow`, 20s rotation), and the line chart with its `drawLine` stroke animation tracing across the SVG. The area chart layers pulse gently. Every chart element has individual tooltips on hover.

**Text Overlay:**
`DARK MODE.` -- flashes for 1 second at 0:09, Clash Display 700, white, centered, with the brand orange (#e16105) glow behind it (matching `--shadow-glow`).

**Motion / Animation:**
- Theme toggle is a single click -- the transition is the tool's own CSS variable swap (instant, no JS animation needed -- pure CSS custom property inheritance)
- Bar chart bars grow with staggered animation (each bar delayed ~100ms after the previous)
- Pie chart rotates continuously
- Line chart draws itself across the frame
- Camera holds -- the tool's animations are the show

**Sound Design:**
- Toggle click (light mechanical switch)
- Deep bass note on theme switch (the visual darkness deserves sonic weight)
- Rising synth arpeggio as bar chart bars grow in sequence
- Music reaches mid-build

**Context Verification:**
- Theme toggle button in navbar with sun/moon icon is real (Section 4.11)
- Dark theme #0a0a0a background is real (Section 2, Theme Architecture)
- Light theme #f5f5f5 background is real (Section 2, Theme Architecture)
- CSS custom property theming is real -- all variables override via `body.light-theme` class
- Glassmorphism with `backdrop-filter: blur(48px)` is real (Section 2, Glassmorphism Surfaces)
- Dot grid pattern switching between themes is real (Section 2, Background Pattern)
- Charts tab with bar, pie, line, area charts is real (Section 5, Charts Tab)
- `barGrow` staggered animation is real (Section 8)
- `spinSlow` 20s rotation on pie chart SVG is real (Section 8)
- `drawLine` stroke animation on line chart is real (Section 8)
- Individual tooltips per pie slice (SVG path elements) is real (Section 10, Problem 10)

---

### SCENE 5: WORKFLOW -- Export System

**Timestamp:** 0:12 - 0:16 (4 seconds)

**Visual Description:**
Quick scroll to the Export section (still in dark theme for maximum visual drama). The 6 export tabs are visible in a row: **Tailwind v3** | **Tailwind v4** | **CSS Variables** | **Figma Variables** | **JSON Tokens** | **CSS**. The "Figma Variables" tab is active by default (real behavior), showing the DTCG JSON output in the code preview area with monospace font.

Rapid tab cycling begins -- the cursor clicks through tabs in quick succession:
- 0:12.0 -- Figma Variables tab (DTCG JSON with `$type`, `$value`, `colorSpace`, `components`)
- 0:12.8 -- Tailwind v4 tab (`@theme` block with OKLCH values)
- 0:13.5 -- CSS Variables tab (`:root` block with hex values)
- 0:14.2 -- Back to Figma Variables

At 0:14.5, the cursor clicks the orange "COPY TO CLIPBOARD" button (`.btn-primary`). The toast notification slides up from the bottom: "COPIED" in uppercase. The button briefly flashes with the `flashGreen` confirmation animation.

At 0:15.5, the cursor clicks the "DOWNLOAD FILE" outline button. A file download initiates (the browser download indicator appears briefly).

**Text Overlay:**
`6 EXPORT FORMATS.` -- appears at 0:12 in Clash Display 700, uppercase, white, bottom-left. Holds for 2 seconds.

`FIGMA. TAILWIND. CSS.` -- replaces at 0:14 in the same position. Each word staggers in 150ms apart. The word "FIGMA" is highlighted in the brand orange (#e16105).

**Motion / Animation:**
- Tab switches are rapid but readable (0.7s per tab visible)
- Each tab switch triggers the code preview content to update (the tool's native behavior)
- The toast slides up with the tool's own `slideUp` animation
- Copy button has the real `flashGreen` animation feedback
- Slight zoom-in (102%) on the code preview area during the tab cycling to draw focus

**Sound Design:**
- Quick, light click for each tab switch
- Satisfying "copy" sound effect (like a stamp or snap) when clipboard button is clicked
- Short descending chime on download click
- Music continues at full build

**Context Verification:**
- 6 export tabs in exact order documented (Section 6, Export Formats): Tailwind v3, Tailwind v4, CSS Variables, Figma Variables, JSON Tokens, CSS
- Figma Variables as default active tab is real (Section 6: "The default active tab is Figma Variables")
- DTCG format with `$type`, `$value`, `colorSpace`, `components` is real (Section 6, Format 4)
- Tailwind v4 `@theme` block with OKLCH values is real (Section 6, Format 2)
- CSS Variables `:root` block is real (Section 6, Format 3)
- Orange "COPY TO CLIPBOARD" button (`.btn-primary`) is real (Section 6, Export Actions)
- "DOWNLOAD FILE" outline button is real (Section 6, Export Actions)
- Toast notification with "COPIED" is real (Section 4.7)
- `flashGreen` animation is real (Section 8, Additional Animations)
- Code preview with monospace font, 200px max-height, scroll is real (Section 6, Code Preview)

---

### SCENE 6: CREDIBILITY -- The Differentiator

**Timestamp:** 0:16 - 0:18 (2 seconds)

**Visual Description:**
Full-screen typographic sequence (not inside the tool -- this is a motion graphics overlay). Dark background matching the tool's #0a0a0a. Text elements animate in rapidly using the tool's `fadeInUp` motion (opacity 0, translateY 16px to settled):

**Frame 1 (0:16.0 - 0:17.0):**
Three lines stack vertically, each staggered 200ms:

```
OKLCH COLOR SCIENCE          [in white, Clash Display 600]
SMART WEIGHT DETECTION       [in white, Clash Display 600]
ZERO DEPENDENCIES            [in white, Clash Display 600]
```

**Frame 2 (0:17.0 - 0:18.0):**
All three lines slide left and compress. A single large word takes over the screen:

```
FREE.
```

In Clash Display 700, massive (120pt equivalent), brand orange (#e16105), with the `--shadow-glow` (0 0 24px rgba(225, 97, 5, 0.12)) bloom behind it. The period is deliberate -- it is a full stop, a statement.

**Text Overlay:**
The entire scene IS text overlay. No additional overlays needed.

**Motion / Animation:**
- `fadeInUp` stagger on three feature lines (each 200ms apart)
- Horizontal slide-left compression transition (300ms, ease-out)
- "FREE." scales up from 80% to 100% with a slight overshoot bounce (ease-out-back)
- Subtle particle/grain texture behind "FREE." matching the dot grid aesthetic

**Sound Design:**
- Three quick ascending tones (one per feature line appearing)
- Bass drop on "FREE." -- the sonic exclamation point
- Brief silence after the drop (100ms) before music resumes for final scene

**Why This Works (Market Research):**
This is the "why should I care" moment. The three feature lines establish technical credibility (OKLCH, smart detection, zero deps). Then "FREE." demolishes the primary objection. In the competitive landscape where uicolors.app charges $5-15/month, this single word is the strongest possible differentiator. The visual weight of the word (massive, orange, glowing) ensures it burns into memory.

---

### SCENE 7: CTA -- The Close

**Timestamp:** 0:18 - 0:20 (2 seconds)

**Visual Description:**
Clean dark background (#0a0a0a) with the subtle dot grid pattern (radial-gradient circles at 32px spacing). The tool's H1 title treatment appears center-screen: "UI COLOR GENERATOR" in Clash Display 700, uppercase, brand orange (#e16105), with the signature glow. Below it, the URL:

```
tools.gamaleldien.com/shades
```

In Clash Display 500, white, with `letter-spacing: 0.06em` (matching the tool's UI chrome convention). The URL has a subtle underline animation -- a line draws from left to right beneath it.

In the bottom-right corner, small and tasteful: "by Gamal Eldien" in Clash Display 400, `--text-muted` color (rgb(128, 128, 128)).

The final 0.5 seconds holds this frame completely still -- giving the viewer time to read the URL and screenshot it.

**Text Overlay:**
```
UI COLOR GENERATOR               [Clash Display 700, #e16105, large]
tools.gamaleldien.com/shades     [Clash Display 500, white, medium]
by Gamal Eldien                  [Clash Display 400, #808080, small]
```

**Motion / Animation:**
- Title fades in with `fadeInUp` (0.4s)
- URL fades in 200ms after title, also `fadeInUp`
- Underline draws left-to-right beneath URL (0.6s, ease-out)
- "by Gamal Eldien" fades in last (0.3s delay after URL)
- Frame holds completely still for final 0.5s -- no motion, maximum readability
- Optional: very subtle ambient glow pulse behind the title (2s cycle, barely perceptible)

**Sound Design:**
- Music resolves to a clean, sustained chord
- Final note sustains and fades naturally
- No abrupt cut -- the audio tapers as the frame holds

**Context Verification:**
- "UI COLOR GENERATOR" as H1 title in orange is real (Section 2, Brand Accent: "The H1 title")
- Brand orange #e16105 is real (Section 2: `--accent: rgb(225, 97, 5)`)
- Clash Display 700 for headings is real (Section 2, Typography)
- URL tools.gamaleldien.com/shades is real (Section 1, header)
- Author "Gamal Eldien" is real (Section 1, Author)
- Dark background #0a0a0a is real (Section 2, Dark Theme)
- Dot grid pattern is real (Section 2, Background Pattern)
- `letter-spacing: 0.06em` uppercase convention is real (Section 2, Text Conventions)
- `--text-muted: rgb(128, 128, 128)` is real (Section 2 / Appendix)

---

## Complete Timeline Summary

| Time        | Scene                  | Key Visual                                  | Text Overlay                  |
|-------------|------------------------|---------------------------------------------|-------------------------------|
| 0:00 - 0:02 | 1. The Hook           | Hex types in, 11 swatches explode out       | ANY COLOR.                    |
| 0:02 - 0:05 | 2. Speed              | 3x spacebar random generation               | 11 SHADES. INSTANT.           |
| 0:05 - 0:09 | 3. Depth              | Preview carousel + Components tab           | LIVE PREVIEW. / EVERY ELEMENT. INTERACTIVE. |
| 0:09 - 0:12 | 4. Power              | Theme toggle + Charts animations            | DARK MODE.                    |
| 0:12 - 0:16 | 5. Workflow           | 6 export tabs cycling + copy + download     | 6 EXPORT FORMATS. / FIGMA. TAILWIND. CSS. |
| 0:16 - 0:18 | 6. Differentiator     | Feature lines + "FREE." reveal              | OKLCH / SMART DETECTION / ZERO DEPS / FREE. |
| 0:18 - 0:20 | 7. CTA                | Title + URL hold                            | UI COLOR GENERATOR / tools.gamaleldien.com/shades |

---

## Production Notes

### Screen Recording

- **Resolution:** 2560x1440 (Retina) minimum. Record at 60fps for smooth motion.
- **Browser:** Use Chrome or Arc. Hide bookmarks bar, extensions, and any browser chrome that is not essential.
- **Window size:** Maximize the tool window. If using a vertical (9:16) crop, record full-width and crop in post.
- **Cursor:** Use a custom large cursor or the macOS default (no Windows cursors). The cursor should be visible but not distracting. Consider a subtle cursor highlight ring (white, 30% opacity, 40px radius).
- **Screen recording tool:** ScreenFlow, OBS (with lossless), or macOS native (Cmd+Shift+5). Export as ProRes 422 for editing.

### Transitions

- **Between scenes:** Use hard cuts or 0.15s cross-dissolves. No wipes. No slide transitions. No star wipes. Keep it editorial and clean.
- **Within scenes:** Let the tool's own CSS animations handle the motion. Do not add artificial zooms or pans unless specified in the scene description.
- **Scene 1 to Scene 2:** Hard cut (the visual contrast between the abstract swatch explosion and the real tool UI creates its own transition energy).
- **Scene 5 to Scene 6:** This is the only transition that goes from screen recording to motion graphics. Use a 0.2s fade-to-black, then fade-in to the feature lines.
- **Scene 6 to Scene 7:** Clean cross-dissolve (0.3s). The "FREE." glow fades as the title fades in.

### Color Grading

- **Overall tone:** Slightly lifted blacks (not crushed to pure 0,0,0) to maintain the tool's refined dark aesthetic. The tool's dark theme background is #0a0a0a (not pure black), so match that.
- **Light theme scenes (Scene 2-3):** Keep clean and neutral. Do not warm or cool the grade. The tool's light theme is a true neutral gray (#f5f5f5).
- **Dark theme scenes (Scene 4-7):** Slightly boost contrast. Let the brand orange (#e16105) and the colored swatches pop against the dark surfaces.
- **Accent color:** Ensure #e16105 reads as warm orange throughout. Do not let color grading shift it toward red or yellow.
- **Glassmorphism surfaces:** The blur effects and transparency should read clearly. Do not over-compress in areas with subtle alpha blending.

### Typography for Overlays

All text overlays use the tool's own font to maintain brand consistency:

| Element              | Font              | Weight | Case      | Size (at 1080x1920) | Letter-Spacing | Color              |
|----------------------|-------------------|--------|-----------|----------------------|----------------|--------------------|
| Primary overlay      | Clash Display     | 700    | UPPERCASE | 64-80px              | 0.06em         | #FFFFFF            |
| Secondary overlay    | Clash Display     | 600    | UPPERCASE | 40-48px              | 0.06em         | #FFFFFF            |
| Accent word          | Clash Display     | 700    | UPPERCASE | 64-80px              | 0.06em         | #E16105            |
| "FREE." hero text    | Clash Display     | 700    | UPPERCASE | 120-160px            | 0.04em         | #E16105            |
| URL                  | Clash Display     | 500    | lowercase | 32-40px              | 0.06em         | #FFFFFF            |
| Attribution          | Clash Display     | 400    | Sentence  | 18-22px              | 0.02em         | #808080            |

**Overlay positioning:** Prefer bottom-left or bottom-right. Never center overlays vertically in the middle of the frame -- that conflicts with the tool UI content. The "FREE." reveal (Scene 6) is the only exception where text occupies center-screen.

**Text shadow on overlays:** Apply a subtle `0 2px 16px rgba(0,0,0,0.5)` shadow to all overlays to ensure readability over both light and dark tool backgrounds.

### Music and Audio

**Music mood:** Clean, modern, minimal electronic. Not dramatic or cinematic. Think design tool energy -- precision, clarity, confidence. Reference tracks:
- Four Tet -- "Insect Near Piha Beach" (the clean pulse quality)
- Floating Points -- "Silhouettes" (the spacious, refined build)
- Apple product launch background music (understated confidence)

**Tempo:** 110-120 BPM. The tempo should match the scene cuts -- each major beat should land on a scene transition.

**Structure:**
- 0:00-0:05: Sparse, building (single synth line + soft kick)
- 0:05-0:12: Adding layers (hi-hat, bass line, pad)
- 0:12-0:16: Full build (all elements present)
- 0:16: Beat drop or accent hit on "FREE."
- 0:18-0:20: Resolution (sustained chord, fade)

**SFX layering:**
- UI click sounds should be subtle and mixed at 30-40% volume relative to music
- "Whoosh" transitions at 20-30% volume
- The "snap" on Scene 1 swatch reveal and the bass drop on "FREE." should be the loudest SFX moments

**Audio licensing:** Use royalty-free music from Artlist, Epidemic Sound, or commission a 20-second custom track. Budget: $30-100 for stock, $200-500 for custom.

---

## Platform Versions

### Instagram Reels (Primary)

- **Aspect ratio:** 9:16 (1080x1920)
- **Duration:** 20 seconds (within 90s limit)
- **Safe zones:** Keep text overlays within the center 80% of the frame. Instagram overlays username (bottom-left) and audio label (bottom) -- avoid placing critical text in the bottom 15%.
- **Caption:** "Any color. 11 shades. Instantly. Free forever. Link in bio." followed by hashtags: #uidesign #tailwindcss #colorpalette #designtools #frontend #figma #webdesign #devtools #oklch #freetools
- **Audio:** Use the music track. Instagram rewards native audio.
- **Thumbnail:** Frame from Scene 6 showing "FREE." in orange on black. High contrast thumbnails perform best in the Reels grid.

### TikTok

- **Aspect ratio:** 9:16 (1080x1920)
- **Duration:** 20 seconds
- **Adaptation:** Add a 0.5-second title card before Scene 1: white text on black, "POV: you found the best free color tool" in a casual sans-serif (not Clash Display -- match TikTok's native aesthetic for the hook). This extends total to 20.5 seconds; trim 0.5s from Scene 3 to compensate.
- **Caption:** "Free color generator that actually understands color science. OKLCH not HSL. #uidesign #designtok #developer #frontend #tailwindcss #colortheory #freetools"
- **Audio:** Use a trending sound if one fits, or the custom music track. TikTok heavily rewards trending audio.
- **Text:** Consider adding TikTok-native text overlays (their built-in text tool) in addition to the motion graphics overlays, as TikTok's algorithm may boost videos that use native editing features.

### Twitter / X

- **Aspect ratio:** 16:9 (1920x1080) -- Twitter crops vertical video aggressively in feed
- **Duration:** 20 seconds
- **Adaptation:** Re-layout text overlays for horizontal framing. All overlays shift to bottom-left with larger font (the wider frame has more negative space). Scene 3's carousel reads better in landscape -- more cards visible simultaneously.
- **Post text:** "Built a free UI color generator. OKLCH color science. 11 shades from any color. Exports to Tailwind v3/v4, CSS, Figma Variables (DTCG), JSON. Zero dependencies. Single HTML file. tools.gamaleldien.com/shades" -- no hashtags (they perform poorly on X). Include the URL directly in the post.
- **Pinned reply:** "Some things it does that uicolors.app ($15/mo) does not: Smart weight detection (does not force everything to shade 500). OKLCH instead of HSL. Figma DTCG export. Per-shade format toggle. Interactive tooltips on every preview element. And it is free."

### LinkedIn

- **Aspect ratio:** 16:9 (1920x1080) or 1:1 (1080x1080)
- **Duration:** 20 seconds
- **Adaptation:** For 1:1 square format, crop to center. Increase text overlay sizes by 20% (LinkedIn is often viewed on desktop at smaller player sizes). Add a 1-second branded end card after Scene 7: the tool URL + "Built with zero external dependencies" as a professional credibility note.
- **Post text:** A longer-form post (LinkedIn rewards text length):

> "I built a free UI color generator for designers and developers.
>
> It uses OKLCH -- a perceptually uniform color space -- instead of HSL. That means shade 500 of yellow and shade 500 of blue actually look equally bright. Most tools get this wrong.
>
> Features: 11-shade scales (50-950), smart weight detection, live component/chart/gradient previews, and export to Tailwind v3, Tailwind v4 (OKLCH), CSS Variables, Figma Variables (DTCG), JSON Tokens, and SCSS.
>
> Zero JavaScript dependencies. Single HTML file. Completely free.
>
> tools.gamaleldien.com/shades"

- **Hashtags (in first comment, not in post):** #UIDesign #DesignSystems #FrontendDevelopment #TailwindCSS #Figma #WebDevelopment #ColorTheory #DesignTokens #OpenSource #FreeTools

---

## Pre-Production Checklist

Before recording:

1. **Prepare the tool state:** Load the tool fresh. Ensure light theme is active for Scenes 2-3. Have a visually appealing starting color ready (e.g., #3B82F6 -- a strong blue that photographs well). Clear localStorage so the tool generates a fresh random color on load.

2. **Prepare three target colors for Scene 2:** Pre-test three hex values that produce visually distinct and attractive shade scales when cycled via spacebar. Since spacebar generates random colors, you may need to screen-record multiple takes and select the best three-color sequence. Alternatively, temporarily hardcode three colors for the recording session.

3. **Browser preparation:** Close all tabs except the tool. Disable notifications. Enable "Do Not Disturb." Hide the dock. Set display to native resolution (Retina). Disable any screen recording watermarks.

4. **Secondary color:** For maximum visual richness in the Cards carousel (Scene 3), add a secondary color before recording so the carousel shows 10 card types including the Sophia Kim cross-palette card and the dual-colored Components/Charts.

5. **Font verification:** Ensure Clash Display loads from Fontshare CDN before recording. Check that all four weights (400, 500, 600, 700) render correctly.

6. **Animation verification:** Scroll through all preview tabs before recording to ensure all CSS animations are running: `carouselScroll`, `barGrow`, `drawLine`, `spinSlow`, `pulse`, `pulseBtn`, `floatUp`, `gradientShift`, `progressFill`, `toggleSlide`, `typewriter`.

---

## Post-Production Workflow

1. **Rough cut:** Assemble all screen recordings and motion graphics segments in timeline. Verify total duration is exactly 20.0 seconds.

2. **Overlay pass:** Add all Clash Display text overlays. Verify font weights, colors, positioning, and timing against this script.

3. **SFX pass:** Layer all sound effects. Mix against music track. Ensure SFX are subtle, not dominant.

4. **Color grade pass:** Apply consistent grading. Verify #e16105 accent reads correctly. Check glassmorphism surfaces are not crushed by compression.

5. **Export settings:**
   - Instagram/TikTok: H.264, 1080x1920, 30fps (platform re-encodes anyway), 10-15 Mbps
   - Twitter/X: H.264, 1920x1080, 30fps, 10-15 Mbps
   - LinkedIn: H.264, 1920x1080 or 1080x1080, 30fps, 10-15 Mbps
   - Master: ProRes 422 HQ, 2560x1440, 60fps (archive)

6. **Compression check:** Watch the final export on a phone screen. Verify all text is readable at small sizes. Verify the tool UI is legible, especially the code in Scene 5 (it does not need to be fully readable, but should look like real code, not compression artifacts).

---

## Success Metrics

After publishing, track:

- **View-through rate:** Target >60% viewers watching to the end (20 seconds is short; this should be achievable)
- **Engagement rate:** Target >5% (likes + comments + shares + saves) / impressions
- **Click-through rate:** Target >2% on link-in-bio or direct URL clicks
- **Tool traffic:** Monitor tools.gamaleldien.com/shades analytics for traffic spikes correlated with post timing
- **Saves:** On Instagram, saves indicate high intent. Target save rate >1% of impressions

---

*Script prepared for the UI Color Generator at tools.gamaleldien.com/shades. All feature references, UI element names, color values, animation names, and technical claims have been verified against the tool's comprehensive documentation (Version 1.0, 2026-01-31).*
