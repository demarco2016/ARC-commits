```text
                          █████╗ ██████╗  ██████╗
                         ██╔══██╗██╔══██╗██╔════╝
                         ███████║██████╔╝██║
                         ██╔══██║██╔══██╗██║
                         ██║  ██║██║  ██║╚██████╗
                         ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝
```

<p align="center">
  <b>ARC Ecosystem Contribution Hub</b><br>
  <sub>Stablecoin-native blockchain by Circle — USDC as gas</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/demarco2016/ARC-commits?style=for-the-badge&color=blueviolet">
  <img src="https://img.shields.io/github/last-commit/demarco2016/ARC-commits?style=for-the-badge&color=blueviolet">
  <img src="https://img.shields.io/badge/ARC-Testnet-6A0DAD?style=for-the-badge">
  <img src="https://img.shields.io/badge/Chain_ID-5042002-6A0DAD?style=for-the-badge">
  <br>
  <img src="https://img.shields.io/badge/Stack-Solidity-363636?style=flat&logo=solidity">
  <img src="https://img.shields.io/badge/Stack-Node.js-339933?style=flat&logo=nodedotjs">
  <img src="https://img.shields.io/badge/Stack-Playwright-45ba4b?style=flat&logo=playwright">
  <img src="https://img.shields.io/badge/Stack-GitHub_Actions-2088FF?style=flat&logo=githubactions">
  <img src="https://img.shields.io/badge/Stack-USDC-2775CA?style=flat&logo=usdc">
</p>

---

## 📌 About

Automation hub for the **ARC blockchain** ecosystem. Includes daily points farming, contract deployments, and ecosystem monitoring tools.

## 🤖 ARC Points Bot v2

Automates daily tasks on [community.arc.network](https://community.arc.network) — ARC Architects program.

| Task | Points | Automation |
|------|--------|-----------|
| Read 5 articles | 10 pts | ✅ |
| Watch 4 videos | 16 pts | ✅ |
| Daily login | 1 pt | ✅ |
| **Total daily** | **27 pts** | ✅ |

### Features

| Feature | Description |
|---------|-------------|
| Anti-detection | Randomized UA, viewport, human-like delays |
| Session persistence | Reuses cookies, avoids login every run |
| Proxy support | SOCKS5/HTTP proxy for IP rotation |
| Point tracking | Scrapes balance before/after to verify rewards |
| Telegram alerts | Sends daily results to your Telegram |
| Screenshots | Captures proof on success and failure |

### Setup (GitHub Actions)

1. Add these **secrets** → `Settings → Secrets and variables → Actions`:
   - `ARC_EMAIL` — your ARC community email
   - `ARC_PASSWORD` — your ARC community password
   - `ARC_PROXY` *(optional)* — proxy for IP rotation
   - `TELEGRAM_BOT_TOKEN` *(optional)* — Telegram bot token
   - `TELEGRAM_CHAT_ID` *(optional)* — your Telegram chat ID
2. Workflow fires daily at **08:00 UTC**
3. Check logs & screenshots in `Actions` tab

### Local Development

```bash
cd ARC-POINTS-BOT
npm install
npx playwright install chromium
# Edit .env (see .env.example)
npm start
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ARC_EMAIL` | ✅ | ARC community email |
| `ARC_PASSWORD` | ✅ | ARC community password |
| `ARC_PROXY` | optional | Proxy URL `http://user:pass@ip:port` |
| `TELEGRAM_BOT_TOKEN` | optional | Telegram bot token for alerts |
| `TELEGRAM_CHAT_ID` | optional | Telegram chat ID |
| `ARC_SESSION_FILE` | optional | Session file path (default: `./session.json`)

## 📜 Smart Contracts

| Contract | Network | Address |
|----------|---------|---------|
| DemarcoToken (DMRC) | ARC Testnet | `contracts/DemarcoToken.sol` |

Deploy via Remix: `https://remix.ethereum.org` with Injected Provider → ARC Testnet.

## 🔗 Network Details

| Parameter | Value |
|-----------|-------|
| RPC | `https://rpc.testnet.arc.network` |
| Chain ID | `5042002` |
| Gas Token | USDC |
| Explorer | [testnet.arcscan.app](https://testnet.arcscan.app) |
| Faucet | [faucet.circle.com](https://faucet.circle.com) |

## 📬 Contact

- **X (Twitter)**: [@Demarco639](https://x.com/Demarco639)
- **ARC Community**: [community.arc.network](https://community.arc.network)

---

<p align="center">
  <sub>Built on ARC Testnet · USDC-native · ⚡ by Demarco639</sub>
</p>