# 🚀 Trig Protocol + StewardChain: 72-Hour Hackathon

**A Christian Financial Stewardship Platform on Blockchain**

Built on Base Sepolia testnet with DeFi backing integration.

---

## 🎯 What We're Building

**Steward** helps users practice faithful financial stewardship through:
- **Automated Tithing**: Set it once, tithe automatically
- **Mission Protection**: Insurance for international mission trips
- **Church Verification**: Blockchain-based accountability with staking

Powered by **Trig Protocol** - an omnichain parametric condition execution engine.

---

## 🏗️ Architecture

```
trig-hackathon/
├── contracts/          # Smart contracts
│   ├── core/          # TrigImmutableCore protocol
│   ├── steward/       # Steward applications
│   ├── defi/          # DeFi backing integration
│   ├── mocks/         # Test contracts
│   └── interfaces/    # Contract interfaces
├── test/              # Smart contract tests
│   ├── unit/          # Unit tests
│   └── integration/   # Integration tests
├── scripts/           # Deployment scripts
├── frontend/          # Next.js frontend
└── docs/              # Documentation
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm or yarn
- MetaMask wallet
- Base Sepolia testnet ETH

### Installation

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your private key and RPC URLs to .env

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Base Sepolia
npx hardhat run scripts/deploy-core.ts --network baseSepolia
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application.

---

## 📚 Documentation

- [Architecture](./ARCHITECTURE.md) - Complete technical architecture
- [Task Tracker](./TASK_TRACKER.md) - 95-task implementation guide
- [Team Briefing](./TEAM_BRIEFING.md) - User stories and coordination

---

## 🎯 Core Features

### Trig Protocol (Core)
- ✅ Time-based conditions
- ✅ Token balance conditions
- ✅ Multisig conditions
- ✅ Cross-chain ready (LayerZero OApp)

### Steward Applications
- ✅ Automated Tithe System
- ✅ Mission Trip Protection
- ✅ Steward Oracle Registry
- ✅ Staking-based verification

### DeFi Integration
- ✅ Backing pool with real deposits
- ✅ Simplified yield distribution
- ✅ Mock Morpho adapter

---

## 🧪 Testing

```bash
# Run all tests
npx hardhat test

# Run with coverage
npx hardhat coverage

# Run specific test
npx hardhat test test/unit/TrigImmutableCore.t.sol
```

---

## 🚢 Deployment

### Base Sepolia Testnet

```bash
# Deploy core protocol
npx hardhat run scripts/deploy-core.ts --network baseSepolia

# Deploy Steward contracts
npx hardhat run scripts/deploy-steward.js --network baseSepolia

# Verify contracts
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS>
```

Deployed contract addresses are saved in `deployments/base-sepolia.json`.

---

## 🎬 Demo

### Live Demo
Visit: [StewardChain Demo](https://stewardchain-demo.vercel.app) _(to be deployed)_

### Demo Video
Watch: [5-Minute Demo](https://youtube.com/...) _(to be recorded)_

### Demo Script
1. **Automated Tithe**: Create commitment and execute payment
2. **Mission Protection**: Purchase policy and file claim
3. **Church Verification**: Register church and verify leaders
4. **DeFi Backing**: Add backing capital and view yield

---

## 👥 Team

- **Developer 1**: Smart contracts, testing, deployment
- **Developer 2**: Frontend, integration, UI/UX
- **Product Manager**: User stories, demo, presentation

---

## 🛠️ Tech Stack

### Smart Contracts
- Solidity 0.8.22
- Hardhat
- OpenZeppelin Contracts
- LayerZero OApp

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui
- wagmi + viem
- RainbowKit

### Infrastructure
- Base Sepolia testnet
- IPFS for metadata
- The Graph for indexing

---

## 📊 Success Metrics

### Hackathon Goals
- ✅ Working demo on testnet
- ✅ 2+ Christian use cases operational
- ✅ DeFi backing integrated
- ✅ Polished frontend UI
- ✅ 5-minute demo video

### Post-Hackathon Vision
- Multi-chain deployment
- Real DeFi protocol integration
- Production security audit
- Mobile application
- $50B+ market opportunity

---

## 🔒 Security

This is a hackathon project. **DO NOT USE IN PRODUCTION** without:
- Professional security audit
- Comprehensive testing
- Legal compliance review
- Economic security analysis

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details

---

## 🙏 Acknowledgments

Built for [Hackathon Name] 2025

Special thanks to:
- Base for testnet infrastructure
- LayerZero for cross-chain messaging
- OpenZeppelin for security patterns
- Morpho for DeFi inspiration

---

## 📞 Contact

- Twitter: [@TrigProtocol](https://twitter.com/TrigProtocol)
- Discord: [Join our community](https://discord.gg/...)
- Email: team@trigprotocol.com

---

**Built with ❤️ for the Christian community**

