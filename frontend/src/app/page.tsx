'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ArrowRight, Shield, Heart, TrendingUp, CheckCircle, Users, Church, Plane, X } from '@/components/Icons';
import { WalletConnectButton } from '@/components/WalletConnectButton';
import { UserMenu } from '@/components/UserMenu';

export default function Home() {
  const { isConnected } = useAccount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Steward
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!isHydrated ? (
              // Show loading state during hydration
              <>
                <div className="w-16 h-4 bg-slate-200 rounded animate-pulse" />
                <div className="w-20 h-4 bg-slate-200 rounded animate-pulse" />
                <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
              </>
            ) : !isConnected ? (
              <>
                <Link href="#features" className="text-slate-700 hover:text-indigo-600 transition-colors">
                  Features
                </Link>
                <Link href="#how-it-works" className="text-slate-700 hover:text-indigo-600 transition-colors">
                  How It Works
                </Link>
                <Link href="#for-churches" className="text-slate-700 hover:text-indigo-600 transition-colors">
                  For Churches
                </Link>
              </>
            ) : (
              <>
                <Link href="/mission-protection" className="text-slate-700 hover:text-indigo-600 transition-colors">
                  Mission Protection
                </Link>
                <Link href="/my-commitments" className="text-slate-700 hover:text-indigo-600 transition-colors">
                  My Commitments
                </Link>
                <Link href="/giving-history" className="text-slate-700 hover:text-indigo-600 transition-colors">
                  Giving History
                </Link>
                <Link href="/church-dashboard" className="text-slate-700 hover:text-indigo-600 transition-colors">
                  Church Dashboard
                </Link>
              </>
            )}
            <Link href="/register-church" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
              Register Church
            </Link>
            {isHydrated ? (isConnected ? <UserMenu /> : <WalletConnectButton />) : <div className="w-24 h-10 bg-slate-200 rounded-lg animate-pulse" />}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-indigo-600 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg border border-slate-200">
            <div className="flex flex-col space-y-3 px-4">
              {!isHydrated ? (
                // Show loading state during hydration
                <>
                  <div className="w-16 h-4 bg-slate-200 rounded animate-pulse" />
                  <div className="w-20 h-4 bg-slate-200 rounded animate-pulse" />
                  <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
                </>
              ) : !isConnected ? (
                <>
                  <Link 
                    href="#features" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-slate-700 hover:text-indigo-600 transition-colors py-2"
                  >
                    Features
                  </Link>
                  <Link 
                    href="#how-it-works" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-slate-700 hover:text-indigo-600 transition-colors py-2"
                  >
                    How It Works
                  </Link>
                  <Link 
                    href="#for-churches" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-slate-700 hover:text-indigo-600 transition-colors py-2"
                  >
                    For Churches
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/mission-protection" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-slate-700 hover:text-indigo-600 transition-colors py-2"
                  >
                    Mission Protection
                  </Link>
                  <Link 
                    href="/my-commitments" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-slate-700 hover:text-indigo-600 transition-colors py-2"
                  >
                    My Commitments
                  </Link>
                  <Link 
                    href="/giving-history" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-slate-700 hover:text-indigo-600 transition-colors py-2"
                  >
                    Giving History
                  </Link>
                  <Link 
                    href="/church-dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-slate-700 hover:text-indigo-600 transition-colors py-2"
                  >
                    Church Dashboard
                  </Link>
                </>
              )}
              <Link 
                href="/register-church" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-center"
              >
                Register Church
              </Link>
              <div className="pt-2 border-t border-slate-200">
                {isHydrated ? (isConnected ? <UserMenu /> : <WalletConnectButton />) : <div className="w-24 h-10 bg-slate-200 rounded-lg animate-pulse mx-auto" />}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Content */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
            <span>Powered by Trig Protocol</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Faithful Stewardship
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto">
            Automate your tithing, protect your mission trips, and practice transparent 
            Christian financial stewardship—all powered by smart contracts.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create-tithe" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2 group">
              <span className="font-semibold">Start Giving</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-all shadow-lg hover:shadow-xl border border-slate-200">
              <span className="font-semibold">Watch Demo</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">$2.5M+</div>
              <div className="text-sm text-slate-600">Total Given</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">150+</div>
              <div className="text-sm text-slate-600">Churches</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">1,200+</div>
              <div className="text-sm text-slate-600">Believers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {!isConnected && (
        <section id="features" className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need for
              <span className="block text-indigo-600 leading-normal">Biblical Stewardship</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful tools that make giving, protection, and transparency effortless
            </p>
          </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border border-slate-100">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Automated Tithing</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Set your commitment once and let smart contracts handle the rest. 
              Never forget to give—practice consistent biblical stewardship.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">10% tithe + offerings</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Automatic execution</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Tax receipts included</span>
              </li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border border-slate-100">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
              <Plane className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Mission Protection</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Travel with peace of mind. Get automatic payouts if your mission 
              trip is disrupted or cancelled—no claims process.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Instant verification</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">24hr payouts</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Church-verified claims</span>
              </li>
            </ul>
            <Link 
              href="/mission-protection"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Get Protected
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border border-slate-100">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">DeFi Yields</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Put your idle capital to work. Back insurance policies and earn 
              up to 12% APY while supporting mission work.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">12% APY potential</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Backed by Morpho</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Flexible lock periods</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      )}

      {/* How It Works */}
      {!isConnected && (
        <section id="how-it-works" className="container mx-auto px-4 py-20 bg-white/50 rounded-3xl my-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get started in minutes with three simple steps
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                1
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Connect Your Wallet</h3>
                <p className="text-slate-600 text-lg">
                  Use MetaMask, WalletConnect, or any Web3 wallet to securely connect to the platform.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                2
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Set Your Commitment</h3>
                <p className="text-slate-600 text-lg">
                  Choose your church, set your tithe percentage, and configure your giving preferences.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                3
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Give Automatically</h3>
                <p className="text-slate-600 text-lg">
                  Sit back and let the smart contracts handle your tithing. Track everything on the blockchain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* For Churches */}
      {!isConnected && (
        <section id="for-churches" className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-12 md:p-16 text-white shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
                <Church className="w-4 h-4" />
                <span>For Church Leaders</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Register Your Church Today
              </h2>
              <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
                Join 150+ churches already using Steward. Enable your congregation to give 
                automatically, verify mission protection claims, and provide full financial transparency.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-lg">Receive tithes automatically</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-lg">Verify mission trip claims</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-lg">Full blockchain transparency</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
                  <span className="text-lg">Generate giving reports</span>
                </li>
              </ul>
              <Link href="/register-church" className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl font-semibold">
                Register Your Church
              </Link>
            </div>
            <div className="flex-shrink-0">
              <div className="w-64 h-64 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Users className="w-32 h-32 text-white/50" />
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need to know about Steward
            </p>
          </div>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => toggleFaq(0)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  How does automated tithing work?
                </h3>
                <svg
                  className={`w-5 h-5 text-slate-600 transition-transform ${openFaqIndex === 0 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaqIndex === 0 && (
                <div className="px-6 pb-4">
                  <p className="text-slate-600">
                    You set up your commitment once by specifying your church, amount, and frequency. 
                    Smart contracts then automatically execute your giving based on your schedule—daily, 
                    weekly, or monthly. You always stay in control and can pause or cancel anytime.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => toggleFaq(1)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  Is my church verified?
                </h3>
                <svg
                  className={`w-5 h-5 text-slate-600 transition-transform ${openFaqIndex === 1 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaqIndex === 1 && (
                <div className="px-6 pb-4">
                  <p className="text-slate-600">
                    Churches must register and be verified by 3 independent verifiers before receiving 
                    tithes. This multi-signature system ensures legitimacy without a central authority. 
                    You can only give to verified organizations.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => toggleFaq(2)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  How does mission protection work?
                </h3>
                <svg
                  className={`w-5 h-5 text-slate-600 transition-transform ${openFaqIndex === 2 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaqIndex === 2 && (
                <div className="px-6 pb-4">
                  <p className="text-slate-600">
                    Purchase a policy before your mission trip by specifying your destination, dates, 
                    and coverage amount. If your trip is disrupted by verifiable events (flight delays, 
                    natural disasters, etc.), you receive automatic payouts—no claims process required.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => toggleFaq(3)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  What blockchain does Steward use?
                </h3>
                <svg
                  className={`w-5 h-5 text-slate-600 transition-transform ${openFaqIndex === 3 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaqIndex === 3 && (
                <div className="px-6 pb-4">
                  <p className="text-slate-600">
                    Steward is deployed on Base Sepolia testnet, a fast and low-cost Ethereum L2 solution. 
                    All transactions are transparent and verifiable on the blockchain while keeping costs minimal.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 5 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => toggleFaq(4)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  How do I register my church?
                </h3>
                <svg
                  className={`w-5 h-5 text-slate-600 transition-transform ${openFaqIndex === 4 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaqIndex === 4 && (
                <div className="px-6 pb-4">
                  <p className="text-slate-600">
                    Click "Register Church" in the navigation, fill out your organization details, 
                    and stake a small amount (0.00001 ETH for testing). Once 3 verifiers approve your 
                    church, you can start receiving automated tithes from your congregation.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 6 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => toggleFaq(5)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  Can I cancel or pause my commitments?
                </h3>
                <svg
                  className={`w-5 h-5 text-slate-600 transition-transform ${openFaqIndex === 5 ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaqIndex === 5 && (
                <div className="px-6 pb-4">
                  <p className="text-slate-600">
                    Yes! You have full control over your commitments. Visit "My Commitments" to pause, 
                    resume, or cancel at any time. Any unused funds remain in your wallet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Ready to Transform Your Stewardship?
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            Join thousands of believers practicing faithful, automated giving.
          </p>
          <Link 
            href="/register-church"
            className="inline-block px-10 py-5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-xl hover:shadow-2xl text-lg font-semibold"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-slate-200 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6 text-indigo-600" />
                <span className="text-lg font-bold text-slate-900">Steward</span>
              </div>
              <p className="text-slate-600 text-sm">
                Biblical stewardship powered by blockchain technology.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="#features" className="hover:text-indigo-600 transition-colors">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</Link></li>
                <li><Link href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</Link></li>
                <li><Link href="/register-church" className="hover:text-indigo-600 transition-colors">Register Church</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a 
                    href="https://github.com/e3o8o/trig-hackathon" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a 
                    href="https://sepolia.basescan.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Block Explorer
                  </a>
                </li>
                <li><Link href="/verifier-dashboard" className="hover:text-indigo-600 transition-colors">Become a Verifier</Link></li>
                <li><Link href="/admin" className="hover:text-indigo-600 transition-colors">Admin Panel</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
            <p>&copy; 2025 Steward. All rights reserved. Built with faith and code. ✨</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
