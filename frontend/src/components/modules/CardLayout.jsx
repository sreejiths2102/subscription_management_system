import React from 'react';
import { Search, Filter, Download, MoreVertical, Eye, Lock } from 'lucide-react';

export default function CardLayout({
  title,
  description,
  badgeText,
  isReadOnly = false,
  stats = [],
  primaryAction,
  secondaryAction,
  searchPlaceholder = 'Search records...',
  searchValue = '',
  onSearchChange,
  filterOptions = [],
  activeFilter = 'All',
  onFilterChange,
  columns = [],
  data = [],
  renderRow,
  footerText,
  children,
}) {
  return (
    <div className="space-y-6">
      {/* 1. Header Banner Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#788A5B]">
              Operational Module
            </span>
            <span className="text-neutral-300">•</span>
            {isReadOnly ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8]">
                <Lock className="w-3 h-3" /> View Only
              </span>
            ) : (
              <span className="text-xs font-medium text-neutral-500">Live Management</span>
            )}
            {badgeText && !isReadOnly && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8]">
                {badgeText}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-black">{title}</h2>
          {description && (
            <p className="text-xs text-neutral-500 mt-1 max-w-2xl leading-relaxed">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="px-3.5 py-2 rounded-xl border border-[#E8E8E8] bg-white text-xs font-semibold text-neutral-700 hover:text-black hover:border-neutral-300 transition-colors shadow-2xs flex items-center gap-1.5"
            >
              {secondaryAction.icon || <Download className="w-3.5 h-3.5" />}
              {secondaryAction.label || 'Export'}
            </button>
          )}

          {primaryAction && !isReadOnly && (
            <button
              onClick={primaryAction.onClick}
              className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-2xs flex items-center gap-1.5 focus:ring-2 focus:ring-[#788A5B] focus:outline-none"
            >
              {primaryAction.icon}
              {primaryAction.label}
            </button>
          )}

          {isReadOnly && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E8E8E8] bg-[#F2F4ED]/60 text-xs font-medium text-neutral-600">
              <Eye className="w-3.5 h-3.5 text-[#788A5B]" />
              <span>Read-Only Access</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Quick KPI / Metrics Row */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 border border-[#E8E8E8] shadow-xs hover:border-neutral-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500">{s.label}</span>
                {s.change && (
                  <span className="text-[11px] font-semibold text-[#788A5B] bg-[#F2F4ED] px-1.5 py-0.5 rounded-md">
                    {s.change}
                  </span>
                )}
              </div>
              <p className="text-xl font-bold tracking-tight text-black mt-1.5">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* 3. Main Content: Custom Children or Standard Data Table */}
      {children ? (
        children
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs overflow-hidden">
          {/* Filter and Search Bar */}
          <div className="p-4 border-b border-[#E8E8E8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#F2F4ED]/30">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                value={searchValue}
                onChange={onSearchChange}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E8E8] bg-white text-xs text-black placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#788A5B] focus:border-[#788A5B]"
              />
            </div>

            <div className="flex items-center gap-2">
              {filterOptions.length > 0 ? (
                <div className="flex items-center gap-1.5 p-0.5 rounded-xl border border-[#E8E8E8] bg-white">
                  {filterOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => onFilterChange && onFilterChange(opt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        activeFilter === opt
                          ? 'bg-[#F2F4ED] text-black font-semibold'
                          : 'text-neutral-600 hover:text-black'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <button className="px-3 py-2 rounded-xl border border-[#E8E8E8] bg-white text-xs font-medium text-neutral-700 hover:text-black flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#788A5B]" /> Filter
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F2F4ED]/60 text-neutral-600 font-semibold border-b border-[#E8E8E8]">
                <tr>
                  {columns.map((col, cIdx) => (
                    <th key={cIdx} className="py-3 px-4 font-semibold text-neutral-700">
                      {col}
                    </th>
                  ))}
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8] text-neutral-800">
                {data.map((row, rIdx) =>
                  renderRow ? (
                    renderRow(row, rIdx)
                  ) : (
                    <tr key={rIdx} className="hover:bg-neutral-50/70 transition-colors">
                      {Object.keys(row)
                        .filter((k) => k !== 'status' && k !== 'id')
                        .map((key, kIdx) => (
                          <td key={kIdx} className="py-3.5 px-4 font-medium">
                            {row[key]}
                          </td>
                        ))}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F2F4ED] text-[#788A5B] border border-[#E8E8E8]">
                          {row.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 border-t border-[#E8E8E8] flex items-center justify-between text-xs text-neutral-500 bg-white">
            <span>{footerText || `Showing ${data.length} records`}</span>
            <div className="flex items-center gap-1">
              <button
                disabled
                className="px-2.5 py-1 rounded-lg border border-[#E8E8E8] text-neutral-300 cursor-not-allowed"
              >
                Previous
              </button>
              <button className="px-2.5 py-1 rounded-lg bg-black text-white font-medium">1</button>
              <button
                disabled
                className="px-2.5 py-1 rounded-lg border border-[#E8E8E8] text-neutral-300 cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

