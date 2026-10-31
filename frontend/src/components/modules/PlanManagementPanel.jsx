import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Lock,
  X,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Loader2,
  Check
} from 'lucide-react';
import { authService, planService, productService } from '../../api';

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
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [plans, setPlans] = useState([]);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    product_id: '',
    price: '',
    billing_interval: 'monthly',
    min_quantity: 1,
    trial_days: 14,
    allow_pause: true,
    allow_renewal: true,
    allow_closure: true,
    description: 'Full Platform Access, Standard Support, Automated Renewal'
  });

  const [editData, setEditData] = useState({
    name: '',
    price: '',
    billing_interval: 'monthly',
    min_quantity: 1,
    trial_days: 14,
    allow_pause: true,
    allow_renewal: true,
    allow_closure: true,
    is_active: true,
    description: ''
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await planService.getAll({
        search: search.trim() || undefined,
        interval: intervalFilter !== 'All' ? intervalFilter.toLowerCase() : undefined
      });

      const mapped = (data || []).map((p) => {
        const intervalCap = p.billing_interval
          ? p.billing_interval.charAt(0).toUpperCase() + p.billing_interval.slice(1).toLowerCase()
          : 'Monthly';
        const featureList = p.description
          ? p.description.split(',').map((f) => f.trim()).filter(Boolean)
          : ['Full Platform Access', 'Automated Recurring Invoicing', 'Priority Support SLA'];

        return {
          id: p.code || `PLN-00${p.id}`,
          db_id: p.id,
          name: p.name,
          product: p.product_name || 'Brightloop Core Platform',
          product_id: p.product_id,
          price: `$${parseFloat(p.price || 0).toFixed(2)}`,
          rawPrice: parseFloat(p.price || 0),
          interval: intervalCap,
          rawInterval: p.billing_interval || 'monthly',
          availability: p.is_active ? 'Public / All Customers' : 'Restricted / Inactive',
          status: p.is_active ? 'Active' : 'Inactive',
          trialPeriod: `${p.trial_days || 0} Days`,
          trial_days: p.trial_days || 0,
          min_quantity: p.min_quantity || 1,
          allow_pause: p.allow_pause !== false,
          allow_renewal: p.allow_renewal !== false,
          allow_closure: p.allow_closure !== false,
          description: p.description || '',
          features: featureList
        };
      });

      setPlans(mapped);
    } catch (err) {
      console.error('Failed to load plans from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const prods = await productService.getAll();
      setProducts(prods || []);
      if (prods && prods.length > 0 && !formData.product_id) {
        setFormData((prev) => ({ ...prev, product_id: prods[0].id }));
      }
    } catch (err) {
      console.error('Failed to load products for plan association:', err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [search, intervalFilter]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenEdit = (plan) => {
    setSelectedPlan(plan);
    setEditData({
      name: plan.name,
      price: plan.rawPrice.toString(),
      billing_interval: plan.rawInterval.toLowerCase(),
      min_quantity: plan.min_quantity,
      trial_days: plan.trial_days,
      allow_pause: plan.allow_pause,
      allow_renewal: plan.allow_renewal,
      allow_closure: plan.allow_closure,
      is_active: plan.status === 'Active',
      description: plan.description
    });
    setEditOpen(true);
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      setActionLoading(true);
      const codeGen = formData.code.trim() || `PLN-00${plans.length + 1}`;
      const prodId = formData.product_id ? parseInt(formData.product_id, 10) : products[0]?.id || 1;
      const numPrice = parseFloat(formData.price.toString().replace(/[^0-9.]/g, '') || '0');

      await planService.create({
        code: codeGen,
        name: formData.name.trim(),
        product_id: prodId,
        billing_interval: formData.billing_interval.toLowerCase(),
        price: numPrice,
        min_quantity: parseInt(formData.min_quantity, 10) || 1,
        trial_days: parseInt(formData.trial_days, 10) || 0,
        allow_pause: formData.allow_pause,
        allow_renewal: formData.allow_renewal,
        allow_closure: formData.allow_closure,
        description: formData.description.trim(),
        is_active: true
      });

      setCreateOpen(false);
      setFormData({
        code: '',
        name: '',
        product_id: products[0]?.id || '',
        price: '',
        billing_interval: 'monthly',
        min_quantity: 1,
        trial_days: 14,
        allow_pause: true,
        allow_renewal: true,
        allow_closure: true,
        description: 'Full Platform Access, Standard Support, Automated Renewal'
      });
      await fetchPlans();
    } catch (err) {
      alert('Failed to create plan: ' + (err.response?.data?.detail || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    if (!isAdmin || !selectedPlan) return;
    try {
      setActionLoading(true);
      const numPrice = parseFloat(editData.price.toString().replace(/[^0-9.]/g, '') || '0');
      await planService.update(selectedPlan.db_id, {
        name: editData.name.trim(),
        price: numPrice,
        billing_interval: editData.billing_interval.toLowerCase(),
        min_quantity: parseInt(editData.min_quantity, 10) || 1,
        trial_days: parseInt(editData.trial_days, 10) || 0,
        allow_pause: editData.allow_pause,
        allow_renewal: editData.allow_renewal,
        allow_closure: editData.allow_closure,
        is_active: editData.is_active,
        description: editData.description.trim()
      });

      setEditOpen(false);
      await fetchPlans();
    } catch (err) {
      alert('Failed to update plan: ' + (err.response?.data?.detail || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePlan = async (plan) => {
    if (!isAdmin) return;
    if (window.confirm(`Are you sure you want to deactivate plan "${plan.name}" (${plan.id})?`)) {
      try {
        setActionLoading(true);
        await planService.delete(plan.db_id);
        await fetchPlans();
      } catch (err) {
        alert('Failed to delete/deactivate plan: ' + (err.response?.data?.detail || err.message));
      } finally {
        setActionLoading(false);
      }
    }
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
              <span className="text-xs font-medium text-neutral-500">PostgreSQL Plan Architecture</span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F2F4ED] text-[#788A5B]">
                <Lock className="w-3 h-3" /> Staff View Only
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Subscription Plans</h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
            {isAdmin
              ? 'Configure recurring cadence intervals, pricing tiers, availability, and lifecycle permissions directly in the database.'
              : 'View authorized recurring subscription plans and database-backed pricing schedules.'}
          </p>
        </div>

        {/* Create Plan Button (Admin only) */}
        {isAdmin && (
          <button
            onClick={() => setCreateOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#788A5B]" />
            Create Plan
          </button>
        )}
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden">
        {/* Search and Interval Filter */}
        <div className="p-4 border-b border-[#E8E8E8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#F2F4ED]/30">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search plan by code, name, or product..."
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
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
        </div>

        {/* Plan Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-xs text-neutral-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#788A5B]" />
              <span>Loading subscription plans from PostgreSQL database...</span>
            </div>
          ) : plans.length === 0 ? (
            <div className="p-12 text-center text-xs text-neutral-400">
              No subscription plans found in the database.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
                <tr>
                  <th className="py-3 px-4">Plan Code</th>
                  <th className="py-3 px-4">Plan Name</th>
                  <th className="py-3 px-4">Associated Product</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Cadence</th>
                  <th className="py-3 px-4">Min Qty</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
                {plans.map((plan) => (
                  <tr key={plan.db_id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-black">{plan.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-black">{plan.name}</td>
                    <td className="py-3.5 px-4 text-neutral-600">{plan.product}</td>
                    <td className="py-3.5 px-4 font-bold text-black">{plan.price}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8]">
                        {plan.interval}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600">{plan.min_quantity} unit(s)</td>
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
                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedPlan(plan);
                          setDetailsOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleOpenEdit(plan)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                            title="Edit Plan"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePlan(plan)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Deactivate Plan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Plan Details Modal */}
      {detailsOpen && selectedPlan && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <div>
                <span className="text-[10px] font-mono font-semibold text-neutral-400 uppercase tracking-wider">{selectedPlan.id}</span>
                <h3 className="text-base font-bold text-black">{selectedPlan.name}</h3>
              </div>
              <button onClick={() => setDetailsOpen(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3.5 text-xs">
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
                <span className="text-neutral-400 block text-[11px]">Associated Product</span>
                <span className="font-semibold text-black">{selectedPlan.product}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#F2F4ED]/40 border border-[#E8E8E8]">
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Trial Period</span>
                  <span className="font-semibold text-black">{selectedPlan.trialPeriod}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Min Quantity</span>
                  <span className="font-semibold text-black">{selectedPlan.min_quantity} unit(s)</span>
                </div>
              </div>

              <div>
                <span className="text-neutral-400 block text-[11px] mb-1">Lifecycle Permissions</span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className={`p-2 rounded-lg border text-[11px] font-medium ${selectedPlan.allow_pause ? 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]' : 'bg-neutral-50 text-neutral-400 border-[#E8E8E8]'}`}>
                    Pause: {selectedPlan.allow_pause ? 'Allowed' : 'Disabled'}
                  </div>
                  <div className={`p-2 rounded-lg border text-[11px] font-medium ${selectedPlan.allow_renewal ? 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]' : 'bg-neutral-50 text-neutral-400 border-[#E8E8E8]'}`}>
                    Renewal: {selectedPlan.allow_renewal ? 'Allowed' : 'Disabled'}
                  </div>
                  <div className={`p-2 rounded-lg border text-[11px] font-medium ${selectedPlan.allow_closure ? 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]' : 'bg-neutral-50 text-neutral-400 border-[#E8E8E8]'}`}>
                    Closure: {selectedPlan.allow_closure ? 'Allowed' : 'Disabled'}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-neutral-400 block mb-1 text-[11px]">Entitled Features & Highlights</span>
                <ul className="space-y-1.5">
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
                className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Modal (Admin only) */}
      {editOpen && selectedPlan && isAdmin && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase font-semibold">Editing {selectedPlan.id}</span>
                <h3 className="text-base font-bold text-black">Edit Plan Parameters</h3>
              </div>
              <button onClick={() => setEditOpen(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUpdatePlan} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Plan Display Name *</label>
                <input
                  type="text"
                  required
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Recurring Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editData.price}
                    onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Cadence *</label>
                  <select
                    value={editData.billing_interval}
                    onChange={(e) => setEditData({ ...editData, billing_interval: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B] cursor-pointer"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Min Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={editData.min_quantity}
                    onChange={(e) => setEditData({ ...editData, min_quantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Trial Days</label>
                  <input
                    type="number"
                    min="0"
                    value={editData.trial_days}
                    onChange={(e) => setEditData({ ...editData, trial_days: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Features Description (Comma-separated)</label>
                <textarea
                  rows={2}
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-[#E8E8E8] space-y-2">
                <span className="block text-[11px] font-semibold text-neutral-700">Permissions & Status</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editData.allow_pause}
                      onChange={(e) => setEditData({ ...editData, allow_pause: e.target.checked })}
                      className="rounded accent-[#788A5B]"
                    />
                    <span>Allow Pause</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editData.allow_renewal}
                      onChange={(e) => setEditData({ ...editData, allow_renewal: e.target.checked })}
                      className="rounded accent-[#788A5B]"
                    />
                    <span>Allow Renewal</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editData.allow_closure}
                      onChange={(e) => setEditData({ ...editData, allow_closure: e.target.checked })}
                      className="rounded accent-[#788A5B]"
                    />
                    <span>Allow Closure</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editData.is_active}
                      onChange={(e) => setEditData({ ...editData, is_active: e.target.checked })}
                      className="rounded accent-[#788A5B]"
                    />
                    <span>Plan Active</span>
                  </label>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E8E8E8] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#E8E8E8] text-neutral-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-black text-white font-semibold hover:bg-neutral-800 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Plan Modal (Admin only) */}
      {createOpen && isAdmin && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">Create Subscription Plan</h3>
              <button onClick={() => setCreateOpen(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreatePlan} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Plan Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. PLN-ENT"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Plan Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enterprise Scale"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Associated Database Product *</label>
                <select
                  required
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B] cursor-pointer"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="299.00"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Cadence *</label>
                  <select
                    value={formData.billing_interval}
                    onChange={(e) => setFormData({ ...formData, billing_interval: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B] cursor-pointer"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Min Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.min_quantity}
                    onChange={(e) => setFormData({ ...formData, min_quantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Trial Days</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.trial_days}
                    onChange={(e) => setFormData({ ...formData, trial_days: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Description / Features</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Feature 1, Feature 2, Feature 3"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>

              <div className="mt-5 pt-3 border-t border-[#E8E8E8] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#E8E8E8] text-neutral-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-black text-white font-semibold hover:bg-neutral-800 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
