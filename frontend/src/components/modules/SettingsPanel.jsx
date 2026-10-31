import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Building,
  Save,
  Key,
  Shield,
  CheckCircle2,
  Mail,
  FileText,
  CreditCard,
  Lock,
  Globe
} from 'lucide-react';
import { authService } from '../../api';

export default function SettingsPanel({ userRole: propRole }) {
  const currentUser = authService.getUser() || {
    name: 'System Administrator',
    email: 'admin@subscription.com',
    role: 'admin',
  };
  const role = propRole || currentUser.role || 'admin';
  const isAdmin = role === 'admin';
  const isCustomer = role === 'customer';

  // Navigation Tabs: Account, Notifications, Business (Admin only)
  const [activeTab, setActiveTab] = useState('account');
  const [saveSuccess, setSaveSuccess] = useState('');

  // 3. Account Settings Form State
  const [accountForm, setAccountForm] = useState({
    name: currentUser.name || 'System Administrator',
    email: currentUser.email || 'admin@subscription.com',
    phone: '+1 (555) 234-5678',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 4. Notification Settings Form State
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    invoiceReminders: true,
    renewalReminders: true,
    paymentNotifications: true,
    marketingDigest: false,
  });

  // 5. Business Settings Form State (Admin Only)
  const [businessSettings, setBusinessSettings] = useState({
    businessName: 'Brightloop Software Inc.',
    businessEmail: 'billing@brightloop.io',
    businessAddress: '100 Innovation Way, Suite 400, San Francisco, CA 94107',
    currency: 'USD ($)',
    defaultPaymentTerms: 'Net 30 Days',
    invoicePrefix: 'INV-2026-',
    nextInvoiceNumber: '090',
    taxNumber: 'US-EIN-94-3829104',
    invoiceFooterNote: 'Thank you for choosing Brightloop Software. Payment is due within standard terms.',
  });

  const handleSave = (sectionName) => {
    setSaveSuccess(`${sectionName} saved successfully!`);
    setTimeout(() => setSaveSuccess(''), 3500);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (accountForm.newPassword !== accountForm.confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    setSaveSuccess('Password updated securely!');
    setAccountForm({ ...accountForm, currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSaveSuccess(''), 3500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Settings</h1>
          <p className="text-xs text-neutral-500 mt-1">
            {isAdmin
              ? 'Manage company identity, billing rules, invoice automation, and account security.'
              : 'Manage your profile details, notification preferences, and login credentials.'}
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-[#F2F4ED] border border-[#788A5B]/30 text-xs font-semibold text-[#788A5B] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#788A5B]" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E8E8]">
        <button
          onClick={() => setActiveTab('account')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'account'
              ? 'border-black text-black'
              : 'border-transparent text-neutral-500 hover:text-black'
          }`}
        >
          <User className="w-4 h-4 text-[#788A5B]" />
          <span>Account Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'notifications'
              ? 'border-black text-black'
              : 'border-transparent text-neutral-500 hover:text-black'
          }`}
        >
          <Bell className="w-4 h-4 text-[#788A5B]" />
          <span>Notification Settings</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => setActiveTab('business')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'business'
                ? 'border-black text-black'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            <Building className="w-4 h-4 text-[#788A5B]" />
            <span>Business Settings</span>
          </button>
        )}
      </div>

      {/* Tab 1: Account Settings */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          {/* Profile Information */}
          <div className="p-6 rounded-2xl bg-white border border-[#E8E8E8] shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E8E8]">
              <div>
                <h3 className="text-sm font-bold text-black">Profile Information</h3>
                <p className="text-xs text-neutral-500">Update your primary identity and contact credentials</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F2F4ED] text-[#788A5B] border border-[#788A5B]/30 uppercase">
                {role}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-black mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={accountForm.name}
                  onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-black mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={accountForm.email}
                  onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-black mb-1.5">Contact Phone</label>
                <input
                  type="text"
                  value={accountForm.phone}
                  onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-black mb-1.5">Assigned Role</label>
                <input
                  type="text"
                  disabled
                  value={role.toUpperCase()}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E8E8] bg-neutral-50 text-neutral-500 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => handleSave('Profile details')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </div>

          {/* Change Password */}
          <div className="p-6 rounded-2xl bg-white border border-[#E8E8E8] shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-[#E8E8E8]">
              <Lock className="w-4 h-4 text-[#788A5B]" />
              <div>
                <h3 className="text-sm font-bold text-black">Change Password</h3>
                <p className="text-xs text-neutral-500">Ensure your account uses a strong Argon2-hashed password</p>
              </div>
            </div>

            <form onSubmit={handlePasswordUpdate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-black mb-1.5">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={accountForm.currentPassword}
                  onChange={(e) => setAccountForm({ ...accountForm, currentPassword: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-black mb-1.5">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Min 8 characters"
                  value={accountForm.newPassword}
                  onChange={(e) => setAccountForm({ ...accountForm, newPassword: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-black mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={accountForm.confirmPassword}
                  onChange={(e) => setAccountForm({ ...accountForm, confirmPassword: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>

              <div className="sm:col-span-3 flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="p-6 rounded-2xl bg-white border border-[#E8E8E8] shadow-xs space-y-6">
          <div className="pb-4 border-b border-[#E8E8E8]">
            <h3 className="text-sm font-bold text-black">Notification Preferences</h3>
            <p className="text-xs text-neutral-500">Configure automated delivery rules and customer billing notices</p>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-xl border border-[#E8E8E8] hover:bg-neutral-50/50 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#788A5B] mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-black block">Email Notifications</span>
                  <span className="text-[11px] text-neutral-500 block">
                    Receive email digests of account changes and system notices.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailNotifications}
                onChange={() => setNotifications({ ...notifications, emailNotifications: !notifications.emailNotifications })}
                className="w-4 h-4 rounded border-[#E8E8E8] text-[#788A5B] focus:ring-[#788A5B]"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-[#E8E8E8] hover:bg-neutral-50/50 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-[#788A5B] mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-black block">Invoice Reminders</span>
                  <span className="text-[11px] text-neutral-500 block">
                    Send automated payment reminders 3 days before and 2 days after invoice due dates.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.invoiceReminders}
                onChange={() => setNotifications({ ...notifications, invoiceReminders: !notifications.invoiceReminders })}
                className="w-4 h-4 rounded border-[#E8E8E8] text-[#788A5B] focus:ring-[#788A5B]"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-[#E8E8E8] hover:bg-neutral-50/50 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <Bell className="w-4 h-4 text-[#788A5B] mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-black block">Renewal Reminders</span>
                  <span className="text-[11px] text-neutral-500 block">
                    Notify 7 days prior to subscription renewal date to prevent unexpected billing.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.renewalReminders}
                onChange={() => setNotifications({ ...notifications, renewalReminders: !notifications.renewalReminders })}
                className="w-4 h-4 rounded border-[#E8E8E8] text-[#788A5B] focus:ring-[#788A5B]"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-[#E8E8E8] hover:bg-neutral-50/50 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <CreditCard className="w-4 h-4 text-[#788A5B] mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-black block">Payment Notifications</span>
                  <span className="text-[11px] text-neutral-500 block">
                    Instant confirmation emails with receipts upon successful payment settlement.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.paymentNotifications}
                onChange={() => setNotifications({ ...notifications, paymentNotifications: !notifications.paymentNotifications })}
                className="w-4 h-4 rounded border-[#E8E8E8] text-[#788A5B] focus:ring-[#788A5B]"
              />
            </label>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="button"
              onClick={() => handleSave('Notification preferences')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Notification Preferences</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Business Settings (Admin Only) */}
      {isAdmin && activeTab === 'business' && (
        <div className="p-6 rounded-2xl bg-white border border-[#E8E8E8] shadow-xs space-y-6">
          <div className="pb-4 border-b border-[#E8E8E8] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-black">Enterprise Business Profile & Invoicing</h3>
              <p className="text-xs text-neutral-500">Legal entity details, currency formats, and automated invoice sequencing</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F2F4ED] text-[#788A5B] border border-[#788A5B]/20">
              Admin Restricted
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-black mb-1.5">Business Name</label>
              <input
                type="text"
                value={businessSettings.businessName}
                onChange={(e) => setBusinessSettings({ ...businessSettings, businessName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
              />
            </div>

            <div>
              <label className="block font-semibold text-black mb-1.5">Business Contact Email</label>
              <input
                type="email"
                value={businessSettings.businessEmail}
                onChange={(e) => setBusinessSettings({ ...businessSettings, businessEmail: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-black mb-1.5">Registered Business Address</label>
              <input
                type="text"
                value={businessSettings.businessAddress}
                onChange={(e) => setBusinessSettings({ ...businessSettings, businessAddress: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
              />
            </div>

            <div>
              <label className="block font-semibold text-black mb-1.5">System Currency</label>
              <select
                value={businessSettings.currency}
                onChange={(e) => setBusinessSettings({ ...businessSettings, currency: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8E8E8] bg-white focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
              >
                <option value="USD ($)">USD ($) - United States Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
                <option value="INR (₹)">INR (₹) - Indian Rupee</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-black mb-1.5">Default Payment Terms</label>
              <select
                value={businessSettings.defaultPaymentTerms}
                onChange={(e) => setBusinessSettings({ ...businessSettings, defaultPaymentTerms: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8E8E8] bg-white focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
              >
                <option value="Due on Receipt">Due on Receipt</option>
                <option value="Net 15 Days">Net 15 Days</option>
                <option value="Net 30 Days">Net 30 Days</option>
                <option value="Net 60 Days">Net 60 Days</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-black mb-1.5">Invoice Number Prefix</label>
              <input
                type="text"
                value={businessSettings.invoicePrefix}
                onChange={(e) => setBusinessSettings({ ...businessSettings, invoicePrefix: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
              />
            </div>

            <div>
              <label className="block font-semibold text-black mb-1.5">Next Sequence Number</label>
              <input
                type="text"
                value={businessSettings.nextInvoiceNumber}
                onChange={(e) => setBusinessSettings({ ...businessSettings, nextInvoiceNumber: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-black mb-1.5">Tax Registration / VAT ID</label>
              <input
                type="text"
                value={businessSettings.taxNumber}
                onChange={(e) => setBusinessSettings({ ...businessSettings, taxNumber: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-black mb-1.5">Default Invoice Footer Notice</label>
              <textarea
                rows={2}
                value={businessSettings.invoiceFooterNote}
                onChange={(e) => setBusinessSettings({ ...businessSettings, invoiceFooterNote: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="button"
              onClick={() => handleSave('Business and invoice configuration')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Enterprise Business Settings</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
