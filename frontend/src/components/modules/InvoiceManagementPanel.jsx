import React, { useState } from 'react';
import CardLayout from './CardLayout';
import { Plus, MoreVertical, Receipt, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function InvoiceManagementPanel() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const stats = [
    { label: 'Pending Invoices', value: '14', change: 'Requires review' },
    { label: 'Overdue Invoices', value: '5', change: 'Action needed' },
    { label: 'Total Pending', value: '$6,450', change: 'Awaiting' },
    { label: 'Cleared Today', value: '28', change: '100% On-time' },
  ];

  const invoices = [
    {
      id: 'INV-2026-092',
      customer: 'ABC Ltd',
      issueDate: '18-Oct-2026',
      dueDate: '01-Nov-2026',
      amount: '$2,450.00',
      status: 'Pending',
    },
    {
      id: 'INV-2026-091',
      customer: 'BlueSky Digital LLC',
      issueDate: '01-Oct-2026',
      dueDate: '15-Oct-2026',
      amount: '$1,820.00',
      status: 'Overdue',
    },
    {
      id: 'INV-2026-090',
      customer: 'Nexus Cloud Systems',
      issueDate: '20-Oct-2026',
      dueDate: '04-Nov-2026',
      amount: '$450.00',
      status: 'Pending',
    },
    {
      id: 'INV-2026-089',
      customer: 'Acme Technologies Inc.',
      issueDate: '15-Oct-2026',
      dueDate: '30-Oct-2026',
      amount: '$3,600.00',
      status: 'Paid',
    },
    {
      id: 'INV-2026-088',
      customer: 'Cloudflow Networks',
      issueDate: '14-Oct-2026',
      dueDate: '28-Oct-2026',
      amount: '$890.00',
      status: 'Paid',
    },
  ];

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.customer.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || inv.status.toLowerCase().includes(filter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <CardLayout
      title="Invoice Management"
      description="Track customer invoices, review outstanding balances, issue payment reminders, and record collections."
      stats={stats}
      primaryAction={{
        label: 'Create Invoice',
        icon: <Plus className="w-3.5 h-3.5" />,
        onClick: () => alert('New Invoice Modal'),
      }}
      secondaryAction={{
        label: 'Export Invoices',
        onClick: () => alert('Exporting invoice records...'),
      }}
      searchPlaceholder="Search invoices by customer or invoice number..."
      searchValue={search}
      onSearchChange={(e) => setSearch(e.target.value)}
      filterOptions={['All', 'Pending', 'Overdue', 'Paid']}
      activeFilter={filter}
      onFilterChange={setFilter}
      columns={['Invoice Number', 'Customer Account', 'Issue Date', 'Due Date', 'Invoice Total', 'Payment Status']}
      data={filtered}
      renderRow={(inv, idx) => (
        <tr key={idx} className="hover:bg-neutral-50/70 transition-colors">
          <td className="py-3.5 px-4 font-mono font-medium text-black">{inv.id}</td>
          <td className="py-3.5 px-4 font-semibold text-black">{inv.customer}</td>
          <td className="py-3.5 px-4 text-neutral-600">{inv.issueDate}</td>
          <td className="py-3.5 px-4 text-neutral-600">{inv.dueDate}</td>
          <td className="py-3.5 px-4 font-semibold text-black">{inv.amount}</td>
          <td className="py-3.5 px-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                inv.status === 'Paid'
                  ? 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]'
                  : inv.status === 'Overdue'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {inv.status}
            </span>
          </td>
          <td className="py-3.5 px-4 text-right">
            <button className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </td>
        </tr>
      )}
      footerText={`Showing ${filtered.length} of ${invoices.length} invoices`}
    />
  );
}
