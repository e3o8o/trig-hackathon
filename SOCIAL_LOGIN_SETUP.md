# 🔐 Social Login Setup Guide

This guide explains how to enable **Google, Twitter, Discord, Apple, Facebook, and Email logins** alongside traditional wallet connections using **Reown AppKit** (formerly Web3Modal).

---

## 📋 **Overview**

With Reown AppKit, users can log in using:
- ✅ **Email** (passwordless magic links)
- ✅ **Google** OAuth
- ✅ **Twitter/X** OAuth  
- ✅ **Discord** OAuth
- ✅ **GitHub** OAuth
- ✅ **Apple** Sign In
- ✅ **Facebook** Login
- ✅ **Traditional Wallets** (MetaMask, Coinbase, WalletConnect, etc.)

---

## 🚀 **Setup Steps**

### **Step 1: Install Required Package**

The `@reown/appkit` package is already included in your dependencies (via `wagmi`).

If you need to add it explicitly:
```bash
npm install @reown/appkit @reown/appkit-adapter-wagmi
```

### **Step 2: Configure WalletConnect Project**

1. Go to https://cloud.walletconnect.com/
2. Sign up or log in
3. Create a new project or use existing: `ca12cb8ae0adfc5a8cead5726d60b574`
4. **Enable Auth features**:
   - Go to **Auth** tab in your project
   - Enable **Email Authentication**
   - Enable **Social Providers**:
     - Google
     - Twitter/X
     - Discord
     - GitHub
     - Apple
     - Facebook

### **Step 3: Configure OAuth Providers**

For each social provider, you need to set up OAuth credentials:

#### **Google OAuth**
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create OAuth 2.0 Client ID**
5. Add authorized redirect URIs:
   - `https://rpc.walletconnect.com/auth/v1/callback`
   - `https://your-domain.vercel.app` (your production domain)
6. Copy **Client ID** and **Client Secret**
7. Add them to your WalletConnect project settings

#### **Twitter/X OAuth**
1. Go to https://developer.twitter.com/
2. Create an app or use existing
3. Enable **OAuth 2.0**
4. Add callback URL: `https://rpc.walletconnect.com/auth/v1/callback`
5. Copy **API Key** and **API Secret**
6. Add them to your WalletConnect project settings

#### **Discord OAuth**
1. Go to https://discord.com/developers/applications
2. Create new application
3. Go to **OAuth2** section
4. Add redirect: `https://rpc.walletconnect.com/auth/v1/callback`
5. Copy **Client ID** and **Client Secret**
6. Add them to your WalletConnect project settings

#### **GitHub OAuth**
1. Go to https://github.com/settings/developers
2. Create new OAuth app
3. Add callback URL: `https://rpc.walletconnect.com/auth/v1/callback`
4. Copy **Client ID** and **Client Secret**
5. Add them to your WalletConnect project settings

#### **Apple Sign In**
1. Go to https://developer.apple.com/
2. Create a Service ID
3. Configure Web Authentication
4. Add domains and redirect URLs
5. Copy **Service ID**, **Team ID**, and **Key ID**
6. Add them to your WalletConnect project settings

#### **Facebook Login**
1. Go to https://developers.facebook.com/
2. Create new app
3. Add **Facebook Login** product
4. Configure OAuth redirect URIs
5. Copy **App ID** and **App Secret**
6. Add them to your WalletConnect project settings

---

## 🔧 **Environment Variables**

Add to Vercel Environment Variables:

```bash
# Required
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=ca12cb8ae0adfc5a8cead5726d60b574

# Optional - for custom RPC endpoints
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

---

## 📝 **Current Configuration**

The following is already configured in your app:

### **`src/config/wagmi.ts`**
```typescript
export const appKitConfig = {
  projectId: 'ca12cb8ae0adfc5a8cead5726d60b574',
  metadata: {
    name: 'Steward',
    description: 'Christian Financial Stewardship on Blockchain',
    url: 'https://steward.app',
    icons: ['https://steward.app/logo.png']
  },
  features: {
    email: true,              // ✅ Email login enabled
    socials: [                // ✅ Social logins enabled
      'google',
      'x',                    // Twitter/X
      'discord',
      'github',
      'apple',
      'facebook'
    ],
    analytics: true,          // ✅ Analytics enabled
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#4F46E5',           // Indigo-600
    '--w3m-border-radius-master': '12px',
  }
}
```

---

## 🎨 **How It Works**

1. **User clicks "Connect Wallet"**
2. **AppKit modal opens** with options:
   - 📧 Email (magic link)
   - 🔵 Google
   - 🐦 Twitter/X
   - 💬 Discord
   - 🐙 GitHub
   - 🍎 Apple
   - 📘 Facebook
   - 👛 Wallet options (MetaMask, Coinbase, WalletConnect QR)

3. **User selects social login**:
   - Redirected to OAuth provider
   - Authenticates with social account
   - Redirected back to app
   - **Wallet is automatically created** (EOA - Externally Owned Account)
   - User can interact with blockchain immediately

4. **Benefits**:
   - ✅ No manual wallet setup needed
   - ✅ Familiar login flow (like any web app)
   - ✅ Still owns a real blockchain wallet
   - ✅ Can export private key later if needed
   - ✅ Can add password recovery
   - ✅ Seamless onboarding for non-crypto users

---

## 🧪 **Testing**

### **Local Testing**
1. Run `npm run dev` in the frontend directory
2. Click "Connect Wallet"
3. You should see social login options
4. Test with your personal accounts

### **Production Testing**
After deploying with OAuth configured:
1. Visit your Vercel URL
2. Click "Connect Wallet"
3. Try each social login option
4. Verify wallet creation and blockchain interaction

---

## 🔒 **Security Considerations**

1. **Private Keys**: 
   - Social login wallets have private keys managed by Reown infrastructure
   - Keys are encrypted and stored securely
   - Users can export keys to self-custody later

2. **OAuth Tokens**:
   - Never stored in your app
   - Only used for authentication
   - Expire after use

3. **Best Practices**:
   - Always use HTTPS in production
   - Keep WalletConnect Project ID secret in backend operations
   - Monitor usage in WalletConnect Cloud dashboard
   - Implement session timeouts for sensitive operations

---

## 📊 **Current Status**

- ✅ Configuration added to `wagmi.ts` (commented out by default)
- ✅ Providers updated to support AppKit
- ✅ Coinbase Wallet connector added
- ⏳ OAuth providers need setup in WalletConnect Cloud
- ⏳ Environment variable needs to be added to Vercel
- ⏳ Uncomment social login features in `wagmi.ts` after OAuth setup

### **To Enable Social Logins:**

Once you've configured OAuth providers in WalletConnect Cloud, uncomment these lines in `src/config/wagmi.ts`:

```typescript
// Uncomment these lines:
features: {
  email: true,
  socials: ['google', 'x', 'discord', 'github', 'apple', 'facebook'],
  analytics: true,
},
```

---

## 🎯 **Next Steps**

1. **Go to WalletConnect Cloud** (https://cloud.walletconnect.com/)
2. **Enable Auth features** in your project
3. **Configure each OAuth provider** (Google, Twitter, etc.)
4. **Add environment variable** to Vercel
5. **Redeploy** and test!

---

## 📚 **Resources**

- [Reown AppKit Docs](https://docs.reown.com/appkit/overview)
- [WalletConnect Cloud](https://cloud.walletconnect.com/)
- [Social Login Guide](https://docs.reown.com/appkit/features/socials)
- [Email Auth Guide](https://docs.reown.com/appkit/features/email)

---

## 🆘 **Troubleshooting**

### **Social logins not showing?**
- Check if Auth is enabled in WalletConnect Cloud
- Verify OAuth credentials are added
- Check browser console for errors

### **403 Forbidden error?**
- Add `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` to Vercel
- Verify Project ID is correct
- Check if project is active in WalletConnect Cloud

### **OAuth redirect fails?**
- Verify callback URLs match exactly
- Check if OAuth app is in production mode (not development)
- Ensure HTTPS is used in production

---

**Last Updated**: October 2025
**Status**: Ready for OAuth provider configuration

