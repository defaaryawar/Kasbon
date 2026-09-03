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
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 p-4 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200/90 dark:border-zinc-800 shadow-sm">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Cari nama orang..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-[#D94E15] transition-colors"
        />
      </div>

      {/* Select Controls & View Switcher */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
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
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
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
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
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
        <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => onViewModeChange("list")}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              viewMode === "list"
                ? "bg-white dark:bg-[#181818] text-[#D94E15] shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Semua</span>
          </button>
          <button
            onClick={() => onViewModeChange("grouped")}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              viewMode === "grouped"
                ? "bg-white dark:bg-[#181818] text-[#D94E15] shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
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
