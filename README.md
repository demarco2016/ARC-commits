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

## 🤖 ARC Points Bot

Automates daily tasks on [community.arc.network](https://community.arc.network) — ARC Architects program.

| Task | Points | Automation |
|------|--------|-----------|
| Read 5 articles | 10 pts | ✅ |
| Watch 4 videos | 16 pts | ✅ |
| Daily login | 1 pt | ✅ |
| **Total daily** | **27 pts** | ✅ |

### Setup

1. Add `ARC_EMAIL` & `ARC_PASSWORD` secrets → repo **Settings → Secrets and variables → Actions**
2. Workflow fires daily at **08:00 UTC**
3. Monitor logs in `Actions` tab

### Local Development

```bash
cd ARC-POINTS-BOT
npm install
npx playwright install chromium
# Create .env with ARC_EMAIL & ARC_PASSWORD
npm start
```

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