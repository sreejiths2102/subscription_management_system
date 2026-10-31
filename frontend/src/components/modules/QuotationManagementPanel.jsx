import React, { useState } from 'react';
import CardLayout from './CardLayout';
import { Plus, MoreVertical, FileText, CheckCircle2, Clock } from 'lucide-react';

export default function QuotationManagementPanel() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const stats = [
    { label: 'Pending Quotations', value: '18', change: 'Action Needed' },
    { label: 'Quoted Pipeline Value', value: '$84,500', change: 'Total' },
    { label: 'Expiring in 48h', value: '4', change: 'Urgent' },
    { label: 'Conversion Rate', value: '72%', change: '+3.4%' },
  ];

  const quotations = [
    {
      id: 'QT-2026-042',
      customer: 'XYZ Ltd',
      contact: 'Elena Rostova',
      plan: 'Enterprise Suite (50 Seats)',
      amount: '$18,400.00',
      dueDate: '02-Nov-2026',
      status: 'Pending Review',
    },
    {
      id: 'QT-2026-041',
      customer: 'ABC Ltd',
      contact: 'David Miller',
      plan: 'Pro Annual Custom Tier',
      amount: '$8,900.00',
      dueDate: '05-Nov-2026',
      status: 'Pending',
    },
    {
      id: 'QT-2026-040',
      customer: 'Global Fintech Ltd',
      contact: 'Marcus Vance',
      plan: 'Custom Infrastructure Tier',
      amount: '$32,000.00',
      dueDate: '10-Nov-2026',
      status: 'Approved',
    },
    {
      id: 'QT-2026-039',
      customer: 'Summit Health Corp',
      contact: 'Clara Oswald',
      plan: 'Team Healthcare Plan',
      amount: '$12,500.00',
      dueDate: '01-Nov-2026',
      status: 'Expiring Soon',
    },
    {
      id: 'QT-2026-038',
      customer: 'Orion Robotics Inc',
      contact: 'Tariq Hassan',
      plan: 'Robotics Cloud Tier',
      amount: '$24,000.00',
      dueDate: '28-Oct-2026',
      status: 'Closed',
    },
  ];

  const filtered = quotations.filter((q) => {
    const matchesSearch =
      q.customer.toLowerCase().includes(search.toLowerCase()) ||
      q.id.toLowerCase().includes(search.toLowerCase()) ||
      q.plan.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || q.status.toLowerCase().includes(filter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <CardLayout
      title="Quotation Management"
      description="Draft, review, approve, and send customized enterprise price proposals and estimates."
      stats={stats}
      primaryAction={{
        label: 'New Quotation',
        icon: <Plus className="w-3.5 h-3.5" />,
        onClick: () => alert('Create new quotation modal'),
      }}
      secondaryAction={{
        label: 'Export Quotes',
        onClick: () => alert('Exporting quotations...'),
      }}
      searchPlaceholder="Search quotations by customer, quote ID, or plan..."
      searchValue={search}
      onSearchChange={(e) => setSearch(e.target.value)}
      filterOptions={['All', 'Pending', 'Approved']}
      activeFilter={filter}
      onFilterChange={setFilter}
      columns={['Quote Number', 'Customer Account', 'Proposed Plan', 'Proposal Value', 'Expiry Date', 'Status']}
      data={filtered}
      renderRow={(quote, idx) => (
        <tr key={idx} className="hover:bg-neutral-50/70 transition-colors">
          <td className="py-3.5 px-4 font-mono font-medium text-black">{quote.id}</td>
          <td className="py-3.5 px-4">
            <span className="font-semibold text-black block">{quote.customer}</span>
            <span className="text-[11px] text-neutral-400">{quote.contact}</span>
          </td>
          <td className="py-3.5 px-4 text-neutral-600">{quote.plan}</td>
          <td className="py-3.5 px-4 font-semibold text-black">{quote.amount}</td>
          <td className="py-3.5 px-4 text-neutral-600">{quote.dueDate}</td>
          <td className="py-3.5 px-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                quote.status === 'Approved'
                  ? 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]'
                  : quote.status === 'Expiring Soon'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : quote.status.includes('Pending')
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-neutral-100 text-neutral-600 border-neutral-300'
              }`}
            >
              {quote.status}
            </span>
          </td>
          <td className="py-3.5 px-4 text-right">
            <button className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </td>
        </tr>
      )}
      footerText={`Showing ${filtered.length} of ${quotations.length} quotations`}
    />
  );
}
