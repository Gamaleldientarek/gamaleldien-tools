const { chromium } = require('playwright');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, 'public', 'screenshots-v3');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Go to the tool
  await page.goto('https://tools.gamaleldien.com/shades', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 1. Initial state - light theme with default color
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01-hero-light.png') });
  console.log('✅ 01 - Hero light');

  // 2. Type a vibrant blue color
  const hexInput = page.locator('input[type="text"]').first();
  await hexInput.click();
  await hexInput.fill('#3B82F6');
  await hexInput.press('Enter');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02-blue-palette.png') });
  console.log('✅ 02 - Blue palette');

  // 3. Generate random color 
  await page.keyboard.press('Space');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03-random-1.png') });
  console.log('✅ 03 - Random 1');

  // 4. Another random
  await page.keyboard.press('Space');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04-random-2.png') });
  console.log('✅ 04 - Random 2');

  // 5. Scroll to preview section
  await page.evaluate(() => {
    const preview = document.querySelector('[id*="preview"], h2, .preview-section');
    if (preview) preview.scrollIntoView({ behavior: 'instant', block: 'start' });
    else window.scrollTo(0, 900);
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05-preview-cards.png') });
  console.log('✅ 05 - Preview cards');

  // 6. Scroll more to see components/charts
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06-preview-more.png') });
  console.log('✅ 06 - Preview more');

  // 7. Switch to dark mode
  const themeBtn = page.locator('button').filter({ hasText: /☀|☽|🌙|sun|moon/i }).first();
  try {
    await themeBtn.click();
  } catch {
    // Try clicking any theme toggle button in navbar
    await page.evaluate(() => {
      const btns = document.querySelectorAll('nav button, .navbar button');
      for (const b of btns) {
        if (b.textContent.includes('☀') || b.textContent.includes('☽') || b.innerHTML.includes('sun') || b.innerHTML.includes('moon')) {
          b.click(); break;
        }
      }
    });
  }
  await page.waitForTimeout(1000);
  
  // Scroll back to top for dark mode hero
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07-dark-hero.png') });
  console.log('✅ 07 - Dark hero');

  // 8. Dark mode - scroll to shades
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08-dark-shades.png') });
  console.log('✅ 08 - Dark shades');

  // 9. Dark mode - scroll to preview
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09-dark-preview.png') });
  console.log('✅ 09 - Dark preview');

  // 10. Scroll to export section
  await page.evaluate(() => {
    const exportSection = document.querySelector('[id*="export"], .export-section');
    if (exportSection) exportSection.scrollIntoView({ behavior: 'instant', block: 'start' });
    else window.scrollTo(0, document.body.scrollHeight - 1200);
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10-export-section.png') });
  console.log('✅ 10 - Export section');

  // 11. Scroll to bottom / more export
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '11-export-code.png') });
  console.log('✅ 11 - Export code');

  await browser.close();
  console.log('\n🎉 All screenshots captured!');
})();
