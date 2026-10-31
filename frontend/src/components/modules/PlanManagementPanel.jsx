import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Lock,
  X,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { authService } from '../../api';

export default function PlanManagementPanel({ userRole: propRole }) {
  const currentUser = authService.getUser() || { role: 'admin' };
  const role = propRole || currentUser.role || 'admin';
  const isAdmin = role === 'admin';

  const [search, setSearch] = useState('');
  const [intervalFilter, setIntervalFilter] = useState('All');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const [plans, setPlans] = useState([
    {
      id: 'PLN-001',
      name: 'Starter Cloud Monthly',
      product: 'Brightloop Core Platform',
      price: '$49.00',
      interval: 'Monthly',
      availability: 'Public / All Customers',
      status: 'Active',
      trialPeriod: '14 Days',
      features: ['Up to 3 Users', 'Standard Storage (10 GB)', 'Community Support', 'Basic Metrics']
    },
    {
      id: 'PLN-002',
      name: 'Professional Team Monthly',
      product: 'Brightloop Core Platform',
      price: '$149.00',
      interval: 'Monthly',
      availability: 'Public / All Customers',
      status: 'Active',
      trialPeriod: '14 Days',
      features: ['Up to 15 Users', 'High-Speed Storage (100 GB)', 'Priority Email Support', 'Custom Webhooks']
    },
    {
      id: 'PLN-003',
      name: 'Professional Team Annual',
      product: 'Brightloop Core Platform',
      price: '$1,490.00',
      interval: 'Yearly',
      availability: 'Public / 2 Months Free',
      status: 'Active',
      trialPeriod: '14 Days',
      features: ['Up to 15 Users', 'High-Speed Storage (100 GB)', 'Annual Discount Applied', 'Dedicated Onboarding']
    },
    {
      id: 'PLN-004',
      name: 'Enterprise Dedicated Suite',
      product: 'Enterprise Dedicated Server Instance',
      price: '$3,600.00',
      interval: 'Yearly',
      availability: 'Restricted / Sales Approved',
      status: 'Active',
      trialPeriod: '30 Days SLA',
      features: ['Unlimited Users', 'Dedicated DB Node', '24/7 Phone SLA Support', 'SOC-2 Compliance Reports']
    },
    {
      id: 'PLN-005',
      name: 'Legacy v1 Basic Tier',
      product: 'Brightloop Core Platform',
      price: '$29.00',
      interval: 'Monthly',
      availability: 'Grandfathered Only',
      status: 'Inactive',
      trialPeriod: 'None',
      features: ['Single User Only', 'Retiring on Nov 15, 2026']
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    product: 'Brightloop Core Platform',
    price: '',
    interval: 'Monthly',
    availability: 'Public / All Customers'
  });

  const filteredPlans = plans.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.product.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchesInterval =
      intervalFilter === 'All' || p.interval.toLowerCase() === intervalFilter.toLowerCase();
    return matchesSearch && matchesInterval;
  });

  const handleCreatePlan = (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    const newPlan = {
      id: `PLN-00${plans.length + 1}`,
      name: formData.name,
      product: formData.product,
      price: formData.price.startsWith('$') ? formData.price : `$${formData.price}`,
      interval: formData.interval,
      availability: formData.availability,
      status: 'Active',
      trialPeriod: '14 Days',
      features: ['Custom feature allocation']
    };
    setPlans([newPlan, ...plans]);
    setFormData({ name: '', product: 'Brightloop Core Platform', price: '', interval: 'Monthly', availability: 'Public' });
    setCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#788A5B]">Subscription Engine</span>
            <span className="text-neutral-300">•</span>
            {isAdmin ? (
              <span className="text-xs font-medium text-neutral-500">Plan Architecture</span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F2F4ED] text-[#788A5B]">
                <Lock className="w-3 h-3" /> Staff View Only
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Subscription Plans</h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
            {isAdmin
              ? 'Configure recurring cadence intervals, pricing tiers, public availability, and plan allocations.'
              : 'View authorized recurring subscription plans and customer pricing schedules.'}
          </p>
        </div>

        {/* 6. Create Plan Button (Admin only) */}
        {isAdmin && (
          <button
            onClick={() => setCreateOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-[#788A5B]" />
            Create Plan
          </button>
        )}
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden">
        {/* 2 & 3. Search and Interval Filter */}
        <div className="p-4 border-b border-[#E8E8E8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#F2F4ED]/30">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search plan by name or product..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs text-black placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-600">Interval:</span>
            <select
              value={intervalFilter}
              onChange={(e) => setIntervalFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs font-medium text-black focus:outline-none cursor-pointer"
            >
              <option value="All">All Intervals</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
        </div>

        {/* 4. Plan Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
              <tr>
                <th className="py-3 px-4">Plan ID</th>
                <th className="py-3 px-4">Plan Name</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Billing Interval</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-black">{plan.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-black">{plan.name}</td>
                  <td className="py-3.5 px-4 text-neutral-600">{plan.product}</td>
                  <td className="py-3.5 px-4 font-bold text-black">{plan.price}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8]">
                      {plan.interval}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600">{plan.availability}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        plan.status === 'Active'
                          ? 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                      }`}
                    >
                      {plan.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    <button
                      onClick={() => {
                        setSelectedPlan(plan);
                        setDetailsOpen(true);
                      }}
                      className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setSelectedPlan(plan);
                          setEditOpen(true);
                        }}
                        className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                        title="Edit Plan"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5 & 8. Plan Details & Availability Dialog */}
      {detailsOpen && selectedPlan && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">{selectedPlan.name}</h3>
              <button onClick={() => setDetailsOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-50 border border-[#E8E8E8]">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">Recurring Rate</span>
                  <p className="text-lg font-bold text-black">{selectedPlan.price}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">Billing Cadence</span>
                  <p className="text-xs font-semibold text-[#788A5B]">{selectedPlan.interval}</p>
                </div>
              </div>

              <div>
                <span className="text-neutral-400 block">Associated Product</span>
                <span className="font-semibold text-black">{selectedPlan.product}</span>
              </div>

              {/* 8. Plan Availability Information */}
              <div>
                <span className="text-neutral-400 block">Market Availability Rule</span>
                <p className="text-neutral-700 bg-[#F2F4ED]/50 p-2.5 rounded-xl border border-[#E8E8E8] mt-1 font-medium">
                  {selectedPlan.availability}
                </p>
              </div>

              <div>
                <span className="text-neutral-400 block mb-1">Entitled Features</span>
                <ul className="space-y-1">
                  {selectedPlan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-neutral-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#788A5B] shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-3 border-t border-[#E8E8E8] flex justify-end">
              <button
                onClick={() => setDetailsOpen(false)}
                className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Edit Plan Dialog (Admin only) */}
      {editOpen && selectedPlan && isAdmin && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">Edit Plan Parameters</h3>
              <button onClick={() => setEditOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEditOpen(false);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Plan Name</label>
                <input
                  type="text"
                  defaultValue={selectedPlan.name}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Recurring Price</label>
                  <input
                    type="text"
                    defaultValue={selectedPlan.price}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Interval</label>
                  <select
                    defaultValue={selectedPlan.interval}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Availability</label>
                <input
                  type="text"
                  defaultValue={selectedPlan.availability}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div className="mt-5 pt-3 border-t border-[#E8E8E8] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#E8E8E8] text-neutral-600 hover:text-black"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-black text-white font-semibold hover:bg-neutral-800">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Plan Dialog (Admin only) */}
      {createOpen && isAdmin && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">Create Subscription Plan</h3>
              <button onClick={() => setCreateOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreatePlan} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Plan Title *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Enterprise Scale Annual"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Product</label>
                <input
                  type="text"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Price *</label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="$299.00"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Cadence</label>
                  <select
                    value={formData.interval}
                    onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Availability Rule</label>
                <input
                  type="text"
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  placeholder="Public / All Customers"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div className="mt-5 pt-3 border-t border-[#E8E8E8] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#E8E8E8] text-neutral-600 hover:text-black"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-black text-white font-semibold hover:bg-neutral-800">
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
