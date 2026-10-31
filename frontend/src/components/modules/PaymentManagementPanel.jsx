import React, { useState } from 'react';
import CardLayout from './CardLayout';
import { Plus, MoreVertical, CreditCard, CheckCircle2 } from 'lucide-react';

export default function PaymentManagementPanel() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const stats = [
    { label: 'Outstanding Payments', value: '$6,450', change: '14 accounts' },
    { label: 'Processed This Month', value: '$384,120', change: '+18.5%' },
    { label: 'Pending Verification', value: '8', change: 'Staff action' },
    { label: 'Gateway Health', value: '100%', change: 'All active' },
  ];

  const payments = [
    {
      id: 'PAY-8822',
      customer: 'ABC Ltd',
      amount: '$2,450.00',
      date: '31-Oct-2026',
      method: 'Bank Transfer (ACH)',
      status: 'Pending Verification',
    },
    {
      id: 'PAY-8821',
      customer: 'Acme Technologies Inc.',
      amount: '$3,600.00',
      date: '30-Oct-2026',
      method: 'Stripe ACH Transfer',
      status: 'Cleared',
    },
    {
      id: 'PAY-8820',
      customer: 'Nexus Cloud Systems',
      amount: '$450.00',
      date: '29-Oct-2026',
      method: 'Credit Card (Visa ···· 4242)',
      status: 'Cleared',
    },
    {
      id: 'PAY-8819',
      customer: 'Cloudflow Networks',
      amount: '$890.00',
      date: '28-Oct-2026',
      method: 'Credit Card (Mastercard ···· 8812)',
      status: 'Cleared',
    },
    {
      id: 'PAY-8818',
      customer: 'Horizon AI Labs',
      amount: '$1,200.00',
      date: '27-Oct-2026',
      method: 'Direct Wire Settlement',
      status: 'Cleared',
    },
  ];

  const filtered = payments.filter((p) => {
    const matchesSearch =
      p.customer.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.method.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || p.status.toLowerCase().includes(filter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <CardLayout
      title="Payment Management"
      description="Track settled customer transactions, verify pending offline wire transfers, and follow up on outstanding balances."
      stats={stats}
      primaryAction={{
        label: 'Record Payment',
        icon: <Plus className="w-3.5 h-3.5" />,
        onClick: () => alert('Record Manual Payment Modal'),
      }}
      secondaryAction={{
        label: 'Export Ledger',
        onClick: () => alert('Exporting payment ledger...'),
      }}
      searchPlaceholder="Search payments by customer, ID, or payment method..."
      searchValue={search}
      onSearchChange={(e) => setSearch(e.target.value)}
      filterOptions={['All', 'Cleared', 'Pending']}
      activeFilter={filter}
      onFilterChange={setFilter}
      columns={['Payment ID', 'Customer Account', 'Amount Paid', 'Payment Date', 'Payment Method', 'Settlement Status']}
      data={filtered}
      renderRow={(pay, idx) => (
        <tr key={idx} className="hover:bg-neutral-50/70 transition-colors">
          <td className="py-3.5 px-4 font-mono font-medium text-black">{pay.id}</td>
          <td className="py-3.5 px-4 font-semibold text-black">{pay.customer}</td>
          <td className="py-3.5 px-4 font-semibold text-black">{pay.amount}</td>
          <td className="py-3.5 px-4 text-neutral-600">{pay.date}</td>
          <td className="py-3.5 px-4 text-neutral-600">{pay.method}</td>
          <td className="py-3.5 px-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                pay.status === 'Cleared'
                  ? 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {pay.status}
            </span>
          </td>
          <td className="py-3.5 px-4 text-right">
            <button className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </td>
        </tr>
      )}
      footerText={`Showing ${filtered.length} of ${payments.length} transactions`}
    />
  );
}
