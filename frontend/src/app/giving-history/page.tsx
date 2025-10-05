'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { WalletConnectButton } from '@/components/WalletConnectButton';
import { UserMenu } from '@/components/UserMenu';
import { useGivingHistory } from '@/hooks/useGivingHistory';
import { getBlockExplorerUrl } from '@/config/contracts';
import {
  ArrowLeft,
  Shield,
  Calendar,
  Download,
  ExternalLink,
  Filter,
  TrendingUp,
  DollarSign,
  Church,
  Heart,
  ChevronDown,
  ChevronUp,
  FileText,
  Search,
  BarChart3,
  PieChart,
  Spinner,
} from '@/components/Icons';

// ETH to USD conversion rate
const ETH_TO_USD = 4608.59;

// Types
interface Transaction {
  id: string;
  date: Date;
  churchName: string;
  churchAddress: string;
  type: 'tithe' | 'offering' | 'both';
  titheAmount: number;
  offeringAmount: number;
  totalAmount: number;
  txHash: string;
  status: 'completed';
  commitmentId: string;
}

interface YearlyStats {
  year: number;
  totalGiven: number;
  titheTotal: number;
  offeringTotal: number;
  transactionCount: number;
  churches: Set<string>;
}

export default function GivingHistoryPage() {
  const { address, isConnected } = useAccount();
  
  // Fetch giving history from blockchain
  const { transactions: blockchainTransactions, isLoading: isLoadingHistory, hasTransactions } = useGivingHistory();

  // State - Use static year to avoid hydration mismatch
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedChurch, setSelectedChurch] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Transform blockchain transactions to UI format
  const transactions: Transaction[] = useMemo(() => {
    if (!isConnected || !hasTransactions) return [];

    return blockchainTransactions.map(tx => ({
      id: tx.id,
      date: tx.date,
      churchName: tx.organizationName,
      churchAddress: tx.organizationAddress,
      type: 'tithe' as const, // For now, treating all as tithe
      titheAmount: tx.amountUSD,
      offeringAmount: 0, // TODO: Separate tithe/offering in contract
      totalAmount: tx.amountUSD,
      txHash: tx.txHash,
      status: 'completed' as const,
      commitmentId: String(tx.commitmentId),
    }));
  }, [isConnected, hasTransactions, blockchainTransactions]);

  // Calculate available years
  const availableYears = useMemo(() => {
    const years = new Set(transactions.map(tx => tx.date.getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);

  // Calculate available churches
  const availableChurches = useMemo(() => {
    const churches = new Set(transactions.map(tx => tx.churchName));
    return Array.from(churches).sort();
  }, [transactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const yearMatch = tx.date.getFullYear() === selectedYear;
      const monthMatch = selectedMonth === 'all' || tx.date.getMonth() === selectedMonth;
      const churchMatch = selectedChurch === 'all' || tx.churchName === selectedChurch;
      const searchMatch = searchQuery === '' ||
        tx.churchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.txHash.toLowerCase().includes(searchQuery.toLowerCase());

      return yearMatch && monthMatch && churchMatch && searchMatch;
    });
  }, [transactions, selectedYear, selectedMonth, selectedChurch, searchQuery]);

  // Calculate yearly statistics
  const yearlyStats = useMemo(() => {
    const statsByYear = new Map<number, YearlyStats>();

    transactions.forEach(tx => {
      const year = tx.date.getFullYear();
      const existing = statsByYear.get(year) || {
        year,
        totalGiven: 0,
        titheTotal: 0,
        offeringTotal: 0,
        transactionCount: 0,
        churches: new Set<string>(),
      };

      existing.totalGiven += tx.totalAmount;
      existing.titheTotal += tx.titheAmount;
      existing.offeringTotal += tx.offeringAmount;
      existing.transactionCount += 1;
      existing.churches.add(tx.churchName);

      statsByYear.set(year, existing);
    });

    return Array.from(statsByYear.values()).sort((a, b) => b.year - a.year);
  }, [transactions]);

  // Calculate current view statistics
  const currentStats = useMemo(() => {
    const total = filteredTransactions.reduce((sum, tx) => sum + tx.totalAmount, 0);
    const tithe = filteredTransactions.reduce((sum, tx) => sum + tx.titheAmount, 0);
    const offering = filteredTransactions.reduce((sum, tx) => sum + tx.offeringAmount, 0);
    const churches = new Set(filteredTransactions.map(tx => tx.churchName));

    return {
      total,
      tithe,
      offering,
      count: filteredTransactions.length,
      churches: churches.size,
    };
  }, [filteredTransactions]);

  // Monthly breakdown for charts
  const monthlyBreakdown = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i,
      name: monthNames[i],
      total: 0,
      tithe: 0,
      offering: 0,
    }));

    filteredTransactions.forEach(tx => {
      const month = tx.date.getMonth();
      months[month].total += tx.totalAmount;
      months[month].tithe += tx.titheAmount;
      months[month].offering += tx.offeringAmount;
    });

    return months;
  }, [filteredTransactions]);

  // Export functions
  const exportToPDF = () => {
    alert('PDF export would be implemented here. This would generate a detailed giving statement with all transactions and summary statistics.');
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Church', 'Tithe', 'Offering', 'Total', 'Transaction Hash'].join(','),
      ...filteredTransactions.map(tx =>
        [
          tx.date.toLocaleDateString(),
          `"${tx.churchName}"`,
          tx.titheAmount,
          tx.offeringAmount,
          tx.totalAmount,
          tx.txHash,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `giving-history-${selectedYear}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleTransaction = (id: string) => {
    setExpandedTx(expandedTx === id ? null : id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const shortenTxHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  // Not connected state
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <FileText className="mx-auto h-24 w-24 text-indigo-600 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Giving History
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              View your complete giving history, track your impact, and download tax receipts
            </p>
            <WalletConnectButton />
            <p className="mt-6 text-sm text-gray-500">
              Connect your wallet to access your giving history and receipts
            </p>
          </div>
        </div>
      </div>
    );
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
              <h1 className="text-2xl font-bold text-slate-900">Giving History</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/my-commitments" 
                className="px-4 py-2 text-slate-700 hover:text-indigo-600 transition-colors font-medium"
              >
                My Commitments
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
        <div className="max-w-7xl mx-auto">
        {/* Loading State */}
        {!mounted || isLoadingHistory ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Spinner className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading your giving history from blockchain...</p>
            </div>
          </div>
        ) : (
        <>
        {/* No Transactions Yet Banner */}
        {!hasTransactions && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <FileText className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  No Giving History Yet
                </h3>
                <p className="text-blue-700 mb-4">
                  Your giving transactions will appear here once you make payments through your active commitments.
                  Create a commitment to get started!
                </p>
                <Link 
                  href="/create-tithe"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Create First Commitment
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {/* Export Buttons */}
        {hasTransactions && (
        <div className="mb-8">
          <div className="flex justify-end">
            <div className="flex gap-3">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span className="hidden sm:inline">Tax Receipt</span>
              </button>
            </div>
          </div>
        </div>
        )}

        {/* Yearly Summary Cards */}
        {hasTransactions && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Given</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrency(currentStats.total)}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {currentStats.count} transactions
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Tithes</span>
              <Church className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrency(currentStats.tithe)}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {Math.round((currentStats.tithe / currentStats.total) * 100)}% of total
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Offerings</span>
              <Heart className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrency(currentStats.offering)}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {Math.round((currentStats.offering / currentStats.total) * 100)}% of total
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Churches</span>
              <Church className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {currentStats.churches}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Total recipients
            </p>
          </div>
        </div>
        )}

        {/* Yearly Summary Section */}
        {hasTransactions && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Yearly Summary
          </h3>
          <div className="space-y-4">
            {yearlyStats.map(stats => (
              <div
                key={stats.year}
                onClick={() => {
                  setSelectedYear(stats.year);
                  setSelectedMonth('all');
                }}
                className={`p-4 rounded-lg border-2 transition-colors cursor-pointer hover:shadow-md ${
                  stats.year === selectedYear
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-gray-50 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-bold text-gray-900">{stats.year}</h4>
                  <span className="text-sm text-indigo-600 font-medium">
                    View Details →
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Given</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(stats.totalGiven)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Tithes</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(stats.titheTotal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Offerings</p>
                    <p className="text-lg font-bold text-purple-600">
                      {formatCurrency(stats.offeringTotal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Transactions</p>
                    <p className="text-lg font-bold text-gray-900">
                      {stats.transactionCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Churches</p>
                    <p className="text-lg font-bold text-gray-900">
                      {stats.churches.size}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Filters */}
        {hasTransactions && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5" />
            Filters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Month Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Months</option>
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, i) => (
                    <option key={i} value={i}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              {/* Church Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Church
                </label>
                <select
                  value={selectedChurch}
                  onChange={(e) => setSelectedChurch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Churches</option>
                  {availableChurches.map(church => (
                    <option key={church} value={church}>{church}</option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Church or tx hash..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
        </div>
        )}

        {/* View Mode Toggle */}
        {hasTransactions && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'chart' : 'list')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            {viewMode === 'list' ? (
              <>
                <BarChart3 className="w-5 h-5" />
                <span>View Charts</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                <span>View List</span>
              </>
            )}
          </button>
        </div>
        )}

        {/* Chart View */}
        {hasTransactions && viewMode === 'chart' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Giving Breakdown</h3>
            
            {/* Simple Bar Chart */}
            <div className="space-y-4">
              {monthlyBreakdown.map(month => {
                const maxValue = Math.max(...monthlyBreakdown.map(m => m.total));
                const percentage = maxValue > 0 ? (month.total / maxValue) * 100 : 0;

                if (month.total === 0) return null;

                return (
                  <div key={month.month}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 w-12">
                        {month.name}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(month.total)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                        style={{ width: `${percentage}%` }}
                      >
                        {percentage > 20 && (
                          <span className="text-white text-xs font-medium">
                            {month.total > 0 && `${month.tithe > 0 ? 'T: ' + formatCurrency(month.tithe) : ''} ${month.offering > 0 ? 'O: ' + formatCurrency(month.offering) : ''}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-indigo-500 rounded"></div>
                <span className="text-sm text-gray-600">Tithe</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="text-sm text-gray-600">Offering</span>
              </div>
            </div>
          </div>
        )}

        {/* Transaction List */}
        {hasTransactions && viewMode === 'list' && (
          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Transactions Found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters to see more results
                </p>
              </div>
            ) : (
              filteredTransactions.map(tx => (
                <div
                  key={tx.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Main Transaction Row */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => toggleTransaction(tx.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Church className="w-5 h-5 text-indigo-600" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {tx.churchName}
                          </h3>
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                            Completed
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {formatDate(tx.date)}
                        </p>
                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <span className="text-gray-500">Tithe: </span>
                            <span className="font-semibold text-green-600">
                              {formatCurrency(tx.titheAmount)}
                            </span>
                          </div>
                          {tx.offeringAmount > 0 && (
                            <div>
                              <span className="text-gray-500">Offering: </span>
                              <span className="font-semibold text-purple-600">
                                {formatCurrency(tx.offeringAmount)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          {formatCurrency(tx.totalAmount)}
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-700">
                          {expandedTx === tx.id ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedTx === tx.id && (
                    <div className="px-6 pb-6 pt-0 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                              Organization
                            </h4>
                            <p className="text-sm text-gray-900 font-medium mb-1">
                              {tx.churchName}
                            </p>
                            <p className="text-xs text-gray-500 font-mono">
                              {tx.churchAddress}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                              Commitment Details
                            </h4>
                            <p className="text-sm text-gray-600">
                              Commitment ID: #{tx.commitmentId}
                            </p>
                            <p className="text-sm text-gray-600">
                              Amount: {formatCurrency(tx.totalAmount)}
                            </p>
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                              Payment Record
                            </h4>
                            <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                              <p className="text-sm text-gray-600">
                                Payment #{tx.id.split('-')[1]}
                              </p>
                              <p className="text-sm text-gray-600">
                                From Commitment #{tx.commitmentId}
                              </p>
                              <p className="text-xs text-gray-500">
                                This payment is part of your automated tithe commitment recorded on the blockchain.
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                              Tax Receipt
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                alert('Individual receipt download would be implemented here');
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                            >
                              <Download className="w-4 h-4" />
                              Download Receipt
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
        </>
        )}
        </div>
      </main>
    </div>
  );
}
