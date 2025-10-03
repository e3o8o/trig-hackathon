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

### 4. My Commitments (`/my-commitments`) ✨ NEW
**User Story 1.2**: Believers can view and manage their tithe commitments
- Dashboard with summary statistics (total given, monthly commitment)
- View all active and paused commitments
- Execution history display (automated by Trig Protocol)
- Pause/Resume commitment functionality
- Real-time calculation of giving amounts
- Clean, display-only interface
- 📄 See `MY_COMMITMENTS_FEATURE.md` for details
- 📄 See `AUTOMATED_EXECUTION_SIMPLIFICATION.md` for architecture

## 🗺️ Route Map

```
/                    → Home page
/register-church     → Church registration (Epic 3)
/create-tithe        → Create tithe commitment (Epic 1.1)
/my-commitments      → View & manage commitments (Epic 1.2) ✨ NEW
```

## 🎯 User Stories Status

- ✅ **Epic 3.1**: Register Church (COMPLETE)
- ✅ **Epic 1.1**: Create Tithe Commitment (COMPLETE)
- ✅ **Epic 1.2**: Execute Tithe Payment - Phase 1 (COMPLETE) ✨ NEW
- ⏳ **Epic 1.3**: View Giving History - Phase 2 (IN PROGRESS)
- ⏳ **Epic 2**: Mission Trip Protection (TODO)

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

- `CREATE_TITHE_COMPLETE.md` - Feature completion summary
- `CREATE_TITHE_FEATURE.md` - Technical documentation  
- `CREATE_TITHE_IMPLEMENTATION.md` - Implementation details
- `CREATE_TITHE_VISUAL_GUIDE.md` - UX flow and visuals
- `CREATE_TITHE_TESTING.md` - Testing checklist
- `REGISTER_CHURCH_FEATURE.md` - Church registration docs
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
