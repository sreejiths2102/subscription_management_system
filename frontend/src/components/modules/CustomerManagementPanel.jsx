import React, { useState } from 'react';
import CardLayout from './CardLayout';
import { Plus, MoreVertical, Mail, Phone } from 'lucide-react';

export default function CustomerManagementPanel() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const stats = [
    { label: 'Total Accounts', value: '1,280', change: '+12 this mo' },
    { label: 'Active Customers', value: '1,164', change: '91% active' },
    { label: 'Pending Verification', value: '32', change: 'Needs action' },
    { label: 'Customer Churn', value: '1.2%', change: 'Low' },
  ];

  const customers = [
    {
      id: 'CUST-3041',
      name: 'ABC Ltd',
      contactPerson: 'David Miller',
      email: 'finance@abcltd.com',
      plan: 'Enterprise Annual',
      mrr: '$3,200',
      status: 'Active',
    },
    {
      id: 'CUST-3040',
      name: 'XYZ Ltd',
      contactPerson: 'Elena Rostova',
      email: 'billing@xyzltd.com',
      plan: 'Pro Monthly',
      mrr: '$450',
      status: 'Active',
    },
    {
      id: 'CUST-3039',
      name: 'PQR Ltd',
      contactPerson: 'Liam Gallagher',
      email: 'ops@pqrltd.com',
      plan: 'Standard Monthly',
      mrr: '$180',
      status: 'Pending Renewal',
    },
    {
      id: 'CUST-3038',
      name: 'Nexus Cloud Systems',
      contactPerson: 'Alex Vance',
      email: 'billing@nexuscloud.io',
      plan: 'Pro Tier',
      mrr: '$450',
      status: 'Active',
    },
    {
      id: 'CUST-3037',
      name: 'Acme Technologies Inc.',
      contactPerson: 'Sarah Connor',
      email: 'contact@acme.com',
      plan: 'Enterprise Tier',
      mrr: '$3,600',
      status: 'Active',
    },
    {
      id: 'CUST-3036',
      name: 'Horizon AI Labs',
      contactPerson: 'Chen Wei',
      email: 'ops@horizonlabs.ai',
      plan: 'Enterprise Tier',
      mrr: '$2,400',
      status: 'Active',
    },
  ];

  const filteredData = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || c.status.toLowerCase().includes(filter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <CardLayout
      title="Customer Management"
      description="Manage customer accounts, billing details, subscriptions, and communication records."
      stats={stats}
      primaryAction={{
        label: 'New Customer',
        icon: <Plus className="w-3.5 h-3.5" />,
        onClick: () => alert('New Customer Registration Modal'),
      }}
      secondaryAction={{
        label: 'Export CSV',
        onClick: () => alert('Exporting customer records...'),
      }}
      searchPlaceholder="Search customers by name, ID, or email..."
      searchValue={search}
      onSearchChange={(e) => setSearch(e.target.value)}
      filterOptions={['All', 'Active', 'Pending']}
      activeFilter={filter}
      onFilterChange={setFilter}
      columns={['Customer ID', 'Organization', 'Primary Contact', 'Assigned Plan', 'MRR Value', 'Status']}
      data={filteredData}
      renderRow={(cust, idx) => (
        <tr key={idx} className="hover:bg-neutral-50/70 transition-colors">
          <td className="py-3.5 px-4 font-mono font-medium text-black">{cust.id}</td>
          <td className="py-3.5 px-4">
            <span className="font-semibold text-black block">{cust.name}</span>
            <span className="text-[11px] text-neutral-400">{cust.contactPerson}</span>
          </td>
          <td className="py-3.5 px-4 text-neutral-600">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-neutral-400" />
              <span>{cust.email}</span>
            </div>
          </td>
          <td className="py-3.5 px-4 text-neutral-700 font-medium">{cust.plan}</td>
          <td className="py-3.5 px-4 font-semibold text-black">{cust.mrr}</td>
          <td className="py-3.5 px-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                cust.status === 'Active'
                  ? 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {cust.status}
            </span>
          </td>
          <td className="py-3.5 px-4 text-right">
            <button className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </td>
        </tr>
      )}
      footerText={`Showing ${filteredData.length} of ${customers.length} customer records`}
    />
  );
}

