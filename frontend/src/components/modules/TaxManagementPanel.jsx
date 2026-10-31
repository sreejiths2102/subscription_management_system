import React, { useState } from 'react';
import {
  Percent,
  Plus,
  Eye,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { authService } from '../../api';

export default function TaxManagementPanel({ userRole: propRole }) {
  const currentUser = authService.getUser() || { role: 'admin' };
  const role = propRole || currentUser.role || 'admin';
  const isAdmin = role === 'admin';

  const [taxes, setTaxes] = useState([
    {
      id: 'TAX-001',
      name: 'United Kingdom Standard VAT',
      rate: '20.0%',
      type: 'Value Added Tax (VAT)',
      description: 'Standard VAT applied to all UK digital SaaS subscriptions.',
      status: 'Active'
    },
    {
      id: 'TAX-002',
      name: 'India Integrated GST (IGST)',
      rate: '18.0%',
      type: 'Goods & Services Tax (GST)',
      description: 'Standard interstate B2B/B2C cloud services tax.',
      status: 'Active'
    },
    {
      id: 'TAX-003',
      name: 'California State Sales Tax',
      rate: '8.75%',
      type: 'Sales Tax',
      description: 'California state, county, and local district digital tax.',
      status: 'Active'
    },
    {
      id: 'TAX-004',
      name: 'European Union Cross-Border B2B',
      rate: '0.0%',
      type: 'Reverse Charge',
      description: 'Valid VAT ID reverse charge mechanism for intra-community B2B.',
      status: 'Active'
    },
    {
      id: 'TAX-005',
      name: 'Legacy Regional Surcharge',
      rate: '2.5%',
      type: 'Excise Surcharge',
      description: 'Retired regional telecommunications digital fee.',
      status: 'Inactive'
    }
  ]);

  const [selectedTax, setSelectedTax] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    rate: '',
    type: 'Sales Tax',
    description: '',
    status: 'Active'
  });

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
    setFormData(tax);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete / deactivate this tax rule?')) {
      setTaxes(taxes.filter((t) => t.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (isEditing) {
      setTaxes(taxes.map((t) => (t.id === formData.id ? formData : t)));
    } else {
      setTaxes([...taxes, formData]);
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#788A5B]">Taxation & Compliance</span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs font-medium text-neutral-500">Jurisdiction Rules</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Tax Management</h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
            Configure regional VAT, GST, state sales tax percentage calculations, and cross-border reverse charges.
          </p>
        </div>

        {/* 3. Create Tax Button */}
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-[#788A5B]" />
          Create Tax Rule
        </button>
      </div>

      {/* 2. Tax Table */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E8E8E8] bg-[#F2F4ED]/30">
          <span className="text-xs font-semibold text-neutral-700">Configured Tax Jurisdictions ({taxes.length})</span>
        </div>

        <div className="overflow-x-auto">
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
                    {/* 6. Tax Details dialog trigger */}
                    <button
                      onClick={() => {
                        setSelectedTax(tax);
                        setDetailsOpen(true);
                      }}
                      className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* 4. Edit Tax Button */}
                    <button
                      onClick={() => handleOpenEdit(tax)}
                      className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                      title="Edit Tax Rule"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    {/* 5. Delete / Deactivate Tax button */}
                    <button
                      onClick={() => handleDelete(tax.id)}
                      className="p-1 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete / Deactivate"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Tax Details Dialog */}
      {detailsOpen && selectedTax && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">{selectedTax.name}</h3>
              <button onClick={() => setDetailsOpen(false)} className="text-neutral-400 hover:text-black">
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
                className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Create / Edit Tax Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">
                {isEditing ? `Edit Tax Rule #${formData.id}` : 'Create New Tax Rule'}
              </h3>
              <button onClick={() => setDialogOpen(false)} className="text-neutral-400 hover:text-black">
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
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
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
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
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
                  className="px-3.5 py-2 rounded-xl border border-[#E8E8E8] text-neutral-600 hover:text-black"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-black text-white font-semibold hover:bg-neutral-800">
                  Save Tax Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
