const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { redact, saveSession, captureScreenshot } = require('../privacy');

test('logs redact credentials and Telegram URLs', () => {
  const env = { ARC_PASSWORD: 'dummy-password', ARC_EMAIL: 'person@example.invalid', TELEGRAM_BOT_TOKEN: 'dummy-token' };
  const result = redact('dummy-password person@example.invalid https://api.telegram.org/botdummy-token/sendMessage', env);
  for (const secret of Object.values(env)) assert.equal(result.includes(secret), false);
});
test('session persistence is off unless enabled', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'arc-privacy-'));
  try {
    const file = path.join(dir, 'state', 'session.json');
    assert.equal(saveSession(file, { cookies: [{ value: 'dummy' }] }, false), false);
    assert.equal(fs.existsSync(file), false);
    assert.equal(saveSession(file, { cookies: [] }, true), true);
    assert.deepEqual(JSON.parse(fs.readFileSync(file)), { cookies: [] });
    if (process.platform !== 'win32') assert.equal(fs.statSync(file).mode & 0o777, 0o600);
  } finally { fs.rmSync(dir, { recursive: true }); }
});
test('screenshots are off unless explicitly enabled', async () => {
  let calls = 0;
  const page = { screenshot: async () => { calls++; } };
  assert.equal(await captureScreenshot(page, '/unused/test.png', false), false);
  assert.equal(calls, 0);
});
