# Steward Frontend

A Next.js frontend for the Steward platform - Christian financial stewardship on the blockchain, powered by Trig Protocol.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## ✨ Features Implemented

### 1. Home Page (`/`)
- Hero section with CTA buttons
- Features overview
- Statistics display
- Wallet connection

### 2. Register Church (`/register-church`)
**User Story**: Church leaders can register their church on the platform
- Church information form
- 1 ETH stake requirement
- Blockchain commitment (simulated)
- Success confirmation
- 📄 See `REGISTER_CHURCH_FEATURE.md` for details

### 3. Create Tithe Commitment (`/create-tithe`)
**User Story 1.1**: Believers can set up automatic tithing
- **Step 1**: Select verified church with search
- **Step 2**: Configure income, tithe %, offering %, frequency
- **Step 3**: Preview commitment with real-time calculations
- **Step 4**: Confirm and receive blockchain confirmation
- 📄 See `CREATE_TITHE_FEATURE.md` for details
- 📄 See `CREATE_TITHE_VISUAL_GUIDE.md` for UX flow
- 📄 See `CREATE_TITHE_TESTING.md` for QA checklist

### 4. My Commitments (`/my-commitments`)
**User Story 1.2**: Believers can view and manage their tithe commitments
- Dashboard with summary statistics (total given, monthly commitment)
- View all active and paused commitments
- Execution history display (automated by Trig Protocol)
- Pause/Resume commitment functionality
- Real-time calculation of giving amounts
- Clean, display-only interface
- 📄 See `MY_COMMITMENTS_FEATURE.md` for details
- 📄 See `AUTOMATED_EXECUTION_SIMPLIFICATION.md` for architecture

### 5. Giving History (`/giving-history`) ✨
**User Story 1.3**: Believers can view complete giving history and download receipts
- Complete transaction history with filtering
- Summary statistics (total given, tithes, offerings, churches)
- Filter by year, month, church, and search
- Toggle between list and chart views
- Monthly giving breakdown visualization
- Expandable transaction details with blockchain proof
- Export to CSV functionality
- Tax receipt generation (PDF)
- Yearly summary overview
- Multi-year comparison
- 📄 See `GIVING_HISTORY_FEATURE.md` for details
- 📄 See `GIVING_HISTORY_VISUAL_GUIDE.md` for UX flow

### 6. Church Dashboard (`/church-dashboard`)
**User Story 3.3**: Church leaders can view received tithes
- Real-time dashboard with key metrics
- Total tithes received display
- Recent tithes list with donor information
- Monthly breakdown visualization
- Top contributors list
- Verification status display
- 📄 See `CHURCH_DASHBOARD_FEATURE.md` for details
- 📄 See `CHURCH_DASHBOARD_VISUAL_GUIDE.md` for UX flow

### 7. Mission Protection (`/mission-protection`) ✨ NEW
**User Story 2.1**: Missionaries can purchase trip protection
- **Step 1**: Select destination from 15 international locations with risk assessment
- **Step 2**: Enter trip dates, duration, purpose, and organization
- **Step 3**: Choose coverage amount ($1K-$10K) with real-time premium calculation
- **Step 4**: Review complete policy details with terms and blockchain info
- **Step 5**: Purchase and receive unique policy ID
- Intelligent premium algorithm (based on risk, coverage, duration)
- Risk level indicators (Low/Medium/High)
- Coverage benefits display (5 key protections)
- Automatic payout system (24-hour processing)
- Church leader verification (2-of-3 multisig)
- 📄 See `MISSION_PROTECTION_INDEX.md` for complete documentation
- 📄 See `MISSION_PROTECTION_QUICK_REFERENCE.md` for quick start

## 🗺️ Route Map

```
/                    → Home page
/register-church     → Church registration (Epic 3)
/create-tithe        → Create tithe commitment (Epic 1.1)
/my-commitments      → View & manage commitments (Epic 1.2)
/giving-history      → View giving history & receipts (Epic 1.3)
/church-dashboard    → Church leader dashboard (Epic 3.3)
/mission-protection  → Purchase mission trip insurance (Epic 2.1) ✨ NEW
```

## 🎯 User Stories Status

- ✅ **Epic 1.1**: Create Tithe Commitment (COMPLETE)
- ✅ **Epic 1.2**: Execute Tithe Payment - Phase 1 (COMPLETE)
- ✅ **Epic 1.3**: View Giving History - Phase 2 (COMPLETE)
- ✅ **Epic 2.1**: Purchase Mission Protection (COMPLETE) ✨ NEW
- ✅ **Epic 3.1**: Register Church (COMPLETE)
- ✅ **Epic 3.3**: Church Dashboard (COMPLETE)
- ⏳ **Epic 2.2**: File Mission Trip Claim (TODO - NEXT)
- ⏳ **Epic 4**: DeFi Capital Backing (TODO)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: wagmi + viem
- **Icons**: Custom SVG components

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Home page
│   ├── register-church/
│   │   └── page.tsx               # Church registration
│   └── create-tithe/
│       └── page.tsx               # Tithe commitment ✨ NEW
├── components/
│   ├── Icons.tsx                  # SVG icon components
│   ├── Providers.tsx              # Wallet providers
│   └── WalletConnectButton.tsx    # Wallet connection
├── config/
│   └── wagmi.ts                   # Wagmi configuration
└── hooks/
```

## 🎨 Development

### Add a New Page
1. Create `src/app/your-page/page.tsx`
2. Add route to navigation
3. Document in README

### Add a New Component
1. Create in `src/components/YourComponent.tsx`
2. Use TypeScript
3. Use Tailwind for styling

### Add Icons
1. Add to `src/components/Icons.tsx`
2. Export as React component
3. Use consistent sizing props

## 📚 Documentation

### Epic 1: Automated Tithing
- `CREATE_TITHE_COMPLETE.md` - Feature completion summary
- `CREATE_TITHE_FEATURE.md` - Technical documentation  
- `CREATE_TITHE_IMPLEMENTATION.md` - Implementation details
- `CREATE_TITHE_VISUAL_GUIDE.md` - UX flow and visuals
- `CREATE_TITHE_TESTING.md` - Testing checklist
- `MY_COMMITMENTS_FEATURE.md` - Commitments management
- `GIVING_HISTORY_FEATURE.md` - Giving history & receipts
- `AUTOMATED_EXECUTION_SIMPLIFICATION.md` - Architecture

### Epic 2: Mission Protection ✨ NEW
- `MISSION_PROTECTION_INDEX.md` - Complete documentation index
- `MISSION_PROTECTION_SUMMARY.md` - Executive summary
- `MISSION_PROTECTION_FEATURE.md` - Complete feature docs
- `MISSION_PROTECTION_VISUAL_GUIDE.md` - UI/UX specifications
- `MISSION_PROTECTION_TESTING.md` - Testing procedures
- `MISSION_PROTECTION_COMPLETE.md` - Completion summary
- `MISSION_PROTECTION_QUICK_REFERENCE.md` - Quick reference
- `MISSION_PROTECTION_ARCHITECTURE.md` - Architecture diagrams

### Epic 3: Church Leadership
- `REGISTER_CHURCH_FEATURE.md` - Church registration docs
- `CHURCH_DASHBOARD_FEATURE.md` - Dashboard documentation
- `CHURCH_DASHBOARD_VISUAL_GUIDE.md` - Dashboard UX flow

### General
- `WALLET_SETUP.md` - Wallet integration guide
- `QUICK_START.md` - Quick start guide
- `.github/copilot-instructions.md` - AI agent guidance

## 🧪 Testing

Run the dev server and test features:
1. **Home Page**: Check navigation and wallet connection
2. **Register Church**: Complete registration flow
3. **Create Tithe**: Go through 4-step wizard
   - Search churches
   - Configure commitment
   - Preview amounts
   - Confirm (requires wallet)
4. **My Commitments**: View and manage commitments
   - See active commitments
   - View execution history
   - Pause/resume functionality
5. **Giving History**: Review complete giving records
   - Filter transactions
   - View visualizations
   - Export data
   - Generate receipts
6. **Church Dashboard**: View church metrics (requires church registration)
   - See received tithes
   - View contributors
   - Monthly breakdown
7. **Mission Protection**: Purchase trip insurance ✨ NEW
   - Select destination (15 countries)
   - Enter trip details
   - Choose coverage ($1K-$10K)
   - Review and purchase
   - Receive policy ID

## 🔧 Configuration

### Environment Variables
Create `.env.local`:
```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
```

See `.env.local.example` for all options.

## 🚀 Demo Mode

Both features run in **simulation mode**:
- Uses hardcoded church list
- Simulates blockchain transactions
- No actual contract calls
- Ready for smart contract integration

### To Enable Real Blockchain
1. Deploy smart contracts
2. Add contract addresses in code
3. Uncomment blockchain integration code
4. Update church list to pull from chain

## 🎯 Next.js Features Used

- ✅ App Router (`app/` directory)
- ✅ Server Components (where appropriate)
- ✅ Client Components (`'use client'`)
- ✅ TypeScript strict mode
- ✅ Tailwind CSS
- ✅ Font optimization (Geist)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
