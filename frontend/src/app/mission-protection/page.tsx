'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import Link from 'next/link'
import { ArrowLeft, Shield, Plane, CheckCircle, Loader2, Calendar, MapPin, DollarSign, AlertTriangle, Info, Globe, Church, Users } from '@/components/Icons'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { UserMenu } from '@/components/UserMenu'
import { WalletConnectionCheck } from '@/components/WalletConnectionCheck'
import { CONTRACTS, getBlockExplorerUrl } from '@/config/contracts'
import { useVerifiedOrganizations } from '@/hooks/useVerifiedOrganizations'

// ETH to USD conversion rate (same as other pages)
const ETH_TO_USD = 4608.59

interface ProtectionFormData {
  destination: string
  country: string
  startDate: string
  endDate: string
  coverageAmount: string
  tripPurpose: string
  churchId: string // Required: Verified church for leader claim approval
}

// Verified churches from Epic 3.1 (same as Create Tithe)
// TODO: Replace with blockchain query in production:
// const { data: churches } = useReadContract({
//   address: CHURCH_REGISTRY_CONTRACT,
//   abi: churchRegistryAbi,
//   functionName: 'getVerifiedChurches'
// })
// This static list is for demo/development purposes only
// Using valid Ethereum addresses for testing
const VERIFIED_CHURCHES = [
  {
    id: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    name: 'Grace Community Church',
    location: 'Dallas, TX',
    denomination: 'Non-denominational',
    verified: true
  },
  {
    id: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    name: 'First Baptist Church',
    location: 'Austin, TX',
    denomination: 'Baptist',
    verified: true
  },
  {
    id: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    name: 'New Hope Fellowship',
    location: 'Houston, TX',
    denomination: 'Pentecostal',
    verified: true
  },
  {
    id: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    name: 'Covenant Presbyterian Church',
    location: 'San Antonio, TX',
    denomination: 'Presbyterian',
    verified: true
  },
  {
    id: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    name: 'Living Word Church',
    location: 'Fort Worth, TX',
    denomination: 'Non-denominational',
    verified: true
  },
  {
    id: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    name: 'St. Michael\'s Catholic Church',
    location: 'Dallas, TX',
    denomination: 'Catholic',
    verified: true
  },
  {
    id: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
    name: 'Christ the King Lutheran',
    location: 'Plano, TX',
    denomination: 'Lutheran',
    verified: true
  },
  {
    id: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
    name: 'Cornerstone Assembly',
    location: 'Irving, TX',
    denomination: 'Assemblies of God',
    verified: true
  }
]

// Popular mission trip destinations with risk assessment
const DESTINATIONS = [
  { country: 'Kenya', region: 'East Africa', riskLevel: 'Medium', baseRate: 0.08 },
  { country: 'Haiti', region: 'Caribbean', riskLevel: 'High', baseRate: 0.12 },
  { country: 'India', region: 'South Asia', riskLevel: 'Medium', baseRate: 0.07 },
  { country: 'Mexico', region: 'Central America', riskLevel: 'Low', baseRate: 0.05 },
  { country: 'Philippines', region: 'Southeast Asia', riskLevel: 'Medium', baseRate: 0.08 },
  { country: 'Brazil', region: 'South America', riskLevel: 'Medium', baseRate: 0.09 },
  { country: 'Uganda', region: 'East Africa', riskLevel: 'Medium', baseRate: 0.08 },
  { country: 'Honduras', region: 'Central America', riskLevel: 'Medium', baseRate: 0.07 },
  { country: 'Peru', region: 'South America', riskLevel: 'Low', baseRate: 0.06 },
  { country: 'Thailand', region: 'Southeast Asia', riskLevel: 'Low', baseRate: 0.05 },
  { country: 'Guatemala', region: 'Central America', riskLevel: 'Medium', baseRate: 0.07 },
  { country: 'Colombia', region: 'South America', riskLevel: 'Medium', baseRate: 0.09 },
  { country: 'South Africa', region: 'Southern Africa', riskLevel: 'Medium', baseRate: 0.08 },
  { country: 'Nicaragua', region: 'Central America', riskLevel: 'High', baseRate: 0.11 },
  { country: 'Cambodia', region: 'Southeast Asia', riskLevel: 'Low', baseRate: 0.06 }
]

const COVERAGE_OPTIONS = [
  { value: '50', label: '$50 - Demo Protection (~$1 premium) 🎯' },
  { value: '1000', label: '$1,000 - Basic Protection' },
  { value: '2000', label: '$2,000 - Standard Protection' },
  { value: '3000', label: '$3,000 - Enhanced Protection' },
  { value: '5000', label: '$5,000 - Premium Protection' },
  { value: '10000', label: '$10,000 - Maximum Protection' }
]

const TRIP_PURPOSES = [
  'Medical Mission',
  'Church Planting',
  'Construction/Building',
  'Teaching/Education',
  'Youth Ministry',
  'Disaster Relief',
  'Evangelism',
  'Other Ministry'
]

export default function MissionProtection() {
  const { address, isConnected } = useAccount()
  const [step, setStep] = useState<'destination' | 'dates' | 'coverage' | 'review' | 'success'>('destination')
  const [policyId, setPolicyId] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isHydrated, setIsHydrated] = useState(false)
  
  const [formData, setFormData] = useState<ProtectionFormData>({
    destination: '',
    country: '',
    startDate: '',
    endDate: '',
    coverageAmount: '',
    tripPurpose: '',
    churchId: ''
  })

  // Hydration effect
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Get verified organizations from blockchain
  const { organizations, isLoading: isLoadingOrgs } = useVerifiedOrganizations()
  
  // For demo: use verified orgs if available, fallback to mock
  const churches = organizations.length > 0 ? organizations.map(org => ({
    id: org.address,
    name: org.name,
    location: org.address.slice(0, 10) + '...',
    denomination: 'Verified',
    verified: org.verified
  })) : VERIFIED_CHURCHES

  // Transaction hooks
  const { data: hash, isPending: isWritePending, writeContract, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })
  
  const isProcessing = isWritePending || isConfirming

  // Calculate coverage in ETH for contract calls
  const coverageUSD = parseFloat(formData.coverageAmount || '0')
  const coverageETH = coverageUSD > 0 ? coverageUSD / ETH_TO_USD : 0

  // Fetch exact premium from contract to ensure it matches
  const { data: contractPremium } = useReadContract({
    ...CONTRACTS.mission,
    functionName: 'calculatePremium',
    args: coverageETH > 0 ? [parseEther(coverageETH.toString())] : undefined,
    query: {
      enabled: coverageETH > 0,
    },
  })

  // Use contract's premium calculation (guaranteed to match)
  const premiumETH = contractPremium && typeof contractPremium === 'bigint' 
    ? parseFloat(formatEther(contractPremium)) 
    : 0
  const premiumUSD = premiumETH * ETH_TO_USD

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && hash) {
      // Policy created! Show success with transaction hash
      setPolicyId(hash)
      setStep('success')
    }
  }, [isConfirmed, hash])

  // Display transaction errors
  useEffect(() => {
    if (writeError) {
      console.error('Transaction error:', writeError)
      alert(`Transaction failed: ${writeError.message || 'Unknown error'}`)
    }
  }, [writeError])

  const handleSubmit = async () => {
    if (!address || !isConnected) {
      alert('Please connect your wallet first')
      return
    }

    if (!formData.churchId) {
      alert('Please select a church')
      return
    }

    try {
      console.log('Purchasing mission protection policy...', {
        organization: formData.churchId,
        coverageUSD: coverageUSD,
        coverageETH: coverageETH,
        premiumUSD: premiumUSD,
        premiumETH: premiumETH,
        premiumFromContract: contractPremium ? formatEther(contractPremium as bigint) : 'N/A',
        destination: formData.country,
        note: 'Premium fetched directly from contract to ensure exact match',
      })

      // Convert dates to timestamps
      const startTimestamp = Math.floor(new Date(formData.startDate).getTime() / 1000)
      const endTimestamp = Math.floor(new Date(formData.endDate).getTime() / 1000)

      // Event type: 0 = MISSION_TRIP
      const eventType = 0

      writeContract({
        ...CONTRACTS.mission,
        functionName: 'purchasePolicy',
        args: [
          formData.churchId as `0x${string}`, // organization address
          eventType, // EventType.MISSION_TRIP
          `${formData.tripPurpose} to ${formData.destination}`, // eventName
          `${formData.destination}, ${formData.country}`, // location
          BigInt(startTimestamp), // startDate
          BigInt(endTimestamp), // endDate
          parseEther(coverageETH.toString()), // coverageAmount in ETH
          '0x0000000000000000000000000000000000000000', // coverageToken (ETH)
        ],
        value: parseEther(premiumETH.toString()), // Premium payment in ETH
      })

      // Transaction will be handled by useEffect when confirmed
    } catch (error) {
      console.error('Error purchasing policy:', error)
      alert('Failed to purchase policy. Please try again.')
    }
  }

  const filteredDestinations = DESTINATIONS.filter(dest =>
    dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.region.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedDestination = DESTINATIONS.find(d => d.country === formData.country)

  const getTripDuration = () => {
    if (!formData.startDate || !formData.endDate) return 0
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-50'
      case 'Medium': return 'text-yellow-600 bg-yellow-50'
      case 'High': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
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
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>

        {/* Page Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <Plane className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Mission Trip Protection
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Protect your mission journey with blockchain-backed insurance. 
            Get automatic coverage for trip disruptions and cancellations.
          </p>
        </div>

        <WalletConnectionCheck>
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-4">
              {['destination', 'dates', 'coverage', 'review'].map((stepName, index) => (
                <div key={stepName} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    step === stepName
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : ['dates', 'coverage', 'review'].includes(step) && index < ['destination', 'dates', 'coverage', 'review'].indexOf(step)
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-300 bg-white text-slate-400'
                  }`}>
                    {index + 1}
                  </div>
                  {index < 3 && (
                    <div className={`w-16 h-0.5 ${
                      ['dates', 'coverage', 'review'].includes(step) && index < ['destination', 'dates', 'coverage', 'review'].indexOf(step)
                        ? 'bg-indigo-600'
                        : 'bg-slate-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center space-x-4 mt-2">
              <span className="text-sm text-slate-600 w-24 text-center">Destination</span>
              <span className="text-sm text-slate-600 w-24 text-center">Dates</span>
              <span className="text-sm text-slate-600 w-24 text-center">Coverage</span>
              <span className="text-sm text-slate-600 w-24 text-center">Review</span>
            </div>
          </div>

          {/* Step 1: Select Destination */}
          {step === 'destination' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Your Destination</h2>
              <p className="text-slate-600 mb-6">Choose the country where you'll be serving</p>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Destinations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredDestinations.map((dest) => (
                  <button
                    key={dest.country}
                    onClick={() => {
                      setFormData({ ...formData, country: dest.country, destination: `${dest.country}, ${dest.region}` })
                    }}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.country === dest.country
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-slate-200 hover:border-indigo-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-slate-900">{dest.country}</div>
                        <div className="text-sm text-slate-600">{dest.region}</div>
                      </div>
                      <MapPin className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded ${getRiskColor(dest.riskLevel)}`}>
                        {dest.riskLevel} Risk
                      </span>
                      <span className="text-xs text-slate-500">{(dest.baseRate * 100).toFixed(1)}% rate</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Continue Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setStep('dates')}
                  disabled={!formData.country}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Continue to Dates
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Select Dates */}
          {step === 'dates' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Trip Dates & Details</h2>
              <p className="text-slate-600 mb-6">When will you be traveling?</p>

              {/* Selected Destination Summary */}
              {selectedDestination && (
                <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                      <div>
                        <div className="font-semibold text-slate-900">{formData.country}</div>
                        <div className="text-sm text-slate-600">{selectedDestination.region}</div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${getRiskColor(selectedDestination.riskLevel)}`}>
                      {selectedDestination.riskLevel} Risk
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Date Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Start Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      End Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Trip Duration Display */}
                {formData.startDate && formData.endDate && getTripDuration() > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <Info className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-blue-900">
                        Trip Duration: <strong>{getTripDuration()} days</strong>
                      </span>
                    </div>
                  </div>
                )}

                {/* Trip Purpose */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Trip Purpose
                  </label>
                  <select
                    value={formData.tripPurpose}
                    onChange={(e) => setFormData({ ...formData, tripPurpose: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select purpose...</option>
                    {TRIP_PURPOSES.map((purpose) => (
                      <option key={purpose} value={purpose}>{purpose}</option>
                    ))}
                  </select>
                </div>

                {/* Church Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Registered Church *
                  </label>
                  
                  <select
                    value={formData.churchId}
                    onChange={(e) => setFormData({ ...formData, churchId: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select your church...</option>
                    {churches.map((church) => (
                      <option key={church.id} value={church.id}>
                        {church.name} - {church.location}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-sm text-slate-600 flex items-center gap-1">
                    <Info className="w-4 h-4" />
                    Claims require majority approval by church leadership.
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep('destination')}
                  className="px-8 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('coverage')}
                  disabled={!formData.startDate || !formData.endDate || !formData.tripPurpose || !formData.churchId}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Continue to Coverage
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Choose Coverage */}
          {step === 'coverage' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Choose Coverage Amount</h2>
              <p className="text-slate-600 mb-6">Select the protection level that meets your needs</p>

              {/* Coverage Options */}
              <div className="space-y-4 mb-8">
                {COVERAGE_OPTIONS.map((option) => {
                  const tempCoverage = parseFloat(option.value)
                  const tempPremium = tempCoverage * (selectedDestination?.baseRate || 0.08) * (1 + (getTripDuration() / 365) * 0.5)
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, coverageAmount: option.value })}
                      className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                        formData.coverageAmount === option.value
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-slate-200 hover:border-indigo-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-lg text-slate-900 mb-1">{option.label}</div>
                          <div className="text-sm text-slate-600">
                            Premium: ${Math.round(tempPremium).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-indigo-600">
                            ${(tempCoverage).toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-500">Coverage</div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* What's Covered */}
              <div className="p-6 bg-green-50 rounded-lg border border-green-200 mb-6">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  What's Covered
                </h3>
                <ul className="space-y-2 text-sm text-green-800">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Trip cancellation due to political unrest or natural disasters</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Flight delays exceeding 6 hours</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Medical evacuation coverage</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Emergency travel home due to family emergency</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Lost or stolen passport/documents</span>
                  </li>
                </ul>
              </div>

              {/* Navigation */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep('dates')}
                  className="px-8 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('review')}
                  disabled={!formData.coverageAmount}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Review Policy
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Confirm */}
          {step === 'review' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Review Your Policy</h2>
              <p className="text-slate-600 mb-8">Please review your mission trip protection details</p>

              <div className="space-y-6">
                {/* Trip Details */}
                <div className="p-6 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                    <Plane className="w-5 h-5 mr-2" />
                    Trip Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Destination:</span>
                      <div className="font-semibold text-slate-900">{formData.destination}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Risk Level:</span>
                      <div>
                        <span className={`text-xs px-2 py-1 rounded ${getRiskColor(selectedDestination?.riskLevel || '')}`}>
                          {selectedDestination?.riskLevel} Risk
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-600">Start Date:</span>
                      <div className="font-semibold text-slate-900">{new Date(formData.startDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">End Date:</span>
                      <div className="font-semibold text-slate-900">{new Date(formData.endDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Duration:</span>
                      <div className="font-semibold text-slate-900">{getTripDuration()} days</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Purpose:</span>
                      <div className="font-semibold text-slate-900">{formData.tripPurpose}</div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-600">Registered Church:</span>
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        {churches.find(c => c.id === formData.churchId)?.name || 'Not selected'}
                        {formData.churchId && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Verified • Can Approve Claims
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coverage Summary */}
                <div className="p-6 bg-indigo-50 rounded-lg border border-indigo-200">
                  <h3 className="font-semibold text-indigo-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Coverage Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-700">Coverage Amount:</span>
                      <span className="text-2xl font-bold text-indigo-900">
                        ${coverageUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-indigo-200">
                      <span className="text-indigo-700">Premium Payment:</span>
                      <span className="text-2xl font-bold text-indigo-900">
                        ${premiumUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-indigo-600 pt-2">
                      <span>≈ {premiumETH.toFixed(6)} ETH</span>
                      <span className="text-indigo-500">@ ${ETH_TO_USD.toLocaleString()} per ETH</span>
                    </div>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-yellow-900 mb-3 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Important Information
                  </h3>
                  <ul className="space-y-2 text-sm text-yellow-800">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Your policy will be active immediately upon purchase</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Claims require verification by 2 of 3 church leaders</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Payouts are processed automatically within 24 hours of approval</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Your premium is backed by DeFi capital in secure protocols</span>
                    </li>
                  </ul>
                </div>

                {/* Blockchain Info */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-2 text-sm text-blue-900">
                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold mb-1">Powered by Blockchain</div>
                      <div className="text-blue-800">
                        Your policy is recorded on the blockchain for transparency and automatic execution.
                        No middleman, no delays—just protection you can trust.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep('coverage')}
                  disabled={isProcessing}
                  className="px-8 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-5 h-5" />
                      <span>Pay ${premiumUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} & Purchase Policy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Success State */}
          {step === 'success' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Protection Activated! 🎉
              </h2>
              
              <p className="text-xl text-slate-600 mb-8">
                Your mission trip is now protected by blockchain-backed insurance
              </p>

              {/* Policy Details Card */}
              <div className="max-w-md mx-auto mb-8 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border-2 border-indigo-200">
                <div className="text-sm text-indigo-600 font-semibold mb-2">Transaction Hash</div>
                <div className="font-mono text-sm font-bold text-slate-900 mb-2 break-all">
                  {policyId}
                </div>
                {hash && (
                  <a
                    href={getBlockExplorerUrl(hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-700 underline"
                  >
                    View on Block Explorer →
                  </a>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-indigo-200">
                  <div>
                    <div className="text-slate-600">Coverage</div>
                    <div className="font-bold text-slate-900">${coverageUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>
                  <div>
                    <div className="text-slate-600">Premium Paid</div>
                    <div className="font-bold text-slate-900">${premiumUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>
                  <div>
                    <div className="text-slate-600">Destination</div>
                    <div className="font-bold text-slate-900">{formData.country}</div>
                  </div>
                  <div>
                    <div className="text-slate-600">Duration</div>
                    <div className="font-bold text-slate-900">{getTripDuration()} days</div>
                  </div>
                </div>
              </div>

              {/* What's Next */}
              <div className="max-w-2xl mx-auto text-left mb-8 p-6 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-4">What's Next?</h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Your policy is now active and recorded on the blockchain</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span>If you need to file a claim, provide evidence of trip disruption</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Church leaders will verify your claim (requires 2 of 3 approvals)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Approved claims are paid automatically within 24 hours</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/my-commitments"
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  View My Policies
                </Link>
                <button
                  onClick={() => {
                    setStep('destination')
                    setFormData({
                      destination: '',
                      country: '',
                      startDate: '',
                      endDate: '',
                      coverageAmount: '',
                      tripPurpose: '',
                      churchId: ''
                    })
                    setPolicyId('')
                  }}
                  className="px-8 py-3 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium border border-slate-300"
                >
                  Purchase Another Policy
                </button>
                <Link 
                  href="/"
                  className="px-8 py-3 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium border border-slate-300"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </WalletConnectionCheck>
      </main>
    </div>
  )
}
