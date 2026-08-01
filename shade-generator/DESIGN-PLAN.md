# Shade Generator Tool — Complete Design Plan
## tools.gamaleldien.com/shades

**Designer:** JO-Creative 🎨  
**Created:** 2025-01-31  
**Status:** Design Documentation (Planning Phase)  
**Reference:** [uicolors.app/generate](https://uicolors.app/generate)

> **⚠️ IMPORTANT:** This is PLANNING documentation. NO BUILDING in this phase. This document will be handed to the developer for implementation.

---

## 1. Page Layout & Structure

### 1.1 Full Page Wireframe (Top to Bottom)

```
┌──────────────────────────────────────────────────────────────┐
│                         NAVBAR                                │
│  [Logo]                                    [Tools] [About]    │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                      HERO / HEADER                            │
│                                                               │
│              TAILWIND CSS SHADE GENERATOR                     │
│    Create perfect 11-shade color scales for your designs     │
│                                                               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                   COLOR INPUT CONTROLS                        │
│                                                               │
│  [Color Picker] [Hex Input] [Generate Random] [Add 2nd Color]│
│                                                               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    PRIMARY SHADE SCALE                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ PRIMARY                                    [Lock Scale] │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ [50] [100] [200] [300] [400] [500] [600] [700]...      │  │
│  │  #    #     #     #     #     #     #     #            │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│              SECONDARY SHADE SCALE (Optional)                 │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ SECONDARY                           [× Remove] [Lock]  │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ [50] [100] [200] [300] [400] [500] [600] [700]...      │  │
│  │  #    #     #     #     #     #     #     #            │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘

                    // PREVIEW TABS //

┌──────────────────────────────────────────────────────────────┐
│                       PREVIEW SECTION                         │
│                                                               │
│  [Cards] [Components] [Charts] [Gradients] [Logos] [Headings]│
│  ────────────────────────────────────────────────────────    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                                                         │  │
│  │           TAB CONTENT (dynamic preview)                 │  │
│  │                                                         │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘

                    // EXPORT CODE //

┌──────────────────────────────────────────────────────────────┐
│                      EXPORT SECTION                           │
│                                                               │
│  [Figma Variables*] [CSS] [Tailwind v3] [Tailwind v4]       │
│  [OKLCH] [JSON]                                              │
│  ────────────────────────────────────────────────────────    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ // Code Output                         [Copy] [Download]│  │
│  │                                                         │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                          FOOTER                               │
│     ©2025 // MADE BY GAMAL ELDIEN // TOOLS.GAMALELDIEN.COM   │
└──────────────────────────────────────────────────────────────┘
```

### 1.2 Navbar (Reuse Pattern)

**Component:** Existing navbar from design system

**Structure:**
```html
<nav class="navbar">
  <a href="/" class="logo">
    <!-- SVG Logo (Gamal Eldien mark) -->
  </a>
  <div class="navbar-links">
    <a href="/tools" class="navbar-link">TOOLS</a>
    <a href="https://gamaleldien.com" class="navbar-link">ABOUT</a>
  </div>
</nav>
```

**Styling:**
- Position: `sticky`, top: 0
- Background: `rgba(10, 10, 10, 0.85)` + `backdrop-filter: blur(48px)`
- Border-bottom: `1px solid var(--border)`
- Logo height: `40px` (auto width)
- Links: 11px, uppercase, letter-spacing 0.1em, white → orange on hover

**Behavior:**
- Sticky on scroll
- Logo hover: brightness(1.2) + translateY(-2px)
- Links hover: color changes to `var(--accent)`

### 1.3 Hero/Header Section

**Layout:**
```html
<header>
  <h1>TAILWIND CSS SHADE GENERATOR</h1>
  <p>Create perfect 11-shade color scales (50-950) for Tailwind CSS, Figma Variables, and modern design systems. Export to multiple formats.</p>
</header>
```

**Styling:**
- Margin-top: `clamp(32px, 6vw, 64px)` (space from navbar)
- Margin-bottom: `clamp(48px, 8vw, 80px)` (space before controls)
- Padding-bottom: `clamp(32px, 6vw, 56px)` (internal spacing)
- Border-bottom: `1px solid var(--border)` (divider)
- Text-align: `center`
- Animation: `fadeInUp 0.5s ease-out`

**Typography:**
- H1: `clamp(32px, 6vw, 56px)`, uppercase, bold, white, letter-spacing -0.03em
- P: `clamp(11px, 2vw, 14px)`, sentence case, medium weight, muted color
- P max-width: `680px`, margin auto (centered, narrower)

**Color Scheme:**
- Text: `var(--text)` (white)
- Subtext: `var(--text-muted)` (gray)
- Border: `var(--border)` (subtle divider)

### 1.4 Color Input Area

**Layout (Horizontal Controls):**
```html
<section class="controls">
  <div class="control-item">
    <label>COLOR</label>
    <input type="color" value="#3b82f6" id="primaryColorInput">
  </div>
  
  <div class="control-item">
    <label>HEX</label>
    <input type="text" value="#3b82f6" id="hexInput" placeholder="#000000">
  </div>
  
  <button class="btn btn-primary" id="randomBtn">
    GENERATE RANDOM
    <span class="btn-hint">SPACEBAR</span>
  </button>
  
  <button class="btn btn-outline" id="addSecondaryBtn">
    ADD SECONDARY COLOR
  </button>
</section>
```

**Visual Design:**

**Container:**
- Display: `flex`
- Gap: `12px`
- Align-items: `center`
- Flex-wrap: `wrap` (stack on mobile)
- Padding: `0` (no card background — open controls)
- Margin-bottom: `clamp(24px, 4vw, 40px)`
- Animation: `fadeInUp 0.6s ease-out`

**Control Item:**
- Display: `flex`
- Flex-direction: `column`
- Gap: `8px` (label to input)

**Label:**
- Font-size: `10px`
- Uppercase
- Letter-spacing: `0.08em`
- Color: `var(--text-muted)`
- Font-weight: `700`

**Color Picker (`input[type="color"]`):**
- Width: `56px`
- Height: `56px`
- Border: `2px solid var(--border-light)`
- Border-radius: `14px`
- Cursor: `pointer`
- Background: `rgba(20, 20, 20, 0.6)`
- Padding: `4px`
- Transition: `all 0.2s`
- Hover: border-color `var(--accent)`, scale(1.05)
- Swatch border-radius: `10px` (internal)

**Hex Input (`input[type="text"]`):**
- Width: `140px`
- Height: `56px`
- Font-size: `14px`
- Font-weight: `600`
- Text-transform: `uppercase`
- Letter-spacing: `0.04em`
- Padding: `0 16px`
- Border: `1.5px solid var(--border-light)`
- Border-radius: `14px`
- Background: `rgba(30, 30, 30, 0.8)`
- Color: `white`
- Font-family: `'SF Mono', monospace`
- Transition: `all 0.2s`
- Focus: border `var(--accent)`, box-shadow `0 0 0 3px var(--accent-glow)`

**Generate Random Button:**
- `.btn.btn-primary` styling (orange, pill-shaped)
- Contains hint text "SPACEBAR" in small lighter text
- Min-width: `180px`

**Add Secondary Button:**
- `.btn.btn-outline` styling (transparent with white border)
- Min-width: `200px`
- Hidden when secondary scale exists
- Show `.btn.btn-danger` "REMOVE SECONDARY" when secondary scale active

**Responsive (Mobile < 640px):**
- Stack controls vertically
- Full-width buttons
- Color picker + hex input side by side (50%/50%)
- Reduce gap to 8px

### 1.5 Shade Scale Display (Primary + Secondary)

**Card Structure:**
```html
<div class="palette-card shade-card">
  <!-- Header -->
  <div class="palette-header">
    <div class="header-left">
      <span class="palette-indicator"></span>
      <input type="text" class="scale-name-input" value="PRIMARY" placeholder="Color Name">
    </div>
    <div class="header-right">
      <button class="icon-btn lock-btn" title="Lock all shades">
        <span>🔒</span> <!-- Unlocked: 🔓 -->
      </button>
      <button class="btn-remove remove-scale-btn" title="Remove scale" style="display: none;">
        ×
      </button>
    </div>
  </div>
  
  <!-- Shade Items -->
  <div class="shade-list">
    <!-- Repeat for each shade: 50, 100, 200...950 -->
    <div class="shade-item" data-shade="500">
      <div class="shade-swatch-container">
        <div class="shade-swatch" style="background: #3b82f6;"></div>
        <input type="color" class="shade-color-picker" value="#3b82f6">
      </div>
      
      <div class="shade-info">
        <div class="shade-label">500</div>
        <div class="shade-value" data-format="hex">#3b82f6</div>
        <div class="shade-formats">
          <button class="format-toggle" data-format="hex">HEX</button>
          <button class="format-toggle" data-format="hsl">HSL</button>
          <button class="format-toggle" data-format="oklch">OKLCH</button>
          <button class="format-toggle" data-format="rgb">RGB</button>
        </div>
      </div>
      
      <div class="shade-actions">
        <button class="icon-btn copy-shade-btn" title="Copy value">
          📋
        </button>
        <button class="icon-btn lock-shade-btn" title="Lock shade">
          🔒
        </button>
      </div>
    </div>
    <!-- ...10 more shade items -->
  </div>
</div>
```

**Visual Design:**

**Palette Card:**
- Background: `var(--surface)` + `backdrop-filter: blur(48px)`
- Border: `1px solid var(--border-light)`
- Border-radius: `var(--radius-lg)` (32px)
- Box-shadow: `var(--shadow-lg)`
- Gradient border effect (`::before` pseudo-element)
- Margin-bottom: `clamp(24px, 4vw, 40px)`
- Animation: `fadeInUp 0.7s ease-out`

**Palette Header:**
- Display: `flex`
- Justify-content: `space-between`
- Align-items: `center`
- Padding: `clamp(20px, 4vw, 28px) clamp(24px, 4vw, 32px)`
- Border-bottom: `1px solid var(--border-light)`
- Background: `linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(20, 20, 20, 0.9))`

**Palette Indicator (Orange Dot):**
- Width: `12px`
- Height: `12px`
- Border-radius: `50%`
- Background: `var(--accent)` (#e16105)
- Box-shadow: `0 0 16px var(--accent-glow)`
- Animation: `pulse 3s ease-in-out infinite`

**Scale Name Input:**
- Font-size: `14px`
- Font-weight: `700`
- Text-transform: `uppercase`
- Letter-spacing: `0.1em`
- Color: `white`
- Background: `transparent`
- Border: `1px solid transparent`
- Padding: `8px 12px`
- Border-radius: `8px`
- Transition: `all 0.2s`
- Hover/Focus: border `var(--accent)`, background `rgba(225, 97, 5, 0.1)`
- Max-width: `200px`

**Lock Button (Header):**
- `.icon-btn` styling
- 18px font-size
- Color: `var(--text-muted)` → `var(--accent)` when locked
- Background: `rgba(225, 97, 5, 0.1)` when locked
- Toggles between 🔓 (unlocked) and 🔒 (locked)

**Remove Button (Secondary Scale Only):**
- `.btn-remove` styling
- Color: `var(--danger)`
- Only visible on secondary scale
- Hover: opacity 1, scale(1.15)

**Shade List:**
- Display: `grid`
- Grid-template-columns: `repeat(auto-fit, minmax(110px, 1fr))`
- Gap: `16px`
- Padding: `clamp(20px, 4vw, 32px)`

**Shade Item:**
- Display: `flex`
- Flex-direction: `column`
- Gap: `12px`
- Padding: `16px`
- Border: `1px solid var(--border-light)`
- Border-radius: `12px`
- Background: `rgba(30, 30, 30, 0.4)`
- Transition: `all 0.2s`
- Hover: background `var(--surface-elevated)`, transform `translateY(-2px)`

**Shade Swatch Container:**
- Position: `relative`
- Width: `100%`
- Aspect-ratio: `1 / 1` (square)

**Shade Swatch:**
- Width: `100%`
- Height: `100%`
- Border-radius: `10px`
- Box-shadow: `var(--shadow-sm)`
- Cursor: `pointer`
- Transition: `all 0.2s`
- Hover: scale(1.05)

**Shade Color Picker (Hidden Overlay):**
- Position: `absolute`
- Inset: `0`
- Opacity: `0`
- Cursor: `pointer`
- Width: `100%`
- Height: `100%`
- When clicked, opens native color picker
- On change, updates shade color (marks as "manual override")

**Shade Info:**
- Text-align: `center`
- Display: `flex`
- Flex-direction: `column`
- Gap: `6px`

**Shade Label (50, 100, 200...):**
- Font-size: `12px`
- Font-weight: `700`
- Text-transform: `uppercase`
- Letter-spacing: `0.06em`
- Color: `var(--text)`

**Shade Value (Hex/HSL/etc.):**
- Font-size: `11px`
- Font-weight: `600`
- Font-family: `'SF Mono', monospace`
- Letter-spacing: `0.02em`
- Color: `var(--text-secondary)`
- Cursor: `pointer`
- Transition: `color 0.2s`
- Hover: color `var(--accent)`
- Click: copies to clipboard, shows toast

**Shade Formats (Toggle Buttons):**
- Display: `flex`
- Gap: `4px`
- Justify-content: `center`
- Margin-top: `4px`

**Format Toggle Button:**
- Font-size: `8px`
- Padding: `4px 6px`
- Border: `1px solid var(--border-light)`
- Border-radius: `6px`
- Background: `transparent`
- Color: `var(--text-muted)`
- Cursor: `pointer`
- Text-transform: `uppercase`
- Letter-spacing: `0.04em`
- Transition: `all 0.2s`
- Active: background `var(--accent)`, border `var(--accent)`, color `white`

**Shade Actions:**
- Display: `flex`
- Gap: `8px`
- Justify-content: `center`

**Copy/Lock Buttons:**
- `.icon-btn` styling
- 16px font-size
- Tooltips on hover

**Locked Shade State:**
- Border-color: `var(--warning)` (yellow)
- Background: `rgba(245, 158, 11, 0.08)`
- Lock button color: `var(--warning)`

**Manual Override State (Edited Shade):**
- Border-color: `rgba(96, 165, 250, 0.3)` (blue)
- Small indicator badge: "EDITED" in blue

**Responsive (Mobile < 640px):**
- Grid → `repeat(auto-fit, minmax(90px, 1fr))` (smaller cells)
- Shade item padding: `12px`
- Format toggles: hide or show only active format

### 1.6 Secondary Color Section

**Behavior:**
- Initially hidden
- "ADD SECONDARY COLOR" button shows secondary color modal/inline form
- User picks secondary color + optional scheme (complementary, analogous, triadic, auto)
- Secondary scale generates below primary scale
- Same card structure as primary scale
- Header shows "SECONDARY" (editable name)
- Has "REMOVE" button (× icon) in header-right
- Can be locked independently

**Color Scheme Selector (when adding secondary):**
```html
<div class="secondary-modal">
  <h3>ADD SECONDARY COLOR SCALE</h3>
  
  <div class="control-item">
    <label>SECONDARY COLOR</label>
    <input type="color" id="secondaryColorInput" value="#10b981">
  </div>
  
  <div class="control-item">
    <label>COLOR SCHEME</label>
    <select id="schemeSelect">
      <option value="auto">Auto (smart detection)</option>
      <option value="complementary">Complementary</option>
      <option value="analogous">Analogous</option>
      <option value="triadic">Triadic</option>
      <option value="split-complementary">Split Complementary</option>
      <option value="tetradic">Tetradic</option>
    </select>
  </div>
  
  <div class="modal-actions">
    <button class="btn btn-primary">ADD SCALE</button>
    <button class="btn btn-outline">CANCEL</button>
  </div>
</div>
```

**Modal Styling:**
- `.modal` + `.modal-overlay` pattern from design system
- Max-width: `500px`
- Padding: `32px`
- Background: `var(--surface)` + blur
- Border-radius: `var(--radius-lg)`

**Scheme Auto-Selection:**
- When "Auto" selected, algorithm determines best relationship based on primary color
- If primary is warm (red/orange/yellow), secondary might be cool (blue/green)
- If primary is saturated, secondary might be desaturated
- Smart logic to create visual harmony

### 1.7 Preview Tabs

**Tab Navigation:**
```html
<section class="preview-section">
  <div class="section-divider">
    <span>PREVIEW</span>
  </div>
  
  <div class="preview-tabs">
    <button class="preview-tab active" data-tab="cards">CARDS</button>
    <button class="preview-tab" data-tab="components">COMPONENTS</button>
    <button class="preview-tab" data-tab="charts">CHARTS</button>
    <button class="preview-tab" data-tab="gradients">GRADIENTS</button>
    <button class="preview-tab" data-tab="logos">LOGOS</button>
    <button class="preview-tab" data-tab="headings">HEADINGS</button>
  </div>
  
  <div class="preview-content">
    <!-- Dynamic content based on active tab -->
  </div>
</section>
```

**Preview Tabs Styling:**
- Display: `flex`
- Gap: `8px`
- Margin-bottom: `32px`
- Flex-wrap: `wrap`
- Border-bottom: `1px solid var(--border-light)`
- Padding-bottom: `16px`

**Preview Tab Button:**
- Padding: `12px 24px`
- Border: `1.5px solid var(--border-light)`
- Background: `rgba(30, 30, 30, 0.4)`
- Font-size: `11px`
- Font-weight: `700`
- Text-transform: `uppercase`
- Letter-spacing: `0.06em`
- Color: `var(--text-secondary)`
- Border-radius: `var(--radius-pill)` (64px)
- Cursor: `pointer`
- Transition: `all 0.25s cubic-bezier(0.4, 0, 0.2, 1)`
- Active: background `var(--accent)`, border `var(--accent)`, color `white`, box-shadow `var(--shadow-glow)`
- Hover (inactive): background `var(--surface-2)`, border `rgba(255, 255, 255, 0.2)`, color `white`, transform `translateY(-1px)`

**Preview Content Container:**
- Min-height: `400px`
- Padding: `clamp(24px, 4vw, 40px)`
- Background: `var(--surface)`
- Backdrop-filter: `blur(48px)`
- Border: `1px solid var(--border-light)`
- Border-radius: `var(--radius-lg)`
- Box-shadow: `var(--shadow-lg)`
- Gradient border effect (`::before`)
- Animation: `fadeIn 0.3s ease-out` (when switching tabs)

**Responsive (Mobile < 640px):**
- Preview tabs: font-size `10px`, padding `10px 16px`
- Gap: `6px`

### 1.8 Export Section

**Layout:**
```html
<section class="export-section">
  <div class="section-divider">
    <span>EXPORT CODE</span>
  </div>
  
  <div class="export-tabs">
    <button class="export-tab active" data-format="figma">FIGMA VARIABLES ★</button>
    <button class="export-tab" data-format="css">CSS</button>
    <button class="export-tab" data-format="tailwind-v3">TAILWIND V3</button>
    <button class="export-tab" data-format="tailwind-v4">TAILWIND V4</button>
    <button class="export-tab" data-format="oklch">OKLCH</button>
    <button class="export-tab" data-format="json">JSON</button>
  </div>
  
  <div class="export-code-container">
    <pre class="export-code" id="exportCode">
      <!-- Dynamic code output -->
    </pre>
    
    <div class="export-actions">
      <button class="btn btn-success copy-btn">
        COPY TO CLIPBOARD
      </button>
      <button class="btn btn-outline download-btn">
        DOWNLOAD FILE
      </button>
    </div>
  </div>
</section>
```

**Export Section Styling:**
- Same card pattern as palette cards
- Background: `var(--surface)` + blur
- Border: `1px solid var(--border-light)`
- Border-radius: `var(--radius-lg)`
- Padding: `clamp(28px, 5vw, 40px)`
- Box-shadow: `var(--shadow-lg)`
- Margin-top: `clamp(40px, 6vw, 64px)`
- Animation: `fadeInUp 0.9s ease-out`

**Export Tabs:**
- Same styling as preview tabs
- "FIGMA VARIABLES ★" has star to indicate default/recommended

**Export Code Block:**
- Background: `rgba(0, 0, 0, 0.4)`
- Border: `1px solid var(--border)`
- Border-radius: `16px`
- Padding: `24px`
- Font-family: `'SF Mono', 'Fira Code', monospace`
- Font-size: `13px`
- Line-height: `1.8`
- Color: `var(--text-secondary)`
- Max-height: `500px`
- Overflow-y: `auto`
- White-space: `pre-wrap`
- Word-break: `break-word`
- Box-shadow: `inset 0 2px 8px rgba(0, 0, 0, 0.3)`

**Syntax Highlighting (Simple):**
- Comments: `color: #6b7280` (gray)
- Strings: `color: #10b981` (green)
- Numbers: `color: #f59e0b` (orange)
- Keywords: `color: #3b82f6` (blue)
- Properties: `color: #8b5cf6` (purple)

**Export Actions:**
- Display: `flex`
- Gap: `12px`
- Margin-top: `20px`
- Flex-wrap: `wrap`

**Copy Button:**
- `.btn.btn-success` styling (green)
- Click: copies code to clipboard, shows toast "Code copied!"

**Download Button:**
- `.btn.btn-outline` styling
- Click: downloads as `.json`, `.css`, `.js`, etc. based on active format
- Filename: `shades-primary.tokens.json`, `shades-primary.css`, etc.

**Responsive (Mobile < 640px):**
- Stack buttons vertically (full width)
- Code block font-size: `12px`

### 1.9 Footer

**Component:** Existing footer from design system

**Structure:**
```html
<footer class="footer">
  <div class="footer-text">
    ©2025 <span class="footer-divider">//</span> MADE BY 
    <a href="https://gamaleldien.com" class="footer-link">GAMAL ELDIEN</a> 
    <span class="footer-divider">//</span> 
    <a href="/tools" class="footer-link">MORE TOOLS</a>
  </div>
</footer>
```

**Styling:**
- Margin-top: `clamp(64px, 10vw, 120px)`
- Border-top: `1px solid var(--border)`
- Padding: `clamp(32px, 5vw, 48px) clamp(24px, 5vw, 48px)`
- Text-align: `center`
- Font-size: `12px`
- Uppercase
- Letter-spacing: `0.08em`
- Color: `var(--text-muted)`
- Animation: `fadeIn 0.5s ease-out`

**Links:**
- Color: `var(--text)` → `var(--accent)` on hover
- Transition: `color 0.2s`

---

## 2. Component Specs (Mapped to Design System)

### 2.1 Component Mapping

| UI Element | Design System Component | Modifications |
|------------|------------------------|---------------|
| Navbar | `.navbar` | Exact reuse |
| Header | `<header>` | Add border-bottom |
| Primary Button | `.btn.btn-primary` | Exact reuse |
| Outline Button | `.btn.btn-outline` | Exact reuse |
| Danger Button | `.btn.btn-danger` | Exact reuse (for "Remove") |
| Icon Button | `.icon-btn` | Exact reuse (copy, lock) |
| Remove Button | `.btn-remove` | Exact reuse (× icon) |
| Palette Card | `.palette-card` | Rename to `.shade-card`, same styling |
| Color Picker | `input[type="color"]` | Increase size to 56px |
| Text Input | `input[type="text"]` | Apply `.name-input` pattern |
| Select Dropdown | `select` | Apply design system styling |
| Preview Tabs | `.export-tab` pattern | Rename to `.preview-tab`, same styling |
| Export Tabs | `.export-tab` | Exact reuse |
| Code Block | `.export-code` | Exact reuse |
| Toast | `.toast` | Exact reuse |
| Modal | `.modal` + `.modal-overlay` | Exact reuse |
| Footer | `.footer` | Exact reuse |
| Section Divider | `.section-divider` | Exact reuse |
| Badge | `.contrast-badge` pattern | Apply to "EDITED", "LOCKED" indicators |

**Design System Reference:**
- All components use existing tokens: `--accent`, `--surface`, `--border-light`, etc.
- All typography uses Clash Display font
- All spacing uses clamp() patterns
- All animations use `fadeIn`, `fadeInUp` keyframes

### 2.2 Color Tokens

**Used Throughout:**
- `--bg` — Body background (#0a0a0a)
- `--surface` — Cards, navbar (rgba(63, 63, 63, 0.3) + blur)
- `--surface-elevated` — Hover states (rgba(90, 90, 90, 0.25))
- `--text` — White text (#ffffff)
- `--text-muted` — Gray labels (#808080)
- `--text-secondary` — Body copy (#999999)
- `--border` — Dividers (#333333)
- `--border-light` — Card borders (rgba(255, 255, 255, 0.08))
- `--accent` — Orange brand color (#e16105)
- `--accent-hover` — Orange hover (#ff7519)
- `--accent-glow` — Orange glow (rgba(225, 97, 5, 0.15))
- `--danger` — Red (#ef4444)
- `--success` — Green (#10b981)
- `--warning` — Yellow (#f59e0b)

### 2.3 Typography Tokens

**Font Family:**
- `--font-display` — 'Clash Display', -apple-system, sans-serif
- Monospace — 'SF Mono', 'Fira Code', monospace

**Font Sizes:**
- h1: `clamp(32px, 6vw, 56px)`
- h2: `clamp(24px, 5vw, 32px)`
- h3: `18px` (modal heading)
- p: `clamp(13px, 2.5vw, 15px)`
- .btn: `12px`
- .navbar-link: `11px`
- .shade-label: `12px`
- .shade-value: `11px`
- .export-code: `13px`

**Weights:**
- Bold (700): headings, labels, buttons
- Semibold (600): medium emphasis
- Medium (500): body text
- Regular (400): rare

**Text Transforms:**
- Uppercase: all headings, buttons, labels, UI chrome
- Sentence case: body paragraphs, descriptions

### 2.4 Spacing Tokens

**Border Radius:**
- `--radius`: `24px` (default)
- `--radius-lg`: `32px` (cards)
- `--radius-pill`: `64px` (buttons)
- Fixed: `12px` (shade items), `10px` (swatches), `14px` (inputs)

**Padding/Margin:**
- Main wrapper: `clamp(16px, 4vw, 48px)`
- Header: `clamp(32px, 6vw, 64px)` margin-top
- Section margin: `clamp(40px, 6vw, 64px)`
- Card padding: `clamp(20px, 4vw, 32px)`
- Footer margin-top: `clamp(64px, 10vw, 120px)`

**Gaps:**
- Controls: `12px` (desktop) → `8px` (mobile)
- Shade list: `16px`
- Preview tabs: `8px` → `6px` (mobile)
- Export actions: `12px`

---

## 3. Shade Scale Display (Detailed Specs)

### 3.1 Visual Layout

**11-Shade Structure:**
```
[50]  [100]  [200]  [300]  [400]  [500]  [600]  [700]  [800]  [900]  [950]
 □     □      □      □      □      ■      □      □      □      □      □
Lightest ←───────────────── Mid ──────────────────→ Darkest
```

**Visual Characteristics:**
- **50**: Near-white (e.g., #eff6ff for blue)
- **100**: Very light (e.g., #dbeafe)
- **200**: Light (e.g., #bfdbfe)
- **300**: Light-medium (e.g., #93c5fd)
- **400**: Medium-light (e.g., #60a5fa)
- **500**: Mid (base color from input)
- **600**: Medium-dark (e.g., #2563eb)
- **700**: Dark (e.g., #1d4ed8)
- **800**: Very dark (e.g., #1e40af)
- **900**: Near-black (e.g., #1e3a8a)
- **950**: Darkest (e.g., #172554)

**Generation Algorithm:**
- Input color → shade 500 (middle)
- Shades 50-400: Progressively mix with white, decrease saturation at extremes
- Shades 600-950: Progressively mix with black, maintain saturation longer
- Use OKLCH color space for perceptually uniform distribution
- Ensure each step is visually distinct (minimum ΔE > 10)

### 3.2 Shade Item Components

**Each Shade Contains:**

1. **Swatch (Square Color Block)**
   - Aspect-ratio: 1/1 (perfect square)
   - Border-radius: 10px
   - Box-shadow: `var(--shadow-sm)`
   - Displays current shade color
   - Click-to-edit behavior (opens color picker overlay)

2. **Shade Label (50, 100, 200...)**
   - 12px, bold, uppercase, centered
   - Color: `var(--text)`
   - Non-editable (fixed shade numbers)

3. **Shade Value (Hex/HSL/OKLCH/RGB)**
   - 11px, monospace, centered
   - Color: `var(--text-secondary)` → `var(--accent)` on hover
   - Click-to-copy functionality
   - Format toggles between HEX, HSL, OKLCH, RGB

4. **Format Toggles (HEX | HSL | OKLCH | RGB)**
   - 4 small buttons (8px font-size)
   - Active format highlighted in orange
   - Updates value display on click
   - Persists per-shade (can have different formats for different shades)

5. **Action Buttons**
   - **Copy button** (📋): Copies current value to clipboard
   - **Lock button** (🔒/🔓): Locks shade (prevents regeneration)

**States:**
- **Default**: Normal border, no background
- **Hover**: Elevated background, translateY(-2px)
- **Locked**: Yellow border, yellow lock icon, background tint
- **Edited**: Blue border, "EDITED" badge, marks manual override
- **Copied**: Flash green border briefly, show toast "Copied #3b82f6"

### 3.3 Click-to-Copy Behavior

**Interaction:**
- User clicks shade value (hex code)
- Value copies to clipboard
- Toast notification appears: "COPIED #3B82F6"
- Shade value flashes briefly (color change or border flash)
- Works for any format (HEX, HSL, OKLCH, RGB)

**Code Example:**
```javascript
async function copyShadeValue(value) {
  await navigator.clipboard.writeText(value);
  showToast(`Copied ${value.toUpperCase()}`);
  // Flash animation
  element.classList.add('flash');
  setTimeout(() => element.classList.remove('flash'), 300);
}
```

**Flash Animation:**
```css
@keyframes flash {
  0%, 100% { background: transparent; }
  50% { background: rgba(16, 185, 129, 0.2); }
}
.flash {
  animation: flash 0.3s ease-out;
}
```

### 3.4 Editable Shades (Individual Override)

**Behavior:**
- User clicks shade swatch → native color picker opens
- User selects new color → shade updates to custom color
- Shade marked as "manual override" (blue border + "EDITED" badge)
- Manual overrides persist across regeneration (unless unlocked)
- Only that specific shade changes, others regenerate normally

**Visual Indicator:**
- Border: `1.5px solid rgba(96, 165, 250, 0.3)` (blue)
- Badge: Small "EDITED" text in blue, top-right corner
- Tooltip on hover: "Manually edited — lock to preserve across regeneration"

**Override Reset:**
- User can click "Reset" button on shade item to revert to algorithm-generated value
- Or unlock shade and regenerate primary color

**Code Logic:**
```javascript
shadeItem.overridden = true;
shadeItem.customColor = newColor;
// When regenerating, skip overridden shades unless unlocked
```

### 3.5 Color Info Display

**Format Switching:**
- Default: **HEX** (e.g., `#3b82f6`)
- Option: **HSL** (e.g., `hsl(217, 91%, 60%)`)
- Option: **OKLCH** (e.g., `oklch(0.60 0.18 265)`)
- Option: **RGB** (e.g., `rgb(59, 130, 246)`)

**Format Toggle Buttons:**
- 4 small pill buttons below shade value
- Active format has orange background
- Click to switch format
- Updates value display instantly

**Value Formats:**

**HEX:**
```
#3b82f6
```

**HSL:**
```
hsl(217, 91%, 60%)
```

**OKLCH:**
```
oklch(0.60 0.18 265)
```

**RGB:**
```
rgb(59, 130, 246)
```

**All formats copyable:**
- Click value → copies exact formatted string
- Includes prefix (`#`, `hsl()`, `oklch()`, `rgb()`)

---

## 4. Preview Tabs (Detailed Content)

### 4.1 Cards Tab

**Purpose:** Show shade scale applied to card UI components

**Layout:**
```html
<div class="preview-grid">
  <div class="preview-card" style="background: [shade-50]; color: [shade-900];">
    <h3 style="color: [shade-500];">FEATURE CARD</h3>
    <p>This is a preview of your color scale applied to a card component.</p>
    <button class="preview-btn" style="background: [shade-500]; color: white;">
      LEARN MORE
    </button>
  </div>
  
  <div class="preview-card" style="background: [shade-100]; border: 2px solid [shade-200];">
    <span class="preview-badge" style="background: [shade-500]; color: white;">NEW</span>
    <h3 style="color: [shade-700];">PRODUCT CARD</h3>
    <p style="color: [shade-600];">$49.99</p>
    <p style="color: [shade-500];">High-quality product with amazing features.</p>
  </div>
  
  <div class="preview-card" style="background: [shade-900]; color: [shade-50];">
    <h3 style="color: [shade-300];">DARK CARD</h3>
    <p style="color: [shade-400];">This card uses darker shades from the scale.</p>
    <button class="preview-btn" style="background: [shade-100]; color: [shade-900];">
      EXPLORE
    </button>
  </div>
</div>
```

**Preview Grid:**
- Display: `grid`
- Grid-template-columns: `repeat(auto-fit, minmax(280px, 1fr))`
- Gap: `clamp(20px, 4vw, 32px)`

**Preview Card:**
- Padding: `clamp(24px, 4vw, 32px)`
- Border-radius: `var(--radius-lg)` (32px)
- Box-shadow: `var(--shadow-md)`
- Transition: `all 0.3s`
- Hover: transform `translateY(-4px)`, box-shadow `var(--shadow-lg)`

**Color Application:**
- **Light card**: background `shade-50`, text `shade-900`, heading `shade-500`
- **Bordered card**: background `shade-100`, border `shade-200`, heading `shade-700`
- **Dark card**: background `shade-900`, text `shade-50`, accent `shade-300`
- **Buttons**: background primary shade (500), white text
- **Badges**: background `shade-500`, white text

**Dynamic Behavior:**
- Colors update in real-time when shade scale changes
- If secondary color exists, show mixed cards (primary + secondary)
- Show 4-6 card variations

### 4.2 Components Tab

**Purpose:** Show UI components (buttons, inputs, badges, alerts, toggles) using shade scale

**Layout:**
```html
<div class="components-showcase">
  <!-- Buttons -->
  <div class="component-section">
    <h4>BUTTONS</h4>
    <div class="component-row">
      <button style="background: [shade-500]; color: white;">PRIMARY</button>
      <button style="background: [shade-600]; color: white;">HOVER</button>
      <button style="background: [shade-700]; color: white;">ACTIVE</button>
      <button style="border: 2px solid [shade-500]; color: [shade-500];">OUTLINE</button>
      <button style="background: [shade-100]; color: [shade-700];">SUBTLE</button>
    </div>
  </div>
  
  <!-- Inputs -->
  <div class="component-section">
    <h4>INPUTS</h4>
    <input type="text" placeholder="Email address" 
           style="border: 2px solid [shade-300]; background: [shade-50];">
    <input type="text" value="Filled input" 
           style="border: 2px solid [shade-500]; background: [shade-100];">
  </div>
  
  <!-- Badges -->
  <div class="component-section">
    <h4>BADGES</h4>
    <div class="component-row">
      <span class="badge" style="background: [shade-100]; color: [shade-700];">INFO</span>
      <span class="badge" style="background: [shade-500]; color: white;">PRIMARY</span>
      <span class="badge" style="background: [shade-700]; color: white;">DARK</span>
      <span class="badge" style="border: 1px solid [shade-500]; color: [shade-500];">OUTLINE</span>
    </div>
  </div>
  
  <!-- Alerts -->
  <div class="component-section">
    <h4>ALERTS</h4>
    <div class="alert" style="background: [shade-50]; border-left: 4px solid [shade-500]; color: [shade-800];">
      <strong>Notification:</strong> Your color scale looks amazing!
    </div>
    <div class="alert" style="background: [shade-900]; border-left: 4px solid [shade-300]; color: [shade-100];">
      <strong>Dark Alert:</strong> This uses darker shades.
    </div>
  </div>
  
  <!-- Toggles -->
  <div class="component-section">
    <h4>TOGGLES & SWITCHES</h4>
    <div class="toggle" style="background: [shade-200];">
      <div class="toggle-handle" style="background: [shade-500];"></div>
    </div>
    <div class="toggle active" style="background: [shade-500];">
      <div class="toggle-handle" style="background: white;"></div>
    </div>
  </div>
  
  <!-- Progress Bars -->
  <div class="component-section">
    <h4>PROGRESS</h4>
    <div class="progress-bar" style="background: [shade-200];">
      <div class="progress-fill" style="background: [shade-500]; width: 70%;"></div>
    </div>
  </div>
</div>
```

**Component Section:**
- Display: `flex`
- Flex-direction: `column`
- Gap: `16px`
- Margin-bottom: `32px`

**Component Row:**
- Display: `flex`
- Gap: `12px`
- Flex-wrap: `wrap`

**Styling:**
- Buttons: pill-shaped (64px radius), padding 12px 24px
- Inputs: border-radius 12px, padding 12px 16px
- Badges: border-radius 12px, padding 6px 12px, font-size 11px
- Alerts: border-radius 16px, padding 16px 20px, font-size 14px
- Toggles: width 48px, height 24px, border-radius 24px
- Progress bars: height 12px, border-radius 12px

**Color Application:**
- Primary buttons: shade-500 background
- Hover: shade-600
- Active: shade-700
- Outlines: shade-500 border
- Subtle: shade-100 background, shade-700 text
- Inputs: shade-300 border (unfocused), shade-500 (focused)
- Badges: various combinations of 100/500/700
- Alerts: 50/800 for light, 900/100 for dark
- Progress: 200 background, 500 fill

**Dynamic Behavior:**
- All components update colors in real-time
- Show "before/after" when switching between primary and secondary scales
- If secondary exists, show mixed components (primary button with secondary border, etc.)

### 4.3 Charts Tab

**Purpose:** Visualize data charts using shade scale

**Layout:**
```html
<div class="charts-showcase">
  <!-- Bar Chart -->
  <div class="chart-container">
    <h4>BAR CHART</h4>
    <div class="bar-chart">
      <div class="bar" style="height: 60%; background: [shade-300];"></div>
      <div class="bar" style="height: 80%; background: [shade-400];"></div>
      <div class="bar" style="height: 95%; background: [shade-500];"></div>
      <div class="bar" style="height: 70%; background: [shade-600];"></div>
      <div class="bar" style="height: 50%; background: [shade-700];"></div>
    </div>
  </div>
  
  <!-- Pie Chart -->
  <div class="chart-container">
    <h4>PIE CHART</h4>
    <div class="pie-chart">
      <!-- SVG pie chart with slices in shades 300, 400, 500, 600, 700 -->
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="[shade-300]" />
        <path d="..." fill="[shade-400]" />
        <path d="..." fill="[shade-500]" />
        <path d="..." fill="[shade-600]" />
        <path d="..." fill="[shade-700]" />
      </svg>
    </div>
  </div>
  
  <!-- Line Chart -->
  <div class="chart-container">
    <h4>LINE CHART</h4>
    <div class="line-chart">
      <!-- SVG line chart with gradient fill using shades 200-600 -->
      <svg viewBox="0 0 200 100">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="[shade-300]" />
            <stop offset="100%" stop-color="[shade-600]" stop-opacity="0.2" />
          </linearGradient>
        </defs>
        <path d="..." stroke="[shade-500]" fill="url(#lineGradient)" />
      </svg>
    </div>
  </div>
  
  <!-- Area Chart -->
  <div class="chart-container">
    <h4>AREA CHART</h4>
    <div class="area-chart">
      <!-- Multiple area series using different shades -->
      <svg viewBox="0 0 200 100">
        <path d="..." fill="[shade-200]" opacity="0.6" />
        <path d="..." fill="[shade-400]" opacity="0.6" />
        <path d="..." fill="[shade-600]" opacity="0.6" />
      </svg>
    </div>
  </div>
</div>
```

**Chart Container:**
- Background: `rgba(20, 20, 20, 0.4)`
- Border: `1px solid var(--border-light)`
- Border-radius: `16px`
- Padding: `24px`
- Aspect-ratio: `16/9` (bar/line), `1/1` (pie)

**Bar Chart:**
- Display: `flex`
- Gap: `12px`
- Align-items: `flex-end`
- Height: `200px`
- Each bar: width `40px`, border-radius `8px 8px 0 0`

**Pie Chart:**
- SVG circle slices
- Each slice = different shade (300, 400, 500, 600, 700)
- Size: `200px × 200px`
- Center label showing percentage

**Line Chart:**
- SVG path with stroke
- Gradient fill (area under line)
- Grid background (subtle lines in shade-100)
- Data points as circles (shade-500)

**Area Chart:**
- Multiple overlapping paths
- Each path = different shade with transparency
- Stacked or overlapping areas

**Color Application:**
- Use shades 200-800 for variety
- Darker shades for more important data
- Lighter shades for less important data
- Gradients from light to dark (200 → 700)

**Dynamic Behavior:**
- Charts update colors in real-time
- If secondary color exists, show dual-color charts (primary vs secondary comparison)
- Animated transitions when colors change (0.3s ease)

### 4.4 Gradients Tab

**Purpose:** Show gradient combinations from shade scale

**Layout:**
```html
<div class="gradients-showcase">
  <!-- Linear Gradients -->
  <div class="gradient-section">
    <h4>LINEAR GRADIENTS</h4>
    <div class="gradient-grid">
      <div class="gradient-box" style="background: linear-gradient(135deg, [shade-200], [shade-600]);">
        <span>200 → 600</span>
      </div>
      <div class="gradient-box" style="background: linear-gradient(135deg, [shade-300], [shade-700]);">
        <span>300 → 700</span>
      </div>
      <div class="gradient-box" style="background: linear-gradient(135deg, [shade-400], [shade-800]);">
        <span>400 → 800</span>
      </div>
      <div class="gradient-box" style="background: linear-gradient(135deg, [shade-100], [shade-500], [shade-900]);">
        <span>100 → 500 → 900</span>
      </div>
    </div>
  </div>
  
  <!-- Radial Gradients -->
  <div class="gradient-section">
    <h4>RADIAL GRADIENTS</h4>
    <div class="gradient-grid">
      <div class="gradient-box" style="background: radial-gradient(circle, [shade-400], [shade-800]);">
        <span>RADIAL</span>
      </div>
      <div class="gradient-box" style="background: radial-gradient(ellipse, [shade-300], [shade-700]);">
        <span>ELLIPSE</span>
      </div>
    </div>
  </div>
  
  <!-- Mesh Gradients -->
  <div class="gradient-section">
    <h4>MESH / COMPLEX</h4>
    <div class="gradient-grid">
      <div class="gradient-box" style="background: conic-gradient(from 0deg, [shade-300], [shade-500], [shade-700], [shade-300]);">
        <span>CONIC</span>
      </div>
      <div class="gradient-box" style="background: linear-gradient(45deg, [shade-200] 25%, [shade-400] 25%, [shade-400] 50%, [shade-200] 50%, [shade-200] 75%, [shade-400] 75%);">
        <span>STRIPED</span>
      </div>
    </div>
  </div>
  
  <!-- Text Gradients -->
  <div class="gradient-section">
    <h4>TEXT GRADIENTS</h4>
    <h2 style="background: linear-gradient(135deg, [shade-400], [shade-700]); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
      BEAUTIFUL TEXT
    </h2>
    <h2 style="background: linear-gradient(90deg, [shade-200], [shade-600]); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
      COLOR GRADIENTS
    </h2>
  </div>
</div>
```

**Gradient Grid:**
- Display: `grid`
- Grid-template-columns: `repeat(auto-fit, minmax(200px, 1fr))`
- Gap: `20px`

**Gradient Box:**
- Aspect-ratio: `16/9`
- Border-radius: `16px`
- Display: `flex`
- Align-items: `center`
- Justify-content: `center`
- Box-shadow: `var(--shadow-md)`
- Position: `relative`

**Gradient Label:**
- Font-size: `11px`
- Font-weight: `700`
- Text-transform: `uppercase`
- Color: `white` (with text-shadow for readability)
- Text-shadow: `0 2px 8px rgba(0, 0, 0, 0.5)`

**Text Gradients:**
- Font-size: `clamp(32px, 6vw, 56px)`
- Background-clip: `text`
- Text-fill-color: `transparent`

**Color Combinations:**
- **Light to Dark**: 200 → 600, 300 → 700, 400 → 800
- **Multi-stop**: 100 → 500 → 900 (3-color)
- **Subtle**: 400 → 600 (close shades)
- **Extreme**: 50 → 950 (full range)

**Dynamic Behavior:**
- If secondary color exists, show dual-color gradients (primary-300 → secondary-700)
- Update gradients in real-time as shades change
- Show angle variations (0°, 45°, 90°, 135°, 180°)

### 4.5 Logos Tab

**Purpose:** Show logo mockups with generated colors applied

**Layout:**
```html
<div class="logos-showcase">
  <h4>LOGO COLOR VARIATIONS</h4>
  <p class="logos-description">See how your color scale looks on logo designs</p>
  
  <div class="logos-grid">
    <!-- Logo Variation 1: Monochrome -->
    <div class="logo-container">
      <div class="logo-mockup" style="background: [shade-50];">
        <svg class="logo-icon" fill="[shade-500]">
          <!-- Abstract logo shape -->
          <circle cx="50" cy="50" r="30" />
          <rect x="30" y="70" width="40" height="10" rx="5" />
        </svg>
        <span class="logo-text" style="color: [shade-700];">BRAND</span>
      </div>
      <span class="logo-label">MONOCHROME</span>
    </div>
    
    <!-- Logo Variation 2: Gradient -->
    <div class="logo-container">
      <div class="logo-mockup" style="background: [shade-900];">
        <svg class="logo-icon">
          <defs>
            <linearGradient id="logoGrad1">
              <stop offset="0%" stop-color="[shade-300]" />
              <stop offset="100%" stop-color="[shade-600]" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="30" fill="url(#logoGrad1)" />
        </svg>
        <span class="logo-text" style="color: [shade-100];">BRAND</span>
      </div>
      <span class="logo-label">GRADIENT</span>
    </div>
    
    <!-- Logo Variation 3: Dual-tone -->
    <div class="logo-container">
      <div class="logo-mockup" style="background: white;">
        <svg class="logo-icon">
          <circle cx="50" cy="50" r="30" fill="[shade-500]" />
          <path d="..." fill="[shade-700]" />
        </svg>
        <span class="logo-text" style="color: [shade-900];">BRAND</span>
      </div>
      <span class="logo-label">DUAL-TONE</span>
    </div>
    
    <!-- Logo Variation 4: Inverted -->
    <div class="logo-container">
      <div class="logo-mockup" style="background: [shade-500];">
        <svg class="logo-icon" fill="white">
          <circle cx="50" cy="50" r="30" />
        </svg>
        <span class="logo-text" style="color: white;">BRAND</span>
      </div>
      <span class="logo-label">INVERTED</span>
    </div>
  </div>
  
  <!-- If secondary color exists -->
  <div class="logos-grid" v-if="hasSecondary">
    <h5>PRIMARY + SECONDARY COMBINATIONS</h5>
    <!-- Show logos with both colors -->
  </div>
</div>
```

**Logos Grid:**
- Display: `grid`
- Grid-template-columns: `repeat(auto-fit, minmax(200px, 1fr))`
- Gap: `clamp(20px, 4vw, 32px)`

**Logo Container:**
- Display: `flex`
- Flex-direction: `column`
- Gap: `12px`
- Align-items: `center`

**Logo Mockup:**
- Width: `200px`
- Height: `200px`
- Border-radius: `16px`
- Display: `flex`
- Flex-direction: `column`
- Align-items: `center`
- Justify-content: `center`
- Gap: `16px`
- Box-shadow: `var(--shadow-md)`
- Transition: `transform 0.3s`
- Hover: transform `scale(1.05)`

**Logo Icon (SVG):**
- Width: `80px`
- Height: `80px`
- Varies by design (circle, square, abstract shape)

**Logo Text:**
- Font-size: `16px`
- Font-weight: `700`
- Text-transform: `uppercase`
- Letter-spacing: `0.1em`
- Font-family: `var(--font-display)`

**Logo Label:**
- Font-size: `10px`
- Font-weight: `700`
- Text-transform: `uppercase`
- Letter-spacing: `0.08em`
- Color: `var(--text-muted)`

**Logo Variations:**
1. **Monochrome**: Background shade-50, icon shade-500, text shade-700
2. **Gradient**: Dark background (shade-900), icon gradient (300→600), white text
3. **Dual-tone**: White background, icon with 2 shades (500 + 700), dark text
4. **Inverted**: Background shade-500, white icon + text
5. **Outline**: White background, outline icon (stroke shade-500), shade text

**With Secondary:**
- Show 2-color logos (primary icon, secondary accent)
- Show split logos (left primary, right secondary)
- Show complementary combinations

**Dynamic Behavior:**
- Update colors in real-time
- Show 6-8 variations total
- Randomize logo shapes/styles for variety
- If user uploads custom logo SVG, apply colors to it (future feature)

### 4.6 Headings Tab

**Purpose:** Typography preview with colors applied to headings and text

**Layout:**
```html
<div class="headings-showcase">
  <!-- Display Typography -->
  <div class="typography-section">
    <h1 style="color: [shade-500];">THE QUICK BROWN FOX</h1>
    <p class="typography-meta">H1 — Clash Display Bold 56px — Shade 500</p>
  </div>
  
  <div class="typography-section">
    <h2 style="color: [shade-600];">The Quick Brown Fox Jumps Over</h2>
    <p class="typography-meta">H2 — Clash Display Bold 32px — Shade 600</p>
  </div>
  
  <div class="typography-section">
    <h3 style="color: [shade-700];">The Quick Brown Fox Jumps Over The Lazy Dog</h3>
    <p class="typography-meta">H3 — Clash Display Bold 24px — Shade 700</p>
  </div>
  
  <!-- Body Text -->
  <div class="typography-section">
    <p style="color: [shade-800];">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
    </p>
    <p class="typography-meta">Body — Clash Display Medium 15px — Shade 800</p>
  </div>
  
  <!-- Light Background Headings -->
  <div class="light-bg-section" style="background: [shade-50]; padding: 40px; border-radius: 16px;">
    <h2 style="color: [shade-700];">HEADINGS ON LIGHT BACKGROUND</h2>
    <p style="color: [shade-600];">This is how your text looks on a light background using the shade scale.</p>
  </div>
  
  <!-- Dark Background Headings -->
  <div class="dark-bg-section" style="background: [shade-900]; padding: 40px; border-radius: 16px;">
    <h2 style="color: [shade-100];">HEADINGS ON DARK BACKGROUND</h2>
    <p style="color: [shade-300];">This is how your text looks on a dark background using the shade scale.</p>
  </div>
  
  <!-- Gradient Text -->
  <div class="typography-section">
    <h1 class="gradient-text" style="background: linear-gradient(135deg, [shade-400], [shade-700]); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
      GRADIENT HEADING
    </h1>
    <p class="typography-meta">Gradient (400 → 700) — Clash Display Bold 56px</p>
  </div>
  
  <!-- Contrast Examples -->
  <div class="contrast-examples">
    <h4>CONTRAST COMBINATIONS</h4>
    <div class="contrast-grid">
      <div class="contrast-box" style="background: [shade-50]; color: [shade-900];">
        <span>50 / 900</span>
      </div>
      <div class="contrast-box" style="background: [shade-100]; color: [shade-800];">
        <span>100 / 800</span>
      </div>
      <div class="contrast-box" style="background: [shade-500]; color: white;">
        <span>500 / WHITE</span>
      </div>
      <div class="contrast-box" style="background: [shade-900]; color: [shade-100];">
        <span>900 / 100</span>
      </div>
    </div>
  </div>
</div>
```

**Typography Section:**
- Margin-bottom: `40px`
- Border-bottom: `1px solid var(--border-light)`
- Padding-bottom: `24px`

**Typography Meta:**
- Font-size: `11px`
- Color: `var(--text-muted)`
- Text-transform: `uppercase`
- Letter-spacing: `0.06em`
- Margin-top: `12px`

**Light/Dark Background Sections:**
- Padding: `40px`
- Border-radius: `16px`
- Margin: `32px 0`
- Box-shadow: `var(--shadow-md)`

**Gradient Text:**
- Font-size: `clamp(32px, 6vw, 56px)`
- Background: linear gradient
- -webkit-background-clip: `text`
- -webkit-text-fill-color: `transparent`
- Background-clip: `text`

**Contrast Grid:**
- Display: `grid`
- Grid-template-columns: `repeat(auto-fit, minmax(150px, 1fr))`
- Gap: `16px`

**Contrast Box:**
- Padding: `32px 24px`
- Border-radius: `12px`
- Text-align: `center`
- Font-size: `12px`
- Font-weight: `700`
- Text-transform: `uppercase`
- Letter-spacing: `0.06em`

**Color Application:**
- **H1**: shade-500 (mid, strong)
- **H2**: shade-600 (slightly darker)
- **H3**: shade-700 (darker still)
- **Body**: shade-800 (dark for readability)
- **Light BG**: shade-700 headings, shade-600 body
- **Dark BG**: shade-100 headings, shade-300 body
- **Gradients**: 400→700, 300→600, 200→800

**Dynamic Behavior:**
- Update text colors in real-time
- Show WCAG contrast ratios for each combination
- Highlight failing combinations with warning badge
- Suggest better shade pairings for accessibility

---

## 5. Interactions & Behaviors

### 5.1 Color Input → Real-Time Shade Generation

**Trigger Events:**
- User types hex in text input (debounced 300ms)
- User selects color from color picker
- User clicks "Generate Random"
- User presses Spacebar (random)

**Generation Flow:**
```
1. User inputs color (#3b82f6)
2. Convert to OKLCH (oklch(0.60 0.18 265))
3. Generate 11 shades:
   - 50-400: Lighten progressively (mix with white, reduce saturation)
   - 500: Input color (unchanged)
   - 600-950: Darken progressively (mix with black, maintain saturation)
4. Convert back to HEX
5. Update UI instantly (no page reload)
6. Update all preview tabs
7. Regenerate export code
```

**Algorithm (Simplified):**
```javascript
function generateShades(inputColor) {
  const oklch = hexToOKLCH(inputColor); // { L, C, H }
  const shades = {};
  
  // Shade 500 = input color
  shades[500] = inputColor;
  
  // Lighter shades (50-400)
  const lightSteps = [50, 100, 200, 300, 400];
  lightSteps.forEach((shade, index) => {
    const lightness = oklch.L + (1 - oklch.L) * ((5 - index) / 6);
    const chroma = oklch.C * (0.2 + 0.8 * (index / 4)); // Reduce saturation
    shades[shade] = oklchToHex({ L: lightness, C: chroma, H: oklch.H });
  });
  
  // Darker shades (600-950)
  const darkSteps = [600, 700, 800, 900, 950];
  darkSteps.forEach((shade, index) => {
    const lightness = oklch.L * (1 - (index + 1) / 6);
    const chroma = oklch.C * (0.9 - index * 0.1); // Slightly reduce saturation
    shades[shade] = oklchToHex({ L: lightness, C: chroma, H: oklch.H });
  });
  
  return shades;
}
```

**Real-Time Updates:**
- Debounce hex input: 300ms delay after last keystroke
- Color picker: instant update on change
- Random button: instant generation
- All preview tabs update simultaneously
- Export code regenerates
- Animation: fade-in new colors (0.2s ease)

**Edge Cases:**
- Invalid hex input: show error state (red border), don't generate
- Extremely light/dark inputs: adjust algorithm to ensure 11 distinct shades
- Grayscale colors: maintain grayscale (C = 0 throughout)

### 5.2 Click Shade → Copy Hex

**Interaction:**
1. User clicks shade value (e.g., "#3b82f6")
2. Value copies to clipboard (`navigator.clipboard.writeText()`)
3. Toast notification: "COPIED #3B82F6"
4. Shade value flashes green briefly (0.3s animation)

**Code:**
```javascript
async function copyShadeValue(value, element) {
  try {
    await navigator.clipboard.writeText(value);
    showToast(`COPIED ${value.toUpperCase()}`);
    element.classList.add('flash-green');
    setTimeout(() => element.classList.remove('flash-green'), 300);
  } catch (err) {
    showToast('COPY FAILED — TRY AGAIN', 'error');
  }
}
```

**Flash Animation:**
```css
.flash-green {
  animation: flashGreen 0.3s ease-out;
}
@keyframes flashGreen {
  0%, 100% { background: transparent; }
  50% { background: rgba(16, 185, 129, 0.3); }
}
```

**Toast:**
- Position: `fixed`, bottom `32px`, left `50%`, transform `translateX(-50%)`
- Background: `var(--surface)` + blur
- Padding: `16px 32px`
- Border-radius: `var(--radius-pill)`
- Font-size: `12px`, uppercase, bold
- Auto-dismiss: 2 seconds
- Slide-up entrance animation

### 5.3 Edit Individual Shade

**Interaction:**
1. User clicks shade swatch (colored square)
2. Hidden `input[type="color"]` overlay triggers (opens native picker)
3. User selects new color
4. Shade updates to custom color
5. Shade marked as "manual override" (blue border + "EDITED" badge)
6. Manual overrides persist across regeneration (unless unlocked or reset)

**Visual States:**

**Before Edit:**
- Border: `1px solid var(--border-light)`
- No badge

**After Edit:**
- Border: `1.5px solid rgba(96, 165, 250, 0.3)` (blue)
- Badge: "EDITED" in top-right corner (small, blue background)
- Tooltip: "Manually edited — lock to preserve"

**Code:**
```javascript
function handleShadeEdit(shadeNumber, newColor) {
  shades[shadeNumber].color = newColor;
  shades[shadeNumber].overridden = true; // Mark as manual
  updateShadeUI(shadeNumber);
  updatePreviewTabs();
  updateExportCode();
}

// When regenerating
function regenerateShades() {
  Object.keys(shades).forEach(shade => {
    if (!shades[shade].overridden && !shades[shade].locked) {
      // Regenerate this shade
      shades[shade].color = generateShade(primaryColor, shade);
    }
    // Skip overridden/locked shades
  });
}
```

**Reset Button:**
- Small "↻" button next to copy/lock buttons
- Only visible on edited shades
- Click to revert to algorithm-generated value
- Removes "EDITED" badge and blue border

### 5.4 Switch Between Preview Tabs

**Interaction:**
1. User clicks preview tab button (e.g., "COMPONENTS")
2. Active tab gets orange background + white text
3. Previous tab returns to inactive state (gray background)
4. Preview content animates out (fadeOut 0.15s)
5. New preview content animates in (fadeIn 0.3s)
6. URL hash updates: `#preview-components`

**Code:**
```javascript
function switchPreviewTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.preview-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  
  // Update content
  const content = document.querySelector('.preview-content');
  content.style.opacity = 0;
  
  setTimeout(() => {
    content.innerHTML = renderPreviewContent(tabName);
    content.style.opacity = 1;
  }, 150);
  
  // Update URL
  window.location.hash = `preview-${tabName}`;
}
```

**Animation:**
```css
.preview-content {
  opacity: 1;
  transition: opacity 0.3s ease;
}
```

**Persistence:**
- Active tab stored in localStorage
- On page reload, restore last active tab
- Default: "Cards" tab

### 5.5 Export Code with Tab Switching

**Interaction:**
1. User clicks export tab (e.g., "TAILWIND V3")
2. Active tab gets orange background
3. Code block updates with new format
4. Syntax highlighting applied
5. Download button filename updates (e.g., `shades-primary.js`)

**Export Formats:**

**Figma Variables (JSON Tokens):**
```json
{
  "colors": {
    "primary": {
      "50": { "value": "#eff6ff", "type": "color" },
      "100": { "value": "#dbeafe", "type": "color" },
      "200": { "value": "#bfdbfe", "type": "color" },
      "300": { "value": "#93c5fd", "type": "color" },
      "400": { "value": "#60a5fa", "type": "color" },
      "500": { "value": "#3b82f6", "type": "color" },
      "600": { "value": "#2563eb", "type": "color" },
      "700": { "value": "#1d4ed8", "type": "color" },
      "800": { "value": "#1e40af", "type": "color" },
      "900": { "value": "#1e3a8a", "type": "color" },
      "950": { "value": "#172554", "type": "color" }
    }
  }
}
```

**CSS Variables:**
```css
:root {
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;
  --primary-950: #172554;
}
```

**Tailwind v3 (JS Config):**
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        }
      }
    }
  }
}
```

**Tailwind v4 (OKLCH CSS):**
```css
@theme {
  --color-primary-50: oklch(0.97 0.01 265);
  --color-primary-100: oklch(0.93 0.04 265);
  --color-primary-200: oklch(0.86 0.08 265);
  --color-primary-300: oklch(0.76 0.13 265);
  --color-primary-400: oklch(0.68 0.16 265);
  --color-primary-500: oklch(0.60 0.18 265);
  --color-primary-600: oklch(0.53 0.19 265);
  --color-primary-700: oklch(0.46 0.18 265);
  --color-primary-800: oklch(0.39 0.16 265);
  --color-primary-900: oklch(0.33 0.13 265);
  --color-primary-950: oklch(0.25 0.09 265);
}
```

**OKLCH Values (Raw):**
```
50:  oklch(0.97 0.01 265)
100: oklch(0.93 0.04 265)
200: oklch(0.86 0.08 265)
300: oklch(0.76 0.13 265)
400: oklch(0.68 0.16 265)
500: oklch(0.60 0.18 265)
600: oklch(0.53 0.19 265)
700: oklch(0.46 0.18 265)
800: oklch(0.39 0.16 265)
900: oklch(0.33 0.13 265)
950: oklch(0.25 0.09 265)
```

**JSON (Structured Data):**
```json
{
  "name": "Primary Color Scale",
  "format": "JSON",
  "generated": "2025-01-31T12:00:00Z",
  "shades": [
    { "shade": 50, "hex": "#eff6ff", "hsl": "hsl(217, 89%, 97%)", "oklch": "oklch(0.97 0.01 265)", "rgb": "rgb(239, 246, 255)" },
    { "shade": 100, "hex": "#dbeafe", "hsl": "hsl(217, 85%, 93%)", "oklch": "oklch(0.93 0.04 265)", "rgb": "rgb(219, 234, 254)" },
    ...
  ]
}
```

**Code Generation Logic:**
```javascript
function generateExportCode(format) {
  switch(format) {
    case 'figma':
      return generateFigmaTokens();
    case 'css':
      return generateCSSVariables();
    case 'tailwind-v3':
      return generateTailwindV3();
    case 'tailwind-v4':
      return generateTailwindV4();
    case 'oklch':
      return generateOKLCHValues();
    case 'json':
      return generateJSONExport();
  }
}
```

**Download Behavior:**
- **Figma**: `shades-primary.tokens.json`
- **CSS**: `shades-primary.css`
- **Tailwind v3**: `tailwind.config.js`
- **Tailwind v4**: `theme.css`
- **OKLCH**: `oklch-values.txt`
- **JSON**: `shades-primary.json`

**If secondary scale exists:**
- Include both scales in export
- Figma: nested structure `colors.primary`, `colors.secondary`
- CSS: separate variables `--primary-*`, `--secondary-*`
- Tailwind: both under `colors` object

### 5.6 Keyboard Shortcuts

**Implemented Shortcuts:**

| Key | Action | Behavior |
|-----|--------|----------|
| `Spacebar` | Generate Random Color | Same as clicking "Generate Random" button |
| `Ctrl+C` / `Cmd+C` | Copy Export Code | Copies entire export code block |
| `Ctrl+S` / `Cmd+S` | Download Export | Downloads current export format |
| `1-6` | Switch Preview Tab | 1=Cards, 2=Components, 3=Charts, 4=Gradients, 5=Logos, 6=Headings |
| `E` | Focus Hex Input | Focus on hex input field |
| `L` | Lock Primary Scale | Toggle lock on primary scale |

**Implementation:**
```javascript
document.addEventListener('keydown', (e) => {
  // Ignore if typing in input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  
  switch(e.key) {
    case ' ':
      e.preventDefault();
      generateRandomColor();
      break;
    case 'c':
      if (e.ctrlKey || e.metaKey) {
        copyExportCode();
      }
      break;
    case 's':
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        downloadExport();
      }
      break;
    case '1': switchPreviewTab('cards'); break;
    case '2': switchPreviewTab('components'); break;
    case '3': switchPreviewTab('charts'); break;
    case '4': switchPreviewTab('gradients'); break;
    case '5': switchPreviewTab('logos'); break;
    case '6': switchPreviewTab('headings'); break;
    case 'e':
      document.getElementById('hexInput').focus();
      break;
    case 'l':
      togglePrimaryLock();
      break;
  }
});
```

**Keyboard Hints:**
- Show subtle hint text on buttons: "SPACEBAR" on random button
- Show shortcuts modal with "?" key
- Tooltip on hover shows keyboard shortcut

**Shortcuts Modal (Triggered by `?` key):**
```html
<div class="shortcuts-modal">
  <h3>KEYBOARD SHORTCUTS</h3>
  <div class="shortcuts-list">
    <div class="shortcut-item">
      <kbd>Spacebar</kbd>
      <span>Generate Random Color</span>
    </div>
    <div class="shortcut-item">
      <kbd>Ctrl+C</kbd>
      <span>Copy Export Code</span>
    </div>
    <!-- ... more shortcuts -->
  </div>
  <button class="btn btn-outline">CLOSE</button>
</div>
```

---

## 6. Responsive Design

### 6.1 Desktop Layout (≥1024px)

**Structure:**
- Navbar: full width, sticky
- Hero: centered, max-width 1280px
- Controls: horizontal flex row
- Shade scales: 2-column grid (primary + secondary side-by-side)
- Preview tabs: full width tabs, grid content (2-3 columns)
- Export: full width, code block max-height 500px
- Footer: full width

**Specific Measurements:**
- Container max-width: `1280px`
- Padding: `48px` (sides)
- Shade list: `repeat(auto-fit, minmax(110px, 1fr))` (fits ~11 columns on large screens)
- Preview grid: `repeat(auto-fit, minmax(280px, 1fr))` (2-3 cards per row)

### 6.2 Tablet Layout (768px - 1023px)

**Changes:**
- Shade scales: 1-column grid (stack primary/secondary vertically)
- Preview grid: `repeat(auto-fit, minmax(240px, 1fr))` (2 cards per row)
- Tools grid: 1-column (stack all cards)
- Padding: `clamp(24px, 5vw, 48px)` (responsive)
- Shade list: `repeat(auto-fit, minmax(100px, 1fr))` (~8-10 columns)

**Media Query:**
```css
@media (max-width: 768px) {
  .palettes {
    grid-template-columns: 1fr;
  }
  .preview-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
  .shade-list {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
}
```

### 6.3 Mobile Layout (≤640px)

**Changes:**
- **Controls**: Stack vertically, full-width buttons
  - Color picker + hex input: side-by-side (50%/50%)
  - Buttons: full-width, stacked
  - Gap: `8px` (reduced from 12px)
- **Buttons**: Reduce padding to `12px 20px`, min-width `auto`, font-size `11px`
- **Shade list**: `repeat(auto-fit, minmax(90px, 1fr))` (~3-4 columns)
- **Preview tabs**: Font-size `10px`, padding `10px 16px`, gap `6px`
- **Export tabs**: Same reduction
- **Code block**: Font-size `12px`, max-height `400px`
- **Export actions**: Stack buttons vertically (full-width)
- **Modal**: Padding `24px`, width `95%`

**Media Query:**
```css
@media (max-width: 640px) {
  .controls {
    flex-direction: column;
    gap: 8px;
  }
  .control-item {
    width: 100%;
  }
  .btn {
    width: 100%;
    min-width: auto;
    padding: 12px 20px;
    font-size: 11px;
  }
  .shade-list {
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  }
  .shade-item {
    padding: 12px;
  }
  .preview-tab,
  .export-tab {
    padding: 10px 16px;
    font-size: 10px;
  }
  .export-tabs {
    gap: 6px;
  }
  .export-code {
    font-size: 12px;
    max-height: 400px;
  }
  .export-actions {
    flex-direction: column;
  }
  .export-actions .btn {
    width: 100%;
  }
  .modal {
    padding: 24px;
    width: 95%;
  }
}
```

**Touch Optimizations:**
- Increase tap target sizes to minimum 44px × 44px
- Color picker: 56px × 56px (larger for finger accuracy)
- Shade swatches: min 80px × 80px tap area
- Buttons: min 44px height
- Add touch feedback (active state brightness change)

**Horizontal Scroll Prevention:**
- All containers: `overflow-x: hidden`
- Shade list: allow horizontal scroll if too many shades, or force wrap
- Code block: `overflow-x: auto` (allow horizontal scroll for long lines)

---

## 7. Visual Differentiation from uicolors.app

### 7.1 Theme: Dark vs Light

**uicolors.app:**
- Light theme default
- White backgrounds
- Dark text
- Colorful accent (varies)

**Our Version:**
- **Dark theme ONLY** (no light mode toggle)
- Background: `#0a0a0a` (near-black)
- White text
- Orange accent (`#e16105`)
- High-contrast, bold aesthetic

**Why Different:**
- Matches our brand (gamaleldien.com is dark-first)
- Stands out visually from competitors
- Modern, sophisticated feel
- Better for showcasing vibrant colors (colors pop on dark)

### 7.2 Typography: Clash Display vs Standard Sans

**uicolors.app:**
- Uses Inter or system fonts
- Standard web typography
- Mixed case, standard spacing

**Our Version:**
- **Clash Display** for ALL text (headings, labels, buttons, body)
- ALL CAPS for UI chrome (headings, buttons, labels)
- Wide letter-spacing (0.06em - 0.15em)
- Bold, assertive typography personality
- Monospace for code/values (SF Mono, Fira Code)

**Why Different:**
- Clash Display is our brand font
- UPPERCASE creates premium, technical feel
- Wide spacing = modern, spacious aesthetic
- Differentiation through typography choices

### 7.3 Component Styling

**uicolors.app:**
- Standard rounded corners (8px-12px)
- Minimal shadows
- Flat cards
- Simple borders

**Our Version:**
- **Extreme rounding** (`64px` pill buttons, `32px` cards)
- **Gradient borders** (pseudo-element `::before` technique)
- **Glass-morphism** (`backdrop-filter: blur(48px)`)
- **Deep shadows** (layered, dramatic depth)
- **Glow effects** (orange glow on primary CTAs)

**Examples:**

**Buttons:**
- uicolors.app: `border-radius: 8px`, flat background
- **Ours**: `border-radius: 64px`, gradient hover, glow shadow, lift animation

**Cards:**
- uicolors.app: Simple white card, subtle shadow
- **Ours**: Gradient border, backdrop blur, layered shadows, hover lift

**Inputs:**
- uicolors.app: Standard border, focus ring
- **Ours**: Rounded (14px), orange focus glow, dark background

### 7.4 Color Accent

**uicolors.app:**
- Uses blue/purple/variable accent
- Matches generated color sometimes
- Inconsistent branding

**Our Version:**
- **Orange (`#e16105`) ALWAYS**
- Never changes based on generated color
- Consistent brand identity throughout
- Orange = primary actions, active states, hover, glow

**Where Orange Appears:**
- Primary buttons
- Active tabs (preview, export)
- Hover states
- Links
- Focus states
- Palette indicator dots
- Accent text
- Locked shade indicators

### 7.5 Layout & Spacing

**uicolors.app:**
- Compact layout
- Standard spacing (16px, 24px)
- Dense information

**Our Version:**
- **Generous spacing** (32px-64px sections)
- **Clamp() fluid sizing** (scales smoothly from mobile to desktop)
- **Breathing room** (cards have large padding, wide gaps)
- **Section dividers** (with `//` symbols, uppercase labels)
- **Staggered animations** (cascading entrance effects)

**Visual Rhythm:**
- More vertical space between sections
- Larger padding inside cards
- Wider gaps in grids
- Creates luxurious, uncluttered feel

### 7.6 Animations & Transitions

**uicolors.app:**
- Minimal animations
- Fast transitions
- Functional, not decorative

**Our Version:**
- **Entrance animations** (`fadeIn`, `fadeInUp` with stagger)
- **Smooth transitions** (0.25s - 0.3s cubic-bezier easing)
- **Hover effects** (lift, scale, glow)
- **Flash animations** (copy confirmation, color changes)
- **Pulse effects** (palette indicators)

**Easing:**
- `cubic-bezier(0.4, 0, 0.2, 1)` — Material Design easing (smooth, professional)
- Consistent across all interactive elements

### 7.7 Export Formats

**uicolors.app:**
- Tailwind CSS (primary focus)
- CSS Variables
- Hex codes
- (Paid tiers for more formats)

**Our Version:**
- **Figma Variables** (DEFAULT, recommended with ★)
- CSS Variables
- Tailwind v3
- Tailwind v4 (OKLCH-based)
- OKLCH raw values
- JSON tokens
- **ALL FREE** (no paywalls)

**Why Different:**
- We prioritize Figma (design-first workflow)
- OKLCH support (modern color space)
- JSON tokens (W3C standard)
- All features free (competitive advantage)

### 7.8 Branding & Footer

**uicolors.app:**
- Minimal branding
- Generic footer
- Product Hunt badge

**Our Version:**
- **Strong branding** (Gamal Eldien logo, orange accent)
- **Footer**: "©2025 // MADE BY GAMAL ELDIEN // MORE TOOLS"
- **Uppercase, wide spacing** (consistent with brand)
- **Link to personal site** (gamaleldien.com)
- **Link to tools landing** (tools.gamaleldien.com)

**Brand Presence:**
- Logo always visible (navbar)
- Orange accent reinforces brand
- Footer credits designer (personal brand building)
- Professional, confident tone

---

## 8. Technical Implementation Notes

### 8.1 Color Space Conversions

**Required Functions:**
- `hexToOKLCH(hex)` — Convert hex to OKLCH
- `oklchToHex(oklch)` — Convert OKLCH to hex
- `hexToHSL(hex)` — Convert hex to HSL
- `hexToRGB(hex)` — Convert hex to RGB
- `rgbToHex(r, g, b)` — Convert RGB to hex

**Libraries:**
- Use **Culori** (https://culorjs.org/) for color conversions
- Lightweight, supports OKLCH, accurate conversions
- Installation: `npm install culori` or CDN

**Example:**
```javascript
import { converter, formatHex, formatHsl, formatRgb } from 'culori';

const oklch = converter('oklch');
const hex = converter('hex');

// Hex to OKLCH
const color = oklch('#3b82f6'); // { mode: 'oklch', l: 0.60, c: 0.18, h: 265 }

// OKLCH to Hex
const hexColor = formatHex(color); // '#3b82f6'

// Hex to HSL
const hslColor = formatHsl('#3b82f6'); // 'hsl(217, 91%, 60%)'
```

### 8.2 Shade Generation Algorithm

**Key Principles:**
1. Input color → Shade 500 (unchanged)
2. Lighter shades (50-400): Increase lightness, decrease chroma/saturation progressively
3. Darker shades (600-950): Decrease lightness, maintain chroma longer before reducing
4. Use OKLCH for perceptually uniform distribution
5. Ensure minimum contrast between adjacent shades (ΔE > 10)

**Lightness Curve:**
- Non-linear distribution (more steps in mid-range, fewer at extremes)
- Shade 50: L ≈ 0.97 (near-white)
- Shade 500: L = input (e.g., 0.60)
- Shade 950: L ≈ 0.25 (very dark, not pure black)

**Chroma Curve:**
- Lightest shades (50-200): Reduce chroma significantly (pastel effect)
- Mid shades (300-600): Maintain chroma (vibrant)
- Darkest shades (700-950): Slightly reduce chroma (avoid neon-dark effect)

**Hue:**
- Generally maintain hue across all shades
- Optional: slight hue shift for more natural gradients (e.g., warmer in lights, cooler in darks)

### 8.3 Manual Override & Lock Logic

**Data Structure:**
```javascript
const shades = {
  50: { color: '#eff6ff', locked: false, overridden: false },
  100: { color: '#dbeafe', locked: false, overridden: false },
  // ...
  500: { color: '#3b82f6', locked: false, overridden: false },
  // ...
  950: { color: '#172554', locked: false, overridden: false },
};
```

**Lock Behavior:**
- When locked: shade NEVER regenerates, even when primary color changes
- Lock entire scale: all shades locked
- Lock individual shade: only that shade locked
- Visual: yellow border, lock icon filled

**Override Behavior:**
- When user manually edits shade: `overridden = true`
- Overridden shades regenerate UNLESS locked
- Visual: blue border, "EDITED" badge
- Reset button: removes override, regenerates shade

**Regeneration Logic:**
```javascript
function regenerateShades(newPrimaryColor) {
  const generatedShades = generateShades(newPrimaryColor);
  
  Object.keys(shades).forEach(shadeNum => {
    if (!shades[shadeNum].locked) {
      if (!shades[shadeNum].overridden) {
        shades[shadeNum].color = generatedShades[shadeNum];
      } else {
        // Keep manual override, but could optionally regenerate if not locked
        // For now, keep overridden shades as-is unless explicitly unlocked
      }
    }
    // Locked shades never change
  });
}
```

### 8.4 State Management

**Global State:**
```javascript
const state = {
  primaryColor: '#3b82f6',
  primaryShades: { /* 50-950 */ },
  primaryScaleName: 'PRIMARY',
  primaryLocked: false,
  
  hasSecondary: false,
  secondaryColor: null,
  secondaryShades: { /* 50-950 */ },
  secondaryScaleName: 'SECONDARY',
  secondaryLocked: false,
  
  activePreviewTab: 'cards',
  activeExportFormat: 'figma',
};
```

**Persistence:**
- Use `localStorage` to save state
- On page load, restore previous state
- Debounce saves (don't save every keystroke, wait 500ms)

**State Updates:**
```javascript
function updateState(updates) {
  Object.assign(state, updates);
  saveToLocalStorage();
  renderUI();
  updatePreviewTabs();
  updateExportCode();
}
```

### 8.5 Performance Optimizations

**Debouncing:**
- Hex input: 300ms debounce before generating shades
- LocalStorage saves: 500ms debounce

**Virtual Scrolling:**
- If shade list becomes very long (future: custom shade counts), use virtual scrolling
- Current: 11 shades is small enough, no need

**Code Generation:**
- Generate export code on-demand (when tab clicked), not on every state change
- Cache generated code per format

**Animation Performance:**
- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left` (causes reflows)
- Use `will-change` sparingly on elements that frequently animate

**Image Optimization:**
- Preview tab images (logos, charts): use SVG where possible (scalable, small file size)
- If raster images needed, use WebP format, lazy load

### 8.6 Accessibility (a11y)

**Keyboard Navigation:**
- All interactive elements focusable (buttons, inputs, tabs)
- Focus visible (orange outline + glow)
- Logical tab order
- Keyboard shortcuts documented

**Screen Readers:**
- Semantic HTML (`<button>`, `<input>`, `<nav>`, `<main>`, `<footer>`)
- ARIA labels where needed (`aria-label`, `aria-describedby`)
- Live regions for toast notifications (`aria-live="polite"`)
- Alt text for icons/images

**Contrast:**
- All text meets WCAG AA (4.5:1 minimum)
- Interactive elements have sufficient contrast
- Focus indicators high-contrast

**Color Blindness:**
- Don't rely solely on color for information
- Use text labels, icons, patterns
- Provide alternative views (e.g., contrast ratio numbers, not just colors)

**Touch Targets:**
- Minimum 44px × 44px (mobile)
- Adequate spacing between tappable elements

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

---

## 9. File Structure

**Recommended Folder Structure:**
```
/shades/
├── index.html               # Main page
├── css/
│   ├── main.css            # Global styles, design system tokens
│   ├── components.css      # Component-specific styles
│   └── animations.css      # Keyframes, transitions
├── js/
│   ├── main.js             # App initialization, state
│   ├── shadeGenerator.js   # Shade generation algorithm
│   ├── colorUtils.js       # Color conversion functions
│   ├── ui.js               # UI rendering, interactions
│   ├── previewTabs.js      # Preview tab content generation
│   ├── exportFormats.js    # Export code generation
│   └── storage.js          # LocalStorage persistence
├── assets/
│   ├── fonts/              # Clash Display font files (if self-hosted)
│   └── images/             # Logo, icons (if any)
└── README.md               # Developer documentation
```

**Dependencies:**
- **Culori** (color conversions) — CDN or npm
- **Clash Display** (Google Fonts API or self-hosted)
- No heavy frameworks (vanilla JS or lightweight library like Alpine.js / Petite Vue)

---

## 10. Future Enhancements (V2)

**Not in initial version, but consider for future:**
1. **Save Palettes** (user accounts, saved color scales)
2. **Share URL** (encode state in URL, shareable links)
3. **Upload Custom Logo** (apply colors to user's SVG logo)
4. **Color Harmony Suggestions** (AI-powered complementary colors)
5. **Dark Mode Converter Integration** (link to existing tool)
6. **Multi-Scale Support** (3+ color scales, not just primary + secondary)
7. **Custom Shade Counts** (7-shade, 9-shade, 13-shade options)
8. **Accessibility Checker** (WCAG contrast matrix for all shade pairs)
9. **Export to Figma Plugin** (direct export, no manual copy-paste)
10. **Color Picker History** (recent colors used)

---

## 11. Success Metrics

**How to measure if this design is successful:**

**User Engagement:**
- Average session duration > 3 minutes
- Bounce rate < 40%
- Return visitor rate > 20%

**Feature Usage:**
- Export button clicks (most used format: Figma Variables)
- Preview tab switches (which tabs most popular?)
- Secondary color usage (% of sessions with secondary scale)
- Manual shade edits (% of users customizing shades)

**Technical:**
- Page load time < 2 seconds
- Time to first shade generation < 500ms
- No critical accessibility issues (WCAG AA compliance)

**Business:**
- Backlinks from design blogs, Twitter shares
- Inclusion in design tool roundups
- Traffic to main site (gamaleldien.com) from footer links

---

## 12. Design Handoff Checklist

**Before handing to developer:**

- [x] All sections wireframed
- [x] Component specs mapped to design system
- [x] Color tokens documented
- [x] Typography scale defined
- [x] Spacing/layout responsive patterns specified
- [x] Interactions described in detail
- [x] Preview tab content outlined
- [x] Export formats specified
- [x] Visual differentiation from competitors clear
- [x] Accessibility considerations noted
- [x] Performance optimization guidelines included
- [x] File structure recommended

**Developer should have:**
- This document (DESIGN-PLAN.md)
- Design system reference (DESIGN-SYSTEM.md)
- Research file (RESEARCH.md)
- Access to existing tools for pattern reference
- Culori library documentation
- Clash Display font files or CDN link

---

## 13. Final Notes

**Design Philosophy:**
This tool is NOT a clone of uicolors.app. It's a **reimagining** with our brand identity:
- **Dark, bold, sophisticated** (vs their light, friendly, accessible)
- **Clash Display typography** (vs Inter/system fonts)
- **Orange accent, glass-morphism, extreme rounding** (vs flat, minimal)
- **Figma-first workflow** (vs Tailwind-first)
- **ALL features free** (vs freemium paywall)

**Target Audience:**
- **Designers** using Figma, Tailwind, modern design tools
- **Developers** building design systems
- **Brand designers** creating color palettes
- **UX/UI professionals** needing quick shade scales

**Competitive Advantage:**
1. Dark theme (stands out visually)
2. Figma Variables as default export (design-first)
3. OKLCH support (modern color space)
4. Free, no paywall (accessible to everyone)
5. Strong branding (builds personal brand: Gamal Eldien)

**Key Differentiators:**
- **Aesthetic**: Dark, bold, premium vs light, friendly, accessible
- **Typography**: Uppercase, wide spacing, Clash Display vs standard web fonts
- **Components**: Glass-morphism, gradient borders, deep shadows vs flat cards
- **Brand**: Orange accent always vs variable/generated accent
- **Export**: Figma-first vs Tailwind-first

---

**This plan is ready to hand to the developer. Every section, component, interaction, and visual detail is specified. The developer should be able to build the entire tool using this document as the single source of truth.**

---

**Created by:** JO-Creative 🎨  
**Model:** Claude Sonnet 4.5  
**Agent Session:** agent:main:subagent:a02769a9-910d-41e5-bcb7-7774478dace4  
**Workspace:** `/root/clawd-creative`  
**Date:** 2025-01-31  
**Status:** ✅ COMPLETE — Ready for Development
