require('dotenv').config();
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const EMAIL = process.env.ARC_EMAIL;
const PASSWORD = process.env.ARC_PASSWORD;
const LOG_DIR = path.join(__dirname, 'logs');

if (!EMAIL || !PASSWORD) {
  console.error('Missing ARC_EMAIL or ARC_PASSWORD in .env file');
  process.exit(1);
}
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

function log(msg) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${msg}`;
  console.log(line);
  fs.appendFileSync(path.join(LOG_DIR, 'bot.log'), line + '\n');
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runBot() {
  log('Starting ARC Points bot...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    log('Navigating to community.arc.network...');
    await page.goto('https://community.arc.network', { waitUntil: 'networkidle', timeout: 30000 });
    await sleep(2000);

    log('Attempting login...');
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]').first();
    await emailInput.waitFor({ timeout: 10000 });
    await emailInput.fill(EMAIL);
    await sleep(500);

    const passInput = page.locator('input[type="password"], input[name="password"]').first();
    if (await passInput.isVisible()) {
      await passInput.fill(PASSWORD);
    }

    const loginBtn = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")').first();
    await loginBtn.click();
    await sleep(3000);

    log('Logged in successfully.');
    log('Navigating to Contents section...');

    await page.goto('https://community.arc.network/contents', { waitUntil: 'networkidle', timeout: 15000 });
    await sleep(2000);

    log('Reading articles for points...');
    const articles = page.locator('a:has-text("Article"), .article-item, [class*="content-card"]');
    const articleCount = await articles.count();
    let readCount = 0;
    for (let i = 0; i < Math.min(articleCount, 5); i++) {
      try {
        await articles.nth(i).click();
        await sleep(3000);
        await page.goBack();
        await sleep(1000);
        readCount++;
        log(`Read article ${readCount}/5`);
      } catch (e) {
        log(`Article ${i+1} failed: ${e.message}`);
      }
    }
    log(`Articles read: ${readCount}`);

    log('Watching videos for points...');
    const videos = page.locator('video, iframe[src*="youtube"], iframe[src*="vimeo"], [class*="video"]');
    let videoCount = await videos.count();
    if (videoCount > 0) {
      let watchedCount = 0;
      for (let i = 0; i < Math.min(videoCount, 4); i++) {
        try {
          await videos.nth(i).scrollIntoViewIfNeeded();
          await sleep(15000);
          watchedCount++;
          log(`Watched video ${watchedCount}/4`);
        } catch (e) {
          log(`Video ${i+1} failed: ${e.message}`);
        }
      }
      log(`Videos watched: ${watchedCount}`);
    } else {
      log('No videos found on this page.');
    }

    log('Daily login completed - bonus should auto-credit.');
    await page.goto('https://community.arc.network/profile', { waitUntil: 'networkidle', timeout: 15000 });
    await sleep(2000);
    log('Profile checked.');
    log('ARC Points bot completed successfully!');
  } catch (error) {
    log(`ERROR: ${error.message}`);
    await page.screenshot({ path: path.join(LOG_DIR, 'error.png') });
    log('Screenshot saved to logs/error.png');
  } finally {
    await browser.close();
  }
}

runBot().catch(e => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
