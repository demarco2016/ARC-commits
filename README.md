# ARC Community Helper (Legacy)

This repository contains a legacy Playwright community-navigation script. Visiting
links or interacting with a player does not prove reading, viewing, genuine
engagement, reward credit, or airdrop eligibility. No fixed daily points are promised.
Use only where the service permits the intended automation.

## Safe default workflow

GitHub Actions performs local code/privacy checks only. Scheduled points runs and
automatic commits of logs, screenshots, or browser state have been removed.
The checks do not log in, contact Telegram, or run a browser against the community.

## Local setup

Requires Node.js 22 or newer:

```bash
cd ARC-POINTS-BOT
npm install
npx playwright install chromium
cp .env.example .env
# Configure credentials locally; then, only if you intend a live run:
npm start
```

`ARC_EMAIL` and `ARC_PASSWORD` are required for a live run. Proxy and Telegram
settings are optional. Keep credentials out of Git and issue comments.
A live run may navigate community pages and send Telegram messages if configured;
these operations are not part of the tests.

## Browser-state privacy

Session persistence and screenshots are disabled by default. Explicit local
opt-ins are `ARC_PERSIST_SESSION=true` and `ARC_CAPTURE_SCREENSHOTS=true`.
Local outputs default to `ARC-POINTS-BOT/.local/`, which is ignored. Saved state
uses file mode 0600 on systems that implement Unix file permissions. Never upload
session state, screenshots of signed-in pages, or raw logs as public artifacts.

Earlier commits contain browser cookies and screenshots. Removing them from the
current tree does not remove historical copies. Review affected sessions and
coordinate any history cleanup separately; do not force-push without approval.
Until this change is merged, pause the old workflow in GitHub Actions to prevent
new automatic publication of browser state.

## Verification

```bash
cd ARC-POINTS-BOT
npm test
```

Tests check credential redaction and opt-in persistence/capture without credentials
or external requests. Browser compatibility and live rewards are not verified.
