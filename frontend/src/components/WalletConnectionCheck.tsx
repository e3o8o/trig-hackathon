'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Shield, Loader2 } from '@/components/Icons'
import { WalletConnectButton } from '@/components/WalletConnectButton'

interface WalletConnectionCheckProps {
  children: React.ReactNode
  message?: string
}

export function WalletConnectionCheck({ 
  children, 
  message = "Please connect your wallet to view this page" 
}: WalletConnectionCheckProps) {
  const { isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)

  // Fix hydration error by only rendering after client mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Loading state (prevents hydration mismatch)
  if (!mounted) {
    return (
      <div className="bg-white rounded-2xl p-16 shadow-lg border border-slate-200 text-center">
        <Loader2 className="w-16 h-16 text-indigo-300 mx-auto mb-4 animate-spin" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Loading...
        </h3>
        <p className="text-slate-600">
          Checking wallet connection
        </p>
      </div>
    )
  }

  // Not connected state
  if (!isConnected) {
    return (
      <div className="bg-white rounded-2xl p-16 shadow-lg border border-slate-200 text-center">
        <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-slate-600 mb-6">
          {message}
        </p>
        <div className="flex justify-center">
          <WalletConnectButton />
        </div>
      </div>
    )
  }

  // Connected - render children
  return <>{children}</>
}
