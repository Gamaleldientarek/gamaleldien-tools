/**
 * Playwright Screen Recording Script
 * Records the REAL tool UI for authentic promo video footage
 * Resolution: 1920x1080 (16:9 landscape)
 */

import { chromium, type Page } from 'playwright';
import path from 'path';
import fs from 'fs';

const TOOL_URL = 'https://tools.gamaleldien.com/shades';
const OUTPUT_DIR = path.join(__dirname, 'recordings');
const VIEWPORT = { width: 1920, height: 1080 };

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function recordScene1_Hook(page: Page) {
  console.log('📹 Recording Scene 1: Hook (hex input → shade explosion)');
  
  // Navigate fresh
  await page.goto(TOOL_URL, { waitUntil: 'networkidle' });
  await wait(2000); // Let page load completely and animations settle
  
  // Type hex code slowly (character by character)
  const hexInput = page.locator('input[type="text"]').first();
  await hexInput.clear();
  await wait(300);
  await hexInput.type('#3B82F6', { delay: 200 }); // 200ms per character
  
  await wait(1500); // Let the shade scale render and settle with animations
  
  console.log('✅ Scene 1 recorded');
}

async function recordScene2_Speed(page: Page) {
  console.log('📹 Recording Scene 2: Speed (spacebar random generation)');
  
  // Ensure we're in light theme for this scene
  const themeToggle = page.locator('button[aria-label*="theme"], button[title*="theme"]').first();
  const body = page.locator('body');
  const isDark = await body.evaluate((el) => el.classList.contains('dark-theme'));
  
  if (isDark) {
    await themeToggle.click();
    await wait(500);
  }
  
  // Focus on the page to enable keyboard shortcuts
  await page.keyboard.press('Tab');
  
  // Hit spacebar 3 times with pauses to show random generation
  await wait(500);
  await page.keyboard.press('Space');
  await wait(1200);
  
  await page.keyboard.press('Space');
  await wait(1200);
  
  await page.keyboard.press('Space');
  await wait(1500);
  
  console.log('✅ Scene 2 recorded');
}

async function recordScene3_Depth(page: Page) {
  console.log('📹 Recording Scene 3: Depth (preview carousel + components)');
  
  // Scroll to preview section
  const previewSection = page.locator('text=PREVIEW YOUR COLORS').first();
  await previewSection.scrollIntoViewIfNeeded();
  await wait(1000);
  
  // Let carousel animate for a bit
  await wait(2000);
  
  // Hover over a card to show tooltip
  const card = page.locator('.preview-card').first();
  await card.hover();
  await wait(1500);
  
  // Click Components tab
  const componentsTab = page.locator('text=Components, button:has-text("Components")').first();
  await componentsTab.click();
  await wait(2000);
  
  console.log('✅ Scene 3 recorded');
}

async function recordScene4_Power(page: Page) {
  console.log('📹 Recording Scene 4: Power (theme toggle + charts)');
  
  // Toggle to dark theme
  const themeToggle = page.locator('button[aria-label*="theme"], button[title*="theme"]').first();
  await themeToggle.click();
  await wait(1000); // Let theme transition complete
  
  // Click Charts tab
  const chartsTab = page.locator('text=Charts, button:has-text("Charts")').first();
  await chartsTab.click();
  await wait(2000); // Let charts animations play
  
  console.log('✅ Scene 4 recorded');
}

async function recordScene5_Workflow(page: Page) {
  console.log('📹 Recording Scene 5: Workflow (export system)');
  
  // Scroll to export section
  const exportSection = page.locator('text=EXPORT').first();
  await exportSection.scrollIntoViewIfNeeded();
  await wait(500);
  
  // Cycle through export tabs
  const tabs = [
    'Figma Variables',
    'Tailwind v4',
    'CSS Variables',
    'Figma Variables', // Return to Figma
  ];
  
  for (const tabName of tabs) {
    const tab = page.locator(`button:has-text("${tabName}")`).first();
    await tab.click();
    await wait(800);
  }
  
  // Click copy button
  const copyBtn = page.locator('button:has-text("COPY")').first();
  await copyBtn.click();
  await wait(1000); // Show toast
  
  // Click download button
  const downloadBtn = page.locator('button:has-text("DOWNLOAD")').first();
  await downloadBtn.click();
  await wait(1000);
  
  console.log('✅ Scene 5 recorded');
}

async function main() {
  console.log('🚀 Starting Playwright screen recording...\n');
  
  const browser = await chromium.launch({
    headless: false, // Show browser so we can see what's happening
  });
  
  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: {
      dir: OUTPUT_DIR,
      size: VIEWPORT,
    },
  });
  
  const page = await context.newPage();
  
  try {
    // Record all scenes in sequence
    await recordScene1_Hook(page);
    await recordScene2_Speed(page);
    await recordScene3_Depth(page);
    await recordScene4_Power(page);
    await recordScene5_Workflow(page);
    
    console.log('\n✅ All scenes recorded successfully!');
    console.log(`📁 Video will be saved when context closes...`);
    
  } catch (error) {
    console.error('❌ Recording failed:', error);
  } finally {
    await wait(1000); // Give time for final frames
    await context.close(); // This saves the video
    await browser.close();
    
    // The video is saved automatically by Playwright
    console.log(`\n📁 Recording saved to: ${OUTPUT_DIR}`);
    console.log('🎬 Video file will have a generated name. Rename it to "tool-recording.webm"');
  }
}

main();
