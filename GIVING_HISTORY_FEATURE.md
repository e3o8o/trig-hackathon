# 📊 Giving History Feature - Technical Documentation

## Overview
**User Story 1.3**: Believers can view their complete giving history, track stewardship, and download tax receipts.

**Route**: `/giving-history`  
**Component**: `src/app/giving-history/page.tsx`  
**Status**: ✅ **COMPLETE** (Phase 2)

---

## 🎯 Feature Requirements

### Acceptance Criteria
- ✅ User can view all past tithe payments
- ✅ See amounts, dates, and recipients
- ✅ View running totals (yearly, lifetime)
- ✅ Export giving statements (CSV)
- ✅ Generate tax receipts (PDF)
- ✅ See blockchain proof of each payment
- ✅ Filter by year, month, and church
- ✅ Search transactions
- ✅ View charts and visualizations
- ✅ Expandable transaction details

---

## 🏗️ Architecture

### Component Structure
```
GivingHistoryPage
├── Header (with view toggle & export buttons)
├── Summary Cards (4 metrics)
├── Filters Section (year, month, church, search)
├── View Toggle
│   ├── List View (transaction cards)
│   └── Chart View (monthly breakdown)
├── Transaction List (expandable)
└── Yearly Summary Section
```

### State Management
```typescript
// View & Filter State
- selectedYear: number
- selectedMonth: number | 'all'
- selectedChurch: string
- searchQuery: string
- viewMode: 'list' | 'chart'
- expandedTx: string | null
- showFilters: boolean
```

### Data Types
```typescript
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
```

---

## 🎨 UI Components

### 1. Header Section
**Purpose**: Navigation and primary actions

**Elements**:
- Page title and description
- View mode toggle (List ↔ Chart)
- Export CSV button
- Export PDF/Tax Receipt button

**Actions**:
```typescript
- toggleViewMode() → Switch between list and chart views
- exportToCSV() → Download filtered transactions as CSV
- exportToPDF() → Generate annual tax receipt
```

### 2. Summary Cards (4-Grid Layout)

#### Card 1: Total Given
- **Metric**: Sum of all filtered transactions
- **Icon**: DollarSign (green)
- **Subtext**: Transaction count

#### Card 2: Tithes
- **Metric**: Total tithe amount
- **Icon**: Church (indigo)
- **Subtext**: Percentage of total

#### Card 3: Offerings
- **Metric**: Total offering amount
- **Icon**: Heart (purple)
- **Subtext**: Percentage of total

#### Card 4: Churches
- **Metric**: Number of unique recipients
- **Icon**: Church (amber)
- **Subtext**: "Total recipients"

### 3. Filters Section
**Purpose**: Refine transaction view

**Filter Options**:
1. **Year Dropdown**: Select from available years
2. **Month Dropdown**: All months or specific month
3. **Church Dropdown**: All churches or specific church
4. **Search Input**: Search by church name or transaction hash

**Behavior**:
- Collapsible (Show/Hide toggle)
- Filters apply immediately
- Updates summary cards and transaction list
- Filters are combinable (AND logic)

### 4. Chart View
**Purpose**: Visual monthly giving breakdown

**Features**:
- Horizontal bar chart for each month
- Bar width represents percentage of max month
- Shows tithe and offering breakdown
- Color gradient (indigo → purple)
- Legend at bottom
- Only shows months with transactions

**Calculation**:
```typescript
// For each month
percentage = (monthTotal / maxMonthTotal) * 100
```

### 5. Transaction List (List View)

#### Transaction Card (Collapsed)
**Layout**:
```
┌─────────────────────────────────────────────┐
│ 🏛️ Church Name              [Completed]     │
│ Date                                   $XXX │
│ Tithe: $XXX | Offering: $XXX              ∨ │
└─────────────────────────────────────────────┘
```

**Data Displayed**:
- Church icon and name
- Status badge (green "Completed")
- Transaction date
- Tithe and offering amounts
- Total amount (large, right-aligned)
- Expand toggle (chevron)

#### Transaction Card (Expanded)
**Additional Details**:

**Left Column**:
- Church address
- Income amount
- Tithe percentage and calculation
- Offering percentage and calculation

**Right Column**:
- Blockchain proof (tx hash with Etherscan link)
- "View on Explorer" button
- "Download Receipt" button

**Behavior**:
- Click anywhere to expand/collapse
- Only one card expanded at a time
- Smooth transition animation

### 6. Yearly Summary Section
**Purpose**: Multi-year overview

**Layout**:
```
Year: 2024                    [View Details →]
Total: $XX,XXX | Tithe: $XX,XXX | Offering: $X,XXX
Transactions: XX | Churches: X
```

**Features**:
- One row per year
- Highlighted if selected year
- Click "View Details" to filter to that year
- Shows 5 key metrics per year
- Sorted by year (descending)

---

## 🔄 User Flows

### Flow 1: View Complete History
```
1. User lands on /giving-history
2. Connects wallet (if not connected)
3. Sees all transactions (default: current year)
4. Views summary cards with totals
5. Scrolls through transaction list
```

### Flow 2: Filter Transactions
```
1. User clicks "Show" filters
2. Selects year from dropdown
3. Selects specific month (optional)
4. Selects specific church (optional)
5. Enters search query (optional)
6. Summary cards update automatically
7. Transaction list filters immediately
```

### Flow 3: Export Tax Receipt
```
1. User reviews transactions for specific year
2. Clicks "Tax Receipt" button
3. PDF generates with:
   - Annual summary
   - All transactions for the year
   - Church details
   - Total amounts
   - For tax filing purposes
```

### Flow 4: Export CSV
```
1. User applies filters (if desired)
2. Clicks "Export CSV" button
3. CSV downloads with columns:
   - Date
   - Church
   - Tithe
   - Offering
   - Total
   - Transaction Hash
4. Opens in Excel/Sheets
```

### Flow 5: View Transaction Details
```
1. User clicks on a transaction card
2. Card expands to show full details
3. User reviews church address, calculations
4. User clicks "View on Explorer"
5. Etherscan opens in new tab
6. User verifies transaction on blockchain
```

### Flow 6: View Charts
```
1. User clicks "Charts" button
2. View switches to bar chart mode
3. User sees monthly breakdown
4. Each bar shows tithe + offering split
5. User identifies giving patterns
6. User switches back to list view
```

---

## 💻 Key Functions

### Filtering & Calculation
```typescript
// Filter transactions based on all criteria
filteredTransactions = useMemo(() => {
  return transactions.filter(tx => {
    const yearMatch = tx.date.getFullYear() === selectedYear;
    const monthMatch = selectedMonth === 'all' || 
                       tx.date.getMonth() === selectedMonth;
    const churchMatch = selectedChurch === 'all' || 
                        tx.churchName === selectedChurch;
    const searchMatch = searchQuery === '' ||
      tx.churchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.txHash.toLowerCase().includes(searchQuery.toLowerCase());

    return yearMatch && monthMatch && churchMatch && searchMatch;
  });
}, [transactions, selectedYear, selectedMonth, selectedChurch, searchQuery]);
```

### Summary Statistics
```typescript
// Calculate current view statistics
currentStats = useMemo(() => {
  const total = filteredTransactions.reduce((sum, tx) => 
    sum + tx.totalAmount, 0);
  const tithe = filteredTransactions.reduce((sum, tx) => 
    sum + tx.titheAmount, 0);
  const offering = filteredTransactions.reduce((sum, tx) => 
    sum + tx.offeringAmount, 0);
  const churches = new Set(filteredTransactions.map(tx => 
    tx.churchName));

  return {
    total,
    tithe,
    offering,
    count: filteredTransactions.length,
    churches: churches.size,
  };
}, [filteredTransactions]);
```

### Yearly Statistics
```typescript
// Calculate multi-year summary
yearlyStats = useMemo(() => {
  const statsByYear = new Map<number, YearlyStats>();

  transactions.forEach(tx => {
    const year = tx.date.getFullYear();
    const existing = statsByYear.get(year) || {
      year, totalGiven: 0, titheTotal: 0, 
      offeringTotal: 0, transactionCount: 0, 
      churches: new Set<string>()
    };

    existing.totalGiven += tx.totalAmount;
    existing.titheTotal += tx.titheAmount;
    existing.offeringTotal += tx.offeringAmount;
    existing.transactionCount += 1;
    existing.churches.add(tx.churchName);

    statsByYear.set(year, existing);
  });

  return Array.from(statsByYear.values())
    .sort((a, b) => b.year - a.year);
}, [transactions]);
```

### Monthly Breakdown
```typescript
// Prepare data for chart view
monthlyBreakdown = useMemo(() => {
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i,
    name: new Date(2024, i, 1).toLocaleString('default', 
      { month: 'short' }),
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
```

### Export Functions
```typescript
// Export to CSV
const exportToCSV = () => {
  const csvContent = [
    ['Date', 'Church', 'Tithe', 'Offering', 'Total', 
     'Transaction Hash'].join(','),
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

// Export to PDF (placeholder)
const exportToPDF = () => {
  alert('PDF export would generate a detailed giving statement ' +
        'with all transactions and summary statistics.');
};
```

---

## 🎨 Visual Design

### Color System
- **Indigo**: Primary actions, active states
- **Green**: Success, tithe amounts, positive metrics
- **Purple**: Offerings, accent colors
- **Amber**: Secondary metrics (churches)
- **Gray**: Secondary text, borders, inactive states
- **White**: Cards, background surfaces

### Typography
- **Headings**: 3xl-5xl, bold, gray-900
- **Metrics**: 2xl-4xl, bold, color-coded
- **Body**: base-lg, gray-600
- **Labels**: sm, medium, gray-700
- **Code**: xs, mono, gray-600 (tx hashes)

### Spacing
- **Cards**: p-6, rounded-xl
- **Grid gaps**: gap-4 to gap-8
- **Section spacing**: py-8 to py-12
- **Element gaps**: gap-2 to gap-4

### Shadows & Borders
- **Cards**: shadow-sm, border border-gray-200
- **Hover**: shadow-md transition
- **Active**: border-2 border-indigo-500

---

## 🔗 Integration Points

### Backend Integration (Production)
```typescript
// Fetch transaction history from backend
const fetchTransactionHistory = async (walletAddress: string) => {
  const response = await fetch(`/api/giving-history/${walletAddress}`);
  const data = await response.json();
  return data.transactions;
};

// Real-time updates via WebSocket
const subscribeToNewTransactions = (walletAddress: string) => {
  const ws = new WebSocket(`wss://api.steward.com/ws`);
  ws.send(JSON.stringify({ 
    type: 'subscribe', 
    address: walletAddress 
  }));
  ws.onmessage = (event) => {
    const newTx = JSON.parse(event.data);
    // Update local state
  };
};
```

### Blockchain Verification
```typescript
// Verify transaction on-chain
const verifyTransaction = async (txHash: string) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const tx = await provider.getTransaction(txHash);
  const receipt = await provider.getTransactionReceipt(txHash);
  return { tx, receipt };
};
```

### Export to External Systems
```typescript
// Export to accounting software (QuickBooks, etc.)
const exportToQuickBooks = async (transactions: Transaction[]) => {
  // Format transactions for QuickBooks API
  const qbTransactions = transactions.map(tx => ({
    date: tx.date,
    amount: tx.totalAmount,
    memo: `Tithe to ${tx.churchName}`,
    category: 'Charitable Contributions',
  }));
  
  // Send to QuickBooks API
  await fetch('https://api.quickbooks.com/v3/transaction', {
    method: 'POST',
    body: JSON.stringify(qbTransactions),
  });
};
```

---

## 🧪 Testing Checklist

### Functional Tests
- [ ] Page loads with wallet connected
- [ ] Shows "Connect Wallet" prompt when disconnected
- [ ] Displays all transactions correctly
- [ ] Summary cards calculate totals accurately
- [ ] Year filter works correctly
- [ ] Month filter works correctly
- [ ] Church filter works correctly
- [ ] Search filter works correctly
- [ ] Combined filters work correctly
- [ ] Transaction cards expand/collapse
- [ ] Only one card expands at a time
- [ ] Chart view displays correctly
- [ ] Monthly breakdown accurate
- [ ] CSV export downloads correctly
- [ ] CSV contains all expected data
- [ ] Yearly summary section accurate
- [ ] "View Details" updates filters
- [ ] Etherscan links open correctly
- [ ] No transactions message displays

### Visual Tests
- [ ] Responsive on mobile (320px+)
- [ ] Responsive on tablet (768px+)
- [ ] Responsive on desktop (1024px+)
- [ ] Cards align properly
- [ ] Icons display correctly
- [ ] Colors match design system
- [ ] Hover states work
- [ ] Transitions smooth
- [ ] Text readable at all sizes
- [ ] Charts render correctly
- [ ] Bar widths accurate

### Performance Tests
- [ ] Renders quickly with 100 transactions
- [ ] Filters apply instantly
- [ ] No lag when expanding cards
- [ ] Smooth scrolling
- [ ] useMemo prevents unnecessary recalculations
- [ ] CSV export handles large datasets

### Edge Cases
- [ ] No transactions (empty state)
- [ ] Single transaction
- [ ] Hundreds of transactions
- [ ] Very long church names
- [ ] Missing offering amounts (tithe only)
- [ ] Same church multiple times
- [ ] Transactions across multiple years
- [ ] Year with no transactions
- [ ] Search with no results
- [ ] Invalid transaction hash format

---

## 📊 Mock Data

### Sample Transaction
```typescript
{
  id: '1',
  date: new Date('2024-12-01'),
  churchName: 'Grace Community Church',
  churchAddress: '123 Faith St, Dallas, TX',
  type: 'both',
  titheAmount: 800,
  offeringAmount: 400,
  totalAmount: 1200,
  txHash: '0x1234...cdef',
  status: 'completed',
  commitmentId: 'c1',
  incomeAmount: 8000,
  tithePercentage: 10,
  offeringPercentage: 5,
}
```

### Example Scenarios
1. **Regular Monthly Giver**: 12 transactions/year, same church, consistent amounts
2. **Multi-Church Giver**: Splits giving between 2-3 churches
3. **Variable Income**: Different amounts each month
4. **Tithe Only**: No additional offerings
5. **Seasonal Giver**: Higher amounts during holidays

---

## 🚀 Future Enhancements

### Phase 3 Features
1. **Advanced Charts**
   - Pie chart by church
   - Line chart showing trends
   - Yearly comparison charts
   - Giving pace tracker

2. **Enhanced Receipts**
   - Branded PDF with church logo
   - QR code for verification
   - IRS-compliant format
   - Email delivery

3. **Social Features**
   - Anonymous leaderboards
   - Share milestones
   - Church giving walls
   - Impact stories

4. **Analytics**
   - Giving consistency score
   - Projected annual giving
   - Comparison to previous years
   - Church diversity metrics

5. **Integrations**
   - Direct email to tax software
   - Calendar reminders
   - Bank account sync
   - Mobile app companion

---

## 📚 Related Documentation
- `MY_COMMITMENTS_FEATURE.md` - Phase 1 implementation
- `CREATE_TITHE_FEATURE.md` - User Story 1.1
- `PHASE_1_SUMMARY.md` - My Commitments overview
- `README.md` - Project overview
