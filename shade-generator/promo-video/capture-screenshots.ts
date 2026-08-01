/**
 * Playwright Screenshot Capture
 * Captures high-quality screenshots of the tool in different states
 * Resolution: 1920x1080 (16:9 landscape)
 */

import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const TOOL_URL = 'https://tools.gamaleldien.com/shades';
const OUTPUT_DIR = path.join(__dirname, 'public', 'screenshots');
const VIEWPORT = { width: 1920, height: 1080 };

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('📸 Starting screenshot capture...\n');
  
  const browser = await chromium.launch({
    headless: true, // Running in server environment without display
  });
  
  const page = await browser.newPage({
    viewport: VIEWPORT,
  });
  
  try {
    // Load the tool
    console.log('Loading tool...');
    await page.goto(TOOL_URL, { waitUntil: 'networkidle' });
    await wait(2000);
    
    // Screenshot 1: Initial state with default color
    console.log('📸 1. Initial state (default color)');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '01-initial.png'),
      fullPage: false,
    });
    
    // Screenshot 2: After typing hex code
    console.log('📸 2. After hex input (#3B82F6)');
    const hexInput = page.locator('input[type="text"]').first();
    await hexInput.clear();
    await hexInput.fill('#3B82F6');
    await wait(1000);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '02-hex-blue.png'),
    });
    
    // Screenshot 3: Random color 1 (spacebar)
    console.log('📸 3. Random color 1');
    await page.keyboard.press('Space');
    await wait(800);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '03-random-1.png'),
    });
    
    // Screenshot 4: Random color 2
    console.log('📸 4. Random color 2');
    await page.keyboard.press('Space');
    await wait(800);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '04-random-2.png'),
    });
    
    // Screenshot 5: Preview section (Cards carousel) - light theme
    console.log('📸 5. Preview section - Cards (light theme)');
    const previewHeading = page.locator('text=PREVIEW').first();
    await previewHeading.scrollIntoViewIfNeeded();
    await wait(1500);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '05-preview-cards-light.png'),
    });
    
    // Screenshot 6: Components tab
    console.log('📸 6. Components tab');
    const componentsTab = page.getByRole('button', { name: /components/i }).first();
    if (await componentsTab.isVisible()) {
      await componentsTab.click();
      await wait(1000);
    }
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '06-components-light.png'),
    });
    
    // Screenshot 7: Switch to dark theme
    console.log('📸 7. Switching to dark theme');
    await page.keyboard.press('Home'); // Scroll to top
    await wait(500);
    
    const themeToggle = page.locator('button').filter({ hasText: /theme|dark|light/i }).first();
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
    } else {
      // Try finding by aria-label or title
      const toggleBtn = page.locator('button[aria-label*="theme"], button[title*="theme"]').first();
      await toggleBtn.click();
    }
    await wait(800);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '07-dark-theme.png'),
    });
    
    // Screenshot 8: Charts tab in dark theme
    console.log('📸 8. Charts tab (dark theme)');
    const previewSection = page.locator('text=PREVIEW').first();
    await previewSection.scrollIntoViewIfNeeded();
    await wait(500);
    
    const chartsTab = page.getByRole('button', { name: /charts/i }).first();
    if (await chartsTab.isVisible()) {
      await chartsTab.click();
      await wait(1500); // Let chart animations play
    }
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '08-charts-dark.png'),
    });
    
    // Screenshot 9: Export section - Figma Variables
    console.log('📸 9. Export section - Figma Variables');
    // Scroll to bottom of page where export section should be
    await page.keyboard.press('End');
    await wait(1000);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '09-export-figma.png'),
    });
    
    // Screenshot 10: Tailwind v4 export (try to find and click)
    console.log('📸 10. Tailwind v4 export');
    try {
      const tailwindTab = page.locator('button').filter({ hasText: /tailwind/i }).first();
      if (await tailwindTab.isVisible({ timeout: 5000 })) {
        await tailwindTab.click();
        await wait(500);
        await page.screenshot({
          path: path.join(OUTPUT_DIR, '10-export-tailwind.png'),
        });
      }
    } catch (e) {
      console.log('   ⚠️  Tailwind tab not found, skipping');
    }
    
    // Screenshot 11: CSS Variables export
    console.log('📸 11. CSS Variables export');
    try {
      const cssTab = page.locator('button').filter({ hasText: /css/i }).first();
      if (await cssTab.isVisible({ timeout: 5000 })) {
        await cssTab.click();
        await wait(500);
        await page.screenshot({
          path: path.join(OUTPUT_DIR, '11-export-css.png'),
        });
      }
    } catch (e) {
      console.log('   ⚠️  CSS tab not found, skipping');
    }
    
    console.log('\n✅ All screenshots captured successfully!');
    console.log(`📁 Screenshots saved to: ${OUTPUT_DIR}`);
    
  } catch (error) {
    console.error('❌ Screenshot capture failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

main();
