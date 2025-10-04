'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Shield, 
  CheckCircle, 
  Loader2,
  UserPlus,
  AlertCircle,
  Crown
} from '@/components/Icons'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { UserMenu } from '@/components/UserMenu'
import { CONTRACTS, getBlockExplorerUrl } from '@/config/contracts'
import { isAddress } from 'viem'

export default function AdminDashboard() {
  const { address, isConnected } = useAccount()
  const [newVerifierAddress, setNewVerifierAddress] = useState('')
  const [addressError, setAddressError] = useState('')

  // Check if user is an admin
  const { data: adminRole } = useReadContract({
    ...CONTRACTS.oracle,
    functionName: 'DEFAULT_ADMIN_ROLE',
  })

  const { data: isAdmin } = useReadContract({
    ...CONTRACTS.oracle,
    functionName: 'hasRole',
    args: adminRole && address ? [adminRole, address] : undefined,
    query: {
      enabled: !!adminRole && !!address,
    },
  })

  // Get VERIFIER_ROLE hash
  const { data: verifierRole } = useReadContract({
    ...CONTRACTS.oracle,
    functionName: 'VERIFIER_ROLE',
  })

  // Transaction hooks
  const { data: hash, isPending: isWritePending, writeContract, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  // Handle address input
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewVerifierAddress(value)
    
    if (value && !isAddress(value)) {
      setAddressError('Invalid Ethereum address')
    } else {
      setAddressError('')
    }
  }

  // Handle grant role
  const handleGrantRole = async () => {
    if (!newVerifierAddress || !verifierRole) return
    if (addressError) return

    try {
      console.log('Granting VERIFIER_ROLE to:', newVerifierAddress)
      
      writeContract({
        ...CONTRACTS.oracle,
        functionName: 'grantRole',
        args: [verifierRole, newVerifierAddress as `0x${string}`],
      })
    } catch (error) {
      console.error('Error granting role:', error)
      alert('Failed to grant verifier role')
    }
  }

  // Clear form on success
  useEffect(() => {
    if (isConfirmed) {
      setNewVerifierAddress('')
    }
  }, [isConfirmed])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Steward
              </span>
            </Link>
            <WalletConnectButton />
          </nav>
        </header>

        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="w-10 h-10 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Connect Your Wallet
            </h1>
            <p className="text-slate-600 mb-8">
              Please connect your wallet to access the admin dashboard.
            </p>
            <WalletConnectButton />
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Steward
              </span>
            </Link>
            <UserMenu />
          </nav>
        </header>

        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Access Denied
            </h1>
            <p className="text-slate-600 mb-8">
              You need administrator privileges to access this dashboard.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            </div>
            <UserMenu />
          </nav>
        </div>
      </header>

      {/* Success Notification */}
      {isConfirmed && hash && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Verifier Role Granted!</p>
                  <p className="text-sm text-green-700">
                    The address now has permission to verify organizations.
                  </p>
                </div>
              </div>
              <a
                href={getBlockExplorerUrl(hash)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-700 hover:text-green-900 underline"
              >
                View Transaction →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Info Banner */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <Crown className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-indigo-900 mb-2">Administrator Role</h3>
                <p className="text-indigo-700 text-sm">
                  As an administrator, you can grant verifier roles to trusted addresses. Verifiers
                  help maintain network integrity by reviewing and approving organization registrations.
                </p>
              </div>
            </div>
          </div>

          {/* Grant Verifier Role Form */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <UserPlus className="w-6 h-6 text-indigo-600" />
                <span>Grant Verifier Role</span>
              </h2>
              <p className="text-slate-600 mt-1">Add a new trusted verifier to the network</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {/* Address Input */}
                <div>
                  <label htmlFor="verifierAddress" className="block text-sm font-medium text-slate-700 mb-2">
                    Ethereum Address
                  </label>
                  <input
                    type="text"
                    id="verifierAddress"
                    value={newVerifierAddress}
                    onChange={handleAddressChange}
                    placeholder="0x..."
                    className={`w-full px-4 py-3 rounded-lg border ${
                      addressError ? 'border-red-300' : 'border-slate-300'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm`}
                  />
                  {addressError && (
                    <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{addressError}</span>
                    </p>
                  )}
                  <p className="mt-2 text-sm text-slate-500">
                    Enter the Ethereum address to grant verifier permissions
                  </p>
                </div>

                {/* Grant Button */}
                <button
                  onClick={handleGrantRole}
                  disabled={!newVerifierAddress || !!addressError || isWritePending || isConfirming}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-semibold"
                >
                  {(isWritePending || isConfirming) ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>Grant Verifier Role</span>
                    </>
                  )}
                </button>

                {/* Error Display */}
                {writeError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800">
                      <strong>Error:</strong> {writeError.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 text-sm">About Verifiers</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Verifiers review and approve organization registrations</li>
              <li>• Each organization requires 3 independent verifications</li>
              <li>• Admin-granted verifiers don&apos;t need to stake ETH</li>
              <li>• Verifiers help maintain the integrity of the Steward network</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Link
              href="/verifier-dashboard"
              className="p-4 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all text-center"
            >
              <Shield className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900">Verifier Dashboard</h3>
              <p className="text-xs text-slate-600 mt-1">View pending organizations</p>
            </Link>
            <Link
              href="/church-dashboard"
              className="p-4 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all text-center"
            >
              <Shield className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900">Church Dashboard</h3>
              <p className="text-xs text-slate-600 mt-1">Manage your organization</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

