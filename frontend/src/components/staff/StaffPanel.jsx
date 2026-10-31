import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Package,
  Layers,
  FileText,
  RefreshCw,
  Receipt,
  CreditCard,
  BarChart3,
  Settings,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Lock,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import StaffDashboard from './StaffDashboard';
import CustomerManagementPanel from '../modules/CustomerManagementPanel';
import ProductManagementPanel from '../modules/ProductManagementPanel';
import PlanManagementPanel from '../modules/PlanManagementPanel';
import QuotationManagementPanel from '../modules/QuotationManagementPanel';
import SubscriptionManagementPanel from '../modules/SubscriptionManagementPanel';
import InvoiceManagementPanel from '../modules/InvoiceManagementPanel';
import PaymentManagementPanel from '../modules/PaymentManagementPanel';
import ReportsPanel from '../modules/ReportsPanel';
import SettingsPanel from '../modules/SettingsPanel';
import { authService } from '../../api';

export default function StaffPanel() {
  const navigate = useNavigate();

  // Navigation Items in the EXACT ORDER required:
  // 1. Dashboard
  // 2. Customer Management
  // 3. Product Management (View Only)
  // 4. Subscription Plans (View Only)
  // 5. Quotation Management
  // 6. Subscription Management
  // 7. Invoice Management
  // 8. Payment Management
  // 9. Reports & Analytics
  // 10. Settings
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customer Management', icon: UserCheck },
    { id: 'products', label: 'Product Management (View Only)', icon: Package, isReadOnly: true },
    { id: 'plans', label: 'Subscription Plans (View Only)', icon: Layers, isReadOnly: true },
    { id: 'quotations', label: 'Quotation Management', icon: FileText },
    { id: 'subscriptions', label: 'Subscription Management', icon: RefreshCw },
    { id: 'invoices', label: 'Invoice Management', icon: Receipt },
    { id: 'payments', label: 'Payment Management', icon: CreditCard },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const [activeNav, setActiveNav] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Retrieve current user details or fallback to staff default
  const currentUser = authService.getUser() || {
    name: 'Sarah Jenkins',
    email: 'staff@subscription.com',
    role: 'staff',
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login', { replace: true });
  };

  const currentNavObj = navItems.find((item) => item.id === activeNav) || navItems[0];

  // Helper to render current component mapped to navigation
  const renderCurrentModule = () => {
    switch (activeNav) {
      case 'dashboard':
        return <StaffDashboard onNavigate={setActiveNav} />;
      case 'customers':
        return <CustomerManagementPanel />;
      case 'products':
        return <ProductManagementPanel isReadOnly={true} />;
      case 'plans':
        return <PlanManagementPanel isReadOnly={true} />;
      case 'quotations':
        return <QuotationManagementPanel />;
      case 'subscriptions':
        return <SubscriptionManagementPanel />;
      case 'invoices':
        return <InvoiceManagementPanel />;
      case 'payments':
        return <PaymentManagementPanel />;
      case 'reports':
        return <ReportsPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <StaffDashboard onNavigate={setActiveNav} />;
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

      {/* =========================================================================
          A. Sidebar Navigation
          10 items in exact requested order:
          1. Dashboard
          2. Customer Management
          3. Product Management (View Only)
          4. Subscription Plans (View Only)
          5. Quotation Management
          6. Subscription Management
          7. Invoice Management
          8. Payment Management
          9. Reports & Analytics
          10. Settings
          ========================================================================= */}
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
                <span className="font-bold text-sm tracking-tight text-black block">
                  Brightloop Software
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#788A5B] block">
                  Staff Operations
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 10 Navigation Items in Exact Order */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Staff Workspace
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
                  <span className="truncate flex-1">{item.label}</span>
                  {item.isReadOnly && (
                    <span className="shrink-0 p-1 rounded-md bg-white text-neutral-400 border border-[#E8E8E8] shadow-2xs" title="View Only">
                      <Lock className="w-2.5 h-2.5 text-[#788A5B]" />
                    </span>
                  )}
                  {isActive && (
                    <span className="ml-1 w-1.5 h-1.5 rounded-full bg-[#788A5B] shrink-0"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* =========================================================================
            D. Sidebar Footer
            - Staff name.
            - Staff role.
            - Logout.
            ========================================================================= */}
        <div className="p-3.5 border-t border-[#E8E8E8] bg-[#F2F4ED]/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#788A5B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser.name
                  ? currentUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  : 'ST'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-black truncate">{currentUser.name}</p>
                <p className="text-[11px] text-neutral-500 truncate">{currentUser.email}</p>
              </div>
            </div>
            {/* Staff Role Badge */}
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white text-[#788A5B] border border-[#E8E8E8] shrink-0">
              Staff
            </span>
          </div>

          {/* Logout Option */}
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
        {/* =========================================================================
            B. Header Section
            - Application logo and name.
            - Current page title.
            - Global search.
            - Notifications.
            - Staff profile dropdown.
            - Logout button.
            ========================================================================= */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-xs border-b border-[#E8E8E8] px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-[#E8E8E8] text-neutral-600 hover:text-black"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Current Page Title / Breadcrumb */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-400 font-medium">Brightloop</span>
              <span className="text-neutral-300">/</span>
              <span className="font-semibold text-black">{currentNavObj.label}</span>
            </div>
          </div>

          {/* Global Search, Notifications & Staff Profile */}
          <div className="flex items-center gap-3">
            {/* Global Search Bar */}
            <div className="relative hidden md:block w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customers, invoices, tasks..."
                className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs text-black placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#788A5B] focus:border-[#788A5B] transition-colors"
              />
              <kbd className="absolute right-2.5 top-2 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-400 bg-neutral-100 rounded border border-[#E8E8E8]">
                ⌘K
              </kbd>
            </div>

            {/* Notification Icon */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl border border-[#E8E8E8] bg-white text-neutral-600 hover:text-black hover:border-neutral-300 transition-colors shadow-2xs"
                aria-label="Operational Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#788A5B] ring-2 ring-white"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-[#E8E8E8] shadow-lg p-3.5 z-50">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#E8E8E8]">
                    <span className="text-xs font-bold text-black">Operational Queue</span>
                    <span className="text-[10px] font-semibold text-[#788A5B] bg-[#F2F4ED] px-2 py-0.5 rounded-full">
                      4 Pending
                    </span>
                  </div>
                  <div className="mt-2.5 space-y-2 text-xs text-neutral-600">
                    <p className="p-1.5 rounded-lg hover:bg-[#F2F4ED]/50 transition-colors">
                      <strong className="text-black block">Follow up invoice: ABC Ltd</strong>
                      Payment of $2,450.00 is due on 01-Nov.
                    </p>
                    <p className="p-1.5 rounded-lg hover:bg-[#F2F4ED]/50 transition-colors">
                      <strong className="text-black block">Review quotation: XYZ Ltd</strong>
                      Enterprise quote QT-2026-042 requires review.
                    </p>
                    <p className="p-1.5 rounded-lg hover:bg-[#F2F4ED]/50 transition-colors">
                      <strong className="text-black block">Subscription renewal: PQR Ltd</strong>
                      Scheduled renewal for 03-Nov.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Staff Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-[#E8E8E8] bg-white hover:border-neutral-300 transition-colors shadow-2xs"
              >
                <div className="w-7 h-7 rounded-lg bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center font-bold text-xs border border-[#E8E8E8]">
                  ST
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <span className="text-xs font-semibold text-black block truncate max-w-[100px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-neutral-400 block">Staff</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 ml-0.5" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E8E8E8] shadow-lg p-2.5 z-50">
                  <div className="px-2.5 py-2 border-b border-[#E8E8E8] mb-1.5">
                    <p className="text-xs font-bold text-black">{currentUser.name}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-[#788A5B] bg-[#F2F4ED] px-2 py-0.5 rounded-full">
                      Operational Staff
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setActiveNav('settings');
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-neutral-700 hover:bg-[#F2F4ED] hover:text-black rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>Staff Settings</span>
                    <Settings className="w-3.5 h-3.5 text-neutral-400" />
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

        {/* =========================================================================
            C. Main Content Area
            Uses CardLayout to display the selected module:
            - Dashboard -> StaffDashboard
            - Customer Management -> CustomerManagementPanel
            - Product Management -> ProductManagementPanel
            - Subscription Plans -> PlanManagementPanel
            - Quotation Management -> QuotationManagementPanel
            - Subscription Management -> SubscriptionManagementPanel
            - Invoice Management -> InvoiceManagementPanel
            - Payment Management -> PaymentManagementPanel
            - Reports & Analytics -> ReportsPanel
            - Settings -> SettingsPanel
            ========================================================================= */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentModule()}
        </main>
      </div>
    </div>
  );
}

