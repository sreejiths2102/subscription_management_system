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
  Building,
  CheckCircle2,
  Mail,
  Calendar,
  ShieldCheck,
  Download
} from 'lucide-react';
import CustomerDashboard from './CustomerDashboard';
import SubscriptionManagementPanel from '../modules/SubscriptionManagementPanel';
import InvoiceManagementPanel from '../modules/InvoiceManagementPanel';
import PaymentManagementPanel from '../modules/PaymentManagementPanel';
import SettingsPanel from '../modules/SettingsPanel';
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

  // Customer Profile Component
  const renderCustomerProfile = () => (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white border border-[#E8E8E8] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E8E8E8]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center font-bold text-lg border border-[#788A5B]/30">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-black">{currentUser.name}</h2>
              <span className="text-xs text-neutral-500 font-mono">{currentUser.email}</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F2F4ED] text-[#788A5B] border border-[#788A5B]/30 self-start sm:self-auto">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Customer
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-500 mb-1">Company / Organization</label>
            <div className="p-3 rounded-xl border border-[#E8E8E8] bg-neutral-50 font-medium text-black">
              Acme Technologies Inc.
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-500 mb-1">Billing Contact Email</label>
            <div className="p-3 rounded-xl border border-[#E8E8E8] bg-neutral-50 font-medium text-black">
              {currentUser.email}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-500 mb-1">Customer Account ID</label>
            <div className="p-3 rounded-xl border border-[#E8E8E8] bg-neutral-50 font-mono text-black">
              CUST-2026-8902
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-500 mb-1">Member Since</label>
            <div className="p-3 rounded-xl border border-[#E8E8E8] bg-neutral-50 font-medium text-black">
              January 15, 2026
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-neutral-500 mb-1">Registered Billing Address</label>
            <div className="p-3 rounded-xl border border-[#E8E8E8] bg-neutral-50 font-medium text-black">
              742 Evergreen Terrace, Suite 100, Austin, TX 78701, United States
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-neutral-500 mb-1">Default Payment Method</label>
            <div className="p-3 rounded-xl border border-[#E8E8E8] bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#788A5B]" />
                <span className="font-semibold text-black">Visa ending in •••• 4242</span>
                <span className="text-neutral-400 font-mono text-[11px]">(Expires 12/28)</span>
              </div>
              <span className="text-[11px] font-bold text-[#788A5B] bg-[#F2F4ED] px-2 py-0.5 rounded-full">
                Primary
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#E8E8E8] flex justify-end">
          <button
            onClick={() => alert('Downloading customer account statement...')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Annual Statement</span>
          </button>
        </div>
      </div>
    </div>
  );

  // C. Main content area CardLayout views for Customer modules
  const renderCustomerModuleCard = () => {
    switch (activeNav) {
      case 'dashboard':
        return <CustomerDashboard onNavigate={setActiveNav} />;
      case 'profile':
        return renderCustomerProfile();
      case 'subscriptions':
        return <SubscriptionManagementPanel userRole="customer" isCustomerView={true} />;
      case 'invoices':
        return <InvoiceManagementPanel userRole="customer" isCustomerView={true} />;
      case 'payments':
        return <PaymentManagementPanel userRole="customer" isCustomerView={true} />;
      case 'settings':
        return <SettingsPanel userRole="customer" />;
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
                <span className="font-bold text-sm tracking-tight text-black block">Brightloop Software</span>
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

          {/* Navigation Items */}
          <div className="p-3">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 mb-2 block">
              Customer Menu
            </span>
            <nav className="space-y-1">
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
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#F2F4ED] text-black shadow-2xs font-bold'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-black'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-[#788A5B]' : 'text-neutral-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#788A5B]"></span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
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
            className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#E8E8E8] bg-white text-xs font-medium text-neutral-700 hover:text-black hover:bg-[#F2F4ED] hover:border-neutral-300 transition-colors shadow-2xs cursor-pointer"
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
                className="relative p-2 rounded-xl border border-[#E8E8E8] bg-white text-neutral-600 hover:text-black hover:border-neutral-300 transition-colors shadow-2xs cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#788A5B] ring-2 ring-white"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-[#E8E8E8] shadow-lg p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
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
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-[#E8E8E8] bg-white hover:border-neutral-300 transition-colors shadow-2xs cursor-pointer"
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
                    className="w-full text-left px-2.5 py-1.5 text-xs text-neutral-700 hover:bg-[#F2F4ED] hover:text-black rounded-lg transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>My Profile</span>
                    <User className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-between mt-1 cursor-pointer"
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
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs font-medium text-neutral-700 hover:text-black hover:border-neutral-300 transition-colors shadow-2xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-neutral-500" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* C. Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderCustomerModuleCard()}
        </main>
      </div>
    </div>
  );
}
