'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi'
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
  const publicClient = usePublicClient()
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

  // Transaction hooks
  const { data: hash, isPending: isWritePending, writeContract, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  // Load all organizations
  useEffect(() => {
    async function loadOrganizations() {
      if (!publicClient || !orgCount) return
      
      setIsLoadingOrgs(true)
      try {
        const count = Number(orgCount)
        const orgs: OrganizationData[] = []
        
        // Loop through all organizations
        for (let i = 0; i < count; i++) {
          try {
            // Get organization address from list
            const orgAddress = await publicClient.readContract({
              address: CONTRACTS.oracle.address as `0x${string}`,
              abi: CONTRACTS.oracle.abi,
              functionName: 'organizationList',
              args: [BigInt(i)],
            }) as `0x${string}`
            
            // Get full organization info
            const orgInfo = await publicClient.readContract({
              address: CONTRACTS.oracle.address as `0x${string}`,
              abi: CONTRACTS.oracle.abi,
              functionName: 'getOrganization',
              args: [orgAddress],
            }) as any[]
            
            // Parse organization data
            orgs.push({
              address: orgAddress,
              name: orgInfo[0] as string,
              description: orgInfo[1] as string,
              website: orgInfo[2] as string,
              registrationTime: orgInfo[3] as bigint,
              status: Number(orgInfo[4]),
              stakeAmount: orgInfo[5] as bigint,
              reputationScore: orgInfo[6] as bigint,
              verifierCount: orgInfo[8] as bigint,
            })
          } catch (err) {
            console.error(`Error loading organization ${i}:`, err)
          }
        }
        
        setOrganizations(orgs)
      } catch (error) {
        console.error('Error loading organizations:', error)
      } finally {
        setIsLoadingOrgs(false)
      }
    }

    loadOrganizations()
  }, [publicClient, orgCount])

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

        {/* Active Verifiers Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Active Verifiers</h2>
            <p className="text-slate-600 mt-1">Addresses authorized to verify organizations</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {/* Note about verifiers */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Total Verifiers:</strong> 3 active verifiers in the network
                </p>
              </div>
              
              {/* Known Verifiers List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm font-mono text-slate-700">0xd591...706b</p>
                      <p className="text-xs text-slate-500">Verifier #1 (Deployer)</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm font-mono text-slate-700">0xd7fb...0f27</p>
                      <p className="text-xs text-slate-500">Verifier #2</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </div>
                </div>

                {isConnected && address && (
                  <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="text-sm font-mono text-slate-700">{address.slice(0, 6)}...{address.slice(-4)}</p>
                        <p className="text-xs text-slate-500">Your Wallet</p>
                      </div>
                    </div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${isVerifier ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {isVerifier ? 'Active Verifier' : 'Not a Verifier'}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-200">
                <Link 
                  href="/admin"
                  className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                >
                  <span>Grant verifier role to new addresses</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Organizations List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">All Organizations</h2>
            <p className="text-slate-600 mt-1">All registered churches (pending and verified)</p>
          </div>

          <div className="p-6">
            {isLoadingOrgs ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
                <p className="text-slate-600">Loading organizations...</p>
              </div>
            ) : organizations.length === 0 ? (
              <div className="text-center py-12">
                <Church className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Organizations Yet</h3>
                <p className="text-slate-600">
                  No churches have registered yet. Check back later!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Pending Organizations */}
                {organizations.filter(org => org.status === 0).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <span>Pending Verification ({organizations.filter(org => org.status === 0).length})</span>
                    </h3>
                    <div className="space-y-4">
                      {organizations.filter(org => org.status === 0).map((org) => {
                        const isProcessing = processingOrgAddress === org.address
                        return (
                          <div key={org.address} className="bg-white border-2 border-yellow-200 rounded-lg p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                                  {org.name || 'Unnamed Organization'}
                                </h3>
                                <p className="text-sm text-slate-600 mb-2">
                                  {org.description || 'No description provided'}
                                </p>
                                <p className="text-xs text-slate-500 font-mono">
                                  {org.address.slice(0, 10)}...{org.address.slice(-8)}
                                </p>
                                {org.website && (
                                  <a 
                                    href={org.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-indigo-600 hover:text-indigo-800 mt-1 inline-block"
                                  >
                                    Visit Website →
                                  </a>
                                )}
                              </div>
                              <div className="text-right ml-4">
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                  PENDING
                                </div>
                                <p className="text-xs text-slate-600 mt-2">
                                  {org.verifierCount.toString()}/{requiredVerifications?.toString() || '3'} verifications
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                              <div className="text-sm text-slate-600 space-y-1">
                                <div>
                                  <span className="font-medium">Stake:</span> {(Number(org.stakeAmount) / 1e18).toFixed(5)} ETH
                                </div>
                                <div>
                                  <span className="font-medium">Reputation:</span> {org.reputationScore.toString()}
                                </div>
                              </div>
                              <button
                                onClick={() => handleVerifyOrganization(org.address)}
                                disabled={isProcessing}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                              >
                                {isProcessing && (isWritePending || isConfirming || isConfirmed) ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>{isConfirmed ? 'Success! Reloading...' : 'Verifying...'}</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Verify</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Verified Organizations */}
                {organizations.filter(org => org.status === 1).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Verified Organizations ({organizations.filter(org => org.status === 1).length})</span>
                    </h3>
                    <div className="space-y-4">
                      {organizations.filter(org => org.status === 1).map((org) => (
                    <div key={org.address} className="bg-white border-2 border-green-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 mb-1">
                            {org.name || 'Unnamed Organization'}
                          </h3>
                          <p className="text-sm text-slate-600 mb-2">
                            {org.description || 'No description provided'}
                          </p>
                          <p className="text-xs text-slate-500 font-mono">
                            {org.address.slice(0, 10)}...{org.address.slice(-8)}
                          </p>
                          {org.website && (
                            <a 
                              href={org.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-indigo-600 hover:text-indigo-800 mt-1 inline-block"
                            >
                              Visit Website →
                            </a>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            ✓ VERIFIED
                          </div>
                          <p className="text-xs text-slate-600 mt-2">
                            {org.verifierCount.toString()}/{requiredVerifications?.toString() || '3'} verifications
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="text-sm text-slate-600 space-y-1">
                          <div>
                            <span className="font-medium">Stake:</span> {(Number(org.stakeAmount) / 1e18).toFixed(5)} ETH
                          </div>
                          <div>
                            <span className="font-medium">Reputation:</span> {org.reputationScore.toString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Fully Verified</span>
                        </div>
                      </div>
                    </div>
                  ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

