import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Layers,
  X,
  Lock,
  DollarSign
} from 'lucide-react';
import { authService, productService } from '../../api';

export default function ProductManagementPanel({ userRole: propRole }) {
  const currentUser = authService.getUser() || { role: 'admin' };
  const role = propRole || currentUser.role || 'admin';
  const isAdmin = role === 'admin';

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [variantsOpen, setVariantsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Software Suite',
    salesPrice: '',
    costPrice: '',
    description: ''
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll({
        search,
        product_type: typeFilter !== 'All' ? typeFilter : undefined
      });
      const mapped = (data || []).map((p) => ({
        id: p.code || `PRD-${p.id}`,
        db_id: p.id,
        name: p.name,
        type: p.product_type || 'Software Suite',
        salesPrice: `$${parseFloat(p.sales_price || 0).toFixed(2)}`,
        costPrice: `$${parseFloat(p.cost_price || 0).toFixed(2)}`,
        rawSales: parseFloat(p.sales_price || 0),
        rawCost: parseFloat(p.cost_price || 0),
        variantsCount: (p.variants || []).length,
        description: p.description || 'Software product offering.',
        variants: (p.variants || []).map((v) => ({
          code: v.sku || `VAR-${v.id}`,
          name: v.name,
          multiplier: `+$${parseFloat(v.additional_price || 0).toFixed(2)}`,
          active: v.is_active
        }))
      }));
      setProducts(mapped);
    } catch (err) {
      console.error('Failed to load products from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, typeFilter]);

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (window.confirm('Are you sure you want to delete/deactivate this product?')) {
      try {
        const p = products.find((item) => item.id === id);
        if (p?.db_id) {
          await productService.delete(p.db_id);
          await fetchProducts();
        }
      } catch (err) {
        alert('Failed to delete product: ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      await productService.create({
        name: formData.name,
        product_type: formData.type,
        sales_price: parseFloat(formData.salesPrice.replace(/[^0-9.]/g, '') || 0),
        cost_price: parseFloat(formData.costPrice.replace(/[^0-9.]/g, '') || 0),
        description: formData.description,
        variants: [
          { name: 'Standard Single Seat', sku: `SKU-${Date.now().toString().slice(-4)}`, additional_price: 0.0 }
        ]
      });
      setFormData({ name: '', type: 'Software Suite', salesPrice: '', costPrice: '', description: '' });
      setCreateOpen(false);
      await fetchProducts();
    } catch (err) {
      alert('Failed to create product: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#788A5B]">Catalog Management</span>
            <span className="text-neutral-300">•</span>
            {isAdmin ? (
              <span className="text-xs font-medium text-neutral-500">PostgreSQL Full CRUD Control</span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F2F4ED] text-[#788A5B]">
                <Lock className="w-3 h-3" /> Staff View Only
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Product Management</h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
            {isAdmin
              ? 'Create, edit, and configure software products, tier variants, cost margins, and pricing suites in PostgreSQL.'
              : 'View authorized software products and available variants.'}
          </p>
        </div>

        {/* Create Product Button (Admin only) */}
        {isAdmin && (
          <button
            onClick={() => setCreateOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-[#788A5B]" />
            Create Product
          </button>
        )}
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden">
        {/* Search and Type Filter */}
        <div className="p-4 border-b border-[#E8E8E8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#F2F4ED]/30">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by title or ID..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs text-black placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-600">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#E8E8E8] bg-white text-xs font-medium text-black focus:outline-none cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Software Suite">Software Suite</option>
              <option value="Add-on Module">Add-on Module</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Customization">Customization</option>
            </select>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
              <tr>
                <th className="py-3 px-4">Product ID</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Product Type</th>
                <th className="py-3 px-4">Sales Price</th>
                <th className="py-3 px-4">Cost Price</th>
                <th className="py-3 px-4 text-center">Variants</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-neutral-400">
                    No products found in database.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-black">{p.id}</td>
                    <td className="py-3.5 px-4 font-medium text-black">{p.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8]">
                        {p.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-black">{p.salesPrice}</td>
                    <td className="py-3.5 px-4 text-neutral-500">{p.costPrice}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedProduct(p);
                          setVariantsOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border border-[#E8E8E8] bg-white hover:border-black text-[11px] font-medium transition-colors"
                      >
                        <Layers className="w-3 h-3 text-[#788A5B]" />
                        <span>{p.variantsCount} variants</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => {
                          setSelectedProduct(p);
                          setDetailsOpen(true);
                        }}
                        className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedProduct(p);
                              setEditOpen(true);
                            }}
                            className="p-1 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-1 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Dialog */}
      {detailsOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">Product Overview</h3>
              <button onClick={() => setDetailsOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="text-neutral-400 block">Product ID</span>
                <span className="font-mono font-medium text-black">{selectedProduct.id}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Product Name</span>
                <span className="font-semibold text-black text-sm">{selectedProduct.name}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Classification Type</span>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8]">
                  {selectedProduct.type}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-neutral-50 border border-[#E8E8E8]">
                  <span className="text-neutral-400 block text-[10px]">Sales Price</span>
                  <span className="text-sm font-bold text-black">{selectedProduct.salesPrice}</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-50 border border-[#E8E8E8]">
                  <span className="text-neutral-400 block text-[10px]">Cost Price</span>
                  <span className="text-sm font-bold text-neutral-600">{selectedProduct.costPrice}</span>
                </div>
              </div>
              <div>
                <span className="text-neutral-400 block">Description</span>
                <p className="text-neutral-700 leading-relaxed mt-0.5">{selectedProduct.description}</p>
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

      {/* Product Variants Dialog */}
      {variantsOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <div>
                <h3 className="text-base font-bold text-black">Variants for {selectedProduct.name}</h3>
                <span className="text-[11px] text-neutral-500">
                  {isAdmin ? 'Admin Management Mode' : 'Staff View Only'}
                </span>
              </div>
              <button onClick={() => setVariantsOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {selectedProduct.variants?.length === 0 ? (
                <p className="text-xs text-neutral-400 py-3 text-center">No variants attached to this product.</p>
              ) : (
                selectedProduct.variants?.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-[#E8E8E8] bg-white flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono text-neutral-400 mr-2">{v.code}</span>
                      <span className="font-medium text-black">{v.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500">Price Adjust: {v.multiplier}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8]">
                        Active
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-[#E8E8E8] flex justify-end">
              <button
                onClick={() => setVariantsOpen(false)}
                className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Product Dialog (Admin Only) */}
      {createOpen && isAdmin && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E8E8] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <h3 className="text-base font-bold text-black">Create Catalog Product</h3>
              <button onClick={() => setCreateOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Workflow Automator Suite"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                />
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Classification Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B] bg-white"
                >
                  <option value="Software Suite">Software Suite</option>
                  <option value="Add-on Module">Add-on Module</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Customization">Customization</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Sales Price *</label>
                  <input
                    type="text"
                    required
                    value={formData.salesPrice}
                    onChange={(e) => setFormData({ ...formData, salesPrice: e.target.value })}
                    placeholder="$199.00"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Cost Price *</label>
                  <input
                    type="text"
                    required
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    placeholder="$35.00"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-neutral-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Operational details and license terms..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] focus:outline-none focus:ring-1 focus:ring-[#788A5B]"
                ></textarea>
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
                  Save Product in DB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
