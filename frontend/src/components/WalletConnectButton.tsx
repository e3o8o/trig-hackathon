'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useState } from 'react'

export function WalletConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [showConnectors, setShowConnectors] = useState(false)

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center px-4 py-2 bg-indigo-100 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm font-medium text-slate-700">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowConnectors(!showConnectors)}
        disabled={isPending}
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Connecting...' : 'Connect Wallet'}
      </button>

      {showConnectors && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => {
                connect({ connector })
                setShowConnectors(false)
              }}
              className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 font-semibold text-xs">
                  {connector.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="font-medium text-slate-900">{connector.name}</div>
                <div className="text-xs text-slate-500">
                  {connector.type === 'injected' ? 'Browser Wallet' : 'Scan QR Code'}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
