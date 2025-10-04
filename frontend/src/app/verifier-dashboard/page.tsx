'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Shield, 
  CheckCircle, 
  Clock,
  Loader2,
  Church,
  AlertCircle
} from '@/components/Icons'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { UserMenu } from '@/components/UserMenu'
import { CONTRACTS, getBlockExplorerUrl } from '@/config/contracts'

interface OrganizationData {
  address: string
  name: string
  description: string
  website: string
  registrationTime: bigint
  status: number
  stakeAmount: bigint
  reputationScore: bigint
  verifierCount: bigint
}

export default function VerifierDashboard() {
  const { address, isConnected } = useAccount()
  const [organizations, setOrganizations] = useState<OrganizationData[]>([])
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(true)
  const [processingOrgAddress, setProcessingOrgAddress] = useState<string | null>(null)

  // Check if user is a verifier
  const { data: verifierRole } = useReadContract({
    ...CONTRACTS.oracle,
    functionName: 'VERIFIER_ROLE',
  })

  const { data: isVerifier } = useReadContract({
    ...CONTRACTS.oracle,
    functionName: 'hasRole',
    args: verifierRole && address ? [verifierRole, address] : undefined,
    query: {
      enabled: !!verifierRole && !!address,
    },
  })

  // Get organization count
  const { data: orgCount } = useReadContract({
    ...CONTRACTS.oracle,
    functionName: 'getOrganizationCount',
  })

  // Get required verifications
  const { data: requiredVerifications } = useReadContract({
    ...CONTRACTS.oracle,
    functionName: 'requiredVerifications',
  })

  // Query the Test organization info
  const TEST_ORG_ADDRESS = '0xd591Ea697A2530a45133fFD949ffD8C9bE20706b'
  const { data: testOrgInfo } = useReadContract({
    ...CONTRACTS.oracle,
    functionName: 'getOrganization',
    args: [TEST_ORG_ADDRESS as `0x${string}`],
  })

  // Transaction hooks
  const { data: hash, isPending: isWritePending, writeContract, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  // Load organizations
  useEffect(() => {
    // Simplified: Just mark as loaded
    // In production, you'd use an indexer/subgraph to load org addresses
    if (orgCount !== undefined) {
      setIsLoadingOrgs(false)
    }
  }, [orgCount])

  // Handle verification
  const handleVerifyOrganization = async (orgAddress: string) => {
    if (!address) return

    try {
      setProcessingOrgAddress(orgAddress)
      
      console.log('Verifying organization:', orgAddress)
      
      writeContract({
        ...CONTRACTS.oracle,
        functionName: 'verifyOrganization',
        args: [orgAddress as `0x${string}`],
      })
    } catch (error) {
      console.error('Error verifying organization:', error)
      alert('Failed to verify organization')
      setProcessingOrgAddress(null)
    }
  }

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && hash) {
      console.log('Verification confirmed! Transaction:', hash)
      setProcessingOrgAddress(null)
      
      // Wait 2 seconds to allow blockchain state to update, then reload
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  }, [isConfirmed, hash])

  // Handle transaction errors
  useEffect(() => {
    if (writeError) {
      console.error('Transaction error:', writeError)
      setProcessingOrgAddress(null)
    }
  }, [writeError])

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
              <Shield className="w-10 h-10 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Connect Your Wallet
            </h1>
            <p className="text-slate-600 mb-8">
              Please connect your wallet to access the verifier dashboard.
            </p>
            <WalletConnectButton />
          </div>
        </div>
      </div>
    )
  }

  if (!isVerifier) {
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
              Not a Verifier
            </h1>
            <p className="text-slate-600 mb-8">
              You need to be registered as a verifier to access this dashboard.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
              <h3 className="font-semibold text-slate-900 mb-2">How to become a verifier:</h3>
              <ol className="list-decimal list-inside space-y-2 text-slate-700">
                <li>Stake 0.00005 ETH to register as a verifier</li>
                <li>Or contact an admin to grant you verifier role</li>
                <li>Once registered, you can verify organizations</li>
              </ol>
            </div>
            <Link
              href="/"
              className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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
              <h1 className="text-2xl font-bold text-slate-900">Verifier Dashboard</h1>
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
                  <p className="font-semibold text-green-900">Verification Complete!</p>
                  <p className="text-sm text-green-700">
                    Your verification has been recorded on the blockchain.
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
        {/* Info Banner */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-indigo-900 mb-2">Verifier Role</h3>
              <p className="text-indigo-700 text-sm">
                As a verifier, you help maintain the integrity of the Steward network by reviewing and
                verifying church registrations. Organizations need {requiredVerifications?.toString() || '3'} independent
                verifications before they can receive tithes.
              </p>
            </div>
          </div>
        </div>

        {/* Organizations List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Pending Organizations</h2>
            <p className="text-slate-600 mt-1">Review and verify registered churches</p>
          </div>

          <div className="p-6">
            {isLoadingOrgs ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
                <p className="text-slate-600">Loading organizations...</p>
              </div>
            ) : orgCount === 0n || orgCount === 0 ? (
              <div className="text-center py-12">
                <Church className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Organizations Yet</h3>
                <p className="text-slate-600">
                  No churches have registered yet. Check back later!
                </p>
              </div>
            ) : testOrgInfo ? (
              <div className="space-y-4">
                {/* Organization Card */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        {testOrgInfo[0] || 'Test'}
                      </h3>
                      <p className="text-sm text-slate-600 mb-2">
                        {testOrgInfo[1] || 'Organization'}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        {TEST_ORG_ADDRESS.slice(0, 10)}...{TEST_ORG_ADDRESS.slice(-8)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        {Number(testOrgInfo[4]) === 0 ? 'PENDING' : 
                         Number(testOrgInfo[4]) === 1 ? 'VERIFIED' : 
                         'SUSPENDED'}
                      </div>
                      <p className="text-xs text-slate-600 mt-2">
                        {testOrgInfo[8]?.toString() || '0'}/{requiredVerifications?.toString() || '3'} verifications
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">Stake:</span> {testOrgInfo[5] ? (Number(testOrgInfo[5]) / 1e18).toFixed(5) : '0'} ETH
                    </div>
                    <button
                      onClick={() => handleVerifyOrganization(TEST_ORG_ADDRESS)}
                      disabled={isWritePending || isConfirming || isConfirmed || Number(testOrgInfo[4]) === 1}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {(isWritePending || isConfirming || isConfirmed) ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{isConfirmed ? 'Success! Reloading...' : 'Verifying...'}</span>
                        </>
                      ) : Number(testOrgInfo[4]) === 1 ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Already Verified</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Verify Organization</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
                <p className="text-slate-600">Loading organization...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

