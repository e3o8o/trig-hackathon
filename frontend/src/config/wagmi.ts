import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, base, baseSepolia } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'

// Get WalletConnect project ID from environment variable
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'ca12cb8ae0adfc5a8cead5726d60b574'

export const config = createConfig({
  chains: [baseSepolia, base, mainnet, sepolia],
  connectors: [
    injected(),
    walletConnect({ 
      projectId,
      showQrModal: true,
    }),
    coinbaseWallet({
      appName: 'Steward - Christian Financial Stewardship',
      appLogoUrl: 'https://steward.app/logo.png',
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})

// Reown AppKit configuration for social logins
// Note: Social logins require OAuth setup in WalletConnect Cloud
// See SOCIAL_LOGIN_SETUP.md for detailed instructions
export const appKitConfig = {
  projectId,
  metadata: {
    name: 'Steward',
    description: 'Christian Financial Stewardship on Blockchain',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://steward.app',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  },
  // Enable social logins (requires OAuth configuration in WalletConnect Cloud)
  // features: {
  //   email: true, // Enable email login
  //   socials: ['google', 'x', 'discord', 'github', 'apple', 'facebook'], // Enable social logins
  //   analytics: true, // Enable analytics
  // },
  // Customize the modal
  themeMode: 'light' as const,
  themeVariables: {
    '--w3m-accent': '#4F46E5', // Indigo-600
    '--w3m-border-radius-master': '12px',
  }
}

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
