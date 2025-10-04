'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Church, 
  UserPlus, 
  UserCheck, 
  Shield,
  Award,
  Building,
  CheckCircle,
  Loader2,
  ExternalLink
} from '@/components/Icons'
import { WalletConnectButton } from '@/components/WalletConnectButton'

// Types
interface ChurchLeader {
  id: string
  address: string
  name: string
  role: string
  stakeAmount: string
  verifiedAt: string
  verificationsCount: number
  status: 'active' | 'pending' | 'inactive'
}

interface ChurchInfo {
  id: string
  name: string
  location: string
  denomination: string
  registeredAt: string
  totalLeaders: number
  totalTithesReceived: string
}

// Simulated church data - would come from blockchain in production
const SIMULATED_CHURCH: ChurchInfo = {
  id: 'CHURCH-001',
  name: 'Grace Community Church',
  location: 'Dallas, TX',
  denomination: 'Non-denominational',
  registeredAt: '2024-08-15',
  totalLeaders: 4,
  totalTithesReceived: '125000'
}

const SIMULATED_LEADERS: ChurchLeader[] = [
  {
    id: 'LEADER-001',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    name: 'Pastor Mike Thompson',
    role: 'Senior Pastor',
    stakeAmount: '1.0',
    verifiedAt: '2024-08-15',
    verificationsCount: 45,
    status: 'active'
  },
  {
    id: 'LEADER-002',
    address: '0x853f46Dd7724D1632936a4c855Cd9f906f3cDcE',
    name: 'Elder John Davis',
    role: 'Elder',
    stakeAmount: '0.1',
    verifiedAt: '2024-08-20',
    verificationsCount: 28,
    status: 'active'
  },
  {
    id: 'LEADER-003',
    address: '0x964g57Ee8835E2743047b5d966Dd0a017g4eEdF',
    name: 'Elder Sarah Martinez',
    role: 'Elder',
    stakeAmount: '0.1',
    verifiedAt: '2024-09-01',
    verificationsCount: 15,
    status: 'active'
  },
  {
    id: 'LEADER-004',
    address: '0xa75h68Ff9946F3854158c6e977Ee1b128h5fFeG',
    name: 'Deacon James Wilson',
    role: 'Deacon',
    stakeAmount: '0.05',
    verifiedAt: '2024-09-15',
    verificationsCount: 7,
    status: 'pending'
  }
]

export default function ChurchDashboard() {
  const { address, isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)
  const [showAddLeaderModal, setShowAddLeaderModal] = useState(false)
  const [leaders, setLeaders] = useState<ChurchLeader[]>(SIMULATED_LEADERS)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending'>('all')
  
  // Fix hydration error by only rendering after client mount
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Add leader form state
  const [newLeader, setNewLeader] = useState({
    address: '',
    name: '',
    role: 'Elder',
    stakeAmount: '0.1'
  })

  const { 
    data: hash,
    isPending: isWriting,
    writeContract 
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleAddLeader = () => {
    if (!newLeader.address || !newLeader.name) return

    // Simulate blockchain transaction
    // In production, this would call a smart contract
    const mockLeader: ChurchLeader = {
      id: `LEADER-${Date.now()}`,
      address: newLeader.address,
      name: newLeader.name,
      role: newLeader.role,
      stakeAmount: newLeader.stakeAmount,
      verifiedAt: new Date().toISOString().split('T')[0],
      verificationsCount: 0,
      status: 'pending'
    }

    setLeaders([...leaders, mockLeader])
    setShowAddLeaderModal(false)
    
    // Reset form
    setNewLeader({
      address: '',
      name: '',
      role: 'Elder',
      stakeAmount: '0.1'
    })
  }

  const filteredLeaders = leaders.filter(leader => {
    if (filterStatus === 'all') return true
    return leader.status === filterStatus
  })

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Home</span>
              </Link>
            </div>
            <WalletConnectButton />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Building className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                Church Dashboard
              </h1>
              <p className="text-slate-600 mt-1">
                Manage your church leaders and verify their credentials
              </p>
            </div>
          </div>
        </div>

        {/* Church Info Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
                <Church className="w-6 h-6 text-indigo-600" />
                <span>{SIMULATED_CHURCH.name}</span>
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Location</span>
                  <span className="font-medium text-slate-900">{SIMULATED_CHURCH.location}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Denomination</span>
                  <span className="font-medium text-slate-900">{SIMULATED_CHURCH.denomination}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Registered</span>
                  <span className="font-medium text-slate-900">{SIMULATED_CHURCH.registeredAt}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-600">Church ID</span>
                  <span className="font-mono text-sm text-slate-900">{SIMULATED_CHURCH.id}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                <div className="text-3xl font-bold text-indigo-600 mb-1">
                  {SIMULATED_CHURCH.totalLeaders}
                </div>
                <div className="text-sm text-slate-600 font-medium">Verified Leaders</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  ${(parseInt(SIMULATED_CHURCH.totalTithesReceived) / 1000).toFixed(0)}k
                </div>
                <div className="text-sm text-slate-600 font-medium">Total Tithes</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {leaders.filter(l => l.status === 'active').length}
                </div>
                <div className="text-sm text-slate-600 font-medium">Active Leaders</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                <div className="text-3xl font-bold text-amber-600 mb-1">
                  {leaders.filter(l => l.status === 'pending').length}
                </div>
                <div className="text-sm text-slate-600 font-medium">Pending</div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaders Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Section Header */}
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">Church Leaders</h2>
                <p className="text-slate-600">Manage and verify church leadership</p>
              </div>
              <button
                onClick={() => setShowAddLeaderModal(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <UserPlus className="w-5 h-5" />
                <span>Add Leader</span>
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-6 pt-6 flex items-center space-x-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({leaders.length})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Active ({leaders.filter(l => l.status === 'active').length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pending ({leaders.filter(l => l.status === 'pending').length})
            </button>
          </div>

          {/* Leaders List */}
          <div className="p-6">
            {!mounted ? (
              <div className="text-center py-12">
                <Loader2 className="w-16 h-16 text-slate-300 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Loading...
                </h3>
                <p className="text-slate-600">
                  Checking wallet connection
                </p>
              </div>
            ) : !isConnected ? (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Connect Your Wallet
                </h3>
                <p className="text-slate-600 mb-6">
                  Please connect your wallet to view and manage church leaders
                </p>
                <WalletConnectButton />
              </div>
            ) : filteredLeaders.length === 0 ? (
              <div className="text-center py-12">
                <UserCheck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  No Leaders Found
                </h3>
                <p className="text-slate-600">
                  No leaders match the selected filter
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLeaders.map((leader) => (
                  <div
                    key={leader.id}
                    className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`p-3 rounded-xl ${
                          leader.status === 'active' 
                            ? 'bg-green-100' 
                            : 'bg-amber-100'
                        }`}>
                          {leader.status === 'active' ? (
                            <UserCheck className="w-6 h-6 text-green-600" />
                          ) : (
                            <UserPlus className="w-6 h-6 text-amber-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-900">
                              {leader.name}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              leader.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {leader.status === 'active' ? 'Active' : 'Pending'}
                            </span>
                            {leader.role === 'Senior Pastor' && (
                              <Award className="w-5 h-5 text-indigo-600" />
                            )}
                          </div>
                          
                          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div>
                              <div className="text-xs text-slate-500 mb-1">Role</div>
                              <div className="text-sm font-medium text-slate-900">{leader.role}</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 mb-1">Wallet Address</div>
                              <div className="text-sm font-mono text-slate-900 flex items-center space-x-1">
                                <span>{formatAddress(leader.address)}</span>
                                <button className="text-indigo-600 hover:text-indigo-700">
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 mb-1">Stake Amount</div>
                              <div className="text-sm font-medium text-slate-900">{leader.stakeAmount} ETH</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 mb-1">Verified At</div>
                              <div className="text-sm font-medium text-slate-900">{leader.verifiedAt}</div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                              <Shield className="w-4 h-4 text-indigo-600" />
                              <span className="text-sm text-slate-600">
                                <span className="font-semibold text-slate-900">{leader.verificationsCount}</span> verifications
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-slate-600">
                                <span className="font-semibold text-slate-900">{leader.stakeAmount}</span> ETH staked
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        {leader.status === 'pending' && (
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                            Approve
                          </button>
                        )}
                        <button className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Leader Modal */}
      {showAddLeaderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Add Church Leader</h2>
              <button
                onClick={() => setShowAddLeaderModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> Adding a leader requires them to stake ETH as collateral. 
                  This ensures accountability in the verification process.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Leader's Wallet Address *
                </label>
                <input
                  type="text"
                  value={newLeader.address}
                  onChange={(e) => setNewLeader({ ...newLeader, address: e.target.value })}
                  placeholder="0x..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Leader's Full Name *
                </label>
                <input
                  type="text"
                  value={newLeader.name}
                  onChange={(e) => setNewLeader({ ...newLeader, name: e.target.value })}
                  placeholder="e.g., John Smith"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Role *
                </label>
                <select
                  value={newLeader.role}
                  onChange={(e) => setNewLeader({ ...newLeader, role: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Senior Pastor">Senior Pastor</option>
                  <option value="Associate Pastor">Associate Pastor</option>
                  <option value="Elder">Elder</option>
                  <option value="Deacon">Deacon</option>
                  <option value="Board Member">Board Member</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Required Stake Amount (ETH) *
                </label>
                <select
                  value={newLeader.stakeAmount}
                  onChange={(e) => setNewLeader({ ...newLeader, stakeAmount: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="1.0">1.0 ETH (Senior Pastor)</option>
                  <option value="0.5">0.5 ETH (Associate Pastor)</option>
                  <option value="0.1">0.1 ETH (Elder/Deacon)</option>
                  <option value="0.05">0.05 ETH (Board Member)</option>
                </select>
                <p className="text-sm text-slate-500 mt-2">
                  The leader will need to stake this amount to be verified
                </p>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleAddLeader}
                  disabled={!newLeader.address || !newLeader.name}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Invitation
                </button>
                <button
                  onClick={() => setShowAddLeaderModal(false)}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
