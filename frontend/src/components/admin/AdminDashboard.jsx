import React, { useState } from 'react';
import {
  Users,
  CreditCard,
  TrendingUp,
  DollarSign,
  AlertCircle,
  FileWarning,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  RefreshCw,
  ChevronDown,
  ShieldCheck,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function AdminDashboard({ onNavigate }) {
  const [revenuePeriod, setRevenuePeriod] = useState('monthly');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // KPI Data
  const kpiCards = [
    {
      title: 'Total Customers',
      value: '1,280',
      change: '+12.5%',
      isPositive: true,
      period: 'vs last month',
      icon: Users,
    },
    {
      title: 'Active Subscriptions',
      value: '892',
      change: '+8.4%',
      isPositive: true,
      period: 'vs last month',
      icon: RefreshCw,
    },
    {
      title: 'Monthly Recurring Revenue (MRR)',
      value: '$42,850',
      change: '+14.2%',
      isPositive: true,
      period: 'vs last month',
      icon: TrendingUp,
    },
    {
      title: 'Total Revenue Collected',
      value: '$384,120',
      change: '+18.5%',
      isPositive: true,
      period: 'vs last month',
      icon: DollarSign,
    },
    {
      title: 'Outstanding Payments',
      value: '$6,450',
      change: '14 pending',
      isPositive: false,
      period: 'requires review',
      icon: AlertCircle,
    },
    {
      title: 'Overdue Invoices',
      value: '$1,820',
      change: '5 overdue',
      isPositive: false,
      period: 'action needed',
      icon: FileWarning,
    },
  ];

  // Revenue chart data (12 months)
  const revenueData = [
    { month: 'Jan', mrr: 24, total: 32 },
    { month: 'Feb', mrr: 26, total: 35 },
    { month: 'Mar', mrr: 28, total: 37 },
    { month: 'Apr', mrr: 31, total: 42 },
    { month: 'May', mrr: 33, total: 46 },
    { month: 'Jun', mrr: 35, total: 50 },
    { month: 'Jul', mrr: 36, total: 52 },
    { month: 'Aug', mrr: 38, total: 55 },
    { month: 'Sep', mrr: 40, total: 58 },
    { month: 'Oct', mrr: 42.8, total: 64 },
    { month: 'Nov', mrr: 45, total: 67 },
    { month: 'Dec', mrr: 48, total: 72 },
  ];

  // Subscription status distribution
  const subStatus = [
    { label: 'Active', count: 606, pct: '68%', color: '#788A5B' },
    { label: 'Paused', count: 125, pct: '14%', color: '#97A87A' },
    { label: 'Closed', count: 98, pct: '11%', color: '#2B2D2F' },
    { label: 'Draft', count: 63, pct: '7%', color: '#D2D9C5' },
  ];

  // Recent Subscriptions
  const recentSubscriptions = [
    { id: 'SUB-2041', customer: 'Acme Technologies Inc.', plan: 'Enterprise Yearly', date: 'Oct 30, 2026', status: 'Active' },
    { id: 'SUB-2040', customer: 'Nexus Cloud Systems', plan: 'Pro Monthly', date: 'Oct 29, 2026', status: 'Active' },
    { id: 'SUB-2039', customer: 'Vertex Media Global', plan: 'Standard Monthly', date: 'Oct 28, 2026', status: 'Paused' },
    { id: 'SUB-2038', customer: 'Horizon AI Labs', plan: 'Enterprise Quarterly', date: 'Oct 27, 2026', status: 'Active' },
    { id: 'SUB-2037', customer: 'BlueSky Digital LLC', plan: 'Starter Yearly', date: 'Oct 25, 2026', status: 'Draft' },
  ];

  // Recent Payments
  const recentPayments = [
    { id: 'PAY-8821', customer: 'Acme Technologies Inc.', invoice: 'INV-2026-089', amount: '$3,600.00', date: 'Oct 30, 2026', status: 'Paid' },
    { id: 'PAY-8820', customer: 'Nexus Cloud Systems', invoice: 'INV-2026-088', amount: '$450.00', date: 'Oct 29, 2026', status: 'Paid' },
    { id: 'PAY-8819', customer: 'Cloudflow Networks', invoice: 'INV-2026-087', amount: '$890.00', date: 'Oct 28, 2026', status: 'Paid' },
    { id: 'PAY-8818', customer: 'Horizon AI Labs', invoice: 'INV-2026-086', amount: '$1,200.00', date: 'Oct 27, 2026', status: 'Paid' },
    { id: 'PAY-8817', customer: 'Stellar Analytics', invoice: 'INV-2026-085', amount: '$750.00', date: 'Oct 25, 2026', status: 'Paid' },
  ];

  // Alerts and Reminders
  const alerts = [
    {
      id: 1,
      type: 'renewal',
      title: 'Upcoming Subscription Renewals',
      description: '18 high-value subscriptions are due for renewal within the next 7 days.',
      detail: '$14,200 expected ARR',
      icon: Clock,
      badge: '18 Renewals',
      badgeClass: 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]',
    },
    {
      id: 2,
      type: 'overdue',
      title: 'Overdue Invoices Requiring Follow-up',
      description: '5 customer invoices are overdue past 15 days.',
      detail: '$1,820 total overdue balance',
      icon: AlertCircle,
      badge: '5 Overdue',
      badgeClass: 'bg-red-50 text-red-700 border-red-200',
    },
    {
      id: 3,
      type: 'created',
      title: 'Recently Created Subscriptions',
      description: '12 new subscriptions provisioned in the last 72 hours across Pro and Enterprise tiers.',
      detail: '+$4,920 new MRR added',
      icon: CheckCircle2,
      badge: '12 New',
      badgeClass: 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]',
    },
    {
      id: 4,
      type: 'expiry',
      title: 'Plans Approaching Sunset / Expiry',
      description: 'Legacy pricing tier (v1 Starter Tier) will be retired on November 15, 2026.',
      detail: '8 customers still mapped',
      icon: FileWarning,
      badge: 'Action Needed',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    },
  ];

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    let classes = 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]';
    if (status === 'Paused') classes = 'bg-amber-50 text-amber-800 border-amber-200';
    if (status === 'Closed') classes = 'bg-neutral-100 text-neutral-700 border-neutral-300';
    if (status === 'Draft') classes = 'bg-blue-50 text-blue-700 border-blue-200';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* A. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E8E8E8]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Welcome back, <span className="font-semibold text-black">Admin</span> — here is what is happening with your subscription business today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Current Date Pill */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs font-medium text-neutral-600 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-[#788A5B]" />
            <span>{currentDate}</span>
          </div>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl border border-[#E8E8E8] bg-white text-neutral-600 hover:text-black hover:border-neutral-300 transition-colors shadow-xs"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#788A5B] ring-2 ring-white"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-[#E8E8E8] shadow-lg p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Notifications</span>
                  <span className="text-[11px] font-medium text-[#788A5B] bg-[#F2F4ED] px-2 py-0.5 rounded-full">3 unread</span>
                </div>
                <div className="mt-3 space-y-3">
                  <div className="text-xs text-neutral-700">
                    <p className="font-medium text-black">Payment Received: $3,600</p>
                    <p className="text-neutral-500 mt-0.5">Acme Corp invoice INV-2026-089 settled.</p>
                  </div>
                  <div className="text-xs text-neutral-700">
                    <p className="font-medium text-black">New Subscription Added</p>
                    <p className="text-neutral-500 mt-0.5">Nexus Cloud upgraded to Enterprise Tier.</p>
                  </div>
                  <div className="text-xs text-neutral-700">
                    <p className="font-medium text-black">Overdue Alert</p>
                    <p className="text-neutral-500 mt-0.5">Invoice INV-2026-072 is 15 days overdue.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl border border-[#E8E8E8] bg-white hover:border-neutral-300 transition-colors shadow-xs"
            >
              <div className="w-7 h-7 rounded-lg bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center font-bold text-xs">
                A
              </div>
              <span className="text-xs font-semibold text-black hidden sm:inline">Admin</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E8E8E8] shadow-lg p-3 z-50">
                <div className="px-2 py-1.5 border-b border-[#E8E8E8] mb-2">
                  <p className="text-xs font-semibold text-black">System Administrator</p>
                  <p className="text-[11px] text-neutral-500 truncate">admin@subscription.com</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider bg-[#F2F4ED] text-[#788A5B] px-1.5 py-0.5 rounded">
                    Full Access
                  </span>
                </div>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    if (onNavigate) onNavigate('settings');
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs text-neutral-700 hover:bg-[#F2F4ED] hover:text-black rounded-lg transition-colors"
                >
                  Account Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* B. Summary Cards (6 KPI Cards) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Business Performance Metrics</h2>
          <span className="text-xs text-neutral-400">Live data updated just now</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpiCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs hover:border-[#788A5B]/40 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-medium text-neutral-500">{card.title}</span>
                    <h3 className="text-2xl font-bold tracking-tight text-black mt-1.5">{card.value}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center shrink-0 border border-[#E8E8E8]">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8E8E8]/70 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    {card.isPositive ? (
                      <span className="inline-flex items-center font-semibold text-[#788A5B]">
                        <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                        {card.change}
                      </span>
                    ) : (
                      <span className="inline-flex items-center font-semibold text-amber-700">
                        {card.change}
                      </span>
                    )}
                    <span className="text-neutral-400">{card.period}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* C. Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Revenue Overview – Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-[#E8E8E8]">
            <div>
              <h3 className="text-base font-semibold text-black">Revenue Overview</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Monthly Recurring Revenue (MRR) trajectory ($k)</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-neutral-600">
                <span className="w-3 h-1 rounded-full bg-[#788A5B]"></span> MRR ($k)
              </span>
              <span className="flex items-center gap-1.5 text-xs text-neutral-600 ml-2">
                <span className="w-3 h-1 rounded-full bg-[#2B2D2F]"></span> Total Rev ($k)
              </span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="py-6">
            <div className="relative h-56 w-full">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="oliveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#788A5B" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#788A5B" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="#E8E8E8" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#E8E8E8" strokeDasharray="3 3" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="#E8E8E8" strokeDasharray="3 3" />
                <line x1="0" y1="190" x2="500" y2="190" stroke="#E8E8E8" />

                {/* Area under MRR Line */}
                <path
                  d="M 0,150 L 45,142 L 90,136 L 135,124 L 180,118 L 225,110 L 270,106 L 315,98 L 360,92 L 405,82 L 450,74 L 500,60 L 500,190 L 0,190 Z"
                  fill="url(#oliveGradient)"
                />

                {/* Total Revenue Line (dark charcoal) */}
                <path
                  d="M 0,120 L 45,110 L 90,102 L 135,88 L 180,78 L 225,66 L 270,60 L 315,50 L 360,42 L 405,28 L 450,22 L 500,10"
                  fill="none"
                  stroke="#2B2D2F"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* MRR Line (olive green) */}
                <path
                  d="M 0,150 L 45,142 L 90,136 L 135,124 L 180,118 L 225,110 L 270,106 L 315,98 L 360,92 L 405,82 L 450,74 L 500,60"
                  fill="none"
                  stroke="#788A5B"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Highlight Point on Oct */}
                <circle cx="405" cy="82" r="5" fill="#788A5B" stroke="#FFFFFF" strokeWidth="2" />
              </svg>
            </div>

            {/* X-Axis Month Labels */}
            <div className="grid grid-cols-12 text-center text-[11px] text-neutral-400 mt-2 font-medium">
              {revenueData.map((d) => (
                <span key={d.month} className={d.month === 'Oct' ? 'text-black font-semibold' : ''}>
                  {d.month}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E8E8E8] flex items-center justify-between text-xs text-neutral-500">
            <span>Current MRR: <strong className="text-black font-semibold">$42,850</strong></span>
            <span>Annual Run Rate (ARR): <strong className="text-black font-semibold">$514,200</strong></span>
          </div>
        </div>

        {/* 2 & 3. Subscription & Payment Overview */}
        <div className="space-y-6">
          {/* Subscription Overview – Doughnut Chart */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs">
            <div className="pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-semibold text-black">Subscription Overview</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Status breakdown (892 total)</p>
            </div>

            <div className="flex items-center justify-between py-4">
              {/* Doughnut SVG */}
              <div className="relative w-28 h-28 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background track */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#F2F4ED" strokeWidth="4" />
                  {/* Active 68% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#788A5B"
                    strokeWidth="4"
                    strokeDasharray="59.8 100"
                    strokeDashoffset="0"
                  />
                  {/* Paused 14% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#97A87A"
                    strokeWidth="4"
                    strokeDasharray="12.3 100"
                    strokeDashoffset="-59.8"
                  />
                  {/* Closed 11% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#2B2D2F"
                    strokeWidth="4"
                    strokeDasharray="9.7 100"
                    strokeDashoffset="-72.1"
                  />
                  {/* Draft 7% */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#D2D9C5"
                    strokeWidth="4"
                    strokeDasharray="6.2 100"
                    strokeDashoffset="-81.8"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base font-bold text-black leading-none">892</span>
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5">Subs</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-1.5 text-xs flex-1 pl-4">
                {subStatus.map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }}></span>
                      <span className="text-neutral-600">{s.label}</span>
                    </div>
                    <span className="font-semibold text-black">{s.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Overview – Paid vs Unpaid */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs">
            <div className="pb-3 border-b border-[#E8E8E8] flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-black">Payment Overview</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Invoice settlement status</p>
              </div>
              <span className="text-xs font-semibold text-[#788A5B] bg-[#F2F4ED] px-2 py-0.5 rounded-md">
                97.9% Success
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-neutral-600">Paid Invoices ($384,120)</span>
                  <span className="text-black font-semibold">97.9%</span>
                </div>
                <div className="w-full bg-[#F2F4ED] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#788A5B] h-full rounded-full" style={{ width: '97.9%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-neutral-600">Outstanding / Unpaid ($8,270)</span>
                  <span className="text-amber-800 font-semibold">2.1%</span>
                </div>
                <div className="w-full bg-[#F2F4ED] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#2B2D2F] h-full rounded-full" style={{ width: '2.1%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* D. Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table 1: Recent Subscriptions */}
        <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-[#E8E8E8] flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-black">Recent Subscriptions</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Latest customer subscription events</p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('subscriptions')}
              className="text-xs font-semibold text-black hover:text-[#788A5B] flex items-center gap-1 transition-colors"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-medium border-b border-[#E8E8E8]">
                <tr>
                  <th className="py-2.5 px-4">Subscription ID</th>
                  <th className="py-2.5 px-4">Customer Name</th>
                  <th className="py-2.5 px-4">Plan</th>
                  <th className="py-2.5 px-4">Start Date</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
                {recentSubscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-black">{sub.id}</td>
                    <td className="py-3 px-4 font-medium">{sub.customer}</td>
                    <td className="py-3 px-4 text-neutral-600">{sub.plan}</td>
                    <td className="py-3 px-4 text-neutral-500">{sub.date}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={sub.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Recent Payments */}
        <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-[#E8E8E8] flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-black">Recent Payments</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Cleared customer transactions</p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('payments')}
              className="text-xs font-semibold text-black hover:text-[#788A5B] flex items-center gap-1 transition-colors"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-medium border-b border-[#E8E8E8]">
                <tr>
                  <th className="py-2.5 px-4">Payment ID</th>
                  <th className="py-2.5 px-4">Customer Name</th>
                  <th className="py-2.5 px-4">Invoice ID</th>
                  <th className="py-2.5 px-4">Amount</th>
                  <th className="py-2.5 px-4">Payment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
                {recentPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-black">{pay.id}</td>
                    <td className="py-3 px-4 font-medium">{pay.customer}</td>
                    <td className="py-3 px-4 font-mono text-neutral-600">{pay.invoice}</td>
                    <td className="py-3 px-4 font-semibold text-black">{pay.amount}</td>
                    <td className="py-3 px-4 text-neutral-500">{pay.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* E. Alerts and Reminders Section */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E8E8] mb-4">
          <div>
            <h3 className="text-base font-semibold text-black">Alerts & Reminders</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Items requiring attention across the platform</p>
          </div>
          <span className="text-xs font-medium text-neutral-500">4 active notifications</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <div
                key={alert.id}
                className="p-4 rounded-xl border border-[#E8E8E8] bg-white hover:border-[#788A5B]/40 transition-colors flex items-start gap-3.5"
              >
                <div className="p-2 rounded-lg bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8] shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-black truncate">{alert.title}</h4>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${alert.badgeClass}`}>
                      {alert.badge}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{alert.description}</p>
                  <p className="text-[11px] font-medium text-[#788A5B] mt-1.5">{alert.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

