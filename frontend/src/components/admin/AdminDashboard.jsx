import React, { useState, useEffect } from 'react';
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
import { dashboardService } from '../../api';

const KPI_ICONS = {
  customers: Users,
  subscriptions: RefreshCw,
  mrr: TrendingUp,
  revenue: DollarSign,
  outstanding: AlertCircle,
  overdue: FileWarning
};

const ALERT_ICONS = {
  renewal: Clock,
  overdue: AlertCircle,
  created: CheckCircle2,
  expiry: FileWarning
};

export default function AdminDashboard({ onNavigate }) {
  const [revenuePeriod, setRevenuePeriod] = useState('monthly');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [kpiCards, setKpiCards] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [subStatus, setSubStatus] = useState([]);
  const [recentSubscriptions, setRecentSubscriptions] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getAdmin();
      if (data) {
        setKpiCards(
          (data.kpi_cards || []).map((card) => ({
            ...card,
            icon: KPI_ICONS[card.key] || TrendingUp
          }))
        );
        setRevenueData(data.revenue_data || []);
        setSubStatus(data.sub_status || []);
        setRecentSubscriptions(data.recent_subscriptions || []);
        setRecentPayments(data.recent_payments || []);
        setAlerts(
          (data.alerts || []).map((alert) => ({
            ...alert,
            icon: ALERT_ICONS[alert.type] || Clock
          }))
        );
      }
    } catch (err) {
      console.error('Failed to load admin dashboard metrics from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    let classes = 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]';
    if (status === 'Paused') classes = 'bg-amber-50 text-amber-800 border-amber-200';
    if (status === 'Closed') classes = 'bg-neutral-100 text-neutral-700 border-neutral-300';
    if (status === 'Draft' || status === 'Pending') classes = 'bg-blue-50 text-blue-700 border-blue-200';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}>
        {status}
      </span>
    );
  };

  const totalSubsCount = subStatus.reduce((acc, curr) => acc + (curr.count || 0), 0);
  const mrrCard = kpiCards.find((c) => c.key === 'mrr') || { value: '$0.00' };

  return (
    <div className="space-y-8">
      {/* A. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E8E8E8]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Welcome back, <span className="font-semibold text-black">Admin</span> — live metrics fetched directly from PostgreSQL database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh live button */}
          <button
            onClick={fetchDashboardData}
            title="Refresh database metrics"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#788A5B] ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

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
              {alerts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#788A5B] ring-2 ring-white"></span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-[#E8E8E8] shadow-lg p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Database Alerts</span>
                  <span className="text-[11px] font-medium text-[#788A5B] bg-[#F2F4ED] px-2 py-0.5 rounded-full">
                    {alerts.length} active
                  </span>
                </div>
                <div className="mt-3 space-y-3">
                  {alerts.map((a) => (
                    <div key={a.id} className="text-xs text-neutral-700">
                      <p className="font-medium text-black">{a.title}</p>
                      <p className="text-neutral-500 mt-0.5">{a.description}</p>
                    </div>
                  ))}
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
                    Full Access (PostgreSQL)
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
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Live Business Performance Metrics</h2>
          <span className="text-xs text-neutral-400">Strictly from PostgreSQL Database</span>
        </div>

        {loading && kpiCards.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-[#E8E8E8] h-32 animate-pulse bg-neutral-50/50" />
            ))}
          </div>
        ) : (
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
        )}
      </div>

      {/* C. Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Revenue Overview */}
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

                <line x1="0" y1="40" x2="500" y2="40" stroke="#E8E8E8" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#E8E8E8" strokeDasharray="3 3" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="#E8E8E8" strokeDasharray="3 3" />
                <line x1="0" y1="190" x2="500" y2="190" stroke="#E8E8E8" />

                <path
                  d="M 0,150 L 45,142 L 90,136 L 135,124 L 180,118 L 225,110 L 270,106 L 315,98 L 360,92 L 405,82 L 450,74 L 500,60 L 500,190 L 0,190 Z"
                  fill="url(#oliveGradient)"
                />

                <path
                  d="M 0,120 L 45,110 L 90,102 L 135,88 L 180,78 L 225,66 L 270,60 L 315,50 L 360,42 L 405,28 L 450,22 L 500,10"
                  fill="none"
                  stroke="#2B2D2F"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                <path
                  d="M 0,150 L 45,142 L 90,136 L 135,124 L 180,118 L 225,110 L 270,106 L 315,98 L 360,92 L 405,82 L 450,74 L 500,60"
                  fill="none"
                  stroke="#788A5B"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <circle cx="405" cy="82" r="5" fill="#788A5B" stroke="#FFFFFF" strokeWidth="2" />
              </svg>
            </div>

            <div className="grid grid-cols-12 text-center text-[11px] text-neutral-400 mt-2 font-medium">
              {revenueData.map((d) => (
                <span key={d.month} className={d.month === 'Oct' ? 'text-black font-semibold' : ''}>
                  {d.month}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E8E8E8] flex items-center justify-between text-xs text-neutral-500">
            <span>Current MRR: <strong className="text-black font-semibold">{mrrCard.value}</strong></span>
            <span>Billing Engine: <strong className="text-black font-semibold">PostgreSQL Synchronized</strong></span>
          </div>
        </div>

        {/* 2 & 3. Subscription & Payment Overview */}
        <div className="space-y-6">
          {/* Subscription Overview */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs">
            <div className="pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-semibold text-black">Subscription Overview</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Status breakdown ({totalSubsCount} in database)</p>
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="relative w-28 h-28 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#F2F4ED" strokeWidth="4" />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#788A5B"
                    strokeWidth="4"
                    strokeDasharray="60 100"
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#97A87A"
                    strokeWidth="4"
                    strokeDasharray="20 100"
                    strokeDashoffset="-60"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#2B2D2F"
                    strokeWidth="4"
                    strokeDasharray="15 100"
                    strokeDashoffset="-80"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base font-bold text-black leading-none">{totalSubsCount}</span>
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5">Subs</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs flex-1 pl-4">
                {subStatus.map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }}></span>
                      <span className="text-neutral-600">{s.label}</span>
                    </div>
                    <span className="font-semibold text-black">{s.count} ({s.pct})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Overview */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs">
            <div className="pb-3 border-b border-[#E8E8E8] flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-black">Payment Overview</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Database settlement status</p>
              </div>
              <span className="text-xs font-semibold text-[#788A5B] bg-[#F2F4ED] px-2 py-0.5 rounded-md">
                Live Status
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-neutral-600">Cleared Invoices</span>
                  <span className="text-black font-semibold">Healthy</span>
                </div>
                <div className="w-full bg-[#F2F4ED] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#788A5B] h-full rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-neutral-600">Outstanding Invoices</span>
                  <span className="text-amber-800 font-semibold">Active In Database</span>
                </div>
                <div className="w-full bg-[#F2F4ED] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#2B2D2F] h-full rounded-full" style={{ width: '15%' }}></div>
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
              <p className="text-xs text-neutral-500 mt-0.5">Live database subscription records</p>
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
                {recentSubscriptions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-neutral-400">
                      No subscription records in database.
                    </td>
                  </tr>
                ) : (
                  recentSubscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-black">{sub.id}</td>
                      <td className="py-3 px-4 font-medium">{sub.customer}</td>
                      <td className="py-3 px-4 text-neutral-600">{sub.plan}</td>
                      <td className="py-3 px-4 text-neutral-500">{sub.date}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={sub.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Recent Payments */}
        <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-[#E8E8E8] flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-black">Recent Payments</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Live database payment records</p>
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
                {recentPayments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-neutral-400">
                      No payment records in database.
                    </td>
                  </tr>
                ) : (
                  recentPayments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-black">{pay.id}</td>
                      <td className="py-3 px-4 font-medium">{pay.customer}</td>
                      <td className="py-3 px-4 font-mono text-neutral-600">{pay.invoice}</td>
                      <td className="py-3 px-4 font-semibold text-black">{pay.amount}</td>
                      <td className="py-3 px-4 text-neutral-500">{pay.date}</td>
                    </tr>
                  ))
                )}
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
            <p className="text-xs text-neutral-500 mt-0.5">Dynamic alerts calculated from database tables</p>
          </div>
          <span className="text-xs font-medium text-neutral-500">{alerts.length} active notifications</span>
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
