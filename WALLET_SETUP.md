# Wallet Integration Setup

This guide explains how to set up wallet connectivity for the Steward application.

## Overview

The wallet integration uses:
- **wagmi v2** - React hooks for Ethereum
- **viem** - TypeScript interface for Ethereum
- **@tanstack/react-query** - Async state management

## Quick Start

1. **Get a WalletConnect Project ID** (optional but recommended):
   - Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Create a new project
   - Copy your Project ID

2. **Configure Environment Variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your WalletConnect Project ID:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

## How It Works

### Wallet Configuration (`src/config/wagmi.ts`)
Configures the supported chains and connectors:
- **Chains**: Mainnet, Sepolia, Base, Base Sepolia
- **Connectors**: 
  - Injected (MetaMask, Coinbase Wallet, etc.)
  - WalletConnect (mobile wallets with QR code)

### Providers (`src/components/Providers.tsx`)
Wraps the entire app with:
- `WagmiProvider` - Provides wagmi context
- `QueryClientProvider` - Handles async state

### WalletConnectButton (`src/components/WalletConnectButton.tsx`)
A ready-to-use button component that:
- Shows "Connect Wallet" when disconnected
- Displays wallet address when connected
- Shows a dropdown to select wallet type
- Handles connection/disconnection

## Usage Example

```tsx
import { WalletConnectButton } from '@/components/WalletConnectButton'

export default function MyPage() {
  return (
    <div>
      <WalletConnectButton />
    </div>
  )
}
```

## Using Wallet Data in Your Components

```tsx
'use client'

import { useAccount, useBalance } from 'wagmi'

export function MyComponent() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })

  if (!isConnected) {
    return <div>Please connect your wallet</div>
  }

  return (
    <div>
      <p>Address: {address}</p>
      <p>Balance: {balance?.formatted} {balance?.symbol}</p>
    </div>
  )
}
```

## Available Hooks

Common wagmi hooks you can use:

- `useAccount()` - Get connected wallet address and status
- `useBalance()` - Get wallet balance
- `useConnect()` - Connect to wallet
- `useDisconnect()` - Disconnect wallet
- `useSignMessage()` - Sign messages
- `useContractRead()` - Read from smart contracts
- `useContractWrite()` - Write to smart contracts
- `useSendTransaction()` - Send transactions

See [wagmi documentation](https://wagmi.sh/react/api/hooks) for complete list.

## Testing Without a Wallet

For development, you can use:
1. **MetaMask** (Browser extension)
2. **Coinbase Wallet** (Browser extension or mobile)
3. **Hardhat/Anvil** (Local blockchain with test accounts)

## Supported Networks

- **Ethereum Mainnet** - Production
- **Sepolia** - Ethereum testnet
- **Base** - L2 production
- **Base Sepolia** - Base testnet

## Troubleshooting

### "Connect Wallet" button doesn't work
- Make sure you have a wallet extension installed (MetaMask, Coinbase Wallet)
- Check browser console for errors
- Verify the Providers component wraps your app in layout.tsx

### WalletConnect QR code doesn't appear
- Add your WalletConnect Project ID to `.env.local`
- Restart the dev server after adding environment variables

### Wrong network
- Switch networks in your wallet
- The app will automatically detect the network change

## Next Steps

To interact with smart contracts:
1. Add your contract ABI to `src/abis/`
2. Use `useContractRead` and `useContractWrite` hooks
3. See the [wagmi Contract Interactions guide](https://wagmi.sh/react/guides/write-to-contract)
