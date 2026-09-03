"use client";

import { Search, Filter, ArrowUpDown, Users, ListFilter } from "lucide-react";

interface DebtFilterProps {
  statusFilter: string;
  typeFilter: string;
  searchQuery: string;
  sortOption: string;
  viewMode: "list" | "grouped";
  onStatusChange: (status: string) => void;
  onTypeChange: (type: string) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: string) => void;
  onViewModeChange: (mode: "list" | "grouped") => void;
}

export function DebtFilter({
  statusFilter,
  typeFilter,
  searchQuery,
  sortOption,
  viewMode,
  onStatusChange,
  onTypeChange,
  onSearchChange,
  onSortChange,
  onViewModeChange,
}: DebtFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5 py-1">
      {/* Search Input (Cardless) */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Cari nama orang..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#D94E15] focus:ring-1 focus:ring-[#D94E15] shadow-xs transition-colors"
        />
      </div>

      {/* Select Controls & View Switcher (Cardless Toolbar) */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-zinc-700 font-medium shadow-xs">
          <Filter className="w-3.5 h-3.5 text-[#D94E15]" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="unsettled">Belum Lunas</option>
            <option value="settled">Lunas</option>
          </select>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-zinc-700 font-medium shadow-xs">
          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            className="bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Tipe</option>
            <option value="owed_to_me">Dihutang ke saya</option>
            <option value="i_owe">Saya hutang</option>
          </select>
        </div>

        {/* Sort Option */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-zinc-700 font-medium shadow-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="created_desc">Terbaru</option>
            <option value="created_asc">Terlama</option>
            <option value="amount_desc">Jumlah Tertinggi</option>
            <option value="amount_asc">Jumlah Terendah</option>
          </select>
        </div>

        {/* View Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-white border border-zinc-200 shadow-xs">
          <button
            onClick={() => onViewModeChange("list")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              viewMode === "list"
                ? "bg-[#FFF4ED] text-[#D94E15]"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Semua</span>
          </button>
          <button
            onClick={() => onViewModeChange("grouped")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              viewMode === "grouped"
                ? "bg-[#FFF4ED] text-[#D94E15]"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Per Orang</span>
          </button>
        </div>
      </div>
    </div>
  );
}
