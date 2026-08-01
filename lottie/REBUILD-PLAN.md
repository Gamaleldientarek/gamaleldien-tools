# Lottie Hub — Color Editor Rebuild Plan

**Date:** 2026-02-01  
**Issue:** Current color editing doesn't work at all — only preview works  
**Root Cause:** Wrong approach (global color swatches instead of layer-based editing)

---

## Problem Analysis

### What We Built (Wrong ❌)
- Global color extraction from entire JSON
- Display all colors as swatches
- Click swatch → change color globally
- No layer context

### What Competitors Do (Right ✅)

**LottieFiles Editor:**
- Layer panel (list all layers)
- Select layer → view properties
- Edit color in context of that layer
- Live preview
- Save/Export

**LottieLab Editor:**
- Layer-based editing
- Fill/Color property per layer
- Multiple fills support
- Color picker + Eye dropper
- Document colors (saved palettes)

---

## Correct Workflow

```
1. Upload Lottie JSON
   ↓
2. Display animation + Layer Panel (left side)
   ↓
3. Click on layer in panel
   ↓
4. Show layer properties (Fill, Stroke, Opacity, etc.)
   ↓
5. Edit color using color picker
   ↓
6. Live preview updates instantly
   ↓
7. Download edited JSON
```

---

## Required Changes

### 1. **Layer Extraction** (New Algorithm)
Instead of extracting colors globally, extract **layers** with their properties.

**Layer Object Structure:**
```javascript
{
  id: "layer_1",
  name: "Background",
  type: "shape", // shape, image, text, etc.
  properties: {
    fill: {
      type: "color",
      value: [1, 0.5, 0, 1], // RGBA 0-1
      hex: "#ff8000"
    },
    stroke: {
      type: "color",
      value: [0, 0, 0, 1],
      hex: "#000000"
    },
    opacity: 100
  },
  path: "layers[0].shapes[0].it[1].c.k" // JSON path for updates
}
```

### 2. **UI Redesign**

**New Layout:**
```
┌──────────────────────────────────────────────────────────┐
│                    ANIMATION PREVIEW                      │
│                   (centered, large)                       │
│                                                           │
│   ┌─────────────────────────────────────────────────┐   │
│   │                                                   │   │
│   │                 [ANIMATION]                       │   │
│   │                                                   │   │
│   └─────────────────────────────────────────────────┘   │
│                                                           │
│   [▶] [⏸] [⏹]          Speed: ──●──                     │
│                                                           │
├─────────────────┬────────────────────────────────────────┤
│  LAYERS         │  PROPERTIES                            │
│                 │                                        │
│  □ Background   │  // Fill Color //                     │
│  ✓ Circle       │  ┌────────────────────────┐           │
│  □ Logo         │  │ ██████ #FF8000         │           │
│  □ Text         │  │ [Color Picker]         │           │
│                 │  └────────────────────────┘           │
│                 │                                        │
│                 │  // Stroke Color //                   │
│                 │  ┌────────────────────────┐           │
│                 │  │ ██████ #000000         │           │
│                 │  │ [Color Picker]         │           │
│                 │  └────────────────────────┘           │
│                 │                                        │
│                 │  // Opacity //                        │
│                 │  ────●──── 100%                       │
│                 │                                        │
└─────────────────┴────────────────────────────────────────┘
│                                                           │
│  [DOWNLOAD EDITED JSON]                                  │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### 3. **New Functions Needed**

**A. Layer Parser**
```javascript
function extractLayers(animationData) {
  const layers = [];
  // Parse JSON recursively
  // Find all layers with fill/stroke properties
  // Build layer objects with paths
  return layers;
}
```

**B. Layer Selector**
```javascript
function selectLayer(layerId) {
  // Highlight selected layer
  // Display properties in right panel
  // Show color pickers
}
```

**C. Property Editor**
```javascript
function updateLayerProperty(layerId, property, value) {
  // Find layer in JSON using path
  // Update value
  // Refresh animation
  // Save to undo stack
}
```

**D. Live Preview Refresh**
```javascript
function refreshAnimation(animationId) {
  // Destroy old animation
  // Load updated JSON
  // Maintain playback position
}
```

---

## Implementation Plan

### Phase 1: Layer Extraction (Day 1)
- [ ] Write `extractLayers()` algorithm
- [ ] Test with sample Lottie files
- [ ] Handle edge cases (nested layers, groups, etc.)

### Phase 2: UI Rebuild (Day 2)
- [ ] Split layout: Preview (top) + Layers (left) + Properties (right)
- [ ] Build layer panel UI
- [ ] Build properties panel UI
- [ ] Add color pickers (native HTML5)

### Phase 3: Integration (Day 3)
- [ ] Connect layer selection to properties display
- [ ] Implement live color editing
- [ ] Implement undo/redo
- [ ] Test with real Lottie files

### Phase 4: Polish (Day 4)
- [ ] Add search/filter in layers panel
- [ ] Add "Hide layer" toggle
- [ ] Add "Lock layer" (prevent editing)
- [ ] Improve performance for large files

---

## Technical Challenges

### Challenge 1: Nested Layer Structures
**Problem:** Lottie JSON has deeply nested layers (groups within groups)  
**Solution:** Recursive traversal with parent-child relationships

### Challenge 2: Multiple Color Properties
**Problem:** One layer can have multiple fills, strokes, gradients  
**Solution:** List all color properties separately per layer

### Challenge 3: Keyframed Colors
**Problem:** Animated colors (keyframes) vs static colors  
**Solution:** 
- Static: `c.k = [r, g, b, a]`
- Animated: `c.k = [{t, s: [r,g,b,a]}, ...]`
- Handle both cases

### Challenge 4: Performance
**Problem:** Large animations with 100+ layers  
**Solution:** Virtual scrolling in layers panel, lazy rendering

---

## Success Metrics

✅ **Must Have:**
- [ ] Upload Lottie → see layer list
- [ ] Select layer → see properties
- [ ] Edit color → animation updates instantly
- [ ] Download edited JSON → works in other players

✅ **Nice to Have:**
- [ ] Hide/show layers
- [ ] Search layers by name
- [ ] Eye dropper tool
- [ ] Document colors (saved palette)

---

## Estimated Effort

| Phase | Hours | Days |
|-------|-------|------|
| Layer Extraction | 6-8 | 1 |
| UI Rebuild | 8-10 | 1-2 |
| Integration | 6-8 | 1 |
| Polish | 4-6 | 0.5-1 |
| **Total** | **24-32** | **3-4** |

---

## Decision Required from Jimmy

**Option A: Full Rebuild (Recommended)**
- Rebuild entire color editor with layer-based approach
- Matches industry standards (LottieFiles, LottieLab)
- Takes 3-4 days of focused work
- Delivers professional-grade tool

**Option B: Simplified Version**
- Keep current preview-only mode
- Add basic "find & replace color" feature
- Quick hack (1 day)
- Doesn't match competitors

**Option C: Abandon Color Editing**
- Remove color editing entirely
- Focus only on preview (what currently works)
- Immediate (0 days)
- Loses competitive advantage

---

**Recommendation:** Option A (Full Rebuild)

**Why?** 
- Color editing is the #1 differentiator for this tool
- Current approach doesn't work and can't be salvaged
- Rebuild aligns with what users expect (based on LottieFiles/LottieLab)
- Investment pays off in lead generation + brand credibility

---

**Next Step:** Wait for Jimmy's approval on Option A, then start Phase 1.

---

_📊 **Model:** Claude Opus 4.5 (Anthropic) | **Agent:** Joo | **Session:** Main | **Folder:** /root/clawd_
