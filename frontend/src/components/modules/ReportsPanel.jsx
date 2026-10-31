import React, { useState } from 'react';
import CardLayout from './CardLayout';
import { BarChart3, Download, FileText, CheckCircle2 } from 'lucide-react';

export default function ReportsPanel() {
  const [search, setSearch] = useState('');

  const stats = [
    { label: 'Pending Operations', value: '18 Tasks', change: 'Live Queue' },
    { label: 'Weekly Quote Closes', value: '72%', change: '+4.1%' },
    { label: 'Renewal Rate', value: '96.2%', change: 'High' },
    { label: 'Avg Invoicing Latency', value: '1.2 Days', change: 'Optimized' },
  ];

  const reports = [
    {
      code: 'REP-OPS-DAILY',
      title: 'Daily Staff Operations & Pending Queue Log',
      category: 'Operational',
      generatedDate: '31-Oct-2026',
      format: 'PDF / CSV',
      status: 'Ready',
    },
    {
      code: 'REP-RENEW-7D',
      title: 'Upcoming 7-Day Renewal Pipeline & Value',
      category: 'Renewals',
      generatedDate: '31-Oct-2026',
      format: 'PDF / Spreadsheet',
      status: 'Ready',
    },
    {
      code: 'REP-INV-AGING',
      title: 'Accounts Receivable & Aging Invoice Ledger',
      category: 'Billing',
      generatedDate: '30-Oct-2026',
      format: 'PDF / CSV',
      status: 'Ready',
    },
    {
      code: 'REP-QUOTES-MTH',
      title: 'Monthly Quotation Conversion & Expiry Report',
      category: 'Sales Ops',
      generatedDate: '28-Oct-2026',
      format: 'Spreadsheet',
      status: 'Ready',
    },
  ];

  const filtered = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CardLayout
      title="Reports & Analytics"
      description="Operational summaries, daily task audits, upcoming renewal pipelines, and pending invoice aging reports."
      stats={stats}
      secondaryAction={{
        label: 'Download Batch',
        onClick: () => alert('Generating batch report downloads...'),
      }}
      searchPlaceholder="Search operational reports by title or code..."
      searchValue={search}
      onSearchChange={(e) => setSearch(e.target.value)}
      columns={['Report Code', 'Report Title', 'Category', 'Generated Date', 'Format', 'Status']}
      data={filtered}
      renderRow={(rep, idx) => (
        <tr key={idx} className="hover:bg-neutral-50/70 transition-colors">
          <td className="py-3.5 px-4 font-mono font-medium text-black">{rep.code}</td>
          <td className="py-3.5 px-4 font-semibold text-black">{rep.title}</td>
          <td className="py-3.5 px-4 text-neutral-600">{rep.category}</td>
          <td className="py-3.5 px-4 text-neutral-600">{rep.generatedDate}</td>
          <td className="py-3.5 px-4 text-neutral-500 font-mono text-[11px]">{rep.format}</td>
          <td className="py-3.5 px-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8]">
              {rep.status}
            </span>
          </td>
          <td className="py-3.5 px-4 text-right">
            <button
              onClick={() => alert(`Downloading ${rep.title}`)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
              title="Download Report"
            >
              <Download className="w-4 h-4" />
            </button>
          </td>
        </tr>
      )}
      footerText={`Showing ${filtered.length} of ${reports.length} available reports`}
    />
  );
}
