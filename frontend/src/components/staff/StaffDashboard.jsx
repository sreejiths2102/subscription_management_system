import React, { useState } from 'react';
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

export default function StaffDashboard({ onNavigate }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [taskFilter, setTaskFilter] = useState('All');
  const [taskSearch, setTaskSearch] = useState('');

  // Format current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // B. Summary cards: 6 KPI cards for staff daily operations
  const summaryCards = [
    {
      id: 'total-customers',
      title: 'Total Customers',
      value: '1,280',
      badge: '+12 this month',
      badgeType: 'neutral',
      subtitle: 'Active customer accounts',
      icon: Users,
      moduleId: 'customers',
    },
    {
      id: 'active-subscriptions',
      title: 'Active Subscriptions',
      value: '892',
      badge: '98.2% retention',
      badgeType: 'positive',
      subtitle: 'Recurring active services',
      icon: RefreshCw,
      moduleId: 'subscriptions',
    },
    {
      id: 'pending-quotations',
      title: 'Pending Quotations',
      value: '18',
      badge: 'Requires review',
      badgeType: 'warning',
      subtitle: 'Price proposals awaiting staff',
      icon: FileText,
      moduleId: 'quotations',
    },
    {
      id: 'pending-invoices',
      title: 'Pending Invoices',
      value: '14',
      badge: 'Awaiting settlement',
      badgeType: 'warning',
      subtitle: 'Issued unpaid invoices',
      icon: Receipt,
      moduleId: 'invoices',
    },
    {
      id: 'outstanding-payments',
      title: 'Outstanding Payments',
      value: '$6,450',
      badge: '14 accounts',
      badgeType: 'warning',
      subtitle: 'Total receivables pending',
      icon: CreditCard,
      moduleId: 'payments',
    },
    {
      id: 'overdue-invoices',
      title: 'Overdue Invoices',
      value: '5',
      badge: 'Action needed',
      badgeType: 'danger',
      subtitle: 'Past payment due date',
      icon: AlertCircle,
      moduleId: 'invoices',
    },
  ];

  // C. Pending tasks data
  // Must include the exact requested rows:
  // 1. Follow up invoice | ABC Ltd | 01-Nov | Pending
  // 2. Review quotation | XYZ Ltd | 02-Nov | Pending
  // 3. Subscription renewal | PQR Ltd | 03-Nov | Upcoming
  const [tasks, setTasks] = useState([
    {
      id: 1,
      task: 'Follow up invoice',
      customer: 'ABC Ltd',
      dueDate: '01-Nov',
      status: 'Pending',
      priority: 'High',
      type: 'Invoice',
    },
    {
      id: 2,
      task: 'Review quotation',
      customer: 'XYZ Ltd',
      dueDate: '02-Nov',
      status: 'Pending',
      priority: 'Medium',
      type: 'Quotation',
    },
    {
      id: 3,
      task: 'Subscription renewal',
      customer: 'PQR Ltd',
      dueDate: '03-Nov',
      status: 'Upcoming',
      priority: 'High',
      type: 'Renewal',
    },
    {
      id: 4,
      task: 'Verify bank transfer payment',
      customer: 'Nexus Cloud Systems',
      dueDate: '04-Nov',
      status: 'Pending',
      priority: 'Normal',
      type: 'Payment',
    },
    {
      id: 5,
      task: 'Account contact verification',
      customer: 'Horizon AI Labs',
      dueDate: '05-Nov',
      status: 'Upcoming',
      priority: 'Low',
      type: 'Customer',
    },
  ]);

  const toggleTaskStatus = (taskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: t.status === 'Completed' ? 'Pending' : 'Completed',
            }
          : t
      )
    );
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
      t.task.toLowerCase().includes(taskSearch.toLowerCase()) ||
      t.customer.toLowerCase().includes(taskSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // D. Recent Activity Data
  // Recent Subscriptions
  // - Subscription ID, Customer, Plan, Start Date, Status
  const recentSubscriptions = [
    {
      id: 'SUB-2041',
      customer: 'ABC Ltd',
      plan: 'Enterprise Yearly',
      startDate: '30-Oct-2026',
      status: 'Active',
    },
    {
      id: 'SUB-2040',
      customer: 'XYZ Ltd',
      plan: 'Pro Monthly',
      startDate: '29-Oct-2026',
      status: 'Active',
    },
    {
      id: 'SUB-2039',
      customer: 'PQR Ltd',
      plan: 'Standard Monthly',
      startDate: '28-Oct-2026',
      status: 'Upcoming Renewal',
    },
    {
      id: 'SUB-2038',
      customer: 'Horizon AI Labs',
      plan: 'Enterprise Quarterly',
      startDate: '27-Oct-2026',
      status: 'Active',
    },
    {
      id: 'SUB-2037',
      customer: 'Nexus Cloud Systems',
      plan: 'Pro Monthly',
      startDate: '25-Oct-2026',
      status: 'Active',
    },
  ];

  // Recent Payments
  // - Payment ID, Customer, Amount, Payment Date, Method
  const recentPayments = [
    {
      id: 'PAY-8822',
      customer: 'ABC Ltd',
      amount: '$2,450.00',
      date: '31-Oct-2026',
      method: 'Bank Transfer (ACH)',
      status: 'Pending Verification',
    },
    {
      id: 'PAY-8821',
      customer: 'Acme Technologies Inc.',
      amount: '$3,600.00',
      date: '30-Oct-2026',
      method: 'Stripe ACH Transfer',
      status: 'Cleared',
    },
    {
      id: 'PAY-8820',
      customer: 'Nexus Cloud Systems',
      amount: '$450.00',
      date: '29-Oct-2026',
      method: 'Credit Card (Visa)',
      status: 'Cleared',
    },
    {
      id: 'PAY-8819',
      customer: 'Cloudflow Networks',
      amount: '$890.00',
      date: '28-Oct-2026',
      method: 'Credit Card (Mastercard)',
      status: 'Cleared',
    },
    {
      id: 'PAY-8818',
      customer: 'Horizon AI Labs',
      amount: '$1,200.00',
      date: '27-Oct-2026',
      method: 'Direct Wire Settlement',
      status: 'Cleared',
    },
  ];

  // E. Alerts Section:
  // - Upcoming renewals
  // - Unpaid invoices
  // - Overdue payments
  // - Quotations nearing expiry
  const alerts = [
    {
      id: 'upcoming-renewals',
      title: 'Upcoming Renewals',
      subtitle: '18 subscriptions due for renewal within 7 days',
      detail: '$14,200 expected pipeline value',
      icon: Clock,
      badgeText: '18 Renewals',
      badgeClass: 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]',
      actionLabel: 'View Subscriptions',
      targetModule: 'subscriptions',
      urgency: 'Medium',
    },
    {
      id: 'unpaid-invoices',
      title: 'Unpaid Invoices',
      subtitle: '14 customer invoices awaiting payment settlement',
      detail: '$6,450 total outstanding balance',
      icon: Receipt,
      badgeText: '14 Invoices',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      actionLabel: 'Manage Invoices',
      targetModule: 'invoices',
      urgency: 'High',
    },
    {
      id: 'overdue-payments',
      title: 'Overdue Payments',
      subtitle: '5 invoices past 15-day grace period requiring collection',
      detail: '$1,820 requires immediate follow-up',
      icon: AlertCircle,
      badgeText: '5 Overdue',
      badgeClass: 'bg-red-50 text-red-700 border-red-200',
      actionLabel: 'Follow Up Payments',
      targetModule: 'payments',
      urgency: 'Critical',
    },
    {
      id: 'quotations-expiry',
      title: 'Quotations Nearing Expiry',
      subtitle: '4 enterprise price proposals expiring within 48 hours',
      detail: '$30,900 quotation pipeline at risk',
      icon: AlertTriangle,
      badgeText: '4 Expiring',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      actionLabel: 'Review Quotations',
      targetModule: 'quotations',
      urgency: 'High',
    },
  ];

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
            <span className="text-xs font-medium text-neutral-500">Daily Queue</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Staff Dashboard</h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500">
            Welcome back, <span className="font-semibold text-black">Staff</span> — manage daily operations, pending customer requests, and operational alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
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
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#788A5B] ring-2 ring-white"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-[#E8E8E8] shadow-lg p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
                  <span className="text-xs font-bold text-black uppercase tracking-wider">
                    Operational Alerts
                  </span>
                  <span className="text-[11px] font-semibold text-[#788A5B] bg-[#F2F4ED] px-2 py-0.5 rounded-full">
                    4 pending
                  </span>
                </div>
                <div className="mt-3 space-y-2.5">
                  <div className="p-2 rounded-xl hover:bg-[#F2F4ED]/50 transition-colors text-xs">
                    <p className="font-semibold text-black flex items-center justify-between">
                      <span>Follow up invoice ABC Ltd</span>
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        Due 01-Nov
                      </span>
                    </p>
                    <p className="text-neutral-500 text-[11px] mt-0.5">
                      Invoice INV-2026-092 pending payment follow-up.
                    </p>
                  </div>
                  <div className="p-2 rounded-xl hover:bg-[#F2F4ED]/50 transition-colors text-xs">
                    <p className="font-semibold text-black flex items-center justify-between">
                      <span>Review quotation XYZ Ltd</span>
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        Due 02-Nov
                      </span>
                    </p>
                    <p className="text-neutral-500 text-[11px] mt-0.5">
                      Proposal for Enterprise Suite requires staff sign-off.
                    </p>
                  </div>
                  <div className="p-2 rounded-xl hover:bg-[#F2F4ED]/50 transition-colors text-xs">
                    <p className="font-semibold text-black flex items-center justify-between">
                      <span>Subscription renewal PQR Ltd</span>
                      <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        Upcoming
                      </span>
                    </p>
                    <p className="text-neutral-500 text-[11px] mt-0.5">
                      Standard Monthly renewal scheduled for 03-Nov.
                    </p>
                  </div>
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
          <span className="text-xs text-neutral-400">Click any card to inspect module</span>
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
              <span className="text-xs font-medium text-neutral-500">Prioritized Daily Work</span>
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
              {['All', 'Pending', 'Upcoming'].map((tab) => (
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
                              ? 'bg-neutral-100 text-neutral-600 border-neutral-300'
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
                            if (t.type === 'Invoice' && onNavigate) onNavigate('invoices');
                            else if (t.type === 'Quotation' && onNavigate) onNavigate('quotations');
                            else if (t.type === 'Renewal' && onNavigate) onNavigate('subscriptions');
                            else alert(`Action triggered for ${t.task} (${t.customer})`);
                          }}
                          className="px-3 py-1 rounded-xl border border-[#E8E8E8] bg-white text-xs font-semibold text-black hover:bg-[#F2F4ED] hover:border-neutral-300 transition-colors shadow-2xs inline-flex items-center gap-1"
                        >
                          <span>Execute</span>
                          <ArrowRight className="w-3 h-3 text-[#788A5B]" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 border-t border-[#E8E8E8] bg-white flex items-center justify-between text-xs text-neutral-500">
          <span>
            Showing {filteredTasks.length} tasks ({tasks.filter((t) => t.status === 'Pending').length} pending)
          </span>
          <span className="text-[11px] font-medium text-[#788A5B]">All operational priorities synced</span>
        </div>
      </div>

      {/* =========================================================================
          D. Recent activity
          Recent Subscriptions
          - Subscription ID
          - Customer
          - Plan
          - Start Date
          - Status

          Recent Payments
          - Payment ID
          - Customer
          - Amount
          - Payment Date
          - Method
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Subscriptions */}
        <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E8E8E8] flex items-center justify-between bg-[#F2F4ED]/20">
            <div>
              <h3 className="text-sm font-bold text-black">Recent Subscriptions</h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">Recently provisioned and active customer plans</p>
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate('subscriptions')}
                className="text-xs font-semibold text-[#788A5B] hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F2F4ED]/50 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
                <tr>
                  <th className="py-2.5 px-4">Subscription ID</th>
                  <th className="py-2.5 px-4">Customer</th>
                  <th className="py-2.5 px-4">Plan</th>
                  <th className="py-2.5 px-4">Start Date</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
                {recentSubscriptions.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-black">{sub.id}</td>
                    <td className="py-3 px-4 font-semibold text-black">{sub.customer}</td>
                    <td className="py-3 px-4 text-neutral-600">{sub.plan}</td>
                    <td className="py-3 px-4 text-neutral-500">{sub.startDate}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          sub.status === 'Active'
                            ? 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
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
        <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E8E8E8] flex items-center justify-between bg-[#F2F4ED]/20">
            <div>
              <h3 className="text-sm font-bold text-black">Recent Payments</h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">Cleared transactions and incoming remittances</p>
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate('payments')}
                className="text-xs font-semibold text-[#788A5B] hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F2F4ED]/50 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
                <tr>
                  <th className="py-2.5 px-4">Payment ID</th>
                  <th className="py-2.5 px-4">Customer</th>
                  <th className="py-2.5 px-4">Amount</th>
                  <th className="py-2.5 px-4">Payment Date</th>
                  <th className="py-2.5 px-4">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
                {recentPayments.map((pay, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-black">{pay.id}</td>
                    <td className="py-3 px-4 font-semibold text-black">{pay.customer}</td>
                    <td className="py-3 px-4 font-bold text-black">{pay.amount}</td>
                    <td className="py-3 px-4 text-neutral-500">{pay.date}</td>
                    <td className="py-3 px-4 text-neutral-600">{pay.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =========================================================================
          E. Alerts section
          - Upcoming renewals
          - Unpaid invoices
          - Overdue payments
          - Quotations nearing expiry
          ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-600">
              Operational Priority Alerts
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Urgent triggers that require daily internal staff attention
            </p>
          </div>
          <span className="text-xs font-medium text-neutral-500 bg-[#F2F4ED] px-2.5 py-1 rounded-full border border-[#E8E8E8]">
            4 Active Triggers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <div
                key={alert.id}
                className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs flex flex-col justify-between hover:border-neutral-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-xl bg-[#F2F4ED] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#788A5B]" />
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${alert.badgeClass}`}
                    >
                      {alert.badgeText}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-black">{alert.title}</h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    {alert.subtitle}
                  </p>
                  <p className="text-[11px] font-medium text-neutral-400 mt-2">
                    {alert.detail}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8E8E8]">
                  <button
                    onClick={() => {
                      if (onNavigate && alert.targetModule) {
                        onNavigate(alert.targetModule);
                      }
                    }}
                    className="w-full py-1.5 px-3 rounded-xl border border-[#E8E8E8] bg-white text-xs font-semibold text-black hover:bg-[#F2F4ED] hover:border-neutral-300 transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <span>{alert.actionLabel}</span>
                    <ArrowRight className="w-3 h-3 text-[#788A5B]" />
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

