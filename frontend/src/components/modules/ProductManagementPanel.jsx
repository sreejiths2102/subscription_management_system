import React, { useState } from 'react';
import CardLayout from './CardLayout';
import { Package, Eye, CheckCircle2 } from 'lucide-react';

export default function ProductManagementPanel({ isReadOnly = true }) {
  const [search, setSearch] = useState('');

  const stats = [
    { label: 'Active Products', value: '8', change: 'Catalog' },
    { label: 'Add-on Modules', value: '14', change: 'Available' },
    { label: 'Standard SKUs', value: '32', change: 'Active' },
    { label: 'Category Types', value: '4', change: 'Core' },
  ];

  const products = [
    {
      code: 'PRD-01',
      name: 'Brightloop Core SaaS Platform',
      category: 'Cloud Suite',
      billingType: 'Subscription Base',
      features: 'Full subscription billing, customer portal, multi-currency',
      status: 'Active',
    },
    {
      code: 'PRD-02',
      name: 'Analytics Intelligence Engine',
      category: 'Add-on Module',
      billingType: 'Usage & Tiered',
      features: 'Predictive churn scoring, cohort analysis, ARR metrics',
      status: 'Active',
    },
    {
      code: 'PRD-03',
      name: 'Enterprise Dedicated Server Instance',
      category: 'Infrastructure',
      billingType: 'Recurring Monthly',
      features: 'Isolated DB, 99.99% SLA, dedicated VPC peering',
      status: 'Active',
    },
    {
      code: 'PRD-04',
      name: 'White-Label Branding Suite',
      category: 'Customization',
      billingType: 'One-off + Maintenance',
      features: 'Custom domains, bespoke email templates, custom CSS',
      status: 'Active',
    },
    {
      code: 'PRD-05',
      name: 'High-Volume Payment Gateway Connector',
      category: 'Integration',
      billingType: 'Per-Transaction',
      features: 'Stripe, PayPal, GoCardless, Adyen multi-gateway routing',
      status: 'Active',
    },
  ];

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CardLayout
      title="Product Management"
      description="Software products, add-on modules, and feature sets available in the Brightloop product catalog (View-Only for Staff)."
      isReadOnly={isReadOnly}
      badgeText="View Only"
      stats={stats}
      secondaryAction={{
        label: 'Export Catalog',
        onClick: () => alert('Exporting product catalog...'),
      }}
      searchPlaceholder="Search product by title, code, or category..."
      searchValue={search}
      onSearchChange={(e) => setSearch(e.target.value)}
      columns={['Product Code', 'Product Name', 'Category', 'Billing Model', 'Key Features', 'Status']}
      data={filtered}
      renderRow={(prod, idx) => (
        <tr key={idx} className="hover:bg-neutral-50/70 transition-colors">
          <td className="py-3.5 px-4 font-mono font-medium text-black">{prod.code}</td>
          <td className="py-3.5 px-4 font-semibold text-black">{prod.name}</td>
          <td className="py-3.5 px-4 text-neutral-600">{prod.category}</td>
          <td className="py-3.5 px-4 text-neutral-600">{prod.billingType}</td>
          <td className="py-3.5 px-4 text-neutral-500 max-w-xs truncate">{prod.features}</td>
          <td className="py-3.5 px-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8]">
              {prod.status}
            </span>
          </td>
          <td className="py-3.5 px-4 text-right">
            <button
              onClick={() => alert(`Viewing details for ${prod.name}`)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
              title="View Product Details"
            >
              <Eye className="w-4 h-4" />
            </button>
          </td>
        </tr>
      )}
      footerText={`Showing ${filtered.length} of ${products.length} products`}
    />
  );
}
