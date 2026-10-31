import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Pause,
  Play,
  RotateCcw,
  XCircle,
  X,
  History,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { authService, subscriptionService } from '../../api';

export default function SubscriptionManagementPanel({ userRole: propRole, isCustomerView: propCustomerView }) {
  const currentUser = authService.getUser() || { role: 'admin' };
  const role = propRole || currentUser.role || 'admin';
  const isCustomer = propCustomerView || role === 'customer';
  const isAdmin = role === 'admin';
  const isStaff = role === 'staff';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [intervalFilter, setIntervalFilter] = useState('All');
  const [selectedSub, setSelectedSub] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [subscriptions, setSubscriptions] = useState([]);

  const [formData, setFormData] = useState({
    customer: '',
    plan: 'Professional Team Monthly',
    interval: 'Monthly',
    rate: '$149.00 / mo'
  });

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getAll({
        search,
        status_filter: statusFilter
      });
      setSubscriptions(data || []);
    } catch (err) {
      console.error('Failed to load subscriptions from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [search, statusFilter]);

  // Filter out other customers if customer view
  const visibleSubs = isCustomer
    ? subscriptions.filter((s) => s.customer.toLowerCase().includes((currentUser.name || '').toLowerCase()) || s.id === 'SUB-2040')
    : subscriptions;

  const filteredSubs = visibleSubs.filter((s) => {
    const matchesInterval = intervalFilter === 'All' || s.interval?.toLowerCase() === intervalFilter.toLowerCase();
    return matchesInterval;
  });

  const totalSubs = visibleSubs.length;
  const activeSubs = visibleSubs.filter((s) => s.status === 'Active').length;
  const pausedSubs = visibleSubs.filter((s) => s.status === 'Paused').length;
  const expiringSubs = visibleSubs.filter((s) => s.status === 'Expiring' || s.status === 'Upcoming Renewal').length;

  // Actions connecting to PostgreSQL
  const handlePause = async (id) => {
    try {
      await subscriptionService.updateAction(id, 'pause');
      await fetchSubscriptions();
      if (selectedSub?.id === id) {
        setSelectedSub({ ...selectedSub, status: 'Paused', nextBillingDate: 'Paused' });
      }
    } catch (err) {
      alert('Failed to pause: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleResume = async (id) => {
    try {
      await subscriptionService.updateAction(id, 'resume');
      await fetchSubscriptions();
      if (selectedSub?.id === id) {
        setSelectedSub({ ...selectedSub, status: 'Active', nextBillingDate: 'Nov 30, 2026' });
      }
    } catch (err) {
      alert('Failed to resume: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleRenew = async (id) => {
    try {
      await subscriptionService.updateAction(id, 'renew');
      await fetchSubscriptions();
      alert(`Subscription ${id} renewed in database successfully!`);
      if (selectedSub?.id === id) {
        setSelectedSub({ ...selectedSub, status: 'Active', expiryDate: 'Nov 30, 2027' });
      }
    } catch (err) {
      alert('Failed to renew: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleClose = async (id) => {
    if (window.confirm('Are you sure you want to terminate/close this subscription?')) {
      try {
        await subscriptionService.updateAction(id, 'close');
        await fetchSubscriptions();
        if (selectedSub?.id === id) {
          setSelectedSub({ ...selectedSub, status: 'Closed' });
        }
      } catch (err) {
        alert('Failed to close: ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await subscriptionService.create({
        customer: isCustomer ? currentUser.name : formData.customer,
        plan: formData.plan,
        interval: formData.interval,
        rate: formData.rate
      });
      setCreateOpen(false);
      setFormData({ customer: '', plan: 'Professional Team Monthly', interval: 'Monthly', rate: '$149.00 / mo' });
      await fetchSubscriptions();
    } catch (err) {
      alert('Failed to provision subscription: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#788A5B]">Lifecycle Desk</span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs font-medium text-neutral-500">
              {isCustomer ? 'Customer Portal' : 'PostgreSQL Live Agreements'}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-black">
            {isCustomer ? 'My Subscriptions' : 'Subscription Management'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
            {isCustomer
              ? 'Review your active recurring service plans, renewal schedules, and self-service controls.'
              : 'Full lifecycle administration: activate, pause, resume, extend, or terminate recurring agreements stored in the database.'}
          </p>
        </div>

        {/* Create Subscription Button (Admin + Staff) */}
        {!isCustomer && (
          <button
            onClick={() => setCreateOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-[#788A5B]" />
            Create Subscription
          </button>
        )}
      </div>

      {/* 2. Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500">Total Subscriptions</span>
            <h3 className="text-2xl font-bold tracking-tight text-black mt-1">{totalSubs}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center border border-[#E8E8E8]">
            <RefreshCw className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500">Active Licenses</span>
            <h3 className="text-2xl font-bold tracking-tight text-[#788A5B] mt-1">{activeSubs}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center border border-[#E8E8E8]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500">Paused Services</span>
            <h3 className="text-2xl font-bold tracking-tight text-amber-700 mt-1">{pausedSubs}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500">Upcoming Renewal</span>
            <h3 className="text-2xl font-bold tracking-tight text-neutral-800 mt-1">{expiringSubs}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center border border-[#E8E8E8]">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden">
        {/* Search & Filters */}
        <div className="p-4 border-b border-[#E8E8E8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#F2F4ED]/30">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subscription ID or plan..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs text-black placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-neutral-600 bg-white px-2.5 py-1.5 rounded-xl border border-[#E8E8E8]">
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent font-medium text-black focus:outline-none cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Upcoming Renewal">Upcoming Renewal</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-neutral-600 bg-white px-2.5 py-1.5 rounded-xl border border-[#E8E8E8]">
              <span>Cadence:</span>
              <select
                value={intervalFilter}
                onChange={(e) => setIntervalFilter(e.target.value)}
                className="bg-transparent font-medium text-black focus:outline-none cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subscription Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
              <tr>
                <th className="py-3 px-4">Subscription ID</th>
                {!isCustomer && <th className="py-3 px-4">Customer</th>}
                <th className="py-3 px-4">Plan Name</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Next Billing Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
              {filteredSubs.length === 0 ? (
                <tr>
                  <td colSpan={isCustomer ? 7 : 8} className="py-6 text-center text-neutral-400">
                    No subscriptions matching the filter criteria found in database.
                  </td>
                </tr>
              ) : (
                filteredSubs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-black">{sub.id}</td>
                    {!isCustomer && <td className="py-3.5 px-4 font-semibold text-black">{sub.customer}</td>}
                    <td className="py-3.5 px-4 font-medium text-black">{sub.plan}</td>
                    <td className="py-3.5 px-4 text-neutral-500">{sub.startDate}</td>
                    <td className="py-3.5 px-4 text-neutral-500">{sub.expiryDate}</td>
                    <td className="py-3.5 px-4 text-neutral-700 font-medium">{sub.nextBillingDate}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          sub.status === 'Active'
                            ? 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]'
                            : sub.status === 'Paused'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      {/* Details Dialog trigger */}
                      <button
                        onClick={() => {
                          setSelectedSub(sub);
                          setDetailsOpen(true);
                        }}
                        className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                        title="View Subscription Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit Button (Admin + Staff) */}
                      {!isCustomer && (
                        <button
                          onClick={() => {
                            setSelectedSub(sub);
                            setEditOpen(true);
                          }}
                          className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                          title="Edit Subscription"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Pause / Resume */}
                      {sub.status === 'Active' ? (
                        <button
                          onClick={() => handlePause(sub.id)}
                          className="p-1 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors"
                          title="Pause Subscription"
                        >
                          <Pause className="w-3.5 h-3.5" />
                        </button>
                      ) : sub.status === 'Paused' ? (
                        <button
                          onClick={() => handleResume(sub.id)}
                          className="p-1 rounded-lg text-[#788A5B] hover:bg-[#F2F4ED] transition-colors"
                          title="Resume Subscription"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      ) : null}

                      {/* Renew Button */}
                      <button
                        onClick={() => handleRenew(sub.id)}
                        className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                        title="Renew Subscription"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      {/* Close Subscription Button */}
                      {!isCustomer && sub.status !== 'Closed' && (
                        <button
                          onClick={() => handleClose(sub.id)}
                          className="p-1 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          title="Close / Cancel Subscription"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscription Details Dialog */}
      {detailsOpen && selectedSub && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <div>
                <h3 className="text-base font-bold text-black">{selectedSub.plan}</h3>
                <span className="font-mono text-[11px] text-neutral-400">{selectedSub.id}</span>
              </div>
              <button onClick={() => setDetailsOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-neutral-50 border border-[#E8E8E8]">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">Billed Rate</span>
                  <p className="text-base font-bold text-black">{selectedSub.rate}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8]">
                  {selectedSub.status}
                </span>
              </div>

              {!isCustomer && (
                <div>
                  <span className="text-neutral-400 block">Customer Account</span>
                  <span className="font-semibold text-black">{selectedSub.customer}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-neutral-400 block">Start Date</span>
                  <span className="text-neutral-700">{selectedSub.startDate}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Next Renewal</span>
                  <span className="text-neutral-700">{selectedSub.nextBillingDate}</span>
                </div>
              </div>

              {/* Lifecycle Event History */}
              {!isCustomer && selectedSub.history && (
                <div className="pt-2">
                  <span className="text-neutral-500 font-semibold block mb-1.5 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-[#788A5B]" /> Lifecycle Event History
                  </span>
                  <div className="bg-neutral-50 rounded-xl p-3 border border-[#E8E8E8] space-y-2">
                    {selectedSub.history.map((h, idx) => (
                      <div key={idx} className="flex justify-between text-[11px]">
                        <span className="text-black">{h.action}</span>
                        <span className="text-neutral-400">{h.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions Footer inside dialog */}
            <div className="mt-6 pt-3 border-t border-[#E8E8E8] flex justify-between items-center">
              <div className="space-x-1.5">
                {selectedSub.status === 'Active' ? (
                  <button
                    onClick={() => handlePause(selectedSub.id)}
                    className="px-3 py-1.5 rounded-xl border border-[#E8E8E8] text-xs font-medium text-amber-700 hover:bg-amber-50"
                  >
                    Pause
                  </button>
                ) : selectedSub.status === 'Paused' ? (
                  <button
                    onClick={() => handleResume(selectedSub.id)}
                    className="px-3 py-1.5 rounded-xl border border-[#E8E8E8] text-xs font-medium text-[#788A5B] hover:bg-[#F2F4ED]"
                  >
                    Resume
                  </button>
                ) : null}

                <button
                  onClick={() => handleRenew(selectedSub.id)}
                  className="px-3 py-1.5 rounded-xl border border-[#E8E8E8] text-xs font-medium text-neutral-700 hover:text-black"
                >
                  Renew
                </button>
              </div>

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

      {/* Edit Subscription Dialog */}
      {editOpen && selectedSub && !isCustomer && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">Edit Subscription #{selectedSub.id}</h3>
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
                <label className="block font-medium text-neutral-700 mb-1">Customer</label>
                <input
                  type="text"
                  defaultValue={selectedSub.customer}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Assigned Plan</label>
                <input
                  type="text"
                  defaultValue={selectedSub.plan}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Billing Rate</label>
                <input
                  type="text"
                  defaultValue={selectedSub.rate}
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
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Subscription Dialog (Admin + Staff) */}
      {createOpen && !isCustomer && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">Provision New Subscription</h3>
              <button onClick={() => setCreateOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="mt-4 space-y-3 text-xs">
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
                <label className="block font-medium text-neutral-700 mb-1">Subscription Plan</label>
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B] bg-white"
                >
                  <option value="Professional Team Monthly">Professional Team Monthly ($149.00/mo)</option>
                  <option value="Enterprise Yearly Suite">Enterprise Yearly Suite ($3,600.00/yr)</option>
                  <option value="Starter Cloud Monthly">Starter Cloud Monthly ($49.00/mo)</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Billing Interval</label>
                <select
                  value={formData.interval}
                  onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B] bg-white"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Quarterly">Quarterly</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Rate Breakdown</label>
                <input
                  type="text"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
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
                  Provision Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
