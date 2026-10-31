import React, { useState } from 'react';
import CardLayout from './CardLayout';
import { Plus, MoreVertical, RefreshCw, Clock } from 'lucide-react';

export default function SubscriptionManagementPanel() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const stats = [
    { label: 'Active Subscriptions', value: '892', change: '84% of total' },
    { label: 'Upcoming Renewals', value: '18', change: 'Due in 7d' },
    { label: 'Paused Accounts', value: '125', change: '14%' },
    { label: 'Trial Subscriptions', value: '44', change: 'In progress' },
  ];

  const subscriptions = [
    {
      id: 'SUB-2041',
      customer: 'PQR Ltd',
      plan: 'Standard Monthly',
      rate: '$89.00 / mo',
      startDate: '03-Nov-2025',
      nextRenewal: '03-Nov-2026',
      status: 'Upcoming Renewal',
    },
    {
      id: 'SUB-2040',
      customer: 'ABC Ltd',
      plan: 'Enterprise Yearly',
      rate: '$3,600.00 / yr',
      startDate: '15-Nov-2025',
      nextRenewal: '15-Nov-2026',
      status: 'Active',
    },
    {
      id: 'SUB-2039',
      customer: 'XYZ Ltd',
      plan: 'Pro Monthly',
      rate: '$149.00 / mo',
      startDate: '08-Oct-2026',
      nextRenewal: '08-Nov-2026',
      status: 'Active',
    },
    {
      id: 'SUB-2038',
      customer: 'Horizon AI Labs',
      plan: 'Enterprise Quarterly',
      rate: '$1,200.00 / qtr',
      startDate: '27-Aug-2026',
      nextRenewal: '27-Nov-2026',
      status: 'Active',
    },
    {
      id: 'SUB-2037',
      customer: 'Nexus Cloud Systems',
      plan: 'Pro Monthly',
      rate: '$149.00 / mo',
      startDate: '29-Sep-2026',
      nextRenewal: '29-Oct-2026',
      status: 'Paused',
    },
  ];

  const filtered = subscriptions.filter((s) => {
    const matchesSearch =
      s.customer.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.plan.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || s.status.toLowerCase().includes(filter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <CardLayout
      title="Subscription Management"
      description="Monitor active recurring lifecycles, manage renewal dates, process plan changes, and prevent churn."
      stats={stats}
      primaryAction={{
        label: 'New Subscription',
        icon: <Plus className="w-3.5 h-3.5" />,
        onClick: () => alert('Create subscription modal'),
      }}
      secondaryAction={{
        label: 'Export Subscriptions',
        onClick: () => alert('Exporting subscriptions...'),
      }}
      searchPlaceholder="Search subscriptions by customer or ID..."
      searchValue={search}
      onSearchChange={(e) => setSearch(e.target.value)}
      filterOptions={['All', 'Active', 'Upcoming Renewal', 'Paused']}
      activeFilter={filter}
      onFilterChange={setFilter}
      columns={['Subscription ID', 'Customer Account', 'Plan Details', 'Billing Cadence', 'Next Renewal', 'Status']}
      data={filtered}
      renderRow={(sub, idx) => (
        <tr key={idx} className="hover:bg-neutral-50/70 transition-colors">
          <td className="py-3.5 px-4 font-mono font-medium text-black">{sub.id}</td>
          <td className="py-3.5 px-4 font-semibold text-black">{sub.customer}</td>
          <td className="py-3.5 px-4 text-neutral-600">{sub.plan}</td>
          <td className="py-3.5 px-4 font-medium text-neutral-700">{sub.rate}</td>
          <td className="py-3.5 px-4 text-neutral-600">{sub.nextRenewal}</td>
          <td className="py-3.5 px-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                sub.status === 'Active'
                  ? 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]'
                  : sub.status === 'Upcoming Renewal'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {sub.status}
            </span>
          </td>
          <td className="py-3.5 px-4 text-right">
            <button className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </td>
        </tr>
      )}
      footerText={`Showing ${filtered.length} of ${subscriptions.length} subscriptions`}
    />
  );
}
