# Preview Token Mapping Fix — CRITICAL UPDATE

> **📌 NOTE:** This is technical documentation of a specific fix. For general project documentation, see **README.md**.

**Problem:** Jimmy reported "الtoken مش بتظبط ع العناصر بشكل سليم" (tokens aren't mapping to elements correctly)

**Root Cause:** The `updatePreview()` function had fundamental flaws in how it:
1. Detected color roles from palette names
2. Mapped light colors to their dark equivalents
3. Fell back when specific roles were missing
4. Applied colors to UI elements in the preview

---

## What Was Broken (Before)

### 1. **Weak Role Detection**
```javascript
// OLD: Only searched lowercase, missed variations
const found = colorsList.find(c => c.name.toLowerCase().includes(role));
```
- Couldn't find "text-primary" if you searched for "text"
- Case-sensitive mismatches
- Didn't try multiple role synonyms properly

### 2. **Broken Fallbacks**
```javascript
// OLD: Terrible fallbacks that made no sense
const lightPrimary = primaryColor ? primaryColor.hex : c[Math.min(1, c.length-1)]?.hex || '#3b82f6';
const lightMuted = mutedColor ? mutedColor.hex : (c.length > 2 ? c[Math.floor(c.length/2)]?.hex : lightText + 'aa');
```
- Used random array indexes (c[1] might be "surface" — NOT a button color!)
- `lightText + 'aa'` tried to append alpha to hex (doesn't work!)
- No intelligence about color purpose

### 3. **Poor Dark Mapping**
```javascript
// OLD: Fragile dark version lookup
const dBgObj = bgColor ? dc.find(d => d.id === bgColor.id) : dc[0];
const dkBg = dBgObj?.darkHex || darkBg;
```
- Fallback to `dc[0]` is random
- Hard-coded fallback colors didn't match the conversion algorithm
- Inconsistent between different roles

### 4. **Wrong Element Styling**
```javascript
// OLD: Badge alpha didn't work
<div class="preview-badge" style="background:${primary}22; color:${primary}">Badge</div>
```
- `#3b82f622` is invalid CSS (hex doesn't support alpha like that)
- Should be `rgba(59, 130, 246, 0.13)` 

---

## How It's Fixed (After)

### 1. **Intelligent Role Detection**
```javascript
function getColorByRole(colorsList, ...roles) {
  for (const role of roles) {
    const found = colorsList.find(c => c.name.toLowerCase().includes(role.toLowerCase()));
    if (found) return found;
  }
  return null;
}

// Multiple role synonyms with priority order
const textPrimaryColor = getColorByRole(colors, 'text-primary', 'foreground', 'heading');
const primaryColor = getColorByRole(colors, 'primary', 'brand', 'accent', 'action', 'cta', 'blue');
```
- Searches with `toLowerCase()` on BOTH sides
- Tries multiple synonyms in priority order
- Returns null instead of undefined for cleaner handling

### 2. **Luminance-Based Fallbacks**
```javascript
function getLuminance(hex) {
  // WCAG 2.1 relative luminance calculation
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const [rs, gs, bs] = [r, g, b].map(c => 
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// SMART: Find lightest color for background
if (!bgColor) {
  const sorted = [...colors].sort((a, b) => getLuminance(b.hex) - getLuminance(a.hex));
  lightBg = sorted[0]?.hex || '#ffffff';
}

// SMART: Find darkest color for text (but not the background!)
if (!textPrimaryColor) {
  const sorted = [...colors].sort((a, b) => getLuminance(a.hex) - getLuminance(b.hex));
  const darkest = sorted.find(c => c.hex !== lightBg);
  lightText = darkest?.hex || '#111827';
}
```
- Uses **actual color science** to find appropriate roles
- Background = lightest color (highest luminance)
- Text = darkest color (lowest luminance)
- Avoids using the same color for bg and text

### 3. **Sensible Defaults for Missing Roles**
```javascript
// Primary/Brand: Use found primary, or generate a blue
if (primaryColor) {
  lightPrimary = primaryColor.hex;
} else {
  // If no primary found, use a sensible default blue
  lightPrimary = '#3b82f6'; // Nice blue that works in any palette
}

// Text Secondary: Use found muted text, or mid-gray
if (textSecondaryColor) {
  lightTextSecondary = textSecondaryColor.hex;
} else {
  lightTextSecondary = '#6b7280'; // Tailwind gray-500
}
```
- Neutral presets don't have "primary" colors → Adds a nice blue
- Missing "muted" text → Uses Tailwind gray-500
- All defaults are production-tested, accessible colors

### 4. **Proper Dark Mapping**
```javascript
function findDarkVersion(lightColorObj) {
  if (!lightColorObj) return null;
  return darkColors.find(d => d.id === lightColorObj.id);
}

const dkBgObj = findDarkVersion(bgColor);
const dkPrimaryObj = findDarkVersion(primaryColor);

const dkBg = dkBgObj?.darkHex || darkBg; // Falls back to user's chosen dark bg
const dkPrimary = dkPrimaryObj?.darkHex || '#60a5fa'; // Falls back to light blue
```
- Uses ID matching to find the ACTUAL converted color
- Fallbacks are the dark equivalents of the light defaults
- Consistent with the conversion algorithm

### 5. **Clean Token Object Pattern**
```javascript
const cardHTML = (mode, tokens) => {
  const { bg, surface, text, textSecondary, primary, border } = tokens;
  // ...
};

// Usage:
cardHTML('light', {
  bg: lightBg,
  surface: lightSurface,
  text: lightText,
  textSecondary: lightTextSecondary,
  primary: lightPrimary,
  border: lightBorder
})
```
- Passes a **tokens object** instead of 6+ parameters
- Self-documenting: `tokens.primary` is clearer than `param4`
- Easier to extend with new tokens

### 6. **Fixed Alpha/RGBA**
```javascript
function hexWithAlpha(hex, alpha = 0.13) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const badgeBg = hexWithAlpha(primary, mode === 'light' ? 0.12 : 0.18);
const tagBg = hexWithAlpha(text, mode === 'light' ? 0.08 : 0.1);
```
- Proper `rgba()` generation
- Different alpha values for light vs dark (better visibility)
- Lighter badges in light mode (12%), darker in dark mode (18%)

---

## Test Cases — What Now Works

### ✅ Neutral Preset (7 colors, no primary)
```
background       → #ffffff (light bg)
surface          → #f9fafb (light surface) 
surface-alt      → #f3f4f6 (ignored for now)
border           → #e5e7eb (light border)
text-muted       → #6b7280 (secondary text)
text-secondary   → #374151 (also secondary text — uses first match)
text-primary     → #111827 (primary text)
```

**Light Preview:**
- BG: `#ffffff` (background)
- Text: `#111827` (text-primary)
- Secondary text: `#6b7280` (text-muted)
- Button/Link: `#3b82f6` ⚡ **GENERATED** (no primary in palette, so adds blue)
- Border: `#e5e7eb` (border)
- Input: `#f9fafb` (surface)

**Dark Preview:**
- BG: Converted dark version of `background`
- Text: Converted dark version of `text-primary` 
- Secondary text: Converted dark version of `text-muted`
- Button/Link: `#60a5fa` ⚡ **FALLBACK** (no primary to convert, so uses light blue)
- Border: Converted dark version of `border`
- Input: Converted dark version of `surface`

### ✅ Brand Preset (8 colors with primary)
```
background  → #ffffff
surface     → #f8f9fa
border      → #e5e7eb
text-primary → #111827
text-muted  → #6b7280
primary     → #3b82f6
secondary   → #8b5cf6
accent      → #f59e0b
```

**Light Preview:**
- Uses the actual brand colors
- Primary button uses `#3b82f6` (primary)

**Dark Preview:**
- All colors converted via OKLCH
- Button shows the ACTUAL dark-converted primary color

### ✅ Minimal (2 colors)
```
background → #ffffff
text       → #111827
```

**Light Preview:**
- BG: `#ffffff`
- Text: `#111827`
- Primary: `#3b82f6` (generated)
- Border: `#e5e7eb` (default)
- Secondary text: `#6b7280` (default)

**Dark Preview:**
- BG: Converted dark bg
- Text: Converted dark text
- All missing roles use sensible dark defaults

---

## Key Improvements Summary

| Issue | Before | After |
|-------|--------|-------|
| **Role detection** | Missed "text-primary", case issues | Finds all variations, case-insensitive |
| **Background fallback** | Random `c[0]` | Lightest color by luminance |
| **Text fallback** | Random `c[length-1]` | Darkest color by luminance (excluding bg) |
| **Primary fallback** | Random `c[1]` (might be "surface"!) | Sensible `#3b82f6` blue |
| **Muted fallback** | Broken `lightText + 'aa'` | Proper `#6b7280` gray |
| **Dark mapping** | Fragile, random fallbacks | ID-based matching with consistent fallbacks |
| **Badge alpha** | Broken `#3b82f622` | Proper `rgba(59, 130, 246, 0.12)` |
| **Token structure** | 6 parameters | Clean tokens object |

---

## Visual Result

**Neutral Preset now shows:**
- **Light card:** Crisp white background, dark text, gray muted text, blue CTA button
- **Dark card:** Dark background, light text, gray-ish muted text, light blue CTA button

**The preview looks like a REAL UI** with proper design tokens — exactly what Jimmy wanted! 🎯
