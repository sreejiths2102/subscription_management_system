import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  Eye,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Calendar,
  Building,
  ArrowUpRight,
  Receipt,
  Send,
  DollarSign
} from 'lucide-react';
import { authService, paymentService, invoiceService } from '../../api';

export default function PaymentManagementPanel({ userRole: propRole, isCustomerView: propCustomerView }) {
  const currentUser = authService.getUser() || { role: 'admin', name: 'Admin User' };
  const role = propRole || currentUser.role || 'admin';
  const isCustomer = propCustomerView || role === 'customer';
  const isAdmin = role === 'admin';
  const isStaff = role === 'staff';

  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [recordOpen, setRecordOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const [payments, setPayments] = useState([]);
  const [pendingInvoices, setPendingInvoices] = useState([]);

  // New Record Payment form state
  const [newPayment, setNewPayment] = useState({
    invoiceId: 'INV-2026-092',
    customer: 'ABC Ltd',
    customerEmail: 'finance@abcltd.com',
    amount: '450.00',
    method: 'Credit Card (Visa)',
    date: new Date().toISOString().split('T')[0],
    reference: `TX-${Date.now().toString().slice(-6)}`,
    notes: 'Payment recorded via billing ledger',
  });

  const fetchPaymentsData = async () => {
    try {
      setLoading(true);
      const [paymentsData, invoicesData] = await Promise.all([
        paymentService.getAll({ search }),
        invoiceService.getAll()
      ]);

      setPayments(
        (paymentsData || []).map((p) => ({
          id: p.id,
          invoiceId: p.invoice,
          customer: p.customer,
          customerEmail: `${p.customer.toLowerCase().replace(/\s+/g, '')}@example.com`,
          amount: p.amount,
          numericAmount: p.raw_amount || parseFloat((p.amount || '').replace(/[^0-9.]/g, '') || 0),
          method: p.method,
          date: p.date,
          status: p.status || 'Cleared',
          reference: `REF-${p.id}`,
          notes: `Settled payment record in PostgreSQL (${p.method})`,
        }))
      );

      const unpaids = (invoicesData || [])
        .filter((i) => i.status === 'Pending' || i.status === 'Overdue' || i.status === 'Confirmed')
        .map((i) => ({
          invoiceId: i.id,
          customer: i.customer,
          amount: i.amount,
          numericAmount: i.total || parseFloat((i.amount || '').replace(/[^0-9.]/g, '') || 0),
          dueDate: i.dueDate,
          status: i.status === 'Overdue' ? 'Overdue' : 'Outstanding',
          daysOverdue: i.status === 'Overdue' ? 5 : 0,
          daysDue: i.status === 'Overdue' ? 0 : 7,
        }));
      setPendingInvoices(unpaids);
    } catch (err) {
      console.error('Failed to load payments from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentsData();
  }, [search]);

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    try {
      await paymentService.create({
        customer: newPayment.customer,
        amount: parseFloat(newPayment.amount),
        payment_method: newPayment.method,
        invoice_code: newPayment.invoiceId,
        notes: newPayment.notes
      });
      setRecordOpen(false);
      setActionSuccess(`Payment against ${newPayment.invoiceId} recorded successfully!`);
      setTimeout(() => setActionSuccess(''), 3500);
      await fetchPaymentsData();
    } catch (err) {
      alert('Failed to record payment: ' + (err.response?.data?.detail || err.message));
    }
  };

  const notifyReminder = (invId) => {
    setActionSuccess(`Payment reminder email dispatched for invoice ${invId}`);
    setTimeout(() => setActionSuccess(''), 3500);
  };

  // Filter payments
  const filteredPayments = payments.filter((p) => {
    const matchesMethod =
      methodFilter === 'All' || p.method?.toLowerCase().includes(methodFilter.toLowerCase());

    if (isCustomer) {
      return matchesMethod && p.customer?.toLowerCase().includes((currentUser.name || '').toLowerCase());
    }

    return matchesMethod;
  });

  // KPI Computations
  const totalReceived = payments.reduce((sum, p) => sum + (p.numericAmount || 0), 0);
  const outstandingAmount = pendingInvoices
    .filter((inv) => inv.status === 'Outstanding')
    .reduce((sum, inv) => sum + (inv.numericAmount || 0), 0);
  const overdueAmount = pendingInvoices
    .filter((inv) => inv.status === 'Overdue')
    .reduce((sum, inv) => sum + (inv.numericAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">
            {isCustomer ? 'Payment History' : 'Payment Management'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            {isCustomer
              ? 'View settled payments, receipts, and outstanding invoice balances.'
              : 'Record customer settlements, track payment gateway transactions, and audit overdue balances in PostgreSQL.'}
          </p>
        </div>

        {!isCustomer && (isAdmin || isStaff) && (
          <button
            onClick={() => setRecordOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        )}
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-[#F2F4ED] border border-[#788A5B]/30 text-xs font-semibold text-[#788A5B] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#788A5B]" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* 2. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E8E8E8] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Total Payments</span>
            <div className="w-7 h-7 rounded-lg bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-black mt-2">{filteredPayments.length}</p>
          <span className="text-[11px] font-medium text-neutral-400 mt-1 block">In database</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E8E8] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Total Cleared Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-black mt-2">
            ${totalReceived.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] font-medium text-[#788A5B] mt-1 block">Settled funds</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E8E8] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Outstanding Receivables</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-black mt-2">
            ${outstandingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] font-medium text-amber-600 mt-1 block">
            {pendingInvoices.filter((i) => i.status === 'Outstanding').length} awaiting payment
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E8E8] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Overdue Balance</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-600 mt-2">
            ${overdueAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] font-medium text-rose-500 mt-1 block">
            {pendingInvoices.filter((i) => i.status === 'Overdue').length} past due invoices
          </span>
        </div>
      </div>

      {/* 3, 4, 5. Search & Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E8E8E8] shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search payments by ID, Invoice #, or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs text-black placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#788A5B] focus:border-[#788A5B]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 border border-[#E8E8E8] rounded-xl px-2.5 py-1.5 bg-white">
            <Filter className="w-3.5 h-3.5 text-[#788A5B]" />
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="bg-transparent border-none text-xs text-black focus:outline-none cursor-pointer"
            >
              <option value="All">All Methods</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer (ACH)</option>
              <option value="Wire Transfer">Wire Transfer</option>
              <option value="Stripe">Stripe</option>
            </select>
          </div>
        </div>
      </div>

      {/* 6. Payment Table */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8E8E8] flex items-center justify-between">
          <h2 className="text-sm font-bold text-black">Payment Ledger & Receipts</h2>
          <span className="text-xs text-neutral-500">Showing {filteredPayments.length} transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
              <tr>
                <th className="py-3 px-4">Payment ID</th>
                <th className="py-3 px-4">Invoice ID</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Payment Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-black">{p.id}</td>
                  <td className="py-3.5 px-4 font-mono text-[#788A5B] font-medium">{p.invoiceId}</td>
                  <td className="py-3.5 px-4 font-semibold text-black">{p.customer}</td>
                  <td className="py-3.5 px-4 font-bold text-black">{p.amount}</td>
                  <td className="py-3.5 px-4 text-neutral-600">{p.method}</td>
                  <td className="py-3.5 px-4 text-neutral-600 font-mono">{p.date}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F2F4ED] text-[#788A5B] border border-[#788A5B]/30">
                      <CheckCircle2 className="w-3 h-3 text-[#788A5B]" />
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedPayment(p);
                        setDetailsOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg border border-[#E8E8E8] text-xs font-medium text-neutral-700 hover:text-black hover:border-black transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-neutral-500">
                    No matching payment transactions found in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 9. Outstanding and Overdue Invoices Section (Admin & Staff View) */}
      {!isCustomer && (
        <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-black">Invoices Pending Settlement</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Outstanding and overdue accounts requiring collection follow-ups or manual settlement records in PostgreSQL.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
              {pendingInvoices.length} Requires Action
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
                <tr>
                  <th className="py-3 px-4">Invoice ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Amount Due</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8]">
                {pendingInvoices.map((inv) => (
                  <tr key={inv.invoiceId} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-black">{inv.invoiceId}</td>
                    <td className="py-3.5 px-4 font-semibold text-black">{inv.customer}</td>
                    <td className="py-3.5 px-4 font-bold text-black">{inv.amount}</td>
                    <td className="py-3.5 px-4 font-mono text-neutral-600">{inv.dueDate}</td>
                    <td className="py-3.5 px-4">
                      {inv.status === 'Overdue' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                          <AlertCircle className="w-3 h-3" />
                          Overdue
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3" />
                          Pending Settlement
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => notifyReminder(inv.invoiceId)}
                          className="px-2.5 py-1 rounded-lg border border-[#E8E8E8] text-xs font-medium text-neutral-700 hover:text-black hover:border-black transition-colors"
                        >
                          Send Reminder
                        </button>
                        <button
                          onClick={() => {
                            setNewPayment({
                              ...newPayment,
                              invoiceId: inv.invoiceId,
                              customer: inv.customer,
                              amount: inv.numericAmount.toString(),
                            });
                            setRecordOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
                        >
                          Record Payment
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. Payment Details Dialog */}
      {detailsOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-4">
              <div>
                <span className="text-xs font-mono text-neutral-400">Payment Transaction</span>
                <h3 className="text-lg font-bold text-black">{selectedPayment.id}</h3>
              </div>
              <button
                onClick={() => setDetailsOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#F2F4ED] border border-[#788A5B]/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#788A5B] font-semibold block">Settlement Amount</span>
                <span className="text-2xl font-bold text-black">{selectedPayment.amount}</span>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white text-[#788A5B] border border-[#788A5B]/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {selectedPayment.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-400 block font-medium">Customer Account</span>
                <span className="text-black font-semibold mt-0.5 block">{selectedPayment.customer}</span>
              </div>
              <div>
                <span className="text-neutral-400 block font-medium">Linked Invoice</span>
                <span className="text-[#788A5B] font-mono font-bold mt-0.5 block">{selectedPayment.invoiceId}</span>
              </div>
              <div>
                <span className="text-neutral-400 block font-medium">Payment Method</span>
                <span className="text-black font-semibold mt-0.5 block">{selectedPayment.method}</span>
              </div>
              <div>
                <span className="text-neutral-400 block font-medium">Settlement Date</span>
                <span className="text-black font-semibold mt-0.5 block font-mono">{selectedPayment.date}</span>
              </div>
              <div className="col-span-2">
                <span className="text-neutral-400 block font-medium">Gateway Transaction Reference</span>
                <span className="text-black font-mono font-medium mt-0.5 block bg-neutral-50 p-2 rounded-lg border border-[#E8E8E8]">
                  {selectedPayment.reference}
                </span>
              </div>
            </div>

            <div className="border-t border-[#E8E8E8] pt-4 flex items-center justify-between">
              <button
                onClick={() => {
                  alert(`Downloading Official Payment Receipt for ${selectedPayment.id}...`);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E8E8] text-xs font-semibold text-neutral-800 hover:text-black hover:border-black transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#788A5B]" />
                <span>Download Receipt PDF</span>
              </button>

              <button
                onClick={() => setDetailsOpen(false)}
                className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Record Payment Modal (Admin + Staff Only) */}
      {recordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-3">
              <h3 className="text-base font-bold text-black">Record Customer Payment</h3>
              <button
                onClick={() => setRecordOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-black mb-1">Invoice ID</label>
                <input
                  type="text"
                  required
                  value={newPayment.invoiceId}
                  onChange={(e) => setNewPayment({ ...newPayment, invoiceId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-black mb-1">Customer Account</label>
                <input
                  type="text"
                  required
                  value={newPayment.customer}
                  onChange={(e) => setNewPayment({ ...newPayment, customer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-black mb-1">Amount ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-black mb-1">Payment Date</label>
                  <input
                    type="date"
                    required
                    value={newPayment.date}
                    onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-black mb-1">Payment Method</label>
                <select
                  value={newPayment.method}
                  onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] bg-white focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                >
                  <option value="Bank Transfer (ACH)">Bank Transfer (ACH)</option>
                  <option value="Credit Card (Visa)">Credit Card (Visa)</option>
                  <option value="Credit Card (Mastercard)">Credit Card (Mastercard)</option>
                  <option value="Wire Transfer">Wire Transfer</option>
                  <option value="Stripe Checkout">Stripe Checkout</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-black mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  value={newPayment.notes}
                  onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E8E8E8]">
                <button
                  type="button"
                  onClick={() => setRecordOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-[#E8E8E8] text-neutral-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-black text-white font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Confirm & Settle in DB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
