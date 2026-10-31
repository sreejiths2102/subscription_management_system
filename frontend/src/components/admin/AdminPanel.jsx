import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Package,
  Layers,
  FileText,
  RefreshCw,
  Receipt,
  Percent,
  Tag,
  CreditCard,
  BarChart3,
  Settings,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import UserManagementPanel from '../modules/UserManagementPanel';
import CustomerManagementPanel from '../modules/CustomerManagementPanel';
import ProductManagementPanel from '../modules/ProductManagementPanel';
import PlanManagementPanel from '../modules/PlanManagementPanel';
import QuotationManagementPanel from '../modules/QuotationManagementPanel';
import SubscriptionManagementPanel from '../modules/SubscriptionManagementPanel';
import InvoiceManagementPanel from '../modules/InvoiceManagementPanel';
import TaxManagementPanel from '../modules/TaxManagementPanel';
import DiscountManagementPanel from '../modules/DiscountManagementPanel';
import PaymentManagementPanel from '../modules/PaymentManagementPanel';
import ReportsPanel from '../modules/ReportsPanel';
import SettingsPanel from '../modules/SettingsPanel';
import { authService } from '../../api';

export default function AdminPanel() {
  const navigate = useNavigate();

  // Navigation Items in the EXACT ORDER required:
  // 1. Dashboard
  // 2. User Management
  // 3. Customer Management
  // 4. Product Management
  // 5. Subscription Plans
  // 6. Quotation Management
  // 7. Subscription Management
  // 8. Invoice Management
  // 9. Tax Management
  // 10. Discount Management
  // 11. Payment Management
  // 12. Reports & Analytics
  // 13. Settings
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'customers', label: 'Customer Management', icon: UserCheck },
    { id: 'products', label: 'Product Management', icon: Package },
    { id: 'plans', label: 'Subscription Plans', icon: Layers },
    { id: 'quotations', label: 'Quotation Management', icon: FileText },
    { id: 'subscriptions', label: 'Subscription Management', icon: RefreshCw },
    { id: 'invoices', label: 'Invoice Management', icon: Receipt },
    { id: 'taxes', label: 'Tax Management', icon: Percent },
    { id: 'discounts', label: 'Discount Management', icon: Tag },
    { id: 'payments', label: 'Payment Management', icon: CreditCard },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const [activeNav, setActiveNav] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentUser = authService.getUser() || {
    name: 'System Administrator',
    email: 'admin@subscription.com',
    role: 'admin',
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login', { replace: true });
  };

  const currentNavObj = navItems.find((item) => item.id === activeNav) || navItems[0];

  // Render selected module component seamlessly with CardLayout
  const renderCurrentModule = () => {
    switch (activeNav) {
      case 'dashboard':
        return <AdminDashboard onNavigate={setActiveNav} />;
      case 'users':
        return <UserManagementPanel userRole="admin" />;
      case 'customers':
        return <CustomerManagementPanel userRole="admin" />;
      case 'products':
        return <ProductManagementPanel userRole="admin" />;
      case 'plans':
        return <PlanManagementPanel userRole="admin" />;
      case 'quotations':
        return <QuotationManagementPanel userRole="admin" />;
      case 'subscriptions':
        return <SubscriptionManagementPanel userRole="admin" />;
      case 'invoices':
        return <InvoiceManagementPanel userRole="admin" />;
      case 'taxes':
        return <TaxManagementPanel userRole="admin" />;
      case 'discounts':
        return <DiscountManagementPanel userRole="admin" />;
      case 'payments':
        return <PaymentManagementPanel userRole="admin" />;
      case 'reports':
        return <ReportsPanel userRole="admin" />;
      case 'settings':
        return <SettingsPanel userRole="admin" />;
      default:
        return <AdminDashboard onNavigate={setActiveNav} />;
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
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#788A5B] block">Enterprise Suite</span>
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
              Management Modules
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
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
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
        <div className="p-3 border-t border-[#E8E8E8] bg-neutral-50/50">
          <div className="p-2.5 rounded-xl border border-[#E8E8E8] bg-white flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center font-bold text-xs shrink-0 border border-[#E8E8E8]">
                AD
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-black block truncate">{currentUser.name}</span>
                <span className="text-[10px] text-neutral-400 block truncate">{currentUser.email}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#788A5B] bg-[#F2F4ED] px-1.5 py-0.5 rounded border border-[#788A5B]/30 uppercase shrink-0">
              Admin
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-600 hover:text-black hover:bg-white border border-transparent hover:border-[#E8E8E8] transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* B. Header Section */}
        <header className="h-16 bg-white border-b border-[#E8E8E8] sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-[#E8E8E8] text-neutral-600 hover:text-black hover:bg-neutral-50"
              aria-label="Open navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Current Page Title / Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-neutral-400">Brightloop</span>
              <span className="text-neutral-300">/</span>
              <span className="font-bold text-black">{currentNavObj.label}</span>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search across all modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-[#E8E8E8] bg-neutral-50/50 text-xs text-black placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#788A5B] focus:border-[#788A5B] focus:bg-white transition-all"
              />
              <span className="absolute right-2.5 top-2 text-[10px] font-mono text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded border border-[#E8E8E8]">
                ⌘K
              </span>
            </div>
          </div>

          {/* Right Header Icons */}
          <div className="flex items-center gap-3">
            {/* Notification Icon & Dropdown */}
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
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-[#E8E8E8] shadow-lg p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#E8E8E8]">
                    <span className="text-xs font-bold text-black">Notifications</span>
                    <span className="text-[10px] font-semibold text-[#788A5B] bg-[#F2F4ED] px-2 py-0.5 rounded-full">
                      3 New Alerts
                    </span>
                  </div>
                  <div className="mt-2.5 space-y-2 text-xs text-neutral-600">
                    <p className="p-1.5 rounded-lg hover:bg-[#F2F4ED]/50 transition-colors">
                      <strong className="text-black block">5 Overdue Invoices</strong>
                      Nexus Cloud & Global Logistics Hub require collection reminder.
                    </p>
                    <p className="p-1.5 rounded-lg hover:bg-[#F2F4ED]/50 transition-colors">
                      <strong className="text-black block">18 Renewals Due Next Week</strong>
                      Automated invoicing schedule will trigger on Monday.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-[#E8E8E8] bg-white hover:border-neutral-300 transition-colors shadow-2xs cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center font-bold text-xs border border-[#E8E8E8]">
                  A
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <span className="text-xs font-semibold text-black block">Admin</span>
                  <span className="text-[10px] text-neutral-400 block">Operator</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 ml-1" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E8E8E8] shadow-lg p-2.5 z-50">
                  <div className="px-2.5 py-2 border-b border-[#E8E8E8] mb-1.5">
                    <p className="text-xs font-bold text-black">{currentUser.name}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-[#788A5B] bg-[#F2F4ED] px-2 py-0.5 rounded-full">
                      Full Admin Access
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setActiveNav('settings');
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-neutral-700 hover:bg-[#F2F4ED] hover:text-black rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>System Settings</span>
                    <Settings className="w-3.5 h-3.5 text-neutral-400" />
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

            {/* Direct Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs font-medium text-neutral-700 hover:text-black hover:border-neutral-300 transition-colors shadow-2xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-neutral-500" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* C. Main Content Area using CardLayout */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentModule()}
        </main>
      </div>
    </div>
  );
}
