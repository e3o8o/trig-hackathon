'use client'

import { useAccount, useDisconnect } from 'wagmi'
import { useState, useEffect, useRef } from 'react'
import { User, ChevronDown, Users } from './Icons'

export function UserMenu() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fix hydration mismatch by only rendering wallet state after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close menu on ESC key
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
      return () => document.removeEventListener('keydown', handleEscKey)
    }
  }, [isOpen])

  // Don't render anything if not mounted or not connected
  if (!mounted || !isConnected || !address) {
    return null
  }

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`

  const handleDisconnect = () => {
    disconnect()
    setIsOpen(false)
  }

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address)
      // You could add a toast notification here
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to copy address:', error)
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* User Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-md"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-700">{shortAddress}</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900">Connected Wallet</div>
                <div className="text-xs text-slate-500 font-mono truncate">{address}</div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={copyAddress}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center space-x-3"
            >
              <Users className="w-4 h-4 text-slate-500" />
              <span>Copy Wallet Address</span>
            </button>
          </div>

          {/* Disconnect Section */}
          <div className="border-t border-slate-100 py-1">
            <button
              onClick={handleDisconnect}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  )
}