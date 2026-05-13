# ARC-commits

ARC ecosystem contribution hub.

## 📋 About

This repo tracks my contributions to the **ARC** blockchain ecosystem by Circle. Includes automation tools, daily points farming, and ecosystem monitoring.

## 🤖 ARC Points Bot

Automates daily tasks on [community.arc.network](https://community.arc.network):

| Task | Points | Status |
|------|--------|--------|
| Read 5 articles | 10 pts | Automated |
| Watch 4 videos | 16 pts | Automated |
| Daily login | 1 pt | Automated |
| **Total daily** | **27 pts** | ✅ |

### Setup

1. Add `ARC_EMAIL` and `ARC_PASSWORD` to repo **Settings → Secrets → Actions**
2. Workflow runs daily at 08:00 UTC
3. Check logs in `ARC-POINTS-BOT/logs/`

### Local Run

```bash
cd ARC-POINTS-BOT
npm install
npx playwright install chromium
# Create .env with ARC_EMAIL & ARC_PASSWORD
npm start
```

## 🔗 Links

- [Arc Network](https://www.arc.network/)
- [Community Portal](https://community.arc.network/)
- [X: @Demarco639](https://x.com/Demarco639)
