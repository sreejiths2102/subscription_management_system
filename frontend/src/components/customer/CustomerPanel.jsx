import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  RefreshCw,
  Receipt,
  CreditCard,
  Settings,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import CustomerDashboard from './CustomerDashboard';
import { authService } from '../../api';

export default function CustomerPanel() {
  const navigate = useNavigate();

  // A. Sidebar navigation
  // 1. Dashboard
  // 2. My Profile
  // 3. My Subscriptions
  // 4. My Invoices
  // 5. Payment History
  // 6. Settings
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'subscriptions', label: 'My Subscriptions', icon: RefreshCw },
    { id: 'invoices', label: 'My Invoices', icon: Receipt },
    { id: 'payments', label: 'Payment History', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const [activeNav, setActiveNav] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const currentUser = authService.getUser() || {
    name: 'Customer Account',
    email: 'customer@example.com',
    role: 'customer',
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login', { replace: true });
  };

  const currentNavObj = navItems.find((item) => item.id === activeNav) || navItems[0];

  // C. Main content area CardLayout views for Customer modules
  const renderCustomerModuleCard = (moduleId) => {
    switch (moduleId) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs">
              <div className="pb-4 border-b border-[#E8E8E8]">
                <h2 className="text-xl font-bold tracking-tight text-black">My Profile</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Your personal credentials, company details, and contact info</p>
              </div>

              <div className="mt-6 max-w-xl space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    readOnly
                    value={currentUser.name}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E8] bg-neutral-50 text-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    readOnly
                    value={currentUser.email}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E8] bg-neutral-50 text-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Account Role</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8]">
                    {currentUser.role?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'subscriptions':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-black">My Subscriptions</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Manage your service licenses, auto-renewal settings, and plan tiers</p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs">
                Explore Available Upgrades
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
                  <tr>
                    <th className="py-3 px-4">Subscription ID</th>
                    <th className="py-3 px-4">Plan Name</th>
                    <th className="py-3 px-4">Billing Rate</th>
                    <th className="py-3 px-4">Next Renewal</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E8]">
                  <tr className="hover:bg-neutral-50/70">
                    <td className="py-3.5 px-4 font-mono font-medium text-black">SUB-2040</td>
                    <td className="py-3.5 px-4 font-medium">Professional Suite (Annual)</td>
                    <td className="py-3.5 px-4 text-neutral-600">$149.00 / month</td>
                    <td className="py-3.5 px-4 text-neutral-600">Nov 15, 2026</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8]">
                        Active
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-neutral-50/70">
                    <td className="py-3.5 px-4 font-mono font-medium text-black">SUB-2048</td>
                    <td className="py-3.5 px-4 font-medium">Analytics Intelligence Engine Add-on</td>
                    <td className="py-3.5 px-4 text-neutral-600">$29.00 / month</td>
                    <td className="py-3.5 px-4 text-neutral-600">Jan 10, 2027</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8]">
                        Active
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'invoices':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-black">My Invoices</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Download receipts, view tax breakdowns, and check payment status</p>
              </div>
              <button className="px-3.5 py-2 rounded-xl border border-[#E8E8E8] bg-white text-xs font-semibold text-neutral-700 hover:text-black transition-colors flex items-center gap-1.5 shadow-xs">
                <Download className="w-3.5 h-3.5" /> Download Statement
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
                  <tr>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Issue Date</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E8]">
                  <tr className="hover:bg-neutral-50/70">
                    <td className="py-3.5 px-4 font-mono font-medium text-black">INV-2026-088</td>
                    <td className="py-3.5 px-4 text-neutral-600">Oct 15, 2026</td>
                    <td className="py-3.5 px-4 text-neutral-600">Oct 29, 2026</td>
                    <td className="py-3.5 px-4 font-semibold text-black">$149.00</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8]">
                        Paid
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-neutral-50/70">
                    <td className="py-3.5 px-4 font-mono font-medium text-black">INV-2026-074</td>
                    <td className="py-3.5 px-4 text-neutral-600">Sep 15, 2026</td>
                    <td className="py-3.5 px-4 text-neutral-600">Sep 29, 2026</td>
                    <td className="py-3.5 px-4 font-semibold text-black">$149.00</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8]">
                        Paid
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs">
              <h2 className="text-xl font-bold tracking-tight text-black">Payment History</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Logs of all electronic payments credited to your account</p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
                  <tr>
                    <th className="py-3 px-4">Payment ID</th>
                    <th className="py-3 px-4">Linked Invoice</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Settled Amount</th>
                    <th className="py-3 px-4">Payment Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E8]">
                  <tr className="hover:bg-neutral-50/70">
                    <td className="py-3.5 px-4 font-mono font-medium text-black">PAY-8820</td>
                    <td className="py-3.5 px-4 font-mono text-neutral-600">INV-2026-088</td>
                    <td className="py-3.5 px-4 text-neutral-600">Visa •••• 4242</td>
                    <td className="py-3.5 px-4 font-semibold text-black">$149.00</td>
                    <td className="py-3.5 px-4 text-neutral-500">Oct 16, 2026</td>
                  </tr>
                  <tr className="hover:bg-neutral-50/70">
                    <td className="py-3.5 px-4 font-mono font-medium text-black">PAY-8755</td>
                    <td className="py-3.5 px-4 font-mono text-neutral-600">INV-2026-074</td>
                    <td className="py-3.5 px-4 text-neutral-600">Visa •••• 4242</td>
                    <td className="py-3.5 px-4 font-semibold text-black">$149.00</td>
                    <td className="py-3.5 px-4 text-neutral-500">Sep 16, 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs">
              <h2 className="text-xl font-bold tracking-tight text-black">Account Settings</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Notification preferences, billing alerts, and security options</p>

              <div className="mt-6 space-y-4 max-w-lg text-xs">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#E8E8E8]">
                  <div>
                    <p className="font-semibold text-black">Email Invoices & Receipts</p>
                    <p className="text-neutral-500 text-[11px]">Receive PDF copies automatically upon payment</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-black focus:ring-[#788A5B]" />
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#E8E8E8]">
                  <div>
                    <p className="font-semibold text-black">Renewal Reminders</p>
                    <p className="text-neutral-500 text-[11px]">Get notified 7 days prior to annual renewal</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded border-neutral-300 text-black focus:ring-[#788A5B]" />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <CustomerDashboard onNavigate={setActiveNav} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex font-sans antialiased text-black">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* A. Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E8E8E8] flex flex-col justify-between transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Application Name */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-[#E8E8E8]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm shadow-xs">
                BL
              </div>
              <div className="leading-tight">
                <span className="font-bold text-sm tracking-tight text-black block">Brightloop</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#788A5B] block">Customer Portal</span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 6 Navigation Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Menu
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-colors font-medium text-left ${
                    isActive
                      ? 'bg-[#F2F4ED] text-black font-semibold shadow-2xs'
                      : 'text-neutral-600 hover:text-black hover:bg-[#F2F4ED]/50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#788A5B]' : 'text-neutral-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#788A5B]"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* D. Sidebar Footer */}
        <div className="p-3.5 border-t border-[#E8E8E8] bg-[#F2F4ED]/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#788A5B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'C'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-black truncate">{currentUser.name}</p>
                <p className="text-[11px] text-neutral-500 truncate">{currentUser.email}</p>
              </div>
            </div>
            {/* Customer Role Indicator */}
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white text-[#788A5B] border border-[#E8E8E8] shrink-0">
              Customer
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#E8E8E8] bg-white text-xs font-medium text-neutral-700 hover:text-black hover:bg-[#F2F4ED] hover:border-neutral-300 transition-colors shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5 text-neutral-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* B. Header Section */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-xs border-b border-[#E8E8E8] px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-[#E8E8E8] text-neutral-600 hover:text-black"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Current Page Title */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-400 font-medium">Brightloop</span>
              <span className="text-neutral-300">/</span>
              <span className="font-semibold text-black">{currentNavObj.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Icon */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl border border-[#E8E8E8] bg-white text-neutral-600 hover:text-black hover:border-neutral-300 transition-colors shadow-2xs"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#788A5B] ring-2 ring-white"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-[#E8E8E8] shadow-lg p-3.5 z-50">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#E8E8E8]">
                    <span className="text-xs font-bold text-black">Notifications</span>
                    <span className="text-[10px] font-semibold text-[#788A5B] bg-[#F2F4ED] px-2 py-0.5 rounded-full">
                      Account Updates
                    </span>
                  </div>
                  <div className="mt-2.5 space-y-2 text-xs text-neutral-600">
                    <p className="p-1.5 rounded-lg hover:bg-[#F2F4ED]/50 transition-colors">
                      <strong className="text-black block">Payment Receipt Ready</strong>
                      Invoice INV-2026-088 marked paid.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-[#E8E8E8] bg-white hover:border-neutral-300 transition-colors shadow-2xs"
              >
                <div className="w-7 h-7 rounded-lg bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center font-bold text-xs border border-[#E8E8E8]">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <span className="text-xs font-semibold text-black block">{currentUser.name}</span>
                  <span className="text-[10px] text-neutral-400 block">Customer</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 ml-1" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E8E8E8] shadow-lg p-2.5 z-50">
                  <div className="px-2.5 py-2 border-b border-[#E8E8E8] mb-1.5">
                    <p className="text-xs font-bold text-black">{currentUser.name}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-[#788A5B] bg-[#F2F4ED] px-2 py-0.5 rounded-full">
                      Customer
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setActiveNav('profile');
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-neutral-700 hover:bg-[#F2F4ED] hover:text-black rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>My Profile</span>
                    <User className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-between mt-1"
                  >
                    <span>Log Out</span>
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs font-medium text-neutral-700 hover:text-black hover:border-neutral-300 transition-colors shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5 text-neutral-500" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* C. Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeNav === 'dashboard' ? (
            <CustomerDashboard onNavigate={setActiveNav} />
          ) : (
            renderCustomerModuleCard(activeNav)
          )}
        </main>
      </div>
    </div>
  );
}

