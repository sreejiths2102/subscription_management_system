import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Calendar,
  AlertCircle,
  CreditCard,
  Bell,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Eye,
  FileText,
  ChevronDown
} from 'lucide-react';
import { authService, dashboardService } from '../../api';

const KPI_ICONS = [RefreshCw, Calendar, AlertCircle, CreditCard];

export default function CustomerDashboard({ onNavigate }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [customerInfo, setCustomerInfo] = useState(null);
  const [kpiCards, setKpiCards] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const currentUser = authService.getUser() || {
    name: 'Valued Customer',
    email: 'customer@example.com',
    role: 'customer',
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getCustomer();
      if (data) {
        setCustomerInfo(data.customer || null);
        setKpiCards(
          (data.kpi_cards || []).map((card, idx) => ({
            ...card,
            icon: KPI_ICONS[idx % KPI_ICONS.length]
          }))
        );
        setSubscriptions(data.subscriptions || []);
        setRecentInvoices(data.invoices || []);
        setRecentPayments(data.payments || []);
        setNotifications(
          (data.notifications || []).map((n) => ({
            ...n,
            icon: n.badge === 'Renewal' ? Clock : n.badge === 'Invoice' ? FileText : CheckCircle2
          }))
        );
      }
    } catch (err) {
      console.error('Failed to load customer dashboard from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const displayName = customerInfo?.name || currentUser.name || 'Valued Customer';
  const displayEmail = customerInfo?.email || currentUser.email || 'customer@example.com';

  return (
    <div className="space-y-8">
      {/* A. Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E8E8E8]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">My Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Welcome back, <span className="font-semibold text-black">{displayName}</span>. Live subscriptions and billing from PostgreSQL database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh button */}
          <button
            onClick={fetchCustomerData}
            title="Refresh database records"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#788A5B] ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Current date */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs font-medium text-neutral-600 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-[#788A5B]" />
            <span>{currentDate}</span>
          </div>

          {/* Notification icon */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl border border-[#E8E8E8] bg-white text-neutral-600 hover:text-black hover:border-neutral-300 transition-colors shadow-xs"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#788A5B] ring-2 ring-white"></span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-[#E8E8E8] shadow-lg p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Notifications</span>
                  <span className="text-[11px] font-medium text-[#788A5B] bg-[#F2F4ED] px-2 py-0.5 rounded-full">
                    {notifications.length} active
                  </span>
                </div>
                <div className="mt-3 space-y-2.5">
                  {notifications.map((n) => (
                    <div key={n.id} className="text-xs text-neutral-700">
                      <p className="font-medium text-black">{n.title}</p>
                      <p className="text-neutral-500 mt-0.5">{n.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Customer profile icon / dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl border border-[#E8E8E8] bg-white hover:border-neutral-300 transition-colors shadow-xs"
            >
              <div className="w-7 h-7 rounded-lg bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center font-bold text-xs">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-black hidden sm:inline">{displayName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E8E8E8] shadow-lg p-3 z-50">
                <div className="px-2 py-1.5 border-b border-[#E8E8E8] mb-2">
                  <p className="text-xs font-semibold text-black">{displayName}</p>
                  <p className="text-[11px] text-neutral-500 truncate">{displayEmail}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider bg-[#F2F4ED] text-[#788A5B] px-1.5 py-0.5 rounded">
                    Customer Account
                  </span>
                </div>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    if (onNavigate) onNavigate('settings');
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs text-neutral-700 hover:bg-[#F2F4ED] hover:text-black rounded-lg transition-colors"
                >
                  My Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* B. Summary cards (4 KPI cards) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Subscription & Billing Overview</h2>
          <span className="text-xs text-neutral-400">Synchronized with database</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card, idx) => {
            const Icon = card.icon || RefreshCw;
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
                  <span className="text-neutral-500 truncate">{card.detail}</span>
                  <span className={`font-semibold shrink-0 ${card.badgeColor || 'text-[#788A5B]'}`}>{card.badge}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* C. My Subscriptions */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E8E8E8] flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-black">My Subscriptions</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Your ongoing active services and product licenses</p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('subscriptions')}
            className="text-xs font-semibold text-black hover:text-[#788A5B] flex items-center gap-1 transition-colors"
          >
            Manage plans <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-medium border-b border-[#E8E8E8]">
              <tr>
                <th className="py-2.5 px-4">Subscription ID</th>
                <th className="py-2.5 px-4">Product / Plan Name</th>
                <th className="py-2.5 px-4">Start Date</th>
                <th className="py-2.5 px-4">Next Billing Date</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-neutral-400">
                    No active subscriptions assigned to this account in the database.
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-black">{sub.id}</td>
                    <td className="py-3.5 px-4 font-medium text-black">
                      {sub.productPlan}
                      <span className="block text-[11px] text-neutral-400 font-normal">{sub.amount}</span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500">{sub.startDate}</td>
                    <td className="py-3.5 px-4 font-medium text-neutral-700">{sub.nextBillingDate}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8]">
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onNavigate && onNavigate('subscriptions')}
                        className="px-3 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs font-semibold text-black hover:border-black transition-colors shadow-2xs inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#788A5B]" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* D. Recent Invoices & E. Recent Payment History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* D. Recent Invoices */}
        <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-[#E8E8E8] flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-black">Recent Invoices</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Billing receipts and charges</p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('invoices')}
              className="text-xs font-semibold text-black hover:text-[#788A5B] flex items-center gap-1 transition-colors"
            >
              All invoices <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-medium border-b border-[#E8E8E8]">
                <tr>
                  <th className="py-2.5 px-4">Invoice #</th>
                  <th className="py-2.5 px-4">Invoice Date</th>
                  <th className="py-2.5 px-4">Due Date</th>
                  <th className="py-2.5 px-4">Amount</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
                {recentInvoices.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-neutral-400">
                      No invoices in database.
                    </td>
                  </tr>
                ) : (
                  recentInvoices.map((inv) => (
                    <tr key={inv.invoiceNumber} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-black">{inv.invoiceNumber}</td>
                      <td className="py-3.5 px-4 text-neutral-500">{inv.invoiceDate}</td>
                      <td className="py-3.5 px-4 text-neutral-500">{inv.dueDate}</td>
                      <td className="py-3.5 px-4 font-semibold text-black">{inv.totalAmount}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          inv.paymentStatus === 'Paid'
                            ? 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {inv.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onNavigate && onNavigate('invoices')}
                          className="px-2.5 py-1 rounded-lg border border-[#E8E8E8] text-xs font-medium text-neutral-700 hover:text-black hover:border-black transition-colors"
                        >
                          View Invoice
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* E. Recent Payment History */}
        <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-[#E8E8E8] flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-black">Recent Payment History</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Cleared electronic transactions</p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('payments')}
              className="text-xs font-semibold text-black hover:text-[#788A5B] flex items-center gap-1 transition-colors"
            >
              All payments <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-medium border-b border-[#E8E8E8]">
                <tr>
                  <th className="py-2.5 px-4">Payment ID</th>
                  <th className="py-2.5 px-4">Invoice #</th>
                  <th className="py-2.5 px-4">Amount Paid</th>
                  <th className="py-2.5 px-4">Payment Date</th>
                  <th className="py-2.5 px-4">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
                {recentPayments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-neutral-400">
                      No payments in database.
                    </td>
                  </tr>
                ) : (
                  recentPayments.map((pay) => (
                    <tr key={pay.paymentId} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-black">{pay.paymentId}</td>
                      <td className="py-3.5 px-4 font-mono text-neutral-600">{pay.invoiceNumber}</td>
                      <td className="py-3.5 px-4 font-semibold text-black">{pay.amountPaid}</td>
                      <td className="py-3.5 px-4 text-neutral-500">{pay.paymentDate}</td>
                      <td className="py-3.5 px-4 text-neutral-600">{pay.paymentMethod}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* F. Notifications and Reminders */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E8E8] mb-4">
          <div>
            <h3 className="text-base font-semibold text-black">Notifications & Reminders</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Direct notices regarding your account status and renewals</p>
          </div>
          <span className="text-xs font-medium text-neutral-400">Database synchronized</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notifications.map((notif) => {
            const Icon = notif.icon || Clock;
            return (
              <div
                key={notif.id}
                className="p-4 rounded-xl border border-[#E8E8E8] bg-white hover:border-[#788A5B]/40 transition-colors flex items-start gap-3.5"
              >
                <div className="p-2 rounded-lg bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8] shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-black truncate">{notif.title}</h4>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${notif.badgeClass}`}>
                      {notif.badge}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{notif.description}</p>
                  <p className="text-[11px] font-medium text-[#788A5B] mt-1.5">{notif.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
