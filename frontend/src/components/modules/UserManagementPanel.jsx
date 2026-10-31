import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  UserX,
  CheckCircle2,
  X,
  ShieldCheck,
  Briefcase,
  User as UserIcon,
  AlertCircle
} from 'lucide-react';
import { authService } from '../../api';

export default function UserManagementPanel({ userRole: propRole }) {
  const currentUser = authService.getUser() || { role: 'admin' };
  const role = propRole || currentUser.role || 'admin';
  const isAdmin = role === 'admin';
  const isStaff = role === 'staff';

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createStaffOpen, setCreateStaffOpen] = useState(false);

  // Sample User Data
  const [users, setUsers] = useState([
    {
      id: 'USR-1001',
      name: 'System Administrator',
      email: 'admin@subscription.com',
      role: 'admin',
      registeredDate: 'Oct 01, 2026',
      status: 'Active',
      phone: '+1 (555) 019-2834',
      company: 'Brightloop Software HQ'
    },
    {
      id: 'USR-1002',
      name: 'Sarah Jenkins',
      email: 'sarah.ops@brightloop.com',
      role: 'staff',
      registeredDate: 'Oct 05, 2026',
      status: 'Active',
      phone: '+1 (555) 014-9921',
      company: 'Brightloop Operations'
    },
    {
      id: 'USR-1003',
      name: 'David Vance',
      email: 'david.support@brightloop.com',
      role: 'staff',
      registeredDate: 'Oct 12, 2026',
      status: 'Active',
      phone: '+1 (555) 018-4491',
      company: 'Customer Success'
    },
    {
      id: 'USR-1004',
      name: 'Alex Johnson',
      email: 'alex.test@example.com',
      role: 'customer',
      registeredDate: 'Oct 15, 2026',
      status: 'Active',
      phone: '+1 (555) 012-7711',
      company: 'Acme Technologies Inc.'
    },
    {
      id: 'USR-1005',
      name: 'Elena Rostova',
      email: 'elena@nexuscloud.io',
      role: 'customer',
      registeredDate: 'Oct 20, 2026',
      status: 'Active',
      phone: '+1 (555) 019-3320',
      company: 'Nexus Cloud Systems'
    },
    {
      id: 'USR-1006',
      name: 'Marcus Brody',
      email: 'marcus@vertexmedia.com',
      role: 'customer',
      registeredDate: 'Oct 22, 2026',
      status: 'Inactive',
      phone: '+1 (555) 017-8842',
      company: 'Vertex Media Global'
    }
  ]);

  // Form state for creating staff
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  // Filtered Users (Staff only sees customers if not admin)
  const accessibleUsers = users.filter((u) => {
    if (isStaff) return u.role === 'customer';
    return true;
  });

  const filteredUsers = accessibleUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || u.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Summary counts
  const totalCustomers = users.filter((u) => u.role === 'customer').length;
  const totalStaff = users.filter((u) => u.role === 'staff').length;
  const activeUsers = users.filter((u) => u.status === 'Active').length;

  const handleDeactivate = (userId) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u))
    );
  };

  const handleCreateStaff = (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return;
    const created = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newStaff.name,
      email: newStaff.email,
      role: 'staff',
      registeredDate: 'Oct 31, 2026',
      status: 'Active',
      phone: newStaff.phone || '+1 (555) 010-0000',
      company: 'Brightloop Staff'
    };
    setUsers([created, ...users]);
    setNewStaff({ name: '', email: '', phone: '', password: '' });
    setCreateStaffOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#788A5B]">Platform Administration</span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs font-medium text-neutral-500">Access Control</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-black">User Management</h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
            {isAdmin
              ? 'Complete user directory with full privileges to manage administrator, staff operators, and customer accounts.'
              : 'Customer user accounts directory and contact records (Staff limited view).'}
          </p>
        </div>

        {/* 8. Create Staff Button (Admin only) */}
        {isAdmin && (
          <button
            onClick={() => setCreateStaffOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#788A5B]" />
            Create Staff Member
          </button>
        )}
      </div>

      {/* 2. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500">Total Customers</span>
            <h3 className="text-2xl font-bold tracking-tight text-black mt-1">{totalCustomers}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center border border-[#E8E8E8]">
            <UserIcon className="w-5 h-5" />
          </div>
        </div>

        {isAdmin && (
          <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-neutral-500">Total Staff</span>
              <h3 className="text-2xl font-bold tracking-tight text-black mt-1">{totalStaff}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center border border-[#E8E8E8]">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-500">Active Users</span>
            <h3 className="text-2xl font-bold tracking-tight text-black mt-1">{activeUsers}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F2F4ED] text-[#788A5B] flex items-center justify-center border border-[#E8E8E8]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Table Container with Filters */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden">
        {/* 3, 4, 5. Search Bar & Filters */}
        <div className="p-4 border-b border-[#E8E8E8] flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-[#F2F4ED]/30">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user by name, email or ID..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs text-black placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#788A5B] focus:border-[#788A5B]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 4. Role Filter (Admins only see admin/staff options) */}
            {isAdmin && (
              <div className="flex items-center gap-1.5 text-xs text-neutral-600 bg-white px-2.5 py-1.5 rounded-xl border border-[#E8E8E8]">
                <Filter className="w-3.5 h-3.5 text-[#788A5B]" />
                <span>Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-transparent font-medium text-black focus:outline-none cursor-pointer"
                >
                  <option value="All">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
            )}

            {/* 5. Status Filter */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-600 bg-white px-2.5 py-1.5 rounded-xl border border-[#E8E8E8]">
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent font-medium text-black focus:outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* 6. User Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
              <tr>
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Registration Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-neutral-400">
                    No matching users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-black">{user.id}</td>
                    <td className="py-3.5 px-4 font-medium text-black">{user.name}</td>
                    <td className="py-3.5 px-4 text-neutral-600">{user.email}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                          user.role === 'admin'
                            ? 'bg-black text-white border-black'
                            : user.role === 'staff'
                            ? 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]'
                            : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500">{user.registeredDate}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          user.status === 'Active'
                            ? 'bg-[#F2F4ED] text-[#788A5B] border-[#E8E8E8]'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    {/* 7. Action Buttons */}
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setDetailsDialogOpen(true);
                        }}
                        className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {(isAdmin || (isStaff && user.role === 'customer')) && (
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setEditDialogOpen(true);
                          }}
                          className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                          title="Edit User"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {isAdmin && user.role !== 'admin' && (
                        <button
                          onClick={() => handleDeactivate(user.id)}
                          className="p-1 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8E8E8] flex items-center justify-between text-xs text-neutral-500 bg-white">
          <span>Showing {filteredUsers.length} of {accessibleUsers.length} users</span>
        </div>
      </div>

      {/* User Details Dialog */}
      {detailsDialogOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">User Profile Details</h3>
              <button onClick={() => setDetailsDialogOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="text-neutral-400 block">User ID</span>
                <span className="font-mono font-medium text-black">{selectedUser.id}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Full Name</span>
                <span className="font-semibold text-black text-sm">{selectedUser.name}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Email Address</span>
                <span className="text-neutral-800">{selectedUser.email}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Assigned Role</span>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8]">
                  {selectedUser.role}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block">Company / Organization</span>
                <span className="text-neutral-800">{selectedUser.company}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Phone Contact</span>
                <span className="text-neutral-800">{selectedUser.phone}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Registration Timestamp</span>
                <span className="text-neutral-800">{selectedUser.registeredDate}</span>
              </div>
            </div>
            <div className="mt-6 pt-3 border-t border-[#E8E8E8] flex justify-end">
              <button
                onClick={() => setDetailsDialogOpen(false)}
                className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Dialog */}
      {editDialogOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">Edit User Details</h3>
              <button onClick={() => setEditDialogOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEditDialogOpen(false);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={selectedUser.name}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Email Address</label>
                <input
                  type="email"
                  defaultValue={selectedUser.email}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Status</label>
                <select
                  defaultValue={selectedUser.status}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E8E8E8] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditDialogOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#E8E8E8] text-neutral-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-black text-white font-semibold hover:bg-neutral-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Staff Dialog (Admin Only) */}
      {createStaffOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">Create Staff Member</h3>
              <button onClick={() => setCreateStaffOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateStaff} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="e.g. Jason Miller"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Staff Email *</label>
                <input
                  type="email"
                  required
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  placeholder="staff@brightloop.com"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Direct Phone</label>
                <input
                  type="text"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  placeholder="+1 (555) 012-3456"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Initial Password</label>
                <input
                  type="password"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div className="mt-5 pt-3 border-t border-[#E8E8E8] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateStaffOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#E8E8E8] text-neutral-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-black text-white font-semibold hover:bg-neutral-800"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
