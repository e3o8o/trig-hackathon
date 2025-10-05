'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi'
import { formatEther } from 'viem'
import Link from 'next/link'
import { Shield, ArrowLeft, Calendar, MapPin, DollarSign, Clock, AlertCircle, X, FileText, Loader2, CheckCircle, ExternalLink } from '@/components/Icons'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { UserMenu } from '@/components/UserMenu'
import { WalletConnectionCheck } from '@/components/WalletConnectionCheck'
import { CONTRACTS, getBlockExplorerUrl } from '@/config/contracts'

// ETH to USD conversion rate (same as other pages)
const ETH_TO_USD = 4608.59

interface Policy {
  policyId: number
  policyholder: string
  organization: string
  eventType: number
  eventName: string
  location: string
  startDate: bigint
  endDate: bigint
  coverageAmount: bigint
  premium: bigint
  coverageToken: string
  status: number // 0=ACTIVE, 1=CLAIMED, 2=EXPIRED, 3=CANCELLED
  purchaseTime: bigint
  trigConditionId: bigint
  claimSubmitted: boolean
  claimTime: bigint
  payoutAmount: bigint
}

const POLICY_STATUS = {
  0: 'Active',
  1: 'Claimed',
  2: 'Expired',
  3: 'Cancelled',
}

const STATUS_COLORS = {
  0: 'bg-green-100 text-green-700 border-green-200',
  1: 'bg-blue-100 text-blue-700 border-blue-200',
  2: 'bg-gray-100 text-gray-700 border-gray-200',
  3: 'bg-red-100 text-red-700 border-red-200',
}

const EVENT_TYPES = {
  0: 'Mission Trip',
  1: 'Church Event',
  2: 'Relief Operation',
  3: 'Construction Project',
  4: 'Medical Mission',
}

export default function MyProtections() {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const [policies, setPolicies] = useState<Policy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [claimAmount, setClaimAmount] = useState('')
  const [claimReason, setClaimReason] = useState('')
  const [isHydrated, setIsHydrated] = useState(false)
  const [refetchKey, setRefetchKey] = useState(0)

  // Hydration effect
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Transaction hooks
  const { data: hash, isPending: isWritePending, writeContract, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })
  
  const isProcessing = isWritePending || isConfirming

  // Get user's policy IDs
  const { data: policyIds, refetch: refetchPolicyIds } = useReadContract({
    ...CONTRACTS.mission,
    functionName: 'getHolderPolicies',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Fetch policy details
  useEffect(() => {
    const fetchPolicies = async () => {
      if (!policyIds || !publicClient || !Array.isArray(policyIds) || policyIds.length === 0) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const policyPromises = (policyIds as bigint[]).map(async (policyId) => {
          const policyData = await publicClient.readContract({
            ...CONTRACTS.mission,
            functionName: 'policies',
            args: [policyId],
          }) as any[]

          return {
            policyId: Number(policyId),
            policyholder: policyData[1],
            organization: policyData[2],
            eventType: Number(policyData[3]),
            eventName: policyData[4],
            location: policyData[5],
            startDate: policyData[6],
            endDate: policyData[7],
            coverageAmount: policyData[8],
            premium: policyData[9],
            coverageToken: policyData[10],
            status: Number(policyData[11]),
            purchaseTime: policyData[12],
            trigConditionId: policyData[13],
            claimSubmitted: policyData[14],
            claimTime: policyData[15],
            payoutAmount: policyData[16],
          } as Policy
        })

        const fetchedPolicies = await Promise.all(policyPromises)
        setPolicies(fetchedPolicies)
      } catch (error) {
        console.error('Error fetching policies:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPolicies()
  }, [policyIds, publicClient, refetchKey])

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && hash) {
      // Refresh policies after successful transaction
      refetchPolicyIds()
      setRefetchKey(prev => prev + 1)
      setShowClaimModal(false)
      setShowCancelModal(false)
      setSelectedPolicy(null)
      setClaimAmount('')
      setClaimReason('')
    }
  }, [isConfirmed, hash, refetchPolicyIds])

  // Display transaction errors
  useEffect(() => {
    if (writeError) {
      console.error('Transaction error:', writeError)
      alert(`Transaction failed: ${writeError.message || 'Unknown error'}`)
    }
  }, [writeError])

  const handleSubmitClaim = async () => {
    if (!selectedPolicy || !claimAmount || !claimReason) {
      alert('Please fill in all fields')
      return
    }

    const claimAmountETH = parseFloat(claimAmount)
    const maxCoverageETH = parseFloat(formatEther(selectedPolicy.coverageAmount))

    if (claimAmountETH > maxCoverageETH) {
      alert(`Claim amount cannot exceed coverage amount ($${(maxCoverageETH * ETH_TO_USD).toFixed(2)})`)
      return
    }

    try {
      writeContract({
        ...CONTRACTS.mission,
        functionName: 'submitClaim',
        args: [
          BigInt(selectedPolicy.policyId),
          selectedPolicy.coverageAmount, // Full coverage amount for simplicity
          claimReason,
        ],
      })
    } catch (error) {
      console.error('Error submitting claim:', error)
      alert('Failed to submit claim. Please try again.')
    }
  }

  const handleCancelPolicy = async () => {
    if (!selectedPolicy) return

    try {
      writeContract({
        ...CONTRACTS.mission,
        functionName: 'cancelPolicy',
        args: [BigInt(selectedPolicy.policyId)],
      })
    } catch (error) {
      console.error('Error cancelling policy:', error)
      alert('Failed to cancel policy. Please try again.')
    }
  }

  const canCancelPolicy = (policy: Policy) => {
    const now = BigInt(Math.floor(Date.now() / 1000))
    return policy.status === 0 && now < policy.startDate
  }

  const canSubmitClaim = (policy: Policy) => {
    const now = BigInt(Math.floor(Date.now() / 1000))
    const claimDeadline = policy.endDate + BigInt(30 * 24 * 60 * 60) // 30 days after end
    return policy.status === 0 && !policy.claimSubmitted && now >= policy.startDate && now <= claimDeadline
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Steward
            </span>
          </Link>
          {isHydrated && (isConnected ? <UserMenu /> : <WalletConnectButton />)}
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>

        {/* Page Title */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                My Protections
              </h1>
              <p className="text-lg text-slate-600">
                View and manage your mission trip insurance policies
              </p>
            </div>
          </div>
        </div>

        <WalletConnectionCheck>
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <span className="ml-3 text-slate-600">Loading your protections...</span>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && policies.length === 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">No Protections Yet</h2>
              <p className="text-slate-600 mb-6">
                You haven't purchased any mission trip protection policies yet.
              </p>
              <Link
                href="/mission-protection"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                <Shield className="w-5 h-5 mr-2" />
                Get Protected Now
              </Link>
            </div>
          )}

          {/* Policies Grid */}
          {!isLoading && policies.length > 0 && (
            <div className="space-y-6">
              {policies.map((policy) => {
                const coverageETH = parseFloat(formatEther(policy.coverageAmount))
                const coverageUSD = coverageETH * ETH_TO_USD
                const premiumETH = parseFloat(formatEther(policy.premium))
                const premiumUSD = premiumETH * ETH_TO_USD
                const startDate = new Date(Number(policy.startDate) * 1000)
                const endDate = new Date(Number(policy.endDate) * 1000)
                const purchaseDate = new Date(Number(policy.purchaseTime) * 1000)

                return (
                  <div
                    key={policy.policyId}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-slate-900">
                              {policy.eventName}
                            </h3>
                            <span className={`text-xs px-3 py-1 rounded-full border ${STATUS_COLORS[policy.status as keyof typeof STATUS_COLORS]}`}>
                              {POLICY_STATUS[policy.status as keyof typeof POLICY_STATUS]}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-slate-600">
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {policy.location}
                            </span>
                            <span className="flex items-center">
                              <Shield className="w-4 h-4 mr-1" />
                              {EVENT_TYPES[policy.eventType as keyof typeof EVENT_TYPES]}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-500">Policy #{policy.policyId}</div>
                          <div className="text-xs text-slate-400">
                            Purchased {purchaseDate.toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Coverage Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-indigo-50 rounded-lg p-4">
                          <div className="text-sm text-indigo-600 mb-1">Coverage</div>
                          <div className="text-lg font-bold text-indigo-900">
                            ${coverageUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className="text-xs text-indigo-600">
                            {coverageETH.toFixed(6)} ETH
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="text-sm text-green-600 mb-1">Premium Paid</div>
                          <div className="text-lg font-bold text-green-900">
                            ${premiumUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className="text-xs text-green-600">
                            {premiumETH.toFixed(6)} ETH
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="text-sm text-blue-600 mb-1">Start Date</div>
                          <div className="text-lg font-bold text-blue-900">
                            {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                          <div className="text-xs text-blue-600">
                            {startDate.getFullYear()}
                          </div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <div className="text-sm text-purple-600 mb-1">End Date</div>
                          <div className="text-lg font-bold text-purple-900">
                            {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                          <div className="text-xs text-purple-600">
                            {endDate.getFullYear()}
                          </div>
                        </div>
                      </div>

                      {/* Claim Info */}
                      {policy.claimSubmitted && (
                        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center space-x-2 text-yellow-800">
                            <Clock className="w-5 h-5" />
                            <span className="font-semibold">Claim Submitted</span>
                          </div>
                          <div className="text-sm text-yellow-700 mt-1">
                            Awaiting approval from church leadership
                          </div>
                        </div>
                      )}

                      {policy.status === 1 && policy.payoutAmount > BigInt(0) && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-2 text-green-800">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-semibold">Claim Paid</span>
                          </div>
                          <div className="text-sm text-green-700 mt-1">
                            Payout: ${(parseFloat(formatEther(policy.payoutAmount)) * ETH_TO_USD).toFixed(2)}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center space-x-3">
                        {canSubmitClaim(policy) && (
                          <button
                            onClick={() => {
                              setSelectedPolicy(policy)
                              setShowClaimModal(true)
                            }}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Submit Claim
                          </button>
                        )}
                        {canCancelPolicy(policy) && (
                          <button
                            onClick={() => {
                              setSelectedPolicy(policy)
                              setShowCancelModal(true)
                            }}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm flex items-center justify-center"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel Policy
                          </button>
                        )}
                        {policy.status === 0 && !canSubmitClaim(policy) && !canCancelPolicy(policy) && (
                          <div className="flex-1 text-center text-sm text-slate-500 py-2">
                            Policy is active
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </WalletConnectionCheck>
      </main>

      {/* Claim Modal */}
      {showClaimModal && selectedPolicy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Submit Insurance Claim</h2>
            
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600 mb-1">Policy Coverage</div>
              <div className="text-2xl font-bold text-blue-900">
                ${(parseFloat(formatEther(selectedPolicy.coverageAmount)) * ETH_TO_USD).toFixed(2)}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Claim Reason *
                </label>
                <textarea
                  value={claimReason}
                  onChange={(e) => setClaimReason(e.target.value)}
                  placeholder="Describe the reason for your claim..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Your claim will be reviewed by church leadership (requires 2 of 3 approvals)
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowClaimModal(false)
                  setClaimReason('')
                }}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitClaim}
                disabled={isProcessing || !claimReason}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 mr-2" />
                    Submit Claim
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedPolicy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Cancel Policy</h2>
            
            <div className="mb-6">
              <p className="text-slate-600 mb-4">
                Are you sure you want to cancel this policy?
              </p>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2 text-yellow-800">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-semibold mb-1">Cancellation Policy</div>
                    <div>You will receive a 90% refund of your premium.</div>
                    <div className="mt-2">
                      Refund Amount: ${((parseFloat(formatEther(selectedPolicy.premium)) * 0.9) * ETH_TO_USD).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors font-medium"
              >
                Keep Policy
              </button>
              <button
                onClick={handleCancelPolicy}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 mr-2" />
                    Cancel Policy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
