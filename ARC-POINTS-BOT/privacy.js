const fs = require('node:fs');
const path = require('node:path');

function redact(message, env = process.env) {
  let value = String(message);
  for (const key of ['ARC_EMAIL', 'ARC_PASSWORD', 'ARC_PROXY', 'TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID']) {
    if (env[key]) value = value.split(env[key]).join('[REDACTED]');
  }
  return value.replace(/https:\/\/api\.telegram\.org\/bot[^/\s]+/g, 'https://api.telegram.org/bot[REDACTED]');
}

function saveSession(file, storage, enabled) {
  if (!enabled) return false;
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  // Never include this local state in Git or uploaded workflow artifacts.
  fs.writeFileSync(file, JSON.stringify(storage), { mode: 0o600 });
  fs.chmodSync(file, 0o600);
  return true;
}

async function captureScreenshot(page, file, enabled) {
  if (!enabled) return false;
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  await page.screenshot({ path: file, fullPage: true });
  return true;
}

module.exports = { redact, saveSession, captureScreenshot };
