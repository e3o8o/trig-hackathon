'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import Link from 'next/link'
import { ArrowLeft, Shield, Church, CheckCircle, Loader2 } from '@/components/Icons'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { UserMenu } from '@/components/UserMenu'
import { CONTRACTS, ORACLE_CONFIG, getBlockExplorerUrl } from '@/config/contracts'

interface ChurchFormData {
  name: string
  streetAddress: string
  city: string
  stateProvince: string
  country: string
  denomination: string
}

const DENOMINATIONS = [
  'Baptist',
  'Methodist',
  'Presbyterian',
  'Lutheran',
  'Pentecostal',
  'Non-denominational',
  'Anglican/Episcopal',
  'Catholic',
  'Orthodox',
  'Reformed',
  'Assemblies of God',
  'Church of Christ',
  'Other'
]

export default function RegisterChurch() {
  const { address, isConnected } = useAccount()
  const [step, setStep] = useState<'form' | 'preview' | 'success'>('form')
  const [churchId, setChurchId] = useState<string>('')
  
  const [formData, setFormData] = useState<ChurchFormData>({
    name: '',
    streetAddress: '',
    city: '',
    stateProvince: '',
    country: '',
    denomination: ''
  })

  const { 
    data: hash,
    isPending: isWritePending, 
    writeContract,
    error: writeError 
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const isFormValid = () => {
    return Object.values(formData).every(value => value.trim() !== '')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid()) {
      setStep('preview')
    }
  }

  const handleConfirmRegistration = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first')
      return
    }

    try {
      // Combine address fields into description
      const description = `${formData.streetAddress}, ${formData.city}, ${formData.stateProvince}, ${formData.country} | Denomination: ${formData.denomination}`
      
      // Create website URL (placeholder if not provided)
      const website = 'https://steward.network' // Can be made editable later
      
      console.log('Registering organization:', {
        name: formData.name,
        description,
        website,
        stake: ORACLE_CONFIG.minOrganizationStake + ' ETH',
      })

      // Call the smart contract
      writeContract({
        ...CONTRACTS.oracle,
        functionName: 'registerOrganization',
        args: [
          formData.name,
          description,
          website,
        ],
        value: parseEther(ORACLE_CONFIG.minOrganizationStake), // 0.1 ETH stake
      })
    } catch (error) {
      console.error('Registration error:', error)
      alert('Failed to register church. Please try again.')
    }
  }

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && hash && !churchId) {
      // Extract church ID from transaction
      const generatedId = `ORG-${address?.slice(0, 10)}`
      setChurchId(generatedId)
      setStep('success')
      console.log('Church registered successfully!', {
        transactionHash: hash,
        address,
        blockExplorer: getBlockExplorerUrl(hash),
      })
    }
  }, [isConfirmed, hash, churchId, address])

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
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {step === 'form' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-center justify-center mb-8">
              <div className="p-4 bg-indigo-100 rounded-full">
                <Church className="w-12 h-12 text-indigo-600" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-center text-slate-900 mb-4">
              Register Your Church
            </h1>
            <p className="text-center text-slate-600 mb-8">
              Join the Steward platform and enable your members to practice automated, transparent giving.
            </p>

            {/* Stake Information */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-amber-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">Registration Stake Required</h3>
                  <p className="text-amber-800 text-sm mb-2">
                    To register your church, you must stake <strong>1 ETH</strong> as a security deposit. 
                    This ensures accountability and can be reclaimed if you decide to unregister your church in good standing.
                  </p>
                  <p className="text-amber-700 text-xs">
                    Your stake helps maintain trust in the Steward ecosystem and protects members.
                  </p>
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Church Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Grace Community Church"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="streetAddress" className="block text-sm font-medium text-slate-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="streetAddress"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  placeholder="e.g., 123 Main Street"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g., Dallas"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="stateProvince" className="block text-sm font-medium text-slate-700 mb-2">
                    State/Province *
                  </label>
                  <input
                    type="text"
                    id="stateProvince"
                    name="stateProvince"
                    value={formData.stateProvince}
                    onChange={handleInputChange}
                    placeholder="e.g., TX"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="e.g., United States"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="denomination" className="block text-sm font-medium text-slate-700 mb-2">
                  Denomination *
                </label>
                <select
                  id="denomination"
                  name="denomination"
                  value={formData.denomination}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
                  required
                >
                  <option value="">Select a denomination</option>
                  {DENOMINATIONS.map(denom => (
                    <option key={denom} value={denom}>{denom}</option>
                  ))}
                </select>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={!isFormValid()}
                  className="w-full py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  Continue to Preview
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 'preview' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-center justify-center mb-8">
              <div className="p-4 bg-indigo-100 rounded-full">
                <Church className="w-12 h-12 text-indigo-600" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-center text-slate-900 mb-4">
              Review Church Details
            </h1>
            <p className="text-center text-slate-600 mb-8">
              Please review the information before confirming your registration.
            </p>

            {/* Church Details Preview */}
            <div className="space-y-6 mb-8">
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Church Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Church Name:</span>
                    <span className="font-medium text-slate-900">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Address:</span>
                    <span className="font-medium text-slate-900 text-right">{formData.streetAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">City:</span>
                    <span className="font-medium text-slate-900">{formData.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">State/Province:</span>
                    <span className="font-medium text-slate-900">{formData.stateProvince}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Country:</span>
                    <span className="font-medium text-slate-900">{formData.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Denomination:</span>
                    <span className="font-medium text-slate-900">{formData.denomination}</span>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="font-semibold text-indigo-900 mb-4">Stake Requirements</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-800">Registration Stake:</span>
                    <span className="font-bold text-indigo-900 text-xl">{ORACLE_CONFIG.minOrganizationStake} ETH</span>
                  </div>
                  <div className="text-sm text-indigo-700">
                    This stake will be locked in the smart contract and can be reclaimed when you unregister your church.
                  </div>
                </div>
              </div>

              {!isConnected && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <p className="text-amber-800 text-center">
                    Please connect your wallet to proceed with registration.
                  </p>
                  <div className="flex justify-center mt-4">
                    <WalletConnectButton />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setStep('form')}
                disabled={isWritePending || isConfirming}
                className="flex-1 py-4 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back to Edit
              </button>
              <button
                onClick={handleConfirmRegistration}
                disabled={!isConnected || isWritePending || isConfirming}
                className="flex-1 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                {isWritePending || isConfirming ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{isConfirming ? 'Confirming on chain...' : 'Awaiting wallet...'}</span>
                  </>
                ) : (
                  <span>Confirm & Stake {ORACLE_CONFIG.minOrganizationStake} ETH</span>
                )}
              </button>
            </div>

            {writeError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">Error: {writeError.message}</p>
              </div>
            )}
          </div>
        )}

        {step === 'success' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="p-4 bg-green-100 rounded-full">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Registration Successful!
            </h1>
            <p className="text-slate-600 mb-8">
              Your church has been successfully registered on the Steward platform.
            </p>

            {/* Success Details */}
            <div className="bg-slate-50 rounded-lg p-6 mb-8 max-w-md mx-auto">
              <h3 className="font-semibold text-slate-900 mb-4">Church Details</h3>
              <div className="space-y-3 text-left">
                <div>
                  <span className="text-slate-600 text-sm">Church Name:</span>
                  <p className="font-medium text-slate-900">{formData.name}</p>
                </div>
                <div>
                  <span className="text-slate-600 text-sm">Location:</span>
                  <p className="font-medium text-slate-900">
                    {formData.city}, {formData.stateProvince}, {formData.country}
                  </p>
                </div>
                <div>
                  <span className="text-slate-600 text-sm">Organization Address:</span>
                  <p className="font-mono font-medium text-indigo-600 break-all text-xs">{address}</p>
                </div>
                <div>
                  <span className="text-slate-600 text-sm">Staked Amount:</span>
                  <p className="font-bold text-slate-900">{ORACLE_CONFIG.minOrganizationStake} ETH</p>
                </div>
                {hash && (
                  <div>
                    <span className="text-slate-600 text-sm">Transaction:</span>
                    <a 
                      href={getBlockExplorerUrl(hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-indigo-600 hover:text-indigo-800 underline break-all block"
                    >
                      {hash.slice(0, 20)}...{hash.slice(-10)}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-indigo-900 mb-3">Next Steps</h3>
              <ul className="space-y-2 text-indigo-800">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Share your Church ID with your members so they can tithe to your church</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Verify church leaders to participate in claim verification</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Access your church dashboard to view received tithes</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
              >
                Back to Home
              </Link>
              <Link
                href="/church-dashboard"
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
