'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import Link from 'next/link'
import { ArrowLeft, Shield, Heart, CheckCircle, Loader2, Church, DollarSign, Calendar } from '@/components/Icons'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { UserMenu } from '@/components/UserMenu'

interface TitheFormData {
  churchId: string
  churchName: string
  incomeThreshold: string
  tithePercentage: string
  offeringPercentage: string
  frequency: string
}

// Simulated list of verified churches
const VERIFIED_CHURCHES = [
  {
    id: 'CHURCH-001',
    name: 'Grace Community Church',
    location: 'Dallas, TX',
    denomination: 'Non-denominational',
    membersCount: 450,
    verified: true
  },
  {
    id: 'CHURCH-002',
    name: 'First Baptist Church',
    location: 'Austin, TX',
    denomination: 'Baptist',
    membersCount: 1200,
    verified: true
  },
  {
    id: 'CHURCH-003',
    name: 'New Hope Fellowship',
    location: 'Houston, TX',
    denomination: 'Pentecostal',
    membersCount: 320,
    verified: true
  },
  {
    id: 'CHURCH-004',
    name: 'Covenant Presbyterian Church',
    location: 'San Antonio, TX',
    denomination: 'Presbyterian',
    membersCount: 580,
    verified: true
  },
  {
    id: 'CHURCH-005',
    name: 'Living Word Church',
    location: 'Fort Worth, TX',
    denomination: 'Non-denominational',
    membersCount: 890,
    verified: true
  },
  {
    id: 'CHURCH-006',
    name: 'St. Michael\'s Catholic Church',
    location: 'Dallas, TX',
    denomination: 'Catholic',
    membersCount: 2100,
    verified: true
  },
  {
    id: 'CHURCH-007',
    name: 'Christ the King Lutheran',
    location: 'Plano, TX',
    denomination: 'Lutheran',
    membersCount: 650,
    verified: true
  },
  {
    id: 'CHURCH-008',
    name: 'Cornerstone Assembly',
    location: 'Irving, TX',
    denomination: 'Assemblies of God',
    membersCount: 410,
    verified: true
  }
]

const FREQUENCIES = [
  { value: 'monthly', label: 'Monthly (when income received)' },
  { value: 'biweekly', label: 'Bi-weekly (every 2 weeks)' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'onetime', label: 'One-time commitment' }
]

export default function CreateTithe() {
  const { address, isConnected } = useAccount()
  const [step, setStep] = useState<'select' | 'configure' | 'preview' | 'success'>('select')
  const [commitmentId, setCommitmentId] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  const [formData, setFormData] = useState<TitheFormData>({
    churchId: '',
    churchName: '',
    incomeThreshold: '',
    tithePercentage: '10',
    offeringPercentage: '0',
    frequency: 'monthly'
  })

  const filteredChurches = VERIFIED_CHURCHES.filter(church => 
    church.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    church.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    church.denomination.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleChurchSelect = (church: typeof VERIFIED_CHURCHES[0]) => {
    setFormData({
      ...formData,
      churchId: church.id,
      churchName: church.name
    })
    setStep('configure')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const isFormValid = () => {
    return (
      formData.churchId !== '' &&
      parseFloat(formData.incomeThreshold) > 0 &&
      parseFloat(formData.tithePercentage) > 0 &&
      parseFloat(formData.tithePercentage) <= 100
    )
  }

  const handleConfigure = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid()) {
      setStep('preview')
    }
  }

  const calculateMonthlyTithe = () => {
    const income = parseFloat(formData.incomeThreshold) || 0
    const tithe = (income * parseFloat(formData.tithePercentage)) / 100
    const offering = (income * parseFloat(formData.offeringPercentage)) / 100
    return {
      tithe,
      offering,
      total: tithe + offering
    }
  }

  const handleConfirmCommitment = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first')
      return
    }

    setIsProcessing(true)

    try {
      // Simulate blockchain transaction
      const simulatedCommitmentId = `TITHE-${Date.now()}`
      
      setTimeout(() => {
        setCommitmentId(simulatedCommitmentId)
        setIsProcessing(false)
        setStep('success')
      }, 2500)

      // Uncomment when smart contract is ready:
      /*
      const { hash } = await writeContract({
        address: '0x...', // Tithe Manager contract address
        abi: [...], // Contract ABI
        functionName: 'createTitheCommitment',
        args: [
          formData.churchId,
          parseEther(formData.incomeThreshold),
          BigInt(formData.tithePercentage * 100), // Store as basis points
          BigInt(formData.offeringPercentage * 100),
          formData.frequency
        ],
      })
      
      // Wait for confirmation
      await waitForTransactionReceipt({ hash })
      setCommitmentId(`TITHE-${hash.slice(0, 10)}`)
      setStep('success')
      */
    } catch (error) {
      console.error('Commitment creation error:', error)
      setIsProcessing(false)
      alert('Failed to create commitment. Please try again.')
    }
  }

  const selectedChurch = VERIFIED_CHURCHES.find(c => c.id === formData.churchId)
  const amounts = calculateMonthlyTithe()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-slate-700 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Shield className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Steward
            </span>
          </div>
          {isConnected ? <UserMenu /> : <WalletConnectButton />}
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 ${step === 'select' ? 'text-indigo-600' : step === 'configure' || step === 'preview' || step === 'success' ? 'text-green-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'select' ? 'bg-indigo-600 text-white' : step === 'configure' || step === 'preview' || step === 'success' ? 'bg-green-600 text-white' : 'bg-slate-200'}`}>
                {step === 'configure' || step === 'preview' || step === 'success' ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <span className="font-medium">Select Church</span>
            </div>
            <div className="w-16 h-0.5 bg-slate-300"></div>
            <div className={`flex items-center space-x-2 ${step === 'configure' ? 'text-indigo-600' : step === 'preview' || step === 'success' ? 'text-green-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'configure' ? 'bg-indigo-600 text-white' : step === 'preview' || step === 'success' ? 'bg-green-600 text-white' : 'bg-slate-200'}`}>
                {step === 'preview' || step === 'success' ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <span className="font-medium">Configure</span>
            </div>
            <div className="w-16 h-0.5 bg-slate-300"></div>
            <div className={`flex items-center space-x-2 ${step === 'preview' ? 'text-indigo-600' : step === 'success' ? 'text-green-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'preview' ? 'bg-indigo-600 text-white' : step === 'success' ? 'bg-green-600 text-white' : 'bg-slate-200'}`}>
                {step === 'success' ? <CheckCircle className="w-5 h-5" /> : '3'}
              </div>
              <span className="font-medium">Confirm</span>
            </div>
          </div>
        </div>

        {/* Step 1: Select Church */}
        {step === 'select' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-center mb-8">
              <div className="p-4 bg-indigo-100 rounded-full">
                <Church className="w-12 h-12 text-indigo-600" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-center text-slate-900 mb-4">
              Create Tithe Commitment
            </h1>
            <p className="text-center text-slate-600 mb-8">
              Set up automated tithing to support your church's mission. Choose your church from our verified list.
            </p>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-start space-x-3">
                <Heart className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">How It Works</h3>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Select your church from verified organizations</li>
                    <li>• Set your income threshold and tithe percentage</li>
                    <li>• Your tithe automatically executes when you receive income</li>
                    <li>• Track all giving with complete transparency</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by church name, location, or denomination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Church List */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {filteredChurches.map((church) => (
                <div
                  key={church.id}
                  onClick={() => handleChurchSelect(church)}
                  className="border border-slate-200 rounded-lg p-6 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{church.name}</h3>
                        {church.verified && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm mb-2">{church.location}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <span className="flex items-center space-x-1">
                          <Church className="w-4 h-4" />
                          <span>{church.denomination}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{church.membersCount} members</span>
                        </span>
                      </div>
                    </div>
                    <ArrowLeft className="w-5 h-5 text-slate-400 transform rotate-180" />
                  </div>
                </div>
              ))}
            </div>

            {filteredChurches.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <Church className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No churches found matching your search.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Configure Commitment */}
        {step === 'configure' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-center mb-8">
              <div className="p-4 bg-indigo-100 rounded-full">
                <DollarSign className="w-12 h-12 text-indigo-600" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-center text-slate-900 mb-4">
              Configure Your Commitment
            </h1>
            <p className="text-center text-slate-600 mb-8">
              Set your income threshold and giving percentages
            </p>

            {/* Selected Church */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-8">
              <div className="flex items-center space-x-3">
                <Church className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-indigo-700">Selected Church</p>
                  <p className="font-semibold text-indigo-900">{selectedChurch?.name}</p>
                </div>
                <button
                  onClick={() => setStep('select')}
                  className="ml-auto text-indigo-600 hover:text-indigo-700 text-sm underline"
                >
                  Change
                </button>
              </div>
            </div>

            <form onSubmit={handleConfigure} className="space-y-6">
              <div>
                <label htmlFor="incomeThreshold" className="block text-sm font-medium text-slate-700 mb-2">
                  Monthly Income Threshold (USD) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    id="incomeThreshold"
                    name="incomeThreshold"
                    value={formData.incomeThreshold}
                    onChange={handleInputChange}
                    placeholder="5000"
                    min="0"
                    step="0.01"
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  This is the monthly income amount that will trigger your automatic tithe
                </p>
              </div>

              <div>
                <label htmlFor="tithePercentage" className="block text-sm font-medium text-slate-700 mb-2">
                  Tithe Percentage (to Church) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="tithePercentage"
                    name="tithePercentage"
                    value={formData.tithePercentage}
                    onChange={handleInputChange}
                    placeholder="10"
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-slate-400">%</span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Traditional tithe is 10% of income
                </p>
              </div>

              <div>
                <label htmlFor="offeringPercentage" className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Offering Percentage (optional)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="offeringPercentage"
                    name="offeringPercentage"
                    value={formData.offeringPercentage}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-slate-400">%</span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Additional giving for missions, building fund, or special projects
                </p>
              </div>

              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-slate-700 mb-2">
                  Giving Frequency *
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                >
                  {FREQUENCIES.map(freq => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview Amounts */}
              {formData.incomeThreshold && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Preview Amounts</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Monthly Income:</span>
                      <span className="font-semibold text-slate-900">
                        ${parseFloat(formData.incomeThreshold).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tithe ({formData.tithePercentage}%):</span>
                      <span className="font-semibold text-indigo-600">
                        ${amounts.tithe.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    {parseFloat(formData.offeringPercentage) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Offering ({formData.offeringPercentage}%):</span>
                        <span className="font-semibold text-indigo-600">
                          ${amounts.offering.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-slate-300">
                      <span className="font-semibold text-slate-900">Total Giving:</span>
                      <span className="font-bold text-indigo-600 text-lg">
                        ${amounts.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid()}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Preview
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Preview & Confirm */}
        {step === 'preview' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-center mb-8">
              <div className="p-4 bg-indigo-100 rounded-full">
                <CheckCircle className="w-12 h-12 text-indigo-600" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-center text-slate-900 mb-4">
              Review Your Commitment
            </h1>
            <p className="text-center text-slate-600 mb-8">
              Please review the details before confirming your tithe commitment
            </p>

            {/* Commitment Summary */}
            <div className="space-y-6 mb-8">
              {/* Church Details */}
              <div className="border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                  <Church className="w-5 h-5 text-indigo-600" />
                  <span>Church Information</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Church Name:</span>
                    <span className="font-semibold text-slate-900">{selectedChurch?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Location:</span>
                    <span className="font-semibold text-slate-900">{selectedChurch?.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Church ID:</span>
                    <span className="font-mono text-sm text-slate-700">{formData.churchId}</span>
                  </div>
                </div>
              </div>

              {/* Giving Details */}
              <div className="border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-indigo-600" />
                  <span>Giving Details</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Income Threshold:</span>
                    <span className="font-semibold text-slate-900">
                      ${parseFloat(formData.incomeThreshold).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / month
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tithe Percentage:</span>
                    <span className="font-semibold text-slate-900">{formData.tithePercentage}%</span>
                  </div>
                  {parseFloat(formData.offeringPercentage) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Offering Percentage:</span>
                      <span className="font-semibold text-slate-900">{formData.offeringPercentage}%</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-600">Frequency:</span>
                    <span className="font-semibold text-slate-900">
                      {FREQUENCIES.find(f => f.value === formData.frequency)?.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount Summary */}
              <div className="border-2 border-indigo-200 bg-indigo-50 rounded-lg p-6">
                <h3 className="font-semibold text-indigo-900 mb-4 text-center">
                  Monthly Giving Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-lg">
                    <span className="text-indigo-700">Tithe to Church:</span>
                    <span className="font-bold text-indigo-900">
                      ${amounts.tithe.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  {amounts.offering > 0 && (
                    <div className="flex justify-between text-lg">
                      <span className="text-indigo-700">Additional Offering:</span>
                      <span className="font-bold text-indigo-900">
                        ${amounts.offering.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t-2 border-indigo-300">
                    <span className="font-bold text-indigo-900 text-xl">Total Monthly Giving:</span>
                    <span className="font-bold text-indigo-600 text-2xl">
                      ${amounts.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="text-center pt-2">
                    <p className="text-sm text-indigo-700">
                      Annual Total: <span className="font-semibold">${(amounts.total * 12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">Important Information</h3>
                  <ul className="text-amber-800 text-sm space-y-1">
                    <li>• Your commitment will be recorded on the blockchain</li>
                    <li>• Automatic transfers execute when income threshold is met</li>
                    <li>• You can modify or cancel your commitment at any time</li>
                    <li>• All transactions are transparent and verifiable</li>
                    <li>• You'll receive giving receipts for tax purposes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep('configure')}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleConfirmCommitment}
                disabled={isProcessing || !isConnected}
                className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Commitment...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Confirm Commitment</span>
                  </>
                )}
              </button>
            </div>

            {!isConnected && (
              <p className="text-center text-red-600 text-sm mt-4">
                Please connect your wallet to confirm your commitment
              </p>
            )}
          </div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-center justify-center mb-8">
              <div className="p-6 bg-green-100 rounded-full">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-center text-slate-900 mb-4">
              Commitment Created Successfully! 🎉
            </h1>
            <p className="text-center text-slate-600 mb-8 text-lg">
              Your tithe commitment has been recorded on the blockchain
            </p>

            {/* Commitment ID */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <p className="text-sm text-green-700 mb-2 text-center">Commitment ID</p>
              <p className="font-mono text-lg text-green-900 text-center font-semibold">
                {commitmentId}
              </p>
            </div>

            {/* Summary */}
            <div className="border border-slate-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-slate-900 mb-4 text-center">Commitment Summary</h3>
              <div className="space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-600">Church:</span>
                  <span className="font-semibold text-slate-900">{selectedChurch?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Monthly Giving:</span>
                  <span className="font-semibold text-indigo-600">
                    ${amounts.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Annual Total:</span>
                  <span className="font-semibold text-indigo-600">
                    ${(amounts.total * 12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-3">What Happens Next?</h3>
              <ul className="text-blue-800 text-sm space-y-2">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Your commitment is now active and will execute automatically</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>When you receive income, the system will detect it and transfer your tithe</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>You'll receive notifications for each transaction</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>View your giving history anytime in your dashboard</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/giving-history"
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium text-center"
              >
                View Giving History
              </Link>
              <button
                onClick={() => {
                  setStep('select')
                  setFormData({
                    churchId: '',
                    churchName: '',
                    incomeThreshold: '',
                    tithePercentage: '10',
                    offeringPercentage: '0',
                    frequency: 'monthly'
                  })
                  setCommitmentId('')
                }}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium"
              >
                Create Another Commitment
              </button>
            </div>

            <div className="text-center mt-8">
              <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
                ← Return to Home
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
