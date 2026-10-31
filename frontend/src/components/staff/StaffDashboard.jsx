import React, { useState, useEffect } from 'react';
import {
  Users,
  RefreshCw,
  FileText,
  Receipt,
  CreditCard,
  AlertCircle,
  Clock,
  Calendar,
  Bell,
  CheckCircle2,
  ChevronDown,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Check,
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  DollarSign
} from 'lucide-react';
import { dashboardService, taskService } from '../../api';

const KPI_ICONS = {
  'total-customers': Users,
  'active-subscriptions': RefreshCw,
  'pending-quotations': FileText,
  'pending-invoices': Receipt,
  'outstanding-payments': CreditCard,
  'overdue-invoices': AlertCircle,
};

const ALERT_ICONS = {
  'upcoming-renewals': Clock,
  'unpaid-invoices': Receipt,
  'overdue-payments': AlertCircle,
  'quotations-expiry': AlertTriangle,
};

export default function StaffDashboard({ onNavigate }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [taskFilter, setTaskFilter] = useState('All');
  const [taskSearch, setTaskSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [summaryCards, setSummaryCards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [recentSubscriptions, setRecentSubscriptions] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Format current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getStaff();
      if (data) {
        setSummaryCards(
          (data.summary_cards || []).map((card) => ({
            ...card,
            icon: KPI_ICONS[card.id] || RefreshCw
          }))
        );
        setTasks(data.tasks || []);
        setRecentSubscriptions(data.recent_subscriptions || []);
        setRecentPayments(data.recent_payments || []);
        setAlerts(
          (data.alerts || []).map((alert) => ({
            ...alert,
            icon: ALERT_ICONS[alert.id] || Clock
          }))
        );
      }
    } catch (err) {
      console.error('Failed to load staff metrics from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const toggleTaskStatus = async (taskId) => {
    try {
      const updated = await taskService.toggle(taskId);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: updated.status } : t))
      );
    } catch (err) {
      console.error('Failed to toggle task in DB:', err);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesFilter =
      taskFilter === 'All'
        ? true
        : taskFilter === 'Pending'
        ? t.status === 'Pending'
        : taskFilter === 'Upcoming'
        ? t.status === 'Upcoming'
        : t.status === 'Completed';

    const matchesSearch =
      (t.task || '').toLowerCase().includes(taskSearch.toLowerCase()) ||
      (t.customer || '').toLowerCase().includes(taskSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleCardClick = (moduleId) => {
    if (onNavigate && moduleId) {
      onNavigate(moduleId);
    }
  };

  return (
    <div className="space-y-8">
      {/* =========================================================================
          A. Header section
          - Page title: Staff Dashboard
          - Welcome message: Welcome back, Staff
          - Current date
          - Notification icon
          - Staff profile icon
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E8E8E8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#788A5B]">
              Operations Center
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs font-medium text-neutral-500">PostgreSQL Live Data</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Staff Dashboard</h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500">
            Welcome back, <span className="font-semibold text-black">Staff</span> — manage daily operations, pending customer requests, and operational alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh button */}
          <button
            onClick={fetchStaffData}
            title="Refresh database operational queue"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#788A5B] ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Current Date Pill */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs font-medium text-neutral-700 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-[#788A5B]" />
            <span>{currentDate}</span>
          </div>

          {/* Notification Icon */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileOpen(false);
              }}
              className="relative p-2 rounded-xl border border-[#E8E8E8] bg-white text-neutral-600 hover:text-black hover:border-neutral-300 transition-colors shadow-2xs"
              aria-label="Operational Notifications"
            >
              <Bell className="w-4 h-4" />
              {alerts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#788A5B] ring-2 ring-white"></span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-[#E8E8E8] shadow-lg p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
                  <span className="text-xs font-bold text-black uppercase tracking-wider">
                    Operational Alerts
                  </span>
                  <span className="text-[11px] font-semibold text-[#788A5B] bg-[#F2F4ED] px-2 py-0.5 rounded-full">
                    {alerts.length} pending
                  </span>
                </div>
                <div className="mt-3 space-y-2.5">
                  {alerts.map((alt) => (
                    <div key={alt.id} className="p-2 rounded-xl hover:bg-[#F2F4ED]/50 transition-colors text-xs">
                      <p className="font-semibold text-black flex items-center justify-between">
                        <span>{alt.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${alt.badgeClass}`}>
                          {alt.badgeText}
                        </span>
                      </p>
                      <p className="text-neutral-500 text-[11px] mt-0.5">
                        {alt.subtitle}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Staff Profile Icon */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-[#E8E8E8] bg-white hover:border-neutral-300 transition-colors shadow-2xs"
              aria-label="Staff Profile"
            >
              <div className="w-7 h-7 rounded-lg bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center font-bold text-xs border border-[#E8E8E8]">
                ST
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <span className="text-xs font-semibold text-black block">Staff</span>
                <span className="text-[10px] text-neutral-400 block">Operator</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 ml-0.5" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E8E8E8] shadow-lg p-2.5 z-50">
                <div className="px-2.5 py-2 border-b border-[#E8E8E8] mb-1.5">
                  <p className="text-xs font-bold text-black">Internal Staff</p>
                  <p className="text-[11px] text-neutral-500 truncate">staff@subscription.com</p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-[#788A5B] bg-[#F2F4ED] px-2 py-0.5 rounded-full">
                    Operational Access
                  </span>
                </div>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    if (onNavigate) onNavigate('settings');
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-neutral-700 hover:bg-[#F2F4ED] hover:text-black rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>Staff Preferences</span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          B. Summary cards: 6 KPI cards
          1. Total Customers
          2. Active Subscriptions
          3. Pending Quotations
          4. Pending Invoices
          5. Outstanding Payments
          6. Overdue Invoices
          ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-600">
            Operational Summary
          </h2>
          <span className="text-xs text-neutral-400">Database synchronization active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            let badgeColors = 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]';
            if (card.badgeType === 'warning') {
              badgeColors = 'bg-amber-50 text-amber-800 border-amber-200';
            } else if (card.badgeType === 'danger') {
              badgeColors = 'bg-red-50 text-red-700 border-red-200';
            }

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.moduleId)}
                className="bg-white rounded-2xl p-4 border border-[#E8E8E8] shadow-xs hover:border-neutral-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-neutral-500 leading-tight">
                      {card.title}
                    </span>
                    <div className="w-7 h-7 rounded-xl bg-[#F2F4ED] flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-[#788A5B]" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold tracking-tight text-black mt-1">
                    {card.value}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#E8E8E8] flex items-center justify-between">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeColors}`}
                  >
                    {card.badge}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          C. Pending tasks section
          Task table:
          Task                   Customer    Due Date    Status
          Follow up invoice      ABC Ltd     01-Nov      Pending
          Review quotation       XYZ Ltd     02-Nov      Pending
          Subscription renewal   PQR Ltd     03-Nov      Upcoming
          ========================================================================= */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E8E8E8] flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#F2F4ED]/20">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#788A5B]">
                Action Queue
              </span>
              <span className="text-neutral-300">•</span>
              <span className="text-xs font-medium text-neutral-500">Live PostgreSQL Records</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-black">Pending Operational Tasks</h2>
          </div>

          {/* Task Controls: Filter pills & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                placeholder="Search tasks or customer..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs text-black placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#788A5B] focus:border-[#788A5B]"
              />
            </div>

            <div className="flex items-center gap-1 p-0.5 rounded-xl border border-[#E8E8E8] bg-white">
              {['All', 'Pending', 'Upcoming', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTaskFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    taskFilter === tab
                      ? 'bg-[#F2F4ED] text-black font-semibold'
                      : 'text-neutral-500 hover:text-black'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Task Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Done</th>
                <th className="py-3 px-4 font-semibold text-neutral-700">Task</th>
                <th className="py-3 px-4 font-semibold text-neutral-700">Customer</th>
                <th className="py-3 px-4 font-semibold text-neutral-700">Due Date</th>
                <th className="py-3 px-4 font-semibold text-neutral-700">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-neutral-400">
                    No pending tasks found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((t) => {
                  const isCompleted = t.status === 'Completed';
                  const isPending = t.status === 'Pending';
                  const isUpcoming = t.status === 'Upcoming';

                  return (
                    <tr
                      key={t.id}
                      className={`hover:bg-neutral-50/70 transition-colors ${
                        isCompleted ? 'bg-neutral-50/40 text-neutral-400' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => toggleTaskStatus(t.id)}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isCompleted
                              ? 'bg-black border-black text-white'
                              : 'border-[#E8E8E8] hover:border-[#788A5B] bg-white'
                          }`}
                          title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                        >
                          {isCompleted && <Check className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 font-medium">
                        <span
                          className={`font-semibold text-black ${
                            isCompleted ? 'line-through text-neutral-400' : ''
                          }`}
                        >
                          {t.task}
                        </span>
                        <span className="block text-[11px] text-neutral-400 mt-0.5">
                          Category: {t.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-black">{t.customer}</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-neutral-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{t.dueDate}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            isCompleted
                              ? 'bg-neutral-100 text-neutral-600 border-neutral-200'
                              : isPending
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            if (t.type === 'Invoice') onNavigate('invoices');
                            else if (t.type === 'Quotation') onNavigate('quotations');
                            else if (t.type === 'Renewal') onNavigate('subscriptions');
                            else if (t.type === 'Payment') onNavigate('payments');
                            else onNavigate('customers');
                          }}
                          className="px-2.5 py-1 rounded-lg border border-[#E8E8E8] bg-white text-xs font-semibold text-black hover:bg-[#F2F4ED] hover:border-[#788A5B] transition-colors"
                        >
                          Resolve
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          D. Recent activity
          Recent Subscriptions
          - Subscription ID, Customer, Plan, Start Date, Status
          Recent Payments
          - Payment ID, Customer, Amount, Payment Date, Method
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Subscriptions */}
        <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-[#E8E8E8] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#788A5B]">
                  Live Agreements
                </span>
                <span className="text-neutral-300">•</span>
                <span className="text-xs font-medium text-neutral-500">PostgreSQL</span>
              </div>
              <h3 className="text-base font-bold text-black">Recent Subscriptions</h3>
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
              <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
                <tr>
                  <th className="py-2.5 px-4">Subscription ID</th>
                  <th className="py-2.5 px-4">Customer</th>
                  <th className="py-2.5 px-4">Plan</th>
                  <th className="py-2.5 px-4">Start Date</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
                {recentSubscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-black">{sub.id}</td>
                    <td className="py-3 px-4 font-semibold text-black">{sub.customer}</td>
                    <td className="py-3 px-4 text-neutral-600">{sub.plan}</td>
                    <td className="py-3 px-4 text-neutral-500">{sub.startDate}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          sub.status === 'Active'
                            ? 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-[#E8E8E8] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#788A5B]">
                  Settlements
                </span>
                <span className="text-neutral-300">•</span>
                <span className="text-xs font-medium text-neutral-500">PostgreSQL</span>
              </div>
              <h3 className="text-base font-bold text-black">Recent Payments</h3>
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
              <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
                <tr>
                  <th className="py-2.5 px-4">Payment ID</th>
                  <th className="py-2.5 px-4">Customer</th>
                  <th className="py-2.5 px-4">Amount</th>
                  <th className="py-2.5 px-4">Payment Date</th>
                  <th className="py-2.5 px-4">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
                {recentPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-black">{pay.id}</td>
                    <td className="py-3 px-4 font-semibold text-black">{pay.customer}</td>
                    <td className="py-3 px-4 font-bold text-black">{pay.amount}</td>
                    <td className="py-3 px-4 text-neutral-500">{pay.date}</td>
                    <td className="py-3 px-4 text-neutral-600 text-[11px]">{pay.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =========================================================================
          E. Alerts section:
          - Upcoming renewals
          - Unpaid invoices
          - Overdue payments
          - Quotations nearing expiry
          ========================================================================= */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E8E8] mb-4">
          <div>
            <h3 className="text-base font-bold text-black">Operational Alerts & Critical Items</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Live events generated directly from PostgreSQL database records
            </p>
          </div>
          <span className="text-xs font-semibold text-[#788A5B] bg-[#F2F4ED] px-2.5 py-1 rounded-full border border-[#E8E8E8]">
            {alerts.length} Items Monitored
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <div
                key={alert.id}
                className="p-4 rounded-xl border border-[#E8E8E8] bg-white hover:border-[#788A5B]/40 transition-colors flex flex-col justify-between"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8] shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-black truncate">{alert.title}</h4>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${alert.badgeClass}`}>
                        {alert.badgeText}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      {alert.subtitle}
                    </p>
                    <p className="text-[11px] font-semibold text-[#788A5B] mt-1.5">
                      {alert.detail}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#E8E8E8]/70 flex items-center justify-end">
                  <button
                    onClick={() => alert.targetModule && onNavigate(alert.targetModule)}
                    className="text-xs font-semibold text-black hover:text-[#788A5B] flex items-center gap-1 transition-colors"
                  >
                    <span>{alert.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
