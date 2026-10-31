import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Eye,
  Edit,
  Power,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { authService, discountService } from '../../api';

export default function DiscountManagementPanel({ userRole: propRole }) {
  const currentUser = authService.getUser() || { role: 'admin' };
  const role = propRole || currentUser.role || 'admin';
  const isAdmin = role === 'admin';

  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    type: 'Percentage',
    value: '',
    minPurchase: '$0.00',
    minQuantity: 1,
    products: 'All Products',
    subscriptions: 'All Subscriptions',
    startDate: 'Jan 01, 2026',
    endDate: 'Dec 31, 2026',
    maxUsage: 250,
    status: 'Active'
  });

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const data = await discountService.getAll();
      setDiscounts(data || []);
    } catch (err) {
      console.error('Failed to load discounts from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const totalDiscounts = discounts.length;
  const activeDiscounts = discounts.filter((d) => d.status === 'Active').length;
  const expiredDiscounts = discounts.filter((d) => d.status === 'Inactive' || d.status === 'Expired').length;

  const handleOpenCreate = () => {
    setFormData({
      id: `DISC-00${discounts.length + 1}`,
      name: '',
      type: 'Percentage',
      value: '',
      minPurchase: '$0.00',
      minQuantity: 1,
      products: 'All Products',
      subscriptions: 'All Subscriptions',
      startDate: 'Jan 01, 2026',
      endDate: 'Dec 31, 2026',
      maxUsage: 200,
      status: 'Active'
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleOpenEdit = (discount) => {
    setFormData({
      id: discount.id,
      db_id: discount.db_id,
      name: discount.name,
      type: discount.type || 'Percentage',
      value: discount.value,
      minPurchase: discount.minPurchase || '$0.00',
      minQuantity: discount.minQuantity || 1,
      products: discount.products || 'All Products',
      subscriptions: discount.subscriptions || 'All Subscriptions',
      startDate: discount.startDate || 'Jan 01, 2026',
      endDate: discount.endDate || discount.valid_until || 'Dec 31, 2026',
      maxUsage: discount.maxUsage || 250,
      status: discount.status || 'Active'
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleToggleStatus = async (discount) => {
    if (!isAdmin) return;
    try {
      setActionLoading(true);
      const nextStatus = discount.status === 'Active' ? 'Inactive' : 'Active';
      await discountService.update(discount.db_id, {
        status: nextStatus,
        is_active: nextStatus === 'Active'
      });
      await fetchDiscounts();
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.detail || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      setActionLoading(true);
      if (isEditing && formData.db_id) {
        await discountService.update(formData.db_id, formData);
      } else {
        await discountService.create(formData);
      }
      setDialogOpen(false);
      await fetchDiscounts();
    } catch (err) {
      alert('Failed to save discount: ' + (err.response?.data?.detail || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#788A5B]">Revenue Promotion</span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs font-medium text-neutral-500">PostgreSQL Discount Campaigns</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Discount Management</h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
            Configure coupons, fixed or percentage order promotions, usage limits, and eligibility criteria stored in PostgreSQL.
          </p>
        </div>

        {/* Create Discount Button */}
        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#788A5B]" />
            Create Discount
          </button>
        )}
      </div>

      {/* 2. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500">Total Discount Campaigns</span>
            <h3 className="text-2xl font-bold tracking-tight text-black mt-1">{totalDiscounts}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center border border-[#E8E8E8]">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500">Active Promotions</span>
            <h3 className="text-2xl font-bold tracking-tight text-[#788A5B] mt-1">{activeDiscounts}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center border border-[#E8E8E8]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500">Inactive / Expired</span>
            <h3 className="text-2xl font-bold tracking-tight text-neutral-600 mt-1">{expiredDiscounts}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center border border-neutral-300">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Discount Table */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-xs text-neutral-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#788A5B]" />
              <span>Loading discount records from PostgreSQL database...</span>
            </div>
          ) : discounts.length === 0 ? (
            <div className="p-12 text-center text-xs text-neutral-400">
              No discounts found in the database.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
                <tr>
                  <th className="py-3 px-4">Discount ID</th>
                  <th className="py-3 px-4">Coupon / Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Value</th>
                  <th className="py-3 px-4">Start Date</th>
                  <th className="py-3 px-4">Valid Until</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
                {discounts.map((disc) => (
                  <tr key={disc.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-black">{disc.id}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-black">{disc.name}</td>
                    <td className="py-3.5 px-4 text-neutral-600">{disc.type}</td>
                    <td className="py-3.5 px-4 font-bold text-[#788A5B]">{disc.value}</td>
                    <td className="py-3.5 px-4 text-neutral-500">{disc.startDate}</td>
                    <td className="py-3.5 px-4 text-neutral-500">{disc.endDate}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          disc.status === 'Active'
                            ? 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]'
                            : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                        }`}
                      >
                        {disc.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => {
                          setSelectedDiscount(disc);
                          setDetailsOpen(true);
                        }}
                        className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleOpenEdit(disc)}
                            className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                            title="Edit Discount"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(disc)}
                            className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                            title="Toggle Active / Inactive"
                          >
                            <Power className="w-3.5 h-3.5" />
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

      {/* Discount Details Dialog */}
      {detailsOpen && selectedDiscount && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">{selectedDiscount.name}</h3>
              <button onClick={() => setDetailsOpen(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-50 border border-[#E8E8E8]">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">Promotion Value</span>
                  <p className="text-xl font-bold text-[#788A5B]">{selectedDiscount.value} Off</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8]">
                  {selectedDiscount.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-neutral-400 block">Min. Purchase</span>
                  <span className="text-neutral-800 font-semibold">{selectedDiscount.minPurchase}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Promotion Type</span>
                  <span className="text-neutral-800 font-semibold">{selectedDiscount.type}</span>
                </div>
              </div>
              <div>
                <span className="text-neutral-400 block">Applicable Products</span>
                <span className="text-neutral-800 font-medium">{selectedDiscount.products}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Applicable Subscriptions</span>
                <span className="text-neutral-800 font-medium">{selectedDiscount.subscriptions}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-neutral-400 block">Campaign Start</span>
                  <span className="text-neutral-600">{selectedDiscount.startDate}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Campaign End</span>
                  <span className="text-neutral-600">{selectedDiscount.endDate}</span>
                </div>
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

      {/* Create / Edit Discount Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">
                {isEditing ? `Edit Coupon ${formData.name}` : 'Create Discount Campaign'}
              </h3>
              <button onClick={() => setDialogOpen(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Coupon Code / Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                    placeholder="e.g. FLASH25"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] font-mono focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B] cursor-pointer"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed Amount">Fixed Amount ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Discount Value *</label>
                  <input
                    type="text"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="25% or $50"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Valid Until / End Date</label>
                  <input
                    type="text"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B] cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E8E8E8] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#E8E8E8] text-neutral-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-black text-white font-semibold hover:bg-neutral-800 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save Discount'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
