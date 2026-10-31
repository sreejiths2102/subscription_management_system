import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Eye,
  Download,
  Printer,
  Send,
  CheckCircle2,
  XCircle,
  X,
  Clock,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { authService } from '../../api';

export default function InvoiceManagementPanel({ userRole: propRole, isCustomerView: propCustomerView }) {
  const currentUser = authService.getUser() || { role: 'admin' };
  const role = propRole || currentUser.role || 'admin';
  const isCustomer = propCustomerView || role === 'customer';
  const isAdmin = role === 'admin';
  const isStaff = role === 'staff';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);

  const [invoices, setInvoices] = useState([
    {
      number: 'INV-2026-089',
      customer: 'Acme Technologies Inc.',
      date: 'Oct 30, 2026',
      dueDate: 'Nov 14, 2026',
      amount: '$3,600.00',
      status: 'Paid',
      tax: '$327.27',
      items: [
        { desc: 'Enterprise Yearly License (1 Year)', qty: 1, price: '$3,600.00' }
      ]
    },
    {
      number: 'INV-2026-088',
      customer: 'Nexus Cloud Systems',
      date: 'Oct 15, 2026',
      dueDate: 'Oct 29, 2026',
      amount: '$149.00',
      status: 'Paid',
      tax: '$13.55',
      items: [
        { desc: 'Professional Suite Monthly Subscription', qty: 1, price: '$149.00' }
      ]
    },
    {
      number: 'INV-2026-087',
      customer: 'Cloudflow Networks',
      date: 'Oct 28, 2026',
      dueDate: 'Nov 12, 2026',
      amount: '$890.00',
      status: 'Confirmed',
      tax: '$80.91',
      items: [
        { desc: 'Analytics Intelligence Engine + 10 Seats Pack', qty: 1, price: '$890.00' }
      ]
    },
    {
      number: 'INV-2026-086',
      customer: 'BlueSky Digital LLC',
      date: 'Oct 01, 2026',
      dueDate: 'Oct 15, 2026',
      amount: '$1,420.00',
      status: 'Overdue',
      tax: '$129.09',
      items: [
        { desc: 'Custom Cloud Instance Migration & Hosting', qty: 1, price: '$1,420.00' }
      ]
    },
    {
      number: 'INV-2026-085',
      customer: 'Horizon AI Labs',
      date: 'Oct 29, 2026',
      dueDate: 'Nov 15, 2026',
      amount: '$1,200.00',
      status: 'Draft',
      tax: '$109.09',
      items: [
        { desc: 'Dedicated Server Tier Support Add-on', qty: 1, price: '$1,200.00' }
      ]
    }
  ]);

  const [formData, setFormData] = useState({
    customer: '',
    amount: '',
    dueDate: 'Nov 15, 2026',
    desc: 'Professional Cloud Subscription Billing'
  });

  const visibleInvoices = isCustomer
    ? invoices.filter((inv) => inv.customer.toLowerCase().includes('nexus') || inv.number === 'INV-2026-088')
    : invoices;

  const filteredInvoices = visibleInvoices.filter((inv) => {
    const matchesSearch =
      inv.number.toLowerCase().includes(search.toLowerCase()) ||
      (!isCustomer && inv.customer.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || inv.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalInvoices = visibleInvoices.length;
  const paidInvoices = visibleInvoices.filter((i) => i.status === 'Paid').length;
  const unpaidInvoices = visibleInvoices.filter((i) => i.status === 'Confirmed' || i.status === 'Draft').length;
  const overdueInvoices = visibleInvoices.filter((i) => i.status === 'Overdue').length;

  const handleConfirm = (invNum) => {
    setInvoices((prev) =>
      prev.map((i) => (i.number === invNum ? { ...i, status: 'Confirmed' } : i))
    );
    if (selectedInvoice?.number === invNum) setSelectedInvoice({ ...selectedInvoice, status: 'Confirmed' });
    alert(`Invoice ${invNum} has been confirmed and locked.`);
  };

  const handleCancel = (invNum) => {
    if (window.confirm(`Are you sure you want to cancel invoice ${invNum}?`)) {
      setInvoices((prev) =>
        prev.map((i) => (i.number === invNum ? { ...i, status: 'Cancelled' } : i))
      );
      if (selectedInvoice?.number === invNum) setSelectedInvoice({ ...selectedInvoice, status: 'Cancelled' });
    }
  };

  const handleSend = (invNum) => {
    alert(`Invoice ${invNum} sent electronically to billing contact.`);
  };

  const handlePrint = (invNum) => {
    window.print();
  };

  const handleDownload = (invNum) => {
    alert(`Downloading official PDF copy for ${invNum}...`);
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    const newInv = {
      number: `INV-2026-0${invoices.length + 90}`,
      customer: formData.customer,
      date: 'Oct 31, 2026',
      dueDate: formData.dueDate,
      amount: formData.amount.startsWith('$') ? formData.amount : `$${formData.amount}`,
      status: 'Confirmed',
      tax: '$15.00',
      items: [{ desc: formData.desc, qty: 1, price: formData.amount }]
    };
    setInvoices([newInv, ...invoices]);
    setGenerateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#788A5B]">Financial Operations</span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs font-medium text-neutral-500">
              {isCustomer ? 'Customer Invoices' : 'Accounts Receivable'}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-black">
            {isCustomer ? 'My Invoices' : 'Invoice Management'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
            {isCustomer
              ? 'Access, download, and review your payment receipts and tax statements.'
              : 'Generate invoices, reconcile payments, dispatch billing notices, and track overdue accounts.'}
          </p>
        </div>

        {/* 6. Generate Invoice button (Admin + Staff) */}
        {!isCustomer && (
          <button
            onClick={() => setGenerateOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-[#788A5B]" />
            Generate Invoice
          </button>
        )}
      </div>

      {/* 2. Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500">Total Invoices</span>
            <h3 className="text-2xl font-bold tracking-tight text-black mt-1">{totalInvoices}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center border border-[#E8E8E8]">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500">Paid Invoices</span>
            <h3 className="text-2xl font-bold tracking-tight text-[#788A5B] mt-1">{paidInvoices}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center border border-[#E8E8E8]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500">Unpaid / Confirmed</span>
            <h3 className="text-2xl font-bold tracking-tight text-amber-700 mt-1">{unpaidInvoices}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500">Overdue Invoices</span>
            <h3 className="text-2xl font-bold tracking-tight text-red-600 mt-1">{overdueInvoices}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
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
              placeholder="Search invoice number or customer..."
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
              <option value="Paid">Paid</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Draft">Draft</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* 5. Invoice Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                {!isCustomer && <th className="py-3 px-4">Customer Name</th>}
                <th className="py-3 px-4">Invoice Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
              {filteredInvoices.map((inv) => (
                <tr key={inv.number} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-black">{inv.number}</td>
                  {!isCustomer && <td className="py-3.5 px-4 font-semibold text-black">{inv.customer}</td>}
                  <td className="py-3.5 px-4 text-neutral-500">{inv.date}</td>
                  <td className="py-3.5 px-4 text-neutral-500">{inv.dueDate}</td>
                  <td className="py-3.5 px-4 font-bold text-black">{inv.amount}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        inv.status === 'Paid'
                          ? 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]'
                          : inv.status === 'Overdue'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : inv.status === 'Confirmed'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    {/* 7. Details Dialog trigger */}
                    <button
                      onClick={() => {
                        setSelectedInvoice(inv);
                        setDetailsOpen(true);
                      }}
                      className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                      title="View Invoice Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* 11. Download / Print PDF */}
                    <button
                      onClick={() => handleDownload(inv.number)}
                      className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* Admin / Staff only operations */}
                    {!isCustomer && (
                      <>
                        {inv.status === 'Draft' && (
                          <button
                            onClick={() => handleConfirm(inv.number)}
                            className="p-1 rounded-lg text-[#788A5B] hover:bg-[#F2F4ED] transition-colors"
                            title="Confirm Invoice"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleSend(inv.number)}
                          className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                          title="Send to Customer"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                        {inv.status !== 'Paid' && inv.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleCancel(inv.number)}
                            className="p-1 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            title="Cancel Invoice"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Invoice Details Dialog */}
      {detailsOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <div>
                <h3 className="text-base font-bold text-black">Invoice #{selectedInvoice.number}</h3>
                <span className="text-[11px] text-neutral-400">Brightloop Billing Ledger</span>
              </div>
              <button onClick={() => setDetailsOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="flex justify-between items-center p-3.5 rounded-xl bg-neutral-50 border border-[#E8E8E8]">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">Total Amount</span>
                  <p className="text-xl font-bold text-black">{selectedInvoice.amount}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">Settlement Status</span>
                  <p className="text-xs font-bold text-[#788A5B]">{selectedInvoice.status}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-neutral-400 block">Customer</span>
                  <span className="font-semibold text-black">{selectedInvoice.customer}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Due Date</span>
                  <span className="text-neutral-700">{selectedInvoice.dueDate}</span>
                </div>
              </div>

              <div>
                <span className="text-neutral-400 block mb-1.5 font-semibold">Line Items</span>
                <div className="border border-[#E8E8E8] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F2F4ED]/50 text-neutral-600">
                      <tr>
                        <th className="p-2.5">Item Description</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E8E8]">
                      {selectedInvoice.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 text-black font-medium">{it.desc}</td>
                          <td className="p-2.5 text-center">{it.qty}</td>
                          <td className="p-2.5 text-right font-semibold text-black">{it.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-[#E8E8E8] flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(selectedInvoice.number)}
                  className="px-3 py-1.5 rounded-xl border border-[#E8E8E8] text-xs font-medium text-neutral-700 hover:text-black flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
                <button
                  onClick={() => handlePrint(selectedInvoice.number)}
                  className="px-3 py-1.5 rounded-xl border border-[#E8E8E8] text-xs font-medium text-neutral-700 hover:text-black flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
              </div>

              {!isCustomer && selectedInvoice.status === 'Draft' && (
                <button
                  onClick={() => handleConfirm(selectedInvoice.number)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#788A5B] text-white text-xs font-semibold hover:bg-[#66764c]"
                >
                  Confirm Invoice
                </button>
              )}

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

      {/* Generate Invoice Dialog (Admin + Staff) */}
      {generateOpen && !isCustomer && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">Generate Commercial Invoice</h3>
              <button onClick={() => setGenerateOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleGenerate} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Customer Account *</label>
                <input
                  type="text"
                  required
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  placeholder="e.g. Acme Technologies Inc."
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Total Billable Amount *</label>
                <input
                  type="text"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="$1,200.00"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Payment Due Date</label>
                <input
                  type="text"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Item Description</label>
                <input
                  type="text"
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div className="mt-5 pt-3 border-t border-[#E8E8E8] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGenerateOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#E8E8E8] text-neutral-600 hover:text-black"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-black text-white font-semibold hover:bg-neutral-800">
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
