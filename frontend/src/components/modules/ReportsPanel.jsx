import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
  DollarSign,
  TrendingUp,
  RefreshCw,
  CreditCard,
  AlertCircle,
  Clock,
  CheckCircle2,
  Users
} from 'lucide-react';
import { authService } from '../../api';

export default function ReportsPanel({ userRole: propRole }) {
  const currentUser = authService.getUser() || { role: 'admin' };
  const role = propRole || currentUser.role || 'admin';
  const isAdmin = role === 'admin';
  const isStaff = role === 'staff';

  // 1. Filter States
  const [dateRange, setDateRange] = useState('Month to Date (Oct 2026)');
  const [customerFilter, setCustomerFilter] = useState('All Customers');
  const [activeCategory, setActiveCategory] = useState('revenue');
  const [exportNotice, setExportNotice] = useState('');

  // 4. Report Categories
  const categories = [
    { id: 'revenue', label: 'Revenue Report', icon: DollarSign },
    { id: 'subscription', label: 'Subscription Report', icon: RefreshCw },
    { id: 'payment', label: 'Payment Report', icon: CreditCard },
    { id: 'outstanding', label: 'Outstanding Invoices', icon: Clock },
    { id: 'overdue', label: 'Overdue Invoices', icon: AlertCircle },
  ];

  // Customers for filter
  const customerList = [
    'All Customers',
    'Acme Technologies Inc.',
    'Nexus Cloud Systems',
    'Cloudflow Networks',
    'Horizon AI Labs',
    'Apex Global Media',
  ];

  // Summary Metrics per category
  const categoryStats = {
    revenue: [
      { label: 'Total Revenue (MTD)', value: '$384,120', change: '+18.5% MoM', positive: true },
      { label: 'MRR Current', value: '$42,850', change: '+14.2% MoM', positive: true },
      { label: 'Avg Customer ARPU', value: '$300.09', change: '+6.1% vs target', positive: true },
      { label: 'Net Lifetime Value', value: '$3,840', change: 'Stable', positive: true },
    ],
    subscription: [
      { label: 'Active Subscriptions', value: '892', change: '+8.4% MoM', positive: true },
      { label: 'Paused Accounts', value: '184', change: '14.2% churn risk', positive: false },
      { label: 'New Signups (MTD)', value: '64', change: '+12 accounts', positive: true },
      { label: 'Renewal Success Rate', value: '96.2%', change: '+1.5% improvement', positive: true },
    ],
    payment: [
      { label: 'Cleared Transactions', value: '$42,390', change: '84 payments', positive: true },
      { label: 'ACH / Wire Share', value: '64.8%', change: 'Low gateway fee', positive: true },
      { label: 'Card Debits (Stripe)', value: '35.2%', change: 'Automated', positive: true },
      { label: 'Failed Debit Rate', value: '0.8%', change: 'Well under benchmark', positive: true },
    ],
    outstanding: [
      { label: 'Total Outstanding', value: '$6,450', change: '14 invoices', positive: false },
      { label: 'Average Days to Pay', value: '8.4 Days', change: 'Normal cycle', positive: true },
      { label: 'Due Next 7 Days', value: '$4,630', change: '7 invoices', positive: false },
      { label: 'Dispute Rate', value: '0.0%', change: '0 reported', positive: true },
    ],
    overdue: [
      { label: 'Total Overdue', value: '$1,820', change: '5 accounts past due', positive: false },
      { label: '1 - 15 Days Past Due', value: '$1,370', change: '3 invoices', positive: false },
      { label: '16 - 30 Days Past Due', value: '$450', change: '2 invoices', positive: false },
      { label: 'Recovery Rate', value: '91.4%', change: 'Collected in 14d', positive: true },
    ],
  };

  // Table Data per category
  const reportTableData = {
    revenue: [
      { col1: 'Enterprise Monthly Plans', col2: '$24,000.00', col3: '40 Accounts', col4: '+$3,200 (MoM)', col5: 'Recurring' },
      { col1: 'Growth Yearly Bundles', col2: '$12,800.00', col3: '16 Accounts', col4: '+$1,800 (MoM)', col5: 'Annual' },
      { col1: 'Starter Tier Base', col2: '$4,500.00', col3: '150 Accounts', col4: '+$450 (MoM)', col5: 'Recurring' },
      { col1: 'Add-on Storage & Seats', col2: '$1,550.00', col3: '31 Accounts', col4: '+$120 (MoM)', col5: 'Usage' },
    ],
    subscription: [
      { col1: 'SUB-2026-101', col2: 'Acme Technologies Inc.', col3: 'Enterprise Cloud Suite', col4: 'Active', col5: 'Next bill: 14-Nov-2026' },
      { col1: 'SUB-2026-102', col2: 'Nexus Cloud Systems', col3: 'Growth Startup Stack', col4: 'Active', col5: 'Next bill: 15-Nov-2026' },
      { col1: 'SUB-2026-103', col2: 'Cloudflow Networks', col3: 'Team Tier Monthly', col4: 'Paused', col5: 'Paused: 28-Oct-2026' },
      { col1: 'SUB-2026-104', col2: 'Horizon AI Labs', col3: 'Enterprise Annual Stack', col4: 'Active', col5: 'Next bill: 01-Jan-2027' },
    ],
    payment: [
      { col1: 'PAY-8822', col2: 'Acme Technologies Inc.', col3: '$3,600.00', col4: 'Bank Transfer (ACH)', col5: 'Cleared (30-Oct-2026)' },
      { col1: 'PAY-8821', col2: 'Nexus Cloud Systems', col3: '$450.00', col4: 'Credit Card (Visa)', col5: 'Cleared (29-Oct-2026)' },
      { col1: 'PAY-8820', col2: 'Cloudflow Networks', col3: '$890.00', col4: 'Credit Card (MC)', col5: 'Cleared (28-Oct-2026)' },
      { col1: 'PAY-8819', col2: 'Horizon AI Labs', col3: '$1,200.00', col4: 'Direct Wire', col5: 'Cleared (27-Oct-2026)' },
    ],
    outstanding: [
      { col1: 'INV-2026-090', col2: 'Vanguard Analytics', col3: '$2,450.00', col4: 'Due in 10 days', col5: 'Pending Net-30' },
      { col1: 'INV-2026-091', col2: 'Starlight Media', col3: '$2,180.00', col4: 'Due in 15 days', col5: 'Pending Net-15' },
      { col1: 'INV-2026-092', col2: 'Summit Health Tech', col3: '$1,820.00', col4: 'Due in 18 days', col5: 'Pending Net-30' },
    ],
    overdue: [
      { col1: 'INV-2026-088', col2: 'Nexus Cloud Systems', col3: '$450.00', col4: '2 Days Overdue', col5: 'First Notice Sent' },
      { col1: 'INV-2026-087', col2: 'Global Logistics Hub', col3: '$1,370.00', col4: '6 Days Overdue', col5: 'Second Notice Sent' },
    ],
  };

  const tableHeaders = {
    revenue: ['Revenue Stream / Product', 'Net Volume', 'Subscribers', 'Trend vs Last Month', 'Category'],
    subscription: ['Subscription ID', 'Customer Account', 'Associated Plan', 'Status', 'Renewal Schedule'],
    payment: ['Payment ID', 'Customer Account', 'Amount Paid', 'Settlement Channel', 'Status / Cleared Date'],
    outstanding: ['Invoice ID', 'Customer Account', 'Amount Due', 'Due Window', 'Terms Status'],
    overdue: ['Invoice ID', 'Customer Account', 'Overdue Balance', 'Days Overdue', 'Collection State'],
  };

  const handleExport = (type) => {
    const formatName = type.toUpperCase();
    setExportNotice(`Generated and downloaded ${categories.find(c => c.id === activeCategory)?.label} (${formatName}).`);
    setTimeout(() => setExportNotice(''), 3500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header & Export Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Reports & Analytics</h1>
          <p className="text-xs text-neutral-500 mt-1">
            {isAdmin
              ? 'Complete business intelligence, MRR trajectory, cash settlements, and accounts receivable audit.'
              : 'Operational reports with delivery summaries, task metrics, and account health.'}
          </p>
        </div>

        {/* 8, 9. Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('csv')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E8E8E8] bg-white text-xs font-semibold text-neutral-800 hover:text-black hover:border-black transition-colors shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#788A5B]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-[#F2F4ED]" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3.5 rounded-xl bg-[#F2F4ED] border border-[#788A5B]/30 text-xs font-semibold text-[#788A5B] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#788A5B]" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* 4. Category Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#E8E8E8]">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-black text-white shadow-2xs'
                  : 'text-neutral-600 hover:text-black hover:bg-[#F2F4ED]/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F2F4ED]' : 'text-[#788A5B]'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2 & 3. Date Range & Customer Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E8E8E8] shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 border border-[#E8E8E8] rounded-xl px-3 py-1.5 bg-white">
            <Calendar className="w-3.5 h-3.5 text-[#788A5B]" />
            <span className="font-medium text-black">Period:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent border-none text-xs text-black font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Month to Date (Oct 2026)">Month to Date (Oct 2026)</option>
              <option value="Quarter to Date (Q4)">Quarter to Date (Q4)</option>
              <option value="Year to Date (2026)">Year to Date (2026)</option>
              <option value="Trailing 12 Months">Trailing 12 Months</option>
            </select>
          </div>

          {(isAdmin || isStaff) && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 border border-[#E8E8E8] rounded-xl px-3 py-1.5 bg-white">
              <Users className="w-3.5 h-3.5 text-[#788A5B]" />
              <span className="font-medium text-black">Account:</span>
              <select
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
                className="bg-transparent border-none text-xs text-black font-semibold focus:outline-none cursor-pointer"
              >
                {customerList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <span className="text-[11px] text-neutral-400 font-medium">
          Data synchronized: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* 6. Summary Cards for Selected Report */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryStats[activeCategory].map((st, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white border border-[#E8E8E8] shadow-xs">
            <span className="text-xs font-medium text-neutral-500">{st.label}</span>
            <p className="text-2xl font-bold text-black mt-2">{st.value}</p>
            <span
              className={`text-[11px] font-semibold mt-1 block ${
                st.positive ? 'text-[#788A5B]' : 'text-neutral-500'
              }`}
            >
              {st.change}
            </span>
          </div>
        ))}
      </div>

      {/* 7. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Revenue Trend */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E8E8] shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-black">Revenue Trajectory ($ USD)</h3>
              <p className="text-xs text-neutral-500">Trailing 6 months MRR and total collected revenue</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-black">
                <span className="w-2.5 h-2.5 rounded-full bg-[#788A5B]"></span> MRR
              </span>
              <span className="flex items-center gap-1.5 font-medium text-neutral-500">
                <span className="w-2.5 h-2.5 rounded-full bg-black"></span> Total Collected
              </span>
            </div>
          </div>

          <div className="h-52 w-full pt-2">
            <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#788A5B" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#788A5B" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#E8E8E8" strokeDasharray="3 3" />
              <line x1="0" y1="70" x2="500" y2="70" stroke="#E8E8E8" strokeDasharray="3 3" />
              <line x1="0" y1="110" x2="500" y2="110" stroke="#E8E8E8" strokeDasharray="3 3" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#E8E8E8" />

              {/* Area fill */}
              <polygon
                points="0,150 0,130 100,115 200,95 300,75 400,50 500,32 500,150"
                fill="url(#chartGrad)"
              />

              {/* MRR Line */}
              <polyline
                fill="none"
                stroke="#788A5B"
                strokeWidth="2.5"
                points="0,130 100,115 200,95 300,75 400,50 500,32"
              />

              {/* Dots */}
              {[[0,130], [100,115], [200,95], [300,75], [400,50], [500,32]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="3.5" fill="#FFFFFF" stroke="#788A5B" strokeWidth="2" />
              ))}

              {/* X Axis Labels */}
              <text x="5" y="160" fontSize="9" fill="#999">May</text>
              <text x="95" y="160" fontSize="9" fill="#999">Jun</text>
              <text x="195" y="160" fontSize="9" fill="#999">Jul</text>
              <text x="295" y="160" fontSize="9" fill="#999">Aug</text>
              <text x="395" y="160" fontSize="9" fill="#999">Sep</text>
              <text x="475" y="160" fontSize="9" fill="#999">Oct 26</text>
            </svg>
          </div>
        </div>

        {/* Chart 2: Subscription & Payment Status Breakdown */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E8E8] shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-black">Portfolio Health</h3>
            <p className="text-xs text-neutral-500">Distribution breakdown across customer accounts</p>

            <div className="flex items-center justify-center my-6">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  {/* Background track */}
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E8E8E8" strokeWidth="3.8" />
                  {/* Active Segment (68%) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#788A5B"
                    strokeWidth="3.8"
                    strokeDasharray="68 32"
                    strokeDashoffset="0"
                  />
                  {/* Paused Segment (14%) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="3.8"
                    strokeDasharray="14 86"
                    strokeDashoffset="-68"
                  />
                  {/* Past Due / Overdue (18%) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#D4DAC8"
                    strokeWidth="3.8"
                    strokeDasharray="18 82"
                    strokeDashoffset="-82"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs text-neutral-400 font-medium">Active</span>
                  <span className="text-lg font-bold text-black">68%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t border-[#E8E8E8] pt-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#788A5B]"></span>
                <span className="text-neutral-700">Active Subscriptions</span>
              </span>
              <span className="font-bold text-black">892 (68%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-black"></span>
                <span className="text-neutral-700">Paused / On Hold</span>
              </span>
              <span className="font-bold text-black">184 (14%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4DAC8]"></span>
                <span className="text-neutral-700">Overdue Invoices</span>
              </span>
              <span className="font-bold text-black">236 (18%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Report Data Table */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8E8E8] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-black">
              {categories.find((c) => c.id === activeCategory)?.label} Ledger
            </h3>
            <p className="text-xs text-neutral-500">Filtered view for period: {dateRange}</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F2F4ED] text-[#788A5B] border border-[#788A5B]/20">
            Audit Ready
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
              <tr>
                {tableHeaders[activeCategory].map((h, i) => (
                  <th key={i} className="py-3 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
              {reportTableData[activeCategory].map((row, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-black">{row.col1}</td>
                  <td className="py-3.5 px-4 font-medium text-neutral-800">{row.col2}</td>
                  <td className="py-3.5 px-4 font-semibold text-black">{row.col3}</td>
                  <td className="py-3.5 px-4 text-neutral-600">{row.col4}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8]">
                      {row.col5}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
