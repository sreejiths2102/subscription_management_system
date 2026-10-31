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
  Plus,
  Filter,
  Download,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';
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

  // Reusable CardLayout for modules when selected
  const renderModuleCardLayout = (moduleId) => {
    // Module meta definitions
    const moduleConfigs = {
      users: {
        title: 'User Management',
        description: 'Manage staff operators, customer credentials, and RBAC permissions across the platform.',
        actionText: '+ Invite User',
        stats: [
          { label: 'Total Users', value: '1,420' },
          { label: 'Administrators', value: '4' },
          { label: 'Staff Members', value: '28' },
          { label: 'Active Sessions', value: '142' }
        ],
        sampleData: [
          { c1: 'USR-101', c2: 'Alex Johnson', c3: 'alex.test@example.com', c4: 'customer', c5: 'Active' },
          { c1: 'USR-102', c2: 'Sarah Jenkins', c3: 'sarah.ops@brightloop.com', c4: 'staff', c5: 'Active' },
          { c1: 'USR-103', c2: 'System Administrator', c3: 'admin@subscription.com', c4: 'admin', c5: 'Active' },
          { c1: 'USR-104', c2: 'Michael Chang', c3: 'michael@cloudmedia.io', c4: 'customer', c5: 'Inactive' }
        ],
        cols: ['User ID', 'Full Name', 'Email Address', 'Assigned Role', 'Status']
      },
      customers: {
        title: 'Customer Management',
        description: 'Customer directory, billing addresses, account contacts, and subscription associations.',
        actionText: '+ New Customer',
        stats: [
          { label: 'Total Accounts', value: '1,280' },
          { label: 'Enterprise', value: '114' },
          { label: 'SMB Accounts', value: '740' },
          { label: 'Churn Rate', value: '1.2%' }
        ],
        sampleData: [
          { c1: 'CUST-3041', c2: 'Acme Technologies Inc.', c3: 'contact@acme.com', c4: 'Enterprise Tier', c5: 'Active' },
          { c1: 'CUST-3040', c2: 'Nexus Cloud Systems', c3: 'billing@nexuscloud.io', c4: 'Pro Tier', c5: 'Active' },
          { c1: 'CUST-3039', c2: 'Vertex Media Global', c3: 'accounts@vertexmedia.com', c4: 'Standard Tier', c5: 'Active' },
          { c1: 'CUST-3038', c2: 'Horizon AI Labs', c3: 'ops@horizonlabs.ai', c4: 'Enterprise Tier', c5: 'Active' }
        ],
        cols: ['Customer ID', 'Organization Name', 'Billing Email', 'Active Tier', 'Status']
      },
      products: {
        title: 'Product Management',
        description: 'Configure software products, add-on modules, feature suites, and catalog items.',
        actionText: '+ New Product',
        stats: [
          { label: 'Active Products', value: '8' },
          { label: 'Add-on Services', value: '14' },
          { label: 'SKU Items', value: '32' },
          { label: 'Categories', value: '4' }
        ],
        sampleData: [
          { c1: 'PRD-01', c2: 'Brightloop Core Platform', c3: 'SaaS Suite', c4: 'Cloud Hosted', c5: 'Active' },
          { c1: 'PRD-02', c2: 'Analytics Intelligence Engine', c3: 'Add-on Module', c4: 'API / Webhook', c5: 'Active' },
          { c1: 'PRD-03', c2: 'Enterprise Dedicated Server', c3: 'Infrastructure', c4: 'Private Cluster', c5: 'Active' },
          { c1: 'PRD-04', c2: 'White-Label Branding Suite', c3: 'Customization', c4: 'Frontend Theme', c5: 'Active' }
        ],
        cols: ['Product Code', 'Product Name', 'Category', 'Delivery Method', 'Catalog Status']
      },
      plans: {
        title: 'Subscription Plans',
        description: 'Pricing models, recurring billing intervals (monthly/yearly), usage tiers, and seat limits.',
        actionText: '+ Create Plan',
        stats: [
          { label: 'Active Plans', value: '6' },
          { label: 'Average Plan Price', value: '$240/mo' },
          { label: 'Annual Discounts', value: '20%' },
          { label: 'Trial Length', value: '14 Days' }
        ],
        sampleData: [
          { c1: 'PLN-01', c2: 'Starter Tier', c3: '$49.00 / mo', c4: 'Monthly', c5: 'Active' },
          { c1: 'PLN-02', c2: 'Professional Tier', c3: '$149.00 / mo', c4: 'Monthly', c5: 'Active' },
          { c1: 'PLN-03', c2: 'Enterprise Annual', c3: '$1,490.00 / yr', c4: 'Yearly', c5: 'Active' },
          { c1: 'PLN-04', c2: 'Custom Partner Tier', c3: '$3,600.00 / yr', c4: 'Yearly', c5: 'Active' }
        ],
        cols: ['Plan Code', 'Plan Name', 'Billing Rate', 'Billing Cadence', 'Availability']
      },
      quotations: {
        title: 'Quotation Management',
        description: 'Draft, review, approve, and send custom enterprise pricing quotes and sales proposals.',
        actionText: '+ New Quotation',
        stats: [
          { label: 'Open Quotes', value: '18' },
          { label: 'Total Quoted Value', value: '$84,500' },
          { label: 'Acceptance Rate', value: '72%' },
          { label: 'Expiring Soon', value: '4' }
        ],
        sampleData: [
          { c1: 'QT-2026-041', c2: 'Quantum Dynamics', c3: '$18,400.00', c4: 'Valid till Nov 15', c5: 'Pending Review' },
          { c1: 'QT-2026-040', c2: 'Global Fintech Ltd', c3: '$32,000.00', c4: 'Valid till Nov 20', c5: 'Approved' },
          { c1: 'QT-2026-039', c2: 'Summit Health Corp', c3: '$12,500.00', c4: 'Valid till Nov 10', c5: 'Sent' },
          { c1: 'QT-2026-038', c2: 'Orion Robotics Inc', c3: '$24,000.00', c4: 'Expired Oct 28', c5: 'Closed' }
        ],
        cols: ['Quote Number', 'Target Customer', 'Proposal Value', 'Expiration', 'Status']
      },
      subscriptions: {
        title: 'Subscription Management',
        description: 'Monitor recurring lifecycles, upgrade/downgrade tiers, pause services, and process cancellations.',
        actionText: '+ New Subscription',
        stats: [
          { label: 'Active Subs', value: '892' },
          { label: 'Paused Subs', value: '125' },
          { label: 'Trial Subs', value: '44' },
          { label: 'Net MRR Impact', value: '+$4,250' }
        ],
        sampleData: [
          { c1: 'SUB-2041', c2: 'Acme Technologies Inc.', c3: 'Enterprise Yearly', c4: '$3,600.00 / yr', c5: 'Active' },
          { c1: 'SUB-2040', c2: 'Nexus Cloud Systems', c3: 'Pro Monthly', c4: '$149.00 / mo', c5: 'Active' },
          { c1: 'SUB-2039', c2: 'Vertex Media Global', c3: 'Standard Monthly', c4: '$89.00 / mo', c5: 'Paused' },
          { c1: 'SUB-2038', c2: 'Horizon AI Labs', c3: 'Enterprise Quarterly', c4: '$1,200.00 / qtr', c5: 'Active' }
        ],
        cols: ['Subscription ID', 'Customer Account', 'Assigned Plan', 'Billing Amount', 'Status']
      },
      invoices: {
        title: 'Invoice Management',
        description: 'Automated invoice generation, tax calculations, payment status tracking, and PDF receipts.',
        actionText: '+ Create Invoice',
        stats: [
          { label: 'Invoices Cleared', value: '884' },
          { label: 'Pending Settlement', value: '14' },
          { label: 'Overdue Balance', value: '$1,820' },
          { label: 'Average Settlement', value: '1.4 Days' }
        ],
        sampleData: [
          { c1: 'INV-2026-089', c2: 'Acme Technologies Inc.', c3: '$3,600.00', c4: 'Oct 30, 2026', c5: 'Paid' },
          { c1: 'INV-2026-088', c2: 'Nexus Cloud Systems', c3: '$450.00', c4: 'Oct 29, 2026', c5: 'Paid' },
          { c1: 'INV-2026-087', c2: 'Cloudflow Networks', c3: '$890.00', c4: 'Oct 28, 2026', c5: 'Paid' },
          { c1: 'INV-2026-086', c2: 'BlueSky Digital LLC', c3: '$1,420.00', c4: 'Oct 15, 2026', c5: 'Overdue' }
        ],
        cols: ['Invoice Number', 'Billed Customer', 'Total Billed', 'Due Date', 'Payment Status']
      },
      taxes: {
        title: 'Tax Management',
        description: 'Configure regional sales tax, VAT, GST rules, country exemptions, and compliance schedules.',
        actionText: '+ New Tax Rule',
        stats: [
          { label: 'Configured Rules', value: '12' },
          { label: 'Standard VAT', value: '20.0%' },
          { label: 'US Average Sales Tax', value: '8.25%' },
          { label: 'Exempt Jurisdictions', value: '3' }
        ],
        sampleData: [
          { c1: 'TAX-VAT-UK', c2: 'United Kingdom Standard VAT', c3: '20.0%', c4: 'All Products', c5: 'Active' },
          { c1: 'TAX-GST-IN', c2: 'India Integrated GST (IGST)', c3: '18.0%', c4: 'Software & Cloud', c5: 'Active' },
          { c1: 'TAX-CA-US', c2: 'California State & District Tax', c3: '8.75%', c4: 'Digital Services', c5: 'Active' },
          { c1: 'TAX-EXEMPT', c2: 'Tax-Exempt Academic Accounts', c3: '0.0%', c4: 'Academic Orgs', c5: 'Active' }
        ],
        cols: ['Rule Code', 'Jurisdiction Description', 'Tax Rate', 'Applicable Category', 'Status']
      },
      discounts: {
        title: 'Discount Management',
        description: 'Manage promotion codes, coupon campaigns, percentage discounts, and customer-specific credits.',
        actionText: '+ Add Discount Code',
        stats: [
          { label: 'Active Promotions', value: '6' },
          { label: 'Coupons Redeemed', value: '342' },
          { label: 'Total Discount Given', value: '$12,480' },
          { label: 'Avg Order Uplift', value: '+24%' }
        ],
        sampleData: [
          { c1: 'WELCOME20', c2: 'First Year Onboarding Discount', c3: '20% Recurring', c4: 'Valid till Dec 2026', c5: 'Active' },
          { c1: 'STARTUP50', c2: 'Seed Accelerator Special Grant', c3: '50% First 6 Mo', c4: 'Approved Startups', c5: 'Active' },
          { c1: 'ANNUALUPG', c2: 'Monthly to Annual Upgrade Incentive', c3: '2 Months Free', c4: 'Existing Customers', c5: 'Active' },
          { c1: 'BLACKFRIDAY26', c2: 'Fall Special Campaign', c3: '15% Lifetime', c4: 'Nov 20 - Nov 30', c5: 'Draft' }
        ],
        cols: ['Coupon Code', 'Campaign Description', 'Benefit Details', 'Validity Period', 'Status']
      },
      payments: {
        title: 'Payment Management',
        description: 'Payment gateway integrations (Stripe, PayPal, Bank Transfers), clearing records, and dispute logs.',
        actionText: '+ Record Manual Payment',
        stats: [
          { label: 'Volume Processed', value: '$384,120' },
          { label: 'Transactions Cleared', value: '924' },
          { label: 'Failed Attempts', value: '6' },
          { label: 'Gateway Health', value: '100% Online' }
        ],
        sampleData: [
          { c1: 'PAY-8821', c2: 'Acme Technologies Inc.', c3: 'Stripe ACH Transfer', c4: '$3,600.00', c5: 'Cleared' },
          { c1: 'PAY-8820', c2: 'Nexus Cloud Systems', c3: 'Visa Ending in 4242', c4: '$450.00', c5: 'Cleared' },
          { c1: 'PAY-8819', c2: 'Cloudflow Networks', c3: 'Mastercard Ending 8812', c4: '$890.00', c5: 'Cleared' },
          { c1: 'PAY-8818', c2: 'Horizon AI Labs', c3: 'Direct Wire Settlement', c4: '$1,200.00', c5: 'Cleared' }
        ],
        cols: ['Transaction ID', 'Customer Account', 'Payment Method', 'Settled Amount', 'Gateway Status']
      },
      reports: {
        title: 'Reports & Analytics',
        description: 'Comprehensive financial statements, ARR/MRR forecasts, cohort churn curves, and tax summaries.',
        actionText: 'Export CSV / PDF',
        stats: [
          { label: 'Monthly Growth', value: '+14.2%' },
          { label: 'Average LTV', value: '$4,850' },
          { label: 'CAC Payback', value: '4.8 Months' },
          { label: 'Net Revenue Retention', value: '118%' }
        ],
        sampleData: [
          { c1: 'REP-2026-10', c2: 'October Financial Ledger & MRR Breakdown', c3: 'Monthly Revenue', c4: 'Oct 31, 2026', c5: 'Ready' },
          { c1: 'REP-2026-Q3', c2: 'Q3 Comprehensive Audit & Tax Statement', c3: 'Quarterly Audit', c4: 'Oct 01, 2026', c5: 'Ready' },
          { c1: 'REP-CHURN-09', c2: 'September Churn & Cohort Retention Analysis', c3: 'Customer Success', c4: 'Oct 05, 2026', c5: 'Ready' },
          { c1: 'REP-TAX-2026', c2: 'YTD International VAT & Sales Tax Ledger', c3: 'Compliance', c4: 'Oct 28, 2026', c5: 'Ready' }
        ],
        cols: ['Report ID', 'Document Title', 'Report Scope', 'Generated Date', 'Status']
      },
      settings: {
        title: 'Platform Settings',
        description: 'Global system configuration, billing currency, brand identity, webhook endpoints, and API keys.',
        actionText: 'Save All Changes',
        stats: [
          { label: 'Base Currency', value: 'USD ($)' },
          { label: 'Default Tax Profile', value: 'Inclusive' },
          { label: 'API Version', value: 'v1.4.0' },
          { label: 'Security Protocols', value: 'Argon2 + JWT' }
        ],
        sampleData: [
          { c1: 'CFG-01', c2: 'Company Name & Branding Identity', c3: 'Brightloop Software', c4: 'Public Assets', c5: 'Configured' },
          { c1: 'CFG-02', c2: 'Primary Notification Webhook Endpoint', c3: 'https://api.brightloop.com/hooks', c4: 'Production', c5: 'Active' },
          { c1: 'CFG-03', c2: 'Invoice Automated Grace Period', c3: '7 Calendar Days', c4: 'Billing Engine', c5: 'Active' },
          { c1: 'CFG-04', c2: 'Session Expiry Timeout (JWT Token)', c3: '60 Minutes', c4: 'Authentication', c5: 'Active' }
        ],
        cols: ['Parameter Key', 'Configuration Item', 'Current Value', 'Environment Scope', 'Status']
      }
    };

    const config = moduleConfigs[moduleId] || moduleConfigs.users;

    return (
      <div className="space-y-6">
        {/* Card Header Section */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#788A5B]">Module Overview</span>
              <span className="text-neutral-300">•</span>
              <span className="text-xs font-medium text-neutral-500">Live Workspace</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-black">{config.title}</h2>
            <p className="text-xs text-neutral-500 mt-1 max-w-2xl">{config.description}</p>
          </div>

          <div className="flex items-center gap-2.5">
            <button className="px-3.5 py-2 rounded-xl border border-[#E8E8E8] bg-white text-xs font-semibold text-neutral-700 hover:text-black hover:border-neutral-300 transition-colors shadow-xs flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs flex items-center gap-1.5">
              {config.actionText}
            </button>
          </div>
        </div>

        {/* Quick KPI stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {config.stats.map((s, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 border border-[#E8E8E8] shadow-xs">
              <span className="text-xs font-medium text-neutral-500">{s.label}</span>
              <p className="text-xl font-bold tracking-tight text-black mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Main Card Content with Table and Filters */}
        <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 border-b border-[#E8E8E8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#F2F4ED]/30">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                placeholder={`Search in ${config.title}...`}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs text-black placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#788A5B] focus:border-[#788A5B]"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs font-medium text-neutral-700 hover:text-black flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#788A5B]" /> Filter
              </button>
              <button className="px-3 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs font-medium text-neutral-700 hover:text-black">
                Status: All
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
                <tr>
                  {config.cols.map((col, cIdx) => (
                    <th key={cIdx} className="py-3 px-4">{col}</th>
                  ))}
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
                {config.sampleData.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-black">{row.c1}</td>
                    <td className="py-3.5 px-4 font-medium">{row.c2}</td>
                    <td className="py-3.5 px-4 text-neutral-600">{row.c3}</td>
                    <td className="py-3.5 px-4 text-neutral-600">{row.c4}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8]">
                        {row.c5}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="p-1 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 border-t border-[#E8E8E8] flex items-center justify-between text-xs text-neutral-500 bg-white">
            <span>Showing 4 of 4 records in {config.title}</span>
            <div className="flex items-center gap-1">
              <button disabled className="px-2.5 py-1 rounded-lg border border-[#E8E8E8] text-neutral-300 cursor-not-allowed">
                Previous
              </button>
              <button className="px-2.5 py-1 rounded-lg bg-black text-white font-medium">1</button>
              <button disabled className="px-2.5 py-1 rounded-lg border border-[#E8E8E8] text-neutral-300 cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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

          {/* 13 Navigation Items in Exact Order */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Management Modules
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
                AD
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-black truncate">{currentUser.name}</p>
                <p className="text-[11px] text-neutral-500 truncate">{currentUser.email}</p>
              </div>
            </div>
            {/* Admin Role Indicator */}
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white text-[#788A5B] border border-[#E8E8E8] shrink-0">
              Admin
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
        {/* B. Header Section */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-xs border-b border-[#E8E8E8] px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-[#E8E8E8] text-neutral-600 hover:text-black"
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

          {/* Search, Notifications & Admin Profile */}
          <div className="flex items-center gap-3">
            {/* Global Search Bar */}
            <div className="relative hidden md:block w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all modules..."
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
                aria-label="System Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#788A5B] ring-2 ring-white"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-[#E8E8E8] shadow-lg p-3.5 z-50">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#E8E8E8]">
                    <span className="text-xs font-bold text-black">Notifications</span>
                    <span className="text-[10px] font-semibold text-[#788A5B] bg-[#F2F4ED] px-2 py-0.5 rounded-full">
                      System Online
                    </span>
                  </div>
                  <div className="mt-2.5 space-y-2 text-xs text-neutral-600">
                    <p className="p-1.5 rounded-lg hover:bg-[#F2F4ED]/50 transition-colors">
                      <strong className="text-black block">Database Backup Completed</strong>
                      PostgreSQL subscription_db backed up successfully.
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
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-[#E8E8E8] bg-white hover:border-neutral-300 transition-colors shadow-2xs"
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
                    className="w-full text-left px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-between mt-1"
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
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs font-medium text-neutral-700 hover:text-black hover:border-neutral-300 transition-colors shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5 text-neutral-500" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* C. Main Content Area using CardLayout */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeNav === 'dashboard' ? (
            <AdminDashboard onNavigate={setActiveNav} />
          ) : (
            renderModuleCardLayout(activeNav)
          )}
        </main>
      </div>
    </div>
  );
}

