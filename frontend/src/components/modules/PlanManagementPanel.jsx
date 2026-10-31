import React, { useState } from 'react';
import CardLayout from './CardLayout';
import { Layers, Eye, Check } from 'lucide-react';

export default function PlanManagementPanel({ isReadOnly = true }) {
  const [search, setSearch] = useState('');

  const stats = [
    { label: 'Standard Plans', value: '6', change: 'Catalog' },
    { label: 'Average Price', value: '$240/mo', change: 'Blended' },
    { label: 'Annual Discount', value: '20%', change: 'Active' },
    { label: 'Free Trial', value: '14 Days', change: 'Default' },
  ];

  const plans = [
    {
      code: 'PLN-START',
      name: 'Starter Tier',
      interval: 'Monthly',
      price: '$49.00 / month',
      seats: 'Up to 5 Users',
      status: 'Active',
    },
    {
      code: 'PLN-PRO',
      name: 'Professional Tier',
      interval: 'Monthly',
      price: '$149.00 / month',
      seats: 'Up to 25 Users',
      status: 'Active',
    },
    {
      code: 'PLN-ENT-ANN',
      name: 'Enterprise Annual',
      interval: 'Yearly',
      price: '$1,490.00 / year',
      seats: 'Unlimited Seats',
      status: 'Active',
    },
    {
      code: 'PLN-PARTNER',
      name: 'Custom Partner Tier',
      interval: 'Yearly',
      price: '$3,600.00 / year',
      seats: 'Multi-Tenant Orgs',
      status: 'Active',
    },
    {
      code: 'PLN-LEGACY',
      name: 'Legacy Starter v1',
      interval: 'Monthly',
      price: '$39.00 / month',
      seats: 'Up to 3 Users',
      status: 'Sunset Pending',
    },
  ];

  const filtered = plans.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CardLayout
      title="Subscription Plans"
      description="Pricing models, recurring billing cadences, usage tiers, and seat allocations (Staff View-Only Access)."
      isReadOnly={isReadOnly}
      badgeText="View Only"
      stats={stats}
      secondaryAction={{
        label: 'Export Plans',
        onClick: () => alert('Exporting plans list...'),
      }}
      searchPlaceholder="Search plans by name or code..."
      searchValue={search}
      onSearchChange={(e) => setSearch(e.target.value)}
      columns={['Plan Code', 'Plan Name', 'Billing Interval', 'Price Rate', 'Quota / Limits', 'Status']}
      data={filtered}
      renderRow={(plan, idx) => (
        <tr key={idx} className="hover:bg-neutral-50/70 transition-colors">
          <td className="py-3.5 px-4 font-mono font-medium text-black">{plan.code}</td>
          <td className="py-3.5 px-4 font-semibold text-black">{plan.name}</td>
          <td className="py-3.5 px-4 text-neutral-600">{plan.interval}</td>
          <td className="py-3.5 px-4 font-semibold text-black">{plan.price}</td>
          <td className="py-3.5 px-4 text-neutral-600">{plan.seats}</td>
          <td className="py-3.5 px-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                plan.status === 'Active'
                  ? 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {plan.status}
            </span>
          </td>
          <td className="py-3.5 px-4 text-right">
            <button
              onClick={() => alert(`Viewing details for ${plan.name}`)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
              title="View Plan Details"
            >
              <Eye className="w-4 h-4" />
            </button>
          </td>
        </tr>
      )}
      footerText={`Showing ${filtered.length} of ${plans.length} subscription plans`}
    />
  );
}
