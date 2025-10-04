'use client';

import React, { useState, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { WalletConnectButton } from '@/components/WalletConnectButton';
import {
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
} from '@/components/Icons';

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
  incomeAmount: number;
  tithePercentage: number;
  offeringPercentage: number;
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

  // State
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedChurch, setSelectedChurch] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Mock transaction data
  const transactions: Transaction[] = useMemo(() => {
    if (!isConnected) return [];

    return [
      {
        id: '1',
        date: new Date('2024-12-01'),
        churchName: 'Grace Community Church',
        churchAddress: '123 Faith St, Dallas, TX',
        type: 'both',
        titheAmount: 800,
        offeringAmount: 400,
        totalAmount: 1200,
        txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        status: 'completed',
        commitmentId: 'c1',
        incomeAmount: 8000,
        tithePercentage: 10,
        offeringPercentage: 5,
      },
      {
        id: '2',
        date: new Date('2024-11-01'),
        churchName: 'Grace Community Church',
        churchAddress: '123 Faith St, Dallas, TX',
        type: 'both',
        titheAmount: 800,
        offeringAmount: 400,
        totalAmount: 1200,
        txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        status: 'completed',
        commitmentId: 'c1',
        incomeAmount: 8000,
        tithePercentage: 10,
        offeringPercentage: 5,
      },
      {
        id: '3',
        date: new Date('2024-10-01'),
        churchName: 'Grace Community Church',
        churchAddress: '123 Faith St, Dallas, TX',
        type: 'both',
        titheAmount: 800,
        offeringAmount: 400,
        totalAmount: 1200,
        txHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
        status: 'completed',
        commitmentId: 'c1',
        incomeAmount: 8000,
        tithePercentage: 10,
        offeringPercentage: 5,
      },
      {
        id: '4',
        date: new Date('2024-09-01'),
        churchName: 'Grace Community Church',
        churchAddress: '123 Faith St, Dallas, TX',
        type: 'both',
        titheAmount: 800,
        offeringAmount: 400,
        totalAmount: 1200,
        txHash: '0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
        status: 'completed',
        commitmentId: 'c1',
        incomeAmount: 8000,
        tithePercentage: 10,
        offeringPercentage: 5,
      },
      {
        id: '5',
        date: new Date('2024-08-01'),
        churchName: 'Hope Fellowship',
        churchAddress: '456 Prayer Ave, Austin, TX',
        type: 'tithe',
        titheAmount: 500,
        offeringAmount: 0,
        totalAmount: 500,
        txHash: '0x890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678',
        status: 'completed',
        commitmentId: 'c2',
        incomeAmount: 5000,
        tithePercentage: 10,
        offeringPercentage: 0,
      },
      {
        id: '6',
        date: new Date('2024-07-01'),
        churchName: 'Hope Fellowship',
        churchAddress: '456 Prayer Ave, Austin, TX',
        type: 'tithe',
        titheAmount: 500,
        offeringAmount: 0,
        totalAmount: 500,
        txHash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
        status: 'completed',
        commitmentId: 'c2',
        incomeAmount: 5000,
        tithePercentage: 10,
        offeringPercentage: 0,
      },
      {
        id: '7',
        date: new Date('2024-06-01'),
        churchName: 'Grace Community Church',
        churchAddress: '123 Faith St, Dallas, TX',
        type: 'both',
        titheAmount: 800,
        offeringAmount: 400,
        totalAmount: 1200,
        txHash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
        status: 'completed',
        commitmentId: 'c1',
        incomeAmount: 8000,
        tithePercentage: 10,
        offeringPercentage: 5,
      },
      {
        id: '8',
        date: new Date('2024-05-01'),
        churchName: 'Grace Community Church',
        churchAddress: '123 Faith St, Dallas, TX',
        type: 'both',
        titheAmount: 800,
        offeringAmount: 400,
        totalAmount: 1200,
        txHash: '0xabcdef567890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
        status: 'completed',
        commitmentId: 'c1',
        incomeAmount: 8000,
        tithePercentage: 10,
        offeringPercentage: 5,
      },
      {
        id: '9',
        date: new Date('2023-12-01'),
        churchName: 'Grace Community Church',
        churchAddress: '123 Faith St, Dallas, TX',
        type: 'both',
        titheAmount: 750,
        offeringAmount: 375,
        totalAmount: 1125,
        txHash: '0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
        status: 'completed',
        commitmentId: 'c1',
        incomeAmount: 7500,
        tithePercentage: 10,
        offeringPercentage: 5,
      },
      {
        id: '10',
        date: new Date('2023-11-01'),
        churchName: 'Grace Community Church',
        churchAddress: '123 Faith St, Dallas, TX',
        type: 'both',
        titheAmount: 750,
        offeringAmount: 375,
        totalAmount: 1125,
        txHash: '0x7890abcdef234567890abcdef1234567890abcdef1234567890abcdef12345678',
        status: 'completed',
        commitmentId: 'c1',
        incomeAmount: 7500,
        tithePercentage: 10,
        offeringPercentage: 5,
      },
    ];
  }, [isConnected]);

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
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i,
      name: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Giving History</h1>
              <p className="text-gray-600 mt-1">
                Complete record of your faithful stewardship
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setViewMode(viewMode === 'list' ? 'chart' : 'list')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {viewMode === 'list' ? (
                  <>
                    <BarChart3 className="w-5 h-5" />
                    <span>Charts</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    <span>List</span>
                  </>
                )}
              </button>
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

        {/* Yearly Summary Cards */}
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

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              {showFilters ? 'Hide' : 'Show'}
            </button>
          </div>

          {showFilters && (
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
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      {new Date(2024, i, 1).toLocaleString('default', { month: 'long' })}
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
          )}
        </div>

        {/* Chart View */}
        {viewMode === 'chart' && (
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
        {viewMode === 'list' && (
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
                              Church Details
                            </h4>
                            <p className="text-sm text-gray-600">
                              {tx.churchAddress}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                              Income Details
                            </h4>
                            <p className="text-sm text-gray-600">
                              Income: {formatCurrency(tx.incomeAmount)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Tithe: {tx.tithePercentage}% = {formatCurrency(tx.titheAmount)}
                            </p>
                            {tx.offeringPercentage > 0 && (
                              <p className="text-sm text-gray-600">
                                Offering: {tx.offeringPercentage}% = {formatCurrency(tx.offeringAmount)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                              Blockchain Proof
                            </h4>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                              <code className="text-xs text-gray-600 flex-1 font-mono">
                                {shortenTxHash(tx.txHash)}
                              </code>
                              <a
                                href={`https://etherscan.io/tx/${tx.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                              >
                                View
                                <ExternalLink className="w-4 h-4" />
                              </a>
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

        {/* Yearly Summary Section */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Yearly Summary
          </h3>
          <div className="space-y-4">
            {yearlyStats.map(stats => (
              <div
                key={stats.year}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  stats.year === selectedYear
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-bold text-gray-900">{stats.year}</h4>
                  <button
                    onClick={() => {
                      setSelectedYear(stats.year);
                      setSelectedMonth('all');
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    View Details →
                  </button>
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
      </div>
    </div>
  );
}
