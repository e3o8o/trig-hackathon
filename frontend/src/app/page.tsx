import Link from 'next/link';
import { ArrowRight, Shield, Heart, TrendingUp, CheckCircle, Users, Church, Plane } from '@/components/Icons';
import { WalletConnectButton } from '@/components/WalletConnectButton';

export default function Home() {
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
          <div className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-slate-700 hover:text-indigo-600 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-slate-700 hover:text-indigo-600 transition-colors">
              How It Works
            </Link>
            <Link href="#for-churches" className="text-slate-700 hover:text-indigo-600 transition-colors">
              For Churches
            </Link>
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
            <Link href="/register-church" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
              Register Church
            </Link>
            <WalletConnectButton />
          </div>
        </nav>
      </header>

      {/* Hero Content */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
            <span>Powered by Trig Protocol & Blockchain</span>
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
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Everything You Need for
            <span className="block text-indigo-600">Biblical Stewardship</span>
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

      {/* How It Works */}
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

      {/* For Churches */}
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

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Ready to Transform Your Stewardship?
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            Join thousands of believers practicing faithful, automated giving.
          </p>
          <button className="px-10 py-5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-xl hover:shadow-2xl text-lg font-semibold">
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-slate-200 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6 text-indigo-600" />
                <span className="text-lg font-bold text-slate-900">Steward</span>
              </div>
              <p className="text-slate-600 text-sm">
                Biblical stewardship powered by blockchain technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
            <p>&copy; 2025 Steward. All rights reserved. Built with faith and code.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
