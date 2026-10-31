import React, { useState } from 'react';
import CardLayout from './CardLayout';
import { Save, Bell, Shield, User, Sliders } from 'lucide-react';

export default function SettingsPanel() {
  const [settings, setSettings] = useState({
    emailAlerts: true,
    renewalReminders: true,
    taskDigest: true,
    defaultQueueView: 'pending',
    itemsPerPage: '10',
    notifyQuotationsExpiry: true,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <CardLayout
      title="Settings"
      description="Configure your staff workspace preferences, notification rules for pending operations, and task queue defaults."
      primaryAction={{
        label: 'Save Changes',
        icon: <Save className="w-3.5 h-3.5" />,
        onClick: handleSave,
      }}
    >
      <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs p-6 divide-y divide-[#E8E8E8]">
        {savedSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-[#F2F4ED] border border-[#788A5B]/30 text-xs font-semibold text-[#788A5B] flex items-center justify-between">
            <span>Staff preferences successfully saved!</span>
          </div>
        )}

        {/* Section 1: Operational Notifications */}
        <div className="pb-6 space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#788A5B]" />
            <h3 className="text-sm font-bold text-black">Operational Alerts & Notifications</h3>
          </div>
          <p className="text-xs text-neutral-500">
            Choose what operational alerts trigger push notifications and daily task digest emails.
          </p>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3.5 rounded-xl border border-[#E8E8E8] hover:bg-neutral-50/50 transition-colors cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-black block">Upcoming Subscription Renewals</span>
                <span className="text-[11px] text-neutral-500 block">Alert 7 days prior to customer subscription renewal date</span>
              </div>
              <input
                type="checkbox"
                checked={settings.renewalReminders}
                onChange={() => handleToggle('renewalReminders')}
                className="w-4 h-4 rounded border-[#E8E8E8] text-[#788A5B] focus:ring-[#788A5B]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl border border-[#E8E8E8] hover:bg-neutral-50/50 transition-colors cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-black block">Quotation Expiry Warnings</span>
                <span className="text-[11px] text-neutral-500 block">Alert when customer quotations are within 48 hours of expiration</span>
              </div>
              <input
                type="checkbox"
                checked={settings.notifyQuotationsExpiry}
                onChange={() => handleToggle('notifyQuotationsExpiry')}
                className="w-4 h-4 rounded border-[#E8E8E8] text-[#788A5B] focus:ring-[#788A5B]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl border border-[#E8E8E8] hover:bg-neutral-50/50 transition-colors cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-black block">Unpaid & Overdue Invoices Alert</span>
                <span className="text-[11px] text-neutral-500 block">Notify immediately when an invoice enters overdue status</span>
              </div>
              <input
                type="checkbox"
                checked={settings.emailAlerts}
                onChange={() => handleToggle('emailAlerts')}
                className="w-4 h-4 rounded border-[#E8E8E8] text-[#788A5B] focus:ring-[#788A5B]"
              />
            </label>
          </div>
        </div>

        {/* Section 2: Workspace View Preferences */}
        <div className="py-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#788A5B]" />
            <h3 className="text-sm font-bold text-black">Workspace Display Preferences</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-black mb-1.5">
                Default Dashboard Task Filter
              </label>
              <select
                value={settings.defaultQueueView}
                onChange={(e) => setSettings({ ...settings, defaultQueueView: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] bg-white text-xs text-black focus:outline-none focus:ring-1 focus:ring-[#788A5B] focus:border-[#788A5B]"
              >
                <option value="pending">Pending Work Only (Recommended for Staff)</option>
                <option value="all">All Operational Tasks</option>
                <option value="upcoming">Upcoming Renewals & Invoices</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-black mb-1.5">
                Records per Table Page
              </label>
              <select
                value={settings.itemsPerPage}
                onChange={(e) => setSettings({ ...settings, itemsPerPage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] bg-white text-xs text-black focus:outline-none focus:ring-1 focus:ring-[#788A5B] focus:border-[#788A5B]"
              >
                <option value="10">10 records per page</option>
                <option value="25">25 records per page</option>
                <option value="50">50 records per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Staff Profile Summary */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#788A5B]" />
            <h3 className="text-sm font-bold text-black">Staff Account Role</h3>
          </div>
          <div className="p-4 rounded-xl border border-[#E8E8E8] bg-[#F2F4ED]/40 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-black">Operational Staff Role</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Assigned permissions: Full management of customers, quotations, subscriptions, invoices, and payments. View-only access to products and plans.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white text-[#788A5B] border border-[#E8E8E8]">
              Staff
            </span>
          </div>
        </div>
      </div>
    </CardLayout>
  );
}
