# Numeric Scale Generator - Implementation Plan

## Project Info
- **Tool Name:** Figma Numeric Scale Generator
- **URL:** https://tools.gamaleldien.com/numeric-scale
- **Status:** Planning
- **Created:** 2026-02-02
- **Owner:** Gamal Eldien

---

## 1. User Interface (HTML + CSS)

### Inputs:
- **Base Value** (number input, default: 8)
- **Number of Steps** (number input, default: 10)
- **Scale Type** (radio buttons):
  - Linear
  - Logarithmic (with ratio dropdown)
- **Logarithmic Ratios** (dropdown, shown only if Logarithmic selected):
  - Minor Third (1.2)
  - Major Third (1.25)
  - Perfect Fourth (1.333)
  - Perfect Fifth (1.5)
  - Golden Ratio (1.618)
  - Major Seventh (1.875)
  - Octave (2.0)
- **Collection Name** (text input, default: "scale")

### Preview Section:
- Live preview table showing generated values
- Updates in real-time as user changes inputs

### Actions:
- **Generate** button (updates preview)
- **Export Figma Variables** button (downloads JSON)

---

## 2. Design System (Consistency)

**✅ Must match all other tools:**
- **Font:** Clash Display (Fontshare CDN)
- **Colors:**
  - Background: `#0a0a0a` (dark), `#f5f5f5` (light)
  - Accent: `#e16105` (orange)
  - Text: `#ffffff`, `#808080`, `#999999` (dark mode)
  - Border: `#333333` (dark), `#e0e0e0` (light)
- **Border Radius:** 24px (default), 32px (large), 64px (pill)
- **Dark/Light Mode:** Toggle with localStorage persistence
- **Footer:** Unified footer from other tools
  - "Made by Gamal Eldien"
  - Behance + LinkedIn links
  - Emoji styling (`.emoji` span)
- **Responsive:** Mobile-friendly layout

---

## 3. Logic (JavaScript)

### Linear Scale:
```javascript
// Example: base=8, steps=10
// Output: [8, 16, 24, 32, 40, 48, 56, 64, 72, 80]
for (let i = 1; i <= steps; i++) {
  values[i] = base * i;
}
```

### Logarithmic Scale:
```javascript
// Example: base=8, ratio=1.5, steps=10
// Output: [8, 12, 18, 27, 40.5, ...]
for (let i = 0; i < steps; i++) {
  values[i+1] = Math.round(base * Math.pow(ratio, i) * 100) / 100;
}
```

### JSON Export Format:
```json
{
  "$extensions": {
    "com.figma.modeName": "Default"
  },
  "collection-name": {
    "1": {
      "$type": "number",
      "$value": 8,
      "$extensions": {
        "com.figma.scopes": ["ALL_SCOPES"],
        "com.figma.unit": "px"
      }
    },
    "2": { ... }
  }
}
```

---

## 4. Landing Page Integration

**Add card to landing page (`index.html`):**
- **Title:** Numeric Scale Generator
- **Description:** "Generate linear or logarithmic numeric scales for Figma variables"
- **Icon:** Numbers/scale icon
- **Link:** `/numeric-scale`
- **Position:** In grid with other tools

---

## 5. OG Image & Meta Tags

### OG Image:
- **Size:** 1200x630px
- **Design:** Python Pillow
  - Background: #0a0a0a
  - Title: "Numeric Scale Generator"
  - Subtitle: "Generate Figma numeric variables"
  - Accent: #e16105
  - Font: Clash Display
- **File:** `/numeric-scale/og-image.png`

### Meta Tags:
```html
<meta property="og:title" content="Numeric Scale Generator - Figma Variables">
<meta property="og:description" content="Generate linear or logarithmic numeric scales for Figma design tokens">
<meta property="og:image" content="https://tools.gamaleldien.com/numeric-scale/og-image.png">
<meta property="og:url" content="https://tools.gamaleldien.com/numeric-scale">
<meta name="twitter:card" content="summary_large_image">
```

---

## 6. Google Analytics

**Add GA tracking code:**
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-KSQ52DZN13"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-KSQ52DZN13');
</script>
```

---

## 7. File Structure

```
/root/clawd/projects/business/gamaleldien.com/tools/
├── index.html (landing page - add new card)
├── numeric-scale/
│   ├── PLAN.md (this file)
│   ├── index.html (tool page)
│   └── og-image.png (1200x630)
└── build-router.py (update routing)
```

---

## 8. Implementation Workflow

### Phase 1: Development (JO-DevOps)
1. ✅ Create project folder
2. ✅ Write PLAN.md
3. ✅ Create `index.html` (tool page)
4. ✅ Copy unified footer from existing tools
5. ✅ Implement scale generation logic
6. ✅ Add dark/light mode toggle
7. ✅ Test locally

### Phase 2: Design Refinement (JO-Creative)
8. ✅ Create MARKETING-PLAN.md
9. ✅ Create DESIGN-MODIFICATIONS.md
10. ✅ Create IMPLEMENTATION-PLAN.md
11. ⏳ Implement design modifications (refer to IMPLEMENTATION-PLAN.md)
12. ⏳ Enhance UI/UX based on DESIGN-MODIFICATIONS.md
13. ⏳ Add marketing elements and positioning

### Phase 3: Creative Assets (JO-Creative)
14. ⏳ Generate OG image with Pillow
15. ⏳ Add meta tags for social preview
16. ⏳ Update landing page card with icon

### Phase 4: Integration (JO-DevOps)
17. ⏳ Add Google Analytics
18. ⏳ Update `build-router.py` routing
19. ⏳ Deploy to Cloudflare Workers

### Phase 5: Security Review (JO-Creative)
20. ⏳ Review code for security issues
21. ⏳ Check CSP headers compatibility
22. ⏳ Verify no XSS vulnerabilities
23. ⏳ Test input validation

### Phase 6: Quality Assurance (JO-DevOps)
24. ⏳ Test all functionality post-security review
25. ⏳ Verify deployment on live URL
26. ⏳ Test OG preview (Telegram/Discord/Twitter)
27. ⏳ Verify Google Analytics tracking
28. ⏳ Test responsive design (mobile/tablet/desktop)
29. ⏳ Test dark/light mode toggle

### Phase 7: Version Control (JO-DevOps)
30. ⏳ Git add all new files
31. ⏳ Commit with descriptive message
32. ⏳ Push to GitHub
33. ⏳ Tag release (optional)

---

## 9. Testing Checklist

- [ ] Linear scale generation works correctly
- [ ] Logarithmic scale with all 7 ratios works
- [ ] Preview updates in real-time
- [ ] JSON export downloads correctly
- [ ] JSON format matches Figma Variables spec
- [ ] Dark/Light mode toggle works
- [ ] Footer links work (Behance, LinkedIn)
- [ ] Landing page card links to tool
- [ ] OG image displays correctly on social media
- [ ] Google Analytics tracks pageviews
- [ ] Responsive on mobile/tablet/desktop
- [ ] No console errors
- [ ] CSP headers don't block functionality

---

## 10. Live URLs

- **Tool:** https://tools.gamaleldien.com/numeric-scale
- **Landing:** https://tools.gamaleldien.com
- **OG Image:** https://tools.gamaleldien.com/numeric-scale/og-image.png

---

## 11. Dependencies

- **Cloudflare Account ID:** b6c05712bc4cb61fccdf5b7600845d03
- **Worker Name:** dark-mode-converter (handles all routing)
- **GA Tracking ID:** G-KSQ52DZN13
- **Font:** Clash Display (Fontshare CDN)
- **Design System:** Defined in existing tools

---

## 12. Notes

- Keep all logic client-side (no backend needed)
- Use same CSP headers as other tools
- Rounding to 2 decimal places for logarithmic values
- Default to Linear mode on page load
- Store last used settings in localStorage (optional enhancement)

---

**Status:** ✅ Plan approved, ready for development
**Next Step:** JO-DevOps implementation (Phase 1)
