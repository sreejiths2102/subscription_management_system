import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  BookmarkPlus,
  ArrowRight
} from 'lucide-react';
import { authService } from '../../api';

export default function QuotationManagementPanel({ userRole: propRole }) {
  const currentUser = authService.getUser() || { role: 'admin' };
  const role = propRole || currentUser.role || 'admin';
  const isAdmin = role === 'admin';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const [quotations, setQuotations] = useState([
    {
      id: 'QT-2026-041',
      customer: 'Quantum Dynamics Corp',
      createdDate: 'Oct 24, 2026',
      expiryDate: 'Nov 15, 2026',
      amount: '$18,400.00',
      status: 'Pending',
      template: 'Enterprise Custom Deal',
      items: ['Enterprise Cloud Server (2 Instances)', 'Analytics Add-on (15 Seats)', 'Onboarding SLA Pack']
    },
    {
      id: 'QT-2026-040',
      customer: 'Global Fintech Ltd',
      createdDate: 'Oct 20, 2026',
      expiryDate: 'Nov 20, 2026',
      amount: '$32,000.00',
      status: 'Accepted',
      template: 'Enterprise Multi-Year Commitment',
      items: ['Enterprise Dedicated Node', 'White-Label Branding Suite', '24/7 Priority SLA']
    },
    {
      id: 'QT-2026-039',
      customer: 'Summit Health Technologies',
      createdDate: 'Oct 15, 2026',
      expiryDate: 'Nov 10, 2026',
      amount: '$12,500.00',
      status: 'Pending',
      template: 'Standard Annual Bundle',
      items: ['Professional Suite Annual (20 Seats)', 'Priority Support SLA']
    },
    {
      id: 'QT-2026-038',
      customer: 'Orion Robotics Labs',
      createdDate: 'Sep 25, 2026',
      expiryDate: 'Oct 25, 2026',
      amount: '$24,000.00',
      status: 'Expired',
      template: 'Special POC Proposal',
      items: ['Custom Scale Tier', 'ML Forecasting Engine']
    }
  ]);

  // Quotation Templates
  const [templates, setTemplates] = useState([
    { id: 'TPL-01', name: 'Standard SMB Annual Proposal', discount: '15% Off List', validity: '30 Days' },
    { id: 'TPL-02', name: 'Enterprise Multi-Year Commitment', discount: '25% Off List', validity: '45 Days' },
    { id: 'TPL-03', name: 'Startup Accelerator Grant Package', discount: '50% First Year', validity: '14 Days' }
  ]);

  const [formData, setFormData] = useState({
    customer: '',
    amount: '',
    expiryDate: 'Nov 30, 2026',
    template: 'Standard SMB Annual Proposal'
  });

  const totalQuotes = quotations.length;
  const pendingQuotes = quotations.filter((q) => q.status === 'Pending').length;
  const acceptedQuotes = quotations.filter((q) => q.status === 'Accepted').length;
  const expiredQuotes = quotations.filter((q) => q.status === 'Expired').length;

  const filteredQuotes = quotations.filter((q) => {
    const matchesSearch =
      q.customer.toLowerCase().includes(search.toLowerCase()) ||
      q.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || q.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleConvertToSubscription = (quoteId) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: 'Accepted' } : q))
    );
    alert(`Quotation ${quoteId} converted to Active Subscription successfully!`);
    setDetailsOpen(false);
  };

  const handleCreateQuotation = (e) => {
    e.preventDefault();
    const newQuote = {
      id: `QT-2026-0${quotations.length + 42}`,
      customer: formData.customer,
      createdDate: 'Oct 31, 2026',
      expiryDate: formData.expiryDate,
      amount: formData.amount.startsWith('$') ? formData.amount : `$${formData.amount}`,
      status: 'Pending',
      template: formData.template,
      items: ['Custom proposed tier items']
    };
    setQuotations([newQuote, ...quotations]);
    setFormData({ customer: '', amount: '', expiryDate: 'Nov 30, 2026', template: 'Standard SMB Annual Proposal' });
    setCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#788A5B]">Sales Operations</span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs font-medium text-neutral-500">Proposal Desk</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Quotation Management</h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
            Draft, review, issue formal commercial proposals, and convert accepted quotes into recurring subscriptions.
          </p>
        </div>

        {/* 6. Create Quotation Button */}
        <button
          onClick={() => setCreateOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-[#788A5B]" />
          Create Quotation
        </button>
      </div>

      {/* 2. Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500">Total Quotations</span>
            <h3 className="text-2xl font-bold tracking-tight text-black mt-1">{totalQuotes}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center border border-[#E8E8E8]">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500">Pending Review</span>
            <h3 className="text-2xl font-bold tracking-tight text-amber-700 mt-1">{pendingQuotes}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500">Accepted Quotes</span>
            <h3 className="text-2xl font-bold tracking-tight text-[#788A5B] mt-1">{acceptedQuotes}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center border border-[#E8E8E8]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500">Expired Quotes</span>
            <h3 className="text-2xl font-bold tracking-tight text-neutral-600 mt-1">{expiredQuotes}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center border border-neutral-300">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden">
        {/* 3 & 4. Search and Status Filter */}
        <div className="p-4 border-b border-[#E8E8E8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#F2F4ED]/30">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quotation by customer or quote #..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs text-black placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-600">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs font-medium text-black focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        {/* 5. Quotation Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
              <tr>
                <th className="py-3 px-4">Quotation ID</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
              {filteredQuotes.map((q) => (
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
                          : q.status === 'Pending'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                      }`}
                    >
                      {q.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    <button
                      onClick={() => {
                        setSelectedQuote(q);
                        setDetailsOpen(true);
                      }}
                      className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* 8. Edit Quotation Button */}
                    <button
                      onClick={() => {
                        setSelectedQuote(q);
                        setEditOpen(true);
                      }}
                      className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                      title="Edit Quotation"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    {/* 9. Convert to Subscription Button */}
                    {q.status === 'Pending' && (
                      <button
                        onClick={() => handleConvertToSubscription(q.id)}
                        className="p-1 rounded-lg text-[#788A5B] hover:text-black hover:bg-[#F2F4ED] transition-colors"
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
        </div>
      </div>

      {/* 10. Quotation Templates Section */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E8E8] mb-4">
          <div>
            <h3 className="text-base font-semibold text-black">Quotation Templates</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Pre-configured rate schedules and terms for sales quotes</p>
          </div>
          {isAdmin ? (
            <button
              onClick={() => setTemplateDialogOpen(true)}
              className="text-xs font-semibold text-black hover:text-[#788A5B] flex items-center gap-1 transition-colors"
            >
              + Create Template
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
              <div className="mt-2 pt-2 border-t border-[#E8E8E8] flex justify-between text-[11px] text-neutral-500">
                <span>{tpl.discount}</span>
                <span>{tpl.validity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Quotation Details Dialog */}
      {detailsOpen && selectedQuote && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">Quotation Summary</h3>
              <button onClick={() => setDetailsOpen(false)} className="text-neutral-400 hover:text-black">
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
                  {selectedQuote.items.map((it, idx) => (
                    <li key={idx} className="text-neutral-700 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#788A5B]"></span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-3 border-t border-[#E8E8E8] flex justify-between items-center">
              {selectedQuote.status === 'Pending' && (
                <button
                  onClick={() => handleConvertToSubscription(selectedQuote.id)}
                  className="px-3.5 py-2 rounded-xl bg-[#788A5B] text-white text-xs font-semibold hover:bg-[#68794d] transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Convert to Subscription
                </button>
              )}
              <button
                onClick={() => setDetailsOpen(false)}
                className="ml-auto px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Edit Quotation Dialog */}
      {editOpen && selectedQuote && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">Edit Quotation #{selectedQuote.id}</h3>
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
                <label className="block font-medium text-neutral-700 mb-1">Customer Organization</label>
                <input
                  type="text"
                  defaultValue={selectedQuote.customer}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Proposal Amount</label>
                <input
                  type="text"
                  defaultValue={selectedQuote.amount}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Expiry Date</label>
                <input
                  type="text"
                  defaultValue={selectedQuote.expiryDate}
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
                  Update Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Quotation Dialog */}
      {createOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">Create Quotation</h3>
              <button onClick={() => setCreateOpen(false)} className="text-neutral-400 hover:text-black">
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
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                >
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.name}>
                      {tpl.name}
                    </option>
                  ))}
                </select>
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
                  Issue Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
