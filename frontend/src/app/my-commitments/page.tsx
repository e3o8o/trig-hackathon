'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Heart, 
  Church, 
  DollarSign, 
  Calendar,
  Pause,
  Play,
  Edit,
  CheckCircle,
  Spinner
} from '@/components/Icons'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { UserMenu } from '@/components/UserMenu'

// Types
interface TitheCommitment {
  id: string
  churchId: string
  churchName: string
  churchLocation: string
  incomeThreshold: string
  tithePercentage: string
  offeringPercentage: string
  frequency: string
  status: 'active' | 'paused'
  createdAt: string
  lastExecuted: string | null
  nextExecution: string | null
  totalGiven: string
  executionCount: number
}

// Simulated data - would come from blockchain in production
const SIMULATED_COMMITMENTS: TitheCommitment[] = [
  {
    id: 'TITHE-1728234567890',
    churchId: 'CHURCH-001',
    churchName: 'Grace Community Church',
    churchLocation: 'Dallas, TX',
    incomeThreshold: '8000',
    tithePercentage: '10',
    offeringPercentage: '5',
    frequency: 'monthly',
    status: 'active',
    createdAt: '2024-09-15',
    lastExecuted: '2024-10-01',
    nextExecution: '2024-11-01',
    totalGiven: '3600',
    executionCount: 3
  },
  {
    id: 'TITHE-1728234567891',
    churchId: 'CHURCH-002',
    churchName: 'First Baptist Church',
    churchLocation: 'Austin, TX',
    incomeThreshold: '5000',
    tithePercentage: '10',
    offeringPercentage: '0',
    frequency: 'biweekly',
    status: 'active',
    createdAt: '2024-08-20',
    lastExecuted: '2024-09-28',
    nextExecution: '2024-10-12',
    totalGiven: '2000',
    executionCount: 4
  }
]

export default function MyCommitmentsPage() {
  const { address, isConnected } = useAccount()
  const [commitments, setCommitments] = useState<TitheCommitment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load commitments on mount
  useEffect(() => {
    if (isConnected && address) {
      // Simulate loading from blockchain
      setTimeout(() => {
        setCommitments(SIMULATED_COMMITMENTS)
        setIsLoading(false)
      }, 1000)
    }
  }, [isConnected, address])

  // Calculate totals
  const calculateCommitmentTotals = (commitment: TitheCommitment) => {
    const income = parseFloat(commitment.incomeThreshold)
    const tithe = (income * parseFloat(commitment.tithePercentage)) / 100
    const offering = (income * parseFloat(commitment.offeringPercentage)) / 100
    return {
      tithe,
      offering,
      total: tithe + offering,
      monthly: tithe + offering,
      yearly: (tithe + offering) * 12
    }
  }

  // Toggle commitment status
  const toggleCommitmentStatus = (commitmentId: string) => {
    setCommitments(commitments.map(c => {
      if (c.id === commitmentId) {
        return {
          ...c,
          status: c.status === 'active' ? 'paused' : 'active'
        }
      }
      return c
    }))
  }

  // Format currency
  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Calculate summary stats
  const summaryStats = {
    totalCommitments: commitments.length,
    activeCommitments: commitments.filter(c => c.status === 'active').length,
    totalGiven: commitments.reduce((sum, c) => sum + parseFloat(c.totalGiven), 0),
    monthlyCommitment: commitments
      .filter(c => c.status === 'active')
      .reduce((sum, c) => sum + calculateCommitmentTotals(c).monthly, 0)
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-6 h-6 text-slate-600" />
              <span className="text-slate-600">Back to Home</span>
            </Link>
            {isConnected ? <UserMenu /> : <WalletConnectButton />}
          </nav>
        </header>

        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Connect Your Wallet
            </h1>
            <p className="text-slate-600 mb-8">
              Please connect your wallet to view your tithe commitments and giving history.
            </p>
            <WalletConnectButton />
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
              <h1 className="text-2xl font-bold text-slate-900">My Commitments</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/giving-history" 
                className="px-4 py-2 text-slate-700 hover:text-indigo-600 transition-colors font-medium"
              >
                View History
              </Link>
              <Link 
                href="/create-tithe" 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                + New Commitment
              </Link>
              {isConnected ? <UserMenu /> : <WalletConnectButton />}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner className="w-12 h-12 text-indigo-600" />
          </div>
        ) : commitments.length === 0 ? (
          // Empty State
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              No Commitments Yet
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Start your faithful stewardship journey by creating your first tithe commitment.
            </p>
            <Link 
              href="/create-tithe" 
              className="inline-flex items-center space-x-2 px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Heart className="w-5 h-5" />
              <span className="font-semibold">Create First Commitment</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Total Commitments</span>
                  <Heart className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900">{summaryStats.totalCommitments}</div>
                <div className="text-sm text-slate-500 mt-1">
                  {summaryStats.activeCommitments} active
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Total Given</span>
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900">
                  {formatCurrency(summaryStats.totalGiven)}
                </div>
                <div className="text-sm text-slate-500 mt-1">Lifetime</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Monthly Commitment</span>
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900">
                  {formatCurrency(summaryStats.monthlyCommitment)}
                </div>
                <div className="text-sm text-slate-500 mt-1">Per month</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Yearly Impact</span>
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900">
                  {formatCurrency(summaryStats.monthlyCommitment * 12)}
                </div>
                <div className="text-sm text-slate-500 mt-1">Projected</div>
              </div>
            </div>

            {/* Commitments List */}
            <div className="space-y-6">
              {commitments.map((commitment) => {
                const totals = calculateCommitmentTotals(commitment)
                const isPaused = commitment.status === 'paused'

                return (
                  <div 
                    key={commitment.id} 
                    className={`bg-white rounded-xl shadow-md border-2 transition-all ${
                      isPaused 
                        ? 'border-slate-200 opacity-75' 
                        : 'border-indigo-200 hover:shadow-lg'
                    }`}
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start space-x-4">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                            isPaused ? 'bg-slate-100' : 'bg-indigo-100'
                          }`}>
                            <Church className={`w-8 h-8 ${
                              isPaused ? 'text-slate-400' : 'text-indigo-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">
                              {commitment.churchName}
                            </h3>
                            <p className="text-slate-600 mb-2">{commitment.churchLocation}</p>
                            <div className="flex items-center space-x-3">
                              <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                                commitment.status === 'active' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {commitment.status === 'active' ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <Pause className="w-4 h-4" />
                                )}
                                <span className="capitalize">{commitment.status}</span>
                              </span>
                              <span className="text-sm text-slate-500">
                                ID: {commitment.id}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleCommitmentStatus(commitment.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              isPaused 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                            title={isPaused ? 'Resume' : 'Pause'}
                          >
                            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                          </button>
                          <button className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                            <Edit className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Commitment Details */}
                      <div className="grid md:grid-cols-3 gap-6 mb-6">
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                            Income & Giving
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600">Income Threshold:</span>
                              <span className="font-semibold text-slate-900">
                                {formatCurrency(commitment.incomeThreshold)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600">Tithe ({commitment.tithePercentage}%):</span>
                              <span className="font-semibold text-green-600">
                                {formatCurrency(totals.tithe)}
                              </span>
                            </div>
                            {parseFloat(commitment.offeringPercentage) > 0 && (
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600">Offering ({commitment.offeringPercentage}%):</span>
                                <span className="font-semibold text-blue-600">
                                  {formatCurrency(totals.offering)}
                                </span>
                              </div>
                            )}
                            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                              <span className="font-semibold text-slate-900">Total:</span>
                              <span className="font-bold text-indigo-600">
                                {formatCurrency(totals.total)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                            Execution History
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600">Frequency:</span>
                              <span className="font-semibold text-slate-900 capitalize">
                                {commitment.frequency}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600">Times Executed:</span>
                              <span className="font-semibold text-slate-900">
                                {commitment.executionCount}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600">Last Executed:</span>
                              <span className="font-semibold text-slate-900">
                                {commitment.lastExecuted ? formatDate(commitment.lastExecuted) : 'Never'}
                              </span>
                            </div>
                            {commitment.nextExecution && (
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600">Next Expected:</span>
                                <span className="font-semibold text-indigo-600">
                                  {formatDate(commitment.nextExecution)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                            Impact Summary
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600">Total Given:</span>
                              <span className="font-bold text-green-600">
                                {formatCurrency(commitment.totalGiven)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600">Yearly Commitment:</span>
                              <span className="font-semibold text-slate-900">
                                {formatCurrency(totals.yearly)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600">Started:</span>
                              <span className="font-semibold text-slate-900">
                                {formatDate(commitment.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>

    </div>
  )
}

function TrendingUp({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}
