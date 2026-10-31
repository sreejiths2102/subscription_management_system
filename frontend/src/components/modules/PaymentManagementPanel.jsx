import React, { useState } from 'react';
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
import { authService } from '../../api';

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

  // Sample Payments Data
  const [payments, setPayments] = useState([
    {
      id: 'PAY-8822',
      invoiceId: 'INV-2026-089',
      customer: 'Acme Technologies Inc.',
      customerEmail: 'billing@acme.com',
      amount: '$3,600.00',
      numericAmount: 3600,
      method: 'Bank Transfer (ACH)',
      date: '2026-10-30',
      status: 'Completed',
      reference: 'ACH-TX-9938210',
      notes: 'Annual upfront settlement cleared via JP Morgan Chase',
    },
    {
      id: 'PAY-8821',
      invoiceId: 'INV-2026-086',
      customer: 'Nexus Cloud Systems',
      customerEmail: 'finance@nexuscloud.io',
      amount: '$450.00',
      numericAmount: 450,
      method: 'Credit Card (Visa)',
      date: '2026-10-29',
      status: 'Completed',
      reference: 'STRIPE-CH-829104',
      notes: 'Automated recurring card debit',
    },
    {
      id: 'PAY-8820',
      invoiceId: 'INV-2026-085',
      customer: 'Cloudflow Networks',
      customerEmail: 'accounts@cloudflow.net',
      amount: '$890.00',
      numericAmount: 890,
      method: 'Credit Card (Mastercard)',
      date: '2026-10-28',
      status: 'Completed',
      reference: 'STRIPE-CH-194022',
      notes: 'Pro monthly renewal payment',
    },
    {
      id: 'PAY-8819',
      invoiceId: 'INV-2026-083',
      customer: 'Horizon AI Labs',
      customerEmail: 'ops@horizonai.com',
      amount: '$1,200.00',
      numericAmount: 1200,
      method: 'Wire Transfer',
      date: '2026-10-27',
      status: 'Completed',
      reference: 'WIRE-US-482019',
      notes: 'Verified against swift receipt code',
    },
    {
      id: 'PAY-8818',
      invoiceId: 'INV-2026-081',
      customer: 'Apex Global Media',
      customerEmail: 'billing@apexmedia.org',
      amount: '$540.00',
      numericAmount: 540,
      method: 'Stripe Checkout',
      date: '2026-10-22',
      status: 'Completed',
      reference: 'STRIPE-CH-661943',
      notes: 'Self-serve checkout portal payment',
    },
  ]);

  // Outstanding and Overdue Invoices
  const [pendingInvoices, setPendingInvoices] = useState([
    {
      invoiceId: 'INV-2026-088',
      customer: 'Nexus Cloud Systems',
      amount: '$450.00',
      numericAmount: 450,
      dueDate: '2026-10-29',
      status: 'Overdue',
      daysOverdue: 2,
    },
    {
      invoiceId: 'INV-2026-087',
      customer: 'Global Logistics Hub',
      amount: '$1,370.00',
      numericAmount: 1370,
      dueDate: '2026-10-25',
      status: 'Overdue',
      daysOverdue: 6,
    },
    {
      invoiceId: 'INV-2026-090',
      customer: 'Vanguard Analytics',
      amount: '$2,450.00',
      numericAmount: 2450,
      dueDate: '2026-11-10',
      status: 'Outstanding',
      daysDue: 10,
    },
    {
      invoiceId: 'INV-2026-091',
      customer: 'Starlight Media',
      amount: '$2,180.00',
      numericAmount: 2180,
      dueDate: '2026-11-15',
      status: 'Outstanding',
      daysDue: 15,
    },
  ]);

  // New Record Payment form state
  const [newPayment, setNewPayment] = useState({
    invoiceId: 'INV-2026-088',
    customer: 'Nexus Cloud Systems',
    customerEmail: 'finance@nexuscloud.io',
    amount: '450.00',
    method: 'Credit Card (Visa)',
    date: new Date().toISOString().split('T')[0],
    reference: `TX-${Date.now().toString().slice(-6)}`,
    notes: 'Manual payment recorded by staff operator',
  });

  const handleRecordPayment = (e) => {
    e.preventDefault();
    const created = {
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceId: newPayment.invoiceId,
      customer: newPayment.customer,
      customerEmail: newPayment.customerEmail,
      amount: `$${parseFloat(newPayment.amount).toFixed(2)}`,
      numericAmount: parseFloat(newPayment.amount),
      method: newPayment.method,
      date: newPayment.date,
      status: 'Completed',
      reference: newPayment.reference,
      notes: newPayment.notes,
    };

    setPayments([created, ...payments]);
    // Remove or resolve from pending invoices if matched
    setPendingInvoices(pendingInvoices.filter((inv) => inv.invoiceId !== newPayment.invoiceId));
    setRecordOpen(false);
    setActionSuccess(`Payment ${created.id} recorded successfully!`);
    setTimeout(() => setActionSuccess(''), 3500);
  };

  const notifyReminder = (invId) => {
    setActionSuccess(`Payment reminder email dispatched for invoice ${invId}`);
    setTimeout(() => setActionSuccess(''), 3500);
  };

  // Filter payments
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.invoiceId.toLowerCase().includes(search.toLowerCase()) ||
      p.customer.toLowerCase().includes(search.toLowerCase());

    const matchesMethod =
      methodFilter === 'All' || p.method.toLowerCase().includes(methodFilter.toLowerCase());

    let matchesDate = true;
    if (dateFilter === 'Last 7 Days') {
      matchesDate = new Date(p.date) >= new Date('2026-10-24');
    } else if (dateFilter === 'October 2026') {
      matchesDate = p.date.startsWith('2026-10');
    }

    if (isCustomer) {
      return matchesSearch && matchesMethod && matchesDate && p.customer.includes('Acme');
    }

    return matchesSearch && matchesMethod && matchesDate;
  });

  // KPI Computations
  const totalReceived = payments.reduce((sum, p) => sum + p.numericAmount, 0);
  const outstandingAmount = pendingInvoices
    .filter((inv) => inv.status === 'Outstanding')
    .reduce((sum, inv) => sum + inv.numericAmount, 0);
  const overdueAmount = pendingInvoices
    .filter((inv) => inv.status === 'Overdue')
    .reduce((sum, inv) => sum + inv.numericAmount, 0);

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
              : 'Record customer settlements, track payment gateway transactions, and audit overdue balances.'}
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
          <span className="text-[11px] font-medium text-neutral-400 mt-1 block">Cleared transactions</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E8E8] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Total Amount Received</span>
            <div className="w-7 h-7 rounded-lg bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-black mt-2">
            ${totalReceived.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] font-medium text-[#788A5B] mt-1 block">+18.5% vs last month</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E8E8] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Outstanding Amount</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-black mt-2">
            ${outstandingAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] font-medium text-amber-600 mt-1 block">
            {pendingInvoices.filter((i) => i.status === 'Outstanding').length} awaiting payment
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E8E8] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Overdue Amount</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-600 mt-2">
            ${overdueAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
              <option value="Stripe">Stripe Checkout</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-neutral-500 border border-[#E8E8E8] rounded-xl px-2.5 py-1.5 bg-white">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent border-none text-xs text-black focus:outline-none cursor-pointer"
            >
              <option value="All">All Time</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="October 2026">October 2026</option>
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
                    No matching payment transactions found.
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
                Outstanding and overdue accounts requiring collection follow-ups or manual settlement records.
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
                          {inv.daysOverdue}d Overdue
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3" />
                          Due in {inv.daysDue}d
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
                <span className="text-neutral-500 font-mono text-[11px]">{selectedPayment.customerEmail}</span>
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
              <div className="col-span-2">
                <span className="text-neutral-400 block font-medium">Staff Internal Notes</span>
                <p className="text-neutral-600 mt-0.5">{selectedPayment.notes}</p>
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
                <label className="block font-semibold text-black mb-1">Transaction Reference</label>
                <input
                  type="text"
                  required
                  value={newPayment.reference}
                  onChange={(e) => setNewPayment({ ...newPayment, reference: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
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
                  Confirm & Settle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
