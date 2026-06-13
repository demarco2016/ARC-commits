require('dotenv').config();
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const EMAIL = process.env.ARC_EMAIL;
const PASSWORD = process.env.ARC_PASSWORD;
const PROXY_URL = process.env.ARC_PROXY || '';
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const SESSION_FILE = process.env.ARC_SESSION_FILE || path.join(__dirname, 'session.json');
const LOG_DIR = path.join(__dirname, 'logs');
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

if (!EMAIL || !PASSWORD) {
  console.error('Missing ARC_EMAIL or ARC_PASSWORD in .env file');
  process.exit(1);
}
for (const dir of [LOG_DIR, SCREENSHOT_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function log(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}`;
  console.log(line);
  fs.appendFileSync(path.join(LOG_DIR, 'bot.log'), line + '\n');
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function humanDelay(min, max) {
  await sleep(randomBetween(min, max));
}

async function sendTelegram(msg) {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    const https = require('https');
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    const data = JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg.slice(0, 4096) });
    await new Promise((resolve, reject) => {
      const req = https.request(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
      }, res => {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => body.includes('"ok":true') ? resolve() : reject(new Error(body)));
      });
      req.on('error', reject);
      req.write(data);
      req.end();
    });
    log('Telegram notification sent');
  } catch (e) {
    log(`Telegram send failed: ${e.message}`);
  }
}

async function extractPointBalance(page) {
  try {
    const text = await page.locator('[class*="point"], [class*="score"], [class*="badge"], .user-points, [data-points]').first().textContent({ timeout: 5000 });
    const match = text && text.match(/\d[\d,.]*/);
    return match ? match[0].replace(/,/g, '') : 'N/A';
  } catch {
    return 'N/A';
  }
}

async function runBot() {
  const sessionId = Date.now().toString(36);
  log(`Session ${sessionId} started`);

  const launchOpts = {
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-dev-shm-usage'
    ]
  };

  if (PROXY_URL) {
    launchOpts.args.push(`--proxy-server=${PROXY_URL}`);
    log(`Using proxy: ${PROXY_URL.replace(/\/\/.*@/, '//***@')}`);
  }

  const browser = await chromium.launch(launchOpts);
  const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';
  const viewport = { width: randomBetween(1280, 1440), height: randomBetween(720, 900) };

  const context = await browser.newContext({
    userAgent: UA,
    viewport,
    locale: 'en-US',
    timezoneId: 'America/New_York',
    colorScheme: 'light',
    deviceScaleFactor: 1,
    hasTouch: false,
    isMobile: false
  });

  if (fs.existsSync(SESSION_FILE)) {
    try {
      const sessionData = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8'));
      await context.addCookies(sessionData.cookies);
      log('Session restored from file');
    } catch (e) {
      log(`Session restore failed: ${e.message}`);
    }
  }

  const page = await context.newPage();
  let pointsBefore = 'N/A';
  let pointsAfter = 'N/A';
  let summary = { articles: 0, videos: 0, errors: [] };

  try {
    log('Navigating to community.arc.network...');
    await page.goto('https://community.arc.network', { waitUntil: 'networkidle', timeout: 45000 });
    await humanDelay(2000, 4000);

    const currentUrl = page.url();
    const needsLogin = currentUrl.includes('login') || currentUrl.includes('signin') || currentUrl.includes('auth');

    if (needsLogin) {
      log('Login page detected, authenticating...');
      await humanDelay(1000, 2000);

      const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"], input[autocomplete="email"]').first();
      await emailInput.waitFor({ timeout: 15000 });
      await emailInput.click();
      await humanDelay(300, 700);
      await emailInput.fill(EMAIL);
      await humanDelay(800, 1500);

      const passInput = page.locator('input[type="password"], input[name="password"], input[autocomplete="current-password"]').first();
      if (await passInput.isVisible()) {
        await passInput.click();
        await humanDelay(200, 500);
        await passInput.fill(PASSWORD);
        await humanDelay(500, 1000);
      }

      const loginBtn = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login"), button:has-text("Log in")').first();
      await loginBtn.click();
      await humanDelay(3000, 5000);

      if (page.url().includes('login') || page.url().includes('signin')) {
        throw new Error('Login failed - still on login page');
      }
      log('Login successful');
    } else {
      log('Already authenticated via session');
    }

    await page.goto('https://community.arc.network/profile', { waitUntil: 'networkidle', timeout: 20000 });
    await humanDelay(2000, 3000);
    pointsBefore = await extractPointBalance(page);
    log(`Points before: ${pointsBefore}`);

    await page.goto('https://community.arc.network/contents', { waitUntil: 'networkidle', timeout: 20000 });
    await humanDelay(2000, 3000);

    log('Reading articles for points...');
    const selectors = [
      'a[href*="/article"]',
      'a[href*="/content"]',
      '[class*="content-card"]',
      '[class*="article"]',
      '.card a[href]',
      'main a[href]'
    ];
    let articleLinks = [];
    for (const sel of selectors) {
      const els = await page.locator(sel).all();
      for (const el of els) {
        const href = await el.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('javascript') && !articleLinks.includes(href)) {
          articleLinks.push(href);
        }
      }
      if (articleLinks.length >= 5) break;
    }

    for (let i = 0; i < Math.min(articleLinks.length, 5); i++) {
      try {
        const href = articleLinks[i];
        const fullUrl = href.startsWith('http') ? href : `https://community.arc.network${href}`;
        await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 20000 });
        await humanDelay(5000, 8000);
        summary.articles++;
        log(`Article ${summary.articles}/5 read: ${href}`);
      } catch (e) {
        log(`Article ${i+1} failed: ${e.message}`);
        summary.errors.push(`Article ${i+1}: ${e.message}`);
      }
    }

    await page.goto('https://community.arc.network/contents', { waitUntil: 'networkidle', timeout: 20000 });
    await humanDelay(2000, 3000);

    log('Looking for videos...');
    const vidSelectors = ['video', 'iframe[src*="youtube"]', 'iframe[src*="vimeo"]', '[class*="video"]', '[class*="player"]'];
    let videoEls = [];
    for (const sel of vidSelectors) {
      videoEls = await page.locator(sel).all();
      if (videoEls.length > 0) break;
    }

    if (videoEls.length > 0) {
      for (let i = 0; i < Math.min(videoEls.length, 4); i++) {
        try {
          await videoEls[i].scrollIntoViewIfNeeded();
          await humanDelay(1000, 2000);
          try { await videoEls[i].click({ timeout: 3000 }); } catch {}
          await sleep(15000 + randomBetween(0, 5000));
          summary.videos++;
          log(`Video ${summary.videos}/4 watched`);
        } catch (e) {
          log(`Video ${i+1} failed: ${e.message}`);
          summary.errors.push(`Video ${i+1}: ${e.message}`);
        }
      }
    } else {
      log('No videos found on contents page');
    }

    await page.goto('https://community.arc.network/profile', { waitUntil: 'networkidle', timeout: 20000 });
    await humanDelay(2000, 3000);
    pointsAfter = await extractPointBalance(page);
    log(`Points after: ${pointsAfter}`);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, `session_${sessionId}.png`), fullPage: true });
    log('Success screenshot saved');

    const storage = await context.storageState();
    fs.writeFileSync(SESSION_FILE, JSON.stringify({ cookies: storage.cookies }, null, 2));
    log('Session saved for next run');

    const resultMsg = [
      `ARC Points Bot - ${new Date().toISOString().slice(0, 10)}`,
      `Articles: ${summary.articles}/5`,
      `Videos: ${summary.videos}/4`,
      `Points: ${pointsBefore} → ${pointsAfter}`,
      summary.errors.length > 0 ? `Errors: ${summary.errors.length}` : 'No errors'
    ].join('\n');

    log(resultMsg.replace(/\n/g, ' | '));
    await sendTelegram(resultMsg);
    log('Session completed successfully');
  } catch (error) {
    const errMsg = `FATAL: ${error.message}`;
    log(errMsg);
    try { await page.screenshot({ path: path.join(SCREENSHOT_DIR, `error_${sessionId}.png`), fullPage: true }); } catch {}
    await sendTelegram(`ARC Bot Failed\n${error.message}`);
    throw error;
  } finally {
    await browser.close();
    log(`Session ${sessionId} ended`);
  }
}

runBot().catch(e => {
  console.error(e.message);
  process.exit(1);
});
