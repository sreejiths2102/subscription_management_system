import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Eye,
  Edit,
  Power,
  X,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { authService } from '../../api';

export default function DiscountManagementPanel({ userRole: propRole }) {
  const currentUser = authService.getUser() || { role: 'admin' };
  const role = propRole || currentUser.role || 'admin';
  const isAdmin = role === 'admin';

  const [discounts, setDiscounts] = useState([
    {
      id: 'DISC-001',
      name: 'WELCOME20',
      type: 'Percentage',
      value: '20%',
      startDate: 'Jan 01, 2026',
      endDate: 'Dec 31, 2026',
      usageCount: 142,
      status: 'Active',
      minPurchase: '$100.00',
      minQuantity: 1,
      products: 'Brightloop Core Platform',
      subscriptions: 'Professional Team Monthly, Annual',
      maxUsage: 500
    },
    {
      id: 'DISC-002',
      name: 'STARTUP50',
      type: 'Percentage',
      value: '50%',
      startDate: 'Oct 01, 2026',
      endDate: 'Mar 31, 2027',
      usageCount: 38,
      status: 'Active',
      minPurchase: '$0.00',
      minQuantity: 1,
      products: 'All Products',
      subscriptions: 'Starter Cloud Monthly',
      maxUsage: 100
    },
    {
      id: 'DISC-003',
      name: 'FLAT50OFF',
      type: 'Fixed Amount',
      value: '$50.00',
      startDate: 'Sep 01, 2026',
      endDate: 'Oct 15, 2026',
      usageCount: 89,
      status: 'Expired',
      minPurchase: '$250.00',
      minQuantity: 2,
      products: 'Enterprise Dedicated Server Instance',
      subscriptions: 'Enterprise Yearly Suite',
      maxUsage: 100
    },
    {
      id: 'DISC-004',
      name: 'BLACKFRIDAY26',
      type: 'Percentage',
      value: '25%',
      startDate: 'Nov 20, 2026',
      endDate: 'Nov 30, 2026',
      usageCount: 0,
      status: 'Active',
      minPurchase: '$150.00',
      minQuantity: 1,
      products: 'Analytics Intelligence Engine',
      subscriptions: 'All Subscriptions',
      maxUsage: 1000
    }
  ]);

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
    startDate: 'Nov 01, 2026',
    endDate: 'Dec 31, 2026',
    maxUsage: 250,
    status: 'Active'
  });

  const totalDiscounts = discounts.length;
  const activeDiscounts = discounts.filter((d) => d.status === 'Active').length;
  const expiredDiscounts = discounts.filter((d) => d.status === 'Expired').length;

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
      startDate: 'Nov 01, 2026',
      endDate: 'Dec 31, 2026',
      maxUsage: 200,
      status: 'Active'
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleOpenEdit = (discount) => {
    setFormData(discount);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleToggleStatus = (id) => {
    setDiscounts((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' } : d
      )
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (isEditing) {
      setDiscounts(discounts.map((d) => (d.id === formData.id ? formData : d)));
    } else {
      setDiscounts([...discounts, { ...formData, usageCount: 0 }]);
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#788A5B]">Revenue Promotion</span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs font-medium text-neutral-500">Discount & Coupons</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Discount Management</h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
            Configure coupons, fixed or percentage order promotions, usage limits, and product eligibility criteria.
          </p>
        </div>

        {/* 4. Create Discount Button */}
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-[#788A5B]" />
          Create Discount
        </button>
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
            <span className="text-xs font-medium text-neutral-500">Expired Campaigns</span>
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
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
              <tr>
                <th className="py-3 px-4">Discount ID</th>
                <th className="py-3 px-4">Coupon / Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Value</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">End Date</th>
                <th className="py-3 px-4 text-center">Usage Count</th>
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
                  <td className="py-3.5 px-4 text-center font-medium text-neutral-700">
                    {disc.usageCount} / {disc.maxUsage}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        disc.status === 'Active'
                          ? 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]'
                          : disc.status === 'Expired'
                          ? 'bg-neutral-100 text-neutral-600 border-neutral-300'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {disc.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    {/* 6. Discount Details Dialog */}
                    <button
                      onClick={() => {
                        setSelectedDiscount(disc);
                        setDetailsOpen(true);
                      }}
                      className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* 5. Edit Discount Button */}
                    <button
                      onClick={() => handleOpenEdit(disc)}
                      className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                      title="Edit Discount"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    {/* 7. Activate / Deactivate Button */}
                    <button
                      onClick={() => handleToggleStatus(disc.id)}
                      className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                      title="Toggle Active / Inactive"
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Discount Details Dialog */}
      {detailsOpen && selectedDiscount && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">{selectedDiscount.name}</h3>
              <button onClick={() => setDetailsOpen(false)} className="text-neutral-400 hover:text-black">
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
                  <span className="text-neutral-400 block">Total Redemptions</span>
                  <span className="text-neutral-800 font-semibold">{selectedDiscount.usageCount} redeemed</span>
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
                className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Create / Edit Discount Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">
                {isEditing ? `Edit Coupon ${formData.name}` : 'Create Discount Campaign'}
              </h3>
              <button onClick={() => setDialogOpen(false)} className="text-neutral-400 hover:text-black">
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
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed Amount">Fixed Amount ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
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
                  <label className="block font-medium text-neutral-700 mb-1">Min. Purchase</label>
                  <input
                    type="text"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Max Redemptions</label>
                  <input
                    type="number"
                    value={formData.maxUsage}
                    onChange={(e) => setFormData({ ...formData, maxUsage: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Applicable Products</label>
                <input
                  type="text"
                  value={formData.products}
                  onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Applicable Subscriptions</label>
                <input
                  type="text"
                  value={formData.subscriptions}
                  onChange={(e) => setFormData({ ...formData, subscriptions: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">End Date</label>
                  <input
                    type="text"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E8E8E8] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#E8E8E8] text-neutral-600 hover:text-black"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-black text-white font-semibold hover:bg-neutral-800">
                  Save Discount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
