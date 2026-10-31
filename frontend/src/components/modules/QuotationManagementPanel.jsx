import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { authService, quotationService, subscriptionService } from '../../api';

export default function QuotationManagementPanel({ userRole: propRole }) {
  const currentUser = authService.getUser() || { role: 'admin' };
  const role = propRole || currentUser.role || 'admin';
  const isAdmin = role === 'admin';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [quotations, setQuotations] = useState([]);
  const [templates, setTemplates] = useState([]);

  const [templateForm, setTemplateForm] = useState({
    name: '',
    discount: '15% Off List',
    validity: '30 Days',
    description: ''
  });

  const [formData, setFormData] = useState({
    customer: '',
    amount: '',
    expiryDate: 'Nov 30, 2026',
    template: 'Standard SMB Annual Proposal'
  });

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const data = await quotationService.getAll({
        search,
        status_filter: statusFilter
      });
      const mapped = (data || []).map((q) => ({
        id: q.id,
        db_id: q.db_id,
        customer: q.customer,
        createdDate: 'Oct 31, 2026',
        expiryDate: q.dueDate || 'Nov 30, 2026',
        amount: q.amount,
        status: q.status,
        template: 'Standard SMB Annual Proposal',
        items: [q.plan || 'Enterprise Yearly License', '24/7 Priority SLA Support Pack']
      }));
      setQuotations(mapped);
    } catch (err) {
      console.error('Failed to load quotations from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const data = await quotationService.getTemplates();
      setTemplates(data || []);
      if (data && data.length > 0 && !formData.template) {
        setFormData((prev) => ({ ...prev, template: data[0].name }));
      }
    } catch (err) {
      console.error('Failed to load quotation templates from DB:', err);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [search, statusFilter]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const totalQuotes = quotations.length;
  const pendingQuotes = quotations.filter((q) => q.status === 'Pending' || q.status === 'Pending Review').length;
  const acceptedQuotes = quotations.filter((q) => q.status === 'Accepted').length;
  const expiredQuotes = quotations.filter((q) => q.status === 'Expired' || q.status === 'Expiring Soon').length;

  const handleConvertToSubscription = async (quoteId) => {
    try {
      setActionLoading(true);
      const q = quotations.find((item) => item.id === quoteId);
      if (q?.db_id) {
        await quotationService.convert(q.db_id);
      } else if (q) {
        await subscriptionService.create({
          customer_name: q.customer,
          plan_name: q.plan || 'Enterprise Suite',
          rate: q.amount,
          interval: 'yearly'
        });
      }
      await fetchQuotations();
      alert(`Quotation ${quoteId} converted into an active PostgreSQL Subscription successfully!`);
      setDetailsOpen(false);
    } catch (err) {
      alert('Failed to convert quotation: ' + (err.response?.data?.detail || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateQuotation = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await quotationService.create({
        customer: formData.customer,
        amount: parseFloat(formData.amount.replace(/[^0-9.]/g, '') || 18400.00),
        dueDate: formData.expiryDate,
        template: formData.template
      });
      setFormData({ customer: '', amount: '', expiryDate: 'Nov 30, 2026', template: templates[0]?.name || '' });
      setCreateOpen(false);
      await fetchQuotations();
    } catch (err) {
      alert('Failed to create quotation: ' + (err.response?.data?.detail || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      setActionLoading(true);
      await quotationService.createTemplate({
        name: templateForm.name,
        discount: templateForm.discount,
        validity: templateForm.validity,
        description: templateForm.description
      });
      setTemplateForm({ name: '', discount: '15% Off List', validity: '30 Days', description: '' });
      setTemplateDialogOpen(false);
      await fetchTemplates();
    } catch (err) {
      alert('Failed to save template: ' + (err.response?.data?.detail || err.message));
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
            <span className="text-xs font-semibold uppercase tracking-wider text-[#788A5B]">Commercial Proposals</span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs font-medium text-neutral-500">PostgreSQL Quotation Pipeline</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Quotation Management</h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
            Draft, review, issue formal commercial proposals, and convert accepted quotes into recurring subscriptions in PostgreSQL.
          </p>
        </div>

        {/* 6. Create Quotation Button */}
        <button
          onClick={() => setCreateOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#788A5B]" />
          Create Quotation
        </button>
      </div>

      {/* 2. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500">Total Proposals</span>
            <h3 className="text-2xl font-bold tracking-tight text-black mt-1">{totalQuotes}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center border border-[#E8E8E8]">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500">Pending Review</span>
            <h3 className="text-2xl font-bold tracking-tight text-amber-700 mt-1">{pendingQuotes}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500">Accepted & Converted</span>
            <h3 className="text-2xl font-bold tracking-tight text-[#788A5B] mt-1">{acceptedQuotes}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center border border-[#E8E8E8]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500">Expiring / Expired</span>
            <h3 className="text-2xl font-bold tracking-tight text-neutral-600 mt-1">{expiredQuotes}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center border border-neutral-300">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Quotation Table Container */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden">
        {/* 4. Search and Status Filter */}
        <div className="p-4 border-b border-[#E8E8E8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#F2F4ED]/30">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quotation by code or customer..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs text-black placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-600">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs font-medium text-black focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Accepted">Accepted</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        {/* 5. Quotation Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-xs text-neutral-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#788A5B]" />
              <span>Loading quotations from PostgreSQL database...</span>
            </div>
          ) : quotations.length === 0 ? (
            <div className="p-12 text-center text-xs text-neutral-400">
              No commercial quotations found in the database.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
                <tr>
                  <th className="py-3 px-4">Quotation ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4">Valid Until</th>
                  <th className="py-3 px-4">Quoted Value</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
                {quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-black">{q.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-black">{q.customer}</td>
                    <td className="py-3.5 px-4 text-neutral-500">{q.createdDate}</td>
                    <td className="py-3.5 px-4 text-neutral-500">{q.expiryDate}</td>
                    <td className="py-3.5 px-4 font-bold text-black">{q.amount}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          q.status === 'Accepted'
                            ? 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]'
                            : q.status === 'Expired'
                            ? 'bg-neutral-100 text-neutral-600 border-neutral-300'
                            : q.status === 'Expiring Soon'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedQuote(q);
                          setDetailsOpen(true);
                        }}
                        className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {q.status !== 'Accepted' && (
                        <button
                          onClick={() => handleConvertToSubscription(q.id)}
                          className="p-1 rounded-lg text-[#788A5B] hover:text-black hover:bg-[#F2F4ED] transition-colors cursor-pointer"
                          title="Convert to Subscription"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quotation Templates Section (from PostgreSQL) */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E8E8] mb-4">
          <div>
            <h3 className="text-base font-semibold text-black">Quotation Templates</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Pre-configured rate schedules and terms stored in PostgreSQL database</p>
          </div>
          {isAdmin ? (
            <button
              onClick={() => setTemplateDialogOpen(true)}
              className="text-xs font-semibold text-black hover:text-[#788A5B] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#788A5B]" /> Create Template
            </button>
          ) : (
            <span className="text-[11px] text-neutral-400">Templates managed by Admin</span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((tpl) => (
            <div key={tpl.id} className="p-4 rounded-xl border border-[#E8E8E8] bg-white hover:border-[#788A5B]/40 transition-colors">
              <span className="font-mono text-[10px] text-neutral-400 block mb-1">{tpl.id}</span>
              <h4 className="text-xs font-bold text-black">{tpl.name}</h4>
              <p className="text-[11px] text-neutral-500 mt-1 line-clamp-1">{tpl.description}</p>
              <div className="mt-2 pt-2 border-t border-[#E8E8E8] flex justify-between text-[11px] text-neutral-600 font-medium">
                <span className="text-[#788A5B]">{tpl.discount}</span>
                <span>{tpl.validity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Dialog */}
      {detailsOpen && selectedQuote && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">Quotation Summary</h3>
              <button onClick={() => setDetailsOpen(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-50 border border-[#E8E8E8]">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">Total Quoted</span>
                  <p className="text-lg font-bold text-black">{selectedQuote.amount}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8]">
                  {selectedQuote.status}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block">Customer</span>
                <span className="font-semibold text-black">{selectedQuote.customer}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-neutral-400 block">Created Date</span>
                  <span className="text-neutral-700">{selectedQuote.createdDate}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Valid Until</span>
                  <span className="text-neutral-700">{selectedQuote.expiryDate}</span>
                </div>
              </div>
              <div>
                <span className="text-neutral-400 block mb-1">Proposal Items</span>
                <ul className="space-y-1 bg-[#F2F4ED]/40 p-2.5 rounded-xl border border-[#E8E8E8]">
                  {selectedQuote.items?.map((it, idx) => (
                    <li key={idx} className="text-neutral-700 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#788A5B]"></span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-3 border-t border-[#E8E8E8] flex justify-between items-center">
              {selectedQuote.status !== 'Accepted' && (
                <button
                  onClick={() => handleConvertToSubscription(selectedQuote.id)}
                  className="px-3.5 py-2 rounded-xl bg-[#788A5B] text-white text-xs font-semibold hover:bg-[#68794d] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Convert to Subscription
                </button>
              )}
              <button
                onClick={() => setDetailsOpen(false)}
                className="ml-auto px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Quotation Dialog */}
      {createOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">Create Quotation</h3>
              <button onClick={() => setCreateOpen(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateQuotation} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  placeholder="e.g. Apex AI Systems"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Proposal Total Amount *</label>
                <input
                  type="text"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="$14,500.00"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Base Template</label>
                <select
                  value={formData.template}
                  onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B] bg-white cursor-pointer"
                >
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.name}>
                      {tpl.name} ({tpl.discount})
                    </option>
                  ))}
                </select>
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
                  {actionLoading ? 'Issuing...' : 'Issue Quotation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Template Dialog */}
      {templateDialogOpen && isAdmin && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">Create Quotation Template</h3>
              <button onClick={() => setTemplateDialogOpen(false)} className="text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateTemplate} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Template Name *</label>
                <input
                  type="text"
                  required
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                  placeholder="e.g. Enterprise Tier Multi-Year"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Discount Terms</label>
                  <input
                    type="text"
                    value={templateForm.discount}
                    onChange={(e) => setTemplateForm({ ...templateForm, discount: e.target.value })}
                    placeholder="20% Off List"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Validity</label>
                  <input
                    type="text"
                    value={templateForm.validity}
                    onChange={(e) => setTemplateForm({ ...templateForm, validity: e.target.value })}
                    placeholder="30 Days"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={templateForm.description}
                  onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                  placeholder="Notes on proposal scope and contractual SLAs..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                ></textarea>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E8E8E8] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTemplateDialogOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#E8E8E8] text-neutral-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-black text-white font-semibold hover:bg-neutral-800 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
