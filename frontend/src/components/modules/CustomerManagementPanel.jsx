import React, { useState, useEffect } from 'react';
import CardLayout from './CardLayout';
import { Plus, MoreVertical, Mail, X } from 'lucide-react';
import { customerService } from '../../api';

export default function CustomerManagementPanel() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    tier: 'Enterprise Tier',
    mrr: '$450.00'
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAll({ search });
      setCustomers(data || []);
    } catch (err) {
      console.error('Failed to fetch customers from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await customerService.create(form);
      setModalOpen(false);
      setForm({ name: '', contact_person: '', email: '', phone: '', tier: 'Enterprise Tier', mrr: '$450.00' });
      await fetchCustomers();
    } catch (err) {
      alert('Failed to register customer: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const activeCount = customers.filter((c) => c.status === 'Active').length;
  const inactiveCount = customers.length - activeCount;

  const stats = [
    { label: 'Total Accounts', value: String(customers.length), change: 'In database' },
    { label: 'Active Customers', value: String(activeCount), change: `${customers.length > 0 ? Math.round((activeCount / customers.length) * 100) : 100}% live` },
    { label: 'Pending / Inactive', value: String(inactiveCount), change: inactiveCount > 0 ? 'Review status' : 'All clear' },
    { label: 'Database Health', value: '100%', change: 'PostgreSQL Live' },
  ];

  const filteredData = customers.filter((c) => {
    const matchesFilter = filter === 'All' || c.status.toLowerCase().includes(filter.toLowerCase());
    return matchesFilter;
  });

  return (
    <>
      <CardLayout
        title="Customer Management"
        description="Manage customer accounts, billing profiles, assigned plans, and contact records stored in PostgreSQL."
        stats={stats}
        primaryAction={{
          label: 'New Customer',
          icon: <Plus className="w-3.5 h-3.5" />,
          onClick: () => setModalOpen(true),
        }}
        searchPlaceholder="Search customers by name, ID, or email..."
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        filterOptions={['All', 'Active', 'Inactive']}
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
        footerText={`Showing ${filteredData.length} of ${customers.length} customer records in database`}
      />

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">Register New Customer</h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Company / Organization Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Acme Innovations Corp"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] text-xs focus:outline-none focus:border-[#788A5B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  required
                  value={form.contact_person}
                  onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
                  placeholder="e.g. Alice Miller"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] text-xs focus:outline-none focus:border-[#788A5B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="billing@company.com"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] text-xs focus:outline-none focus:border-[#788A5B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 (555) 019-2834"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] text-xs focus:outline-none focus:border-[#788A5B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Assigned Tier</label>
                <select
                  value={form.tier}
                  onChange={(e) => setForm({ ...form, tier: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] text-xs focus:outline-none focus:border-[#788A5B] bg-white"
                >
                  <option value="Starter Tier">Starter Tier</option>
                  <option value="Pro Tier">Pro Tier</option>
                  <option value="Enterprise Tier">Enterprise Tier</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#E8E8E8] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-2 rounded-xl border border-[#E8E8E8] text-xs font-semibold text-neutral-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
                >
                  {submitting ? 'Saving...' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
