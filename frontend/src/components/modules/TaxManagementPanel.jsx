import React, { useState, useEffect } from 'react';
import {
  Percent,
  Plus,
  Eye,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { authService, taxService } from '../../api';

export default function TaxManagementPanel({ userRole: propRole }) {
  const currentUser = authService.getUser() || { role: 'admin' };
  const role = propRole || currentUser.role || 'admin';
  const isAdmin = role === 'admin';

  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTax, setSelectedTax] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    rate: '',
    type: 'Sales Tax',
    description: '',
    status: 'Active'
  });

  const fetchTaxes = async () => {
    try {
      setLoading(true);
      const data = await taxService.getAll();
      setTaxes(data || []);
    } catch (err) {
      console.error('Failed to load taxes from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, []);

  const handleOpenCreate = () => {
    setFormData({
      id: `TAX-00${taxes.length + 1}`,
      name: '',
      rate: '',
      type: 'Sales Tax',
      description: '',
      status: 'Active'
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleOpenEdit = (tax) => {
    setFormData({
      id: tax.id,
      db_id: tax.db_id,
      name: tax.name,
      rate: tax.rate,
      type: tax.type || 'Sales Tax',
      description: tax.description || '',
      status: tax.status || 'Active'
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDelete = async (tax) => {
    if (!isAdmin) return;
    if (window.confirm(`Are you sure you want to delete / deactivate tax rule ${tax.name} (${tax.id})?`)) {
      try {
        setActionLoading(true);
        await taxService.delete(tax.db_id);
        await fetchTaxes();
      } catch (err) {
        alert('Failed to deactivate tax rule: ' + (err.response?.data?.detail || err.message));
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      setActionLoading(true);
      if (isEditing && formData.db_id) {
        await taxService.update(formData.db_id, formData);
      } else {
        await taxService.create(formData);
      }
      setDialogOpen(false);
      await fetchTaxes();
    } catch (err) {
      alert('Failed to save tax rule: ' + (err.response?.data?.detail || err.message));
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
            <span className="text-xs font-semibold uppercase tracking-wider text-[#788A5B]">Taxation & Compliance</span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs font-medium text-neutral-500">PostgreSQL Jurisdiction Rules</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Tax Management</h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
            Configure regional VAT, GST, state sales tax percentage calculations, and cross-border reverse charges stored directly in PostgreSQL.
          </p>
        </div>

        {/* Create Tax Button */}
        {isAdmin && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#788A5B]" />
            Create Tax Rule
          </button>
        )}
      </div>

      {/* Tax Table */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E8E8E8] bg-[#F2F4ED]/30">
          <span className="text-xs font-semibold text-neutral-700">Configured Tax Jurisdictions ({taxes.length})</span>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-xs text-neutral-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#788A5B]" />
              <span>Loading tax rules from PostgreSQL database...</span>
            </div>
          ) : taxes.length === 0 ? (
            <div className="p-12 text-center text-xs text-neutral-400">
              No tax rules found in the database.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
                <tr>
                  <th className="py-3 px-4">Tax ID</th>
                  <th className="py-3 px-4">Tax Name</th>
                  <th className="py-3 px-4">Tax Rate</th>
                  <th className="py-3 px-4">Tax Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
                {taxes.map((tax) => (
                  <tr key={tax.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-black">{tax.id}</td>
                    <td className="py-3.5 px-4 font-medium text-black">{tax.name}</td>
                    <td className="py-3.5 px-4 font-bold text-black">{tax.rate}</td>
                    <td className="py-3.5 px-4 text-neutral-600">{tax.type}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          tax.status === 'Active'
                            ? 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]'
                            : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                        }`}
                      >
                        {tax.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => {
                          setSelectedTax(tax);
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
                            onClick={() => handleOpenEdit(tax)}
                            className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                            title="Edit Tax Rule"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(tax)}
                            className="p-1 rounded-lg text-neutral-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete / Deactivate"
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

      {/* Tax Details Dialog */}
      {detailsOpen && selectedTax && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">{selectedTax.name}</h3>
              <button onClick={() => setDetailsOpen(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-50 border border-[#E8E8E8]">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">Effective Percentage</span>
                  <p className="text-xl font-bold text-black">{selectedTax.rate}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8]">
                  {selectedTax.status}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block">Rule Code</span>
                <span className="font-mono font-medium text-black">{selectedTax.id}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Tax Category / Mechanism</span>
                <span className="text-neutral-800 font-medium">{selectedTax.type}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Description & Compliance Notes</span>
                <p className="text-neutral-700 bg-[#F2F4ED]/40 p-2.5 rounded-xl border border-[#E8E8E8] mt-1">
                  {selectedTax.description}
                </p>
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

      {/* Create / Edit Tax Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">
                {isEditing ? `Edit Tax Rule #${formData.id}` : 'Create New Tax Rule'}
              </h3>
              <button onClick={() => setDialogOpen(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Tax Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Standard VAT"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Tax Percentage *</label>
                  <input
                    type="text"
                    required
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                    placeholder="20.0%"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Tax Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B] cursor-pointer"
                  >
                    <option value="Sales Tax">Sales Tax</option>
                    <option value="Value Added Tax (VAT)">Value Added Tax (VAT)</option>
                    <option value="Goods & Services Tax (GST)">Goods & Services Tax (GST)</option>
                    <option value="Reverse Charge">Reverse Charge</option>
                  </select>
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
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jurisdiction legal basis and application scope..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                ></textarea>
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
                  {actionLoading ? 'Saving...' : 'Save Tax Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
